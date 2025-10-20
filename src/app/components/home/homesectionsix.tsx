"use client"

import React, { useState } from 'react';
import styles from './homesectionsix.module.css';
import Image from 'next/image';
import emailjs from '@emailjs/browser';

interface FormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
}

const HomeSectionSix = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Initialize EmailJS with your public key
      // You should store these in environment variables
      const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'your_service_id';
      const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'your_template_id';
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'your_public_key';

      // Send the email using EmailJS
      const response = await emailjs.send(
        serviceID,
        templateID,
        {
          from_name: formData.name,
          from_email: formData.email,
          phone_number: formData.phone,
          message: formData.message
        },
        publicKey
      );

      if (response.status === 200) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          phone: '',
          email: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Email sending failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.sectionContainer}>
      <div className={styles.leftColumn}>
        <div className={styles.leftImage}>
          <Image 
            src="/GohteArchitects_Work_Eight.jpg" 
            alt="Contact Us" 
            width={600}
            height={400}
            className={styles.image}
            priority
          />
        </div>
        
        <div className={styles.contactLists}>
          <div className={styles.contactList}>
            <h3 className={styles.listTitle}>Contact Us</h3>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <a href="mailto:admins@andrewgohte.com">admin@andrewgohte.com</a>
              </li>
              <li className={styles.listItem}>
                <a href="tel:08170000885">0817-0000-885</a>
              </li>
              <li className={styles.listItem}>
                Greenlake City, Tangerang
              </li>
            </ul>
          </div>
          
          <div className={styles.contactList}>
            <h3 className={styles.listTitle}>Follow Us On</h3>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <a href="https://www.instagram.com/gohtearchitects/" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
              <li className={styles.listItem}>
                <a href="https://www.youtube.com/@gohtearchitects" target="_blank" rel="noopener noreferrer">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className={styles.rightColumn}>
        <div className={styles.formHeader}>
          <h2 className={styles.sectionTitle}>Get in touch</h2>
          <p className={styles.sectionSubtitle}>
            Start your journey with Gohte Architects. Whether it&apos;s a home, office, or a unique conceptual space, 
            we&apos;re here to shape your vision to life.
          </p>
        </div>
        
        {submitStatus === 'success' && (
          <div className={styles.successMessage}>
            Thank you for your message! We&apos;ll get back to you soon.
          </div>
        )}
        
        {submitStatus === 'error' && (
          <div className={styles.errorMessage}>
            There was an error submitting your message. Please try again later.
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.contactForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                className={`${styles.formInput} ${errors.name ? styles.errorInput : ''}`}
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.formLabel}>Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                className={`${styles.formInput} ${errors.phone ? styles.errorInput : ''}`}
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              className={`${styles.formInput} ${errors.email ? styles.errorInput : ''}`}
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.formLabel}>Message</label>
            <textarea 
              id="message" 
              name="message" 
              className={`${styles.formInput} ${styles.formTextarea} ${errors.message ? styles.errorInput : ''}`}
              placeholder="Enter your message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            {errors.message && <span className={styles.errorText}>{errors.message}</span>}
          </div>
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            <span className={styles.buttonText}>
              {isSubmitting ? 'Sending...' : 'Submit'}
            </span>
          </button>
        </form>
      </div>
    </section>
  );
};

export default HomeSectionSix;