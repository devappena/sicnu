import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeContext'
import { reactQueryConfig } from '@/config/app.config'

// Configuration du QueryClient avec les variables d'environnement
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: reactQueryConfig.defaultStaleTime,
      gcTime: reactQueryConfig.defaultCacheTime, // Anciennement cacheTime
      retry: reactQueryConfig.retry,
      refetchOnWindowFocus: reactQueryConfig.refetchOnWindowFocus,
    },
    mutations: {
      retry: 0,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
      {reactQueryConfig.enableDevtools && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  </StrictMode>,
)
