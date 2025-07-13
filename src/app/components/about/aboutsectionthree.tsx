import React from 'react';
import Image from 'next/image';
import styles from './aboutsectionthree.module.css';
import Link from 'next/link';

const AboutSectionThree = () => {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {/* Column 1 - Row 1 (Empty) */}
        <div className={styles.column1Row1}></div>
        
        {/* Column 2 - Row 1 (Image) */}
        <div className={styles.column2Row1}>
          <div className={styles.imageContainer}>
            <Image
              src="/GohteArchitects_Work_Twelve.jpg"
              alt="Architecture design"
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
        
        {/* Column 1 - Row 2 (Image) */}
        <div className={styles.column1Row2}>
          <div className={styles.imageContainer}>
            <Image
              src="/GohteArchitects_Work_Thirteen.jpg"
              alt="Architecture collaboration"
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
        
        {/* Column 2 - Row 2 (Content) */}
        <div className={styles.column2Row2}>
          <div className={styles.content}>
            <h2 className={styles.title}>Let's build something beautiful together</h2>
            <p className={styles.subtitle}>
              Whether you're planning a new home, renovating a space, or starting a commercial project, 
              we're here to bring your vision to life with care and creativity. 
              Reach out — we'd love to hear your ideas.
            </p>
            <Link href="/contact" className={styles.contactButton}>
              <span className={styles.buttonText}>GET IN TOUCH</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionThree;