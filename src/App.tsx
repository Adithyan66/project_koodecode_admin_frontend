import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AppRoutes from './routes/AppRoutes'
import LoadingSpinner from './components/LoadingSpinner'
import GlobalLoadingOverlay from './components/GlobalLoadingOverlay'

export default function App() {
  return (
    <>
    <Suspense fallback={<LoadingSpinner />}>
      <AppRoutes />
      <Outlet />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Suspense>
    <GlobalLoadingOverlay />
    </>
  )
}
