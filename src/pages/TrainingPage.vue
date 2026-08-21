<script setup>
import { onMounted } from 'vue'
import { useBattleStore } from '@/stores/battle'
import BattleHud from '@/components/BattleHud.vue'
import ZonePicker from '@/components/ZonePicker.vue'
import RoundLogEntry from '@/components/RoundLogEntry.vue'
import { myTelegramUser } from '@/services/telegramUser'

const battle = useBattleStore()
const me = myTelegramUser()

onMounted(() => {
  battle.startTraining()
})

function onSubmit(move) {
  battle.submitMove(move)
}

const RESULT = {
  a: { emoji: '🏆', text: 'Победа!', class: 'result-banner--win' },
  b: { emoji: '💀', text: 'Поражение', class: 'result-banner--loss' },
  draw: { emoji: '🤝', text: 'Ничья', class: 'result-banner--draw' },
}
</script>

<template>
  <q-page class="q-pa-md column no-wrap" style="height: 100vh; box-sizing: border-box">
    <div v-if="!battle.current" class="text-center q-pa-xl">
      <q-spinner size="40px" color="primary" />
    </div>

    <template v-else>
      <div class="col-auto q-mb-md">
        <BattleHud :you-hp="battle.current.a_hp" :opp-hp="battle.current.b_hp" :you-photo="me.photoUrl" opp-label="Бот" opp-emoji="🤖" />
      </div>

      <div
        v-if="battle.current.status === 'completed'"
        class="col-auto result-banner q-mb-md"
        :class="RESULT[battle.current.winner]?.class"
      >
        {{ RESULT[battle.current.winner]?.emoji }} {{ RESULT[battle.current.winner]?.text }}
      </div>

      <div v-if="battle.error" class="col-auto text-negative q-mb-md">{{ battle.error }}</div>

      <div class="col-auto">
        <ZonePicker
          v-if="battle.current.status === 'in_progress'"
          :disabled="battle.submitting"
          @submit="onSubmit"
        />

        <q-btn
          v-else
          color="accent"
          text-color="secondary"
          label="На главную"
          class="full-width q-mb-md"
          unelevated
          to="/"
        />
      </div>

      <div class="col q-mt-md ba-card log-scroll" style="min-height: 0; overflow-y: auto">
        <div v-if="battle.rounds.length === 0" class="log-empty">Бой начался — сделай первый ход</div>
        <RoundLogEntry v-for="r in [...battle.rounds].reverse()" :key="r.round" :round="r" youLabel="Ты" oppLabel="Бот" />
      </div>
    </template>
  </q-page>
</template>

<style scoped>
.result-banner {
  text-align: center;
  font-size: 18px;
  font-weight: 800;
  padding: 10px;
  border-radius: var(--ba-radius-sm);
}
.result-banner--win { background: #E6F8EE; color: var(--ba-win); }
.result-banner--loss { background: var(--ba-opp-soft); color: var(--ba-opp); }
.result-banner--draw { background: var(--ba-surface-2); color: var(--ba-ink-soft); }

.log-scroll {
  overflow: hidden;
}
.log-empty {
  padding: 16px;
  text-align: center;
  font-size: 13px;
  color: var(--ba-ink-soft);
}
</style>
