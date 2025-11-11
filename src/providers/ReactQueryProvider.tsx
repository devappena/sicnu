import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Configuration du client React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
        // Ne pas retry sur les erreurs 404
        if ((error as any)?.status === 404) return false;
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

export const ReactQueryProvider: React.FC<ReactQueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools désactivés pour une interface plus propre */}
    </QueryClientProvider>
  );
};
