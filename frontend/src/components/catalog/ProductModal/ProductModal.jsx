import { useState, useEffect } from 'react'
import styles from './ProductModal.module.css'

function ProductModal({ product, onClose }) {
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!product) return null

  const hasImage = product.imagen && !imgError

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
          ✕
        </button>

        <div className={styles.imageArea}>
          {hasImage ? (
            <img
              className={styles.modalImage}
              src={product.imagen}
              alt={product.nombre}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="placeholder-image" style={{ aspectRatio: '4/3' }}>
              IMG
            </div>
          )}
        </div>

        <div className={styles.details}>
          <h2 className={styles.nombre}>{product.nombre}</h2>
          <p className={styles.precio}>${product.precio}</p>
        </div>
      </div>
    </div>
  )
}

export default ProductModal
