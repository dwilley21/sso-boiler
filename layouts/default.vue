<template>
  <div class="app-container">
    <header v-if="user" class="app-header">
      <div class="header-content">
        <h1 class="app-title">Nuxt SSO App</h1>
        <div class="user-menu">
          <UserAvatar :user="user" :size="32" />
          <span>{{ user.email }}</span>
          <AppButton 
            variant="outline" 
            @click="handleSignOut" 
            class="sign-out-btn"
          >
            Sign Out
          </AppButton>
        </div>
      </div>
    </header>
    
    <main class="app-main">
      <slot />
    </main>
    
    <footer class="app-footer">
      <p>&copy; {{ new Date().getFullYear() }} Nuxt SSO App</p>
      <p class="footer-links">
        <NuxtLink to="/debug" class="debug-link">Debug</NuxtLink>
      </p>
    </footer>
  </div>
</template>

<script setup>
const client = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

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
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background-color: #4f46e5;
  color: white;
  padding: 1rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-title {
  margin: 0;
  font-size: 1.5rem;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sign-out-btn {
  max-width: 120px;
  background-color: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  border: none !important;
}

.sign-out-btn:hover {
  background-color: rgba(255, 255, 255, 0.3) !important;
}

.app-main {
  flex: 1;
}

.app-footer {
  background-color: #f5f5f5;
  padding: 1rem;
  text-align: center;
  color: #666;
}

.footer-links {
  margin-top: 0.5rem;
  font-size: 0.8rem;
}

.debug-link {
  color: #999;
  text-decoration: none;
}

.debug-link:hover {
  text-decoration: underline;
}
</style> 