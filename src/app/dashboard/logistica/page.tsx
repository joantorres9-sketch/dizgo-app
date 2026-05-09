'use client'
import { useState } from 'react'

type Transportadora = {
  nombre: string; emoji: string; color: string
  total: number; entregados: number; devolucion: number
  novedad: number; transito: number; cancelado: number
  valor_entregado: number; valor_devolucion: number
  dias_promedio: number; cobertura: string
}

type Novedad = {
  id: number; tipo: string; descripcion: string
  cliente: string; ciudad: string; guia: string
  transportadora: string; fecha: string; solucionada: boolean
}

// Datos reales de agosto 2023
const TRANSPORTADORAS: Transportadora[] = [
  { nombre:'ENVIA', emoji:'🟠', color:'#F5A623', total:2517, entregados:381, devolucion:6, novedad:100, transito:2030, cancelado:0, valor_entregado:26990000, valor_devolucion:419400, dias_promedio:4, cobertura:'Nacional Colombia' },
  { nombre:'COORDINADORA', emoji:'🔵', color:'#3D8EF0', total:268, entregados:18, devolucion:0, novedad:1, transito:249, cancelado:0, valor_entregado:1259100, valor_devolucion:0, dias_promedio:5, cobertura:'Nacional Colombia' },
  { nombre:'SERVIENTREGA', emoji:'🔴', color:'#F05C5C', total:215, entregados:4, devolucion:0, novedad:0, transito:211, cancelado:0, valor_entregado:279600, valor_devolucion:0, dias_promedio:4, cobertura:'Nacional Colombia' },
]

const NOVEDADES_DATA: Novedad[] = [
  { id:1, tipo:'DIRECCION', descripcion:'DIRECCIÓN DESTINATARIO NO EXISTE', cliente:'Sedalis Torres', ciudad:'URUMITA - LA GUAJIRA', guia:'COL123462', transportadora:'ENVIA', fecha:'04-09-2023', solucionada:false },
  { id:2, tipo:'COORDINAR', descripcion:'COORDINAR LA ENTREGA', cliente:'Rosa Orozco', ciudad:'BELLO - ANTIOQUIA', guia:'COL123460', transportadora:'ENVIA', fecha:'04-09-2023', solucionada:false },
  { id:3, tipo:'REHUSA', descripcion:'DESTINATARIO SE REHUSA A RECIBIR', cliente:'Carlos Mendez', ciudad:'CALI - VALLE', guia:'COL123464', transportadora:'ENVIA', fecha:'03-09-2023', solucionada:true },
  { id:4, tipo:'DIRECCION', descripcion:'DIRECCIÓN DESTINATARIO INCOMPLETA', cliente:'Diana Lopez', ciudad:'VILLAVICENCIO - META', guia:'COL123470', transportadora:'COORDINADORA', fecha:'01-09-2023', solucionada:false },
  { id:5, tipo:'COORDINAR', descripcion:'COORDINAR LA ENTREGA', cliente:'Ana Perez', ciudad:'BARRANQUILLA - ATLANTICO', guia:'COL123465', transportadora:'ENVIA', fecha:'03-09-2023', solucionada:false },
  { id:6, tipo:'CANCELADO', descripcion:'PEDIDO CANCELADO POR CLIENTE', cliente:'Jorge Ramirez', ciudad:'BOGOTA - CUNDINAMARCA', guia:'COL123467', transportadora:'ENVIA', fecha:'02-09-2023', solucionada:true },
]

const CIUDADES_TOP = [
  { ciudad:'BOGOTA', dpto:'CUNDINAMARCA', total:409, entregados:82, pct:20 },
  { ciudad:'MEDELLIN', dpto:'ANTIOQUIA', total:142, entregados:31, pct:22 },
  { ciudad:'CALI', dpto:'VALLE', total:127, entregados:24, pct:19 },
  { ciudad:'BARRANQUILLA', dpto:'ATLANTICO', total:81, entregados:18, pct:22 },
  { ciudad:'CARTAGENA', dpto:'BOLIVAR', total:71, entregados:14, pct:20 },
  { ciudad:'VILLAVICENCIO', dpto:'META', total:64, entregados:11, pct:17 },
  { ciudad:'BUCARAMANGA', dpto:'SANTANDER', total:53, entregados:12, pct:23 },
  { ciudad:'PASTO', dpto:'NARIÑO', total:46, entregados:8, pct:17 },
  { ciudad:'CUCUTA', dpto:'N. SANTANDER', total:39, entregados:7, pct:18 },
  { ciudad:'IBAGUE', dpto:'TOLIMA', total:38, entregados:8, pct:21 },
]

