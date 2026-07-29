import { useState } from 'react'
import { useCart } from '../../../contexts/CartContext'
import styles from './ProductCard.module.css'

function ProductCard({ product, onClick }) {
  const [imgError, setImgError] = useState(false)
  const hasImage = product?.imagen && !imgError
  const { addItem, removeItem, getItemQty } = useCart()
  const inCart = getItemQty(product?.id) > 0

  const handleCartToggle = (e) => {
    e.stopPropagation()
    if (inCart) {
      removeItem(product.id)
    } else {
      addItem(product)
    }
  }

  return (
    <div
      className={styles.card}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick?.() }}
    >
      <div className={styles.imageContainer}>
        {hasImage ? (
          <img
            className={styles.image}
            src={product.imagen}
            alt={product.nombre}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="placeholder-image">IMG</div>
        )}
        {!inCart && (
          <button className={styles.addBtn} onClick={handleCartToggle}>+</button>
        )}
        {inCart && (
          <button className={styles.addedBadge} onClick={handleCartToggle}>✓</button>
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.nombre}>{product?.nombre || 'Producto'}</h3>
        {product?.precio != null && (
          <span className={styles.precio}>${product.precio}</span>
        )}
      </div>
    </div>
  )
}

export default ProductCard
