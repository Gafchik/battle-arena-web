<script setup>
defineProps({
  label: { type: String, required: true },
  hp: { type: Number, required: true },
  max: { type: Number, default: 100 },
  color: { type: String, default: 'primary' },
})
</script>

<template>
  <div>
    <div class="row items-center justify-between text-caption q-mb-2px">
      <span>{{ label }}</span>
      <span class="text-weight-bold">{{ Math.max(0, hp) }}</span>
    </div>
    <q-linear-progress :value="Math.max(0, hp) / max" :color="color" size="12px" rounded />
  </div>
</template>
