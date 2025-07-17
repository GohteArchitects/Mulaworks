"use client";

import React, { useRef, useEffect, useState } from 'react';
import styles from './homehero.module.css';
import Link from 'next/link';

const HomeHero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });

  // Smooth follow effect with delay
  useEffect(() => {
    let animationFrameId: number;
    const smoothingFactor = 0.1; // Adjust for more/less delay (0.05-0.2)
    
    const animate = () => {
      setTargetPosition(prev => {
        const dx = mousePosition.x - prev.x;
        const dy = mousePosition.y - prev.y;
        
        return {
          x: prev.x + dx * smoothingFactor,
          y: prev.y + dy * smoothingFactor
        };
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    if (isHovering) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      // Reset position when not hovering
      setTargetPosition(mousePosition);
    }
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePosition, isHovering]);

  // Mouse event handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      heroElement.addEventListener('mouseenter', handleMouseEnter);
      heroElement.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (heroElement) {
        heroElement.removeEventListener('mousemove', handleMouseMove);
        heroElement.removeEventListener('mouseenter', handleMouseEnter);
        heroElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <section className={styles.heroContainer} ref={heroRef}>
      {/* Hover Effect Element */}
      <div 
        className={`${styles.heroHoverEffect} ${isHovering ? styles.visible : ''}`}
        style={{
          left: `${targetPosition.x}px`,
          top: `${targetPosition.y}px`,
        }}
      >
        <div className={styles.arrowUp}></div>
        <span className={styles.viewWorkText}>View Work</span>
      </div>

      {/* Video Background */}
      <div className={styles.videoContainer}>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className={styles.video}
          preload="auto"
        >
          <source src="/HomeHero.mp4" type="video/mp4" />
        </video>
        <div className={styles.videoOverlay}></div>
      </div>

      {/* Top Row */}
      <div className={styles.topRow}>
        <div className={`${styles.column} ${styles.firstColumn}`}>
          <span className={styles.columnText}>featured work</span>
        </div>
        <div className={styles.column}>
          <span className={styles.columnText}>2025</span>
        </div>
        <div className={styles.column}>
          <span className={styles.columnText}>residental work</span>
        </div>
        <div className={`${styles.column} ${styles.lastColumn}`}>
          <span className={styles.columnText}>01/ RA HOUSE</span>
        </div>
      </div>

      {/* Center Text */}
      <div className={styles.centerText}>
        <h1 className={styles.mainHeading} aria-label="A breathing home">
          a breathing home
        </h1>
      </div>

      {/* Bottom Left Text */}
      <div className={styles.bottomText}>
        <p className={styles.description}>
          At Gohte Architects, we design clean, functional spaces that connect people with the natural environment.
        </p>
      </div>
    </section>
  );
};

export default HomeHero;