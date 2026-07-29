import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function CatalogoPage() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/seccion/1', { replace: true })
  }, [navigate])

  return null
}

export default CatalogoPage
