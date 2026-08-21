<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  photoUrl: { type: String, default: null },
  fallbackEmoji: { type: String, default: '👤' },
  hp: { type: Number, required: true },
  max: { type: Number, default: 100 },
  side: { type: String, default: 'you' }, // you | opp
})

const clamped = computed(() => Math.max(0, props.hp))
const pct = computed(() => clamped.value / props.max)

const barColor = computed(() => {
  if (pct.value > 0.5) return 'positive'
  if (pct.value > 0.2) return 'warning'
  return 'negative'
})
</script>

<template>
  <div class="hp-bar" :class="`hp-bar--${side}`">
    <div class="hp-bar__head">
      <q-avatar size="26px" class="hp-bar__avatar">
        <img v-if="photoUrl" :src="photoUrl" />
        <span v-else>{{ fallbackEmoji }}</span>
      </q-avatar>
      <span class="hp-bar__name ellipsis">{{ label }}</span>
      <q-space />
      <span class="hp-bar__hp">{{ clamped }}</span>
    </div>
    <q-linear-progress :value="pct" :color="barColor" track-color="grey-3" size="10px" rounded class="hp-bar__track" />
  </div>
</template>

<style scoped>
.hp-bar__head {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  min-width: 0;
}
.hp-bar__avatar {
  border: 2px solid transparent;
}
.hp-bar--you .hp-bar__avatar { border-color: var(--ba-you); }
.hp-bar--opp .hp-bar__avatar { border-color: var(--ba-opp); }

.hp-bar__name {
  font-size: 12.5px;
  font-weight: 700;
  min-width: 0;
}
.hp-bar--you .hp-bar__name { color: var(--ba-you); }
.hp-bar--opp .hp-bar__name { color: var(--ba-opp); }

.hp-bar__hp {
  font-size: 13px;
  font-weight: 800;
  color: var(--ba-ink);
  font-variant-numeric: tabular-nums;
}

.hp-bar__track {
  transition: all 0.25s ease;
}
</style>
