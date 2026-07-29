import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

function CatalogoPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.publico.secciones().then(data => {
      if (data.length > 0) {
        navigate(`/${data[0].slug}`, { replace: true })
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [navigate])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f0f', color: '#e0e0e0' }}>
        <p>Cargando...</p>
      </div>
    )
  }

  return null
}

export default CatalogoPage
