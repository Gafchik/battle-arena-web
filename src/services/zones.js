export const ZONES = [
  { value: 'head', label: 'Голова' },
  { value: 'chest', label: 'Грудь' },
  { value: 'groin', label: 'Пах' },
  { value: 'legs', label: 'Ноги' },
]

export const ZONE_LABEL = Object.fromEntries(ZONES.map((z) => [z.value, z.label]))
