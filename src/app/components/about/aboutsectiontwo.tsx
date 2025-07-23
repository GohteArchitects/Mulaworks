import React, { useState, useEffect } from 'react';
import styles from './aboutsectiontwo.module.css';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface Publication {
  year: string;
  publication: string;
  article: string;
}

const AboutSectionTwo = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  const teamImages = [
    { src: "/GohteArchitects_Team.png", alt: "Gohte Architects Team" },
    { src: "/PakAndrew.jpeg", alt: "Gohte Architects Team Working" },
  ];

  const [currentTeamImage, setCurrentTeamImage] = useState(0);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const { data, error } = await supabase
          .from('publications')
          .select('*')
          .order('year', { ascending: false });

        if (error) throw error;
        
        setPublications(data || []);
      } catch (error) {
        console.error('Error fetching publications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  const nextTeamImage = () => {
    setCurrentTeamImage((prev) => (prev === teamImages.length - 1 ? 0 : prev + 1));
  };

  const prevTeamImage = () => {
    setCurrentTeamImage((prev) => (prev === 0 ? teamImages.length - 1 : prev - 1));
  };

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
                  sizes="(max-width: 768px) 100vw, 40vw"
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
                  sizes="(max-width: 768px) 100vw, 60vw"
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

            {/* Row 3 - Team Image Slider */}
            <div className={`${styles.row} ${styles.row3}`}>
              <div className={styles.teamSlider}>
                <div className={styles.sliderImageWrapper}>
                  <Image 
                    src={teamImages[currentTeamImage].src} 
                    alt={teamImages[currentTeamImage].alt}
                    width={imageSizes.rightTeam.width}
                    height={imageSizes.rightTeam.height}
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />
                </div>
                <div className={styles.sliderControls}>
                  <button 
                    onClick={prevTeamImage}
                    className={styles.sliderButton}
                    aria-label="Previous team image"
                  >
                    ←
                  </button>
                  <button 
                    onClick={nextTeamImage}
                    className={styles.sliderButton}
                    aria-label="Next team image"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            {/* Row 4 - Publications */}
            <div className={`${styles.row} ${styles.row4}`}>
              <div className={styles.publicationsContent}>
                <h2 className={styles.sectionTitlePub}>Publication</h2>
                {loading ? (
                  <p className={styles.loadingText}>Loading publications...</p>
                ) : (
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionTwo;