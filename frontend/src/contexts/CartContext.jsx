import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const CartContext = createContext()
const STORAGE_KEY = 'srpipa_cart'

function loadCart() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product) => {
    setItems(prev => {
      const existing = prev.find(p => p.id === product.id)
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, cantidad: p.cantidad + 1 } : p)
      }
      return [...prev, { id: product.id, nombre: product.nombre, precio: product.precio, imagen: product.imagen, cantidad: 1 }]
    })
  }, [])

  const decrementItem = useCallback((productId) => {
    setItems(prev => {
      const existing = prev.find(p => p.id === productId)
      if (!existing) return prev
      if (existing.cantidad <= 1) {
        return prev.filter(p => p.id !== productId)
      }
      return prev.map(p => p.id === productId ? { ...p, cantidad: p.cantidad - 1 } : p)
    })
  }, [])

  const removeItem = useCallback((productId) => {
    setItems(prev => prev.filter(p => p.id !== productId))
  }, [])

  const clearItems = useCallback(() => {
    setItems([])
  }, [])

  const getItemQty = useCallback((productId) => {
    const item = items.find(p => p.id === productId)
    return item ? item.cantidad : 0
  }, [items])

  const totalCount = useCallback(() => {
    return items.reduce((sum, p) => sum + p.cantidad, 0)
  }, [items])

  return (
    <CartContext.Provider value={{ items, addItem, decrementItem, removeItem, clearItems, getItemQty, totalCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
