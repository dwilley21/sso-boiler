<template>
  <button 
    :class="[
      'app-button', 
      `app-button--${variant}`,
      { 'app-button--loading': loading }
    ]" 
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <span v-if="loading" class="app-button__loader"></span>
    <span v-else class="app-button__content">
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
  background-color: #4f46e5;
  color: white;
}

.app-button--primary:hover:not(:disabled) {
  background-color: #4338ca;
}

.app-button--secondary {
  background-color: #e5e7eb;
  color: #1f2937;
}

.app-button--secondary:hover:not(:disabled) {
  background-color: #d1d5db;
}

.app-button--outline {
  background-color: transparent;
  color: #4f46e5;
  border: 1px solid #4f46e5;
}

.app-button--outline:hover:not(:disabled) {
  background-color: rgba(79, 70, 229, 0.05);
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
  border: 2px solid rgba(79, 70, 229, 0.3);
  border-top-color: #4f46e5;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 