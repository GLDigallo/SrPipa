import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '../services/api'
import styles from './AdminCarruselPage.module.css'

export default function AdminCarruselPage() {
  const [secciones, setSecciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(null)
  const [showNew, setShowNew] = useState(false)
  const [newNombre, setNewNombre] = useState('')
  const [newImagen, setNewImagen] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const cargar = useCallback(async () => {
    try {
      const data = await api.secciones.listar()
      setSecciones(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { cargar() }, [cargar])

  const handleFileUpload = async (e, targetId) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await api.upload.seccion(file)
      if (targetId) {
        await api.secciones.actualizarParcial(targetId, { imagen: url })
        setSecciones(prev => prev.map(s => s.id === targetId ? { ...s, imagen: url } : s))
      } else {
        setNewImagen(url)
      }
    } catch {
      alert('Error al subir imagen')
    } finally {
      setUploading(false)
      if (e.target) e.target.value = ''
    }
  }

  const crearSeccion = async () => {
    if (!newNombre.trim()) return
    try {
      const dto = { nombre: newNombre.trim(), imagen: newImagen || null, orden: secciones.length, activa: true }
      const created = await api.secciones.crear(dto)
      setSecciones(prev => [...prev, created])
      setNewNombre('')
      setNewImagen('')
      setShowNew(false)
    } catch (e) {
      console.error(e)
    }
  }

  const eliminarSeccion = async (id) => {
    if (!confirm('¿Eliminar esta sección? Los productos no se eliminarán.')) return
    setSaving(id)
    try {
      await api.secciones.eliminar(id)
      setSecciones(prev => prev.filter(s => s.id !== id))
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(null)
    }
  }

  const toggleActiva = async (id, actual) => {
    setSaving(id)
    try {
      await api.secciones.actualizarParcial(id, { activa: !actual })
      setSecciones(prev => prev.map(s => s.id === id ? { ...s, activa: !actual } : s))
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(null)
    }
  }

  const mover = async (id, direccion) => {
    const idx = secciones.findIndex(s => s.id === id)
    if (idx < 0) return
    const otroIdx = idx + direccion
    if (otroIdx < 0 || otroIdx >= secciones.length) return

    const actual = secciones[idx]
    const otro = secciones[otroIdx]

    setSaving(id)
    try {
      await api.secciones.actualizarParcial(actual.id, { orden: otro.orden })
      await api.secciones.actualizarParcial(otro.id, { orden: actual.orden })
      const nueva = [...secciones]
      nueva[idx] = { ...otro, orden: actual.orden }
      nueva[otroIdx] = { ...actual, orden: otro.orden }
      nueva.sort((a, b) => a.orden - b.orden)
      setSecciones(nueva)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(null)
    }
  }

  if (loading) return <div className={styles.loading}>Cargando secciones...</div>

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Carrusel</h2>
      <p className={styles.subtitle}>
        Creá las pestañas del carrusel. Cada pestaña tiene su imagen de fondo que se muestra en la página.
      </p>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Secciones ({secciones.length})</div>
        <div className={styles.list}>
          {secciones.map(s => (
            <div key={s.id} className={`${styles.card} ${!s.activa ? styles.cardInactive : ''}`}>
              <div className={styles.cardHeader}>
                {s.imagen ? (
                  <div className={styles.cardThumb}>
                    <img src={s.imagen} alt={s.nombre} />
                  </div>
                ) : (
                  <div className={styles.cardThumbEmpty}>🖼</div>
                )}
                <span className={styles.cardName}>{s.nombre}</span>
                <span className={styles.cardCount}>{s.cantidadProductos ?? 0} productos</span>
              </div>
              <div className={styles.cardActions}>
                <button
                  className={styles.arrowBtn}
                  onClick={() => mover(s.id, -1)}
                  disabled={secciones.indexOf(s) === 0 || saving}
                >↑</button>
                <button
                  className={styles.arrowBtn}
                  onClick={() => mover(s.id, 1)}
                  disabled={secciones.indexOf(s) === secciones.length - 1 || saving}
                >↓</button>

                <label className={styles.imgBtn}>
                  📷 {saving === s.id ? '...' : 'Img'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, s.id)}
                    style={{ display: 'none' }}
                  />
                </label>

                <button
                  className={`${styles.toggleBtn} ${s.activa ? styles.toggleOn : styles.toggleOff}`}
                  onClick={() => toggleActiva(s.id, s.activa)}
                  disabled={saving}
                >
                  {s.activa ? 'Visible' : 'Oculta'}
                </button>

                <button
                  className={styles.delBtn}
                  onClick={() => eliminarSeccion(s.id)}
                  disabled={saving}
                >✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!showNew ? (
        <button className={styles.newBtn} onClick={() => setShowNew(true)}>
          + Nueva sección
        </button>
      ) : (
        <div className={styles.newForm}>
          <input
            type="text"
            className={styles.input}
            value={newNombre}
            onChange={(e) => setNewNombre(e.target.value)}
            placeholder="Nombre de la sección (ej: Golosinas)"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && crearSeccion()}
          />

          <div className={styles.imgSection}>
            <label className={styles.imgUploadBtn}>
              📷 {uploading ? 'Subiendo...' : 'Subir imagen de fondo'}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) => handleFileUpload(e, null)}
                style={{ display: 'none' }}
              />
            </label>
            {newImagen && (
              <div className={styles.imgPreview}>
                <img src={newImagen} alt="Preview" />
                <button className={styles.imgRemove} onClick={() => setNewImagen('')}>✕</button>
              </div>
            )}
          </div>

          <div className={styles.newActions}>
            <button className={styles.cancelBtn} onClick={() => { setShowNew(false); setNewNombre(''); setNewImagen('') }}>Cancelar</button>
            <button className={styles.saveBtn} onClick={crearSeccion} disabled={!newNombre.trim()}>Crear</button>
          </div>
        </div>
      )}
    </div>
  )
}
