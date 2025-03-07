<template>
  <div class="flex justify-center items-center min-h-screen bg-lightgray p-5">
    <div class="bg-white rounded-lg shadow-md p-10 w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-teal text-center">Sign In to Your Next Great App</h1>
      <p v-if="error" class="text-red-600 mb-4 text-center text-sm">{{ error }}</p>
      
      <form @submit.prevent="handleEmailLogin">
        <div class="mb-5">
          <label for="email" class="form-label">Email</label>
          <input 
            id="email"
            v-model="email" 
            type="email" 
            placeholder="your@email.com" 
            class="form-input"
            required
          />
        </div>
        
        <div class="mb-5">
          <label for="password" class="form-label">Password</label>
          <input 
            id="password"
            v-model="password" 
            type="password" 
            placeholder="••••••••" 
            class="form-input"
            required
          />
        </div>
        
        <button 
          type="submit" 
          class="btn btn-primary"
          :disabled="loading"
        >
          <span v-if="loading" class="absolute inset-0 flex items-center justify-center">
            <span class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          </span>
          <span :class="{ 'invisible': loading }">Sign in with Email</span>
        </button>
      </form>
      
      <div class="flex items-center my-6">
        <div class="flex-1 border-b border-mint"></div>
        <span class="px-3 text-teal text-sm">OR</span>
        <div class="flex-1 border-b border-mint"></div>
      </div>
      
      <GoogleSignInButton @error="handleGoogleError" />
      
      <p class="mt-6 text-center text-sm text-teal">
        Don't have an account? <NuxtLink to="/register" class="text-teal font-bold no-underline hover:underline">Sign up</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
const client = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)

// If user is already logged in, redirect to home
watchEffect(() => {
  if (user.value) {
    router.push('/')
  }
})

async function handleEmailLogin() {
  try {
    loading.value = true
    error.value = null
    
    const { error: err } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })
    
    if (err) throw err
    
    // Successful login will trigger the watchEffect above
  } catch (err) {
    error.value = err.message || 'An error occurred during sign in'
  } finally {
    loading.value = false
  }
}

function handleGoogleError(errorMessage) {
  error.value = errorMessage
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #E2E2E2; /* Light gray */
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

h1 {
  margin-top: 0;
  margin-bottom: 24px;
  color: #19747E; /* Deep teal */
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #19747E; /* Deep teal */
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #D1E8E2; /* Mint green */
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #19747E; /* Deep teal */
  outline: none;
}

.divider {
  display: flex;
  align-items: center;
  margin: 24px 0;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #D1E8E2; /* Mint green */
}

.divider span {
  padding: 0 10px;
  color: #19747E; /* Deep teal */
  font-size: 14px;
}

.error {
  color: #e53e3e;
  margin-bottom: 16px;
  text-align: center;
  font-size: 14px;
}

.signup-link {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #19747E; /* Deep teal */
}

.signup-link a {
  color: #19747E; /* Deep teal */
  text-decoration: none;
  font-weight: bold;
}

.signup-link a:hover {
  text-decoration: underline;
}
</style> 