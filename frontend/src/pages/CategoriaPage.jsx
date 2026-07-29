import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import Header from '../components/catalog/Header/Header'
import ProductGrid from '../components/catalog/ProductGrid/ProductGrid'
import CategoryCarousel from '../components/catalog/CategoryCarousel/CategoryCarousel'

const CATEGORY_COLORS = {
  Bebidas: '#2563eb',
  Snacks: '#f59e0b',
  Lácteos: '#22c55e',
  Lacteos: '#22c55e',
  Panadería: '#ef4444',
  Panaderia: '#ef4444',
  Limpieza: '#8b5cf6',
  Higiene: '#ec4899',
  Carnes: '#f97316',
  Frutas: '#14b8a6',
  Golosinas: '#e11d48',
  Verduras: '#16a34a',
}

function CategoriaPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const isReload = performance.getEntriesByType('navigation')[0]?.type === 'reload'
    if (isReload) {
      navigate('/categoria/1', { replace: true })
    }
  }, [])

  useEffect(() => {
    api.publico.categoriasPublicas()
      .then(data => {
        const withColors = data.map((c, i) => ({
          ...c,
          color: c.color || CATEGORY_COLORS[c.nombre] || `hsl(${(i * 47) % 360}, 65%, 45%)`,
        }))
        setCategorias(withColors)
      })
      .catch(() => setCategorias([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="catalogo-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Cargando...</p>
      </div>
    )
  }

  if (categorias.length === 0) {
    navigate('/admin')
    return null
  }

  const categoria = categorias.find(c => c.id === Number(id)) || categorias[0]

  if (!categoria) {
    return null
  }

  return (
    <div
      className="catalogo-page"
      style={{
        minHeight: '100vh',
        background: `linear-gradient(180deg, ${categoria.color}30 0%, ${categoria.color}15 50%, ${categoria.color}05 100%)`,
      }}
    >
      <Header onSearch={setSearchTerm} />
      <ProductGrid categoriaId={categoria.id} searchTerm={searchTerm} />
      <CategoryCarousel
        categorias={categorias}
        categoriaActiva={categoria}
      />
    </div>
  )
}

export default CategoriaPage
