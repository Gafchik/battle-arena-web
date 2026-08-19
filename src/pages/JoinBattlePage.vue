<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/services/api'

const props = defineProps({ id: { type: String, required: true } })
const router = useRouter()
const error = ref(null)

onMounted(async () => {
  try {
    await api.joinBattle(props.id)
    router.replace(`/pvp/${props.id}`)
  } catch (e) {
    error.value = e.message
  }
})
</script>

<template>
  <q-page class="q-pa-lg column items-center justify-center q-gutter-md">
    <template v-if="error">
      <div class="text-negative text-center">{{ error }}</div>
      <q-btn color="primary" label="В меню" to="/" />
    </template>
    <q-spinner v-else size="40px" color="primary" />
  </q-page>
</template>
