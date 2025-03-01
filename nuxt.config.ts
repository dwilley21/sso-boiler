// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss'
  ],
  // Set server port to 3000
  app: {
    baseURL: '/',
    head: {
      script: [
        {
          src: '/cookie-fix.js',
          type: 'text/javascript',
          async: false,
          defer: false,
          hid: 'cookie-fix',
          key: 'cookie-fix'
        }
      ]
    }
  },
  // Add CSS
  css: ['~/assets/css/main.css'],
  // Configure dev server port
  devServer: {
    port: 3000
  },
  // Tailwind configuration
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    viewer: false,
  },
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/'],
    },
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 8, // 8 hours
      sameSite: 'lax',
      path: '/'
    },
    clientOptions: {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      }
    }
  },
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || 'http://localhost:3000',
      supabase: {
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_KEY,
      }
    }
  },
  // Simplified Vite configuration
  vite: {
    optimizeDeps: {
      include: [
        '@supabase/supabase-js',
      ]
    },
    resolve: {
      dedupe: ['vue'],
      alias: {
        // Fix the path to the cookie module - use our shim instead
        'cookie': resolve(process.cwd(), './public/cookie-fix.js')
      }
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true
      }
    }
  },
})
