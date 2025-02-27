// Import the cookie package directly
import * as cookieModule from 'cookie'

export default defineNuxtPlugin((nuxtApp) => {
  // Only provide the cookie module if it hasn't been provided yet
  if (!nuxtApp.hasOwnProperty('$cookie')) {
    // Provide the cookie module to the app
    nuxtApp.provide('cookie', cookieModule)
    
    // Log for debugging
    console.log('Cookie module initialized in server plugin')
  } else {
    console.log('Cookie module already provided, skipping server plugin initialization')
  }
}) 