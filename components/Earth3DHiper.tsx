// components/Earth3DHiper.tsx
'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

const Earth3DHiper: React.FC<{ size?: number }> = ({ size = 400 }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const earthRef = useRef<THREE.Mesh | null>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    if (!containerRef.current) return

    // === SCENE SETUP ===
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // === CAMERA ===
    const camera = new THREE.PerspectiveCamera(
      75,
      size / size,
      0.1,
      1000
    )
    camera.position.z = 2.5
    cameraRef.current = camera

    // === RENDERER ===
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    renderer.setSize(size, size)
    renderer.setClearColor(0x000000, 0.1)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // === EARTH TEXTURE (NASA Blue Marble) ===
    const textureLoader = new THREE.TextureLoader()
    const earthTexture = textureLoader.load(
      'https://www.nasa.gov/specials/artemis/images/earth-blue-marble.jpg',
      undefined,
      undefined,
      (error) => {
        // Fallback si la textura no carga
        console.warn('Earth texture failed to load, using fallback:', error)
      }
    )

    // === EARTH GEOMETRY ===
    const geometry = new THREE.SphereGeometry(1, 64, 64)
    const material = new THREE.MeshPhongMaterial({
      map: earthTexture,
      shininess: 5,
    })
    const earth = new THREE.Mesh(geometry, material)
    earthRef.current = earth
    scene.add(earth)

    // === ATMOSPHERE GLOW ===
    const atmosphereGeometry = new THREE.SphereGeometry(1.05, 64, 64)
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x0099ff,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
    })
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
    scene.add(atmosphere)

    // === LIGHTING ===
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const sunLight = new THREE.PointLight(0xffffff, 1.2)
    sunLight.position.set(5, 3, 5)
    scene.add(sunLight)

    // === STARS BACKGROUND ===
    const starsGeometry = new THREE.BufferGeometry()
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02,
      sizeAttenuation: true,
    })

    const starsVertices = []
    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 50
      const y = (Math.random() - 0.5) * 50
      const z = (Math.random() - 0.5) * 50
      starsVertices.push(x, y, z)
    }

    starsGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(starsVertices), 3)
    )
    const stars = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(stars)

    // === ANIMATION LOOP ===
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)

      // Rotación suave continua
      if (earthRef.current) {
        earthRef.current.rotation.y += 0.0005
      }

      renderer.render(scene, camera)
    }

    animate()

    // === WINDOW RESIZE HANDLER ===
    const handleResize = () => {
      if (containerRef.current) {
        const newSize = Math.min(
          window.innerWidth * 0.8,
          400
        )
        camera.aspect = 1
        camera.updateProjectionMatrix()
        renderer.setSize(newSize, newSize)
      }
    }

    window.addEventListener('resize', handleResize)

    // === CLEANUP ===
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (containerRef.current && renderer.domElement.parentNode) {
        containerRef.current.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      if (earthTexture) {
        earthTexture.dispose()
      }
      renderer.dispose()
    }
  }, [size])

  return (
    <div
      ref={containerRef}
      style={{
        width: size,
        height: size,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  )
}

export default Earth3DHiper

