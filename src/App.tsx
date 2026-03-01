import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { PetProvider, usePet } from "@/hooks/usePet";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import Treinos from "./pages/Treinos";
import TreinoDetail from "./pages/TreinoDetail";
import Saude from "./pages/Saude";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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

  if (!user) return <Auth />;
  if (!hasPet) return <Onboarding />;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/treinos" element={<Treinos />} />
      <Route path="/treino/:id" element={<TreinoDetail />} />
      <Route path="/saude" element={<Saude />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <PetProvider>
            <AppRoutes />
          </PetProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
