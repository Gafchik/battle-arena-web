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
  if (match) {
    router.replace(`/join/${match[1]}`)
  }
}
