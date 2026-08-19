import { START_LOCATION } from 'vue-router'

export default ({ router }) => {
  const tg = window.Telegram?.WebApp

  if (!tg) {
    console.warn('Telegram WebApp SDK not found — running outside Telegram, API calls will be rejected (401).')
    return
  }

  tg.ready()
  tg.expand()

  // Different Telegram clients deliver the startapp payload differently:
  // mobile via initDataUnsafe.start_param, desktop via a ?tgWebAppStartParam=
  // query param on the page URL itself. Check both.
  const fromSdk = tg.initDataUnsafe?.start_param
  const fromQuery = new URLSearchParams(window.location.search).get('tgWebAppStartParam')
  const startParam = fromSdk || fromQuery

  const match = startParam?.match(/^battle_(\d+)$/)
  if (!match) return

  const target = `/join/${match[1]}`

  // Redirect only the very first navigation (from === START_LOCATION), and do
  // it as a guard rather than an early router.replace() — replace() before
  // the router's initial navigation resolves gets silently overwritten, and
  // awaiting router.isReady() here deadlocks (Quasar's boot phase blocks the
  // app mount that isReady() is itself waiting on).
  router.beforeEach((to, from, next) => {
    if (from === START_LOCATION && to.path !== target) {
      next(target)
    } else {
      next()
    }
  })
}
