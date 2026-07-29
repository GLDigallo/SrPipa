import { useNavigate } from 'react-router-dom'
import { useCart } from '../../../contexts/CartContext'
import styles from './Header.module.css'

function Header({ onSearch, simple }) {
  const navigate = useNavigate()
  const { totalCount } = useCart()
  const count = totalCount()

  if (simple) {
    return (
      <header className={styles.header}>
        <div className={styles.contentSimple}>
          <div className={styles.logo} onClick={() => navigate('/seccion/1')}>
            <span>SrPipa</span>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.searchArea}>
          {onSearch && (
            <div className={styles.searchWrapper}>
              <div className={styles.searchIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar..."
                className={styles.searchInput}
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          )}
        </div>
        <div className={styles.logo} onClick={() => navigate('/seccion/1')}>
          <span>SrPipa</span>
        </div>
        <button
          className={styles.consultaBtn}
          onClick={() => navigate('/consulta')}
        >
          Consultar ({count})
        </button>
      </div>
    </header>
  )
}

export default Header
