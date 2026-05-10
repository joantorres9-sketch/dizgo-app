'use client'
import { useState } from 'react'

type Alerta = {
  id: number; tipo: 'operativa'|'externa'|'oportunidad'|'pef'
  nivel: 'CRITICO'|'ALERTA'|'INFO'|'OPORTUNIDAD'
  titulo: string; descripcion: string; accion: string
  modulo: string; valor?: string; fecha: string
  leida: boolean; fuente: 'automatica'|'superadmin'
}

type CostoOculto = {
  categoria: string; concepto: string
  pct_impacto: number; valor_estimado: number
  detectado: boolean; color: string
}

const ALERTAS_DATA: Alerta[] = [
  { id:1, tipo:'operativa', nivel:'CRITICO', titulo:'CPA real superó el límite', descripcion:'CPA actual $10.338 vs máximo permitido $10.000. Si sube más, la operación pierde dinero en pauta.', accion:'Pausar campañas con CPA > $12.000 y redistribuir presupuesto', modulo:'Pauta', valor:'CPA: $10.338', fecha:'10/05/2026', leida:false, fuente:'automatica' },
  { id:2, tipo:'operativa', nivel:'CRITICO', titulo:'100 novedades sin resolver en ENVIA', descripcion:'40 pedidos por "coordinar entrega", 19 por "dirección no existe". Riesgo de devoluciones masivas.', accion:'Llamar hoy a los 40 pendientes de coordinación', modulo:'Logística', valor:'100 novedades', fecha:'10/05/2026', leida:false, fuente:'automatica' },
  { id:3, tipo:'operativa', nivel:'ALERTA', titulo:'Tasa de confirmación bajó al 58%', descripcion:'La semana pasada estaba en 65%. Posible causa: horario de confirmación fuera de pico.', accion:'Confirmar entre 9am-12m y 6pm-9pm. Enviar WhatsApp en las primeras 2h.', modulo:'Pedidos', valor:'58% vs meta 65%', fecha:'10/05/2026', leida:false, fuente:'automatica' },
  { id:4, tipo:'operativa', nivel:'ALERTA', titulo:'Saldo wallet bajo — $173.637', descripcion:'Saldo disponible para operación es menor a $500.000. Considera no retirar hasta tener más liquidez.', accion:'No retirar hasta que el saldo supere $500K', modulo:'Wallet', valor:'$173.637', fecha:'09/05/2026', leida:false, fuente:'automatica' },
  { id:5, tipo:'externa', nivel:'INFO', titulo:'Día de la Madre — 11 de mayo', descripcion:'Este domingo es Día de la Madre. Alta demanda en joyería, accesorios y regalos. Oportunidad de escalar.', accion:'Aumentar presupuesto pauta 30% en productos de mujer este fin de semana', modulo:'Pauta', valor:'11 May 2026', fecha:'08/05/2026', leida:true, fuente:'superadmin' },
  { id:6, tipo:'externa', nivel:'INFO', titulo:'Festivo Ascensión — 29 mayo', descripcion:'Día festivo en Colombia. Las transportadoras no operan. Planifica despachos del 28 antes de las 2pm.', accion:'Despachar todo el 28 de mayo antes de las 2pm', modulo:'Logística', valor:'29 May 2026', fecha:'08/05/2026', leida:true, fuente:'superadmin' },
  { id:7, tipo:'oportunidad', nivel:'OPORTUNIDAD', titulo:'Producto BALLENA — CPM más bajo del catálogo', descripcion:'BALLENA tiene CPM $3.412 (el más bajo) con ROAS 3.13x. Potencial de escalar con más presupuesto.', accion:'Aumentar presupuesto de BALLENA en $300K/mes y medir ROAS en 7 días', modulo:'Pauta', valor:'CPM $3.412', fecha:'07/05/2026', leida:false, fuente:'automatica' },
  { id:8, tipo:'oportunidad', nivel:'OPORTUNIDAD', titulo:'AIR FRYER — Mayor ROAS del catálogo (5.45x)', descripcion:'AIR FRYER tiene el mejor ROAS con 5.45x y CTR del 2.10%. Producto con potencial de escalar fuertemente.', accion:'Escalar AIR FRYER a $800K/mes y crear variantes de creativos', modulo:'Pauta', valor:'ROAS 5.45x', fecha:'07/05/2026', leida:false, fuente:'automatica' },
  { id:9, tipo:'pef', nivel:'ALERTA', titulo:'PEF: Costo oculto en reprocesos logísticos', descripcion:'Cada novedad genera ~45 min de gestión. Con 100 novedades/mes = 75 horas de trabajo invisible no costeado.', accion:'Incluir $150.000/mes de costo operativo de novedades en el CF', modulo:'Costos', valor:'~$150K/mes', fecha:'06/05/2026', leida:false, fuente:'automatica' },
  { id:10, tipo:'pef', nivel:'INFO', titulo:'PEF: Tiempo de confirmación no costeado', descripcion:'La confirmación manual de pedidos toma ~3 min/pedido. Con 3.000 pedidos = 150 horas = $375.000/mes sin costear.', accion:'Automatizar confirmación con WhatsApp API o añadir $375K a CF', modulo:'Costos', valor:'~$375K/mes', fecha:'06/05/2026', leida:true, fuente:'automatica' },
]

