import { QueryClient } from '@tanstack/react-query'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { isPermanentError } from '../lib/github'

const HOUR = 60 * 60 * 1000

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,
      gcTime: HOUR,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => !isPermanentError(error) && failureCount < 1,
    },
  },
})

function sessionStorageOrUndefined(): Storage | undefined {
  try {
    return window.sessionStorage
  } catch {
    return undefined
  }
}

export const persistOptions = {
  persister: createSyncStoragePersister({ storage: sessionStorageOrUndefined(), key: 'ghc:query-cache' }),
  maxAge: HOUR,
  buster: 'v1',
}
