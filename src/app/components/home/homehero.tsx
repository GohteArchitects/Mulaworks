"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from './homehero.module.css';
import Link from 'next/link';

const HomeHero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const rect = heroRef.current.getBoundingClientRect();
      const isInside = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );
      
      setIsVisible(isInside);
      
      if (isInside) {
        setTargetPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const updatePosition = () => {
      setPosition(prev => ({
        x: prev.x + (targetPosition.x - prev.x) * 0.2,
        y: prev.y + (targetPosition.y - prev.y) * 0.2
      }));
      
      if (circleRef.current) {
        circleRef.current.style.transform = `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`;
      }
      requestAnimationFrame(updatePosition);
    };

    const updateOpacity = () => {
      setOpacity(prev => {
        const target = isVisible ? 1 : 0;
        return Math.abs(prev - target) < 0.01 ? target : prev + (target - prev) * 0.1;
      });
    };

    const opacityInterval = setInterval(updateOpacity, 16);
    const animationId = requestAnimationFrame(updatePosition);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(opacityInterval);
      cancelAnimationFrame(animationId);
    };
  }, [targetPosition, position, isVisible]);

  return (
    <section className={styles.heroContainer} ref={heroRef}>
      {/* Video Background */}
      <div className={styles.videoContainer}>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className={styles.video}
        >
          <source src="/HomeHero.mp4" type="video/mp4" />
        </video>
        <div className={styles.videoOverlay}></div>
      </div>

      {/* Floating Cursor Circle */}
      <Link 
        href="/work" 
        ref={circleRef}
        className={styles.cursorCircle}
        style={{ opacity }}
        aria-label="View our work"
      >
        <svg className={styles.arrowIcon} viewBox="0 0 24 24">
          <path d="M12 4l-8 8h5v8h6v-8h5z" fill="currentColor"/>
        </svg>
        <span className={styles.circleText}>View Work</span>
      </Link>

      {/* Top Row - Now using CSS Grid for precise spacing */}
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
        <h1 className={styles.mainHeading}>a breathing home</h1>
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