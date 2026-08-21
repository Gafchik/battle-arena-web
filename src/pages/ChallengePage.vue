<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/services/api'

const BOT_USERNAME = 'pvp_battle_arena_bot'

const router = useRouter()
const battleId = ref(null)
const expiresAt = ref(null)
const secondsLeft = ref(null)
const creating = ref(true)
const cancelling = ref(false)
const expired = ref(false)
const error = ref(null)
let pollTimer = null
let tickTimer = null

function stopTimers() {
  if (pollTimer) clearInterval(pollTimer)
  if (tickTimer) clearInterval(tickTimer)
  pollTimer = null
  tickTimer = null
}

async function createChallenge() {
  creating.value = true
  expired.value = false
  error.value = null
  try {
    const { battle } = await api.challenge()
    battleId.value = battle.id
    expiresAt.value = battle.challenge_expires_at
    updateCountdown()
    pollForOpponent()
  } catch (e) {
    error.value = e.message
  } finally {
    creating.value = false
  }
}

function pollForOpponent() {
  if (pollTimer) clearInterval(pollTimer)
  pollTimer = setInterval(async () => {
    try {
      const { battle } = await api.getBattle(battleId.value)
      if (battle.status === 'in_progress') {
        stopTimers()
        router.replace(`/pvp/${battleId.value}`)
        return
      }
      expiresAt.value = battle.challenge_expires_at ?? expiresAt.value
      updateCountdown()
    } catch (e) {
      if (e.status === 404) {
        stopTimers()
        expired.value = true
        battleId.value = null
      }
    }
  }, 1500)
}

function updateCountdown() {
  if (!expiresAt.value) {
    secondsLeft.value = null
    return
  }
  const ms = new Date(expiresAt.value).getTime() - Date.now()
  secondsLeft.value = Math.max(0, Math.ceil(ms / 1000))
  if (secondsLeft.value === 0 && !expired.value) {
    stopTimers()
    expired.value = true
    battleId.value = null
  }
}

function formatCountdown(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
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
    stopTimers()
    router.replace('/')
  } catch (e) {
    error.value = e.message
    cancelling.value = false
  }
}

onMounted(() => {
  createChallenge()
  tickTimer = setInterval(updateCountdown, 1000)
})

onUnmounted(stopTimers)
</script>

<template>
  <q-page class="q-pa-lg column items-center q-gutter-md">
    <template v-if="expired">
      <div class="text-center">Вызов никто не принял за 5 минут — ссылка больше не активна.</div>
      <q-btn color="primary" label="Создать новый вызов" :loading="creating" @click="createChallenge" />
    </template>

    <template v-else-if="battleId">
      <div class="text-center">Вызов создан. Отправь ссылку другу.</div>
      <q-btn color="positive" label="Отправить в Telegram" @click="shareLink" />
      <q-spinner color="primary" size="32px" />
      <div class="text-caption text-grey">Ждём соперника...</div>
      <div v-if="secondsLeft !== null" class="text-caption text-grey">
        Ссылка активна ещё {{ formatCountdown(secondsLeft) }} — если никто не зайдёт, она протухнет
      </div>
      <q-btn flat color="negative" label="Отменить вызов" :loading="cancelling" @click="cancelChallenge" />
      <div v-if="error" class="text-negative">{{ error }}</div>
    </template>

    <template v-else>
      <q-spinner color="primary" size="32px" />
      <div v-if="error" class="text-negative">{{ error }}</div>
    </template>
  </q-page>
</template>