const COSTOS_OCULTOS: CostoOculto[] = [
  { categoria:'Prevención', concepto:'Tiempo de confirmación de pedidos (3min x 3.000)', pct_impacto:2.1, valor_estimado:375000, detectado:true, color:'#F5A623' },
  { categoria:'Prevención', concepto:'Atención a novedades y reclamos (45min x 100)', pct_impacto:0.8, valor_estimado:150000, detectado:true, color:'#F5A623' },
  { categoria:'Evaluación', concepto:'Tiempo en revisión de campañas y pauta', pct_impacto:0.5, valor_estimado:90000, detectado:true, color:'#3D8EF0' },
  { categoria:'Evaluación', concepto:'Revisión y seguimiento de pedidos diario', pct_impacto:0.7, valor_estimado:120000, detectado:true, color:'#3D8EF0' },
  { categoria:'Fallas', concepto:'Pedidos despachados sin confirmar (devolución asegurada)', pct_impacto:3.2, valor_estimado:580000, detectado:true, color:'#F05C5C' },
  { categoria:'Fallas', concepto:'Costo de leads no convertidos (pauta desperdiciada)', pct_impacto:4.1, valor_estimado:742000, detectado:true, color:'#F05C5C' },
  { categoria:'Fallas', concepto:'Devoluciones tardías (>7 días en novedad)', pct_impacto:1.8, valor_estimado:326000, detectado:false, color:'#F05C5C' },
  { categoria:'Fallas', concepto:'Tiempo en atención al cliente (chats, llamadas)', pct_impacto:1.2, valor_estimado:218000, detectado:false, color:'#F05C5C' },
]

const OPORTUNIDADES_PRODUCTO = [
  { nombre:'ULTRASHIELD', señal:'Alto volumen + ROAS 2.55x', recomendacion:'Crear combo x2. Puede subir ticket +40%', potencial:'+$800K/mes', color:'#2DD4A0', prioridad:1 },
  { nombre:'AIR FRYER', señal:'Mejor ROAS 5.45x + CTR 2.10%', recomendacion:'Escalar presupuesto a $800K/mes', potencial:'+$1.2M/mes', color:'#F5A623', prioridad:2 },
  { nombre:'MENPROS', señal:'ROAS 3.32x en público masculino', recomendacion:'Testear en TikTok Ads — público diferente', potencial:'+$500K/mes', color:'#3D8EF0', prioridad:3 },
  { nombre:'PARCHE PIES', señal:'ROAS 6.87x con muy poca inversión', recomendacion:'Aumentar presupuesto — está subexplotado', potencial:'+$600K/mes', color:'#9B6BFF', prioridad:4 },
]

const NIVEL_INFO: Record<string, { color:string; bg:string; icono:string }> = {
  CRITICO: { color:'#F05C5C', bg:'rgba(240,92,92,0.08)', icono:'🔴' },
  ALERTA: { color:'#F5A623', bg:'rgba(245,166,35,0.08)', icono:'🟡' },
  INFO: { color:'#3D8EF0', bg:'rgba(61,142,240,0.08)', icono:'🔵' },
  OPORTUNIDAD: { color:'#2DD4A0', bg:'rgba(45,212,160,0.08)', icono:'🟢' },
}

const TIPO_LABEL: Record<string, string> = {
  operativa: '⚙️ Operativa', externa: '📅 Externa', oportunidad: '💡 Oportunidad', pef: '🔍 PEF'
}

