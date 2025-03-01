<template>
  <button 
    @click="signInWithGoogle" 
    class="flex items-center justify-center gap-3 bg-offwhite text-brown border border-taupe rounded px-4 py-2.5 text-sm font-medium transition-all hover:bg-sand/20 hover:shadow-sm w-full max-w-[240px] h-10 mx-auto disabled:opacity-70 disabled:cursor-not-allowed"
    :disabled="loading"
  >
    <svg v-if="!loading" class="w-[18px] h-[18px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      <path fill="none" d="M0 0h48v48H0z"/>
    </svg>
    <LoadingSpinner v-if="loading" :size="20" />
    <span>{{ label || (loading ? 'Signing in...' : 'Sign in with Google') }}</span>
  </button>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createClient } from '@supabase/supabase-js'

const props = defineProps({
  label: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['error'])

const client = useSupabaseClient()
const router = useRouter()
const loading = ref(false)
const config = useRuntimeConfig()

// Create a fresh Supabase client for authentication
const createFreshClient = () => {
  // Use the anon key directly to avoid any issues with environment variables
  const supabaseUrl = 'https://ftqnnkclmmduoloxewtl.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0cW5ua2NsbW1kdW9sb3hld3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2MTg4ODksImV4cCI6MjA1NjE5NDg4OX0.zw1-6fYWMIvoBk4ymyrYjC0Iffeiez0HE6WIGVGur5s'
  
  return createClient(
    supabaseUrl,
    supabaseKey,
    {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      }
    }
  )
}

async function signInWithGoogle() {
  try {
    loading.value = true
    
    // Create a fresh client for this authentication attempt
    const freshClient = createFreshClient()
    
    // Generate a code verifier (random string)
    const generateCodeVerifier = () => {
      const array = new Uint8Array(40)
      window.crypto.getRandomValues(array)
      return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('')
    }
    
    // Generate a code challenge from the verifier
    const generateCodeChallenge = async (verifier) => {
      const encoder = new TextEncoder()
      const data = encoder.encode(verifier)
      const digest = await window.crypto.subtle.digest('SHA-256', data)
      
      return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')
    }
    
    // Generate and store code verifier
    const codeVerifier = generateCodeVerifier()
    
    // Clear any existing code verifiers to avoid conflicts
    localStorage.removeItem('pkce_code_verifier')
    localStorage.removeItem('supabase.auth.code_verifier')
    sessionStorage.removeItem('pkce_code_verifier')
    sessionStorage.removeItem('supabase.auth.code_verifier')
    
    // Store in localStorage for the confirm page to use
    localStorage.setItem('pkce_code_verifier', codeVerifier)
    
    // Also store in sessionStorage as a backup
    sessionStorage.setItem('pkce_code_verifier', codeVerifier)
    
    // Store in the standard Supabase location as well
    localStorage.setItem('supabase.auth.code_verifier', codeVerifier)
    
    // Generate code challenge
    const codeChallenge = await generateCodeChallenge(codeVerifier)
    
    // Get the redirect URL
    const redirectUrl = `${window.location.origin}/confirm`
    
    // Use the Supabase client to sign in with Google
    const { data, error } = await freshClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: false,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    })
    
    if (error) {
      console.error('Error starting OAuth flow:', error.message)
      throw error
    }
  } catch (err) {
    console.error('Exception during Google sign-in:', err.message)
    emit('error', 'Failed to sign in with Google. Please try again.')
  } finally {
    loading.value = false
  }
}
</script> 