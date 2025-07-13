'use client'; // Tambahkan direktif use client

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './ContactHero.module.css';

const ContactHero: React.FC = () => {
  const { scrollYProgress } = useScroll();
  // Mengurangi efek paralaks pada mobile untuk performa yang lebih baik
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]); // Sedikit perubahan untuk paralaks

  return (
    <div className={styles.heroWrapper}>
      <motion.div className={styles.heroBackground} style={{ y }}>
        {/* Gambar latar belakang paralaks akan diatur di CSS */}
      </motion.div>
      <div className={styles.overlay}></div> {/* Overlay untuk efek gelap */}
      <div className={styles.heroContent}>
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          get in touch with us
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Whether you have a project in mind or just want to say hello, feel free to reach out. Let’s start a conversation.
        </motion.p>
      </div>
    </div>
  );
};

export default ContactHero;