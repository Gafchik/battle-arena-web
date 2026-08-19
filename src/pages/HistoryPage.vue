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

function winnerLabel(b) {
  if (b.status !== 'completed') return 'В процессе'
  if (b.winner === 'draw') return 'Ничья'
  if (b.winner === 'forfeit_both') return 'Оба сдались'
  return b.winner === b.your_side ? 'Победа' : 'Поражение'
}

function badgeColor(b) {
  if (b.status !== 'completed') return 'grey'
  if (b.winner === 'draw' || b.winner === 'forfeit_both') return 'grey-7'
  return b.winner === b.your_side ? 'positive' : 'negative'
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

    <q-list v-else bordered separator>
      <q-item v-for="b in battles" :key="b.id" clickable :to="`/history/${b.id}`">
        <q-item-section>
          <q-item-label>{{ b.mode === 'pve' ? 'Тренировка vs Бот' : 'PvP' }}</q-item-label>
          <q-item-label caption>{{ new Date(b.created_at).toLocaleString() }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-badge :color="badgeColor(b)">
            {{ winnerLabel(b) }}
          </q-badge>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>
