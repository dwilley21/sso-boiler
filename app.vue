<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// Add our cookie fix script to the head
useHead({
  script: [
    {
      src: '/cookie-fix.js',
      type: 'text/javascript',
      // Make sure it loads before any other scripts
      async: false,
      defer: false,
      // Add a high priority to ensure it loads early
      hid: 'cookie-fix',
      // Add a timestamp to prevent caching
      key: `cookie-fix-${Date.now()}`
    }
  ]
})
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: #333;
}

* {
  box-sizing: border-box;
}
</style>
