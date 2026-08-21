<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'

const battles = ref([])
const loading = ref(true)

onMounted(async () => {
  const { battles: list } = await api.listBattles()
  battles.value = list
  loading.value = false
})

function statusInfo(b) {
  if (b.status === 'waiting_for_opponent') return { text: 'Ждёт соперника', class: 'badge--wait' }
  if (b.status === 'in_progress') return { text: 'Идёт бой', class: 'badge--live' }
  if (b.winner === 'draw') return { text: 'Ничья', class: 'badge--draw' }
  if (b.winner === 'forfeit_both') return { text: 'Оба сдались', class: 'badge--draw' }
  return b.winner === b.your_side
    ? { text: 'Победа', class: 'badge--win' }
    : { text: 'Поражение', class: 'badge--loss' }
}

function modeInfo(b) {
  return b.mode === 'pve'
    ? { icon: '🤖', text: 'Тренировка vs Бот' }
    : { icon: '🤺', text: 'PvP' }
}
</script>

<template>
  <q-page class="q-pa-md">
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner size="40px" color="primary" />
    </div>

    <div v-else-if="battles.length === 0" class="text-center text-grey q-pa-xl">
      Пока нет боёв
    </div>

    <div v-else class="history-list">
      <router-link
        v-for="b in battles"
        :key="b.id"
        :to="`/history/${b.id}`"
        class="history-item ba-card"
      >
        <span class="history-item__icon">{{ modeInfo(b).icon }}</span>
        <span class="history-item__body">
          <span class="history-item__title">{{ modeInfo(b).text }}</span>
          <span class="history-item__date">{{ new Date(b.created_at).toLocaleString() }}</span>
        </span>
        <span class="badge" :class="statusInfo(b).class">{{ statusInfo(b).text }}</span>
      </router-link>
    </div>
  </q-page>
</template>

<style scoped>
.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  text-decoration: none;
  color: inherit;
}
.history-item__icon {
  font-size: 24px;
  flex: none;
}
.history-item__body {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}
.history-item__title {
  font-weight: 700;
  font-size: 14px;
  color: var(--ba-ink);
}
.history-item__date {
  font-size: 11.5px;
  color: var(--ba-ink-soft);
  margin-top: 1px;
}

.badge {
  flex: none;
  font-size: 11.5px;
  font-weight: 700;
  padding: 4px 9px;
  border-radius: 999px;
}
.badge--win { background: #E6F8EE; color: var(--ba-win); }
.badge--loss { background: var(--ba-opp-soft); color: var(--ba-opp); }
.badge--draw { background: var(--ba-surface-2); color: var(--ba-ink-soft); }
.badge--live { background: var(--ba-block-soft); color: #B8760B; }
.badge--wait { background: var(--ba-you-soft); color: var(--ba-you); }
</style>
