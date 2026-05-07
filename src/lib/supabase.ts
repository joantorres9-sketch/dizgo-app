export function createClient() {
  const { createBrowserClient } = require('@supabase/ssr')
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export const formatMoney = (amount: number, moneda: string = 'COP') => {
  if (moneda === 'COP') return '$ ' + Math.round(amount).toLocaleString('es-CO')
  return '$ ' + amount.toFixed(2)
}
