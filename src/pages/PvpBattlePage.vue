<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { api } from '@/services/api'
import HpBar from '@/components/HpBar.vue'
import ZonePicker from '@/components/ZonePicker.vue'
import RoundLogEntry from '@/components/RoundLogEntry.vue'

const props = defineProps({ id: { type: String, required: true } })

const battle = ref(null)
const rounds = ref([])
const submitting = ref(false)
const error = ref(null)
let pollTimer = null

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

const yourHp = computed(() => (battle.value?.your_side === 'a' ? battle.value.a_hp : battle.value?.b_hp))
const oppHp = computed(() => (battle.value?.your_side === 'a' ? battle.value?.b_hp : battle.value?.a_hp))
const youWon = computed(() => battle.value?.winner === battle.value?.your_side)

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
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>

<template>
  <q-page class="q-pa-md">
    <div v-if="!battle" class="text-center q-pa-xl">
      <q-spinner size="40px" color="primary" />
    </div>

    <template v-else>
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-6">
          <HpBar label="Ты" :hp="yourHp" color="primary" />
        </div>
        <div class="col-6">
          <HpBar label="Соперник" :hp="oppHp" color="negative" />
        </div>
      </div>

      <div
        v-if="battle.status === 'completed'"
        class="text-h6 text-center q-mb-md"
        :class="youWon ? 'text-positive' : battle.winner === 'forfeit_both' ? 'text-grey' : 'text-negative'"
      >
        {{ battle.winner === 'forfeit_both' ? '😴 Оба не успели сходить — обоюдное поражение' : youWon ? '🏆 Победа!' : '💀 Поражение' }}
      </div>

      <div v-if="error" class="text-negative q-mb-md">{{ error }}</div>

      <template v-if="battle.status === 'in_progress'">
        <div v-if="battle.my_pending_submitted" class="text-center text-grey q-pa-md">
          Ход принят, ждём соперника...
        </div>
        <ZonePicker v-else :disabled="submitting" @submit="onSubmit" />
      </template>

      <q-btn v-else color="primary" label="В меню" to="/" class="full-width q-mb-md" />

      <q-list v-if="rounds.length" bordered class="q-mt-md">
        <RoundLogEntry v-for="r in roundsFromYourView" :key="r.round" :round="r" youLabel="Ты" oppLabel="Соперник" />
      </q-list>
    </template>
  </q-page>
</template>
