'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectedFrom') || '/gohte-architects/admin'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      // Force refresh to update auth state in middleware
      router.refresh()
      // Small delay to ensure session is properly set
      setTimeout(() => {
        router.push(redirectTo)
      }, 100)
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginWrapper}>
        <div className={styles.loginBackground}></div>
        <div className={styles.loginOverlay}></div>
        
        <div className={styles.loginContainer}>
          <div className={styles.loginHeader}>
            <h1 className={styles.loginTitle}>Admin Portal</h1>
            <p className={styles.loginSubtitle}>Enter your credentials to access the admin dashboard</p>
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
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.formInput}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.formInput}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              <span className={styles.buttonText}>
                {loading ? 'Authenticating...' : 'Login'}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}