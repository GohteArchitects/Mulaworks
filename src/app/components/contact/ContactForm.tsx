'use client';

import React from 'react';
import styles from './ContactForm.module.css';

const ContactForm = () => {
  return (
    <div className={styles.contactContainer}>
      <div className={styles.leftSection}>
        <div className={styles.leftContent}>
          <div className={styles.textContent}>
            <h1 className={styles.title}>Get in Touch</h1>
            <p className={styles.subtitle}>Start your journey with Gothe Architects</p>
          </div>
          
          <div className={styles.infoSections}>
            <div className={styles.infoBlock}>
              <h3 className={styles.infoTitle}>Contact Us</h3>
              <ul className={styles.infoList}>
                <li className={styles.infoItem}>
                  <span className={styles.infoLabel}>Email:</span>
                  <span className={styles.infoValue}>info@gothearchitects.com</span>
                </li>
                <li className={styles.infoItem}>
                  <span className={styles.infoLabel}>Phone:</span>
                  <span className={styles.infoValue}>+123 456 7890</span>
                </li>
                <li className={styles.infoItem}>
                  <span className={styles.infoLabel}>Address:</span>
                  <span className={styles.infoValue}>123 Design St, Creative City</span>
                </li>
              </ul>
            </div>

            <div className={styles.infoBlock}>
              <h3 className={styles.infoTitle}>Follow Us</h3>
              <ul className={styles.infoList}>
                <li className={styles.infoItem}>
                  <a href="#" className={styles.socialLink}>Instagram</a>
                </li>
                <li className={styles.infoItem}>
                  <a href="#" className={styles.socialLink}>LinkedIn</a>
                </li>
                <li className={styles.infoItem}>
                  <a href="#" className={styles.socialLink}>Pinterest</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        <form className={styles.contactForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.formLabel}>Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              className={styles.formInput}
              required 
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.formLabel}>Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              className={styles.formInput}
              required 
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              className={styles.formInput}
              required 
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.formLabel}>Message</label>
            <textarea 
              id="message" 
              name="message" 
              rows={5} 
              className={styles.formTextarea}
              required
            ></textarea>
          </div>
          
          <button type="submit" className={styles.submitButton}>
            <span className={styles.buttonText}>Submit</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;