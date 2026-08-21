<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '@/services/api'
import BattleHud from '@/components/BattleHud.vue'
import RoundLogEntry from '@/components/RoundLogEntry.vue'
import { myTelegramUser } from '@/services/telegramUser'

const props = defineProps({ id: { type: String, required: true } })

const battle = ref(null)
const rounds = ref([])
const loading = ref(true)
const me = myTelegramUser()

onMounted(async () => {
  const data = await api.getBattle(props.id)
  battle.value = data.battle
  rounds.value = data.rounds
  loading.value = false
})

const isPvp = computed(() => battle.value?.mode === 'pvp')
const iAmSideB = computed(() => isPvp.value && battle.value?.your_side === 'b')
const isWaiting = computed(() => battle.value?.status === 'waiting_for_opponent')

const yourHp = computed(() => (iAmSideB.value ? battle.value?.b_hp : battle.value?.a_hp))
const oppHp = computed(() => (iAmSideB.value ? battle.value?.a_hp : battle.value?.b_hp))
const oppLabel = computed(() => (isPvp.value ? battle.value?.opponent?.first_name ?? 'Соперник' : 'Бот'))
const oppPhoto = computed(() => (isPvp.value ? battle.value?.opponent?.photo_url : null))

const youWon = computed(() => battle.value?.winner === battle.value?.your_side)
const RESULT = {
  forfeit_both: { emoji: '😴', text: 'Оба не успели сходить', class: 'result-banner--draw' },
  draw: { emoji: '🤝', text: 'Ничья', class: 'result-banner--draw' },
  win: { emoji: '🏆', text: 'Победа', class: 'result-banner--win' },
  loss: { emoji: '💀', text: 'Поражение', class: 'result-banner--loss' },
}
const resultState = computed(() => {
  if (!battle.value || battle.value.status !== 'completed') return null
  if (battle.value.winner === 'forfeit_both') return RESULT.forfeit_both
  if (battle.value.winner === 'draw') return RESULT.draw
  return youWon.value ? RESULT.win : RESULT.loss
})

const roundsFromYourView = computed(() => {
  if (!iAmSideB.value) return [...rounds.value].reverse()
  return [...rounds.value].reverse().map((r) => ({
    round: r.round,
    a_attack: r.b_attack,
    a_defend: r.b_defend,
    b_attack: r.a_attack,
    b_defend: r.a_defend,
    a_damage: r.b_damage,
    b_damage: r.a_damage,
    a_blocked: r.b_blocked,
    b_blocked: r.a_blocked,
    a_hp_after: r.b_hp_after,
    b_hp_after: r.a_hp_after,
  }))
})
</script>

<template>
  <q-page class="q-pa-md">
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner size="40px" color="primary" />
    </div>

    <template v-else-if="battle">
      <template v-if="isWaiting">
        <div class="text-center q-pa-xl">
          <div class="text-h6 q-mb-sm">⏳ Ждёт соперника</div>
          <div class="text-grey q-mb-md">Этот вызов ещё не начался</div>
          <q-btn color="primary" label="Открыть вызов" to="/challenge" />
        </div>
      </template>

      <template v-else>
        <div class="q-mb-md">
          <BattleHud :you-hp="yourHp" :opp-hp="oppHp" :you-photo="me.photoUrl" :opp-photo="oppPhoto" :opp-label="oppLabel" :opp-emoji="isPvp ? '🙂' : '🤖'" />
        </div>

        <div v-if="resultState" class="result-banner q-mb-md" :class="resultState.class">
          {{ resultState.emoji }} {{ resultState.text }}
        </div>

        <div class="ba-card">
          <div v-if="roundsFromYourView.length === 0" class="log-empty">В этом бою ещё не было раундов</div>
          <RoundLogEntry v-for="r in roundsFromYourView" :key="r.round" :round="r" youLabel="Ты" :oppLabel="oppLabel" />
        </div>
      </template>
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

.log-empty {
  padding: 16px;
  text-align: center;
  font-size: 13px;
  color: var(--ba-ink-soft);
}
</style>
