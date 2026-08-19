<script setup>
import { onMounted } from 'vue'
import { useBattleStore } from '@/stores/battle'
import HpBar from '@/components/HpBar.vue'
import ZonePicker from '@/components/ZonePicker.vue'

const battle = useBattleStore()

onMounted(() => {
  battle.startTraining()
})

function onSubmit(move) {
  battle.submitMove(move)
}
</script>

<template>
  <q-page class="q-pa-md">
    <div v-if="!battle.current" class="text-center q-pa-xl">
      <q-spinner size="40px" color="primary" />
    </div>

    <template v-else>
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-6">
          <HpBar label="Ты" :hp="battle.current.a_hp" color="primary" />
        </div>
        <div class="col-6">
          <HpBar :label="battle.current.model_b" :hp="battle.current.b_hp" color="negative" />
        </div>
      </div>

      <div
        v-if="battle.current.status === 'completed'"
        class="text-h6 text-center q-mb-md"
        :class="battle.current.winner === 'a' ? 'text-positive' : 'text-negative'"
      >
        {{ battle.current.winner === 'a' ? 'Победа!' : battle.current.winner === 'draw' ? 'Ничья' : 'Поражение' }}
      </div>

      <q-list bordered separator class="q-mb-md" style="max-height: 260px; overflow-y: auto">
        <q-item v-for="r in battle.rounds" :key="r.round">
          <q-item-section>
            <q-item-label caption style="white-space: pre-line">{{ r.text }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <div v-if="battle.error" class="text-negative q-mb-md">{{ battle.error }}</div>

      <ZonePicker
        v-if="battle.current.status === 'in_progress'"
        :disabled="battle.submitting"
        @submit="onSubmit"
      />

      <q-btn
        v-else
        color="primary"
        label="Новый бой"
        class="full-width"
        @click="battle.startTraining()"
      />
    </template>
  </q-page>
</template>
