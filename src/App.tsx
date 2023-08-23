import { useMemo } from 'react'
import './App.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { WalletKitProvider } from '@mysten/wallet-kit'

import { generateLinks } from '@/Constants'
import { Page } from '@/Components'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // We default the stale time to 5 minutes, which is an arbitrary number selected to
      // strike the balance between stale data and cache hits.
      // Individual queries can override this value based on their caching needs.
      staleTime: 10 * 60 * 1000,
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onError: (err) => console.log(err),
    },
    mutations: {
      onError: (error) => console.log(error),
    },
  },
})

const App = () => {
  const links = useMemo(() => generateLinks(), [])

  return (
    <QueryClientProvider client={queryClient}>
      <WalletKitProvider>
        <BrowserRouter>
          <Page>
            <Routes>
              {links.map((link) => {
                return <Route {...link} />
              })}
            </Routes>
          </Page>
        </BrowserRouter>
        <ReactQueryDevtools />
      </WalletKitProvider>
    </QueryClientProvider>
  )
}

export default App
