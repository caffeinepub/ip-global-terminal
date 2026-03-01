import React, { useEffect, useRef } from 'react';

interface Dot {
  x: number;
  y: number;
  lat: number;
  lon: number;
  born: number;
  permanent: boolean;
}

const CONTINENT_PATHS: [number, number][][] = [
  // North America
  [[0.12,0.18],[0.08,0.22],[0.06,0.30],[0.10,0.38],[0.14,0.42],[0.18,0.44],[0.22,0.46],[0.26,0.44],[0.28,0.40],[0.30,0.36],[0.28,0.30],[0.24,0.24],[0.20,0.20],[0.16,0.18],[0.12,0.18]],
  // South America
  [[0.24,0.50],[0.20,0.54],[0.18,0.60],[0.20,0.68],[0.24,0.74],[0.28,0.78],[0.30,0.74],[0.32,0.68],[0.30,0.60],[0.28,0.54],[0.24,0.50]],
  // Europe
  [[0.44,0.16],[0.42,0.20],[0.44,0.26],[0.48,0.28],[0.52,0.26],[0.54,0.22],[0.52,0.18],[0.48,0.16],[0.44,0.16]],
  // Africa
  [[0.46,0.32],[0.44,0.38],[0.44,0.46],[0.46,0.54],[0.50,0.60],[0.54,0.62],[0.58,0.58],[0.58,0.50],[0.56,0.42],[0.54,0.36],[0.50,0.32],[0.46,0.32]],
  // Asia
  [[0.54,0.14],[0.52,0.18],[0.54,0.24],[0.58,0.28],[0.64,0.30],[0.70,0.28],[0.76,0.24],[0.80,0.20],[0.78,0.16],[0.72,0.14],[0.64,0.12],[0.58,0.12],[0.54,0.14]],
  // Australia
  [[0.74,0.56],[0.72,0.60],[0.74,0.66],[0.78,0.68],[0.82,0.66],[0.84,0.62],[0.82,0.58],[0.78,0.56],[0.74,0.56]],
];

const SEED_DOTS: [number, number][] = [
  [51.5, -0.1],   // London
  [40.7, -74.0],  // New York
  [35.7, 139.7],  // Tokyo
  [48.9, 2.3],    // Paris
  [1.3, 103.8],   // Singapore
  [19.1, 72.9],   // Mumbai
  [-33.9, 151.2], // Sydney
  [55.8, 37.6],   // Moscow
  [31.2, 121.5],  // Shanghai
  [37.6, -122.4], // San Francisco
  [-23.5, -46.6], // São Paulo
  [6.5, 3.4],     // Lagos
];

function latLonToXY(lat: number, lon: number, w: number, h: number): [number, number] {
  const x = ((lon + 180) / 360) * w;
  const y = ((90 - lat) / 180) * h;
  return [x, y];
}

export default function AnimatedWorldMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const animFrameRef = useRef<number>(0);
  const lastAddRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const cssW = canvas.offsetWidth;
      const cssH = canvas.offsetHeight;
      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Seed initial permanent dots
    dotsRef.current = SEED_DOTS.map(([lat, lon]) => {
      const [x, y] = latLonToXY(lat, lon, canvas.offsetWidth, canvas.offsetHeight);
      return { x, y, lat, lon, born: -9999, permanent: true };
    });

    const draw = (now: number) => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;

      ctx.clearRect(0, 0, W, H);

      // Background — deep black (transparent so the bg image shows through)
      ctx.fillStyle = 'rgba(5,5,5,0)';
      ctx.fillRect(0, 0, W, H);

      // Grid lines — very subtle gold
      ctx.strokeStyle = 'rgba(180,140,40,0.06)';
      ctx.lineWidth = 0.5;
      for (let lon = -180; lon <= 180; lon += 30) {
        const x = ((lon + 180) / 360) * W;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let lat = -90; lat <= 90; lat += 30) {
        const y = ((90 - lat) / 180) * H;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Continent fills — near-black with very subtle warm tint, dark outline
      CONTINENT_PATHS.forEach((path) => {
        ctx.beginPath();
        path.forEach(([rx, ry], i) => {
          const px = rx * W;
          const py = ry * H;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.closePath();
        // Near-black fill — dark charcoal, no blue
        ctx.fillStyle = 'rgba(12,10,8,0.82)';
        ctx.fill();
        // Dark outline with very subtle gold tint
        ctx.strokeStyle = 'rgba(100,80,20,0.35)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // Add new dot every 2–4.5 seconds
      if (now - lastAddRef.current > 2000 + Math.random() * 2500) {
        const lat = (Math.random() * 140) - 60;
        const lon = (Math.random() * 360) - 180;
        const [x, y] = latLonToXY(lat, lon, W, H);
        dotsRef.current.push({ x, y, lat, lon, born: now, permanent: false });
        lastAddRef.current = now;
      }

      // Draw dots
      dotsRef.current.forEach((dot) => {
        const age = dot.permanent ? Infinity : now - dot.born;
        const BLINK_DURATION = 1600;

        if (!dot.permanent && age < BLINK_DURATION) {
          // Ripple rings
          const progress = age / BLINK_DURATION;
          const numRings = 3;
          for (let r = 0; r < numRings; r++) {
            const ringProgress = (progress + r / numRings) % 1;
            const radius = ringProgress * 18;
            const alpha = (1 - ringProgress) * 0.6;
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(212,175,55,${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          // Blinking core
          const blink = Math.sin(age / 120) * 0.5 + 0.5;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212,175,55,${0.6 + blink * 0.4})`;
          ctx.fill();

          if (age >= BLINK_DURATION) {
            dot.permanent = true;
          }
        } else {
          // Permanent glowing dot
          const grd = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, 6);
          grd.addColorStop(0, 'rgba(212,175,55,0.9)');
          grd.addColorStop(0.4, 'rgba(212,175,55,0.4)');
          grd.addColorStop(1, 'rgba(212,175,55,0)');
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,220,80,0.95)';
          ctx.fill();
        }
      });

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block' }}
    />
  );
}
