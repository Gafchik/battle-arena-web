<script setup>
defineProps({
  label: { type: String, required: true },
  photoUrl: { type: String, default: null },
  fallbackEmoji: { type: String, default: '👤' },
  hp: { type: Number, required: true },
  max: { type: Number, default: 100 },
  color: { type: String, default: 'primary' },
})
</script>

<template>
  <div>
    <div class="row items-center q-gutter-x-xs text-caption q-mb-2px no-wrap">
      <q-avatar size="20px">
        <img v-if="photoUrl" :src="photoUrl" />
        <span v-else>{{ fallbackEmoji }}</span>
      </q-avatar>
      <span class="ellipsis">{{ label }}</span>
      <q-space />
      <span class="text-weight-bold">{{ Math.max(0, hp) }}</span>
    </div>
    <q-linear-progress :value="Math.max(0, hp) / max" :color="color" size="12px" rounded />
  </div>
</template>
