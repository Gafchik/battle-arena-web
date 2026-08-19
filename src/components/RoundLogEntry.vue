<script setup>
const props = defineProps({
  round: { type: Object, required: true },
  youLabel: { type: String, default: 'Ты' },
  oppLabel: { type: String, default: 'Бот' },
})

const ZONE_LABEL = { head: 'голову', chest: 'грудь', groin: 'пах', legs: 'ноги' }
const ZONE_EMOJI = { head: '🎯', chest: '🫀', groin: '🩹', legs: '🦶' }

function zoneEmojis(zones) {
  return (zones || []).map((z) => ZONE_EMOJI[z]).join(' ')
}

function resultIcon(damage, blocked) {
  if (damage === 0) return '➖'
  return blocked ? '🛡️' : '💥'
}
</script>

<template>
  <div class="round-entry">
    <div class="round-entry__title">Раунд {{ round.round }}</div>

    <div v-if="round.a_attack" class="round-entry__line">
      👊 <b>{{ youLabel }}</b> бьёт {{ ZONE_EMOJI[round.a_attack] }} {{ ZONE_LABEL[round.a_attack] }}
      <span class="text-grey-7">· защита {{ zoneEmojis(round.a_defend) }}</span>
    </div>
    <div v-else class="round-entry__line text-grey-7">😴 {{ youLabel }} не успел сходить</div>

    <div v-if="round.b_attack" class="round-entry__line">
      🤖 <b>{{ oppLabel }}</b> бьёт {{ ZONE_EMOJI[round.b_attack] }} {{ ZONE_LABEL[round.b_attack] }}
      <span class="text-grey-7">· защита {{ zoneEmojis(round.b_defend) }}</span>
    </div>
    <div v-else class="round-entry__line text-grey-7">😴 {{ oppLabel }} не успел сходить</div>

    <div class="round-entry__result">
      <span :class="round.b_damage > 0 && !round.b_blocked ? 'text-negative' : 'text-grey-7'">
        {{ resultIcon(round.b_damage, round.b_blocked) }} {{ oppLabel }} −{{ round.b_damage }} HP ({{ round.b_hp_after }})
      </span>
      <span :class="round.a_damage > 0 && !round.a_blocked ? 'text-negative' : 'text-grey-7'">
        {{ resultIcon(round.a_damage, round.a_blocked) }} {{ youLabel }} −{{ round.a_damage }} HP ({{ round.a_hp_after }})
      </span>
    </div>
  </div>
</template>

<style scoped>
.round-entry {
  padding: 10px 12px;
  border-bottom: 1px solid #eee;
}
.round-entry__title {
  font-weight: 700;
  font-size: 12px;
  opacity: 0.5;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.round-entry__line {
  font-size: 14px;
  line-height: 1.5;
}
.round-entry__result {
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 14px;
  font-weight: 600;
}
</style>
