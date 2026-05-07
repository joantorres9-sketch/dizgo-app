import { redirect } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0D14' }}>
      <main style={{ flex: 1, padding: '24px' }}>
        {children}
      </main>
    </div>
  )
}
