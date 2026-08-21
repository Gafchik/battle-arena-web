<script setup>
import HpBar from './HpBar.vue'

defineProps({
  youHp: { type: Number, required: true },
  oppHp: { type: Number, required: true },
  youPhoto: { type: String, default: null },
  oppPhoto: { type: String, default: null },
  oppLabel: { type: String, default: 'Соперник' },
  oppEmoji: { type: String, default: '🤖' },
})
</script>

<template>
  <div class="battle-hud ba-card">
    <div class="battle-hud__side">
      <HpBar label="Ты" :photo-url="youPhoto" :hp="youHp" side="you" />
    </div>
    <div class="battle-hud__vs">VS</div>
    <div class="battle-hud__side">
      <HpBar :label="oppLabel" :photo-url="oppPhoto" :fallback-emoji="oppEmoji" :hp="oppHp" side="opp" />
    </div>
  </div>
</template>

<style scoped>
.battle-hud {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
}
.battle-hud__side {
  flex: 1;
  min-width: 0;
}
.battle-hud__vs {
  flex: none;
  font-size: 11px;
  font-weight: 800;
  color: var(--ba-ink-soft);
  letter-spacing: 0.04em;
}
</style>
