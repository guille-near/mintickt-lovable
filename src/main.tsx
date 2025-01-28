import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WalletContextProvider } from './contexts/WalletContextProvider';
import { ThemeProvider } from './contexts/ThemeProvider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <WalletContextProvider>
        <App />
      </WalletContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);