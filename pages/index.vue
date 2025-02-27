<template>
  <div class="flex justify-center items-center min-h-screen bg-lightgray p-5">
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
    <div v-else class="w-full max-w-2xl">
      <LoadingSpinner :size="50" message="Loading user information..." :centered="true" />
    </div>
  </div>
</template>

<script setup>
const client = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

// Redirect to login if not authenticated
onMounted(() => {
  if (!user.value) {
    router.push('/login')
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