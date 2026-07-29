import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './SeccionCarousel.module.css'

const SWIPE_THRESHOLD = 50
const VISIBLE_TABS = 3
const TAB_PCT = 10 / VISIBLE_TABS

function lerp(a, b, t) {
  return a + (b - a) * Math.max(0, Math.min(1, t))
}

function SeccionCarousel({ secciones = [], seccionActiva }) {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (seccionActiva) {
      const idx = secciones.findIndex(s => s.id === seccionActiva.id)
      return idx !== -1 ? idx : 0
    }
    return 0
  })
  const [isExpanded, setIsExpanded] = useState(true)
  const [swipeDelta, setSwipeDelta] = useState(0)
  const touchStartX = useRef(null)
  const inactivityTimer = useRef(null)
  const stackRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    if (seccionActiva) {
      const idx = secciones.findIndex(s => s.id === seccionActiva.id)
      if (idx !== -1) setCurrentIndex(idx)
    }
  }, [seccionActiva, secciones])

  useEffect(() => {
    if (!stackRef.current) return
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width)
    })
    ro.observe(stackRef.current)
    return () => ro.disconnect()
  }, [isExpanded])

  const goToSeccion = useCallback((index) => {
    navigate(`/seccion/${secciones[index].id}`)
  }, [secciones, navigate])

  const handlePrev = useCallback(() => {
    goToSeccion((currentIndex - 1 + secciones.length) % secciones.length)
  }, [currentIndex, secciones.length, goToSeccion])

  const handleNext = useCallback(() => {
    goToSeccion((currentIndex + 1) % secciones.length)
  }, [currentIndex, secciones.length, goToSeccion])

  useEffect(() => {
    const resetTimer = () => {
      setIsExpanded(true)
      clearTimeout(inactivityTimer.current)
      inactivityTimer.current = setTimeout(() => setIsExpanded(false), 3000)
    }
    resetTimer()
    return () => clearTimeout(inactivityTimer.current)
  }, [])

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    setSwipeDelta(0)
  }

  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return
    setSwipeDelta(e.changedTouches[0].clientX - touchStartX.current)
  }

  const handleTouchEnd = () => {
    if (touchStartX.current === null) return
    if (swipeDelta > SWIPE_THRESHOLD) handlePrev()
    else if (swipeDelta < -SWIPE_THRESHOLD) handleNext()
    setSwipeDelta(0)
    touchStartX.current = null
  }

  if (!secciones.length) return null

  const len = secciones.length
  const isSwiping = touchStartX.current !== null
  const tabsSpace = Math.min(VISIBLE_TABS, len - 1) * TAB_PCT

  const getCardStyle = (index) => {
    let diff = index - currentIndex
    if (diff > len / 2) diff -= len
    if (diff < -len / 2) diff += len
    const absDiff = Math.abs(diff)

    if (!isSwiping || containerWidth === 0) {
      if (absDiff === 0) {
        return {
          zIndex: 30,
          left: 0,
          right: `${tabsSpace}%`,
          opacity: 1,
        }
      }
      if (absDiff > VISIBLE_TABS) {
        return { zIndex: 5, left: '100%', width: 0, opacity: 0, pointerEvents: 'none' }
      }
      return {
        zIndex: 30 - absDiff,
        right: `${(absDiff - 1) * TAB_PCT}%`,
        width: `${TAB_PCT}%`,
        opacity: 1 - absDiff * 0.18,
      }
    }

    const cardWidth = containerWidth * 0.9
    const progress = -swipeDelta / cardWidth
    const shiftedDiff = diff + progress
    const absShifted = Math.abs(shiftedDiff)

    if (absShifted <= 0.5) {
      return {
        zIndex: 30,
        left: 0,
        right: `${tabsSpace}%`,
        opacity: lerp(1, 0.7, Math.abs(progress)),
      }
    }

    if (absShifted <= VISIBLE_TABS + 0.5) {
      const tabPos = Math.ceil(absShifted - 0.5)
      const frac = absShifted - 0.5 - (tabPos - 1)
      const rightVal = lerp((tabPos - 1) * TAB_PCT, tabPos * TAB_PCT, frac)
      const widthVal = lerp(TAB_PCT, TAB_PCT, frac)
      const opacityVal = lerp(1 - (tabPos - 1) * 0.18, 1 - tabPos * 0.18, frac)

      return {
        zIndex: 30 - Math.ceil(absShifted),
        right: `${rightVal}%`,
        width: `${widthVal}%`,
        opacity: Math.max(0, opacityVal),
      }
    }

    return { zIndex: 5, left: '100%', width: 0, opacity: 0, pointerEvents: 'none' }
  }

  const activeSeccion = secciones[currentIndex]
  const bgImage = seccionActiva?.imagen

  return (
    <nav
      className={`${styles.carousel} ${isExpanded ? styles.expanded : styles.collapsed}`}
      role="navigation"
      aria-label="Navegación por secciones"
    >
      {!isExpanded && (
        <button
          className={styles.expandButton}
          onClick={() => setIsExpanded(true)}
          aria-label="Expandir"
        >
          🪈
        </button>
      )}

      {isExpanded && (
        <>
          <div
            className={styles.stackArea}
            ref={stackRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {secciones.map((seccion, index) => {
              const style = getCardStyle(index)
              const isActive = index === currentIndex

              return (
                <button
                  key={seccion.id}
                  className={`${styles.card} ${isActive ? styles.cardActive : ''}`}
                  style={{
                    ...style,
                    transition: isSwiping
                      ? 'none'
                      : 'all 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
                    backgroundImage: isActive && bgImage
                      ? `url(${bgImage})`
                      : (seccion.imagen ? `url(${seccion.imagen})` : 'none'),
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: isActive ? 'fixed' : 'scroll',
                    borderColor: isActive ? '#fff' : 'transparent',
                  }}
                  onClick={() => goToSeccion(index)}
                  aria-current={isActive ? 'true' : undefined}
                  >
                </button>
              )
            })}
          </div>
        </>
      )}
    </nav>
  )
}

export default SeccionCarousel
