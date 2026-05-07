export default function AdminPage() {
  return (
    <div style={{ 
      minHeight: '100vh', padding: '32px', background: '#0A0D14', 
      color: '#E8EDF5', fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{ 
            width: '44px', height: '44px', background: '#F5A623', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '800', color: '#0A0D14'
          }}>DZ</div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '700' }}>Panel Superadmin</h1>
            <p style={{ fontSize: '13px', color: '#8B96A8' }}>DIZGO · Control total de la plataforma</p>
          </div>
          <a href="/dashboard" style={{ 
            marginLeft: 'auto', padding: '8px 16px', borderRadius: '10px',
            background: 'rgba(255,255,255,0.05)', color: '#8B96A8',
            textDecoration: 'none', fontSize: '13px'
          }}>← Dashboard</a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px' }}>
          {[
            { label: 'Tiendas activas', value: '0', color: '#2DD4A0' },
            { label: 'Total usuarios', value: '0', color: '#3D8EF0' },
            { label: 'Ingresos mes', value: '$0', color: '#F5A623' },
          ].map((k, i) => (
            <div key={i} style={{ 
              background: '#111520', borderRadius: '12px', padding: '18px',
              border: '1px solid rgba(255,255,255,0.07)'
            }}>
              <div style={{ fontSize: '12px', color: '#8B96A8', marginBottom: '8px' }}>{k.label}</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: k.color }}>{k.value}</div>
            </div>
          ))}
        </div>

        <div style={{ 
          background: '#111520', borderRadius: '12px', padding: '20px',
          border: '1px solid rgba(255,255,255,0.07)'
        }}>
          <h2 style={{ fontWeight: '600', marginBottom: '16px' }}>Tiendas registradas</h2>
          <div style={{ textAlign: 'center', padding: '32px', color: '#5A6478', fontSize: '14px' }}>
            Ejecuta el SQL en Supabase para activar la gestión de tiendas
          </div>
        </div>
      </div>
    </div>
  )
}
