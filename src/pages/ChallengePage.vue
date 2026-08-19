<script setup>
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/services/api'

const BOT_USERNAME = 'pvp_battle_arena_bot'

const router = useRouter()
const battleId = ref(null)
const creating = ref(false)
const cancelling = ref(false)
const error = ref(null)
let pollTimer = null

async function createChallenge() {
  creating.value = true
  error.value = null
  try {
    const { battle } = await api.challenge()
    battleId.value = battle.id
    pollForOpponent()
  } catch (e) {
    error.value = e.message
  } finally {
    creating.value = false
  }
}

function pollForOpponent() {
  pollTimer = setInterval(async () => {
    const { battle } = await api.getBattle(battleId.value)
    if (battle.status === 'in_progress') {
      clearInterval(pollTimer)
      router.replace(`/pvp/${battleId.value}`)
    }
  }, 1500)
}

function shareLink() {
  const deepLink = `https://t.me/${BOT_USERNAME}?startapp=battle_${battleId.value}`
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(deepLink)}&text=${encodeURIComponent('Го драться!')}`
  window.Telegram?.WebApp?.openTelegramLink(shareUrl)
}

async function cancelChallenge() {
  cancelling.value = true
  try {
    await api.cancelChallenge(battleId.value)
    if (pollTimer) clearInterval(pollTimer)
    router.replace('/')
  } catch (e) {
    error.value = e.message
    cancelling.value = false
  }
}

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>

<template>
  <q-page class="q-pa-lg column items-center q-gutter-md">
    <template v-if="!battleId">
      <q-btn color="primary" label="Создать вызов" :loading="creating" @click="createChallenge" />
      <div v-if="error" class="text-negative">{{ error }}</div>
    </template>

    <template v-else>
      <div class="text-center">Вызов создан. Отправь ссылку другу.</div>
      <q-btn color="positive" label="Отправить в Telegram" @click="shareLink" />
      <q-spinner color="primary" size="32px" />
      <div class="text-caption text-grey">Ждём соперника...</div>
      <q-btn flat color="negative" label="Отменить вызов" :loading="cancelling" @click="cancelChallenge" />
      <div v-if="error" class="text-negative">{{ error }}</div>
    </template>
  </q-page>
</template>
