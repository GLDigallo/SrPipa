import { useState, useEffect } from 'react'
import { api } from '../services/api'
import styles from './AdminCategoriasPage.module.css'

function AdminCategoriasPage() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ nombre: '', descripcion: '', orden: 0 })

  const load = async () => {
    try {
      const data = await api.categorias.listar()
      setCategorias(data)
    } catch {}
  }

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [])

  const openNew = () => {
    setEditingId(null)
    setForm({ nombre: '', descripcion: '', orden: categorias.length })
    setShowModal(true)
  }

  const openEdit = (c) => {
    setEditingId(c.id)
    setForm({ nombre: c.nombre, descripcion: c.descripcion || '', orden: c.orden || 0 })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.nombre) return
    try {
      const dto = { nombre: form.nombre, descripcion: form.descripcion || null, orden: form.orden || 0, activa: true }
      if (editingId) {
        await api.categorias.actualizar(editingId, dto)
      } else {
        await api.categorias.crear(dto)
      }
      setShowModal(false)
      load()
    } catch {}
  }

  const handleDelete = async (id) => {
    try {
      await api.categorias.eliminar(id)
      load()
    } catch {}
  }

  if (loading) {
    return <div className={styles.loading}>Cargando...</div>
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <h2 className={styles.title}>Categorías</h2>
        <button className={styles.addBtn} onClick={openNew}>+ Nueva</button>
      </div>

      <div className={styles.list}>
        {categorias.length === 0 && (
          <p className={styles.empty}>No hay categorías</p>
        )}
        {categorias.map((c) => (
          <div key={c.id} className={styles.item}>
            <div className={styles.itemInfo}>
              <span className={styles.itemName}>{c.nombre}</span>
              {c.descripcion && <span className={styles.itemDesc}>{c.descripcion}</span>}
            </div>
            <div className={styles.itemActions}>
              <span className={styles.order}>#{c.orden}</span>
              <button className={styles.editBtn} onClick={() => openEdit(c)}>✏️</button>
              <button className={styles.delBtn} onClick={() => handleDelete(c.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>{editingId ? 'Editar' : 'Nueva'} categoría</h3>

            <label className={styles.label}>
              Nombre
              <input
                type="text"
                className={styles.input}
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Ej: Bebidas"
                autoFocus
              />
            </label>

            <label className={styles.label}>
              Descripción
              <input
                type="text"
                className={styles.input}
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Opcional"
              />
            </label>

            <label className={styles.label}>
              Orden
              <input
                type="number"
                className={styles.input}
                value={form.orden}
                onChange={(e) => setForm({ ...form, orden: Number(e.target.value) })}
              />
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

export default AdminCategoriasPage
