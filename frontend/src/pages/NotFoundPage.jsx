import { useNavigate } from 'react-router-dom'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>Página no encontrada</p>
      <button className={styles.btn} onClick={() => navigate('/')}>Volver al inicio</button>
    </div>
  )
}
