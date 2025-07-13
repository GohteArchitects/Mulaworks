import React from 'react';
import styles from './homesectionthree.module.css';
import Image from 'next/image';

const HomeSectionThree = () => {
  return (
    <section className={styles.sectionContainer}>
      <div className={styles.leftColumn}>
        <div className={styles.textContent}>
          <p className={styles.paragraph}>
            From private homes to large-scale commercial projects, we approach each design with care and clarity — thoughtfully considering the people who will inhabit the space, the environment it sits within, and the materials that bring it to life.
          </p>
          <p className={styles.paragraph}>
            Every detail is intentional, guided by a respect for natural textures, spatial harmony, and long-term functionality.
          </p>
        </div>
      </div>
      
      <div className={styles.rightColumn}>
        <div className={styles.imageContainer}>
          <div className={styles.largeImage}>
            <Image
              src="/GohteArchitects_Work_One.jpg" // Replace with your image path
              alt="Architecture project 1"
              width={800}
              height={600}
              className={styles.image}
            />
          </div>
          <div className={styles.smallImage}>
            <Image
              src="/GohteArchitects_Work_Two.jpg" // Replace with your image path
              alt="Architecture project 2"
              width={600}
              height={800}
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSectionThree;