import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '../services/api'
import styles from './AdminProductosPage.module.css'

function AdminProductosPage() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [secciones, setSecciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ nombre: '', precio: '', imagen: '', categoriaId: '', seccionId: '', stock: 0 })

  const [arcorSearch, setArcorSearch] = useState('')
  const [arcorResults, setArcorResults] = useState([])
  const [arcorLoading, setArcorLoading] = useState(false)

  const [showNewCat, setShowNewCat] = useState(false)
  const [newCatNombre, setNewCatNombre] = useState('')

  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const loadProductos = useCallback(async () => {
    try {
      const data = await api.productos.listar({ busqueda: searchTerm || undefined })
      setProductos(data)
    } catch {}
  }, [searchTerm])

  const loadCategorias = async () => {
    try {
      const data = await api.categorias.manuales()
      setCategorias(data)
    } catch {}
  }

  const loadSecciones = async () => {
    try {
      const data = await api.secciones.listar()
      setSecciones(data)
    } catch {}
  }

  useEffect(() => {
    Promise.all([loadProductos(), loadCategorias(), loadSecciones()]).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const timer = setTimeout(loadProductos, 300)
    return () => clearTimeout(timer)
  }, [loadProductos])

  useEffect(() => {
    if (arcorSearch.length < 3) {
      setArcorResults([])
      return
    }
    setArcorLoading(true)
    const timer = setTimeout(async () => {
      try {
        const results = await api.arcor.buscar(arcorSearch)
        setArcorResults(results)
      } catch {
        setArcorResults([])
      } finally {
        setArcorLoading(false)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [arcorSearch])

  const selectArcor = (arcor) => {
    setForm({
      ...form,
      nombre: arcor.nombre,
      imagen: arcor.imagenUrl || '',
    })
    setArcorSearch('')
    setArcorResults([])
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await api.upload.producto(file)
      setForm({ ...form, imagen: url })
    } catch {
      alert('Error al subir imagen')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const openNew = () => {
    setEditingId(null)
    setForm({ nombre: '', precio: '', imagen: '', categoriaId: '', seccionId: '', stock: 0 })
    setArcorSearch('')
    setArcorResults([])
    setShowNewCat(false)
    setNewCatNombre('')
    setShowModal(true)
  }

  const openEdit = (p) => {
    setEditingId(p.id)
    setForm({
      nombre: p.nombre,
      precio: p.precio || '',
      imagen: p.imagen || '',
      categoriaId: p.categoriaId || '',
      seccionId: p.seccionId || '',
      stock: p.stock ?? 0,
    })
    setArcorSearch('')
    setArcorResults([])
    setShowNewCat(false)
    setNewCatNombre('')
    setShowModal(true)
  }

  const handleCategoryChange = (value) => {
    if (value === '__new__') {
      setShowNewCat(true)
      setNewCatNombre('')
    } else {
      setShowNewCat(false)
      setForm({ ...form, categoriaId: value })
    }
  }

  const handleSaveNewCategory = async () => {
    if (!newCatNombre.trim()) return
    try {
      const dto = { nombre: newCatNombre.trim(), descripcion: null, orden: categorias.length, activa: true }
      const created = await api.categorias.crear(dto)
      await loadCategorias()
      setForm({ ...form, categoriaId: created.id })
      setShowNewCat(false)
      setNewCatNombre('')
    } catch {}
  }

  const handleSave = async () => {
    if (!form.nombre) return
    try {
      const dto = {
        nombre: form.nombre,
        precio: form.precio ? Number(form.precio) : null,
        imagen: form.imagen || null,
        categoriaId: form.categoriaId ? Number(form.categoriaId) : null,
        seccionId: form.seccionId ? Number(form.seccionId) : null,
        stock: Number(form.stock) || 0,
      }
      if (editingId) {
        await api.productos.actualizar(editingId, dto)
      } else {
        await api.productos.crear(dto)
      }
      setShowModal(false)
      loadProductos()
    } catch {}
  }

  const handleDelete = async (id) => {
    try {
      await api.productos.eliminar(id)
      loadProductos()
    } catch {}
  }

  if (loading) {
    return <div className={styles.loading}>Cargando...</div>
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.search}
        />
        <button className={styles.addBtn} onClick={openNew}>+ Nuevo</button>
      </div>

      <div className={styles.list}>
        {productos.length === 0 && (
          <p className={styles.empty}>No hay productos</p>
        )}
        {productos.map((p) => (
          <div key={p.id} className={styles.item}>
            <div className={styles.itemImage}>
              {p.imagen ? (
                <img src={p.imagen} alt={p.nombre} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
              ) : null}
              <div className={styles.placeholder} style={{ display: p.imagen ? 'none' : 'flex' }}>📦</div>
            </div>
            <div className={styles.itemInfo}>
              <span className={styles.itemName}>{p.nombre}</span>
              <span className={styles.itemMeta}>
                {p.categoriaNombre && <span className={styles.catBadge}>{p.categoriaNombre}</span>}
                {p.seccionNombre && <span className={styles.seccionBadge}>{p.seccionNombre}</span>}
                {p.stock != null && <span className={styles.stockBadge}>Stock: {p.stock}</span>}
              </span>
            </div>
            <div className={styles.itemActions}>
              <button className={styles.editBtn} onClick={() => openEdit(p)}>✏️</button>
              <button className={styles.delBtn} onClick={() => handleDelete(p.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>{editingId ? 'Editar' : 'Nuevo'} producto</h3>

            <div className={styles.arcorSection}>
              <label className={styles.label}>
                🔍 Producto para SrPipa
                <input
                  type="text"
                  className={styles.input}
                  value={arcorSearch}
                  onChange={(e) => setArcorSearch(e.target.value)}
                  placeholder="Ej: alfajor, chocolate, galletitas..."
                />
              </label>
              {arcorLoading && <p className={styles.arcorHint}>Buscando...</p>}
              {arcorResults.length > 0 && (
                <div className={styles.arcorResults}>
                  <div className={styles.arcorGrid}>
                    {arcorResults.map((t) => (
                      <div key={t.id} className={styles.arcorCard} onClick={() => selectArcor(t)}>
                        <div className={styles.arcorCardImg}>
                          {t.imagenUrl ? (
                            <img src={t.imagenUrl} alt={t.nombre} />
                          ) : (
                            <span className={styles.arcorCardPlaceholder}>📦</span>
                          )}
                        </div>
                        <span className={styles.arcorCardName}>{t.nombre}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.divider}></div>

            <label className={styles.label}>
              Nombre
              <input
                type="text"
                className={styles.input}
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Ej: Alfajor Tatín"
              />
            </label>

            <div className={styles.row2}>
              <label className={styles.label}>
                Precio
                <input
                  type="number"
                  className={styles.input}
                  value={form.precio}
                  onChange={(e) => setForm({ ...form, precio: e.target.value })}
                  placeholder="0"
                />
              </label>

              <label className={styles.label}>
                Stock
                <input
                  type="number"
                  className={styles.input}
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="0"
                  min="0"
                />
              </label>
            </div>

            <label className={styles.label}>
              Imagen
              <div className={styles.imageSection}>
                <input
                  type="text"
                  className={styles.input}
                  value={form.imagen}
                  onChange={(e) => setForm({ ...form, imagen: e.target.value })}
                  placeholder="URL de imagen o subir archivo"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className={styles.fileInput}
                  id="fileUpload"
                />
                <label htmlFor="fileUpload" className={styles.uploadBtn}>
                  {uploading ? 'Subiendo...' : '📷 Subir'}
                </label>
              </div>
            </label>

            {form.imagen && (
              <div className={styles.imgPreview}>
                <img src={form.imagen} alt="Preview" />
              </div>
            )}

            <label className={styles.label}>
              Categoría (organización interna)
              {!showNewCat ? (
                <select
                  className={styles.input}
                  value={form.categoriaId}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  <option value="">Sin categoría</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                  <option value="__new__">+ Crear nueva categoría</option>
                </select>
              ) : (
                <div className={styles.newCatRow}>
                  <input
                    type="text"
                    className={styles.input}
                    value={newCatNombre}
                    onChange={(e) => setNewCatNombre(e.target.value)}
                    placeholder="Nombre de la categoría"
                    autoFocus
                  />
                  <button className={styles.newCatSave} onClick={handleSaveNewCategory} type="button">✓</button>
                  <button className={styles.newCatCancel} onClick={() => { setShowNewCat(false); setNewCatNombre('') }} type="button">✕</button>
                </div>
              )}
            </label>

            <label className={styles.label}>
              Sección (pestaña del carrusel)
              <select
                className={styles.input}
                value={form.seccionId}
                onChange={(e) => setForm({ ...form, seccionId: e.target.value })}
              >
                <option value="">Sin sección</option>
                {secciones.map((s) => (
                  <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
              </select>
            </label>

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancelar</button>
              <button className={styles.saveBtn} onClick={handleSave}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProductosPage
