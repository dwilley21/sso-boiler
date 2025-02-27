<template>
  <div class="home-container">
    <div v-if="user" class="welcome-card">
      <h1>Welcome, {{ user.email || 'User' }}!</h1>
      <div class="user-info">
        <UserAvatar :user="user" :size="80" />
        <div class="user-details">
          <p><strong>User ID:</strong> {{ user.id }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Provider:</strong> {{ user.app_metadata?.provider || 'Email' }}</p>
          <p><strong>Last Sign In:</strong> {{ formatDate(user.last_sign_in_at) }}</p>
        </div>
      </div>
      <AppButton @click="handleSignOut">Sign Out</AppButton>
    </div>
    <div v-else class="loading">
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
  background-color: #f5f5f5;
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

h1 {
  margin-top: 0;
  margin-bottom: 24px;
  color: #333;
  text-align: center;
}

.user-info {
  display: flex;
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.user-details {
  flex: 1;
  margin-left: 20px;
}

.user-details p {
  margin: 8px 0;
  color: #555;
}

.loading {
  width: 100%;
  max-width: 600px;
}
</style> 