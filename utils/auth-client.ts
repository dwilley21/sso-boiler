// Custom authentication client using GoTrue JS directly
import { GoTrueClient } from '@supabase/gotrue-js'

// Create a custom GoTrue client for authentication
export function createAuthClient(supabaseUrl: string, supabaseKey: string) {
  const authUrl = `${supabaseUrl}/auth/v1`
  
  console.log('Creating auth client with URL:', authUrl)
  
  const goTrueClient = new GoTrueClient({
    url: authUrl,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    },
    storageKey: 'supabase.auth.token',
    storage: {
      getItem: (key) => {
        try {
          if (typeof window === 'undefined') return null
          const value = window.localStorage.getItem(key)
          return value
        } catch (error) {
          console.error('Error getting item from storage:', error)
          return null
        }
      },
      setItem: (key, value) => {
        try {
          if (typeof window === 'undefined') return
          window.localStorage.setItem(key, value)
        } catch (error) {
          console.error('Error setting item in storage:', error)
        }
      },
      removeItem: (key) => {
        try {
          if (typeof window === 'undefined') return
          window.localStorage.removeItem(key)
        } catch (error) {
          console.error('Error removing item from storage:', error)
        }
      }
    }
  })
  
  return goTrueClient
}

// Helper function to sign in with Google
export async function signInWithGoogle(authClient: GoTrueClient, appRedirectUrl: string) {
  console.log('Signing in with Google, redirect URL:', appRedirectUrl)
  
  // Use the Supabase callback URL format
  return authClient.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: appRedirectUrl,
      scopes: 'email profile',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  })
} 