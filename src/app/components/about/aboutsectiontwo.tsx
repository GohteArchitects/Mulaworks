import React from 'react';
import styles from './aboutsectiontwo.module.css';
import Image from 'next/image';

const AboutSectionTwo = () => {
  const publications = [
    { year: '2023', publication: 'Architectural Digest', article: 'Modern Minimalism in Urban Spaces' },
    { year: '2022', publication: 'Dwell Magazine', article: 'Sustainable Materials in Contemporary Design' },
    { year: '2021', publication: 'Dezeen', article: 'Blending Indoor and Outdoor Living' },
    { year: '2020', publication: 'Wallpaper*', article: 'The Future of Residential Architecture' },
  ];

  // Image size configurations - easily adjustable
  const imageSizes = {
    leftFirst: { width: 480, height: 320 },
    rightFirst: { width: 720, height: 480 },
    rightTeam: { width: 720, height: 480 }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Column (40%) */}
          <div className={styles.columnLeft}>
            {/* Row 1 - Image */}
            <div className={`${styles.row} ${styles.row1}`}>
              <div className={styles.imageWrapper}>
                <Image 
                  src="/GohteArchitects_Work_Ten.jpg" 
                  alt="Gohte Architects Design"
                  width={imageSizes.leftFirst.width}
                  height={imageSizes.leftFirst.height}
                  className={styles.image}
                  priority
                />
              </div>
            </div>

            {/* Row 2 - Empty (spacer) */}
            <div className={`${styles.row} ${styles.row2}`}></div>

            {/* Row 3 - Our Team */}
            <div className={`${styles.row} ${styles.row3}`}>
              <div className={styles.textContent}>
                <h2 className={styles.sectionTitle}>Our Team</h2>
                <p className={styles.sectionSubtitle}>
                  Our team of architects, designers, and project managers brings together diverse backgrounds and a shared vision of purposeful design.
                </p>
              </div>
            </div>

            {/* Row 4 - Recognition */}
            <div className={`${styles.row} ${styles.row4}`}>
              <div className={styles.textContent}>
                <h2 className={styles.sectionTitle}>Recognition</h2>
                <p className={styles.sectionSubtitle}>
                  Our work has been featured in various publications, reflecting our commitment to thoughtful and timeless design.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (60%) */}
          <div className={styles.columnRight}>
            {/* Row 1 - Image */}
            <div className={`${styles.row} ${styles.row1}`}>
              <div className={styles.imageWrapper}>
                <Image 
                  src="/GohteArchitects_Work_Eleven.jpg" 
                  alt="Gohte Architects Project"
                  width={imageSizes.rightFirst.width}
                  height={imageSizes.rightFirst.height}
                  className={styles.image}
                  priority
                />
              </div>
            </div>

            {/* Row 2 - Philosophy */}
            <div className={`${styles.row} ${styles.row2}`}>
              <div className={styles.philosophyGrid}>
                <div className={styles.philosophyTitle}>
                  <h2 className={styles.sectionTitle}>Our Philosophy</h2>
                </div>
                <div className={styles.philosophyContent}>
                  <p className={styles.sectionText}>
                    At Gohte Architects, we believe that great design is both elegant and purposeful. We are passionate about crafting clean, modern environments that harmoniously integrate natural elements and elevate the way people live and work. Each project is a true collaboration — where our clients' visions meet our creative and technical expertise to produce spaces that are unique, meaningful, and enduring.
                  </p>
                </div>
              </div>
            </div>

            {/* Row 3 - Team Image */}
            <div className={`${styles.row} ${styles.row3}`}>
              <div className={styles.imageWrapper}>
                <Image 
                  src="/GohteArchitects_Team.png" 
                  alt="Gohte Architects Team"
                  width={imageSizes.rightTeam.width}
                  height={imageSizes.rightTeam.height}
                  className={styles.image}
                />
              </div>
            </div>

            {/* Row 4 - Publications */}
            <div className={`${styles.row} ${styles.row4}`}>
              <div className={styles.publicationsContent}>
                <h2 className={styles.sectionTitlePub}>Publication</h2>
                <div className={styles.publicationsGrid}>
                  <div className={styles.gridHeader}>Year</div>
                  <div className={styles.gridHeader}>Publication</div>
                  <div className={styles.gridHeader}>Article</div>
                  
                  {publications.map((pub, index) => (
                    <React.Fragment key={index}>
                      <div className={styles.gridItem}>{pub.year}</div>
                      <div className={styles.gridItem}>{pub.publication}</div>
                      <div className={styles.gridItem}>{pub.article}</div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionTwo;