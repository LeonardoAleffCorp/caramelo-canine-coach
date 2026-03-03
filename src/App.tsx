import { useState, useCallback } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { PetProvider, usePet } from "@/hooks/usePet";
import { SubscriptionProvider, useSubscription } from "@/hooks/useSubscription";
import SplashScreen from "@/components/SplashScreen";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Onboarding from "./pages/Onboarding";
import Plans from "./pages/Plans";
import Home from "./pages/Home";
import Treinos from "./pages/Treinos";
import TreinoDetail from "./pages/TreinoDetail";
import Saude from "./pages/Saude";
import Perfil from "./pages/Perfil";
import Avatar from "./pages/Avatar";
import CadastrarPet from "./pages/CadastrarPet";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function SubscriptionGate({ children }: { children: React.ReactNode }) {
  const { isActive, loading, daysLeft, isTrial } = useSubscription();

  if (loading) return null;

  if (!isActive) {
    return <Plans />;
  }

  return (
    <>
      {isTrial && daysLeft <= 1 && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-destructive/90 px-4 py-2 text-center text-xs font-bold text-destructive-foreground">
          ⏰ Seu teste grátis expira {daysLeft === 0 ? 'hoje' : 'amanhã'}!
        </div>
      )}
      {children}
    </>
  );
}

function AppRoutes() {
  const { user, loading: authLoading } = useAuth();
  const { hasPet, loading: petLoading } = usePet();

  if (authLoading || petLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-5xl animate-bounce-in">🐕</div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Auth />} />
      </Routes>
    );
  }

  if (!hasPet) return <Onboarding />;

  return (
    <SubscriptionGate>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/planos" element={<Plans />} />
        <Route path="/treinos" element={<Treinos />} />
        <Route path="/treino/:id" element={<TreinoDetail />} />
        <Route path="/saude" element={<Saude />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/avatar" element={<Avatar />} />
        <Route path="/cadastrar-pet" element={<CadastrarPet />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SubscriptionGate>
  );
}

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashFinish = useCallback(() => setShowSplash(false), []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
          <BrowserRouter>
            <AuthProvider>
              <PetProvider>
                <SubscriptionProvider>
                  <AppRoutes />
                </SubscriptionProvider>
              </PetProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
