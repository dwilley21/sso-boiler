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
