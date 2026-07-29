import { useNavigate } from 'react-router-dom'
import Header from '../components/catalog/Header/Header'
import Consulta from '../components/catalog/Consulta/Consulta'

function ConsultaPage() {
  const navigate = useNavigate()

  const handleClose = () => {
    navigate('/')
  }

  return (
    <div className="catalogo-page">
      <Header simple />
      <Consulta onClose={handleClose} />
    </div>
  )
}

export default ConsultaPage
