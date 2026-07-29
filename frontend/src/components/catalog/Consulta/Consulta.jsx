import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../../contexts/CartContext'
import { api } from '../../../services/api'
import styles from './Consulta.module.css'

const PHONE = '5493795595375'
const PHONE_REGEX = /^[0-9]{8,15}$/

function Consulta({ onClose }) {
  const navigate = useNavigate()
  const { items, addItem, decrementItem, removeItem, clearItems, totalCount } = useCart()
  const [sending, setSending] = useState(false)
  const [telefono, setTelefono] = useState('')
  const [error, setError] = useState(null)

  const totalQty = totalCount()
  const totalPrecio = useMemo(() =>
    items.reduce((sum, p) => sum + (p.precio != null ? p.precio * p.cantidad : 0), 0),
    [items]
  )

  const sendWhatsApp = async () => {
    if (!items.length || sending) return

    if (telefono.trim() && !PHONE_REGEX.test(telefono.trim())) {
      setError('El número debe tener entre 8 y 15 dígitos')
      setTimeout(() => setError(null), 4000)
      return
    }

    setSending(true)
    setError(null)

    try {
      await api.consultas.crear({
        clienteNombre: 'Cliente',
        clienteTelefono: telefono.trim(),
        productos: items.map(p => ({ productoId: p.id, cantidad: p.cantidad })),
      })
    } catch (e) {
      setError(e.message || 'Error al guardar la consulta')
      setTimeout(() => setError(null), 4000)
      setSending(false)
      return
    }

    const productLines = items.map((p, i) => {
      const qty = p.cantidad > 1 ? ` x${p.cantidad}` : ''
      const price = p.precio != null ? ` — $${p.precio * p.cantidad}` : ''
      return `${i + 1}. ${p.nombre}${qty}${price}`
    })

    const totalLine = totalPrecio > 0 ? `\n💰 *Total estimado: $${totalPrecio}*` : ''
    const phoneLine = telefono.trim() ? `\n👤 Cliente: ${telefono.trim()}` : ''

    const msg = `🛒 *Consulta SrPipa*${phoneLine}\n\n📋 *Productos:*\n${productLines.join('\n')}${totalLine}\n\n📱 Responderé a la brevedad.`
    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`, '_blank')
    clearItems()
    setSending(false)

    const lastSection = localStorage.getItem('srpipa_lastSection')
    navigate(lastSection ? `/seccion/${lastSection}` : '/')
  }

  return (
    <div className={styles.page}>
      <div className={styles.infoBox}>
        <div className={styles.infoIcon}>💬</div>
        <p className={styles.infoText}>
          Seleccioná los productos que te interesan y envianos la consulta por WhatsApp.
          Un vendedor te responderá con disponibilidad y precio final.
        </p>
      </div>

      {error && (
        <div className={styles.errorBanner}>{error}</div>
      )}

      <div className={styles.card}>
        <div className={styles.header}>
          <h3>Mi consulta</h3>
          {onClose && (
            <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">×</button>
          )}
        </div>

        <div className={styles.items}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <p>No hay productos en tu consulta</p>
              <p className={styles.hint}>Agregá productos desde el catálogo</p>
              <button className={styles.backBtn} onClick={() => navigate(-1)}>
                Volver al catálogo
              </button>
            </div>
          ) : (
            items.map((p, i) => (
              <div key={p.id} className={styles.item}>
                <span className={styles.itemNum}>{i + 1}</span>
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{p.nombre}</span>
                  <div className={styles.itemMeta}>
                    {p.precio != null && (
                      <span className={styles.itemPrice}>${p.precio * p.cantidad}</span>
                    )}
                    {p.cantidad > 1 && (
                      <span className={styles.itemUnitPrice}>(${p.precio} c/u)</span>
                    )}
                  </div>
                </div>
                <div className={styles.qtyGroup}>
                  <button className={styles.qtyBtn} onClick={() => decrementItem(p.id)} aria-label="Reducir cantidad">−</button>
                  <span className={styles.qtyValue}>{p.cantidad}</span>
                  <button className={styles.qtyBtn} onClick={() => addItem(p)} aria-label="Aumentar cantidad">+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.summary}>
              <span>{totalQty} producto{totalQty !== 1 ? 's' : ''} ({items.length} distinto{items.length !== 1 ? 's' : ''})</span>
              <button className={styles.clearBtn} onClick={clearItems} aria-label="Limpiar carrito">Limpiar</button>
            </div>

            <div className={styles.phoneField}>
              <label className={styles.phoneLabel}>Tu número de celular</label>
              <input
                type="tel"
                className={styles.phoneInput}
                placeholder="Opcional — para contacto rápido"
                value={telefono}
                maxLength={20}
                onChange={(e) => setTelefono(e.target.value.replace(/[^0-9]/g, ''))}
              />
            </div>

            {totalPrecio > 0 && (
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total estimado</span>
                <span className={styles.totalValue}>${totalPrecio}</span>
              </div>
            )}
            <button className={styles.sendBtn} onClick={sendWhatsApp} disabled={sending}>
              {sending ? 'Enviando...' : 'Consultar por WhatsApp'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Consulta
