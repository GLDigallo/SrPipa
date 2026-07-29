import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          height: '100vh', background: '#0f0f0f', color: '#e0e0e0', fontFamily: 'system-ui', textAlign: 'center', padding: '20px'
        }}>
          <h1 style={{ fontSize: '24px', marginBottom: '12px', color: '#d4af37' }}>Algo salió mal</h1>
          <p style={{ fontSize: '14px', color: '#999', marginBottom: '20px' }}>Ocurrió un error inesperado.</p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.href = '/' }}
            style={{
              padding: '10px 24px', background: '#d4af37', color: '#0f0f0f', border: 'none',
              borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px'
            }}
          >
            Volver al inicio
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
