import { lazy, Suspense } from 'react'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { BrowserRouter, Route, Routes } from 'react-router'
import { persistOptions, queryClient } from './queryClient'
import { Layout } from './Layout'
import { SettingsProvider } from '../features/settings/SettingsContext'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'

// Profile and compare pages pull in the charting library, so load them on demand.
const UserPage = lazy(() => import('../pages/UserPage').then((m) => ({ default: m.UserPage })))
const ComparePage = lazy(() => import('../pages/ComparePage').then((m) => ({ default: m.ComparePage })))

export function App() {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
      <BrowserRouter>
        <SettingsProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route
                path="user/:login"
                element={
                  <Suspense fallback={null}>
                    <UserPage />
                  </Suspense>
                }
              />
              <Route
                path="compare/:a?/:b?"
                element={
                  <Suspense fallback={null}>
                    <ComparePage />
                  </Suspense>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </SettingsProvider>
      </BrowserRouter>
    </PersistQueryClientProvider>
  )
}
