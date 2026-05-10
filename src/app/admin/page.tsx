'use client'
import { useState } from 'react'

type Tienda = {
  id: string; nombre: string; slug: string; pais: 'COL'|'ECU'|'MEX'
  plan: 'starter'|'pro'|'enterprise'; estado: 'activa'|'suspendida'|'prueba'|'vencida'
  owner: string; email: string; telefono: string
  fecha_inicio: string; fecha_vence: string
  pedidos_mes: number; ventas_mes: number; roas: number
  tasa_entrega: number; cpa: number; margen_neto: number
  modulos_activos: number; ultimo_acceso: string
}

type Usuario = {
  id: string; nombre: string; email: string
  rol: 'superadmin'|'owner'|'gestor_pedidos'|'trafficker'|'tesorero'|'logistica'|'readonly'
  tienda: string; activo: boolean; ultimo_acceso: string
}

type AlertaGlobal = {
  id: number; titulo: string; mensaje: string; nivel: 'INFO'|'ALERTA'|'CRITICO'
  fecha: string; activa: boolean; destinatarios: 'todas'|string[]
}

const TIENDAS: Tienda[] = [
  { id:'t1', nombre:'Joya Store', slug:'joya-store', pais:'COL', plan:'pro', estado:'activa', owner:'Joan Torres', email:'joantorres9@gmail.com', telefono:'3206348574', fecha_inicio:'01-01-2024', fecha_vence:'01-01-2027', pedidos_mes:503, ventas_mes:35710000, roas:3.27, tasa_entrega:78, cpa:10338, margen_neto:14, modulos_activos:18, ultimo_acceso:'Hoy' },
  { id:'t2', nombre:'Alma Ecuatoriana', slug:'alma-ecuatoriana', pais:'ECU', plan:'pro', estado:'activa', owner:'María Rodríguez', email:'maria@alma.ec', telefono:'0987654321', fecha_inicio:'15-03-2024', fecha_vence:'15-03-2025', pedidos_mes:312, ventas_mes:21840000, roas:2.89, tasa_entrega:71, cpa:12450, margen_neto:11, modulos_activos:14, ultimo_acceso:'Ayer' },
  { id:'t3', nombre:'TechDrop MX', slug:'techdrop-mx', pais:'MEX', plan:'starter', estado:'activa', owner:'Carlos López', email:'carlos@techdrop.mx', telefono:'5551234567', fecha_inicio:'01-05-2024', fecha_vence:'01-05-2025', pedidos_mes:189, ventas_mes:15120000, roas:2.45, tasa_entrega:68, cpa:14800, margen_neto:8, modulos_activos:8, ultimo_acceso:'Hace 2 días' },
  { id:'t4', nombre:'Moda Femenina CO', slug:'moda-femenina', pais:'COL', plan:'starter', estado:'prueba', owner:'Andrea Gómez', email:'andrea@moda.co', telefono:'3101234567', fecha_inicio:'01-05-2026', fecha_vence:'15-05-2026', pedidos_mes:45, ventas_mes:3150000, roas:1.9, tasa_entrega:60, cpa:18900, margen_neto:3, modulos_activos:6, ultimo_acceso:'Hoy' },
  { id:'t5', nombre:'Accesorios Premium', slug:'accesorios-premium', pais:'COL', plan:'enterprise', estado:'activa', owner:'Luis Martínez', email:'luis@premium.co', telefono:'3209876543', fecha_inicio:'01-09-2023', fecha_vence:'01-09-2026', pedidos_mes:892, ventas_mes:62440000, roas:4.12, tasa_entrega:83, cpa:8900, margen_neto:19, modulos_activos:18, ultimo_acceso:'Hoy' },
  { id:'t6', nombre:'Drop & Save', slug:'drop-save', pais:'COL', plan:'pro', estado:'vencida', owner:'Pedro Sánchez', email:'pedro@drop.co', telefono:'3154567890', fecha_inicio:'01-02-2024', fecha_vence:'01-02-2025', pedidos_mes:0, ventas_mes:0, roas:0, tasa_entrega:0, cpa:0, margen_neto:0, modulos_activos:12, ultimo_acceso:'Hace 3 meses' },
]

const USUARIOS: Usuario[] = [
  { id:'u1', nombre:'Joan Torres', email:'joantorres9@gmail.com', rol:'superadmin', tienda:'TODAS', activo:true, ultimo_acceso:'Hoy' },
  { id:'u2', nombre:'María Rodríguez', email:'maria@alma.ec', rol:'owner', tienda:'Alma Ecuatoriana', activo:true, ultimo_acceso:'Ayer' },
  { id:'u3', nombre:'Ana Confirmadora', email:'ana@joya.co', rol:'gestor_pedidos', tienda:'Joya Store', activo:true, ultimo_acceso:'Hoy' },
  { id:'u4', nombre:'Carlos López', email:'carlos@techdrop.mx', rol:'owner', tienda:'TechDrop MX', activo:true, ultimo_acceso:'Hace 2 días' },
  { id:'u5', nombre:'Trafficker Pro', email:'traff@joya.co', rol:'trafficker', tienda:'Joya Store', activo:true, ultimo_acceso:'Hoy' },
  { id:'u6', nombre:'Luis Martínez', email:'luis@premium.co', rol:'owner', tienda:'Accesorios Premium', activo:true, ultimo_acceso:'Hoy' },
  { id:'u7', nombre:'Pedro Sánchez', email:'pedro@drop.co', rol:'owner', tienda:'Drop & Save', activo:false, ultimo_acceso:'Hace 3 meses' },
]

