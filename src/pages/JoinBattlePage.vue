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
  <q-page class="q-pa-lg column items-center justify-center">
    <template v-if="expired">
      <div class="state-card ba-card q-pa-lg text-center">
        <div class="state-card__emoji">🔗</div>
        <div class="state-card__title">Ссылка на бой больше не активна</div>
        <div class="state-card__text">Вызов отменили, никто не зашёл за 5 минут, либо бой уже начался с другим игроком.</div>
        <q-btn color="accent" text-color="secondary" unelevated label="В меню" to="/" class="full-width q-mt-md" />
      </div>
    </template>
    <template v-else-if="error">
      <div class="state-card ba-card q-pa-lg text-center">
        <div class="state-card__emoji">⚠️</div>
        <div class="text-negative q-mb-md">{{ error }}</div>
        <q-btn color="accent" text-color="secondary" unelevated label="В меню" to="/" class="full-width" />
      </div>
    </template>
    <q-spinner v-else size="40px" color="primary" />
  </q-page>
</template>

<style scoped>
.state-card {
  width: 100%;
  max-width: 360px;
}
.state-card__emoji {
  font-size: 40px;
  margin-bottom: 8px;
}
.state-card__title {
  font-size: 16px;
  font-weight: 800;
  color: var(--ba-ink);
  margin-bottom: 4px;
}
.state-card__text {
  font-size: 13px;
  color: var(--ba-ink-soft);
  line-height: 1.4;
}
</style>
