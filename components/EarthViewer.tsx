'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { type Language } from '@/lib/i18n'

// NASA HD Textures (free, public domain) - Ultra ligero
const EARTH_MAP = 'https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57730/land_ocean_ice_2048.png'
const EARTH_BUMP = 'https://www.solarsystemscope.com/textures/download/2k_earth_normal_map.png'

const texts = {
  en: { show: 'Show Earth', hide: 'Hide Earth' },
  es: { show: 'Mostrar Tierra', hide: 'Ocultar Tierra' },
}

interface EarthViewerProps {
  width?: string | number
  height?: string | number
  autoRotate?: boolean
  showSatellite?: boolean
  className?: string
  language?: Language
}

export default function EarthViewer({
  width = '100vw',
  height = '48vh',
  autoRotate = true,
  showSatellite = true,
  className = '',
  language = 'es',
}: EarthViewerProps) {
  const [visible, setVisible] = useState(true)
  const mountRef = useRef<HTMLDivElement>(null)
  const animationIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!visible || !mountRef.current) return

    const width = mountRef.current.clientWidth
    const height = mountRef.current.clientHeight

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000)
    camera.position.z = 5.2

    // Renderer - Ultra ligero
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)) // Reducido para mobile

    mountRef.current.appendChild(renderer.domElement)

    // Sol HD - Luz direccional dorada
    const light = new THREE.DirectionalLight(0xfff5d6, 2.0)
    light.position.set(-3, 1, 4)
    scene.add(light)

    // Texture loader
    const loader = new THREE.TextureLoader()

    // Earth geometry - Ultra ligero (32 segments en lugar de 64)
    const earthGeo = new THREE.SphereGeometry(2, 32, 32)

    // Earth material - Sin specular para mejor performance
    const earthMat = new THREE.MeshPhongMaterial({
      map: loader.load(EARTH_MAP),
      bumpMap: loader.load(EARTH_BUMP),
      bumpScale: 0.05,
    })

    const earth = new THREE.Mesh(earthGeo, earthMat)
    scene.add(earth)

    // Satélite artificial ultra ligero (dorado/básico)
    let satellite: THREE.Mesh | null = null
    if (showSatellite) {
      const satGeo = new THREE.SphereGeometry(0.03, 8, 8) // Ultra ligero
      const satMat = new THREE.MeshBasicMaterial({ color: 0xfcc843 }) // Dorado
      satellite = new THREE.Mesh(satGeo, satMat)
      satellite.position.set(2.5, 0.4, 0)
      scene.add(satellite)
    }

    // Animación ultra simple
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)

      if (autoRotate) {
        // Rotación derecha a izquierda
        earth.rotation.y += 0.004
      }

      if (satellite) {
        const time = performance.now() / 1800
        satellite.position.x = 2.55 * Math.cos(time)
        satellite.position.z = 2.55 * Math.sin(time)
      }

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return
      const newWidth = mountRef.current.clientWidth
      const newHeight = mountRef.current.clientHeight

      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener('resize', handleResize)

    // Limpia al ocultar
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (mountRef.current && renderer.domElement.parentNode) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [visible, autoRotate, showSatellite])

  const t = texts[language]

  return (
    <div
      className={className}
      style={{
        width,
        height: visible ? height : '48vh',
        background: 'radial-gradient(ellipse at center, #212B36 60%, #222A32 100%)',
        position: 'relative',
      }}
    >
      <button
        onClick={() => setVisible(!visible)}
        className="absolute top-4 right-6 z-50 px-4 py-2 bg-gray-800/90 hover:bg-gray-700 border border-gray-700 rounded-lg font-semibold text-white transition-all"
        style={{ zIndex: 99 }}
      >
        {visible ? t.hide : t.show}
      </button>
      {visible && (
        <div
          ref={mountRef}
          style={{
            width: '100%',
            height: '45vh',
          }}
        />
      )}
    </div>
  )
}

