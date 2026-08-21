<template>
  <q-page class="menu-page column items-center q-pa-lg">
    <div class="menu-hero">
      <div class="menu-hero__emoji">⚔️</div>
      <div class="menu-hero__title">Battle Arena</div>
      <div class="menu-hero__subtitle">Дуэли по зонам — атака и блок вслепую</div>
    </div>

    <div class="menu-actions">
      <button class="menu-btn menu-btn--primary" @click="$router.push('/challenge')">
        <span class="menu-btn__icon">🤺</span>
        <span class="menu-btn__text">
          <span class="menu-btn__title">Вызвать друга</span>
          <span class="menu-btn__desc">PvP-дуэль по ссылке в Telegram</span>
        </span>
      </button>

      <button class="menu-btn" @click="$router.push('/training')">
        <span class="menu-btn__icon">🤖</span>
        <span class="menu-btn__text">
          <span class="menu-btn__title">Тренировка</span>
          <span class="menu-btn__desc">Бой против бота</span>
        </span>
      </button>

      <button class="menu-btn" @click="$router.push('/history')">
        <span class="menu-btn__icon">📜</span>
        <span class="menu-btn__text">
          <span class="menu-btn__title">Мои бои</span>
          <span class="menu-btn__desc">История и повторы</span>
        </span>
      </button>

      <button class="menu-btn menu-btn--flat" @click="$router.push('/rules')">
        <span class="menu-btn__icon">📖</span>
        <span class="menu-btn__text">
          <span class="menu-btn__title">Правила</span>
        </span>
      </button>
    </div>
  </q-page>
</template>

<style scoped>
.menu-page {
  min-height: 100vh;
  box-sizing: border-box;
}

.menu-hero {
  text-align: center;
  margin: 24px 0 32px;
}
.menu-hero__emoji {
  font-size: 48px;
  line-height: 1;
  margin-bottom: 8px;
}
.menu-hero__title {
  font-size: 24px;
  font-weight: 800;
  color: var(--ba-ink);
}
.menu-hero__subtitle {
  font-size: 13px;
  color: var(--ba-ink-soft);
  margin-top: 4px;
}

.menu-actions {
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  border-radius: var(--ba-radius);
  border: 1px solid var(--ba-border);
  background: var(--ba-surface);
  cursor: pointer;
  text-align: left;
  transition: transform 0.06s, box-shadow 0.12s;
}
.menu-btn:active {
  transform: scale(0.98);
}
.menu-btn--primary {
  background: var(--ba-ink);
  border-color: var(--ba-ink);
}
.menu-btn--flat {
  border-color: transparent;
  background: transparent;
  padding-top: 8px;
  padding-bottom: 8px;
}

.menu-btn__icon {
  font-size: 26px;
  line-height: 1;
  flex: none;
}
.menu-btn__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.menu-btn__title {
  font-weight: 700;
  font-size: 15px;
  color: var(--ba-ink);
}
.menu-btn--primary .menu-btn__title {
  color: #fff;
}
.menu-btn__desc {
  font-size: 12px;
  color: var(--ba-ink-soft);
  margin-top: 1px;
}
.menu-btn--primary .menu-btn__desc {
  color: #C6CBE0;
}
</style>