const ALERTAS_GLOBALES: AlertaGlobal[] = [
  { id:1, titulo:'Actualización DIZGO v1.1 — Nuevos módulos', mensaje:'Se han publicado los módulos de Embudo de Tráfico y P&G Resultados. Ingresa y explóralos.', nivel:'INFO', fecha:'10/05/2026', activa:true, destinatarios:'todas' },
  { id:2, titulo:'Festivo 29 mayo — Planificar despachos', mensaje:'El 29 de mayo es festivo en Colombia. Todas las tiendas deben despachar el 28 antes de las 2pm.', nivel:'ALERTA', fecha:'08/05/2026', activa:true, destinatarios:['COL'] },
  { id:3, titulo:'Día de la Madre — Oportunidad de escalar', mensaje:'Este fin de semana es Día de la Madre. Alta demanda en accesorios y joyería. Considera aumentar pauta.', nivel:'INFO', fecha:'08/05/2026', activa:false, destinatarios:'todas' },
]

const PLANES = {
  starter: { color:'#8B96A8', label:'Starter', precio:'$49.900/mes', modulos:8 },
  pro: { color:'#F5A623', label:'Pro', precio:'$99.900/mes', modulos:15 },
  enterprise: { color:'#2DD4A0', label:'Enterprise', precio:'$199.900/mes', modulos:18 },
}

const ROLES_INFO: Record<string, { color:string; label:string; permisos:string[] }> = {
  superadmin: { color:'#F05C5C', label:'Superadmin', permisos:['Todo el sistema','Todas las tiendas','Gestión de licencias'] },
  owner: { color:'#F5A623', label:'Owner', permisos:['Su tienda completa','Todos los módulos','Ver reportes'] },
  gestor_pedidos: { color:'#3D8EF0', label:'Gestor Pedidos', permisos:['Pedidos','WhatsApp','PQRSF'] },
  trafficker: { color:'#9B6BFF', label:'Trafficker', permisos:['Pauta','Embudo','Campañas'] },
  tesorero: { color:'#2DD4A0', label:'Tesorero', permisos:['Wallet','P&G','Costos'] },
  logistica: { color:'#F5A623', label:'Logística', permisos:['Logística','Pedidos (solo ver)','Novedades'] },
  readonly: { color:'#5A6478', label:'Solo lectura', permisos:['Ver dashboard','Sin editar'] },
}

function semaforo(val: number, bueno: number, inv = false) {
  if (inv) return val <= bueno * 0.8 ? '#2DD4A0' : val <= bueno ? '#F5A623' : '#F05C5C'
  return val >= bueno ? '#2DD4A0' : val >= bueno * 0.8 ? '#F5A623' : '#F05C5C'
}

function fmt(n: number) {
  return n >= 1000000 ? `$${(n/1000000).toFixed(1)}M` : n >= 1000 ? `$${Math.round(n/1000)}K` : `$${n}`
}

