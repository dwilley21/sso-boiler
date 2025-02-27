<template>
  <div class="flex justify-center items-center min-h-screen bg-lightgray p-5">
    <div class="bg-white rounded-lg shadow-md p-10 w-full max-w-xl text-center">
      <div class="text-teal mb-5">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-checkmark mx-auto">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      <h1 class="text-2xl font-bold mb-4 text-teal">Welcome to Your Next Great App{{ user?.user_metadata?.full_name ? ', ' + user.user_metadata.full_name.split(' ')[0] : '' }}!</h1>
      <p class="text-teal mb-6">{{ message }}</p>
      <div v-if="user" class="flex bg-mint p-5 rounded-lg mb-8 items-center justify-center">
        <div v-if="userAvatar" class="w-20 h-20 rounded-full overflow-hidden mr-5">
          <img :src="userAvatar" alt="User avatar" class="w-full h-full object-cover" />
        </div>
        <div v-else class="w-20 h-20 rounded-full bg-teal text-white flex items-center justify-center text-3xl font-bold mr-5">
          {{ userInitials }}
        </div>
        <div class="text-left">
          <p class="my-2 text-teal"><strong>Email:</strong> {{ user.email }}</p>
          <p class="my-2 text-teal"><strong>Provider:</strong> {{ user.app_metadata?.provider || 'Email' }}</p>
          <p v-if="user.user_metadata?.full_name" class="my-2 text-teal"><strong>Name:</strong> {{ user.user_metadata.full_name }}</p>
          <p class="my-2 text-teal"><strong>Last Sign In:</strong> {{ formatDate(user.last_sign_in_at) }}</p>
        </div>
      </div>
      <div v-if="!user" class="bg-sky border border-teal rounded p-3 mb-5 text-left">
        <p class="font-bold text-teal">Debug Info:</p>
        <p class="text-teal">User object is null or undefined</p>
      </div>
      <p class="text-sm text-teal mb-4">Redirecting to home page in {{ countdown }} seconds...</p>
      <button @click="goToHome" class="btn btn-primary">Go to Home Now</button>
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
  // Check session directly
  try {
    const { data, error } = await client.auth.getSession()
    
    if (error) {
      console.error('Error getting session:', error)
    }
  } catch (e) {
    console.error('Exception getting session:', e)
  }
  
  if (!user.value) {
    message.value = 'Authentication incomplete. Redirecting to login...'
    setTimeout(() => {
      router.push('/login')
    }, 3000)
    return
  }
  
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

<style>
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

.animate-checkmark {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: checkmark 0.8s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}
</style> 