<template>
  <div class="flex flex-col min-h-screen">
    <header class="bg-brown text-offwhite py-4">
      <div class="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <h1 class="text-2xl font-normal m-0">Your Next Great App</h1>
        <div class="flex items-center gap-4">
          <template v-if="user">
            <UserAvatar :user="user" :size="32" />
            <span class="hidden sm:inline">{{ user.email }}</span>
            <button 
              @click="handleSignOut"
              class="bg-taupe/20 hover:bg-taupe/30 text-offwhite border-none py-2 px-4 rounded transition-colors"
            >
              Sign Out
            </button>
          </template>
          <template v-else>
            <NuxtLink 
              to="/login" 
              class="bg-taupe/20 hover:bg-taupe/30 text-offwhite border-none py-2 px-4 rounded transition-colors"
            >
              Sign In
            </NuxtLink>
            <NuxtLink 
              to="/register" 
              class="bg-offwhite text-brown hover:bg-offwhite-dark border-none py-2 px-4 rounded transition-colors"
            >
              Create Account
            </NuxtLink>
          </template>
        </div>
      </div>
    </header>
    
    <main class="flex-1">
      <slot />
    </main>
    
    <footer class="bg-cream py-4 text-center text-brown">
      <p>&copy; {{ new Date().getFullYear() }} Your Next Great App</p>
      <p class="mt-2 text-sm">
        <NuxtLink to="/debug" class="text-brown no-underline hover:underline">Debug</NuxtLink>
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
    router.push('/')
  } catch (error) {
    console.error('Error signing out:', error)
  }
}
</script> 