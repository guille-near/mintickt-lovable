import './utils/polyfills';  // Import polyfills first
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './contexts/ThemeProvider';
import { WalletContextProvider } from './contexts/WalletContextProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthProvider';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from './components/ui/sonner';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <WalletContextProvider>
            <App />
            <Toaster />
            <SonnerToaster />
          </WalletContextProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);