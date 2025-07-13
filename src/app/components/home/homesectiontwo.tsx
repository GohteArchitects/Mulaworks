import React from 'react';
import styles from './homesectiontwo.module.css';
import Link from 'next/link';

const HomeSectionTwo = () => {
  return (
    <section className={styles.sectionContainer}>
      <div className={styles.leftColumn}>
        <h2 className={styles.sectionTitle}>Design Rooted in Connection</h2>
        <p className={styles.sectionSubtitle}>
          Established in 2015, Gohte Architects creates thoughtful, functional spaces — from private homes to commercial projects
        </p>
      </div>
      
      <div className={styles.rightColumn}>
        <p className={styles.rightText}>
          Our work integrates architecture and interior design with the essence of nature — creating spaces that feel alive, grounded, and meaningful.
        </p>
        
        <div className={styles.buttonContainer}>
          <div className={styles.circleBorder}></div>
          <Link href="/about" className={styles.learnMoreButton}>
            learn more about us
            <span className={styles.underlineAnimation}></span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeSectionTwo;