export default function DashboardPage() {
  return (
    <div style={{ color: '#E8EDF5', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #0A2472, #1565C0)',
        borderRadius: '14px', padding: '32px', marginBottom: '24px'
      }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
          DI<span style={{ color: '#F5A623' }}>Z</span>GO
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px' }}>
          Hallazgo de dinero · Plataforma de gestión para e-commerce LATAM
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Saldo Wallet', value: '$ 0', color: '#2DD4A0', icon: '💳' },
          { label: 'Total Pedidos', value: '0', color: '#3D8EF0', icon: '📦' },
          { label: 'Alertas activas', value: '0', color: '#F5A623', icon: '🚨' },
        ].map((k, i) => (
          <div key={i} style={{ 
            background: '#111520', borderRadius: '12px', padding: '20px',
            border: '1px solid rgba(255,255,255,0.07)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: '#8B96A8' }}>{k.label}</span>
              <span style={{ fontSize: '20px' }}>{k.icon}</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{ 
        background: '#111520', borderRadius: '12px', padding: '24px',
        border: '1px dashed rgba(245,166,35,0.3)', textAlign: 'center'
      }}>
        <div style={{ fontSize: '36px', marginBottom: '12px' }}>🚀</div>
        <h3 style={{ marginBottom: '8px', fontSize: '16px' }}>DIZGO está en línea</h3>
        <p style={{ color: '#8B96A8', fontSize: '14px', marginBottom: '16px' }}>
          Ahora ejecuta el SQL en Supabase para activar la base de datos.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { label: '💳 Wallet Dropi', href: '/dashboard/wallet' },
            { label: '📦 Pedidos', href: '/dashboard/pedidos' },
            { label: '📊 Costos Fijos', href: '/dashboard/costos' },
          ].map((b, i) => (
            <a key={i} href={b.href} style={{ 
              padding: '8px 20px', borderRadius: '10px', textDecoration: 'none',
              background: i === 0 ? '#F5A623' : 'rgba(255,255,255,0.05)',
              color: i === 0 ? '#0A0D14' : '#E8EDF5',
              fontSize: '13px', fontWeight: '600',
              border: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.1)'
            }}>{b.label}</a>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '16px' }}>
        {[
          { phase: 'PLANEAR', color: '#3D8EF0', items: ['Costos Fijos', 'Catálogo', 'Precios', 'Metas'] },
          { phase: 'HACER', color: '#2DD4A0', items: ['Pedidos', 'WhatsApp', 'Wallet', 'Pauta'] },
          { phase: 'VERIFICAR', color: '#F5A623', items: ['Dashboard', 'P&G', 'Embudo', 'Alertas'] },
          { phase: 'ACTUAR', color: '#9B6BFF', items: ['Formación', 'Diagnóstico', 'Estrategias'] },
        ].map((p, i) => (
          <div key={i} style={{ 
            background: '#111520', borderRadius: '10px', padding: '14px',
            borderTop: `3px solid ${p.color}`,
            border: `1px solid ${p.color}22`,
            borderTopColor: p.color
          }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: p.color, marginBottom: '8px' }}>
              {p.phase}
            </div>
            {p.items.map((item, j) => (
              <div key={j} style={{ fontSize: '11px', color: '#8B96A8', marginBottom: '4px' }}>· {item}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
