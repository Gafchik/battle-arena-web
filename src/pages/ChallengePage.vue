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
  <q-page class="q-pa-lg column items-center">
    <template v-if="expired">
      <div class="state-card ba-card q-pa-lg text-center">
        <div class="state-card__emoji">⌛</div>
        <div class="state-card__title">Вызов протух</div>
        <div class="state-card__text">Никто не принял его за 5 минут — старая ссылка больше не работает.</div>
        <q-btn color="accent" text-color="secondary" unelevated label="Создать новый вызов" :loading="creating" class="full-width q-mt-md" @click="createChallenge" />
      </div>
    </template>

    <template v-else-if="battleId">
      <div class="state-card ba-card q-pa-lg text-center">
        <div class="state-card__emoji">🤺</div>
        <div class="state-card__title">Вызов создан</div>
        <div class="state-card__text">Отправь ссылку другу — бой начнётся, как только он зайдёт.</div>

        <q-btn color="accent" text-color="secondary" unelevated label="Отправить в Telegram" class="full-width q-mt-md" @click="shareLink" />

        <div class="waiting-row q-mt-lg">
          <q-spinner color="primary" size="20px" />
          <span>Ждём соперника…</span>
        </div>
        <div v-if="secondsLeft !== null" class="countdown">
          Ссылка активна ещё <b>{{ formatCountdown(secondsLeft) }}</b>
        </div>

        <q-btn flat dense color="negative" label="Отменить вызов" :loading="cancelling" class="q-mt-md" @click="cancelChallenge" />
        <div v-if="error" class="text-negative q-mt-sm">{{ error }}</div>
      </div>
    </template>

    <template v-else>
      <q-spinner color="primary" size="32px" class="q-mt-xl" />
      <div v-if="error" class="text-negative q-mt-md">{{ error }}</div>
    </template>
  </q-page>
</template>

<style scoped>
.state-card {
  width: 100%;
  max-width: 360px;
  margin-top: 24px;
}
.state-card__emoji {
  font-size: 40px;
  margin-bottom: 8px;
}
.state-card__title {
  font-size: 17px;
  font-weight: 800;
  color: var(--ba-ink);
  margin-bottom: 4px;
}
.state-card__text {
  font-size: 13px;
  color: var(--ba-ink-soft);
  line-height: 1.4;
}

.waiting-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  color: var(--ba-ink-soft);
}

.countdown {
  font-size: 12.5px;
  color: var(--ba-ink-soft);
  margin-top: 6px;
}
</style>
