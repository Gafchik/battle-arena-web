<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '@/services/api'
import HpBar from '@/components/HpBar.vue'
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

const yourHp = computed(() => (iAmSideB.value ? battle.value?.b_hp : battle.value?.a_hp))
const oppHp = computed(() => (iAmSideB.value ? battle.value?.a_hp : battle.value?.b_hp))
const oppLabel = computed(() => (isPvp.value ? battle.value?.opponent?.first_name ?? 'Соперник' : 'Бот'))
const oppPhoto = computed(() => (isPvp.value ? battle.value?.opponent?.photo_url : null))

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
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-6">
          <HpBar label="Ты" :photo-url="me.photoUrl" :hp="yourHp" color="primary" />
        </div>
        <div class="col-6">
          <HpBar :label="oppLabel" :photo-url="oppPhoto" fallback-emoji="🤖" :hp="oppHp" color="negative" />
        </div>
      </div>

      <q-list v-if="roundsFromYourView.length" bordered>
        <RoundLogEntry v-for="r in roundsFromYourView" :key="r.round" :round="r" youLabel="Ты" :oppLabel="oppLabel" />
      </q-list>
    </template>
  </q-page>
</template>
