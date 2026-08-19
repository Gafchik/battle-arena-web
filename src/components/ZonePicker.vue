<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  disabled: { type: Boolean, default: false },
})
const emit = defineEmits(['submit'])

const zones = [
  { value: 'head', label: 'Голова' },
  { value: 'chest', label: 'Грудь' },
  { value: 'groin', label: 'Пах' },
  { value: 'legs', label: 'Ноги' },
]

const attack = ref(null)
const defend = ref([])

function toggleDefend(zone) {
  if (props.disabled) return
  const idx = defend.value.indexOf(zone)
  if (idx >= 0) {
    defend.value.splice(idx, 1)
  } else if (defend.value.length < 2) {
    defend.value.push(zone)
  }
}

const canSubmit = computed(() => attack.value !== null && defend.value.length === 2)

function submit() {
  if (!canSubmit.value) return
  emit('submit', { attack: attack.value, defend: [...defend.value] })
  attack.value = null
  defend.value = []
}
</script>

<template>
  <div>
    <div class="text-subtitle2 q-mb-xs">Атака — выбери 1 зону</div>
    <div class="row q-gutter-sm q-mb-md">
      <q-btn
        v-for="z in zones"
        :key="'a-' + z.value"
        :label="z.label"
        :color="attack === z.value ? 'negative' : 'grey-3'"
        :text-color="attack === z.value ? 'white' : 'dark'"
        :disable="disabled"
        unelevated
        @click="attack = z.value"
      />
    </div>

    <div class="text-subtitle2 q-mb-xs">Защита — выбери 2 зоны</div>
    <div class="row q-gutter-sm q-mb-md">
      <q-btn
        v-for="z in zones"
        :key="'d-' + z.value"
        :label="z.label"
        :color="defend.includes(z.value) ? 'primary' : 'grey-3'"
        :text-color="defend.includes(z.value) ? 'white' : 'dark'"
        :disable="disabled"
        unelevated
        @click="toggleDefend(z.value)"
      />
    </div>

    <q-btn
      color="positive"
      label="Подтвердить ход"
      class="full-width"
      :disable="!canSubmit || disabled"
      :loading="disabled"
      @click="submit"
    />
  </div>
</template>
