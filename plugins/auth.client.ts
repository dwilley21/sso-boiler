import type { AuthChangeEvent, Session } from '~/types/supabase'

export default defineNuxtPlugin(async () => {
  const client = useSupabaseClient()
  const user = useSupabaseUser()
  const router = useRouter()
  const route = useRoute()

  console.log('Auth plugin initialized')
  
  // Check for existing session on startup
  try {
    console.log('Checking for existing session')
    const { data, error } = await client.auth.getSession()
    
    if (error) {
      console.error('Error getting initial session:', error)
    } else if (data.session) {
      console.log('Initial session found:', data.session.user.email)
      // Explicitly set the user state
      useState('supabase_user').value = data.session.user
    } else {
      console.log('No initial session found')
    }
  } catch (e) {
    console.error('Exception checking initial session:', e)
  }

  // Listen for auth state changes
  const { data } = client.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
    console.log('Auth state change:', event, session ? `User: ${session.user.email}` : 'No session')
    
    // Update the user ref
    user.value = session?.user || null
    
    // Handle sign in and sign out events
    if (event === 'SIGNED_IN') {
      console.log('SIGNED_IN event detected')
      
      // If user is on login or register page, redirect to home
      if (route.path === '/login' || route.path === '/register') {
        console.log('Redirecting from login/register to home after sign in')
        router.push('/')
      }
    } else if (event === 'SIGNED_OUT') {
      console.log('SIGNED_OUT event detected')
      // Redirect to login page
      router.push('/login')
    } else if (event === 'TOKEN_REFRESHED') {
      console.log('TOKEN_REFRESHED event detected')
    } else if (event === 'USER_UPDATED') {
      console.log('USER_UPDATED event detected')
    }
  })
  
  // Clean up the subscription when the plugin is unmounted
  onUnmounted(() => {
    data.subscription.unsubscribe()
  })
}) 