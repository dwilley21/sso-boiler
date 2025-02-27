<template>
  <div class="loading-container" :class="{ centered }">
    <div 
      class="loading-spinner" 
      :style="{ 
        width: `${size}px`, 
        height: `${size}px`,
        borderWidth: `${size / 10}px`,
        borderTopWidth: `${size / 10}px`
      }"
    ></div>
    <p v-if="message" class="loading-message">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: Number,
    default: 50
  },
  message: {
    type: String,
    default: ''
  },
  centered: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-container.centered {
  justify-content: center;
  min-height: 200px;
}

.loading-spinner {
  border: 5px solid #f3f3f3;
  border-radius: 50%;
  border-top: 5px solid #4f46e5;
  animation: spin 1s linear infinite;
}

.loading-message {
  margin-top: 16px;
  color: #555;
  text-align: center;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 