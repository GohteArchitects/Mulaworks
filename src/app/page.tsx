'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import HomeHero from './components/home/homehero';
import HomeSectionTwo from './components/home/homesectiontwo';
import HomeSectionThree from './components/home/homesectionthree';
import HomeSectionFour from './components/home/homesectionfour';
import HomeSectionSix from './components/home/homesectionsix';
import styles from './home.module.css'; // Create this CSS module

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsReady(true);
    }, 1200);

    const transitionTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(transitionTimer);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className={styles.loadingContainer}
            initial={{ y: '100%' }}
            animate={{ 
              y: isReady ? '-100%' : '0%',
              transition: {
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1]
              }
            }}
            exit={{ 
              y: '-100%',
              transition: {
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1]
              }
            }}
          >
            <motion.div 
              className={styles.loadingContent}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { delay: 0.3, duration: 0.8 }
              }}
              exit={{ 
                opacity: 0,
                transition: { duration: 0.6 }
              }}
            >
              <Image
                src="/minilogo.svg"
                alt="Gothe Architects Logo"
                width={120}
                height={40}
                className={styles.loadingLogo}
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isLoading ? 0 : 1,
          transition: { 
            duration: 1,
            delay: 0.8,
            ease: "easeOut"
          }
        }}
      >
        <HomeHero />
        <HomeSectionTwo />
        <HomeSectionThree />
        <HomeSectionFour />
        <HomeSectionSix />
      </motion.main>
    </>
  );
}