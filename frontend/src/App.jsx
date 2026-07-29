import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/admin/ProtectedRoute'
import AdminLayout from './components/admin/AdminLayout'
import CatalogoPage from './pages/CatalogoPage'
import SeccionPage from './pages/SeccionPage'
import CartPage from './pages/CartPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminProductosPage from './pages/AdminProductosPage'
import AdminCarruselPage from './pages/AdminCarruselPage'
import AdminSistemaPage from './pages/AdminSistemaPage'
import AdminConsultasPage from './pages/AdminConsultasPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <CartProvider>
          <Routes>
            <Route path="/" element={<CatalogoPage />} />
            <Route path="/seccion/:id" element={<SeccionPage />} />
            <Route path="/categoria/:id" element={<SeccionPage />} />
            <Route path="/consulta" element={<CartPage />} />
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/admin/productos" element={<ProtectedRoute><AdminLayout><AdminProductosPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/carrusel" element={<ProtectedRoute><AdminLayout><AdminCarruselPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/sistema" element={<ProtectedRoute><AdminLayout><AdminSistemaPage /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/consultas" element={<ProtectedRoute><AdminLayout><AdminConsultasPage /></AdminLayout></ProtectedRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </CartProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App
