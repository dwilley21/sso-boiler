<template>
  <div class="test-container">
    <div class="test-card">
      <h1>Google Auth Test</h1>
      
      <div class="test-section">
        <h2>Supabase Configuration</h2>
        <div class="client-info">
          <p><strong>Supabase URL:</strong> {{ supabaseUrlAvailable ? 'Available' : 'Not available' }}</p>
          <p><strong>Supabase Key:</strong> {{ supabaseKeyAvailable ? 'Available' : 'Not available' }}</p>
          <p><strong>Auth Client:</strong> {{ authClientAvailable ? 'Available' : 'Not available' }}</p>
        </div>
      </div>
      
      <div class="test-section">
        <h2>Direct Auth Test</h2>
        <p>Click the button below to test Google authentication directly:</p>
        <button @click="testGoogleAuth" class="test-button">
          Test Google Auth
        </button>
      </div>
      
      <div class="test-section">
        <h2>Console Output</h2>
        <div class="console-output">
          <p v-for="(log, index) in logs" :key="index" :class="log.type">
            {{ log.message }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { createAuthClient, signInWithGoogle } from '~/utils/auth-client'

const config = useRuntimeConfig()
const logs = ref([])
const supabaseUrlAvailable = ref(false)
const supabaseKeyAvailable = ref(false)
const authClientAvailable = ref(false)
let authClient = null

onMounted(() => {
  addLog('Test page mounted', 'info')
  
  // Get Supabase URL and key from runtime config
  const supabaseUrl = config.public.supabase?.url || ''
  const supabaseKey = config.public.supabase?.key || ''
  
  supabaseUrlAvailable.value = !!supabaseUrl
  supabaseKeyAvailable.value = !!supabaseKey
  
  addLog(`Supabase URL available: ${supabaseUrlAvailable.value}`, 'info')
  addLog(`Supabase Key available: ${supabaseKeyAvailable.value}`, 'info')
  
  if (supabaseUrl && supabaseKey) {
    try {
      // Create a custom authentication client
      authClient = createAuthClient(supabaseUrl, supabaseKey)
      authClientAvailable.value = !!authClient
      addLog(`Auth client created: ${authClientAvailable.value}`, 'info')
    } catch (error) {
      addLog(`Error creating auth client: ${error.message}`, 'error')
    }
  }
})

async function testGoogleAuth() {
  addLog('Test button clicked', 'info')
  
  try {
    if (!authClient) {
      // Get Supabase URL and key from runtime config
      const supabaseUrl = config.public.supabase?.url || ''
      const supabaseKey = config.public.supabase?.key || ''
      
      if (!supabaseUrl || !supabaseKey) {
        addLog('Supabase configuration is missing', 'error')
        throw new Error('Supabase configuration is missing')
      }
      
      // Create a custom authentication client
      authClient = createAuthClient(supabaseUrl, supabaseKey)
      addLog('Auth client created', 'info')
    }
    
    // Construct the app redirect URL
    const appRedirectUrl = `${window.location.origin}/confirm`
    addLog(`App redirect URL: ${appRedirectUrl}`, 'info')
    
    // Sign in with Google using our custom function
    addLog('Calling signInWithGoogle', 'info')
    const { data, error } = await signInWithGoogle(authClient, appRedirectUrl)
    
    if (error) {
      addLog(`OAuth error: ${error.message}`, 'error')
      throw error
    }
    
    addLog('OAuth response received', 'success')
    addLog(`Response data: ${JSON.stringify(data)}`, 'info')
    
    if (data?.url) {
      addLog(`Redirect URL from response: ${data.url}`, 'info')
      addLog('Redirecting in 3 seconds...', 'info')
      
      // Wait 3 seconds before redirecting to allow reading the logs
      setTimeout(() => {
        window.location.href = data.url
      }, 3000)
    } else {
      addLog('No redirect URL returned', 'error')
    }
  } catch (error) {
    addLog(`Error during Google auth test: ${error.message}`, 'error')
  }
}

function addLog(message, type = 'info') {
  logs.value.unshift({ message, type })
  console.log(`[${type.toUpperCase()}] ${message}`)
}
</script>

<style scoped>
.test-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.test-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 800px;
}

h1 {
  margin-top: 0;
  margin-bottom: 24px;
  color: #333;
  text-align: center;
}

h2 {
  margin-top: 0;
  font-size: 1.2rem;
  color: #555;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.test-section {
  margin-bottom: 30px;
}

.client-info {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
}

.client-info p {
  margin: 8px 0;
}

.test-button {
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.test-button:hover {
  background-color: #4338ca;
}

.console-output {
  background-color: #1e1e1e;
  color: #fff;
  border-radius: 8px;
  padding: 16px;
  font-family: monospace;
  height: 300px;
  overflow-y: auto;
}

.console-output p {
  margin: 4px 0;
  line-height: 1.4;
}

.info {
  color: #64b5f6;
}

.success {
  color: #81c784;
}

.error {
  color: #e57373;
}
</style> 