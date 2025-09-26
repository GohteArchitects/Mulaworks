'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWorks } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import styles from './WorkPage.module.css';

interface Work {
  id: string;
  name: string;
  type: 'Residential' | 'Commercial';
  location: string;
  completion_year: number;
  description?: string;
  main_image?: string;
}

export default function WorkGalleryPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | Work['type']>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredWork, setHoveredWork] = useState<Work | null>(null);
  const worksPerPage = 12;

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsReady(true);
    }, 1200);

    const transitionTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    async function fetchWorks() {
      try {
        const data = await getWorks();
        if (!data) throw new Error("No data returned");
        
        const mappedData: Work[] = data.map((work: Work) => ({
          ...work,
          main_image: work.main_image || '/placeholder-image.jpg'
        }));
        
        setWorks(mappedData);
        if (mappedData.length) setHoveredWork(mappedData[0]);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error occurred";
        setError(`Failed to load projects: ${message}`);
      }
    }

    fetchWorks();

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(transitionTimer);
    };
  }, []);

  const filteredWorks = useMemo(() => {
    return works.filter(work => {
      const matchesSearch = work.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          work.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || work.type === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [works, searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredWorks.length / worksPerPage);
  const currentWorks = useMemo(() => {
    const startIndex = (currentPage - 1) * worksPerPage;
    return filteredWorks.slice(startIndex, startIndex + worksPerPage);
  }, [filteredWorks, currentPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: 'All' | Work['type']) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleWorkHover = (work: Work) => {
    setHoveredWork(work);
  };

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2 className={styles.errorTitle}>Error Loading Projects</h2>
        <p className={styles.errorMessage}>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className={styles.retryButton}
        >
          Try Again
        </button>
      </div>
    );
  }

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

      <motion.div
        className={styles.pageContainer}
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
        <div className={styles.topSpacer}></div>

        <div className={styles.contentWrapper}>
          {/* Left Column - Hidden on mobile except search */}
          <div className={styles.leftColumnStickyContainer}>
            <div className={styles.leftColumn}>
              <div className={styles.filterSection}>
                <div className={styles.searchContainer}>
                  <input
                    type="text"
                    placeholder="SEARCH"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className={styles.searchInput}
                    aria-label="Search projects"
                  />
                  <div className={styles.searchIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#161616" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 21L16.65 16.65" stroke="#161616" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              {hoveredWork && (
                <div className={styles.projectDetails}>
                  <h2 className={styles.projectTitle}>{hoveredWork.name}</h2>
                  <div className={styles.detailsRow}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Location</span>
                      <span className={styles.detailValue}>{hoveredWork.location}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Year</span>
                      <span className={styles.detailValue}>{hoveredWork.completion_year}</span>
                    </div>
                  </div>
                  <div className={styles.detailItem}>
                    <p className={styles.detailValueDesc}>{hoveredWork.description || 'No description available'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.rightColumnScrollable}>
            <div className={styles.workTypesContainer}>
              <div className={styles.listHorizontal}>
                <button 
                  onClick={() => handleCategoryChange('All')}
                  className={`${styles.listItemHorizontal} ${selectedCategory === 'All' ? styles.activeCategory : ''}`}
                >
                  All
                </button>
                <button 
                  onClick={() => handleCategoryChange('Residential')}
                  className={`${styles.listItemHorizontal} ${selectedCategory === 'Residential' ? styles.activeCategory : ''}`}
                >
                  Residential
                </button>
                <button 
                  onClick={() => handleCategoryChange('Commercial')}
                  className={`${styles.listItemHorizontal} ${selectedCategory === 'Commercial' ? styles.activeCategory : ''}`}
                >
                  Commercial
                </button>
              </div>
            </div>

            <div className={styles.worksGrid}>
              {currentWorks.length > 0 ? (
                currentWorks.map((work) => (
                  <motion.div 
                    key={work.id}
                    className={styles.workCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    onMouseEnter={() => handleWorkHover(work)}
                  >
                    <div className={styles.mobileWorkTitle}>{work.name}</div>
                    <Link href={`/work/${work.id}`} className={styles.workLink}>
                      <div className={styles.imageContainer}>
                        <Image
                          src={work.main_image || '/placeholder-project.svg'}
                          alt={work.name}
                          fill
                          className={styles.workImage}
                          priority={currentWorks.indexOf(work) < 4}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className={styles.imageOverlay}>
                          <span className={styles.viewText}>VIEW WORK</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <h3 className={styles.emptyStateTitle}>No projects found</h3>
                  <p className={styles.emptyStateMessage}>Try adjusting your search or filters</p>
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                    }}
                    className={styles.emptyStateButton}
                  >
                    CLEAR FILTERS
                  </button>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={styles.paginationButton}
                  aria-label="Previous page"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                <div className={styles.pageNumbers}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`${styles.pageButton} ${currentPage === page ? styles.activePage : ''}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={styles.paginationButton}
                  aria-label="Next page"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}