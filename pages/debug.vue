<template>
  <div class="debug-container">
    <div class="debug-card">
      <h1>Authentication Debug</h1>
      
      <div class="debug-section">
        <h2>Environment</h2>
        <div class="debug-info">
          <p><strong>Base URL:</strong> {{ baseUrl }}</p>
          <p><strong>Supabase URL:</strong> {{ supabaseUrl }}</p>
          <p><strong>Supabase Key:</strong> {{ maskedSupabaseKey }}</p>
        </div>
      </div>
      
      <div class="debug-section">
        <h2>Authentication State</h2>
        <div class="debug-info">
          <p><strong>User Authenticated:</strong> {{ !!user }}</p>
          <p v-if="user"><strong>User ID:</strong> {{ user.id }}</p>
          <p v-if="user"><strong>Email:</strong> {{ user.email }}</p>
          <p v-if="user"><strong>Provider:</strong> {{ user.app_metadata?.provider || 'Email' }}</p>
        </div>
      </div>
      
      <div class="debug-section">
        <h2>Session</h2>
        <div class="debug-info">
          <p><strong>Has Session:</strong> {{ !!session }}</p>
          <p v-if="session"><strong>Session Expires:</strong> {{ formatDate(session.expires_at) }}</p>
        </div>
      </div>
      
      <div class="debug-section">
        <h2>Actions</h2>
        <div class="debug-actions">
          <AppButton @click="refreshSession" variant="secondary">Refresh Session</AppButton>
          <AppButton @click="clearSession" variant="secondary">Clear Session</AppButton>
          <AppButton @click="testGoogleAuth">Test Google Auth</AppButton>
        </div>
      </div>
      
      <div class="debug-section">
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
const client = useSupabaseClient()
const user = useSupabaseUser()
const config = useRuntimeConfig()
const baseUrl = config.public.baseUrl || window.location.origin
const supabaseUrl = client.supabaseUrl
const logs = ref([])

// Mask the Supabase key for security
const maskedSupabaseKey = computed(() => {
  const key = client.supabaseKey
  if (!key) return 'Not available'
  return key.substring(0, 4) + '...' + key.substring(key.length - 4)
})

const session = ref(null)

onMounted(async () => {
  addLog('Debug page mounted', 'info')
  await getSession()
})

async function getSession() {
  try {
    const { data, error } = await client.auth.getSession()
    if (error) throw error
    session.value = data.session
    addLog('Session retrieved', 'success')
  } catch (error) {
    addLog(`Error getting session: ${error.message}`, 'error')
  }
}

async function refreshSession() {
  try {
    addLog('Refreshing session...', 'info')
    const { data, error } = await client.auth.refreshSession()
    if (error) throw error
    session.value = data.session
    addLog('Session refreshed successfully', 'success')
  } catch (error) {
    addLog(`Error refreshing session: ${error.message}`, 'error')
  }
}

async function clearSession() {
  try {
    addLog('Clearing session...', 'info')
    const { error } = await client.auth.signOut()
    if (error) throw error
    session.value = null
    addLog('Session cleared successfully', 'success')
  } catch (error) {
    addLog(`Error clearing session: ${error.message}`, 'error')
  }
}

async function testGoogleAuth() {
  try {
    addLog('Testing Google authentication...', 'info')
    
    // Construct the app redirect URL
    const appRedirectUrl = `${window.location.origin}/confirm`
    addLog(`App redirect URL: ${appRedirectUrl}`, 'info')
    
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Don't set redirectTo directly
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
          redirect_to: appRedirectUrl // This will be used after Supabase processes the callback
        }
      }
    })
    
    if (error) throw error
    
    addLog('OAuth response received', 'success')
    
    if (data?.url) {
      addLog(`Redirecting to Supabase auth URL: ${data.url}`, 'info')
      window.location.href = data.url
    } else {
      addLog('No redirect URL returned', 'error')
    }
  } catch (error) {
    addLog(`Error testing Google auth: ${error.message}`, 'error')
  }
}

function formatDate(timestamp) {
  if (!timestamp) return 'N/A'
  
  // If it's a number, assume it's in seconds
  const date = typeof timestamp === 'number' 
    ? new Date(timestamp * 1000) 
    : new Date(timestamp)
    
  return date.toLocaleString()
}

function addLog(message, type = 'info') {
  logs.value.unshift({ message, type })
  console.log(`[${type.toUpperCase()}] ${message}`)
}
</script>

<style scoped>
.debug-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.debug-card {
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

.debug-section {
  margin-bottom: 30px;
}

.debug-info {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
}

.debug-info p {
  margin: 8px 0;
  font-family: monospace;
}

.debug-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.console-output {
  background-color: #1e1e1e;
  color: #fff;
  border-radius: 8px;
  padding: 16px;
  font-family: monospace;
  height: 200px;
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