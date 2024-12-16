import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthProvider";
import { WalletContextProvider } from "@/contexts/WalletContextProvider";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppRoutes from "./AppRoutes";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <WalletContextProvider>
          <AuthProvider>
            <Router>
              <SidebarProvider>
                <div className="flex min-h-screen w-full">
                  <AppRoutes />
                </div>
                <Toaster />
              </SidebarProvider>
            </Router>
          </AuthProvider>
        </WalletContextProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;