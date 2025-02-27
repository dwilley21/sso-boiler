<template>
  <div class="user-avatar">
    <img 
      v-if="avatarUrl" 
      :src="avatarUrl" 
      :alt="alt"
      class="avatar-image"
    />
    <div v-else class="avatar-placeholder" :style="{ backgroundColor: bgColor }">
      {{ initials }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  user: {
    type: Object,
    default: null
  },
  size: {
    type: Number,
    default: 80
  },
  alt: {
    type: String,
    default: 'User avatar'
  },
  bgColor: {
    type: String,
    default: '#4f46e5'
  }
})

const avatarUrl = computed(() => {
  return props.user?.user_metadata?.avatar_url || null
})

const initials = computed(() => {
  if (!props.user) return '?'
  
  const email = props.user.email || ''
  if (email) {
    return email.charAt(0).toUpperCase()
  }
  
  return props.user.id.substring(0, 1).toUpperCase()
})
</script>

<style scoped>
.user-avatar {
  display: inline-block;
}

.avatar-image {
  width: v-bind('`${props.size}px`');
  height: v-bind('`${props.size}px`');
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: v-bind('`${props.size}px`');
  height: v-bind('`${props.size}px`');
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: v-bind('`${props.size / 2.5}px`');
  font-weight: bold;
}
</style> 