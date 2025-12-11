// src/main.jsx (or index.jsx)
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles.css';
import { ErrorBoundary } from 'react-error-boundary';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './api/QueryClient.jsx';
import { QueryClientProvider } from '@tanstack/react-query';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary
      fallback={<div>Something went wrong!</div>}
      onError={console.error}
    >
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>

        {/* Devtools MUST be inside QueryClientProvider */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
