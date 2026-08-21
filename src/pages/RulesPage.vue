<script setup>
import ZoneIcon from '@/components/ZoneIcon.vue'
import { ZONES } from '@/services/zones'
</script>

<template>
  <q-page class="q-pa-md">
    <div class="rules-card ba-card q-pa-md q-mb-md">
      <div class="ba-eyebrow q-mb-sm">Зоны тела</div>
      <div class="zones-row">
        <div v-for="z in ZONES" :key="z.value" class="zones-row__item">
          <ZoneIcon :zone="z.value" tone="defend" :size="34" />
          <span>{{ z.label }}</span>
        </div>
      </div>
    </div>

    <div class="rule-step ba-card q-pa-md q-mb-md">
      <div class="rule-step__num">1</div>
      <div>
        <div class="rule-step__title">Выбирайте вслепую</div>
        <div class="rule-step__text">Каждый раунд оба бойца одновременно выбирают <b>1 зону для удара</b> и <b>2 зоны для защиты</b> — соперник не видит ваш выбор.</div>
      </div>
    </div>

    <div class="rule-step ba-card q-pa-md q-mb-md">
      <div class="rule-step__num">2</div>
      <div>
        <div class="rule-step__title">Урон</div>
        <div class="rule-step__text">
          Попадание в незащищённую зону — <b class="text-negative">30 урона</b>.
          Попадание в защищённую зону всё равно пробивает блок — <b class="text-warning">15 урона</b>.
        </div>
      </div>
    </div>

    <div class="rule-step ba-card q-pa-md">
      <div class="rule-step__num">3</div>
      <div>
        <div class="rule-step__title">Победа</div>
        <div class="rule-step__text">У каждого бойца <b>100 HP</b>. Бой идёт до тех пор, пока у кого-то не закончится HP.</div>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.zones-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}
.zones-row__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--ba-ink-soft);
  flex: 1;
}

.rule-step {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.rule-step__num {
  flex: none;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--ba-ink);
  color: #fff;
  font-weight: 800;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.rule-step__title {
  font-weight: 700;
  font-size: 14.5px;
  margin-bottom: 3px;
}
.rule-step__text {
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--ba-ink-soft);
}
</style>
