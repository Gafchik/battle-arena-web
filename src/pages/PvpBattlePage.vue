<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { api } from '@/services/api'
import HpBar from '@/components/HpBar.vue'
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

    <template v-else>
      <div class="col-auto row q-col-gutter-md q-mb-md">
        <div class="col-6">
          <HpBar label="Ты" :photo-url="me.photoUrl" :hp="yourHp" color="primary" />
        </div>
        <div class="col-6">
          <HpBar :label="oppName" :photo-url="oppPhoto" :hp="oppHp" color="negative" />
        </div>
      </div>

      <div
        v-if="battle.status === 'completed'"
        class="col-auto text-h6 text-center q-mb-md"
        :class="{
          'text-positive': youWon,
          'text-grey': battle.winner === 'forfeit_both' || battle.winner === 'draw',
          'text-negative': !youWon && battle.winner !== 'forfeit_both' && battle.winner !== 'draw',
        }"
      >
        <template v-if="battle.winner === 'forfeit_both'">😴 Оба не успели сходить — обоюдное поражение</template>
        <template v-else-if="battle.winner === 'draw'">🤝 Ничья</template>
        <template v-else-if="youWon">🏆 Победа!</template>
        <template v-else>💀 Поражение</template>
      </div>

      <div v-if="error" class="col-auto text-negative q-mb-md">{{ error }}</div>

      <div class="col-auto">
        <template v-if="battle.status === 'in_progress'">
          <div v-if="secondsLeft !== null" class="text-center text-caption text-grey q-mb-xs">
            ⏱ {{ secondsLeft }} сек на ход
          </div>
          <div v-if="battle.my_pending_submitted" class="text-center text-grey q-pa-md">
            Ход принят, ждём соперника...
          </div>
          <ZonePicker v-else :disabled="submitting" @submit="onSubmit" />
        </template>

        <q-btn v-else color="primary" label="На главную" to="/" class="full-width q-mb-md" />
      </div>

      <div class="col q-mt-md" style="min-height: 0; overflow-y: auto">
        <q-list v-if="rounds.length" bordered>
          <RoundLogEntry v-for="r in roundsFromYourView" :key="r.round" :round="r" youLabel="Ты" :oppLabel="oppName" />
        </q-list>
      </div>
    </template>
  </q-page>
</template>
