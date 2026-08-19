<script setup>
import { onMounted } from 'vue'
import { useBattleStore } from '@/stores/battle'
import HpBar from '@/components/HpBar.vue'
import ZonePicker from '@/components/ZonePicker.vue'
import RoundLogEntry from '@/components/RoundLogEntry.vue'
import { myTelegramUser } from '@/services/telegramUser'

const battle = useBattleStore()
const me = myTelegramUser()

onMounted(() => {
  battle.startTraining()
})

function onSubmit(move) {
  battle.submitMove(move)
}
</script>

<template>
  <q-page class="q-pa-md column no-wrap" style="height: 100vh; box-sizing: border-box">
    <div v-if="!battle.current" class="text-center q-pa-xl">
      <q-spinner size="40px" color="primary" />
    </div>

    <template v-else>
      <div class="col-auto row q-col-gutter-md q-mb-md">
        <div class="col-6">
          <HpBar label="Ты" :photo-url="me.photoUrl" :hp="battle.current.a_hp" color="primary" />
        </div>
        <div class="col-6">
          <HpBar label="Бот" fallback-emoji="🤖" :hp="battle.current.b_hp" color="negative" />
        </div>
      </div>

      <div
        v-if="battle.current.status === 'completed'"
        class="col-auto text-h6 text-center q-mb-md"
        :class="battle.current.winner === 'a' ? 'text-positive' : 'text-negative'"
      >
        {{ battle.current.winner === 'a' ? '🏆 Победа!' : battle.current.winner === 'draw' ? '🤝 Ничья' : '💀 Поражение' }}
      </div>

      <div v-if="battle.error" class="col-auto text-negative q-mb-md">{{ battle.error }}</div>

      <div class="col-auto">
        <ZonePicker
          v-if="battle.current.status === 'in_progress'"
          :disabled="battle.submitting"
          @submit="onSubmit"
        />

        <q-btn
          v-else
          color="primary"
          label="На главную"
          class="full-width q-mb-md"
          to="/"
        />
      </div>

      <div class="col q-mt-md" style="min-height: 0; overflow-y: auto">
        <q-list v-if="battle.rounds.length" bordered>
          <RoundLogEntry v-for="r in [...battle.rounds].reverse()" :key="r.round" :round="r" youLabel="Ты" oppLabel="Бот" />
        </q-list>
      </div>
    </template>
  </q-page>
</template>
