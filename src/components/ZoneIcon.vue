<script setup>
import { computed } from 'vue'

const props = defineProps({
  zone: { type: String, required: true }, // head | chest | groin | legs
  tone: { type: String, default: 'muted' }, // muted | attack | defend | block
  size: { type: [Number, String], default: 32 },
})

const TONE_COLOR = {
  muted: '#C7CCDA',
  attack: 'var(--ba-opp)',
  defend: 'var(--ba-you)',
  block: 'var(--ba-block)',
}

const activeFill = computed(() => TONE_COLOR[props.tone] ?? TONE_COLOR.muted)
const restFill = 'var(--ba-surface-2)'
const restStroke = '#D7DAE4'

function fillFor(part) {
  return part === props.zone ? activeFill.value : restFill
}
function strokeFor(part) {
  return part === props.zone ? activeFill.value : restStroke
}
function widthFor(part) {
  return part === props.zone ? 1.5 : 1
}
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 44 76" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="22" cy="10" r="9" :fill="fillFor('head')" :stroke="strokeFor('head')" :stroke-width="widthFor('head')" />
    <rect x="8" y="22" width="28" height="15" rx="6" :fill="fillFor('chest')" :stroke="strokeFor('chest')" :stroke-width="widthFor('chest')" />
    <rect x="12" y="37" width="20" height="13" rx="5" :fill="fillFor('groin')" :stroke="strokeFor('groin')" :stroke-width="widthFor('groin')" />
    <rect x="9" y="50" width="10" height="24" rx="5" :fill="fillFor('legs')" :stroke="strokeFor('legs')" :stroke-width="widthFor('legs')" />
    <rect x="25" y="50" width="10" height="24" rx="5" :fill="fillFor('legs')" :stroke="strokeFor('legs')" :stroke-width="widthFor('legs')" />
  </svg>
</template>
