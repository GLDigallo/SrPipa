import { useState, useEffect } from 'react'
import { api } from '../services/api'
import styles from './AdminSistemaPage.module.css'

function AdminSistemaPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const res = await api.sistema.estado()
      setData(res)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  if (loading) {
    return <div className={styles.loading}>Cargando...</div>
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Sistema</h2>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Catálogo</h3>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{data?.totalProductos ?? 0}</span>
            <span className={styles.statLabel}>Total productos</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{data?.productosDisponibles ?? 0}</span>
            <span className={styles.statLabel}>Disponibles</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{data?.productosSinStock ?? 0}</span>
            <span className={styles.statLabel}>Sin stock</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{data?.productosOcultos ?? 0}</span>
            <span className={styles.statLabel}>Ocultos</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Organización</h3>
        <div className={styles.healthList}>
          <div className={styles.healthItem}>
            <span className={styles.healthLabel}>Categorías</span>
            <span className={styles.healthValue}>{data?.totalCategorias ?? 0}</span>
          </div>
          <div className={styles.healthItem}>
            <span className={styles.healthLabel}>Secciones del carrusel</span>
            <span className={styles.healthValue}>{data?.totalSecciones ?? 0}</span>
          </div>
          <div className={styles.healthItem}>
            <span className={styles.healthLabel}>Sin imagen</span>
            <span className={`${styles.healthValue} ${(data?.productosSinImagen ?? 0) > 0 ? styles.warn : ''}`}>
              {data?.productosSinImagen ?? 0}
            </span>
          </div>
        </div>
      </div>

      {data?.productosRecientes?.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Actividad reciente</h3>
          <div className={styles.activityList}>
            {data.productosRecientes.map((p) => (
              <div key={p.id} className={styles.activityItem}>
                <div className={styles.activityInfo}>
                  <span className={styles.activityName}>{p.nombre}</span>
                  <span className={styles.activityMeta}>
                    {p.categoria} · Stock: {p.stock}
                  </span>
                </div>
                <span className={styles.activityDate}>
                  {new Date(p.fechaActualizacion).toLocaleDateString('es-UY')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminSistemaPage
