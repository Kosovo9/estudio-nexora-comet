'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { type Language } from '@/lib/i18n'
import Tooltip from './Tooltip'

const texts = {
  en: { show: 'Show Earth', hide: 'Hide Earth' },
  es: { show: 'Mostrar Tierra', hide: 'Ocultar Tierra' },
}

interface EarthInteractiveProps {
  lang?: Language
  floating?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  show?: boolean
  onToggle?: () => void
}

export default function EarthInteractive({
  lang = 'es',
  floating = 'top-right',
  show: initialShow = true,
  onToggle,
}: EarthInteractiveProps) {
  const [show, setShow] = useState(initialShow)
  const mountRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const prevXRef = useRef(0)
  const prevYRef = useRef(0)
  const animationIdRef = useRef<number | null>(null)

  const toggle = () => {
    setShow(!show)
    onToggle?.()
  }

  useEffect(() => {
    if (!show || !mountRef.current) return

    const width = 300
    const height = 300

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000)
    camera.position.z = 8

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    mountRef.current.appendChild(renderer.domElement)

    // Tierra
    const loader = new THREE.TextureLoader()
    const earthGeo = new THREE.SphereGeometry(2.9, 48, 48)
    const earthMat = new THREE.MeshPhongMaterial({
      map: loader.load(
        'https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57730/land_ocean_ice_2048.png'
      ),
      bumpMap: loader.load(
        'https://www.solarsystemscope.com/textures/download/2k_earth_normal_map.png'
      ),
      bumpScale: 0.05,
    })
    const earthM = new THREE.Mesh(earthGeo, earthMat)
    scene.add(earthM)

    // Light/ambient
    const light = new THREE.DirectionalLight(0xffffff, 2)
    light.position.set(-5, 3, 2)
    scene.add(light)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    // Zoom/giro touch/desktop
    const handlePointerDown = (e: PointerEvent) => {
      draggingRef.current = true
      prevXRef.current = e.clientX
      prevYRef.current = e.clientY
    }

    const handlePointerUp = () => {
      draggingRef.current = false
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return

      earthM.rotation.y += (e.clientX - prevXRef.current) * 0.003
      earthM.rotation.x += (e.clientY - prevYRef.current) * 0.003

      prevXRef.current = e.clientX
      prevYRef.current = e.clientY
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      camera.position.z += e.deltaY * 0.01
      camera.position.z = Math.max(3, Math.min(camera.position.z, 12))
    }

    renderer.domElement.addEventListener('pointerdown', handlePointerDown)
    renderer.domElement.addEventListener('pointerup', handlePointerUp)
    renderer.domElement.addEventListener('pointermove', handlePointerMove)
    renderer.domElement.addEventListener('wheel', handleWheel, { passive: false })

    // Animación en idle
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)

      if (!draggingRef.current) {
        earthM.rotation.y += 0.0018
      }

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown)
      renderer.domElement.removeEventListener('pointerup', handlePointerUp)
      renderer.domElement.removeEventListener('pointermove', handlePointerMove)
      renderer.domElement.removeEventListener('wheel', handleWheel)
      if (mountRef.current && renderer.domElement.parentNode) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [show])

  const positionMap = {
    'bottom-right': { right: 14, bottom: 14 },
    'bottom-left': { left: 14, bottom: 14 },
    'top-right': { right: 14, top: 14 },
    'top-left': { left: 14, top: 14 },
  }

  const t = texts[lang]

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 998,
        ...positionMap[floating],
        width: 310,
        height: 320,
      }}
    >
      {show && (
        <>
          <Tooltip
            text={
              lang === 'es'
                ? 'Oculta/muestra el mundo 3D interactivo'
                : 'Show/hide the interactive 3D world'
            }
            lang={lang}
            position="bottom"
          >
            <button
              onClick={toggle}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0px',
                padding: '8px 18px',
                borderRadius: 12,
                background: '#fff',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              {t.hide}
            </button>
          </Tooltip>
          <div
            ref={mountRef}
            style={{
              width: 310,
              height: 320,
              background: '#282f40',
              borderRadius: '50%',
              overflow: 'hidden',
            }}
          />
        </>
      )}

      {!show && (
        <button
          onClick={toggle}
          style={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            padding: '8px 18px',
            borderRadius: 12,
            background: '#222',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
          }}
        >
          {t.show}
        </button>
      )}
    </div>
  )
}