export default function AdminPage() {
  const [tab, setTab] = useState<'tiendas'|'benchmark'|'usuarios'|'alertas'|'reportes'>('tiendas')
  const [tiendaSel, setTiendaSel] = useState<string | null>(null)
  const [filtroEstado, setFiltroEstado] = useState('todas')
  const [filtroPlan, setFiltroPlan] = useState('todos')
  const [nuevaAlerta, setNuevaAlerta] = useState({ titulo:'', mensaje:'', nivel:'INFO', destinatarios:'todas' })
  const [alertas, setAlertas] = useState<AlertaGlobal[]>(ALERTAS_GLOBALES)
  const [mostrarFormAlerta, setMostrarFormAlerta] = useState(false)

  const tiendas = TIENDAS.filter(t => {
    if (filtroEstado !== 'todas' && t.estado !== filtroEstado) return false
    if (filtroPlan !== 'todos' && t.plan !== filtroPlan) return false
    return true
  })

  const tiendaSelObj = tiendaSel ? TIENDAS.find(t => t.id === tiendaSel) : null

  // Stats globales
  const activas = TIENDAS.filter(t => t.estado === 'activa').length
  const total_pedidos = TIENDAS.reduce((s,t) => s+t.pedidos_mes, 0)
  const total_ventas = TIENDAS.reduce((s,t) => s+t.ventas_mes, 0)
  const roas_prom = TIENDAS.filter(t=>t.roas>0).reduce((s,t,_,a)=>s+t.roas/a.length,0)
  const mrr = TIENDAS.filter(t=>t.estado==='activa').reduce((s,t)=> s+(t.plan==='starter'?49900:t.plan==='pro'?99900:199900),0)

  function publicarAlerta() {
    if (!nuevaAlerta.titulo || !nuevaAlerta.mensaje) return
    setAlertas(prev => [{ id:prev.length+1, titulo:nuevaAlerta.titulo, mensaje:nuevaAlerta.mensaje, nivel:nuevaAlerta.nivel as any, fecha:new Date().toLocaleDateString('es-CO'), activa:true, destinatarios:nuevaAlerta.destinatarios as any }, ...prev])
    setNuevaAlerta({ titulo:'', mensaje:'', nivel:'INFO', destinatarios:'todas' })
    setMostrarFormAlerta(false)
  }

  const s = { background:'#111520', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'12px' }
  const inp = { background:'#0A0D14', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'7px', color:'#E8EDF5', padding:'7px 10px', fontSize:'13px', outline:'none', width:'100%', boxSizing:'border-box' as const }

  return (
    <div style={{ color:'#E8EDF5', fontFamily:'system-ui,sans-serif' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'4px' }}>
            <div style={{ padding:'3px 10px', background:'rgba(240,92,92,0.15)', border:'1px solid rgba(240,92,92,0.3)', borderRadius:'6px', fontSize:'10px', fontWeight:'800', color:'#F05C5C', letterSpacing:'1px' }}>
              SUPERADMIN
            </div>
            <h1 style={{ fontSize:'22px', fontWeight:'700' }}>Panel de Administración</h1>
          </div>
          <p style={{ fontSize:'13px', color:'#8B96A8' }}>Joan Torres · Control total de la plataforma DIZGO · ACTUAR</p>
        </div>
        <a href="/dashboard" style={{ padding:'9px 16px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'10px', color:'#8B96A8', textDecoration:'none', fontSize:'13px' }}>
          ← Dashboard
        </a>
      </div>

      {/* KPIs plataforma */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'8px', marginBottom:'16px' }}>
        {[
          { label:'Tiendas activas', value:`${activas}/${TIENDAS.length}`, color:'#2DD4A0', icon:'🏪' },
          { label:'MRR mensual', value:fmt(mrr), color:'#F5A623', icon:'💰' },
          { label:'Pedidos totales/mes', value:total_pedidos.toLocaleString(), color:'#3D8EF0', icon:'📦' },
          { label:'Ventas totales/mes', value:fmt(total_ventas), color:'#2DD4A0', icon:'💸' },
          { label:'ROAS promedio', value:`${roas_prom.toFixed(2)}x`, color:roas_prom >= 2.5 ? '#2DD4A0' : '#F5A623', icon:'📈' },
          { label:'Usuarios activos', value:USUARIOS.filter(u=>u.activo).length.toString(), color:'#9B6BFF', icon:'👥' },
        ].map((k,i) => (
          <div key={i} style={{ ...s, padding:'12px', borderTop:`2px solid ${k.color}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
              <span style={{ fontSize:'10px', color:'#8B96A8' }}>{k.label}</span>
              <span>{k.icon}</span>
            </div>
            <div style={{ fontSize:'18px', fontWeight:'800', color:k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'6px', marginBottom:'16px' }}>
        {[
          { key:'tiendas', label:'🏪 Tiendas' },
          { key:'benchmark', label:'📊 Benchmark' },
          { key:'usuarios', label:'👥 Usuarios & Roles' },
          { key:'alertas', label:'🚨 Alertas Globales' },
          { key:'reportes', label:'📋 Reportes' },
        ].map(t => (
          <button key={t.key} onClick={() => { setTab(t.key as any); setTiendaSel(null) }}
            style={{ padding:'8px 14px', borderRadius:'9px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:'600',
              background: tab === t.key ? '#F5A623' : 'rgba(255,255,255,0.05)',
              color: tab === t.key ? '#0A0D14' : '#8B96A8' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB TIENDAS */}
      {tab === 'tiendas' && (
        <div style={{ display:'grid', gridTemplateColumns: tiendaSelObj ? '1fr 380px' : '1fr', gap:'16px' }}>
          <div>
            {/* Filtros */}
            <div style={{ display:'flex', gap:'6px', marginBottom:'12px', flexWrap:'wrap' }}>
              {['todas','activa','prueba','vencida','suspendida'].map(f => (
                <button key={f} onClick={() => setFiltroEstado(f)}
                  style={{ padding:'5px 12px', borderRadius:'7px', border:'none', cursor:'pointer', fontSize:'11px', fontWeight:'600',
                    background: filtroEstado === f ? '#F5A623' : 'rgba(255,255,255,0.05)',
                    color: filtroEstado === f ? '#0A0D14' : '#8B96A8' }}>
                  {f.charAt(0).toUpperCase()+f.slice(1)}
                </button>
              ))}
              <div style={{ width:'1px', background:'rgba(255,255,255,0.08)', margin:'0 2px' }} />
              {['todos','starter','pro','enterprise'].map(p => (
                <button key={p} onClick={() => setFiltroPlan(p)}
                  style={{ padding:'5px 12px', borderRadius:'7px', border:'none', cursor:'pointer', fontSize:'11px', fontWeight:'600',
                    background: filtroPlan === p ? (PLANES[p as keyof typeof PLANES]?.color || '#F5A623') : 'rgba(255,255,255,0.05)',
                    color: filtroPlan === p ? (p === 'todos' ? '#0A0D14' : '#0A0D14') : '#8B96A8' }}>
                  {p === 'todos' ? 'Todos los planes' : PLANES[p as keyof typeof PLANES]?.label}
                </button>
              ))}
            </div>

            {/* Tabla de tiendas */}
            <div style={{ ...s, overflow:'hidden' }}>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
                  <thead>
                    <tr style={{ background:'#0A0D14', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                      {['Tienda','País','Plan','Estado','Owner','Pedidos/mes','Ventas/mes','ROAS','T.Entrega','Margen','Acceso','Acciones'].map(h => (
                        <th key={h} style={{ padding:'9px 10px', textAlign:'left', fontSize:'10px', color:'#5A6478', fontWeight:'700', whiteSpace:'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tiendas.map(t => {
                      const plan = PLANES[t.plan]
                      const estadoColor = { activa:'#2DD4A0', prueba:'#F5A623', vencida:'#F05C5C', suspendida:'#8B96A8' }[t.estado]
                      return (
                        <tr key={t.id} onClick={() => setTiendaSel(t.id === tiendaSel ? null : t.id)}
                          style={{ borderBottom:'1px solid rgba(255,255,255,0.03)', cursor:'pointer',
                            background: tiendaSel === t.id ? 'rgba(245,166,35,0.04)' : 'transparent' }}
                          onMouseEnter={e => { if(tiendaSel !== t.id)(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)' }}
                          onMouseLeave={e => { if(tiendaSel !== t.id)(e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                          <td style={{ padding:'9px 10px' }}>
                            <div style={{ fontWeight:'700', fontSize:'13px' }}>{t.nombre}</div>
                            <div style={{ fontSize:'10px', color:'#5A6478', fontFamily:'monospace' }}>{t.slug}</div>
                          </td>
                          <td style={{ padding:'9px 10px' }}>
                            <span style={{ fontSize:'12px' }}>{{ COL:'🇨🇴', ECU:'🇪🇨', MEX:'🇲🇽' }[t.pais]}</span>
                          </td>
                          <td style={{ padding:'9px 10px' }}>
                            <span style={{ fontSize:'11px', padding:'2px 8px', borderRadius:'5px', fontWeight:'700', background:`${plan.color}15`, color:plan.color }}>{plan.label}</span>
                          </td>
                          <td style={{ padding:'9px 10px' }}>
                            <span style={{ fontSize:'11px', padding:'2px 8px', borderRadius:'5px', fontWeight:'700', background:`${estadoColor}15`, color:estadoColor }}>{t.estado}</span>
                          </td>
                          <td style={{ padding:'9px 10px', fontSize:'12px', color:'#8B96A8' }}>{t.owner}</td>
                          <td style={{ padding:'9px 10px', fontWeight:'700', color:'#3D8EF0' }}>{t.pedidos_mes.toLocaleString()}</td>
                          <td style={{ padding:'9px 10px', color:'#8B96A8' }}>{fmt(t.ventas_mes)}</td>
                          <td style={{ padding:'9px 10px', fontWeight:'800', color:semaforo(t.roas, 2.5) }}>{t.roas > 0 ? `${t.roas}x` : '—'}</td>
                          <td style={{ padding:'9px 10px', fontWeight:'700', color:semaforo(t.tasa_entrega, 75) }}>{t.tasa_entrega > 0 ? `${t.tasa_entrega}%` : '—'}</td>
                          <td style={{ padding:'9px 10px', fontWeight:'800', color:semaforo(t.margen_neto, 12) }}>{t.margen_neto > 0 ? `${t.margen_neto}%` : '—'}</td>
                          <td style={{ padding:'9px 10px', fontSize:'11px', color:'#5A6478' }}>{t.ultimo_acceso}</td>
                          <td style={{ padding:'9px 10px' }} onClick={e => e.stopPropagation()}>
                            <div style={{ display:'flex', gap:'4px' }}>
                              <button onClick={() => setTiendaSel(t.id)}
                                style={{ padding:'3px 8px', background:'rgba(61,142,240,0.1)', border:'none', borderRadius:'5px', color:'#3D8EF0', cursor:'pointer', fontSize:'10px' }}>Ver</button>
                              <button style={{ padding:'3px 8px', background:t.estado==='activa' ? 'rgba(240,92,92,0.1)' : 'rgba(45,212,160,0.1)', border:'none', borderRadius:'5px', color:t.estado==='activa' ? '#F05C5C' : '#2DD4A0', cursor:'pointer', fontSize:'10px' }}>
                                {t.estado==='activa' ? 'Suspender' : 'Activar'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Panel tienda seleccionada */}
          {tiendaSelObj && (
            <div style={{ ...s, padding:'20px', position:'sticky', top:'20px', maxHeight:'85vh', overflowY:'auto' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px' }}>
                <div>
                  <div style={{ fontSize:'16px', fontWeight:'800' }}>{tiendaSelObj.nombre}</div>
                  <div style={{ fontSize:'11px', color:'#5A6478' }}>/{tiendaSelObj.slug} · {tiendaSelObj.pais}</div>
                </div>
                <button onClick={() => setTiendaSel(null)} style={{ background:'none', border:'none', color:'#8B96A8', cursor:'pointer', fontSize:'20px' }}>×</button>
              </div>

              {/* KPIs tienda */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'14px' }}>
                {[
                  { l:'Plan', v:PLANES[tiendaSelObj.plan].label, c:PLANES[tiendaSelObj.plan].color },
                  { l:'Estado', v:tiendaSelObj.estado, c:{activa:'#2DD4A0',prueba:'#F5A623',vencida:'#F05C5C',suspendida:'#8B96A8'}[tiendaSelObj.estado] },
                  { l:'Vence', v:tiendaSelObj.fecha_vence, c:'#8B96A8' },
                  { l:'Módulos activos', v:`${tiendaSelObj.modulos_activos}/18`, c:'#3D8EF0' },
                  { l:'Pedidos/mes', v:tiendaSelObj.pedidos_mes.toLocaleString(), c:'#3D8EF0' },
                  { l:'Ventas/mes', v:fmt(tiendaSelObj.ventas_mes), c:'#2DD4A0' },
                  { l:'ROAS', v:tiendaSelObj.roas > 0 ? `${tiendaSelObj.roas}x` : '—', c:semaforo(tiendaSelObj.roas, 2.5) },
                  { l:'Margen neto', v:tiendaSelObj.margen_neto > 0 ? `${tiendaSelObj.margen_neto}%` : '—', c:semaforo(tiendaSelObj.margen_neto, 12) },
                ].map((k,i) => (
                  <div key={i} style={{ background:'rgba(255,255,255,0.02)', borderRadius:'8px', padding:'8px 10px' }}>
                    <div style={{ fontSize:'10px', color:'#5A6478' }}>{k.l}</div>
                    <div style={{ fontSize:'13px', fontWeight:'700', color:k.c as string }}>{k.v}</div>
                  </div>
                ))}
              </div>

              {/* Owner */}
              <div style={{ padding:'12px', background:'rgba(255,255,255,0.02)', borderRadius:'10px', marginBottom:'12px' }}>
                <div style={{ fontSize:'11px', color:'#5A6478', fontWeight:'700', marginBottom:'8px' }}>OWNER</div>
                {[
                  { l:'Nombre', v:tiendaSelObj.owner },
                  { l:'Email', v:tiendaSelObj.email },
                  { l:'Teléfono', v:tiendaSelObj.telefono },
                  { l:'Último acceso', v:tiendaSelObj.ultimo_acceso },
                ].map((f,i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:'12px' }}>
                    <span style={{ color:'#5A6478' }}>{f.l}</span>
                    <span style={{ color:'#E8EDF5', fontWeight:'600' }}>{f.v}</span>
                  </div>
                ))}
              </div>

              {/* Acciones */}
              <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                {[
                  { label:'📊 Ver Dashboard', color:'#3D8EF0' },
                  { label:'🔄 Renovar licencia', color:'#2DD4A0' },
                  { label:'⬆️ Cambiar plan', color:'#F5A623' },
                  { label:'📧 Enviar alerta', color:'#9B6BFF' },
                  { label:'⏸️ Suspender tienda', color:'#F05C5C' },
                ].map((a,i) => (
                  <button key={i}
                    style={{ padding:'9px 12px', background:`${a.color}10`, border:`1px solid ${a.color}22`, borderRadius:'8px', color:a.color, cursor:'pointer', fontSize:'12px', fontWeight:'600', textAlign:'left' }}>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB BENCHMARK */}
      {tab === 'benchmark' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div style={{ ...s, padding:'20px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'6px' }}>📊 BENCHMARK ANÓNIMO ENTRE TIENDAS</div>
            <div style={{ fontSize:'11px', color:'#5A6478', marginBottom:'14px' }}>Los datos se muestran anonimizados. Cada tienda solo ve su posición relativa.</div>

            {[
              { metrica:'ROAS promedio', datos:TIENDAS.filter(t=>t.roas>0).map(t=>({ v:t.roas, id:t.id })), bueno:3, formato:'x' },
              { metrica:'Tasa de entrega', datos:TIENDAS.filter(t=>t.tasa_entrega>0).map(t=>({ v:t.tasa_entrega, id:t.id })), bueno:80, formato:'%' },
              { metrica:'Margen neto', datos:TIENDAS.filter(t=>t.margen_neto>0).map(t=>({ v:t.margen_neto, id:t.id })), bueno:15, formato:'%' },
              { metrica:'CPA real', datos:TIENDAS.filter(t=>t.cpa>0).map(t=>({ v:t.cpa, id:t.id })), bueno:10000, formato:'cop', inv:true },
            ].map((bm, i) => {
              const sorted = [...bm.datos].sort((a,b) => (bm as any).inv ? a.v-b.v : b.v-a.v)
              const prom = sorted.reduce((s,d)=>s+d.v,0)/sorted.length
              const maxV = Math.max(...sorted.map(d=>d.v))
              return (
                <div key={i} style={{ marginBottom:'20px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                    <span style={{ fontSize:'12px', fontWeight:'700', color:'#E8EDF5' }}>{bm.metrica}</span>
                    <span style={{ fontSize:'11px', color:'#5A6478' }}>Promedio: {bm.formato === 'cop' ? fmt(prom) : `${Math.round(prom*10)/10}${bm.formato}`}</span>
                  </div>
                  {sorted.map((d, j) => {
                    const esMia = d.id === 't1'
                    const pct = Math.max((d.v / maxV) * 100, 5)
                    const color = (bm as any).inv ? semaforo(d.v, bm.bueno, true) : semaforo(d.v, bm.bueno)
                    const label = esMia ? 'Tu tienda' : `Tienda ${String.fromCharCode(65+j)}`
                    const val = bm.formato === 'cop' ? fmt(d.v) : bm.formato === 'x' ? `${d.v}x` : `${d.v}%`
                    return (
                      <div key={j} style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'5px' }}>
                        <span style={{ fontSize:'11px', width:'80px', flexShrink:0, color: esMia ? '#F5A623' : '#5A6478', fontWeight: esMia ? '700' : '400' }}>{label}</span>
                        <div style={{ flex:1, height:'20px', background:'rgba(255,255,255,0.04)', borderRadius:'4px', overflow:'hidden', position:'relative' }}>
                          <div style={{ height:'20px', width:`${pct}%`, background: esMia ? `${color}` : `${color}66`, borderRadius:'4px', display:'flex', alignItems:'center', paddingLeft:'6px' }}>
                            <span style={{ fontSize:'11px', color:'#fff', fontWeight:'700' }}>{val}</span>
                          </div>
                          {/* Línea promedio */}
                          <div style={{ position:'absolute', top:0, left:`${(prom/maxV)*100}%`, width:'1px', height:'100%', background:'rgba(245,166,35,0.5)' }} />
                        </div>
                        <span style={{ fontSize:'10px', flexShrink:0 }}>{j===0 ? '🏆' : j===1 ? '🥈' : j===2 ? '🥉' : ''}</span>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>

          {/* Distribución por plan */}
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#3D8EF0', marginBottom:'14px' }}>📈 DISTRIBUCIÓN DE LA PLATAFORMA</div>
              {[
                { label:'Por plan', data:[
                  { k:'Enterprise', v:TIENDAS.filter(t=>t.plan==='enterprise').length, c:'#2DD4A0' },
                  { k:'Pro', v:TIENDAS.filter(t=>t.plan==='pro').length, c:'#F5A623' },
                  { k:'Starter', v:TIENDAS.filter(t=>t.plan==='starter').length, c:'#3D8EF0' },
                ]},
                { label:'Por estado', data:[
                  { k:'Activas', v:TIENDAS.filter(t=>t.estado==='activa').length, c:'#2DD4A0' },
                  { k:'Prueba', v:TIENDAS.filter(t=>t.estado==='prueba').length, c:'#F5A623' },
                  { k:'Vencidas', v:TIENDAS.filter(t=>t.estado==='vencida').length, c:'#F05C5C' },
                ]},
                { label:'Por país', data:[
                  { k:'Colombia', v:TIENDAS.filter(t=>t.pais==='COL').length, c:'#F5A623' },
                  { k:'Ecuador', v:TIENDAS.filter(t=>t.pais==='ECU').length, c:'#3D8EF0' },
                  { k:'México', v:TIENDAS.filter(t=>t.pais==='MEX').length, c:'#9B6BFF' },
                ]},
              ].map((grupo, i) => (
                <div key={i} style={{ marginBottom:'16px' }}>
                  <div style={{ fontSize:'11px', color:'#5A6478', fontWeight:'700', marginBottom:'8px' }}>{grupo.label.toUpperCase()}</div>
                  {grupo.data.map((d, j) => (
                    <div key={j} style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'5px' }}>
                      <span style={{ fontSize:'12px', color:'#8B96A8', width:'80px', flexShrink:0 }}>{d.k}</span>
                      <div style={{ flex:1, height:'8px', background:'rgba(255,255,255,0.05)', borderRadius:'4px' }}>
                        <div style={{ height:'8px', width:`${(d.v/TIENDAS.length)*100}%`, background:d.c, borderRadius:'4px' }} />
                      </div>
                      <span style={{ fontSize:'12px', fontWeight:'800', color:d.c, width:'20px', textAlign:'right' }}>{d.v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#2DD4A0', marginBottom:'12px' }}>💰 MRR POR PLAN</div>
              {Object.entries(PLANES).map(([key, plan]) => {
                const count = TIENDAS.filter(t=>t.plan===key && t.estado==='activa').length
                const mrr_plan = count * parseInt(plan.precio.replace(/\D/g,''))
                return (
                  <div key={key} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                      <span style={{ fontSize:'11px', padding:'1px 7px', borderRadius:'5px', background:`${plan.color}15`, color:plan.color, fontWeight:'700' }}>{plan.label}</span>
                      <span style={{ fontSize:'11px', color:'#5A6478' }}>{count} tiendas × {plan.precio}</span>
                    </div>
                    <span style={{ fontSize:'13px', fontWeight:'800', color:plan.color }}>${mrr_plan.toLocaleString('es-CO')}</span>
                  </div>
                )
              })}
              <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', marginTop:'4px' }}>
                <span style={{ fontSize:'13px', fontWeight:'700' }}>TOTAL MRR</span>
                <span style={{ fontSize:'16px', fontWeight:'900', color:'#F5A623' }}>${mrr.toLocaleString('es-CO')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB USUARIOS */}
      {tab === 'usuarios' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div style={{ ...s, overflow:'hidden' }}>
            <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', fontWeight:'700' }}>
              👥 Usuarios de la plataforma
            </div>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
              <thead>
                <tr style={{ background:'#0A0D14', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                  {['Nombre','Email','Rol','Tienda','Estado','Último acceso'].map(h => (
                    <th key={h} style={{ padding:'9px 12px', textAlign:'left', fontSize:'10px', color:'#5A6478', fontWeight:'700', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {USUARIOS.map((u, i) => {
                  const rol = ROLES_INFO[u.rol]
                  return (
                    <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding:'9px 12px', fontWeight:'600' }}>{u.nombre}</td>
                      <td style={{ padding:'9px 12px', color:'#8B96A8', fontSize:'11px' }}>{u.email}</td>
                      <td style={{ padding:'9px 12px' }}>
                        <span style={{ fontSize:'10px', padding:'2px 7px', borderRadius:'5px', fontWeight:'700', background:`${rol.color}15`, color:rol.color }}>{rol.label}</span>
                      </td>
                      <td style={{ padding:'9px 12px', color:'#8B96A8', fontSize:'11px' }}>{u.tienda}</td>
                      <td style={{ padding:'9px 12px' }}>
                        <span style={{ fontSize:'11px', fontWeight:'700', color: u.activo ? '#2DD4A0' : '#F05C5C' }}>{u.activo ? '● Activo' : '○ Inactivo'}</span>
                      </td>
                      <td style={{ padding:'9px 12px', color:'#5A6478', fontSize:'11px' }}>{u.ultimo_acceso}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Roles y permisos */}
          <div style={{ ...s, padding:'20px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#9B6BFF', marginBottom:'14px' }}>🔐 ROLES Y PERMISOS</div>
            {Object.entries(ROLES_INFO).map(([key, rol]) => (
              <div key={key} style={{ padding:'12px', borderRadius:'10px', marginBottom:'8px', background:`${rol.color}06`, borderLeft:`3px solid ${rol.color}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px' }}>
                  <span style={{ fontSize:'13px', fontWeight:'700', color:rol.color }}>{rol.label}</span>
                  <span style={{ fontSize:'10px', color:'#5A6478' }}>{USUARIOS.filter(u=>u.rol===key).length} usuarios</span>
                </div>
                <div style={{ display:'flex', gap:'5px', flexWrap:'wrap' }}>
                  {rol.permisos.map((p, i) => (
                    <span key={i} style={{ fontSize:'10px', padding:'1px 7px', borderRadius:'4px', background:'rgba(255,255,255,0.06)', color:'#8B96A8' }}>{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB ALERTAS GLOBALES */}
      {tab === 'alertas' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'4px' }}>
              <span style={{ fontSize:'13px', fontWeight:'700' }}>Alertas publicadas</span>
              <button onClick={() => setMostrarFormAlerta(!mostrarFormAlerta)}
                style={{ padding:'7px 14px', background:'#F5A623', border:'none', borderRadius:'8px', color:'#0A0D14', cursor:'pointer', fontSize:'12px', fontWeight:'700' }}>
                + Nueva alerta global
              </button>
            </div>
            {alertas.map(a => {
              const nc = { INFO:'#3D8EF0', ALERTA:'#F5A623', CRITICO:'#F05C5C' }[a.nivel]
              return (
                <div key={a.id} style={{ ...s, padding:'14px 16px', opacity: a.activa ? 1 : 0.5, borderLeft:`3px solid ${a.activa ? nc : '#5A6478'}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                    <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                      <span style={{ fontSize:'10px', padding:'1px 7px', borderRadius:'5px', fontWeight:'700', background:`${nc}15`, color:nc }}>{a.nivel}</span>
                      <span style={{ fontSize:'13px', fontWeight:'700' }}>{a.titulo}</span>
                    </div>
                    <div style={{ display:'flex', gap:'6px', alignItems:'center' }}>
                      <span style={{ fontSize:'10px', color:'#5A6478' }}>{a.fecha}</span>
                      <button onClick={() => setAlertas(prev => prev.map(al => al.id === a.id ? { ...al, activa: !al.activa } : al))}
                        style={{ padding:'3px 8px', background: a.activa ? 'rgba(240,92,92,0.1)' : 'rgba(45,212,160,0.1)', border:'none', borderRadius:'5px', cursor:'pointer', fontSize:'10px', color: a.activa ? '#F05C5C' : '#2DD4A0' }}>
                        {a.activa ? 'Desactivar' : 'Activar'}
                      </button>
                    </div>
                  </div>
                  <div style={{ fontSize:'12px', color:'#8B96A8', marginBottom:'4px' }}>{a.mensaje}</div>
                  <div style={{ fontSize:'10px', color:'#5A6478' }}>
                    Destinatarios: {a.destinatarios === 'todas' ? '🌎 Todas las tiendas' : Array.isArray(a.destinatarios) ? a.destinatarios.join(', ') : a.destinatarios}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Formulario nueva alerta */}
          {mostrarFormAlerta && (
            <div style={{ ...s, padding:'20px', position:'sticky', top:'20px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'14px' }}>🚨 NUEVA ALERTA GLOBAL</div>
              <div style={{ marginBottom:'10px' }}>
                <label style={{ display:'block', fontSize:'11px', color:'#5A6478', marginBottom:'4px' }}>Nivel</label>
                <select value={nuevaAlerta.nivel} onChange={e => setNuevaAlerta(p=>({...p,nivel:e.target.value}))} style={{ ...inp, cursor:'pointer' }}>
                  <option value="INFO">🔵 INFO</option>
                  <option value="ALERTA">🟡 ALERTA</option>
                  <option value="CRITICO">🔴 CRÍTICO</option>
                </select>
              </div>
              <div style={{ marginBottom:'10px' }}>
                <label style={{ display:'block', fontSize:'11px', color:'#5A6478', marginBottom:'4px' }}>Destinatarios</label>
                <select value={nuevaAlerta.destinatarios} onChange={e => setNuevaAlerta(p=>({...p,destinatarios:e.target.value}))} style={{ ...inp, cursor:'pointer' }}>
                  <option value="todas">🌎 Todas las tiendas</option>
                  <option value="COL">🇨🇴 Solo Colombia</option>
                  <option value="ECU">🇪🇨 Solo Ecuador</option>
                  <option value="MEX">🇲🇽 Solo México</option>
                </select>
              </div>
              <div style={{ marginBottom:'10px' }}>
                <label style={{ display:'block', fontSize:'11px', color:'#5A6478', marginBottom:'4px' }}>Título *</label>
                <input value={nuevaAlerta.titulo} onChange={e => setNuevaAlerta(p=>({...p,titulo:e.target.value}))}
                  placeholder="Ej: Festivo 29 mayo" style={inp} />
              </div>
              <div style={{ marginBottom:'14px' }}>
                <label style={{ display:'block', fontSize:'11px', color:'#5A6478', marginBottom:'4px' }}>Mensaje *</label>
                <textarea value={nuevaAlerta.mensaje} onChange={e => setNuevaAlerta(p=>({...p,mensaje:e.target.value}))}
                  rows={3} placeholder="Descripción de la alerta..." style={{ ...inp, resize:'vertical' }} />
              </div>
              <div style={{ display:'flex', gap:'8px' }}>
                <button onClick={() => setMostrarFormAlerta(false)}
                  style={{ flex:1, padding:'9px', background:'rgba(255,255,255,0.05)', border:'none', borderRadius:'8px', color:'#8B96A8', cursor:'pointer', fontSize:'13px' }}>
                  Cancelar
                </button>
                <button onClick={publicarAlerta} disabled={!nuevaAlerta.titulo || !nuevaAlerta.mensaje}
                  style={{ flex:1, padding:'9px', background: nuevaAlerta.titulo && nuevaAlerta.mensaje ? '#F5A623' : 'rgba(255,255,255,0.05)',
                    border:'none', borderRadius:'8px', color: nuevaAlerta.titulo && nuevaAlerta.mensaje ? '#0A0D14' : '#5A6478',
                    cursor: nuevaAlerta.titulo && nuevaAlerta.mensaje ? 'pointer' : 'not-allowed', fontWeight:'700', fontSize:'13px' }}>
                  🚨 Publicar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB REPORTES */}
      {tab === 'reportes' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div style={{ ...s, padding:'20px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#3D8EF0', marginBottom:'14px' }}>📋 REPORTES ESTADÍSTICOS AGREGADOS</div>
            {[
              { titulo:'Reporte mensual de tiendas', desc:'Ventas, pedidos, ROAS y margen de todas las tiendas del mes', formato:'PDF · Excel', color:'#3D8EF0' },
              { titulo:'Ranking de performance', desc:'Tiendas ordenadas por ROAS, margen y tasa de entrega', formato:'PDF', color:'#F5A623' },
              { titulo:'Benchmark de mercado', desc:'Comparativo anónimo entre todas las tiendas activas', formato:'PDF', color:'#9B6BFF' },
              { titulo:'Reporte de ingresos plataforma', desc:'MRR, churn, crecimiento por plan y país', formato:'Excel', color:'#2DD4A0' },
              { titulo:'Alertas y novedades del período', desc:'Resumen de alertas publicadas y gestionadas', formato:'PDF', color:'#F05C5C' },
            ].map((r, i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 14px', borderRadius:'10px', marginBottom:'7px', background:`${r.color}06`, borderLeft:`3px solid ${r.color}` }}>
                <div>
                  <div style={{ fontSize:'13px', fontWeight:'700', color:'#E8EDF5', marginBottom:'3px' }}>{r.titulo}</div>
                  <div style={{ fontSize:'11px', color:'#8B96A8' }}>{r.desc}</div>
                  <div style={{ fontSize:'10px', color:r.color, marginTop:'2px', fontWeight:'600' }}>📄 {r.formato}</div>
                </div>
                <button style={{ padding:'7px 14px', background:`${r.color}15`, border:`1px solid ${r.color}22`, borderRadius:'8px', color:r.color, cursor:'pointer', fontSize:'12px', fontWeight:'700', flexShrink:0 }}>
                  Generar
                </button>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'12px' }}>📊 RESUMEN PLATAFORMA — Mayo 2026</div>
              {[
                { label:'Tiendas activas', value:`${activas}/${TIENDAS.length}`, color:'#2DD4A0' },
                { label:'MRR total', value:`$${mrr.toLocaleString('es-CO')}`, color:'#F5A623' },
                { label:'Pedidos totales/mes', value:total_pedidos.toLocaleString(), color:'#3D8EF0' },
                { label:'Ventas totales/mes', value:fmt(total_ventas), color:'#2DD4A0' },
                { label:'ROAS promedio plataforma', value:`${roas_prom.toFixed(2)}x`, color:roas_prom >= 2.5 ? '#2DD4A0' : '#F5A623' },
                { label:'Tiendas vencidas (riesgo)', value:TIENDAS.filter(t=>t.estado==='vencida').length.toString(), color:'#F05C5C' },
                { label:'Tiendas en prueba', value:TIENDAS.filter(t=>t.estado==='prueba').length.toString(), color:'#F5A623' },
                { label:'Módulos promedio por tienda', value:`${Math.round(TIENDAS.reduce((s,t)=>s+t.modulos_activos,0)/TIENDAS.length)}/18`, color:'#9B6BFF' },
              ].map((k,i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize:'12px', color:'#8B96A8' }}>{k.label}</span>
                  <span style={{ fontSize:'13px', fontWeight:'800', color:k.color }}>{k.value}</span>
                </div>
              ))}
            </div>

            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#F05C5C', marginBottom:'12px' }}>🚨 ACCIONES PENDIENTES SUPERADMIN</div>
              {[
                { urgencia:'HOY', texto:'Renovar licencia de "Drop & Save" — vencida hace 3 meses', color:'#F05C5C' },
                { urgencia:'ESTA SEMANA', texto:'Convertir a "Moda Femenina CO" de prueba a plan Starter', color:'#F5A623' },
                { urgencia:'ESTE MES', texto:'Publicar alerta global sobre festivos de junio', color:'#3D8EF0' },
                { urgencia:'PRÓXIMO MES', texto:'Revisar benchmark y ajustar benchmarks de referencia', color:'#2DD4A0' },
              ].map((a,i) => (
                <div key={i} style={{ display:'flex', gap:'8px', padding:'8px 10px', borderRadius:'7px', marginBottom:'5px', background:`${a.color}06` }}>
                  <span style={{ fontSize:'10px', fontWeight:'800', padding:'2px 6px', borderRadius:'4px', flexShrink:0, height:'fit-content', marginTop:'1px', background:`${a.color}15`, color:a.color }}>{a.urgencia}</span>
                  <span style={{ fontSize:'12px', color:'#8B96A8' }}>{a.texto}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
