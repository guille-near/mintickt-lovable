import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletContextProvider } from "./contexts/WalletContextProvider";
import Index from "./pages/Index";
import DiscoverEvents from "./pages/DiscoverEvents";
import EventDetails from "./pages/EventDetails";

const queryClient = new QueryClient();

const App = () => (
  <WalletContextProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/discover" element={<DiscoverEvents />} />
            <Route path="/event/:id" element={<EventDetails />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </WalletContextProvider>
);

export default App;