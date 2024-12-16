import { BrowserRouter as Router } from "react-router-dom";
import { WalletContextProvider } from "@/contexts/WalletContextProvider";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppRoutes from "./AppRoutes";

function App() {
  return (
    <WalletContextProvider>
      <Router>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppRoutes />
          </div>
          <Toaster />
        </SidebarProvider>
      </Router>
    </WalletContextProvider>
  );
}

export default App;