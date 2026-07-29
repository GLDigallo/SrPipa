import { useState, useEffect } from 'react'
import { api } from '../services/api'
import styles from './AdminDashboardPage.module.css'

function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.dashboard.resumen()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className={styles.loading}>Cargando...</div>
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Resumen</h2>

      <div className={styles.stats}>
        <div className={`${styles.card} ${styles.total}`}>
          <span className={styles.cardValue}>{stats?.totalProductos ?? 0}</span>
          <span className={styles.cardLabel}>Total productos</span>
        </div>
        <div className={`${styles.card} ${styles.available}`}>
          <span className={styles.cardValue}>{stats?.productosDisponibles ?? 0}</span>
          <span className={styles.cardLabel}>Disponibles</span>
        </div>
        <div className={`${styles.card} ${styles.stock}`}>
          <span className={styles.cardValue}>{stats?.productosSinStock ?? 0}</span>
          <span className={styles.cardLabel}>Sin stock</span>
        </div>
        <div className={`${styles.card} ${styles.hidden}`}>
          <span className={styles.cardValue}>{stats?.productosOcultos ?? 0}</span>
          <span className={styles.cardLabel}>Ocultos</span>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
