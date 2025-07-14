'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check existing session on component mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      console.log('Session check:', { session, sessionError }); // Debug

      if (session) {
        console.log('Existing session found, redirecting...');
        router.push('/gohte-architects/admin');
        router.refresh();
      }
    };

    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting login with:', email); // Debug
      
      // Step 1: Sign in
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Login response:', { authData, authError }); // Debug

      if (authError) {
        console.error('Login error details:', authError);
        setError(authError.message.includes('Invalid login credentials') 
          ? 'Invalid email or password' 
          : authError.message
        );
        return;
      }

      // Step 2: Verify user data
      if (!authData?.user) {
        setError('Login failed - no user data returned');
        return;
      }

      console.log('User logged in:', authData.user.email); // Debug

      // Step 3: Get session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('Session data:', sessionData); // Debug

      if (sessionError) {
        console.error('Session error:', sessionError);
        setError('Failed to get session after login');
        return;
      }

      // Step 4: Final verification
      const { data: { user } } = await supabase.auth.getUser();
      console.log('User verification:', user); // Debug

      if (!user) {
        setError('User verification failed');
        return;
      }

      // Step 5: Redirect
      if (sessionData?.session) {
        console.log('Redirecting to admin...');
        router.push('/gohte-architects/admin');
        router.refresh();
      } else {
        setError('No active session detected after login');
      }

    } catch (err: unknown) {
      console.error('Unexpected error:', err);
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
              autoFocus
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