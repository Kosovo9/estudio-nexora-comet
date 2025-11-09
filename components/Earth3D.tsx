'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';

interface Earth3DProps {
  rotationSpeedFactor: number;
}

const TEXTURE_PATHS = {
  earth: '/textures/earth_daymap.jpg',
  clouds: '/textures/earth_clouds.png',
  specular: '/textures/earth_specular.jpg',
  bump: '/textures/earth_bump.jpg',
};

const Earth = React.memo(({ rotationSpeedFactor }: { rotationSpeedFactor: number }) => {
  const [textures, setTextures] = useState<{
    colorMap: THREE.Texture | null;
    cloudsMap: THREE.Texture | null;
    specularMap: THREE.Texture | null;
    bumpMap: THREE.Texture | null;
  } | null>(null);
  const [textureError, setTextureError] = useState(false);

  const earthRef = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);

  useEffect(() => {
    const loader = new TextureLoader();
    const loadTextures = async () => {
      try {
        const [color, clouds, specular, bump] = await Promise.all([
          loader.loadAsync(TEXTURE_PATHS.earth).catch(() => null),
          loader.loadAsync(TEXTURE_PATHS.clouds).catch(() => null),
          loader.loadAsync(TEXTURE_PATHS.specular).catch(() => null),
          loader.loadAsync(TEXTURE_PATHS.bump).catch(() => null),
        ]);
        
        // Configurar wrap mode para texturas
        [color, clouds, specular, bump].forEach(texture => {
          if (texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
          }
        });
        
        if (color || clouds || specular || bump) {
          setTextures({ colorMap: color, cloudsMap: clouds, specularMap: specular, bumpMap: bump });
        } else {
          setTextureError(true);
        }
      } catch (error) {
        console.warn('Error cargando texturas:', error);
        setTextureError(true);
      }
    };
    loadTextures();
  }, []);

  useFrame(() => {
    if (earthRef.current && cloudsRef.current) {
      // Rotación continua de izquierda a derecha (eje Y positivo)
      const baseSpeed = 0.0005; // Velocidad base optimizada para rotación suave
      const speed = baseSpeed * rotationSpeedFactor;
      
      // Rotación de la Tierra
      earthRef.current.rotation.y += speed;
      
      // Rotación de las nubes (1.2x más rápido para efecto atmosférico)
      cloudsRef.current.rotation.y += speed * 1.2;
    }
  });

  if (textureError || !textures) {
    return (
      <group>
        <mesh ref={earthRef}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial
            color={0x4a90e2}
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
      </group>
    );
  }

  const { colorMap, cloudsMap, specularMap, bumpMap } = textures;

  return (
    <group>
      {/* Planeta Tierra con materiales fotorrealistas */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 128, 128]} />
        <meshPhongMaterial
          map={colorMap}
          specularMap={specularMap}
          bumpMap={bumpMap}
          bumpScale={0.1}
          shininess={30}
          specular={0x222222}
        />
      </mesh>
      
      {/* Nubes con efecto atmosférico */}
      {cloudsMap && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[1.003, 128, 128]} />
          <meshStandardMaterial
            map={cloudsMap}
            transparent={true}
            opacity={0.6}
            blending={THREE.AdditiveBlending}
            emissive={0xffffff}
            emissiveIntensity={0.2}
          />
        </mesh>
      )}
      
      {/* Efecto de atmósfera (glow azul) */}
      <mesh>
        <sphereGeometry args={[1.01, 64, 64]} />
        <meshBasicMaterial
          color={0x4a90e2}
          transparent={true}
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        enableRotate={true}
        zoomSpeed={0.6}
        panSpeed={0.5}
        rotateSpeed={0.4}
        minDistance={1.5}
        maxDistance={5}
      />
    </group>
  );
});

Earth.displayName = 'Earth';

export default function Earth3D({ rotationSpeedFactor }: Earth3DProps) {
  return (
    <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }} className="w-full h-full">
      {/* Iluminación realista para efecto día/noche */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} color={0xffffff} />
      
      {/* Punto de luz adicional para efecto de terminador (línea día/noche) */}
      <pointLight position={[3, 2, 3]} intensity={0.5} color={0xffffff} distance={10} decay={2} />
      
      {/* Fondo estelar hiperrealista con 50,000 estrellas */}
      <Stars
        radius={500}
        depth={100}
        count={50000}
        factor={10}
        saturation={0}
        fade={true}
        speed={0.5}
      />
      
      <Earth rotationSpeedFactor={rotationSpeedFactor} />
    </Canvas>
  );
}

