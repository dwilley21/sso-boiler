<template>
  <div class="inline-block">
    <img 
      v-if="avatarUrl" 
      :src="avatarUrl" 
      :alt="alt"
      class="rounded-full object-cover"
      :style="{
        width: `${size}px`,
        height: `${size}px`
      }"
    />
    <div 
      v-else 
      class="rounded-full text-offwhite flex items-center justify-center font-bold"
      :style="{ 
        backgroundColor: bgColor,
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size / 2.5}px`
      }"
    >
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
    default: '#544235' // Brown color
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
  color: #FBF8F5; /* offwhite color */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: v-bind('`${props.size / 2.5}px`');
  font-weight: bold;
}
</style> 