'use client'

const MODULOS = [
  { group:'PLANEAR', color:'#3D8EF0', items:[
    { href:'/dashboard/costos', icon:'📊', label:'Costos Fijos', desc:'CF mensuales por categoría', status:'✅' },
    { href:'/dashboard/productos', icon:'🛍️', label:'Catálogo', desc:'15 productos con costeo ABC', status:'✅' },
    { href:'/dashboard/precio', icon:'💡', label:'Precio & Costeo', desc:'Costeo inverso y CPA máximo', status:'✅' },
    { href:'/dashboard/equilibrio', icon:'⚖️', label:'Punto Equilibrio', desc:'PE tiempo real + escenarios', status:'✅' },
  ]},
  { group:'HACER', color:'#2DD4A0', items:[
    { href:'/dashboard/pedidos', icon:'📦', label:'Pedidos', desc:'3.000 pedidos reales agosto', status:'✅' },
    { href:'/dashboard/wallet', icon:'💳', label:'Wallet Dropi', desc:'Carga Excel · Clasifica automático', status:'✅' },
  ]},
  { group:'VERIFICAR', color:'#F5A623', items:[
    { href:'/dashboard/resultados', icon:'📈', label:'P&G Resultados', desc:'Estado de resultados', status:'🔜' },
    { href:'/dashboard/alertas', icon:'🚨', label:'Alertas', desc:'Semáforos y decisiones', status:'🔜' },
  ]},
  { group:'ACTUAR', color:'#9B6BFF', items:[
    { href:'/dashboard/formacion', icon:'🎓', label:'Formación', desc:'Módulos educativos PHVA', status:'🔜' },
  ]},
]

export default function DashboardPage() {
  return (
    <div style={{ color:'#E8EDF5', fontFamily:'system-ui,sans-serif', maxWidth:'1100px' }}>

      {/* Header */}
      <div style={{ marginBottom:'28px' }}>
        <h1 style={{ fontSize:'26px', fontWeight:'800', marginBottom:'6px' }}>
          DI<span style={{ color:'#F5A623' }}>Z</span>GO Dashboard
        </h1>
        <p style={{ fontSize:'14px', color:'#8B96A8' }}>
          {new Date().toLocaleDateString('es-CO', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
          {' · '}<span style={{ color:'#2DD4A0' }}>Sistema activo</span>
        </p>
      </div>

      {/* KPIs rápidos */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px', marginBottom:'28px' }}>
        {[
          { label:'Saldo Wallet', value:'$ 173.637', sub:'COP disponible', color:'#2DD4A0', icon:'💳' },
          { label:'Pedidos este mes', value:'0', sub:'Carga tu CSV de Dropi', color:'#3D8EF0', icon:'📦' },
          { label:'Módulos activos', value:'6/9', sub:'3 módulos en construcción', color:'#F5A623', icon:'⚡' },
        ].map((k, i) => (
          <div key={i} style={{ background:'#111520', border:`1px solid ${k.color}22`, borderTop:`2px solid ${k.color}`, borderRadius:'12px', padding:'18px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px' }}>
              <span style={{ fontSize:'12px', color:'#8B96A8' }}>{k.label}</span>
              <span style={{ fontSize:'20px' }}>{k.icon}</span>
            </div>
            <div style={{ fontSize:'24px', fontWeight:'800', color:k.color }}>{k.value}</div>
            <div style={{ fontSize:'11px', color:'#5A6478', marginTop:'4px' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Módulos por fase PHVA */}
      {MODULOS.map(group => (
        <div key={group.group} style={{ marginBottom:'24px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
            <div style={{ width:'3px', height:'20px', background:group.color, borderRadius:'2px' }} />
            <span style={{ fontSize:'11px', fontWeight:'800', letterSpacing:'1.5px', color:group.color }}>{group.group}</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'10px' }}>
            {group.items.map(item => (
              <a key={item.href} href={item.href} style={{
                background:'#111520', border:`1px solid rgba(255,255,255,0.07)`,
                borderRadius:'12px', padding:'16px', textDecoration:'none',
                transition:'all .15s', display:'block',
                borderTop: `2px solid ${item.status === '✅' ? group.color : 'rgba(255,255,255,0.1)'}`,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#161C2E'; (e.currentTarget as HTMLElement).style.borderColor = group.color + '44' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#111520'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'8px' }}>
                  <span style={{ fontSize:'22px' }}>{item.icon}</span>
                  <span style={{ fontSize:'14px' }}>{item.status}</span>
                </div>
                <div style={{ fontSize:'13px', fontWeight:'700', color:'#E8EDF5', marginBottom:'4px' }}>{item.label}</div>
                <div style={{ fontSize:'11px', color:'#5A6478', lineHeight:'1.4' }}>{item.desc}</div>
              </a>
            ))}
          </div>
        </div>
      ))}

      {/* Acciones rápidas */}
      <div style={{ background:'#111520', border:'1px dashed rgba(245,166,35,0.3)', borderRadius:'12px', padding:'20px', marginTop:'8px' }}>
        <div style={{ fontSize:'13px', fontWeight:'700', color:'#F5A623', marginBottom:'12px' }}>⚡ Acciones rápidas</div>
        <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
          {[
            { label:'💳 Cargar Wallet Dropi', href:'/dashboard/wallet', primary:true },
            { label:'📦 Ver Pedidos', href:'/dashboard/pedidos', primary:false },
            { label:'🛍️ Ver Catálogo', href:'/dashboard/productos', primary:false },
            { label:'⚖️ Ver Equilibrio', href:'/dashboard/equilibrio', primary:false },
          ].map((b, i) => (
            <a key={i} href={b.href} style={{
              padding:'9px 18px', borderRadius:'9px', textDecoration:'none',
              fontSize:'13px', fontWeight:'600', cursor:'pointer',
              background: b.primary ? '#F5A623' : 'rgba(255,255,255,0.05)',
              color: b.primary ? '#0A0D14' : '#E8EDF5',
              border: b.primary ? 'none' : '1px solid rgba(255,255,255,0.1)',
            }}>
              {b.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
