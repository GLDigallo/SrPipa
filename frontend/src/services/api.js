const API_BASE = '/api'

function getToken() {
  return localStorage.getItem('srpipa_token')
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (res.status === 401 || res.status === 403) {
    if (path === '/auth/login') {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.mensaje || body.message || 'Credenciales incorrectas')
    }
    localStorage.removeItem('srpipa_token')
    localStorage.removeItem('srpipa_user')
    window.location.href = '/admin'
    throw new Error('Sesión expirada')
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.mensaje || body.message || 'Error del servidor')
  }

  if (res.status === 204) return null
  const text = await res.text()
  if (!text) return null
  return JSON.parse(text)
}

export const api = {
  auth: {
    login: (username, password) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }),
  },

  dashboard: {
    resumen: () => request('/admin/dashboard/resumen'),
  },

  productos: {
    listar: (params = {}) => {
      const qs = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v != null && v !== '')
      ).toString()
      return request(`/admin/productos${qs ? `?${qs}` : ''}`)
    },
    crear: (dto) =>
      request('/admin/productos', {
        method: 'POST',
        body: JSON.stringify(dto),
      }),
    actualizar: (id, dto) =>
      request(`/admin/productos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(dto),
      }),
    cambiarEstado: (id, estado) =>
      request(`/admin/productos/${id}/estado?estado=${estado}`, {
        method: 'PATCH',
      }),
    eliminar: (id) =>
      request(`/admin/productos/${id}`, { method: 'DELETE' }),
  },

  upload: {
    archivo: async (file, tipo) => {
      const formData = new FormData()
      formData.append('file', file)
      const token = localStorage.getItem('srpipa_token')
      const res = await fetch(`/api/admin/upload/${tipo}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      if (!res.ok) throw new Error('Error al subir imagen')
      return res.text()
    },
    producto: (file) => api.upload.archivo(file, 'producto'),
    seccion: (file) => api.upload.archivo(file, 'seccion'),
  },

  categorias: {
    listar: () => request('/admin/categorias'),
    manuales: () => request('/admin/categorias/manuales'),
    crear: (dto) =>
      request('/admin/categorias', {
        method: 'POST',
        body: JSON.stringify(dto),
      }),
    actualizar: (id, dto) =>
      request(`/admin/categorias/${id}`, {
        method: 'PUT',
        body: JSON.stringify(dto),
      }),
    eliminar: (id) =>
      request(`/admin/categorias/${id}`, { method: 'DELETE' }),
  },

  secciones: {
    listar: () => request('/admin/secciones'),
    crear: (dto) =>
      request('/admin/secciones', {
        method: 'POST',
        body: JSON.stringify(dto),
      }),
    actualizar: (id, dto) =>
      request(`/admin/secciones/${id}`, {
        method: 'PUT',
        body: JSON.stringify(dto),
      }),
    actualizarParcial: (id, campos) =>
      request(`/admin/secciones/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(campos),
      }),
    eliminar: (id) =>
      request(`/admin/secciones/${id}`, { method: 'DELETE' }),
  },

  arcor: {
    buscar: (q, limite) => request(`/admin/arcor/buscar?q=${encodeURIComponent(q)}${limite ? `&limite=${limite}` : ''}`),
  },

  consultas: {
    crear: (dto) =>
      request('/consultas', {
        method: 'POST',
        body: JSON.stringify(dto),
      }),
    listar: () => request('/admin/consultas'),
    listarPorCliente: (clienteId) => request(`/admin/consultas/cliente/${clienteId}`),
    obtener: (id) => request(`/admin/consultas/${id}`),
    confirmarConsulta: (id) =>
      request(`/admin/consultas/${id}/confirmar`, { method: 'PATCH' }),
    cancelarConsulta: (id) =>
      request(`/admin/consultas/${id}/cancelar`, { method: 'PATCH' }),
    confirmarProducto: (productoConsultaId, cantidad) =>
      request(`/admin/consultas/productos/${productoConsultaId}/confirmar`, {
        method: 'POST',
        body: JSON.stringify({ cantidad }),
      }),
    denegarProducto: (productoConsultaId) =>
      request(`/admin/consultas/productos/${productoConsultaId}/denegar`, {
        method: 'POST',
      }),
  },

  clientes: {
    buscar: (q) => request(`/admin/clientes/buscar?q=${encodeURIComponent(q)}`),
    ranking: (id, limite) => request(`/admin/clientes/${id}/ranking${limite ? `?limite=${limite}` : ''}`),
  },

  sistema: {
    estado: () => request('/admin/sistema'),
    sincronizar: () =>
      request('/admin/sistema/sync', { method: 'POST' }),
  },

  publico: {
    secciones: () => request('/secciones'),
    productosPorSeccion: (id) => request(`/secciones/${id}/productos`),
    categoriasPublicas: () => request('/categorias'),
    productosPorCategoria: (id) => request(`/productos/categoria/${id}`),
    buscarProductos: (q) => request(`/productos/buscar?q=${encodeURIComponent(q)}`),
  },
}
