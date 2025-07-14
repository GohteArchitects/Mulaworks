'use client';

import Link from 'next/link';
import Image from 'next/image'; // Added Next.js Image component
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Left Column (Desktop) / Row 1 (Mobile) */}
        <div className={styles.leftColumn}>
          <div className={styles.leftRow1}>
            <div className={styles.logoContainer}>
              <Link href="/" passHref>
                {/* Replaced img with Next.js Image component */}
                <Image
                  src="/Logoone.svg"
                  alt="Gohte Architects Logo"
                  width={150} // Adjust based on your logo dimensions
                  height={50} // Adjust based on your logo dimensions
                  className={styles.logo}
                />
              </Link>
            </div>
            <p className={styles.copyright}>© 2025 Gohte Architects</p>
          </div>
          
          {/* Desktop-only made by section */}
          <div className={styles.leftRow2}>
            <p className={styles.madeBy}>
              made by{' '}
              <a 
                href="https://mulaworks.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.madeByLink}
              >
                mulaworks
              </a>
            </p>
          </div>
        </div>

        {/* Right Column (Desktop) / Rows 2-6 (Mobile) */}
        <div className={styles.rightColumn}>
          <div className={styles.rightRow1}>
            {/* Navigation Column (Row 2 in mobile) */}
            <div className={styles.navColumn}>
              <ul className={styles.navList}>
                <li className={styles.navItem}>
                  <Link href="/" className={styles.navLink} passHref>
                    Home
                  </Link>
                </li>
                <li className={styles.navItem}>
                  <Link href="/gohte-architects/works" className={styles.navLink} passHref>
                    Works
                  </Link>
                </li>
                <li className={styles.navItem}>
                  <Link href="/gohte-architects/about" className={styles.navLink} passHref>
                    About Us
                  </Link>
                </li>
                <li className={styles.navItem}>
                  <Link href="/gohte-architects/contact" className={styles.navLink} passHref>
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Column (Row 3 in mobile) */}
            <div className={styles.contactColumn}>
              <h3 className={styles.columnTitle}>CONTACT US</h3>
              <ul className={styles.contactList}>
                <li className={styles.contactItem}>
                  <a href="https://mail.google.com/mail/?view=cm&fs=1&to=admin@andrewgohte.com" className={styles.contactLink}>
                    admin@andrewgohte.com
                  </a>
                </li>
                <li className={styles.contactItem}>
                  <a href="https://wa.me/628170000885" className={styles.contactLink}>
                    0817-0000-885
                  </a>
                </li>
                <li className={styles.contactItem}>
                  Greenlake City, Tangerang
                </li>
              </ul>
            </div>

            {/* Follow Column (Row 4 in mobile) */}
            <div className={styles.followColumn}>
              <h3 className={styles.columnTitle}>FOLLOW US ON</h3>
              <ul className={styles.socialList}>
                <li className={styles.socialItem}>
                  <a 
                    href="https://www.instagram.com/gohtearchitects" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    Instagram
                  </a>
                </li>
                <li className={styles.socialItem}>
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
          </div>

          {/* Copyright notice (Row 5 in mobile) */}
          <div className={styles.rightRow2}>
            <p className={styles.copyrightNotice}>
              All content, including text, images, and designs, is the property of Gohte Architects and may not be reproduced, distributed, or used without prior written permission. Project details and images are representative of our work but may vary by client, location, and scope.
            </p>
          </div>

          {/* Mobile-only made by section (Row 6) */}
          <div className={styles.madeByMobile}>
            <p>
              made by{' '}
              <a 
                href="https://mulaworks.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.madeByLink}
              >
                mulaworks
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}