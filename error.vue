<template>
  <div class="error-container">
    <div class="error-card">
      <h1>{{ error.statusCode }}</h1>
      <h2>{{ error.message || 'Something went wrong' }}</h2>
      <p>Sorry, an error occurred while processing your request.</p>
      <AppButton @click="handleError">Back to Home</AppButton>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  error: {
    type: Object,
    required: true
  }
})

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<style scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.error-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 500px;
  text-align: center;
}

h1 {
  font-size: 5rem;
  margin: 0;
  color: #4f46e5;
}

h2 {
  margin-top: 0;
  margin-bottom: 16px;
  color: #333;
}

p {
  margin-bottom: 24px;
  color: #666;
}
</style> 