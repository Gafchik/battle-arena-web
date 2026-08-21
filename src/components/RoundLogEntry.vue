<script setup>
import { computed } from 'vue'
import ZoneIcon from './ZoneIcon.vue'
import { ZONE_LABEL } from '@/services/zones'

const props = defineProps({
  round: { type: Object, required: true },
  youLabel: { type: String, default: 'Ты' },
  oppLabel: { type: String, default: 'Бот' },
})

// Each side's outcome is driven by the *other* side's attack against its
// own defence — that's what actually happened to them this round.
const you = computed(() => outcomeFor('a', 'b'))
const opp = computed(() => outcomeFor('b', 'a'))

function outcomeFor(mine, theirs) {
  const round = props.round
  const myAttack = round[`${mine}_attack`]
  const myDefend = round[`${mine}_defend`]
  const theirAttack = round[`${theirs}_attack`]
  const damageTaken = round[`${mine}_damage`]
  const wasBlocked = round[`${mine}_blocked`]
  const hpAfter = round[`${mine}_hp_after`]

  let result
  if (theirAttack === null) {
    result = { kind: 'idle', text: 'Соперник не атаковал', tone: 'idle' }
  } else if (wasBlocked) {
    result = { kind: 'block', text: `Блок пробит — −${damageTaken} HP`, tone: 'block' }
  } else {
    result = { kind: 'hit', text: `Попадание — −${damageTaken} HP`, tone: 'hit' }
  }

  return {
    moved: myAttack !== null,
    attack: myAttack,
    defend: myDefend || [],
    hpAfter,
    result,
  }
}

const RESULT_ICON = { idle: '—', block: '🛡️', hit: '💥' }
</script>

<template>
  <div class="round-entry">
    <div class="round-entry__title">Раунд {{ round.round }}</div>

    <div class="fighter-row">
      <div class="fighter-row__head">
        <span class="fighter-row__name fighter-row__name--you">{{ youLabel }}</span>
        <span class="fighter-row__hp">{{ you.hpAfter }} HP</span>
      </div>

      <div v-if="you.moved" class="fighter-row__moves">
        <span class="move-chip">
          <ZoneIcon :zone="you.attack" tone="attack" :size="20" />
          Атака: {{ ZONE_LABEL[you.attack] }}
        </span>
        <span class="move-chip">
          <span class="move-chip__zones">
            <ZoneIcon v-for="z in you.defend" :key="z" :zone="z" tone="defend" :size="20" />
          </span>
          Защита: {{ you.defend.map((z) => ZONE_LABEL[z]).join(', ') }}
        </span>
      </div>
      <div v-else class="fighter-row__idle">😴 Не успел сходить</div>

      <div class="fighter-row__result" :class="`fighter-row__result--${you.result.tone}`">
        <span class="fighter-row__result-icon">{{ RESULT_ICON[you.result.kind] }}</span>
        {{ you.result.text }}
      </div>
    </div>

    <div class="fighter-row fighter-row--opp">
      <div class="fighter-row__head">
        <span class="fighter-row__name fighter-row__name--opp">{{ oppLabel }}</span>
        <span class="fighter-row__hp">{{ opp.hpAfter }} HP</span>
      </div>

      <div v-if="opp.moved" class="fighter-row__moves">
        <span class="move-chip">
          <ZoneIcon :zone="opp.attack" tone="attack" :size="20" />
          Атака: {{ ZONE_LABEL[opp.attack] }}
        </span>
        <span class="move-chip">
          <span class="move-chip__zones">
            <ZoneIcon v-for="z in opp.defend" :key="z" :zone="z" tone="defend" :size="20" />
          </span>
          Защита: {{ opp.defend.map((z) => ZONE_LABEL[z]).join(', ') }}
        </span>
      </div>
      <div v-else class="fighter-row__idle">😴 Не успел сходить</div>

      <div class="fighter-row__result" :class="`fighter-row__result--${opp.result.tone}`">
        <span class="fighter-row__result-icon">{{ RESULT_ICON[opp.result.kind] }}</span>
        {{ opp.result.text }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.round-entry {
  padding: 12px 14px;
  border-bottom: 1px solid var(--ba-border);
}
.round-entry__title {
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ba-ink-soft);
  margin-bottom: 8px;
}

.fighter-row {
  padding: 8px 10px;
  border-radius: var(--ba-radius-sm);
  background: var(--ba-you-soft);
  margin-bottom: 8px;
}
.fighter-row--opp {
  background: var(--ba-opp-soft);
  margin-bottom: 0;
}

.fighter-row__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 4px;
}
.fighter-row__name {
  font-weight: 700;
  font-size: 13px;
}
.fighter-row__name--you { color: var(--ba-you); }
.fighter-row__name--opp { color: var(--ba-opp); }
.fighter-row__hp {
  font-size: 11px;
  color: var(--ba-ink-soft);
  font-weight: 600;
}

.fighter-row__moves {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  margin-bottom: 4px;
}
.move-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12.5px;
  color: var(--ba-ink);
}
.move-chip__zones {
  display: inline-flex;
  gap: 1px;
}

.fighter-row__idle {
  font-size: 12.5px;
  color: var(--ba-ink-soft);
  margin-bottom: 4px;
}

.fighter-row__result {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  font-weight: 700;
}
.fighter-row__result-icon {
  font-size: 13px;
  line-height: 1;
}
.fighter-row__result--idle { color: var(--ba-ink-soft); font-weight: 600; }
.fighter-row__result--block { color: #B8760B; }
.fighter-row__result--hit { color: var(--ba-opp); }
</style>
