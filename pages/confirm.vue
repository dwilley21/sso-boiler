<template>
  <div class="confirm-container">
    <div class="confirm-card">
      <h1>Authenticating...</h1>
      <LoadingSpinner :size="50" :message="statusMessage" />
      
      <div class="debug-section" v-if="debugInfo.length > 0">
        <h3>Debug Information</h3>
        <div class="debug-log">
          <div v-for="(info, index) in debugInfo" :key="index" class="debug-line">
            {{ info }}
          </div>
        </div>
      </div>
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
const debugInfo = ref([])

function addDebugInfo(message) {
  console.log(message)
  debugInfo.value.push(`${new Date().toISOString().substr(11, 8)}: ${message}`)
}

// Create a fresh Supabase client for authentication
const createFreshClient = () => {
  // Use the anon key directly to avoid any issues with environment variables
  const supabaseUrl = 'https://ftqnnkclmmduoloxewtl.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0cW5ua2NsbW1kdW9sb3hld3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2MTg4ODksImV4cCI6MjA1NjE5NDg4OX0.zw1-6fYWMIvoBk4ymyrYjC0Iffeiez0HE6WIGVGur5s'
  
  addDebugInfo(`Creating fresh client with URL: ${supabaseUrl}`)
  addDebugInfo(`Key length: ${supabaseKey.length}`)
  
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
    addDebugInfo(`Setting user from session: ${session.user.email}`)
    // Force the user ref to update
    useState('supabase_user').value = session.user
  }
}

// Handle the OAuth callback
onMounted(async () => {
  addDebugInfo('Confirm page mounted')
  
  // Log Supabase configuration
  addDebugInfo(`Supabase URL: ${config.public.supabase.url}`)
  addDebugInfo(`Supabase Key length: ${config.public.supabase.key ? config.public.supabase.key.length : 0}`)
  
  // Create a fresh client for this authentication attempt
  const freshClient = createFreshClient()
  addDebugInfo('Created fresh Supabase client')
  
  // Check if we have a hash or query parameters from the OAuth callback
  const hasHashParams = window.location.hash && window.location.hash.length > 1
  const hasQueryParams = window.location.search && window.location.search.length > 1
  
  addDebugInfo(`Hash params: ${hasHashParams}, Query params: ${hasQueryParams}`)
  
  if (hasHashParams || hasQueryParams) {
    addDebugInfo('OAuth callback detected')
    
    try {
      // Let Supabase handle the session establishment
      addDebugInfo('Letting Supabase handle the session establishment')
      const { data, error } = await freshClient.auth.getSession()
      
      if (error) {
        addDebugInfo(`Error getting session: ${error.message}`)
        
        // Try to extract the code from the URL if present
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        
        if (code) {
          addDebugInfo(`Found code parameter: ${code.substring(0, 10)}...`)
          
          // Try with the Supabase client
          try {
            addDebugInfo('Manually exchanging code with Supabase client')
            const { data: exchangeData, error: exchangeError } = await freshClient.auth.exchangeCodeForSession(code)
            
            if (exchangeError) {
              addDebugInfo(`Error exchanging code: ${exchangeError.message}`)
            } else if (exchangeData?.session) {
              addDebugInfo(`Session established via exchange: ${exchangeData.session.user.email}`)
              await setUserFromSession(exchangeData.session)
              
              // Redirect to success page
              addDebugInfo('Redirecting to auth success page')
              router.push('/auth-success')
              return
            } else {
              addDebugInfo('No session data from code exchange')
            }
          } catch (exchangeErr) {
            addDebugInfo(`Exception during code exchange: ${exchangeErr.message}`)
          }
        }
      } else if (data.session) {
        addDebugInfo(`Session established: ${data.session.user.email}`)
        await setUserFromSession(data.session)
        
        // Redirect to success page
        addDebugInfo('Redirecting to auth success page')
        router.push('/auth-success')
        return
      } else {
        addDebugInfo('No session established automatically')
      }
      
      // If we still don't have a session, redirect back to login
      addDebugInfo('All authentication attempts failed')
      
      // Redirect back to login
      addDebugInfo('Redirecting back to login page')
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err) {
      addDebugInfo(`Exception during authentication: ${err.message}`)
      
      // Redirect back to login after a delay
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    }
  } else {
    addDebugInfo('No OAuth parameters found in URL')
    
    // Check if we already have a session
    try {
      const { data, error } = await freshClient.auth.getSession()
      
      if (error) {
        addDebugInfo(`Error checking for existing session: ${error.message}`)
      } else if (data.session) {
        addDebugInfo(`Existing session found: ${data.session.user.email}`)
        await setUserFromSession(data.session)
        
        // Redirect to success page
        addDebugInfo('Redirecting to auth success page with existing session')
        router.push('/auth-success')
        return
      } else {
        addDebugInfo('No existing session found')
      }
    } catch (err) {
      addDebugInfo(`Exception checking for session: ${err.message}`)
    }
    
    // If we get here, redirect back to login
    addDebugInfo('No authentication data found, redirecting to login')
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  }
})

// Helper function to process token response
async function processTokenResponse(data) {
  if (data.access_token) {
    addDebugInfo(`Got access token: ${data.access_token.substring(0, 10)}...`)
    
    // Get user data with the token
    const userResponse = await fetch('https://ftqnnkclmmduoloxewtl.supabase.co/auth/v1/user', {
      headers: {
        'Authorization': `Bearer ${data.access_token}`,
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0cW5ua2NsbW1kdW9sb3hld3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2MTg4ODksImV4cCI6MjA1NjE5NDg4OX0.zw1-6fYWMIvoBk4ymyrYjC0Iffeiez0HE6WIGVGur5s'
      }
    })
    
    if (userResponse.ok) {
      const userData = await userResponse.json()
      addDebugInfo(`Got user data: ${userData.email}`)
      
      // Create a session object
      const session = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: Math.floor(Date.now() / 1000) + data.expires_in,
        user: userData
      }
      
      // Store the session in localStorage
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        currentSession: session,
        expiresAt: session.expires_at
      }))
      addDebugInfo('Stored session in localStorage')
      
      // Set the user from the session
      await setUserFromSession(session)
      
      // Redirect to success page
      addDebugInfo('Redirecting to success page')
      router.push('/auth-success')
      return true
    } else {
      const errorData = await userResponse.json()
      addDebugInfo(`Error getting user data: ${JSON.stringify(errorData)}`)
    }
  }
  return false
}
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

.debug-section {
  margin-top: 30px;
  text-align: left;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.debug-log {
  background-color: #f9f9f9;
  border-radius: 4px;
  padding: 12px;
  max-height: 300px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 12px;
}

.debug-line {
  margin-bottom: 4px;
  line-height: 1.4;
}
</style> 