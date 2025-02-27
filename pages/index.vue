<template>
  <div class="flex justify-center items-center min-h-screen bg-lightgray p-5">
    <!-- Content for signed-in users -->
    <div v-if="user" class="bg-white rounded-lg shadow-md p-10 w-full max-w-2xl">
      <div class="bg-gradient-to-br from-mint to-sky text-teal p-8 rounded-lg text-center mb-8 shadow">
        <h1 class="text-3xl font-bold mb-4 text-teal">Welcome to You're Next Great App</h1>
        <p class="text-lg text-teal">We're glad to have you here, {{ user.user_metadata?.full_name || user.email || 'User' }}!</p>
      </div>
      <div class="mt-8">
        <h2 class="text-xl font-semibold text-teal text-center mb-5">Your Profile</h2>
        <div class="flex bg-mint p-5 rounded-lg mb-8">
          <UserAvatar :user="user" :size="80" />
          <div class="flex-1 ml-5">
            <p class="my-2 text-teal"><strong>Email:</strong> {{ user.email }}</p>
            <p class="my-2 text-teal"><strong>Provider:</strong> {{ user.app_metadata?.provider || 'Email' }}</p>
            <p v-if="user.user_metadata?.full_name" class="my-2 text-teal"><strong>Name:</strong> {{ user.user_metadata.full_name }}</p>
            <p class="my-2 text-teal"><strong>Last Sign In:</strong> {{ formatDate(user.last_sign_in_at) }}</p>
          </div>
        </div>
        <button @click="handleSignOut" class="btn btn-primary">Sign Out</button>
      </div>
    </div>
    
    <!-- Loading state -->
    <div v-else-if="loading" class="w-full max-w-2xl">
      <LoadingSpinner :size="50" message="Loading user information..." :centered="true" />
    </div>
    
    <!-- Landing page for non-signed-in users -->
    <div v-else class="w-full max-w-5xl">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="bg-gradient-to-br from-teal to-sky p-12 text-white text-center">
          <h1 class="text-4xl font-bold mb-4">Welcome to You're Next Great App</h1>
          <p class="text-xl mb-8">The easiest way to start your next project with authentication built-in</p>
          <div class="flex justify-center gap-4">
            <NuxtLink to="/login" class="bg-white text-teal hover:bg-mint px-6 py-3 rounded-lg font-medium transition-colors">
              Sign In
            </NuxtLink>
            <NuxtLink to="/register" class="bg-transparent hover:bg-white/20 text-white border border-white px-6 py-3 rounded-lg font-medium transition-colors">
              Create Account
            </NuxtLink>
          </div>
        </div>
        
        <div class="p-10">
          <h2 class="text-2xl font-bold text-teal text-center mb-8">Features</h2>
          
          <div class="grid md:grid-cols-3 gap-8">
            <div class="bg-mint/20 p-6 rounded-lg">
              <div class="text-teal mb-4 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-teal text-center mb-2">Authentication Ready</h3>
              <p class="text-teal text-center">Built-in authentication with email and social providers</p>
            </div>
            
            <div class="bg-mint/20 p-6 rounded-lg">
              <div class="text-teal mb-4 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-teal text-center mb-2">Modern Stack</h3>
              <p class="text-teal text-center">Built with Vue 3, Nuxt, and Tailwind CSS</p>
            </div>
            
            <div class="bg-mint/20 p-6 rounded-lg">
              <div class="text-teal mb-4 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                  <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                  <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-teal text-center mb-2">Ready to Scale</h3>
              <p class="text-teal text-center">Designed to grow with your project needs</p>
            </div>
          </div>
          
          <div class="mt-10 text-center">
            <p class="text-teal mb-4">Get started in seconds with our pre-built authentication flow</p>
            <NuxtLink to="/login" class="btn btn-primary inline-block max-w-xs">
              Sign In Now
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const client = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()
const loading = ref(true)

// Check authentication status
onMounted(async () => {
  try {
    // Wait a moment to check if user is authenticated
    await new Promise(resolve => setTimeout(resolve, 500))
    loading.value = false
  } catch (error) {
    console.error('Error checking authentication:', error)
    loading.value = false
  }
})

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  return date.toLocaleString()
}

async function handleSignOut() {
  try {
    await client.auth.signOut()
    router.push('/login')
  } catch (error) {
    console.error('Error signing out:', error)
  }
}
</script>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #E2E2E2; /* Light gray */
  padding: 20px;
}

.welcome-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 600px;
}

.mint-welcome {
  background: linear-gradient(to bottom right, #D1E8E2, #A9D6E5); /* Mint green to light sky blue */
  color: #19747E; /* Deep teal */
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.mint-welcome h1 {
  margin-top: 0;
  margin-bottom: 16px;
  color: #19747E; /* Deep teal */
}

.welcome-message {
  font-size: 18px;
  margin-bottom: 0;
  color: #19747E; /* Deep teal */
}

.user-info-section {
  margin-top: 30px;
}

h2 {
  color: #19747E; /* Deep teal */
  margin-bottom: 20px;
  text-align: center;
}

.user-info {
  display: flex;
  margin-bottom: 30px;
  padding: 20px;
  background-color: #D1E8E2; /* Mint green */
  border-radius: 8px;
}

.user-details {
  flex: 1;
  margin-left: 20px;
}

.user-details p {
  margin: 8px 0;
  color: #19747E; /* Deep teal */
}

.loading {
  width: 100%;
  max-width: 600px;
}
</style> 