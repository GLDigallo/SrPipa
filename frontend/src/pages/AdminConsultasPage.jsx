import { useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'
import styles from './AdminConsultasPage.module.css'

function AdminConsultasPage() {
  const [consultas, setConsultas] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [cantidades, setCantidades] = useState({})
  const [saving, setSaving] = useState(null)
  const [error, setError] = useState(null)

  const [busqueda, setBusqueda] = useState('')
  const [clientesEncontrados, setClientesEncontrados] = useState([])
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [ranking, setRanking] = useState([])
  const [buscandoCliente, setBuscandoCliente] = useState(false)

  const cargar = useCallback(async (clienteId) => {
    try {
      const data = clienteId
        ? await api.consultas.listarPorCliente(clienteId)
        : await api.consultas.listar()
      setConsultas(data)
    } catch {
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { cargar() }, [cargar])

  useEffect(() => {
    if (!busqueda.trim()) {
      setClientesEncontrados([])
      return
    }
    const timer = setTimeout(async () => {
      setBuscandoCliente(true)
      try {
        const data = await api.clientes.buscar(busqueda.trim())
        setClientesEncontrados(data)
      } catch {
        setClientesEncontrados([])
      } finally {
        setBuscandoCliente(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [busqueda])

  const seleccionarCliente = async (cliente) => {
    setClienteSeleccionado(cliente)
    setBusqueda('')
    setClientesEncontrados([])
    setLoading(true)
    try {
      const [rankingData, consultasData] = await Promise.all([
        api.clientes.ranking(cliente.id, 5),
        api.consultas.listarPorCliente(cliente.id)
      ])
      setRanking(rankingData)
      setConsultas(consultasData)
    } catch {
      setRanking([])
    } finally {
      setLoading(false)
    }
  }

  const cerrarCliente = () => {
    setClienteSeleccionado(null)
    setRanking([])
    setConsultas([])
    setLoading(true)
    cargar()
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleCantidad = (key, value) => {
    const num = Math.max(1, Number(value))
    setCantidades(prev => ({ ...prev, [key]: num }))
  }

  const confirmarProducto = async (productoConsultaId, solicitada) => {
    const key = `pc_${productoConsultaId}`
    const cantidad = cantidades[key] ?? solicitada
    setError(null)
    setSaving(`confirm_${productoConsultaId}`)
    try {
      await api.consultas.confirmarProducto(productoConsultaId, cantidad)
      await cargar(clienteSeleccionado?.id)
      setCantidades(prev => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    } catch (e) {
      setError(e.message || 'Error al confirmar producto')
      setTimeout(() => setError(null), 4000)
    } finally {
      setSaving(null)
    }
  }

  const denegarProducto = async (productoConsultaId) => {
    setError(null)
    setSaving(`deny_${productoConsultaId}`)
    try {
      await api.consultas.denegarProducto(productoConsultaId)
      await cargar(clienteSeleccionado?.id)
    } catch (e) {
      setError(e.message || 'Error al denegar producto')
      setTimeout(() => setError(null), 4000)
    } finally {
      setSaving(null)
    }
  }

  const confirmarConsulta = async (id) => {
    setError(null)
    setSaving(`finalizar_${id}`)
    try {
      await api.consultas.confirmarConsulta(id)
      await cargar(clienteSeleccionado?.id)
    } catch (e) {
      setError(e.message || 'Error al finalizar consulta')
      setTimeout(() => setError(null), 4000)
    } finally {
      setSaving(null)
    }
  }

  const cancelarConsulta = async (id) => {
    setError(null)
    setSaving(`cancelar_${id}`)
    try {
      await api.consultas.cancelarConsulta(id)
      await cargar(clienteSeleccionado?.id)
    } catch (e) {
      setError(e.message || 'Error al cancelar consulta')
      setTimeout(() => setError(null), 4000)
    } finally {
      setSaving(null)
    }
  }

  if (loading) return <div className={styles.loading}>Cargando...</div>

  const pendientes = consultas.filter(c => c.estado === 'PENDIENTE')
  const confirmadas = consultas.filter(c => c.estado === 'CONFIRMADA')
  const canceladas = consultas.filter(c => c.estado === 'CANCELADA')

  return (
    <div className={styles.page}>
      <div className={styles.searchSection}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder={clienteSeleccionado ? `${clienteSeleccionado.nombre || clienteSeleccionado.telefono} — buscar otro cliente...` : "Buscar cliente por teléfono o nombre..."}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          {buscandoCliente && <span className={styles.searchSpinner}>...</span>}
        </div>
        {clientesEncontrados.length > 0 && (
          <div className={styles.searchResults}>
            {clientesEncontrados.map(c => (
              <button
                key={c.id}
                className={styles.searchResultItem}
                onClick={() => seleccionarCliente(c)}
              >
                <span className={styles.resultPhone}>{c.telefono}</span>
                {c.nombre && <span className={styles.resultName}>{c.nombre}</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      {clienteSeleccionado ? (
        <ClientePanel
          cliente={clienteSeleccionado}
          consultas={consultas}
          ranking={ranking}
          onCerrar={cerrarCliente}
          expandedId={expandedId}
          onToggle={toggleExpand}
          cantidades={cantidades}
          onCantidad={handleCantidad}
          onConfirmarProducto={confirmarProducto}
          onDenegarProducto={denegarProducto}
          onFinalizar={confirmarConsulta}
          onCancelar={cancelarConsulta}
          saving={saving}
        />
      ) : (
        <>
          <h2 className={styles.title}>Consultas</h2>
          <p className={styles.subtitle}>
            Confirmá, denegá o ajustá cantidades según lo que el cliente necesita.
          </p>

          {pendientes.length === 0 && confirmadas.length === 0 && canceladas.length === 0 && (
            <div className={styles.empty}>
              <p>No hay consultas todavía</p>
              <p className={styles.hint}>Las consultas aparecen cuando un cliente envía productos por WhatsApp</p>
            </div>
          )}

          {pendientes.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Pendientes ({pendientes.length})</div>
              <div className={styles.list}>
                {pendientes.map(c => (
                  <ConsultaCard
                    key={c.id}
                    consulta={c}
                    expanded={expandedId === c.id}
                    onToggle={() => toggleExpand(c.id)}
                    cantidades={cantidades}
                    onCantidad={handleCantidad}
                    onConfirmarProducto={confirmarProducto}
                    onDenegarProducto={denegarProducto}
                    onFinalizar={() => confirmarConsulta(c.id)}
                    onCancelar={() => cancelarConsulta(c.id)}
                    saving={saving}
                  />
                ))}
              </div>
            </div>
          )}

          {confirmadas.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Finalizadas ({confirmadas.length})</div>
              <div className={styles.list}>
                {confirmadas.map(c => (
                  <ConsultaCard
                    key={c.id}
                    consulta={c}
                    expanded={expandedId === c.id}
                    onToggle={() => toggleExpand(c.id)}
                    cantidades={cantidades}
                    onCantidad={handleCantidad}
                    onConfirmarProducto={confirmarProducto}
                    onDenegarProducto={denegarProducto}
                    onFinalizar={() => confirmarConsulta(c.id)}
                    onCancelar={() => cancelarConsulta(c.id)}
                    saving={saving}
                  />
                ))}
              </div>
            </div>
          )}

          {canceladas.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Canceladas ({canceladas.length})</div>
              <div className={styles.list}>
                {canceladas.map(c => (
                  <ConsultaCard
                    key={c.id}
                    consulta={c}
                    expanded={expandedId === c.id}
                    onToggle={() => toggleExpand(c.id)}
                    cantidades={cantidades}
                    onCantidad={handleCantidad}
                    onConfirmarProducto={confirmarProducto}
                    onDenegarProducto={denegarProducto}
                    onFinalizar={() => confirmarConsulta(c.id)}
                    onCancelar={() => cancelarConsulta(c.id)}
                    saving={saving}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function ClientePanel({ cliente, consultas, ranking, onCerrar, expandedId, onToggle, cantidades, onCantidad, onConfirmarProducto, onDenegarProducto, onFinalizar, onCancelar, saving }) {
  const totalConsultas = consultas.length
  const totalConfirmadas = consultas.filter(c => c.estado === 'CONFIRMADA').length
  const totalCanceladas = consultas.filter(c => c.estado === 'CANCELADA').length
  const totalPendientes = consultas.filter(c => c.estado === 'PENDIENTE').length
  const totalUnidades = consultas.reduce((sum, c) => sum + c.totalProductos, 0)

  return (
    <div className={styles.clientePanel}>
      <div className={styles.clienteHeader}>
        <div>
          <h2 className={styles.clienteNombre}>{cliente.nombre || 'Sin nombre'}</h2>
          <span className={styles.clienteTelefono}>{cliente.telefono}</span>
        </div>
        <button className={styles.clienteClose} onClick={onCerrar}>✕ Cerrar</button>
      </div>

      <div className={styles.clienteStats}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{totalConsultas}</span>
          <span className={styles.statLabel}>Consultas</span>
        </div>
        <div className={styles.statItem}>
          <span className={`${styles.statValue} ${styles.statPendiente}`}>{totalPendientes}</span>
          <span className={styles.statLabel}>Pendientes</span>
        </div>
        <div className={styles.statItem}>
          <span className={`${styles.statValue} ${styles.statConfirmadas}`}>{totalConfirmadas}</span>
          <span className={styles.statLabel}>Confirmadas</span>
        </div>
        <div className={styles.statItem}>
          <span className={`${styles.statValue} ${styles.statCanceladas}`}>{totalCanceladas}</span>
          <span className={styles.statLabel}>Canceladas</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{totalUnidades}</span>
          <span className={styles.statLabel}>Unidades</span>
        </div>
      </div>

      {ranking.length > 0 && (
        <div className={styles.rankingSection}>
          <h3 className={styles.rankingTitle}>Productos más comprados</h3>
          <div className={styles.rankingList}>
            {ranking.map((item, i) => (
              <div key={item.productoId} className={styles.rankingItem}>
                <span className={styles.rankingPos}>#{i + 1}</span>
                <span className={styles.rankingProductName}>{item.productoNombre}</span>
                <div className={styles.rankingStats}>
                  <span className={styles.rankingQty}>{item.unidadesConfirmadas} u.</span>
                  <span className={styles.rankingTimes}>{item.vecesConfirmado}x pedido</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {consultas.length > 0 && (
        <div className={styles.historialSection}>
          <h3 className={styles.historialTitle}>Historial de consultas</h3>
          <div className={styles.historialList}>
            {consultas.map(c => (
              <ConsultaCard
                key={c.id}
                consulta={c}
                expanded={expandedId === c.id}
                onToggle={() => onToggle(c.id)}
                cantidades={cantidades}
                onCantidad={onCantidad}
                onConfirmarProducto={onConfirmarProducto}
                onDenegarProducto={onDenegarProducto}
                onFinalizar={() => onFinalizar(c.id)}
                onCancelar={() => onCancelar(c.id)}
                saving={saving}
              />
            ))}
          </div>
        </div>
      )}

      {consultas.length === 0 && (
        <div className={styles.empty}>Sin consultas registradas</div>
      )}
    </div>
  )
}

function ConsultaCard({ consulta, expanded, onToggle, cantidades, onCantidad, onConfirmarProducto, onDenegarProducto, onFinalizar, onCancelar, saving }) {
  const date = new Date(consulta.fechaCreacion).toLocaleString('es-UY', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })

  const estadoClass = consulta.estado === 'PENDIENTE' ? styles.estadoPendiente
    : consulta.estado === 'CONFIRMADA' ? styles.estadoConfirmada
    : styles.estadoCancelada

  const total = consulta.productos.length
  const resueltos = consulta.productosConfirmados + consulta.productosDenegados
  const pendientesCount = total - resueltos

  return (
    <div className={`${styles.card} ${consulta.estado !== 'PENDIENTE' ? styles.cardDone : ''}`}>
      <div className={styles.cardHeader} onClick={onToggle}>
        <div className={styles.cardInfo}>
          <div className={styles.cardMeta}>
            <span className={styles.cardDate}>{date}</span>
          </div>
        </div>
        <div className={styles.cardRight}>
          <span className={styles.qtyBadge}>{consulta.totalProductos} u.</span>
          {consulta.estado === 'PENDIENTE' && (
            <span className={`${styles.progress} ${pendientesCount === 0 ? styles.progressDone : ''}`}>
              {resueltos}/{total}
            </span>
          )}
          <span className={`${styles.estado} ${estadoClass}`}>{consulta.estado}</span>
          <span className={styles.arrow}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div className={styles.cardBody}>
          <div className={styles.productList}>
            {consulta.productos.map((p) => (
              <div key={p.productoConsultaId || p.productoId} className={`${styles.productRow} ${p.confirmada ? styles.productConfirmed : ''} ${p.denegada ? styles.productDenied : ''}`}>
                <div className={styles.productInfo}>
                  <span className={styles.productName}>{p.productoNombre}</span>
                  <div className={styles.productMeta}>
                    <span className={styles.stockInfo}>Stock: {p.stockActual}</span>
                    {p.confirmada && <span className={styles.vendido}>Vendidos: {p.cantidadVendida}</span>}
                    {p.denegada && <span className={styles.denegado}>Rechazado</span>}
                  </div>
                </div>

                {consulta.estado !== 'CANCELADA' && !p.confirmada && !p.denegada && (
                  <div className={styles.productActions}>
                    <div className={styles.qtyControls}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => {
                          const key = `pc_${p.productoConsultaId}`
                          const actual = cantidades[key] ?? p.cantidadSolicitada
                          if (actual > 1) onCantidad(key, actual - 1)
                        }}
                      >−</button>
                      <input
                        type="number"
                        className={styles.qtyInput}
                        min="1"
                        max={p.stockActual}
                        value={cantidades[`pc_${p.productoConsultaId}`] ?? p.cantidadSolicitada}
                        onChange={(e) => onCantidad(`pc_${p.productoConsultaId}`, e.target.value)}
                      />
                      <button
                        className={styles.qtyBtn}
                        onClick={() => {
                          const key = `pc_${p.productoConsultaId}`
                          const actual = cantidades[key] ?? p.cantidadSolicitada
                          if (actual < p.stockActual) onCantidad(key, actual + 1)
                        }}
                      >+</button>
                    </div>
                    <button
                      className={styles.confirmBtn}
                      onClick={() => onConfirmarProducto(p.productoConsultaId, p.cantidadSolicitada)}
                      disabled={saving === `confirm_${p.productoConsultaId}`}
                    >
                      {saving === `confirm_${p.productoConsultaId}` ? '...' : '✓'}
                    </button>
                    <button
                      className={styles.denyBtn}
                      onClick={() => onDenegarProducto(p.productoConsultaId)}
                      disabled={saving === `deny_${p.productoConsultaId}`}
                    >
                      {saving === `deny_${p.productoConsultaId}` ? '...' : '✕'}
                    </button>
                  </div>
                )}

                {p.confirmada && <span className={styles.checkIcon}>✓</span>}
                {p.denegada && <span className={styles.denyIcon}>✕</span>}
              </div>
            ))}
          </div>

          {consulta.estado === 'PENDIENTE' && (
            <div className={styles.cardActions}>
              <button className={styles.cancelBtn} onClick={onCancelar} disabled={!!saving}>Cancelar todo</button>
              <button className={styles.finishBtn} onClick={onFinalizar} disabled={!!saving}>Finalizar consulta</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminConsultasPage
