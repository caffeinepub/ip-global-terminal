import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const GLOBE_RADIUS = 1.5;

// ── Globe mesh with world-map texture ────────────────────────────────────────
function GlobeMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load('/assets/generated/world-map-black.dim_3840x2160.png');
    tex.anisotropy = 16;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[GLOBE_RADIUS, 128, 128]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.75}
        metalness={0.05}
        emissive={new THREE.Color(0x1a1000)}
        emissiveIntensity={0.12}
      />
    </mesh>
  );
}

// ── Atmosphere glow ───────────────────────────────────────────────────────────
function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[GLOBE_RADIUS * 1.06, 64, 64]} />
      <meshStandardMaterial
        color={new THREE.Color(0xd4a017)}
        transparent
        opacity={0.045}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// ── Stars background ──────────────────────────────────────────────────────────
function Stars() {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = 2000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 18 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        color={new THREE.Color(0xfff8e0)}
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.55}
      />
    </points>
  );
}

// ── Full scene ────────────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} color={new THREE.Color(0xfff5d0)} />
      <directionalLight
        position={[5, 3, 5]}
        intensity={1.2}
        color={new THREE.Color(0xfff0c0)}
      />
      <pointLight position={[-6, -2, -4]} intensity={0.3} color={new THREE.Color(0xd4a017)} />

      {/* Stars */}
      <Stars />

      {/* Globe — clean, no grid, no dots, no arcs */}
      <GlobeMesh />
      <Atmosphere />

      {/* Orbit controls — user can drag to rotate */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.8}
        rotateSpeed={0.4}
      />
    </>
  );
}

// ── Public component ──────────────────────────────────────────────────────────
export default function AnimatedWorldMap() {
  return (
    <div className="w-full h-full" style={{ background: 'rgb(5, 4, 2)' }}>
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: 'rgb(5, 4, 2)' }}
        dpr={[1, Math.min(window.devicePixelRatio, 2)]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
