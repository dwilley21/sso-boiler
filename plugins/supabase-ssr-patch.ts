// This plugin patches the Supabase SSR module to fix the cookie issue
import * as cookieModule from 'cookie'

export default defineNuxtPlugin((nuxtApp) => {
  // Monkey patch the global object to include the cookie module
  if (typeof window !== 'undefined') {
    // @ts-ignore
    if (!window.__NUXT_COOKIE_MODULE__) {
      // @ts-ignore
      window.__NUXT_COOKIE_MODULE__ = cookieModule
      console.log('Supabase SSR patch applied (client)')
    }
  } else {
    // @ts-ignore
    if (!global.__NUXT_COOKIE_MODULE__) {
      // @ts-ignore
      global.__NUXT_COOKIE_MODULE__ = cookieModule
      console.log('Supabase SSR patch applied (server)')
    }
  }
}) 