const TIPO_NOVEDAD_COLOR: Record<string, string> = {
  'DIRECCION':'#F05C5C', 'COORDINAR':'#F5A623',
  'REHUSA':'#F05C5C', 'CANCELADO':'#F05C5C', 'OTRO':'#8B96A8'
}

export default function LogisticaPage() {
  const [novedades, setNovedades] = useState<Novedad[]>(NOVEDADES_DATA)
  const [tab, setTab] = useState<'transportadoras'|'novedades'|'ciudades'|'analisis'>('transportadoras')
  const [transportadoraSel, setTransportadoraSel] = useState<string | null>(null)

  const totalPedidos = TRANSPORTADORAS.reduce((s,t) => s+t.total, 0)
  const totalEntregados = TRANSPORTADORAS.reduce((s,t) => s+t.entregados, 0)
  const totalNovedades = TRANSPORTADORAS.reduce((s,t) => s+t.novedad, 0)
  const totalDevoluciones = TRANSPORTADORAS.reduce((s,t) => s+t.devolucion, 0)
  const tasaEntrega = Math.round(totalEntregados/totalPedidos*100)
  const novedadesSin = novedades.filter(n => !n.solucionada).length

  function toggleNovedad(id: number) {
    setNovedades(prev => prev.map(n => n.id===id ? {...n, solucionada:!n.solucionada} : n))
  }

  function semE(tasa: number) {
    return tasa >= 75 ? '#2DD4A0' : tasa >= 50 ? '#F5A623' : '#F05C5C'
  }

  const s = { background:'#111520', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'12px' }
  const transSel = transportadoraSel ? TRANSPORTADORAS.find(t => t.nombre === transportadoraSel) : null

  return (
    <div style={{ color:'#E8EDF5', fontFamily:'system-ui,sans-serif' }}>

      <div style={{ marginBottom:'20px' }}>
        <h1 style={{ fontSize:'22px', fontWeight:'700', marginBottom:'4px' }}>🚚 Logística & Transportadoras</h1>
        <p style={{ fontSize:'13px', color:'#8B96A8' }}>Datos reales agosto 2023 · 3 transportadoras · HACER</p>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'8px', marginBottom:'16px' }}>
        {[
          { label:'Total pedidos', value:totalPedidos.toLocaleString(), color:'#E8EDF5', icon:'📦' },
          { label:'Entregados', value:totalEntregados.toLocaleString(), color:'#2DD4A0', icon:'✅' },
          { label:'Tasa entrega', value:`${tasaEntrega}%`, color:semE(tasaEntrega), icon:'📊' },
          { label:'En tránsito', value:TRANSPORTADORAS.reduce((s,t)=>s+t.transito,0).toLocaleString(), color:'#3D8EF0', icon:'🚚' },
          { label:'Novedades', value:totalNovedades.toLocaleString(), color:'#F5A623', icon:'⚠️' },
          { label:'Sin resolver', value:novedadesSin.toString(), color: novedadesSin > 0 ? '#F05C5C' : '#2DD4A0', icon:'🚨' },
        ].map((k,i) => (
          <div key={i} style={{ ...s, padding:'12px', borderTop:`2px solid ${k.color}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
              <span style={{ fontSize:'10px', color:'#8B96A8' }}>{k.label}</span>
              <span style={{ fontSize:'14px' }}>{k.icon}</span>
            </div>
            <div style={{ fontSize:'20px', fontWeight:'800', color:k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'6px', marginBottom:'16px' }}>
        {[
          { key:'transportadoras', label:'🚚 Transportadoras' },
          { key:'novedades', label:`⚠️ Novedades (${novedadesSin} sin resolver)` },
          { key:'ciudades', label:'🗺️ Cobertura' },
          { key:'analisis', label:'📊 Análisis' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            style={{ padding:'8px 14px', borderRadius:'9px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:'600',
              background: tab === t.key ? '#F5A623' : 'rgba(255,255,255,0.05)',
              color: tab === t.key ? '#0A0D14' : '#8B96A8' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB TRANSPORTADORAS */}
      {tab === 'transportadoras' && (
        <div style={{ display:'grid', gridTemplateColumns: transSel ? '1fr 1fr' : '1fr', gap:'16px' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {TRANSPORTADORAS.map(t => {
              const tasaE = Math.round(t.entregados/t.total*100)
              const tasaD = Math.round(t.devolucion/t.total*100)
              const tasaN = Math.round(t.novedad/t.total*100)
              const seleccionada = transportadoraSel === t.nombre
              return (
                <div key={t.nombre} onClick={() => setTransportadoraSel(seleccionada ? null : t.nombre)}
                  style={{ ...s, padding:'18px', cursor:'pointer', border:`1px solid ${seleccionada ? t.color + '44' : 'rgba(255,255,255,0.07)'}`, background: seleccionada ? t.color + '08' : '#111520', transition:'all .15s' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'14px' }}>
                    <span style={{ fontSize:'28px' }}>{t.emoji}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:'16px', fontWeight:'800', color:t.color }}>{t.nombre}</div>
                      <div style={{ fontSize:'11px', color:'#5A6478' }}>{t.cobertura} · {t.dias_promedio} días promedio</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:'22px', fontWeight:'800', color:'#E8EDF5' }}>{t.total.toLocaleString()}</div>
                      <div style={{ fontSize:'10px', color:'#5A6478' }}>pedidos</div>
                    </div>
                  </div>

                  {/* Barras */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px', marginBottom:'12px' }}>
                    {[
                      { label:'Entregados', value:t.entregados, pct:tasaE, color:'#2DD4A0' },
                      { label:'Novedades', value:t.novedad, pct:tasaN, color:'#F5A623' },
                      { label:'Devoluciones', value:t.devolucion, pct:tasaD, color:'#F05C5C' },
                    ].map((bar, i) => (
                      <div key={i}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'3px' }}>
                          <span style={{ fontSize:'10px', color:'#8B96A8' }}>{bar.label}</span>
                          <span style={{ fontSize:'11px', fontWeight:'700', color:bar.color }}>{bar.pct}%</span>
                        </div>
                        <div style={{ height:'6px', background:'rgba(255,255,255,0.05)', borderRadius:'3px' }}>
                          <div style={{ height:'6px', width:`${bar.pct}%`, background:bar.color, borderRadius:'3px' }} />
                        </div>
                        <div style={{ fontSize:'10px', color:'#5A6478', marginTop:'2px' }}>{bar.value} pedidos</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                    <div style={{ background:'rgba(45,212,160,0.06)', borderRadius:'8px', padding:'8px 10px' }}>
                      <div style={{ fontSize:'10px', color:'#5A6478' }}>Valor entregado</div>
                      <div style={{ fontSize:'14px', fontWeight:'700', color:'#2DD4A0' }}>${Math.round(t.valor_entregado/1000)}K</div>
                    </div>
                    <div style={{ background:'rgba(240,92,92,0.06)', borderRadius:'8px', padding:'8px 10px' }}>
                      <div style={{ fontSize:'10px', color:'#5A6478' }}>Valor en devolución</div>
                      <div style={{ fontSize:'14px', fontWeight:'700', color:'#F05C5C' }}>${Math.round(t.valor_devolucion/1000)}K</div>
                    </div>
                  </div>

                  <div style={{ marginTop:'10px', padding:'8px 10px', borderRadius:'8px', fontSize:'12px',
                    background: tasaE >= 70 ? 'rgba(45,212,160,0.06)' : tasaE >= 40 ? 'rgba(245,166,35,0.06)' : 'rgba(240,92,92,0.06)',
                    color: semE(tasaE), fontWeight:'600', border:`1px solid ${semE(tasaE)}22` }}>
                    {tasaE >= 70 ? '✅ Transportadora confiable' : tasaE >= 40 ? '⚠️ Rendimiento moderado — revisar' : '❌ Rendimiento bajo — considerar cambio'}
                    {' · '}{seleccionada ? 'Clic para cerrar detalle' : 'Clic para ver detalle →'}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Panel detalle transportadora */}
          {transSel && (
            <div style={{ ...s, padding:'20px', position:'sticky', top:'20px', maxHeight:'600px', overflowY:'auto' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:transSel.color, marginBottom:'16px' }}>
                {transSel.emoji} DETALLE — {transSel.nombre}
              </div>

              {/* Embudo logístico */}
              <div style={{ marginBottom:'16px' }}>
                <div style={{ fontSize:'11px', color:'#5A6478', fontWeight:'700', marginBottom:'10px' }}>EMBUDO LOGÍSTICO</div>
                {[
                  { label:'Pedidos generados', value:transSel.total, color:'#E8EDF5', pct:100 },
                  { label:'En tránsito', value:transSel.transito, color:'#3D8EF0', pct:Math.round(transSel.transito/transSel.total*100) },
                  { label:'Con novedad', value:transSel.novedad, color:'#F5A623', pct:Math.round(transSel.novedad/transSel.total*100) },
                  { label:'Entregados', value:transSel.entregados, color:'#2DD4A0', pct:Math.round(transSel.entregados/transSel.total*100) },
                  { label:'Devueltos', value:transSel.devolucion, color:'#F05C5C', pct:Math.round(transSel.devolucion/transSel.total*100) },
                ].map((row, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px' }}>
                    <span style={{ fontSize:'11px', color:'#8B96A8', width:'130px', flexShrink:0 }}>{row.label}</span>
                    <div style={{ flex:1, height:'18px', background:'rgba(255,255,255,0.04)', borderRadius:'4px', overflow:'hidden' }}>
                      <div style={{ height:'18px', width:`${row.pct}%`, background:row.color, borderRadius:'4px', display:'flex', alignItems:'center', paddingLeft:'6px' }}>
                        <span style={{ fontSize:'10px', color:'#0A0D14', fontWeight:'700' }}>{row.pct}%</span>
                      </div>
                    </div>
                    <span style={{ fontSize:'11px', color:row.color, fontWeight:'700', width:'40px', textAlign:'right' }}>{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Novedades de esta transportadora */}
              <div style={{ fontSize:'11px', color:'#5A6478', fontWeight:'700', marginBottom:'8px' }}>NOVEDADES ACTIVAS</div>
              {novedades.filter(n => n.transportadora === transSel.nombre && !n.solucionada).length === 0
                ? <div style={{ fontSize:'12px', color:'#5A6478', padding:'8px 0' }}>✅ Sin novedades activas</div>
                : novedades.filter(n => n.transportadora === transSel.nombre && !n.solucionada).map(n => (
                  <div key={n.id} style={{ padding:'10px 12px', background:'rgba(245,166,35,0.06)', borderRadius:'8px', marginBottom:'6px', border:'1px solid rgba(245,166,35,0.15)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'3px' }}>
                      <span style={{ fontSize:'11px', fontWeight:'700', color:'#F5A623' }}>{n.cliente}</span>
                      <span style={{ fontSize:'10px', color:'#5A6478' }}>{n.guia}</span>
                    </div>
                    <div style={{ fontSize:'11px', color:'#8B96A8', marginBottom:'4px' }}>{n.descripcion}</div>
                    <div style={{ fontSize:'10px', color:'#5A6478' }}>{n.ciudad}</div>
                  </div>
                ))
              }

              {/* Recomendación */}
              <div style={{ marginTop:'14px', padding:'12px', background:'rgba(255,255,255,0.02)', borderRadius:'10px', border:'1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize:'11px', fontWeight:'700', color:transSel.color, marginBottom:'6px' }}>💡 RECOMENDACIÓN</div>
                <div style={{ fontSize:'12px', color:'#8B96A8', lineHeight:'1.6' }}>
                  {Math.round(transSel.entregados/transSel.total*100) >= 70
                    ? `${transSel.nombre} tiene buen desempeño. Mantén como transportadora principal.`
                    : Math.round(transSel.entregados/transSel.total*100) >= 40
                    ? `${transSel.nombre} tiene rendimiento moderado. Monitorea las novedades y evalúa alternativas.`
                    : `${transSel.nombre} tiene bajo rendimiento de entrega. Considera reducir el volumen o cambiar de transportadora.`}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB NOVEDADES */}
      {tab === 'novedades' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div style={{ ...s, overflow:'hidden' }}>
            <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontWeight:'700' }}>⚠️ Novedades activas</span>
              <span style={{ fontSize:'12px', color:'#F5A623' }}>{novedades.filter(n=>!n.solucionada).length} sin resolver</span>
            </div>
            {novedades.filter(n => !n.solucionada).map(n => (
              <div key={n.id} style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'6px' }}>
                  <div>
                    <div style={{ fontSize:'13px', fontWeight:'600' }}>{n.cliente}</div>
                    <div style={{ fontSize:'11px', color:'#5A6478' }}>{n.ciudad} · {n.transportadora} · {n.guia}</div>
                  </div>
                  <span style={{ fontSize:'10px', padding:'2px 8px', borderRadius:'5px', fontWeight:'700', flexShrink:0,
                    background:`${TIPO_NOVEDAD_COLOR[n.tipo] || '#8B96A8'}15`,
                    color:TIPO_NOVEDAD_COLOR[n.tipo] || '#8B96A8' }}>
                    {n.tipo}
                  </span>
                </div>
                <div style={{ fontSize:'12px', color:'#F5A623', marginBottom:'8px' }}>{n.descripcion}</div>
                <div style={{ display:'flex', gap:'6px' }}>
                  <button onClick={() => {
                    const msg = encodeURIComponent(`Hola, te contactamos sobre tu pedido con guía ${n.guia}. Tuvimos novedad: "${n.descripcion}". ¿Puedes confirmar tu dirección en ${n.ciudad}? 🙏`)
                    window.open(`https://wa.me/?text=${msg}`, '_blank')
                  }} style={{ padding:'5px 12px', background:'rgba(37,211,102,0.1)', border:'none', borderRadius:'6px', color:'#25D366', cursor:'pointer', fontSize:'11px', fontWeight:'600' }}>
                    💬 WhatsApp
                  </button>
                  <button onClick={() => toggleNovedad(n.id)}
                    style={{ padding:'5px 12px', background:'rgba(45,212,160,0.1)', border:'none', borderRadius:'6px', color:'#2DD4A0', cursor:'pointer', fontSize:'11px', fontWeight:'600' }}>
                    ✅ Marcar resuelta
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {/* Tipos de novedad */}
            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'12px' }}>📊 TIPOS DE NOVEDAD</div>
              {[
                { tipo:'COORDINAR LA ENTREGA', count:40, pct:40 },
                { tipo:'PEDIDO CANCELADO', count:21, pct:21 },
                { tipo:'DIRECCIÓN NO EXISTE', count:19, pct:19 },
                { tipo:'FECHA MAYOR AL DÍA SIGUIENTE', count:9, pct:9 },
                { tipo:'NO CONOCEN DESTINATARIO', count:6, pct:6 },
                { tipo:'SE REHUSA A RECIBIR', count:6, pct:6 },
                { tipo:'DIRECCIÓN INCOMPLETA', count:6, pct:6 },
              ].map((n, i) => (
                <div key={i} style={{ marginBottom:'10px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'3px' }}>
                    <span style={{ fontSize:'11px', color:'#8B96A8' }}>{n.tipo}</span>
                    <span style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623' }}>{n.count}</span>
                  </div>
                  <div style={{ height:'5px', background:'rgba(255,255,255,0.05)', borderRadius:'3px' }}>
                    <div style={{ height:'5px', width:`${n.pct}%`, background:'#F5A623', borderRadius:'3px' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Resueltas */}
            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#2DD4A0', marginBottom:'12px' }}>✅ Novedades resueltas</div>
              {novedades.filter(n => n.solucionada).map(n => (
                <div key={n.id} style={{ padding:'10px 12px', background:'rgba(45,212,160,0.05)', borderRadius:'8px', marginBottom:'6px', border:'1px solid rgba(45,212,160,0.15)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontSize:'12px', fontWeight:'600', color:'#2DD4A0' }}>{n.cliente}</div>
                    <div style={{ fontSize:'11px', color:'#5A6478' }}>{n.descripcion.slice(0,40)}...</div>
                  </div>
                  <button onClick={() => toggleNovedad(n.id)}
                    style={{ padding:'3px 8px', background:'rgba(255,255,255,0.05)', border:'none', borderRadius:'5px', color:'#5A6478', cursor:'pointer', fontSize:'10px' }}>
                    Reabrir
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CIUDADES */}
      {tab === 'ciudades' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div style={{ ...s, overflow:'hidden' }}>
            <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', fontWeight:'700' }}>
              🗺️ Top 10 ciudades con más pedidos
            </div>
            {CIUDADES_TOP.map((c, i) => (
              <div key={i} style={{ padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.03)', display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:'24px', height:'24px', background: i < 3 ? '#F5A623' : 'rgba(255,255,255,0.06)', borderRadius:'6px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'800', color: i < 3 ? '#0A0D14' : '#5A6478', flexShrink:0 }}>
                  {i+1}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'13px', fontWeight:'600' }}>{c.ciudad}</div>
                  <div style={{ fontSize:'11px', color:'#5A6478' }}>{c.dpto}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:'14px', fontWeight:'700', color:'#E8EDF5' }}>{c.total}</div>
                  <div style={{ fontSize:'10px', color:'#5A6478' }}>pedidos</div>
                </div>
                <div style={{ width:'80px' }}>
                  <div style={{ height:'20px', background:'rgba(255,255,255,0.04)', borderRadius:'4px', overflow:'hidden' }}>
                    <div style={{ height:'20px', width:`${(c.total/409)*100}%`, background:'#3D8EF0', borderRadius:'4px', display:'flex', alignItems:'center', paddingLeft:'4px' }}>
                      <span style={{ fontSize:'9px', color:'#fff', fontWeight:'700', whiteSpace:'nowrap' }}>{c.pct}% ent.</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ ...s, padding:'20px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#3D8EF0', marginBottom:'14px' }}>📊 DISTRIBUCIÓN POR DEPARTAMENTO</div>
            {[
              { dpto:'CUNDINAMARCA', total:668, color:'#3D8EF0' },
              { dpto:'ANTIOQUIA', total:317, color:'#F5A623' },
              { dpto:'VALLE DEL CAUCA', total:301, color:'#2DD4A0' },
              { dpto:'META', total:158, color:'#9B6BFF' },
              { dpto:'SANTANDER', total:155, color:'#F05C5C' },
              { dpto:'BOYACÁ', total:147, color:'#3D8EF0' },
              { dpto:'ATLÁNTICO', total:124, color:'#F5A623' },
              { dpto:'NARIÑO', total:103, color:'#2DD4A0' },
            ].map((d, i) => {
              const pct = Math.round(d.total/668*100)
              return (
                <div key={i} style={{ marginBottom:'10px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                    <span style={{ fontSize:'12px', color:'#8B96A8' }}>{d.dpto}</span>
                    <div style={{ display:'flex', gap:'8px' }}>
                      <span style={{ fontSize:'12px', fontWeight:'700', color:d.color }}>{d.total}</span>
                      <span style={{ fontSize:'11px', color:'#5A6478' }}>{pct}%</span>
                    </div>
                  </div>
                  <div style={{ height:'8px', background:'rgba(255,255,255,0.05)', borderRadius:'4px' }}>
                    <div style={{ height:'8px', width:`${pct}%`, background:d.color, borderRadius:'4px' }} />
                  </div>
                </div>
              )
            })}
            <div style={{ marginTop:'14px', padding:'12px', background:'rgba(61,142,240,0.06)', borderRadius:'8px', border:'1px solid rgba(61,142,240,0.15)', fontSize:'12px', color:'#8B96A8', lineHeight:'1.6' }}>
              💡 <strong style={{ color:'#3D8EF0' }}>Cundinamarca</strong> concentra el 22% de tus pedidos. 
              Asegura cobertura óptima de transportadoras en Bogotá y municipios cercanos.
            </div>
          </div>
        </div>
      )}

      {/* TAB ANÁLISIS */}
      {tab === 'analisis' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          {/* Comparativo transportadoras */}
          <div style={{ ...s, overflow:'hidden' }}>
            <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', fontWeight:'700' }}>
              📊 Comparativo de transportadoras
            </div>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
              <thead>
                <tr style={{ background:'#0A0D14', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                  {['Transportadora','Total','Entregados','% Entrega','Novedades','% Nov.','Recomendación'].map(h => (
                    <th key={h} style={{ padding:'8px 12px', textAlign:'left', fontSize:'10px', color:'#5A6478', fontWeight:'700', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TRANSPORTADORAS.sort((a,b) => Math.round(b.entregados/b.total*100) - Math.round(a.entregados/a.total*100)).map((t, i) => {
                  const tasaE = Math.round(t.entregados/t.total*100)
                  const tasaN = Math.round(t.novedad/t.total*100)
                  return (
                    <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding:'10px 12px', fontWeight:'700', color:t.color }}>{t.emoji} {t.nombre}</td>
                      <td style={{ padding:'10px 12px', color:'#8B96A8' }}>{t.total.toLocaleString()}</td>
                      <td style={{ padding:'10px 12px', color:'#2DD4A0', fontWeight:'700' }}>{t.entregados}</td>
                      <td style={{ padding:'10px 12px' }}>
                        <span style={{ fontWeight:'800', color:semE(tasaE), fontSize:'14px' }}>{tasaE}%</span>
                      </td>
                      <td style={{ padding:'10px 12px', color:'#F5A623' }}>{t.novedad}</td>
                      <td style={{ padding:'10px 12px', color:'#F5A623' }}>{tasaN}%</td>
                      <td style={{ padding:'10px 12px' }}>
                        <span style={{ fontSize:'10px', padding:'2px 8px', borderRadius:'5px', fontWeight:'700',
                          background: tasaE >= 15 ? 'rgba(45,212,160,0.1)' : 'rgba(245,166,35,0.1)',
                          color: tasaE >= 15 ? '#2DD4A0' : '#F5A623' }}>
                          {tasaE >= 15 ? '✓ Principal' : '⚠ Revisar'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Alertas y recomendaciones */}
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#F05C5C', marginBottom:'12px' }}>🚨 ALERTAS LOGÍSTICAS</div>
              {[
                { icono:'⚠️', color:'#F5A623', titulo:'100 novedades activas en ENVIA', desc:'El 4% de los pedidos tiene novedad. Revisar las de "Coordinar entrega" (40) con urgencia.' },
                { icono:'📞', color:'#F5A623', titulo:'Alta tasa de "no coordina"', desc:'40 pedidos esperan coordinación. Llamar al cliente antes de vencimiento de novedad.' },
                { icono:'🗺️', color:'#3D8EF0', titulo:'BOGOTÁ concentra 14% del volumen', desc:'Asegura cobertura express para Bogotá y municipios de Cundinamarca.' },
                { icono:'📊', color:'#9B6BFF', titulo:'COORDINADORA con bajo rendimiento', desc:'Solo 6.7% de entrega. Evaluar si es por pedidos recientes aún en tránsito.' },
              ].map((a, i) => (
                <div key={i} style={{ padding:'12px 14px', background:`${a.color}08`, borderRadius:'10px', marginBottom:'8px', borderLeft:`3px solid ${a.color}` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'4px' }}>
                    <span>{a.icono}</span>
                    <span style={{ fontSize:'12px', fontWeight:'700', color:a.color }}>{a.titulo}</span>
                  </div>
                  <div style={{ fontSize:'11px', color:'#8B96A8', lineHeight:'1.5' }}>{a.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#2DD4A0', marginBottom:'12px' }}>💡 ESTRATEGIA RECOMENDADA</div>
              {[
                '📞 Llamar a todos los clientes con novedad de "Coordinar entrega" hoy',
                '📍 Verificar direcciones de pedidos en La Guajira y departamentos alejados',
                '🚚 Mantener ENVIA como transportadora principal (mayor cobertura)',
                '📊 Activar WhatsApp de seguimiento para pedidos en reparto > 3 días',
                '🔄 Para devoluciones: contactar al cliente en las primeras 24 horas',
              ].map((r, i) => (
                <div key={i} style={{ display:'flex', gap:'8px', marginBottom:'8px', fontSize:'12px', color:'#8B96A8' }}>
                  <span style={{ flexShrink:0 }}>{r.split(' ')[0]}</span>
                  <span>{r.slice(r.indexOf(' ')+1)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
