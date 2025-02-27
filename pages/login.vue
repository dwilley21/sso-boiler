<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Sign In</h1>
      <p v-if="error" class="error">{{ error }}</p>
      
      <form @submit.prevent="handleEmailLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email"
            v-model="email" 
            type="email" 
            placeholder="your@email.com" 
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password"
            v-model="password" 
            type="password" 
            placeholder="••••••••" 
            required
          />
        </div>
        
        <AppButton 
          type="submit" 
          :loading="loading"
        >
          Sign in with Email
        </AppButton>
      </form>
      
      <div class="divider">
        <span>OR</span>
      </div>
      
      <GoogleSignInButton @error="handleGoogleError" />
      
      <p class="signup-link">
        Don't have an account? <NuxtLink to="/register">Sign up</NuxtLink>
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
  background-color: #f5f5f5;
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
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #4f46e5;
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
  border-bottom: 1px solid #ddd;
}

.divider span {
  padding: 0 10px;
  color: #777;
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
  color: #555;
}

.signup-link a {
  color: #4f46e5;
  text-decoration: none;
}

.signup-link a:hover {
  text-decoration: underline;
}
</style> 