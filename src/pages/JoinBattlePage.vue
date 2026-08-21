<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/services/api'

const props = defineProps({ id: { type: String, required: true } })
const router = useRouter()
const error = ref(null)
const expired = ref(false)

onMounted(async () => {
  try {
    await api.joinBattle(props.id)
    router.replace(`/pvp/${props.id}`)
  } catch (e) {
    if (e.status === 404) {
      expired.value = true
    } else {
      error.value = e.message
    }
  }
})
</script>

<template>
  <q-page class="q-pa-lg column items-center justify-center q-gutter-md">
    <template v-if="expired">
      <div class="text-h6 text-center">Ссылка на бой больше не активна</div>
      <div class="text-caption text-grey text-center">
        Вызов отменили, никто не зашёл за 5 минут, либо бой уже начался с другим игроком.
      </div>
      <q-btn color="primary" label="В меню" to="/" />
    </template>
    <template v-else-if="error">
      <div class="text-negative text-center">{{ error }}</div>
      <q-btn color="primary" label="В меню" to="/" />
    </template>
    <q-spinner v-else size="40px" color="primary" />
  </q-page>
</template>
