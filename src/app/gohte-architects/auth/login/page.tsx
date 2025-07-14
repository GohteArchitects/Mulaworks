'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
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
      console.log('Attempting login with:', email); // Debug
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Login response data:', data); // Debug
      console.log('Login error:', authError); // Debug

      if (authError) {
        setError(authError.message);
        return;
      }

      // Check if we actually got a user
      if (!data?.user) {
        setError('Login failed - no user returned');
        return;
      }

      console.log('User logged in:', data.user.email); // Debug

      // Verify session exists
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('Session data:', sessionData); // Debug

      if (!sessionData?.session) {
        setError('No session created after login');
        return;
      }

      // Try both methods to ensure redirect works
      router.push('/gohte-architects/admin');
      setTimeout(() => {
        window.location.href = '/gohte-architects/admin';
      }, 1000);
      
    } catch (err: unknown) {
      console.error('Unexpected login error:', err);
      setError('An unexpected error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginWrapper}>
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
              autoComplete="username"
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
              autoComplete="current-password"
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
  );
}