'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    <div className={styles.pageContainer}>
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
    </div>
  );
}