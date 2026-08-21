<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { api } from '@/services/api'
import BattleHud from '@/components/BattleHud.vue'
import ZonePicker from '@/components/ZonePicker.vue'
import RoundLogEntry from '@/components/RoundLogEntry.vue'
import { myTelegramUser } from '@/services/telegramUser'

const props = defineProps({ id: { type: String, required: true } })

const battle = ref(null)
const rounds = ref([])
const submitting = ref(false)
const error = ref(null)
const secondsLeft = ref(null)
const me = myTelegramUser()
let pollTimer = null
let tickTimer = null

async function refresh() {
  const data = await api.getBattle(props.id)
  battle.value = data.battle
  rounds.value = data.rounds
}

async function onSubmit(move) {
  submitting.value = true
  error.value = null
  try {
    const { battle: updated } = await api.submitMove(props.id, move)
    battle.value = { ...battle.value, ...updated }
  } catch (e) {
    error.value = e.message
  } finally {
    submitting.value = false
  }
}

function updateCountdown() {
  if (!battle.value?.round_deadline_at) {
    secondsLeft.value = null
    return
  }
  const ms = new Date(battle.value.round_deadline_at).getTime() - Date.now()
  secondsLeft.value = Math.max(0, Math.ceil(ms / 1000))
}

watch(() => battle.value?.round_deadline_at, updateCountdown)

const yourHp = computed(() => (battle.value?.your_side === 'a' ? battle.value.a_hp : battle.value?.b_hp))
const oppHp = computed(() => (battle.value?.your_side === 'a' ? battle.value?.b_hp : battle.value?.a_hp))
const youWon = computed(() => battle.value?.winner === battle.value?.your_side)
const oppName = computed(() => battle.value?.opponent?.first_name ?? 'Соперник')
const oppPhoto = computed(() => battle.value?.opponent?.photo_url ?? null)

// RoundLogEntry always treats "a_*" fields as "you" — swap when you're actually side B.
const roundsFromYourView = computed(() => {
  if (battle.value?.your_side !== 'b') return [...rounds.value].reverse()
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

const RESULT = {
  forfeit_both: { emoji: '😴', text: 'Оба не успели сходить — обоюдное поражение', class: 'result-banner--draw' },
  draw: { emoji: '🤝', text: 'Ничья', class: 'result-banner--draw' },
  win: { emoji: '🏆', text: 'Победа!', class: 'result-banner--win' },
  loss: { emoji: '💀', text: 'Поражение', class: 'result-banner--loss' },
}
const resultState = computed(() => {
  if (!battle.value) return null
  if (battle.value.winner === 'forfeit_both') return RESULT.forfeit_both
  if (battle.value.winner === 'draw') return RESULT.draw
  return youWon.value ? RESULT.win : RESULT.loss
})

onMounted(() => {
  refresh()
  pollTimer = setInterval(refresh, 1500)
  tickTimer = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
  if (tickTimer) clearInterval(tickTimer)
})
</script>

<template>
  <q-page class="q-pa-md column no-wrap" style="height: 100vh; box-sizing: border-box">
    <div v-if="!battle" class="text-center q-pa-xl">
      <q-spinner size="40px" color="primary" />
    </div>

    <template v-else-if="battle.status === 'waiting_for_opponent'">
      <div class="text-center q-pa-xl">
        <q-spinner color="primary" size="32px" class="q-mb-md" />
        <div class="text-grey">Соперник ещё не подключился</div>
        <q-btn flat color="primary" label="К вызову" to="/challenge" class="q-mt-md" />
      </div>
    </template>

    <template v-else>
      <div class="col-auto q-mb-md">
        <BattleHud :you-hp="yourHp" :opp-hp="oppHp" :you-photo="me.photoUrl" :opp-photo="oppPhoto" :opp-label="oppName" />
      </div>

      <div v-if="battle.status === 'completed'" class="col-auto result-banner q-mb-md" :class="resultState.class">
        {{ resultState.emoji }} {{ resultState.text }}
      </div>

      <div v-if="error" class="col-auto text-negative q-mb-md">{{ error }}</div>

      <div class="col-auto">
        <template v-if="battle.status === 'in_progress'">
          <div v-if="secondsLeft !== null" class="round-timer q-mb-sm">
            <q-linear-progress :value="secondsLeft / 60" color="accent" track-color="grey-3" size="4px" rounded class="q-mb-xs" />
            <div class="round-timer__text">⏱ {{ secondsLeft }} сек на ход</div>
          </div>
          <div v-if="battle.my_pending_submitted" class="waiting-move">
            <q-spinner color="primary" size="20px" class="q-mr-sm" />
            Ход принят, ждём соперника...
          </div>
          <ZonePicker v-else :disabled="submitting" @submit="onSubmit" />
        </template>

        <q-btn v-else color="accent" text-color="secondary" label="На главную" to="/" class="full-width q-mb-md" unelevated />
      </div>

      <div class="col q-mt-md ba-card log-scroll" style="min-height: 0; overflow-y: auto">
        <div v-if="rounds.length === 0" class="log-empty">Раунды появятся здесь после первого хода</div>
        <RoundLogEntry v-for="r in roundsFromYourView" :key="r.round" :round="r" youLabel="Ты" :oppLabel="oppName" />
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

.round-timer__text {
  text-align: center;
  font-size: 12px;
  color: var(--ba-ink-soft);
  font-weight: 600;
}

.waiting-move {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  color: var(--ba-ink-soft);
  font-size: 13.5px;
}

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
