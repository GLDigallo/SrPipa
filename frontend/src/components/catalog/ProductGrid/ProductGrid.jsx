import { useState, useEffect } from 'react'
import styles from './ProductGrid.module.css'
import ProductCard from '../ProductCard/ProductCard'
import ProductModal from '../ProductModal/ProductModal'
import { api } from '../../../services/api'

function ProductGrid({ seccionId, searchTerm = '' }) {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    let cancelled = false

    const fetchProductos = async () => {
      setLoading(true)
      try {
        if (searchTerm && searchTerm.trim().length >= 2) {
          const data = await api.publico.buscarProductos(searchTerm)
          if (!cancelled) setProductos(data)
        } else if (seccionId) {
          const data = await api.publico.productosPorSeccion(seccionId)
          if (!cancelled) setProductos(data)
        } else {
          if (!cancelled) setProductos([])
        }
      } catch {
        if (!cancelled) setProductos([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchProductos()
    return () => { cancelled = true }
  }, [seccionId, searchTerm])

  if (loading) {
    return (
      <div className={styles.grid}>
        <p className={styles.loading}>Cargando productos...</p>
      </div>
    )
  }

  if (productos.length === 0) {
    return (
      <div className={styles.grid}>
        <p className={styles.loading}>
          {searchTerm ? 'No se encontraron productos' : 'No hay productos en esta sección'}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className={styles.grid}>
        {productos.map(producto => (
          <ProductCard
            key={producto.id}
            product={producto}
            onClick={() => setSelectedProduct(producto)}
          />
        ))}
      </div>
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  )
}

export default ProductGrid
