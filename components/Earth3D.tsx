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
      const baseSpeed = 0.00005;
      const speed = baseSpeed * rotationSpeedFactor;
      earthRef.current.rotation.y += speed * 10;
      if (cloudsRef.current) {
        cloudsRef.current.rotation.y += speed * 12;
      }
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
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          specularMap={specularMap}
          bumpMap={bumpMap}
          bumpScale={0.05}
          shininess={10}
        />
      </mesh>
      {cloudsMap && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[1.003, 64, 64]} />
          <meshStandardMaterial
            map={cloudsMap}
            transparent={true}
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
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
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} color={0xffffff} />
      <Stars
        radius={300}
        depth={60}
        count={20000}
        factor={7}
        saturation={0}
        fade={true}
      />
      <Earth rotationSpeedFactor={rotationSpeedFactor} />
    </Canvas>
  );
}

