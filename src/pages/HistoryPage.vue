<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '@/services/api'

const battles = ref([])
const loading = ref(true)

onMounted(async () => {
  const { battles: list } = await api.listBattles()
  battles.value = list
  loading.value = false
})

const stats = computed(() => {
  const result = { wins: 0, losses: 0, draws: 0 }
  for (const b of battles.value) {
    if (b.status !== 'completed') continue
    if (b.winner === 'draw' || b.winner === 'forfeit_both') result.draws++
    else if (b.winner === b.your_side) result.wins++
    else result.losses++
  }
  return result
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

    <div v-else>
      <div class="stats-row">
        <div class="stat-tile stat-tile--win">
          <div class="stat-tile__value">{{ stats.wins }}</div>
          <div class="stat-tile__label">Побед</div>
        </div>
        <div class="stat-tile stat-tile--loss">
          <div class="stat-tile__value">{{ stats.losses }}</div>
          <div class="stat-tile__label">Поражений</div>
        </div>
        <div class="stat-tile stat-tile--draw">
          <div class="stat-tile__value">{{ stats.draws }}</div>
          <div class="stat-tile__label">Ничьих</div>
        </div>
      </div>

      <div class="history-list">
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
    </div>
  </q-page>
</template>

<style scoped>
.stats-row {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}
.stat-tile {
  flex: 1;
  text-align: center;
  padding: 10px 4px;
  border-radius: var(--ba-radius-sm);
  background: var(--ba-surface-2);
}
.stat-tile__value {
  font-size: 20px;
  font-weight: 800;
  line-height: 1.1;
}
.stat-tile__label {
  font-size: 11px;
  font-weight: 600;
  color: var(--ba-ink-soft);
  margin-top: 2px;
}
.stat-tile--win { background: #E6F8EE; }
.stat-tile--win .stat-tile__value { color: var(--ba-win); }
.stat-tile--loss { background: var(--ba-opp-soft); }
.stat-tile--loss .stat-tile__value { color: var(--ba-opp); }
.stat-tile--draw { background: var(--ba-surface-2); }
.stat-tile--draw .stat-tile__value { color: var(--ba-ink-soft); }

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
