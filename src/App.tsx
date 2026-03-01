import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { PetsProvider, usePets } from "@/hooks/usePets";
import { CarameloLoadingScreen } from "@/components/CarameloLoadingScreen";
import Auth from "./pages/Auth";
import OnboardingNew from "./pages/OnboardingNew";
import Home from "./pages/Home";
import Treinos from "./pages/Treinos";
import TreinoDetail from "./pages/TreinoDetail";
import Saude from "./pages/Saude";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, loading: authLoading } = useAuth();
  const { currentPet, loading: petLoading } = usePets();

  if (authLoading || petLoading) {
    return <CarameloLoadingScreen />;
  }

  if (!user) return <Auth />;
  if (!currentPet) return <OnboardingNew />;

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
          <PetsProvider>
            <AppRoutes />
          </PetsProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
