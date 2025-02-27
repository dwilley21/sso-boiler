<template>
  <button 
    :class="[
      'btn',
      `btn-${variant}`,
      { 'relative': loading }
    ]" 
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <span v-if="loading" class="absolute inset-0 flex items-center justify-center">
      <span class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
    </span>
    <span :class="{ 'invisible': loading }" class="inline-block">
      <slot></slot>
    </span>
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'google'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  min-height: 2.75rem;
  width: 100%;
}

.app-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.app-button--primary {
  background-color: #19747E; /* Deep teal */
  color: white;
}

.app-button--primary:hover:not(:disabled) {
  background-color: #156570; /* Darker deep teal */
}

.app-button--secondary {
  background-color: #A9D6E5; /* Light sky blue */
  color: #19747E; /* Deep teal */
}

.app-button--secondary:hover:not(:disabled) {
  background-color: #8ec7d9; /* Darker light sky blue */
}

.app-button--outline {
  background-color: transparent;
  color: #19747E; /* Deep teal */
  border: 1px solid #19747E; /* Deep teal */
}

.app-button--outline:hover:not(:disabled) {
  background-color: rgba(25, 116, 126, 0.05); /* Deep teal with transparency */
}

.app-button--google {
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-button--google:hover:not(:disabled) {
  background-color: #f8f8f8;
}

.app-button--loading .app-button__content {
  visibility: hidden;
}

.app-button__loader {
  position: absolute;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

.app-button--outline .app-button__loader,
.app-button--google .app-button__loader {
  border: 2px solid rgba(25, 116, 126, 0.3); /* Deep teal with transparency */
  border-top-color: #19747E; /* Deep teal */
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 