import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WalletContextProvider } from "./contexts/WalletContextProvider";
import { AuthProvider } from "./contexts/AuthProvider";
import Index from "./pages/Index";
import DiscoverEvents from "./pages/DiscoverEvents";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import { useAuth } from "./contexts/AuthProvider";

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  return session ? children : <Navigate to="/auth" />;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  return !session ? children : <Navigate to="/discover" />;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route
      path="/auth"
      element={
        <AuthRoute>
          <Auth />
        </AuthRoute>
      }
    />
    <Route
      path="/discover"
      element={
        <PrivateRoute>
          <DiscoverEvents />
        </PrivateRoute>
      }
    />
    <Route
      path="/event/:id"
      element={
        <PrivateRoute>
          <EventDetails />
        </PrivateRoute>
      }
    />
    <Route
      path="/create"
      element={
        <PrivateRoute>
          <CreateEvent />
        </PrivateRoute>
      }
    />
    <Route
      path="/account"
      element={
        <PrivateRoute>
          <Account />
        </PrivateRoute>
      }
    />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <WalletContextProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </WalletContextProvider>
  </BrowserRouter>
);

export default App;