<template>
  <div class="confirm-container">
    <div class="confirm-card">
      <h1>Authenticating...</h1>
      <LoadingSpinner :size="50" :message="statusMessage" />
    </div>
  </div>
</template>

<script setup>
import { createClient } from '@supabase/supabase-js'

const client = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()
const statusMessage = ref('Please wait while we confirm your identity')

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

// Explicitly set the user from session data
async function setUserFromSession(session) {
  if (session && session.user) {
    // Force the user ref to update
    useState('supabase_user').value = session.user
  }
}

// Handle the OAuth callback
onMounted(async () => {
  // Create a fresh client for this authentication attempt
  const freshClient = createFreshClient()
  
  // Check if we have a hash or query parameters from the OAuth callback
  const hasHashParams = window.location.hash && window.location.hash.length > 1
  const hasQueryParams = window.location.search && window.location.search.length > 1
  
  if (hasHashParams || hasQueryParams) {
    try {
      // Let Supabase handle the session establishment
      const { data, error } = await freshClient.auth.getSession()
      
      if (error) {
        console.error('Error getting session:', error.message)
        
        // Try to extract the code from the URL if present
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        
        if (code) {
          // Try with the Supabase client
          try {
            const { data: exchangeData, error: exchangeError } = await freshClient.auth.exchangeCodeForSession(code)
            
            if (exchangeError) {
              console.error('Error exchanging code:', exchangeError.message)
            } else if (exchangeData?.session) {
              await setUserFromSession(exchangeData.session)
              
              // Redirect to success page
              router.push('/auth-success')
              return
            }
          } catch (exchangeErr) {
            console.error('Exception during code exchange:', exchangeErr.message)
          }
        }
      } else if (data.session) {
        await setUserFromSession(data.session)
        
        // Redirect to success page
        router.push('/auth-success')
        return
      }
      
      // If we still don't have a session, redirect back to login
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err) {
      console.error('Exception during authentication:', err.message)
      
      // Redirect back to login after a delay
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    }
  } else {
    // Check if we already have a session
    try {
      const { data, error } = await freshClient.auth.getSession()
      
      if (error) {
        console.error('Error checking for existing session:', error.message)
      } else if (data.session) {
        await setUserFromSession(data.session)
        
        // Redirect to success page
        router.push('/auth-success')
        return
      }
    } catch (err) {
      console.error('Exception checking for session:', err.message)
    }
    
    // If we get here, redirect back to login
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  }
})
</script>

<style scoped>
.confirm-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.confirm-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 600px;
  text-align: center;
}

h1 {
  margin-top: 0;
  margin-bottom: 24px;
  color: #333;
}
</style> 