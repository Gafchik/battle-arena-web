function initData() {
  return window.Telegram?.WebApp?.initData ?? ''
}

async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`/api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Telegram-Init-Data': initData(),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const err = new Error(data?.error?.message || `HTTP ${res.status}`)
    err.status = res.status
    err.body = data
    throw err
  }

  return data
}

export const api = {
  listBattles: () => request('/battles'),
  getBattle: (id) => request(`/battles/${id}`),
  startTraining: () => request('/battles/training', { method: 'POST' }),
  challenge: () => request('/battles/challenge', { method: 'POST' }),
  joinBattle: (id) => request(`/battles/${id}/join`, { method: 'POST' }),
  cancelChallenge: (id) => request(`/battles/${id}/cancel`, { method: 'POST' }),
  submitMove: (battleId, move) => request(`/battles/${battleId}/move`, { method: 'POST', body: move }),
}
