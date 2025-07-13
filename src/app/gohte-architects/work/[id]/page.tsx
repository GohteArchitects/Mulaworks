'use client';

import { useState, useEffect, useRef } from 'react';
import { getWorkById, getWorksByType } from '@/lib/supabase';
import Link from 'next/link';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import LinkExtension from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Image from 'next/image';
import styles from './WorkDetailPage.module.css';

interface Work {
  id: string;
  name: string;
  type: 'Residential' | 'Commercial';
  location: string;
  completion_year: number;
  architects: string;
  other_participants: string;
  photography: string;
  area: string;
  principal: string;
  interior_designer: string;
  content: string;
  main_image?: string;
}

interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'video';
  content: string;
  layout?: string;
}

interface ImageLayout {
  id: string;
  name: string;
  description: string;
  columns: number;
  containerClass: string;
  imageClass: string;
  mediaType: string;
}

interface WorkDetailPageProps {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

const IMAGE_LAYOUTS: ImageLayout[] = [
  {
    id: 'layout1',
    name: 'Full Height',
    description: 'Single image with 100vh height',
    columns: 1,
    containerClass: styles.fullHeightLayout,
    imageClass: styles.fullHeightImage,
    mediaType: 'image'
  },
  {
    id: 'layout2',
    name: 'Auto Height',
    description: 'Single image with auto height',
    columns: 1,
    containerClass: styles.autoHeightLayout,
    imageClass: styles.autoHeightImage,
    mediaType: 'image'
  },
  {
    id: 'layout3',
    name: '2 Columns (60/40) Full Height',
    description: '60/40 split with 100vh height',
    columns: 2,
    containerClass: styles.twoCol60_40FullHeightLayout,
    imageClass: styles.twoCol60_40FullHeightImage,
    mediaType: 'image'
  },
  {
    id: 'layout4',
    name: '2 Columns (40/60) Medium Height',
    description: '40/60 split with 70% height',
    columns: 2,
    containerClass: styles.twoCol40_60MediumHeightLayout,
    imageClass: styles.twoCol40_60MediumHeightImage,
    mediaType: 'image'
  },
  {
    id: 'layout5',
    name: '2 Columns (60/40) Medium Height',
    description: '60/40 split with 70% height',
    columns: 2,
    containerClass: styles.twoCol60_40MediumHeightLayout,
    imageClass: styles.twoCol60_40MediumHeightImage,
    mediaType: 'image'
  },
  {
    id: 'layout6',
    name: 'Video Block',
    description: 'Embed a video',
    columns: 1,
    containerClass: styles.videoLayout,
    imageClass: styles.videoImage,
    mediaType: 'video'
  }
];

export default function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { id } = params;
  const [work, setWork] = useState<Work | null>(null);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedWorks, setRelatedWorks] = useState<Work[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: styles.paragraph,
          },
        },
      }),
      Underline,
      LinkExtension.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    editable: false,
    editorProps: {
      attributes: {
        class: styles.editor,
      },
    },
  });

  useEffect(() => {
    async function fetchWork() {
      try {
        const data = await getWorkById(id);
        if (!data) throw new Error("Project not found");
        setWork(data);
        
        if (data.content) {
          try {
            const content = JSON.parse(data.content) as ContentBlock[];
            setBlocks(content);
            
            const textBlock = content.find((block) => block.type === 'text');
            if (textBlock && editor) {
              editor.commands.setContent(textBlock.content);
            }
          } catch (e) {
            console.error("Error parsing content:", e);
            if (editor) {
              editor.commands.setContent(data.content);
            }
          }
        }

        if (data?.type) {
          const related = await getWorksByType(data.type, 6, id);
          setRelatedWorks(related);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchWork();
    }
  }, [id, editor]);

  const nextSlide = () => {
    if (relatedWorks.length > 0) {
      setCurrentSlide((prev) => 
        prev >= Math.ceil(relatedWorks.length / (isMobile ? 1 : 2)) - 1 ? 0 : prev + 1
      );
    }
  };

  const prevSlide = () => {
    if (relatedWorks.length > 0) {
      setCurrentSlide((prev) => 
        prev === 0 ? Math.ceil(relatedWorks.length / (isMobile ? 1 : 2)) - 1 : prev - 1
      );
    }
  };

  const MediaBlock = ({ block }: { block: ContentBlock }) => {
    const layout = IMAGE_LAYOUTS.find(l => l.id === block.layout) || IMAGE_LAYOUTS[0];
    const mediaSources = block.content ? block.content.split(',') : [];

    const getYouTubeId = (url: string) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    };

    const getVimeoId = (url: string) => {
      const regExp = /^.*(vimeo.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/;
      const match = url.match(regExp);
      return match ? match[5] : null;
    };

    const renderMediaItem = (src: string | undefined, index: number) => {
      if (block.type === 'video' || layout.mediaType === 'video') {
        return (
          <div className={styles.videoContainer}>
            {src?.includes('youtube.com') || src?.includes('youtu.be') ? (
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(src)}`}
                className={styles.videoIframe}
                allowFullScreen
                title={`YouTube video ${index + 1}`}
              />
            ) : src?.includes('vimeo.com') ? (
              <iframe
                src={`https://player.vimeo.com/video/${getVimeoId(src)}`}
                className={styles.videoIframe}
                allowFullScreen
                title={`Vimeo video ${index + 1}`}
              />
            ) : (
              <video 
                src={src} 
                controls 
                className={styles.videoElement}
              />
            )}
          </div>
        );
      }

      return (
        <div className={styles.imageContainer}>
          <Image
            src={src || '/placeholder-image.svg'}
            alt={`Image ${index + 1}`}
            fill
            className={styles.imageElement}
            quality={90}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-image.svg';
            }}
          />
        </div>
      );
    };

    if (isMobile) {
      return (
        <div className={styles.mobileMediaBlock}>
          {mediaSources.map((src, index) => (
            <div key={index} className={styles.mobileMediaItem}>
              {renderMediaItem(src, index)}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className={`${layout.containerClass} ${styles.mediaBlock}`}>
        {layout.id === 'layout3' ? (
          <div className={styles.twoCol60_40FullHeightGrid}>
            {mediaSources.map((src, index) => (
              <div key={index} className={styles.twoCol60_40FullHeightCol}>
                {renderMediaItem(src, index)}
              </div>
            ))}
            {mediaSources.length < 2 && (
              <div className={styles.twoCol60_40FullHeightCol}>
                {renderMediaItem(undefined, mediaSources.length)}
              </div>
            )}
          </div>
        ) : layout.id === 'layout4' ? (
          <div className={styles.twoCol40_60MediumHeightGrid}>
            {mediaSources.map((src, index) => (
              <div 
                key={index} 
                className={index === 0 
                  ? styles.twoCol40_60MediumHeightCol 
                  : `${styles.twoCol40_60MediumHeightCol} ${styles.twoCol40_60MediumHeightRightCol}`
                }
              >
                {renderMediaItem(src, index)}
              </div>
            ))}
            {mediaSources.length < 2 && (
              <div className={styles.twoCol40_60MediumHeightCol}>
                {renderMediaItem(undefined, mediaSources.length)}
              </div>
            )}
          </div>
        ) : layout.id === 'layout5' ? (
          <div className={styles.twoCol60_40MediumHeightGrid}>
            {mediaSources.map((src, index) => (
              <div 
                key={index} 
                className={index === 0 
                  ? `${styles.twoCol60_40MediumHeightCol} ${styles.twoCol60_40MediumHeightLeftCol}`
                  : styles.twoCol60_40MediumHeightCol
                }
              >
                {renderMediaItem(src, index)}
              </div>
            ))}
            {mediaSources.length < 2 && (
              <div className={styles.twoCol60_40MediumHeightCol}>
                {renderMediaItem(undefined, mediaSources.length)}
              </div>
            )}
          </div>
        ) : layout.id === 'layout1' ? (
          <div className={styles.fullHeightImageContainer}>
            {renderMediaItem(mediaSources[0], 0)}
          </div>
        ) : layout.id === 'layout2' ? (
          <div className={styles.autoHeightImageContainer}>
            {renderMediaItem(mediaSources[0], 0)}
          </div>
        ) : (
          renderMediaItem(mediaSources[0], 0)
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2 className={styles.errorTitle}>Error Loading Project</h2>
        <p className={styles.errorMessage}>{error}</p>
        <Link href="/works" className={styles.backLink}>
          ← BACK TO WORKS
        </Link>
      </div>
    );
  }

  if (!work) {
    return (
      <div className={styles.notFoundContainer}>
        <h2 className={styles.notFoundTitle}>Project Not Found</h2>
        <p className={styles.notFoundMessage}>The requested project could not be found.</p>
        <Link href="/works" className={styles.backLink}>
          ← BACK TO WORKS
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.topSpacer}></div>

      <div className={styles.contentWrapper}>
        <div className={styles.leftSection}>
          <div className={styles.stickyContainer}>
            <Link href="/works" className={styles.backButton}>
              <svg className={styles.backIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className={styles.backText}>BACK TO WORKS</span>
            </Link>

            <h1 className={styles.workTitle}>{work.name}</h1>

            <div className={styles.creditsSection}>
              <h2 className={styles.creditsTitle}>CREDITS</h2>
              <div className={styles.creditsGrid}>
                <div className={styles.creditColumn}>
                  <div className={styles.creditItem}>
                    <p className={styles.creditLabel}>Location</p>
                    <p className={styles.creditValue}>{work.location || '-'}</p>
                  </div>
                  <div className={styles.creditItem}>
                    <p className={styles.creditLabel}>Completion Year</p>
                    <p className={styles.creditValue}>{work.completion_year || '-'}</p>
                  </div>
                  <div className={styles.creditItem}>
                    <p className={styles.creditLabel}>Area</p>
                    <p className={styles.creditValue}>{work.area || '-'}</p>
                  </div>
                </div>

                <div className={styles.creditColumn}>
                  <div className={styles.creditItem}>
                    <p className={styles.creditLabel}>Architects</p>
                    <p className={styles.creditValue}>{work.architects || '-'}</p>
                  </div>
                  <div className={styles.creditItem}>
                    <p className={styles.creditLabel}>Interior Designer</p>
                    <p className={styles.creditValue}>{work.interior_designer || '-'}</p>
                  </div>
                  <div className={styles.creditItem}>
                    <p className={styles.creditLabel}>Principal</p>
                    <p className={styles.creditValue}>{work.principal || '-'}</p>
                  </div>
                </div>

                <div className={styles.creditColumn}>
                  <div className={styles.creditItem}>
                    <p className={styles.creditLabel}>Other Participants</p>
                    <p className={styles.creditValue}>{work.other_participants || '-'}</p>
                  </div>
                  <div className={styles.creditItem}>
                    <p className={styles.creditLabel}>Photography</p>
                    <p className={styles.creditValue}>{work.photography || '-'}</p>
                  </div>
                  <div className={styles.creditItem}></div>
                </div>
              </div>
            </div>

            <Link href="/contact" className={styles.getQuoteButton}>
              <span className={styles.buttonText}>GET QUOTE</span>
            </Link>
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.contentContainer}>
            {blocks.map((block) => {
              if (block.type === 'text') {
                return (
                  <div key={block.id} className={styles.textBlock}>
                    {editor && <EditorContent editor={editor} />}
                  </div>
                );
              } else if (block.type === 'image' || block.type === 'video') {
                return (
                  <div key={block.id} className={styles.mediaBlockWrapper}>
                    <MediaBlock block={block} />
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>

      <div className={styles.middleSection}>
        <div className={styles.logoContainer}>
          <Image
            src="/minilogo.svg"
            alt="Company Logo"
            width={120}
            height={40}
            className={styles.logo}
          />
        </div>
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.bottomLeftSection}>
          <h2 className={styles.exploreTitle}>EXPLORE</h2>
          <p className={styles.exploreSubtitle}>Other related works you might like</p>
        </div>

        <div className={styles.bottomRightSection}>
          <div className={styles.sliderWrapper}>
            <div className={styles.sliderTrack} ref={sliderRef}>
              {relatedWorks.map((relatedWork, index) => (
                <div 
                  key={relatedWork.id} 
                  className={styles.slide}
                  style={{ 
                    transform: `translateX(-${currentSlide * 100}%)`,
                    width: `${100 / (isMobile ? 1 : 2)}%`
                  }}
                >
                  <Link href={`/works/${relatedWork.id}`} className={styles.relatedWorkCard}>
                    <div className={styles.workInfoContainer}>
                      <span className={styles.workNumber}>
                        {(index + 1).toString().padStart(2, '0')} / {relatedWork.name}
                      </span>
                    </div>
                    <div className={styles.relatedImageContainer}>
                      <Image
                        src={relatedWork.main_image || '/placeholder-image.svg'}
                        alt={relatedWork.name}
                        fill
                        className={styles.relatedImage}
                        quality={90}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className={styles.imageOverlay}>
                        <span className={styles.viewWorkText}>VIEW WORK</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.sliderControls}>
            <button 
              className={styles.sliderButton} 
              onClick={prevSlide}
              aria-label="Previous work"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              className={styles.sliderButton} 
              onClick={nextSlide}
              aria-label="Next work"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.bottomSpacer}></div>
    </div>
  );
}