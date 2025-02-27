<template>
  <div :class="['flex flex-col items-center', { 'justify-center min-h-[200px]': centered }]">
    <div 
      class="border-4 border-gray-200 rounded-full animate-spin"
      :class="{ 'border-t-teal': true }"
      :style="{ 
        width: `${size}px`, 
        height: `${size}px`,
        borderTopWidth: `${size / 10}px`,
        borderWidth: `${size / 10}px`
      }"
    ></div>
    <p v-if="message" class="mt-4 text-teal text-center">{{ message }}</p>
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