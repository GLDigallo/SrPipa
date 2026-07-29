import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import Header from '../components/catalog/Header/Header'
import ProductGrid from '../components/catalog/ProductGrid/ProductGrid'
import SeccionCarousel from '../components/catalog/SeccionCarousel/SeccionCarousel'
import './SeccionPage.css'

function SeccionPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [secciones, setSecciones] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.publico.secciones()
      .then(data => setSecciones(data))
      .catch(() => setSecciones([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!loading && secciones.length > 0) {
      const seccion = secciones.find(s => s.id === Number(id))
      if (!seccion) {
        navigate(`/seccion/${secciones[0].id}`, { replace: true })
      }
    }
  }, [id, secciones, loading, navigate])

  useEffect(() => {
    const seccion = secciones.find(s => s.id === Number(id))
    if (seccion) {
      localStorage.setItem('srpipa_lastSection', seccion.id)
    }
  }, [id, secciones])

  if (loading) {
    return (
      <div className="catalogo-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Cargando...</p>
      </div>
    )
  }

  if (secciones.length === 0) {
    return (
      <div className="catalogo-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>No hay secciones disponibles</p>
      </div>
    )
  }

  const seccion = secciones.find(s => s.id === Number(id)) || secciones[0]
  if (!seccion) return null

  const hasImage = !!seccion.imagen

  return (
    <div className={`seccion-page ${hasImage ? 'has-image' : ''}`}>
      {hasImage && (
        <div className="seccion-bg">
          <img src={seccion.imagen} alt="" />
          <div className="seccion-bg-overlay" />
        </div>
      )}

      <div className="seccion-content">
        <Header onSearch={setSearchTerm} />
        <ProductGrid seccionId={seccion.id} searchTerm={searchTerm} />
      </div>

      <SeccionCarousel
        secciones={secciones}
        seccionActiva={seccion}
      />
    </div>
  )
}

export default SeccionPage
