<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Create Account</h1>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
      
      <form @submit.prevent="handleRegister">
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
          <p class="password-hint">Password must be at least 6 characters</p>
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input 
            id="confirmPassword"
            v-model="confirmPassword" 
            type="password" 
            placeholder="••••••••" 
            required
          />
        </div>
        
        <AppButton 
          type="submit" 
          :loading="loading"
        >
          Create Account
        </AppButton>
      </form>
      
      <div class="divider">
        <span>OR</span>
      </div>
      
      <GoogleSignInButton 
        label="Sign up with Google" 
        @error="handleGoogleError" 
      />
      
      <p class="login-link">
        Already have an account? <NuxtLink to="/login">Sign in</NuxtLink>
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
const confirmPassword = ref('')
const loading = ref(false)
const error = ref(null)
const success = ref(null)

// If user is already logged in, redirect to home
watchEffect(() => {
  if (user.value) {
    router.push('/')
  }
})

async function handleRegister() {
  try {
    // Reset messages
    error.value = null
    success.value = null
    
    // Validate passwords match
    if (password.value !== confirmPassword.value) {
      error.value = 'Passwords do not match'
      return
    }
    
    // Validate password length
    if (password.value.length < 6) {
      error.value = 'Password must be at least 6 characters'
      return
    }
    
    loading.value = true
    
    const { error: err, data } = await client.auth.signUp({
      email: email.value,
      password: password.value
    })
    
    if (err) throw err
    
    // Check if email confirmation is required
    if (data?.user && data?.session) {
      // Auto sign-in (no email confirmation required)
      // The watchEffect will handle the redirect
    } else {
      // Email confirmation required
      success.value = 'Registration successful! Please check your email to confirm your account.'
      email.value = ''
      password.value = ''
      confirmPassword.value = ''
    }
  } catch (err) {
    error.value = err.message || 'An error occurred during registration'
  } finally {
    loading.value = false
  }
}

function handleGoogleError(errorMessage) {
  error.value = errorMessage
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.register-card {
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

.password-hint {
  font-size: 12px;
  color: #777;
  margin-top: 4px;
  margin-bottom: 0;
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

.success {
  color: #38a169;
  margin-bottom: 16px;
  text-align: center;
  font-size: 14px;
}

.login-link {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #555;
}

.login-link a {
  color: #4f46e5;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style> 