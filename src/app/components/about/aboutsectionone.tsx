import React from 'react';
import styles from './aboutsectionone.module.css';
import Image from 'next/image'; // Jika menggunakan Next.js

const AboutSectionOne = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Row 1 - Title and Subtitle */}
        <div className={styles.row}>
          <div className={styles.textContent}>
            <h1 className={styles.title}>Our Story</h1>
            <p className={styles.subtitle}>
              Founded in 2015 and led by Andrew Gohte, Gohte Architects is a multidisciplinary architectural and interior design consultancy dedicated to creating thoughtful, timeless, and functional spaces. With a strong focus on both form and function, we bring a wide range of design solutions to life — from private residences to commercial developments.
            </p>
          </div>
        </div>

        {/* Row 2 - Full Width Image */}
        <div className={styles.row}>
          <div className={styles.fullWidthImage}>
            {/* Ganti dengan gambar Anda */}
            <Image 
              src="/GohteArchitects_Work_Nine.jpg" 
              alt="Gohte Architects Project"
              width={1200}
              height={600}
              layout="responsive"
            />
          </div>
        </div>

        {/* Row 3 - Logo and Text */}
        <div className={styles.row}>
          <div className={styles.logoContainer}>
            {/* Ganti dengan logo Anda */}
            <div className={styles.logo}>
              <Image 
                src="/minilogo.svg" 
                alt="Gohte Architects Logo"
                width={150}
                height={150}
              />
            </div>
            <p className={styles.logoText}>
              At Gohte Architects,<br />
              we believe that great design is both elegant and purposeful.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionOne;