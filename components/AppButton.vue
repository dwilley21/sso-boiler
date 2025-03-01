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
      <span class="w-5 h-5 border-2 border-offwhite/30 border-t-offwhite rounded-full animate-spin"></span>
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
  background-color: #544235; /* Brown */
  color: #FBF8F5; /* Offwhite */
}

.app-button--primary:hover:not(:disabled) {
  background-color: #6A5445; /* Lighter brown */
}

.app-button--secondary {
  background-color: #B8A695; /* Taupe */
  color: #544235; /* Brown */
}

.app-button--secondary:hover:not(:disabled) {
  background-color: #C9BDB0; /* Lighter taupe */
}

.app-button--outline {
  background-color: transparent;
  color: #544235; /* Brown */
  border: 1px solid #B8A695; /* Taupe */
}

.app-button--outline:hover:not(:disabled) {
  background-color: rgba(184, 166, 149, 0.1); /* Taupe with transparency */
}

.app-button--google {
  background-color: #FBF8F5; /* Offwhite */
  color: #544235; /* Brown */
  border: 1px solid #B8A695; /* Taupe */
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-button--google:hover:not(:disabled) {
  background-color: #F0EDE9; /* Darker offwhite */
}

.app-button--loading .app-button__content {
  visibility: hidden;
}

.app-button__loader {
  position: absolute;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(251, 248, 245, 0.3); /* Offwhite with transparency */
  border-radius: 50%;
  border-top-color: #FBF8F5; /* Offwhite */
  animation: spin 0.8s linear infinite;
}

.app-button--outline .app-button__loader,
.app-button--google .app-button__loader {
  border: 2px solid rgba(84, 66, 53, 0.3); /* Brown with transparency */
  border-top-color: #544235; /* Brown */
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 