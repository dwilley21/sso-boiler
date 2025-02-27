<template>
  <div class="success-container">
    <div class="success-card">
      <div class="success-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="checkmark-animation">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      <h1>Welcome{{ user?.user_metadata?.full_name ? ', ' + user.user_metadata.full_name.split(' ')[0] : '' }}!</h1>
      <p>{{ message }}</p>
      <div class="user-info" v-if="user">
        <div v-if="userAvatar" class="user-avatar">
          <img :src="userAvatar" alt="User avatar" width="80" height="80" />
        </div>
        <div v-else class="user-avatar placeholder">
          {{ userInitials }}
        </div>
        <div class="user-details">
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Provider:</strong> {{ user.app_metadata?.provider || 'Email' }}</p>
          <p v-if="user.user_metadata?.full_name"><strong>Name:</strong> {{ user.user_metadata.full_name }}</p>
          <p><strong>Last Sign In:</strong> {{ formatDate(user.last_sign_in_at) }}</p>
        </div>
      </div>
      <div v-if="!user" class="debug-info">
        <p><strong>Debug Info:</strong></p>
        <p>User object is null or undefined</p>
      </div>
      <p class="redirect-message">Redirecting to home page in {{ countdown }} seconds...</p>
      <AppButton @click="goToHome">Go to Home Now</AppButton>
    </div>
  </div>
</template>

<script setup>
const client = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()
const route = useRoute()
const countdown = ref(5)
const message = ref('You have successfully signed in with your Google account.')

// Computed properties for user display
const userInitials = computed(() => {
  if (!user.value || !user.value.email) return '?'
  
  // If we have a full name, use the initials from that
  if (user.value.user_metadata?.full_name) {
    return user.value.user_metadata.full_name
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2)
  }
  
  return user.value.email.charAt(0).toUpperCase()
})

const userAvatar = computed(() => {
  if (!user.value) return null
  return user.value.user_metadata?.avatar_url || null
})

// Format date for display
function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleString()
}

// If user is not authenticated, redirect to login
onMounted(async () => {
  console.log('Auth Success Page Mounted')
  console.log('Current user:', user.value)
  
  // Check session directly
  try {
    const { data, error } = await client.auth.getSession()
    console.log('Session data:', data)
    console.log('Session error:', error)
    
    if (error) {
      console.error('Error getting session:', error)
    }
  } catch (e) {
    console.error('Exception getting session:', e)
  }
  
  if (!user.value) {
    console.warn('No user found in auth-success page, will redirect to login')
    message.value = 'Authentication incomplete. Redirecting to login...'
    setTimeout(() => {
      router.push('/login')
    }, 3000)
    return
  }
  
  console.log('User authenticated:', user.value)
  console.log('User metadata:', user.value.user_metadata)
  console.log('App metadata:', user.value.app_metadata)
  
  // Check if there's a custom message in the query params
  if (route.query.message) {
    message.value = route.query.message
  }
  
  // Start countdown
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      goToHome()
    }
  }, 1000)
  
  // Clean up timer on component unmount
  onUnmounted(() => {
    clearInterval(timer)
  })
})

function goToHome() {
  console.log('Navigating to home page')
  router.push('/')
}
</script>

<style scoped>
.success-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.success-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 500px;
  text-align: center;
}

.success-icon {
  color: #10b981;
  margin-bottom: 20px;
}

.checkmark-animation {
  animation: checkmark 0.8s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

@keyframes checkmark {
  0% {
    stroke-dashoffset: 100;
    opacity: 0;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
}

.success-icon svg {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
}

h1 {
  margin-top: 0;
  margin-bottom: 16px;
  color: #333;
}

p {
  color: #555;
  margin-bottom: 24px;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20px;
}

.user-avatar.placeholder {
  background-color: #4f46e5;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
}

.user-details {
  text-align: left;
}

.user-details p {
  margin: 8px 0;
}

.redirect-message {
  font-size: 14px;
  color: #777;
  margin-bottom: 16px;
}

.debug-info {
  background-color: #fff8e1;
  border: 1px solid #ffe082;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 20px;
  text-align: left;
}

.debug-info p {
  margin: 4px 0;
  color: #b71c1c;
}
</style> 