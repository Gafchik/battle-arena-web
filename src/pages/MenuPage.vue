<template>
  <q-page class="column items-center q-pa-lg q-gutter-md">
    <q-btn
      size="lg"
      class="full-width"
      style="max-width: 360px"
      label="Вызвать друга на бой"
      color="negative"
      to="/challenge"
    />

    <q-btn
      size="lg"
      class="full-width"
      style="max-width: 360px"
      label="Тренировка"
      color="primary"
      to="/training"
    />

    <q-btn
      size="lg"
      class="full-width"
      style="max-width: 360px"
      label="Мои бои"
      color="secondary"
      to="/history"
    />

    <q-btn
      size="lg"
      class="full-width"
      style="max-width: 360px"
      label="Правила"
      color="dark"
      flat
      to="/rules"
    />
  </q-page>
</template>
