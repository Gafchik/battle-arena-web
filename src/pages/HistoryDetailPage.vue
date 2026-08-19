<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'
import HpBar from '@/components/HpBar.vue'

const props = defineProps({ id: { type: String, required: true } })

const battle = ref(null)
const rounds = ref([])
const loading = ref(true)

onMounted(async () => {
  const data = await api.getBattle(props.id)
  battle.value = data.battle
  rounds.value = data.rounds
  loading.value = false
})
</script>

<template>
  <q-page class="q-pa-md">
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner size="40px" color="primary" />
    </div>

    <template v-else-if="battle">
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-6">
          <HpBar label="A" :hp="battle.a_hp" color="primary" />
        </div>
        <div class="col-6">
          <HpBar :label="battle.model_b || 'B'" :hp="battle.b_hp" color="negative" />
        </div>
      </div>

      <q-list bordered separator>
        <q-item v-for="r in rounds" :key="r.round">
          <q-item-section>
            <q-item-label caption style="white-space: pre-line">{{ r.text }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </template>
  </q-page>
</template>
