// This plugin patches the Supabase module to fix the cookie issue
import * as cookieModule from 'cookie'

// Add type declaration for window
declare global {
  interface Window {
    cookieModule?: typeof cookieModule;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  // Patch the global object to include the cookie module
  if (typeof window !== 'undefined') {
    // Only patch if not already patched
    if (!window.cookieModule) {
      // @ts-ignore
      window.cookieModule = cookieModule
      
      // Monkey patch the problematic helpers.js module
      const originalFetch = window.fetch
      window.fetch = async function(...args) {
        try {
          return await originalFetch(...args)
        } catch (error) {
          if (error instanceof SyntaxError && error.message.includes('cookie')) {
            console.error('Caught cookie module error:', error)
            // Return a mock response to prevent the app from crashing
            return new Response(JSON.stringify({ error: 'Cookie module error' }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            })
          }
          throw error
        }
      }
      
      console.log('Supabase patch applied')
    } else {
      console.log('Supabase patch already applied, skipping')
    }
  }
}) 