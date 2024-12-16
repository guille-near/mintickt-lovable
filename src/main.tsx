import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import { WalletContextProvider } from '@/contexts/WalletContextProvider';
import { AuthProvider } from '@/contexts/AuthProvider';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <WalletContextProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </WalletContextProvider>
    </ThemeProvider>
  </QueryClientProvider>
);