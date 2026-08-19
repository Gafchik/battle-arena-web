import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'

export const useBattleStore = defineStore('battle', () => {
  const current = ref(null) // { id, mode, model_a, model_b, a_hp, b_hp, status, winner }
  const rounds = ref([])
  const submitting = ref(false)
  const error = ref(null)

  async function startTraining() {
    error.value = null
    const { battle } = await api.startTraining()
    current.value = battle
    rounds.value = []
  }

  async function submitMove(move) {
    if (!current.value) return
    submitting.value = true
    error.value = null
    try {
      const { round, battle } = await api.submitMove(current.value.id, move)
      rounds.value.push(round)
      current.value = { ...current.value, ...battle }
    } catch (e) {
      error.value = e.message
    } finally {
      submitting.value = false
    }
  }

  return { current, rounds, submitting, error, startTraining, submitMove }
})