export default function AlertasPage() {
  const [alertas, setAlertas] = useState<Alerta[]>(ALERTAS_DATA)
  const [tab, setTab] = useState<'alertas'|'pef'|'oportunidades'|'nueva'>('alertas')
  const [filtroTipo, setFiltroTipo] = useState('TODOS')
  const [filtroNivel, setFiltroNivel] = useState('TODOS')
  const [alertaSel, setAlertaSel] = useState<Alerta | null>(null)
  const [nueva, setNueva] = useState({ titulo:'', descripcion:'', accion:'', nivel:'INFO', tipo:'externa', modulo:'General' })

  const noLeidas = alertas.filter(a => !a.leida).length
  const criticas = alertas.filter(a => a.nivel === 'CRITICO' && !a.leida).length

  const filtradas = alertas.filter(a => {
    if (filtroTipo !== 'TODOS' && a.tipo !== filtroTipo) return false
    if (filtroNivel !== 'TODOS' && a.nivel !== filtroNivel) return false
    return true
  })

  function marcarLeida(id: number) {
    setAlertas(prev => prev.map(a => a.id === id ? { ...a, leida: true } : a))
    setAlertaSel(prev => prev?.id === id ? { ...prev, leida: true } : prev)
  }

  function marcarTodasLeidas() {
    setAlertas(prev => prev.map(a => ({ ...a, leida: true })))
  }

  function crearAlerta() {
    if (!nueva.titulo || !nueva.descripcion) return
    const n: Alerta = {
      id: alertas.length + 1,
      tipo: nueva.tipo as any, nivel: nueva.nivel as any,
      titulo: nueva.titulo, descripcion: nueva.descripcion,
      accion: nueva.accion, modulo: nueva.modulo,
      fecha: new Date().toLocaleDateString('es-CO'),
      leida: false, fuente: 'superadmin'
    }
    setAlertas(prev => [n, ...prev])
    setNueva({ titulo:'', descripcion:'', accion:'', nivel:'INFO', tipo:'externa', modulo:'General' })
    setTab('alertas')
  }

  const totalPEF = COSTOS_OCULTOS.filter(c => c.detectado).reduce((s,c) => s+c.valor_estimado, 0)
  const totalPEFNoDetectado = COSTOS_OCULTOS.filter(c => !c.detectado).reduce((s,c) => s+c.valor_estimado, 0)

  const s = { background:'#111520', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'12px' }
  const inp = { background:'#0A0D14', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'7px', color:'#E8EDF5', padding:'7px 10px', fontSize:'13px', outline:'none', width:'100%', boxSizing:'border-box' as const }

  return (
    <div style={{ color:'#E8EDF5', fontFamily:'system-ui,sans-serif' }}>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
        <div>
          <h1 style={{ fontSize:'22px', fontWeight:'700', marginBottom:'4px' }}>🚨 Centro de Alertas & Decisiones</h1>
          <p style={{ fontSize:'13px', color:'#8B96A8' }}>Alertas automáticas · PEF costos ocultos · Oportunidades · ACTUAR</p>
        </div>
        <div style={{ display:'flex', gap:'8px' }}>
          {noLeidas > 0 && (
            <button onClick={marcarTodasLeidas}
              style={{ padding:'8px 14px', background:'rgba(255,255,255,0.05)', border:'none', borderRadius:'9px', color:'#8B96A8', cursor:'pointer', fontSize:'12px' }}>
              ✓ Marcar todas leídas
            </button>
          )}
          <button onClick={() => setTab('nueva')}
            style={{ padding:'9px 18px', background:'#F5A623', color:'#0A0D14', border:'none', borderRadius:'10px', fontWeight:'700', fontSize:'13px', cursor:'pointer' }}>
            + Nueva alerta
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'8px', marginBottom:'16px' }}>
        {[
          { label:'Sin leer', value:noLeidas, color: noLeidas > 0 ? '#F05C5C' : '#2DD4A0', icon:'🔔' },
          { label:'Críticas', value:criticas, color: criticas > 0 ? '#F05C5C' : '#2DD4A0', icon:'🔴' },
          { label:'Operativas', value:alertas.filter(a=>a.tipo==='operativa').length, color:'#F5A623', icon:'⚙️' },
          { label:'Externas', value:alertas.filter(a=>a.tipo==='externa').length, color:'#3D8EF0', icon:'📅' },
          { label:'Oportunidades', value:alertas.filter(a=>a.tipo==='oportunidad').length, color:'#2DD4A0', icon:'💡' },
          { label:'Costos PEF', value:`$${Math.round(totalPEF/1000)}K`, color:'#9B6BFF', icon:'🔍' },
        ].map((k,i) => (
          <div key={i} style={{ ...s, padding:'12px', borderTop:`2px solid ${k.color}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
              <span style={{ fontSize:'10px', color:'#8B96A8' }}>{k.label}</span>
              <span>{k.icon}</span>
            </div>
            <div style={{ fontSize:'20px', fontWeight:'800', color:k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'6px', marginBottom:'16px' }}>
        {[
          { key:'alertas', label:`🚨 Alertas (${noLeidas} nuevas)` },
          { key:'pef', label:'🔍 Diagnóstico PEF' },
          { key:'oportunidades', label:'💡 Oportunidades' },
          { key:'nueva', label:'✏️ Nueva alerta' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            style={{ padding:'8px 16px', borderRadius:'9px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'600',
              background: tab === t.key ? '#F5A623' : 'rgba(255,255,255,0.05)',
              color: tab === t.key ? '#0A0D14' : '#8B96A8' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB ALERTAS */}
      {tab === 'alertas' && (
        <div style={{ display:'grid', gridTemplateColumns: alertaSel ? '1fr 380px' : '1fr', gap:'16px' }}>
          <div>
            {/* Filtros */}
            <div style={{ display:'flex', gap:'6px', marginBottom:'12px', flexWrap:'wrap' }}>
              {['TODOS','operativa','externa','oportunidad','pef'].map(f => (
                <button key={f} onClick={() => setFiltroTipo(f)}
                  style={{ padding:'5px 12px', borderRadius:'7px', border:'none', cursor:'pointer', fontSize:'11px', fontWeight:'600',
                    background: filtroTipo === f ? '#F5A623' : 'rgba(255,255,255,0.05)',
                    color: filtroTipo === f ? '#0A0D14' : '#8B96A8' }}>
                  {f === 'TODOS' ? 'Todos' : TIPO_LABEL[f]}
                </button>
              ))}
              <div style={{ width:'1px', background:'rgba(255,255,255,0.08)', margin:'0 2px' }} />
              {['TODOS','CRITICO','ALERTA','INFO','OPORTUNIDAD'].map(n => (
                <button key={n} onClick={() => setFiltroNivel(n)}
                  style={{ padding:'5px 10px', borderRadius:'7px', border:'none', cursor:'pointer', fontSize:'11px', fontWeight:'600',
                    background: filtroNivel === n ? (n === 'TODOS' ? '#F5A623' : `${NIVEL_INFO[n]?.color || '#F5A623'}22`) : 'rgba(255,255,255,0.05)',
                    color: filtroNivel === n ? (n === 'TODOS' ? '#0A0D14' : NIVEL_INFO[n]?.color) : '#8B96A8' }}>
                  {n === 'TODOS' ? 'Todos' : `${NIVEL_INFO[n]?.icono} ${n}`}
                </button>
              ))}
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              {filtradas.map(a => {
                const ni = NIVEL_INFO[a.nivel]
                const activa = alertaSel?.id === a.id
                return (
                  <div key={a.id} onClick={() => { setAlertaSel(activa ? null : a); if(!a.leida) marcarLeida(a.id) }}
                    style={{ ...s, padding:'14px 16px', cursor:'pointer', transition:'all .12s',
                      border:`1px solid ${activa ? ni.color + '44' : !a.leida ? ni.color + '22' : 'rgba(255,255,255,0.07)'}`,
                      background: activa ? ni.bg : !a.leida ? `${ni.color}04` : '#111520',
                      opacity: a.leida && !activa ? 0.7 : 1 }}>
                    <div style={{ display:'flex', alignItems:'flex-start', gap:'10px' }}>
                      <span style={{ fontSize:'18px', flexShrink:0, marginTop:'2px' }}>{ni.icono}</span>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px', flexWrap:'wrap' }}>
                          {!a.leida && <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:ni.color, flexShrink:0 }} />}
                          <span style={{ fontSize:'13px', fontWeight:'700', color: a.leida ? '#8B96A8' : '#E8EDF5' }}>{a.titulo}</span>
                          <span style={{ fontSize:'10px', padding:'1px 7px', borderRadius:'5px', background:`${ni.color}15`, color:ni.color, fontWeight:'700' }}>{a.nivel}</span>
                          <span style={{ fontSize:'10px', color:'#5A6478' }}>{TIPO_LABEL[a.tipo]}</span>
                          {a.fuente === 'superadmin' && <span style={{ fontSize:'10px', color:'#9B6BFF' }}>👤 Admin</span>}
                        </div>
                        <div style={{ fontSize:'12px', color:'#8B96A8', marginBottom:'4px', lineHeight:'1.4' }}>{a.descripcion}</div>
                        <div style={{ display:'flex', gap:'12px', fontSize:'11px' }}>
                          {a.valor && <span style={{ color:ni.color, fontWeight:'700' }}>{a.valor}</span>}
                          <span style={{ color:'#5A6478' }}>{a.modulo}</span>
                          <span style={{ color:'#5A6478' }}>{a.fecha}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Panel detalle alerta */}
          {alertaSel && (
            <div style={{ ...s, padding:'20px', position:'sticky', top:'20px', maxHeight:'80vh', overflowY:'auto' }}>
              {(() => {
                const ni = NIVEL_INFO[alertaSel.nivel]
                return (
                  <>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px' }}>
                      <span style={{ fontSize:'22px' }}>{ni.icono}</span>
                      <button onClick={() => setAlertaSel(null)} style={{ background:'none', border:'none', color:'#8B96A8', cursor:'pointer', fontSize:'20px' }}>×</button>
                    </div>
                    <div style={{ fontSize:'14px', fontWeight:'800', color:ni.color, marginBottom:'8px', lineHeight:'1.3' }}>{alertaSel.titulo}</div>
                    <div style={{ display:'flex', gap:'6px', marginBottom:'14px', flexWrap:'wrap' }}>
                      <span style={{ fontSize:'10px', padding:'2px 8px', borderRadius:'5px', background:`${ni.color}15`, color:ni.color, fontWeight:'700' }}>{alertaSel.nivel}</span>
                      <span style={{ fontSize:'10px', padding:'2px 8px', borderRadius:'5px', background:'rgba(255,255,255,0.06)', color:'#8B96A8' }}>{TIPO_LABEL[alertaSel.tipo]}</span>
                      <span style={{ fontSize:'10px', padding:'2px 8px', borderRadius:'5px', background:'rgba(255,255,255,0.06)', color:'#8B96A8' }}>{alertaSel.modulo}</span>
                    </div>

                    <div style={{ background:'rgba(255,255,255,0.02)', borderRadius:'10px', padding:'12px 14px', marginBottom:'12px' }}>
                      <div style={{ fontSize:'11px', color:'#5A6478', fontWeight:'700', marginBottom:'6px' }}>SITUACIÓN</div>
                      <div style={{ fontSize:'13px', color:'#8B96A8', lineHeight:'1.7' }}>{alertaSel.descripcion}</div>
                      {alertaSel.valor && (
                        <div style={{ marginTop:'8px', fontSize:'16px', fontWeight:'800', color:ni.color }}>{alertaSel.valor}</div>
                      )}
                    </div>

                    <div style={{ padding:'12px 14px', borderRadius:'10px', background:`${ni.color}08`, border:`1px solid ${ni.color}22`, marginBottom:'14px' }}>
                      <div style={{ fontSize:'11px', color:ni.color, fontWeight:'700', marginBottom:'6px' }}>⚡ ACCIÓN RECOMENDADA</div>
                      <div style={{ fontSize:'12px', color:'#E8EDF5', lineHeight:'1.6' }}>{alertaSel.accion}</div>
                    </div>

                    <div style={{ fontSize:'11px', color:'#5A6478', display:'flex', justifyContent:'space-between' }}>
                      <span>Fecha: {alertaSel.fecha}</span>
                      <span>Fuente: {alertaSel.fuente === 'automatica' ? '🤖 Automática' : '👤 Superadmin'}</span>
                    </div>
                  </>
                )
              })()}
            </div>
          )}
        </div>
      )}

      {/* TAB PEF */}
      {tab === 'pef' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div style={{ ...s, overflow:'hidden' }}>
            <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontWeight:'700', marginBottom:'4px' }}>🔍 Diagnóstico PEF — Costos Ocultos</div>
              <div style={{ fontSize:'12px', color:'#8B96A8' }}>Prevención · Evaluación · Fallas — Lo que no ves pero te cuesta</div>
            </div>

            {/* PEF explicado */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              {[
                { letra:'P', nombre:'Prevención', desc:'Lo que gastas para evitar fallas', color:'#F5A623', items:COSTOS_OCULTOS.filter(c=>c.categoria==='Prevención') },
                { letra:'E', nombre:'Evaluación', desc:'Lo que gastas para medir y controlar', color:'#3D8EF0', items:COSTOS_OCULTOS.filter(c=>c.categoria==='Evaluación') },
                { letra:'F', nombre:'Fallas', desc:'Lo que pierdes cuando algo sale mal', color:'#F05C5C', items:COSTOS_OCULTOS.filter(c=>c.categoria==='Fallas') },
              ].map((cat, i) => (
                <div key={i} style={{ padding:'14px', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <div style={{ fontSize:'22px', fontWeight:'900', color:cat.color, marginBottom:'2px' }}>{cat.letra}</div>
                  <div style={{ fontSize:'12px', fontWeight:'700', color:'#E8EDF5', marginBottom:'3px' }}>{cat.nombre}</div>
                  <div style={{ fontSize:'10px', color:'#5A6478', marginBottom:'10px', lineHeight:'1.4' }}>{cat.desc}</div>
                  <div style={{ fontSize:'16px', fontWeight:'800', color:cat.color }}>
                    ${cat.items.filter(c=>c.detectado).reduce((s,c)=>s+c.valor_estimado,0).toLocaleString('es-CO')}
                  </div>
                  <div style={{ fontSize:'10px', color:'#5A6478' }}>/mes detectado</div>
                </div>
              ))}
            </div>

            {/* Items detallados */}
            {COSTOS_OCULTOS.map((c, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.03)', opacity: c.detectado ? 1 : 0.5 }}>
                <div style={{ width:'24px', height:'24px', borderRadius:'6px', background:`${c.color}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'800', color:c.color, flexShrink:0 }}>
                  {c.categoria[0]}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'12px', color: c.detectado ? '#E8EDF5' : '#5A6478', fontWeight:'500', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {c.concepto}
                  </div>
                  <div style={{ fontSize:'10px', color:'#5A6478', marginTop:'1px' }}>
                    Impacto: {c.pct_impacto}% del resultado · {c.detectado ? '✅ Detectado' : '⚠️ No costeado aún'}
                  </div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ fontSize:'13px', fontWeight:'800', color:c.color }}>
                    ${c.valor_estimado.toLocaleString('es-CO')}
                  </div>
                  <div style={{ fontSize:'9px', color:'#5A6478' }}>/mes</div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen PEF */}
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            <div style={{ ...s, padding:'20px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#9B6BFF', marginBottom:'14px' }}>💰 RESUMEN COSTOS OCULTOS</div>

              {[
                { label:'Costos ocultos detectados', valor:totalPEF, color:'#F5A623', desc:'Ya estás incurriendo en esto sin saberlo' },
                { label:'Costos ocultos no costeados', valor:totalPEFNoDetectado, color:'#F05C5C', desc:'Adicional que falta identificar' },
                { label:'Total costo oculto mensual', valor:totalPEF+totalPEFNoDetectado, color:'#F05C5C', desc:'Suma real del impacto PEF' },
              ].map((k,i) => (
                <div key={i} style={{ padding:'12px 14px', borderRadius:'10px', marginBottom:'8px', background:`${k.color}06`, borderLeft:`3px solid ${k.color}` }}>
                  <div style={{ fontSize:'12px', color:'#8B96A8', marginBottom:'4px' }}>{k.label}</div>
                  <div style={{ fontSize:'20px', fontWeight:'800', color:k.color }}>${k.valor.toLocaleString('es-CO')}</div>
                  <div style={{ fontSize:'10px', color:'#5A6478', marginTop:'2px' }}>{k.desc}</div>
                </div>
              ))}

              <div style={{ marginTop:'8px', padding:'14px', background:'rgba(155,107,255,0.06)', borderRadius:'10px', border:'1px solid rgba(155,107,255,0.2)' }}>
                <div style={{ fontSize:'12px', fontWeight:'700', color:'#9B6BFF', marginBottom:'6px' }}>💡 ¿QUÉ HACER CON ESTO?</div>
                <div style={{ fontSize:'12px', color:'#8B96A8', lineHeight:'1.7' }}>
                  Si reduces el PEF en un 30%, liberas <strong style={{ color:'#2DD4A0' }}>${Math.round((totalPEF+totalPEFNoDetectado)*0.3/1000)}K/mes</strong> adicionales en utilidad real sin vender un solo producto más.
                </div>
              </div>
            </div>

            {/* Acciones PEF */}
            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'12px' }}>⚡ PLAN DE ACCIÓN PEF</div>
              {[
                { prioridad:'INMEDIATO', color:'#F05C5C', accion:'Activar WhatsApp automático para confirmación', ahorro:'~$375K/mes en tiempo' },
                { prioridad:'ESTA SEMANA', color:'#F5A623', accion:'Gestionar 100 novedades activas en ENVIA', ahorro:'~$580K en devoluciones evitadas' },
                { prioridad:'ESTE MES', color:'#3D8EF0', accion:'Incluir costos PEF en el CF mensual', ahorro:'Costeo más real del negocio' },
                { prioridad:'PRÓXIMO MES', color:'#2DD4A0', accion:'Automatizar seguimiento pedidos en reparto', ahorro:'~$150K/mes en reprocesos' },
              ].map((a, i) => (
                <div key={i} style={{ display:'flex', gap:'10px', padding:'10px 12px', borderRadius:'8px', marginBottom:'6px', background:`${a.color}06` }}>
                  <span style={{ fontSize:'10px', fontWeight:'800', padding:'2px 7px', borderRadius:'5px', height:'fit-content', flexShrink:0, marginTop:'1px', background:`${a.color}15`, color:a.color }}>
                    {a.prioridad}
                  </span>
                  <div>
                    <div style={{ fontSize:'12px', color:'#E8EDF5', fontWeight:'600', marginBottom:'2px' }}>{a.accion}</div>
                    <div style={{ fontSize:'11px', color:'#5A6478' }}>💰 {a.ahorro}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB OPORTUNIDADES */}
      {tab === 'oportunidades' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#2DD4A0', marginBottom:'14px' }}>💡 OPORTUNIDADES DE PRODUCTOS DETECTADAS</div>
              {OPORTUNIDADES_PRODUCTO.map((op, i) => (
                <div key={i} style={{ padding:'14px', borderRadius:'10px', marginBottom:'8px', background:`${op.color}08`, borderLeft:`3px solid ${op.color}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'6px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      <div style={{ width:'24px', height:'24px', borderRadius:'6px', background:`${op.color}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'900', color:op.color }}>
                        {op.prioridad}
                      </div>
                      <span style={{ fontSize:'14px', fontWeight:'800', color:op.color }}>{op.nombre}</span>
                    </div>
                    <span style={{ fontSize:'14px', fontWeight:'800', color:'#2DD4A0' }}>{op.potencial}</span>
                  </div>
                  <div style={{ fontSize:'12px', color:'#F5A623', marginBottom:'5px' }}>📊 {op.señal}</div>
                  <div style={{ fontSize:'12px', color:'#8B96A8', lineHeight:'1.5' }}>→ {op.recomendacion}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'12px' }}>📅 CALENDARIO — Próximos eventos clave</div>
              {[
                { fecha:'11 May 2026', evento:'Día de la Madre', oportunidad:'Joyería + accesorios femeninos +30%', color:'#F5A623', dias:1 },
                { fecha:'29 May 2026', evento:'Festivo Ascensión', oportunidad:'Pre-festivo: despachar el 28', color:'#3D8EF0', dias:19 },
                { fecha:'14 Jun 2026', evento:'Día del Padre', oportunidad:'Relojes + productos masculinos', color:'#9B6BFF', dias:35 },
                { fecha:'20 Jul 2026', evento:'Independencia Colombia', oportunidad:'Descuentos + pauta especial', color:'#2DD4A0', dias:71 },
                { fecha:'07 Ago 2026', evento:'Batalla de Boyacá', oportunidad:'Festivo + fin de semana largo', color:'#F5A623', dias:89 },
              ].map((ev, i) => (
                <div key={i} style={{ display:'flex', gap:'12px', padding:'10px 12px', borderRadius:'8px', marginBottom:'6px', background:'rgba(255,255,255,0.02)' }}>
                  <div style={{ textAlign:'center', flexShrink:0 }}>
                    <div style={{ fontSize:'18px', fontWeight:'900', color:ev.color }}>{ev.dias}</div>
                    <div style={{ fontSize:'9px', color:'#5A6478' }}>días</div>
                  </div>
                  <div>
                    <div style={{ fontSize:'12px', fontWeight:'700', color:'#E8EDF5', marginBottom:'2px' }}>{ev.evento}</div>
                    <div style={{ fontSize:'11px', color:'#8B96A8', marginBottom:'2px' }}>{ev.fecha}</div>
                    <div style={{ fontSize:'11px', color:ev.color }}>→ {ev.oportunidad}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#9B6BFF', marginBottom:'12px' }}>🎯 DECISIONES ESTRATÉGICAS HOY</div>
              {[
                { urgencia:'HOY', color:'#F05C5C', decision:'Subir presupuesto AIR FRYER a $800K/mes — ROAS 5.45x', impacto:'+$1.2M potencial' },
                { urgencia:'HOY', color:'#F05C5C', decision:'Gestionar 100 novedades ENVIA — llamar ahora', impacto:'+$580K recuperado' },
                { urgencia:'MAÑANA', color:'#F5A623', decision:'Crear combo x2 ULTRASHIELD para Día de la Madre', impacto:'+40% ticket promedio' },
                { urgencia:'SEMANA', color:'#3D8EF0', decision:'Activar PARCHE PIES con más presupuesto — ROAS 6.87x', impacto:'+$600K/mes' },
              ].map((d, i) => (
                <div key={i} style={{ display:'flex', gap:'8px', padding:'9px 11px', borderRadius:'7px', marginBottom:'5px', background:`${d.color}06` }}>
                  <span style={{ fontSize:'10px', fontWeight:'800', padding:'2px 7px', borderRadius:'5px', flexShrink:0, height:'fit-content', marginTop:'1px', background:`${d.color}15`, color:d.color }}>
                    {d.urgencia}
                  </span>
                  <div>
                    <div style={{ fontSize:'12px', color:'#E8EDF5', fontWeight:'600', marginBottom:'2px' }}>{d.decision}</div>
                    <div style={{ fontSize:'11px', color:d.color }}>💰 {d.impacto}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB NUEVA ALERTA */}
      {tab === 'nueva' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div style={{ ...s, padding:'20px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'16px' }}>✏️ CREAR NUEVA ALERTA — Superadmin</div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'12px' }}>
              <div>
                <label style={{ display:'block', fontSize:'11px', color:'#5A6478', marginBottom:'4px' }}>Tipo</label>
                <select value={nueva.tipo} onChange={e => setNueva(p=>({...p,tipo:e.target.value}))}
                  style={{ ...inp, cursor:'pointer' }}>
                  <option value="operativa">⚙️ Operativa</option>
                  <option value="externa">📅 Externa</option>
                  <option value="oportunidad">💡 Oportunidad</option>
                  <option value="pef">🔍 PEF</option>
                </select>
              </div>
              <div>
                <label style={{ display:'block', fontSize:'11px', color:'#5A6478', marginBottom:'4px' }}>Nivel</label>
                <select value={nueva.nivel} onChange={e => setNueva(p=>({...p,nivel:e.target.value}))}
                  style={{ ...inp, cursor:'pointer' }}>
                  <option value="CRITICO">🔴 CRÍTICO</option>
                  <option value="ALERTA">🟡 ALERTA</option>
                  <option value="INFO">🔵 INFO</option>
                  <option value="OPORTUNIDAD">🟢 OPORTUNIDAD</option>
                </select>
              </div>
              <div>
                <label style={{ display:'block', fontSize:'11px', color:'#5A6478', marginBottom:'4px' }}>Módulo</label>
                <select value={nueva.modulo} onChange={e => setNueva(p=>({...p,modulo:e.target.value}))}
                  style={{ ...inp, cursor:'pointer' }}>
                  {['Pauta','Pedidos','Logística','Wallet','Costos','Productos','General','PQRSF'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom:'10px' }}>
              <label style={{ display:'block', fontSize:'11px', color:'#5A6478', marginBottom:'4px' }}>Título *</label>
              <input value={nueva.titulo} onChange={e => setNueva(p=>({...p,titulo:e.target.value}))}
                placeholder="Ej: Festivo 29 de mayo — planificar despachos" style={inp} />
            </div>
            <div style={{ marginBottom:'10px' }}>
              <label style={{ display:'block', fontSize:'11px', color:'#5A6478', marginBottom:'4px' }}>Descripción *</label>
              <textarea value={nueva.descripcion} onChange={e => setNueva(p=>({...p,descripcion:e.target.value}))}
                rows={3} placeholder="Describe la situación..."
                style={{ ...inp, resize:'vertical' }} />
            </div>
            <div style={{ marginBottom:'14px' }}>
              <label style={{ display:'block', fontSize:'11px', color:'#5A6478', marginBottom:'4px' }}>Acción recomendada</label>
              <input value={nueva.accion} onChange={e => setNueva(p=>({...p,accion:e.target.value}))}
                placeholder="Ej: Despachar todo el 28 antes de las 2pm" style={inp} />
            </div>

            <button onClick={crearAlerta} disabled={!nueva.titulo || !nueva.descripcion}
              style={{ width:'100%', padding:'11px', background: nueva.titulo && nueva.descripcion ? '#F5A623' : 'rgba(255,255,255,0.05)',
                border:'none', borderRadius:'10px', color: nueva.titulo && nueva.descripcion ? '#0A0D14' : '#5A6478',
                cursor: nueva.titulo && nueva.descripcion ? 'pointer' : 'not-allowed', fontWeight:'700', fontSize:'13px' }}>
              🚨 Publicar Alerta
            </button>
          </div>

          <div style={{ ...s, padding:'18px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#3D8EF0', marginBottom:'12px' }}>📋 TIPOS DE ALERTAS</div>
            {[
              { tipo:'⚙️ Operativa', ejemplos:'CPA fuera de rango, tasa confirmación baja, saldo wallet bajo', color:'#F5A623' },
              { tipo:'📅 Externa', ejemplos:'Festivos, días especiales (Madre, Padre), eventos del mercado', color:'#3D8EF0' },
              { tipo:'💡 Oportunidad', ejemplos:'Producto con alto ROAS, nicho nuevo, tendencia detectada', color:'#2DD4A0' },
              { tipo:'🔍 PEF', ejemplos:'Costo oculto detectado, ineficiencia en proceso, tiempo no costeado', color:'#9B6BFF' },
            ].map((t, i) => (
              <div key={i} style={{ padding:'12px', borderRadius:'8px', marginBottom:'7px', background:`${t.color}06`, borderLeft:`3px solid ${t.color}` }}>
                <div style={{ fontSize:'12px', fontWeight:'700', color:t.color, marginBottom:'4px' }}>{t.tipo}</div>
                <div style={{ fontSize:'11px', color:'#8B96A8' }}>{t.ejemplos}</div>
              </div>
            ))}
            <div style={{ marginTop:'10px', padding:'10px 12px', background:'rgba(155,107,255,0.06)', borderRadius:'8px', fontSize:'11px', color:'#8B96A8', lineHeight:'1.6' }}>
              Las alertas automáticas se generan cuando los indicadores del embudo o el P&G superan los umbrales configurados. Las manuales las crea el superadmin.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
