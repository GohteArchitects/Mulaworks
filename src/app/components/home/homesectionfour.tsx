import React from 'react';
import styles from './homesectionfour.module.css';
import Link from 'next/link';
import Image from 'next/image';

const HomeSectionFour = () => {
  const works = [
    { id: 1, title: '01/ RA House', image: '/GohteArchitects_Work_Three.jpg', alt: 'Work 01' },
    { id: 2, title: '02/ B House', image: '/GohteArchitects_Work_Four.jpg', alt: 'Work 02' },
    { id: 3, title: '03/ DM House', image: '/GohteArchitects_Work_Five.jpg', alt: 'Work 03' },
    { id: 4, title: '05/ Gramercy', image: '/GohteArchitects_Work_Seven.jpg', alt: 'Work 04' },
    { id: 5, title: '04/ XIU', image: '/GohteArchitects_Work_Six.jpg', alt: 'Work 05' }
  ];

  return (
    <section className={styles.sectionContainer}>
      <div className={styles.leftColumn}>
        <div className={styles.leftTop}>
          <h2 className={styles.sectionTitle}>Our works</h2>
          <p className={styles.sectionSubtitle}>
            Each project is a story of balance — between material, light, and living space. 
            Dive deep into our works and let us inspire you.
          </p>
        </div>
        
        <div className={styles.leftBottom}>
          <p className={styles.descriptionText}>
            Our works spans a range of scales and functions, but every project begins with 
            the same intent: to listen closely and design with purpose. From concept to 
            completion, we aim to create spaces that quietly elevate daily life — honest 
            in form, considered in detail.
          </p>
          
          <div className={styles.buttonContainer}>
            <div className={styles.circleBorder}></div>
            <Link href="/work" className={styles.viewAllButton}>
              view all works
              <span className={styles.underlineAnimation}></span>
            </Link>
          </div>
        </div>
      </div>
      
      <div className={styles.rightColumn}>
        {/* Row 1 */}
        <div className={styles.imageRow}>
          <Link href="/work/0566861a-aea2-4f38-9bbe-45b884ab3834" className={`${styles.imageBlock} ${styles.image40}`}>
            <div className={styles.imageLabel}>{works[0].title}</div>
            <div className={styles.imageWrapper}>
              <div className={styles.imageContainer}>
                <Image 
                  src={works[0].image} 
                  alt={works[0].alt} 
                  fill
                  className={styles.image}
                  priority
                />
                <div className={styles.hoverContent}>view work</div>
              </div>
            </div>
          </Link>
          <Link href="/work/6407e2f4-efd4-4a0d-960d-b831e410de89" className={`${styles.imageBlock} ${styles.image60} ${styles.offsetTop}`}>
            <div className={styles.imageLabel}>{works[1].title}</div>
            <div className={styles.imageWrapper}>
              <div className={styles.imageContainer}>
                <Image 
                  src={works[1].image} 
                  alt={works[1].alt} 
                  fill
                  className={styles.image}
                />
                <div className={styles.hoverContent}>view work</div>
              </div>
            </div>
          </Link>
        </div>
        
        {/* Row 2 - Full width */}
        <div className={styles.imageRow}>
          <Link href="/work/6e5c5ed3-a1f9-4016-b655-b26f63806c47" className={`${styles.imageBlock} ${styles.image100}`}>
            <div className={styles.imageLabel}>{works[2].title}</div>
            <div className={styles.imageWrapper}>
              <div className={styles.imageContainer}>
                <Image 
                  src={works[2].image} 
                  alt={works[2].alt} 
                  fill
                  className={styles.image}
                />
                <div className={styles.hoverContent}>view work</div>
              </div>
            </div>
          </Link>
        </div>
        
        {/* Row 3 */}
        <div className={styles.imageRow}>
          <Link href="/work/f3bb5770-8a04-492b-a64b-a23bf8f77c7a" className={`${styles.imageBlock} ${styles.image60} ${styles.offsetBottom}`}>
            <div className={styles.imageLabel}>{works[3].title}</div>
            <div className={styles.imageWrapper}>
              <div className={styles.imageContainer}>
                <Image 
                  src={works[3].image} 
                  alt={works[3].alt} 
                  fill
                  className={styles.image}
                />
                <div className={styles.hoverContent}>view work</div>
              </div>
            </div>
          </Link>
          <Link href="/work/f5088559-2e5b-4129-8723-07664ab40795" className={`${styles.imageBlock} ${styles.image40}`}>
            <div className={styles.imageLabel}>{works[4].title}</div>
            <div className={styles.imageWrapper}>
              <div className={styles.imageContainer}>
                <Image 
                  src={works[4].image} 
                  alt={works[4].alt} 
                  fill
                  className={styles.image}
                />
                <div className={styles.hoverContent}>view work</div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeSectionFour;