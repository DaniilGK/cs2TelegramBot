const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/+$/, '')

export interface TelegramInvoice {
  invoiceLink: string
  amountCents: number
}

export async function createTelegramTopUpInvoice(input: {
  userId: string
  amountCents: number
}): Promise<TelegramInvoice> {
  if (!API_BASE) {
    throw new Error('VITE_API_BASE is not configured')
  }

  const res = await fetch(`${API_BASE}/api/payments/telegram/invoice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!res.ok) {
    const message = await res.text()
    throw new Error(message || `Payment API error: ${res.status}`)
  }

  return (await res.json()) as TelegramInvoice
}

