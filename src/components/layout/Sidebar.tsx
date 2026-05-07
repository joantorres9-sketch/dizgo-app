export default function Sidebar() {
  return (
    <aside style={{ 
      width: '240px', background: '#080B10', 
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column', minHeight: '100vh'
    }}>
      <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            width: '36px', height: '36px', background: '#F5A623', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '800', fontSize: '13px', color: '#0A0D14'
          }}>DZ</div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '15px', color: '#E8EDF5' }}>
              DI<span style={{ color: '#F5A623' }}>Z</span>GO
            </div>
            <div style={{ fontSize: '10px', color: '#5A6478' }}>Mi Tienda</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: '8px' }}>
        {[
          { group: 'PLANEAR', color: '#3D8EF0', items: [
            { icon: '⊞', label: 'Inicio', href: '/dashboard' },
            { icon: '📊', label: 'Costos Fijos', href: '/dashboard/costos' },
            { icon: '🛍️', label: 'Catálogo', href: '/dashboard/productos' },
          ]},
          { group: 'HACER', color: '#2DD4A0', items: [
            { icon: '📦', label: 'Pedidos', href: '/dashboard/pedidos' },
            { icon: '💬', label: 'WhatsApp', href: '/dashboard/whatsapp' },
            { icon: '💳', label: 'Wallet Dropi', href: '/dashboard/wallet' },
          ]},
          { group: 'VERIFICAR', color: '#F5A623', items: [
            { icon: '📈', label: 'P&G Resultados', href: '/dashboard/resultados' },
            { icon: '🚨', label: 'Alertas', href: '/dashboard/alertas' },
          ]},
        ].map(group => (
          <div key={group.group} style={{ marginBottom: '12px' }}>
            <div style={{ 
              padding: '6px 8px', fontSize: '9px', fontWeight: '700',
              letterSpacing: '1.5px', color: group.color
            }}>{group.group}</div>
            {group.items.map(item => (
              <a key={item.href} href={item.href} style={{ 
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 10px', borderRadius: '8px', textDecoration: 'none',
                color: '#8B96A8', fontSize: '13px', marginBottom: '2px'
              }}>
                <span style={{ fontSize: '14px', width: '18px', textAlign: 'center' }}>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}
