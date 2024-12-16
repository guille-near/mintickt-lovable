import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WalletContextProvider } from "./contexts/WalletContextProvider";
import { AuthProvider } from "./contexts/AuthProvider";
import { ThemeProvider } from "./contexts/ThemeProvider";
import Index from "./pages/Index";
import DiscoverEvents from "./pages/DiscoverEvents";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import { useAuth } from "./contexts/AuthProvider";

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth();

  console.log("PrivateRoute render - isLoading:", isLoading, "session:", session?.user?.email);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    console.log("No session found, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }

  return children;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth();

  console.log("AuthRoute render - isLoading:", isLoading, "session:", session?.user?.email);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (session) {
    console.log("Session found, redirecting to /discover");
    return <Navigate to="/discover" replace />;
  }

  return children;
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
    <Route path="/event/:id" element={<EventDetails />} />
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
          <ThemeProvider>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <AppRoutes />
            </AuthProvider>
          </ThemeProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </WalletContextProvider>
  </BrowserRouter>
);

export default App;