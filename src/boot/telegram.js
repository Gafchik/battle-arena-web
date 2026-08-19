export default ({ router }) => {
  const tg = window.Telegram?.WebApp

  if (!tg) {
    console.warn('Telegram WebApp SDK not found — running outside Telegram, API calls will be rejected (401).')
    return
  }

  tg.ready()
  tg.expand()

  const startParam = tg.initDataUnsafe?.start_param
  const match = startParam?.match(/^battle_(\d+)$/)
  if (match) {
    router.replace(`/join/${match[1]}`)
  }
}
