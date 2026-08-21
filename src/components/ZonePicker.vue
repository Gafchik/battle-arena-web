<script setup>
import { ref, computed } from 'vue'
import ZoneIcon from './ZoneIcon.vue'
import { ZONES, ZONE_LABEL } from '@/services/zones'

const props = defineProps({
  disabled: { type: Boolean, default: false },
})
const emit = defineEmits(['submit'])

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

const summary = computed(() => {
  const a = attack.value ? ZONE_LABEL[attack.value] : '—'
  const d = defend.value.length ? defend.value.map((z) => ZONE_LABEL[z]).join(', ') : '—'
  return `Удар: ${a}  ·  Блок: ${d}`
})

function submit() {
  if (!canSubmit.value) return
  emit('submit', { attack: attack.value, defend: [...defend.value] })
  attack.value = null
  defend.value = []
}
</script>

<template>
  <div>
    <div class="picker-section">
      <div class="picker-section__label picker-section__label--attack">Куда бьёшь? Выбери 1 зону</div>
      <div class="zone-grid">
        <button
          v-for="z in ZONES"
          :key="'a-' + z.value"
          type="button"
          class="zone-btn zone-btn--attack"
          :class="{ 'zone-btn--active': attack === z.value }"
          :disabled="disabled"
          @click="attack = z.value"
        >
          <ZoneIcon :zone="z.value" :tone="attack === z.value ? 'attack' : 'muted'" :size="30" />
          <span>{{ z.label }}</span>
        </button>
      </div>
    </div>

    <div class="picker-section">
      <div class="picker-section__label picker-section__label--defend">Что закрываешь? Выбери 2 зоны</div>
      <div class="zone-grid">
        <button
          v-for="z in ZONES"
          :key="'d-' + z.value"
          type="button"
          class="zone-btn zone-btn--defend"
          :class="{ 'zone-btn--active': defend.includes(z.value) }"
          :disabled="disabled"
          @click="toggleDefend(z.value)"
        >
          <ZoneIcon :zone="z.value" :tone="defend.includes(z.value) ? 'defend' : 'muted'" :size="30" />
          <span>{{ z.label }}</span>
        </button>
      </div>
    </div>

    <div class="picker-summary">{{ summary }}</div>

    <q-btn
      color="accent"
      text-color="secondary"
      label="Подтвердить ход"
      class="full-width picker-submit"
      unelevated
      :disable="!canSubmit || disabled"
      :loading="disabled"
      @click="submit"
    />
  </div>
</template>

<style scoped>
.picker-section {
  margin-bottom: 12px;
}
.picker-section__label {
  font-size: 12.5px;
  font-weight: 700;
  margin-bottom: 6px;
}
.picker-section__label--attack { color: var(--ba-opp); }
.picker-section__label--defend { color: var(--ba-you); }

.zone-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.zone-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 2px 7px;
  border-radius: var(--ba-radius-sm);
  border: 1.5px solid var(--ba-border);
  background: var(--ba-surface);
  font-size: 11.5px;
  font-weight: 600;
  color: var(--ba-ink-soft);
  cursor: pointer;
  transition: border-color 0.12s, background 0.12s, transform 0.06s;
}
.zone-btn:active { transform: scale(0.96); }
.zone-btn:disabled { opacity: 0.6; cursor: default; }

.zone-btn--attack.zone-btn--active {
  border-color: var(--ba-opp);
  background: var(--ba-opp-soft);
  color: var(--ba-opp);
}
.zone-btn--defend.zone-btn--active {
  border-color: var(--ba-you);
  background: var(--ba-you-soft);
  color: var(--ba-you);
}

.picker-summary {
  text-align: center;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ba-ink-soft);
  margin-bottom: 10px;
}

.picker-submit {
  font-weight: 700;
}
</style>
