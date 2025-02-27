export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser()
  const client = useSupabaseClient()
  
  console.log(`Auth middleware running for route: ${to.path}`)
  console.log(`Current user state:`, user.value ? `Authenticated as ${user.value.email}` : 'Not authenticated')
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/confirm', '/debug', '/test-auth', '/check-providers', '/auth-success']
  
  // Check if this is a public route
  if (publicRoutes.includes(to.path)) {
    console.log(`Accessing public route: ${to.path}, allowing access`)
    return
  }
  
  // If user is not logged in, try to refresh the session
  if (!user.value) {
    console.log('No user found, attempting to refresh session')
    try {
      const { data, error } = await client.auth.getSession()
      console.log('Session refresh result:', data ? 'Session found' : 'No session', error ? `Error: ${error.message}` : 'No error')
      
      // If still no user after refresh, redirect to login
      if (!data.session) {
        console.log('No session after refresh, redirecting to login')
        return navigateTo('/login')
      }
    } catch (e) {
      console.error('Error refreshing session:', e)
      return navigateTo('/login')
    }
  }
  
  // If user is logged in and trying to access login or register page
  if (user.value && (to.path === '/login' || to.path === '/register')) {
    console.log('User is authenticated but trying to access login/register, redirecting to home')
    return navigateTo('/')
  }
}) 