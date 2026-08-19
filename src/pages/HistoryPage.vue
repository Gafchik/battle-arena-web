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
  return b.winner === 'a' ? 'Победа' : 'Поражение'
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
          <q-item-label>{{ b.mode === 'pve' ? `Тренировка vs ${b.model_b}` : 'PvP' }}</q-item-label>
          <q-item-label caption>{{ new Date(b.created_at).toLocaleString() }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-badge :color="b.winner === 'a' ? 'positive' : b.status !== 'completed' ? 'grey' : 'negative'">
            {{ winnerLabel(b) }}
          </q-badge>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>
