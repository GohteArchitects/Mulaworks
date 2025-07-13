// components/LenisProvider.tsx
'use client';

import { ReactNode, useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

interface LenisProviderProps {
  children: ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // Durasi yang lebih moderat, cepat tapi tetap halus
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing yang umum dan terasa responsif
      smoothWheel: true,
      wheelMultiplier: 0.8, // Sedikit mengurangi multiplier agar terasa lebih terkontrol
      infinite: false,
    });

    function raf(time: DOMHighResTimeStamp) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Clean up Lenis instance on component unmount
    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}