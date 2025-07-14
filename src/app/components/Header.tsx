'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Added Next.js Image component
import styles from './Header.module.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headerBackground, setHeaderBackground] = useState('transparent');

  useEffect(() => {
    setHeaderBackground(isMenuOpen ? '#161616' : 'transparent');
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Menu Overlay */}
      <div className={`${styles.menuOverlay} ${isMenuOpen ? styles.open : ''}`}>
        <div className={styles.menuContent}>
          {/* Column 1 - Contact List */}
          <div className={`${styles.menuColumn} ${styles.contactColumn}`}>
            <h3 className={styles.menuTitle}>CONTACT US</h3>
            <ul className={styles.contactList}>
              <li className={`${styles.menuItem} ${isMenuOpen ? styles.reveal : styles.hide}`}>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=admin@andrewgohte.com" className={styles.contactLink}>
                  admin@andrewgohte.com
                </a>
              </li>
              <li className={`${styles.menuItem} ${isMenuOpen ? styles.reveal : styles.hide}`}>
                <a href="https://wa.me/628170000885" className={styles.contactLink}>
                  0817-0000-885
                </a>
              </li>
              <li className={`${styles.menuItem} ${styles.contactText} ${isMenuOpen ? styles.reveal : styles.hide}`}>
                Greenlake City, Tangerang
              </li>
            </ul>
          </div>

          {/* Column 2 - Follow Us */}
          <div className={`${styles.menuColumn} ${styles.followColumn}`}>
            <h3 className={styles.menuTitle}>FOLLOW US ON</h3>
            <ul className={styles.socialList}>
              <li className={`${styles.menuItem} ${isMenuOpen ? styles.reveal : styles.hide}`}>
                <a 
                  href="https://www.instagram.com/gohtearchitects" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  Instagram
                </a>
              </li>
              <li className={`${styles.menuItem} ${isMenuOpen ? styles.reveal : styles.hide}`}>
                <a 
                  href="https://www.youtube.com/@gohtearchitects" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  YouTube
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Navigation Menu */}
          <div className={`${styles.menuColumn} ${styles.navColumn}`}>
            <nav>
              <ul className={styles.navList}>
                <li className={`${styles.menuItem} ${isMenuOpen ? styles.reveal : styles.hide}`}>
                  <Link href="/" className={styles.navLink} onClick={toggleMenu}>
                    HOME
                  </Link>
                </li>
                <li className={`${styles.menuItem} ${isMenuOpen ? styles.reveal : styles.hide}`}>
                  <Link href="/gohte-architects/works" className={styles.navLink} onClick={toggleMenu}>
                    WORKS
                  </Link>
                </li>
                <li className={`${styles.menuItem} ${isMenuOpen ? styles.reveal : styles.hide}`}>
                  <Link href="/gohte-architects/about" className={styles.navLink} onClick={toggleMenu}>
                    ABOUT US
                  </Link>
                </li>
                <li className={`${styles.menuItem} ${isMenuOpen ? styles.reveal : styles.hide}`}>
                  <Link href="/gohte-architects/contact" className={styles.navLink} onClick={toggleMenu}>
                    CONTACT US
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header 
        className={styles.header} 
        style={{ backgroundColor: headerBackground }}
      >
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            {/* Replaced img with Next.js Image component */}
            <Image
              src="/Logoone.svg"
              alt="Gohte Architects Logo"
              width={150} // Adjust based on your logo dimensions
              height={50} // Adjust based on your logo dimensions
              className={`${styles.logoImage} ${isMenuOpen ? styles.lightLogo : ''}`}
            />
          </Link>

          <div className={styles.rightSection}>
            {!isMenuOpen && (
              <Link href="/gohte-architects/contact" className={`${styles.contactButton} ${styles.hideOnMobile}`}>
                <span className={styles.buttonText}>CONTACT US</span>
              </Link>
            )}

            <button 
              className={`${styles.navMenuButton} ${isMenuOpen ? styles.open : ''}`} 
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-label="Navigation menu"
            >
              <span className={styles.hamburger}></span>
              <span className={styles.hamburger}></span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}