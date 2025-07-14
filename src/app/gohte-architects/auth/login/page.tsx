'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsReady(true);
    }, 1200);

    const transitionTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(transitionTimer);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
      } else {
        router.push('/gohte-architects/admin');
      }
    } catch (err: unknown) {
      setError('An unexpected error occurred');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

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
        <div className={styles.loginContainer}>
          <div className={styles.loginLeftColumn}>
            <div className={styles.loginImageWrapper}>
              <Image 
                src="/GohteArchitects_Work_Eight.jpg" 
                alt="Admin Login" 
                fill
                className={styles.loginImage}
                priority
              />
            </div>
            
            <div className={styles.loginBranding}>
              <Image
                src="/minilogo.svg"
                alt="Gothe Architects Logo"
                width={180}
                height={60}
                className={styles.logo}
              />
              <h2 className={styles.brandingTitle}>Admin Portal</h2>
              <p className={styles.brandingSubtitle}>Access the content management system</p>
            </div>
          </div>
          
          <div className={styles.loginRightColumn}>
            <div className={styles.formHeader}>
              <h2 className={styles.sectionTitle}>Admin Login</h2>
              <p className={styles.sectionSubtitle}>
                Please enter your credentials to access the admin dashboard
              </p>
            </div>
            
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin} className={styles.loginForm}>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.formLabel}>Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={styles.formInput}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.formLabel}>Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className={styles.formInput}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={loading}
              >
                <span className={styles.buttonText}>
                  {loading ? 'Signing in...' : 'Sign in'}
                </span>
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </>
  );
}