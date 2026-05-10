'use client'
import { useState } from 'react'

type PQRSF = {
  id: number; radicado: string; tipo: 'P'|'Q'|'R'|'S'|'F'
  nombre: string; email: string; telefono: string
  orden_id: string; asunto: string; descripcion: string
  estado: 'RECIBIDO'|'EN_GESTION'|'RESPONDIDO'|'CERRADO'
  respuesta: string; fecha_creacion: string; fecha_respuesta: string
  fecha_limite: string; prioridad: 'ALTA'|'MEDIA'|'BAJA'
}

const TIPO_INFO: Record<string, { label:string; color:string; emoji:string; dias:number }> = {
  P: { label:'Petición', color:'#3D8EF0', emoji:'📋', dias:15 },
  Q: { label:'Queja', color:'#F5A623', emoji:'😤', dias:10 },
  R: { label:'Reclamo', color:'#F05C5C', emoji:'❗', dias:10 },
  S: { label:'Sugerencia', color:'#2DD4A0', emoji:'💡', dias:15 },
  F: { label:'Felicitación', color:'#F5A623', emoji:'⭐', dias:15 },
}

const ESTADO_INFO: Record<string, { color:string; bg:string }> = {
  RECIBIDO: { color:'#3D8EF0', bg:'rgba(61,142,240,0.1)' },
  EN_GESTION: { color:'#F5A623', bg:'rgba(245,166,35,0.1)' },
  RESPONDIDO: { color:'#9B6BFF', bg:'rgba(155,107,255,0.1)' },
  CERRADO: { color:'#2DD4A0', bg:'rgba(45,212,160,0.1)' },
}

const PQRSF_DATA: PQRSF[] = [
  { id:1, radicado:'DZ-202505-00001', tipo:'R', nombre:'Carlos Mendez', email:'carlos@gmail.com', telefono:'3001234567', orden_id:'9011700', asunto:'Producto llegó en mal estado', descripcion:'Compré el reloj vintage pero llegó con el vidrio roto. Necesito solución urgente.', estado:'RESPONDIDO', respuesta:'Estimado Carlos, lamentamos el inconveniente. Procederemos con el reenvío inmediato de su producto.', fecha_creacion:'02-09-2023', fecha_respuesta:'03-09-2023', fecha_limite:'12-09-2023', prioridad:'ALTA' },
  { id:2, radicado:'DZ-202505-00002', tipo:'Q', nombre:'Ana Lucia Perez', email:'ana@hotmail.com', telefono:'3109876543', orden_id:'9011650', asunto:'Demora en la entrega', descripcion:'Mi pedido lleva 10 días y no ha llegado. La transportadora no da información.', estado:'EN_GESTION', respuesta:'', fecha_creacion:'03-09-2023', fecha_respuesta:'', fecha_limite:'13-09-2023', prioridad:'ALTA' },
  { id:3, radicado:'DZ-202505-00003', tipo:'S', nombre:'María García', email:'maria@gmail.com', telefono:'3198765432', orden_id:'', asunto:'Sugerencia de nuevos productos', descripcion:'Me gustaría ver más variedad en accesorios para mascotas. Hay mucha demanda en mi zona.', estado:'RECIBIDO', respuesta:'', fecha_creacion:'04-09-2023', fecha_respuesta:'', fecha_limite:'19-09-2023', prioridad:'BAJA' },
  { id:4, radicado:'DZ-202505-00004', tipo:'F', nombre:'Jorge Ramirez', email:'jorge@gmail.com', telefono:'3156789012', orden_id:'9011700', asunto:'Excelente servicio', descripcion:'Quiero felicitar al equipo por la rapidez en la entrega y la calidad del producto. ¡Volveré a comprar!', estado:'CERRADO', respuesta:'¡Gracias Jorge! Nos alegra saber que quedaste satisfecho. Tu opinión nos motiva a seguir mejorando.', fecha_creacion:'02-09-2023', fecha_respuesta:'02-09-2023', fecha_limite:'17-09-2023', prioridad:'BAJA' },
  { id:5, radicado:'DZ-202505-00005', tipo:'R', nombre:'Sedalis Torres', email:'sedalis@gmail.com', telefono:'3164994940', orden_id:'9011835', asunto:'No encontraron mi dirección', descripcion:'El mensajero dice que no existe la dirección pero es correcta. Necesito que me entreguen.', estado:'EN_GESTION', respuesta:'', fecha_creacion:'04-09-2023', fecha_respuesta:'', fecha_limite:'14-09-2023', prioridad:'ALTA' },
]

function diasRestantes(fechaLimite: string): number {
  const [d,m,y] = fechaLimite.split('-').map(Number)
  const limite = new Date(y, m-1, d)
  const hoy = new Date()
  return Math.ceil((limite.getTime() - hoy.getTime()) / (1000*60*60*24))
}

export default function PQRSFPage() {
  const [pqrsf, setPqrsf] = useState<PQRSF[]>(PQRSF_DATA)
  const [seleccionada, setSeleccionada] = useState<PQRSF | null>(null)
  const [tab, setTab] = useState<'lista'|'nueva'|'stats'>('lista')
  const [filtroEstado, setFiltroEstado] = useState('TODOS')
  const [filtroTipo, setFiltroTipo] = useState('TODOS')
  const [respuesta, setRespuesta] = useState('')
  const [nuevaPQRSF, setNuevaPQRSF] = useState({
    tipo:'R', nombre:'', email:'', telefono:'',
    orden_id:'', asunto:'', descripcion:''
  })

  const filtradas = pqrsf.filter(p => {
    if (filtroEstado !== 'TODOS' && p.estado !== filtroEstado) return false
    if (filtroTipo !== 'TODOS' && p.tipo !== filtroTipo) return false
    return true
  })

  const stats = {
    total: pqrsf.length,
    recibidas: pqrsf.filter(p=>p.estado==='RECIBIDO').length,
    en_gestion: pqrsf.filter(p=>p.estado==='EN_GESTION').length,
    respondidas: pqrsf.filter(p=>p.estado==='RESPONDIDO').length,
    cerradas: pqrsf.filter(p=>p.estado==='CERRADO').length,
    vencidas: pqrsf.filter(p => diasRestantes(p.fecha_limite) < 0 && p.estado !== 'CERRADO').length,
  }

  function responder() {
    if (!seleccionada || !respuesta) return
    setPqrsf(prev => prev.map(p => p.id === seleccionada.id
      ? { ...p, estado:'RESPONDIDO', respuesta, fecha_respuesta: new Date().toLocaleDateString('es-CO') }
      : p
    ))
    setSeleccionada(prev => prev ? { ...prev, estado:'RESPONDIDO', respuesta } : null)
    setRespuesta('')
  }

  function cerrar(id: number) {
    setPqrsf(prev => prev.map(p => p.id === id ? { ...p, estado:'CERRADO' } : p))
    setSeleccionada(prev => prev?.id === id ? { ...prev, estado:'CERRADO' } : prev)
  }

  function crearNueva() {
    if (!nuevaPQRSF.nombre || !nuevaPQRSF.asunto || !nuevaPQRSF.descripcion) return
    const id = pqrsf.length + 1
    const now = new Date()
    const dias = TIPO_INFO[nuevaPQRSF.tipo]?.dias || 15
    const limite = new Date(now.getTime() + dias * 24*60*60*1000)
    const fmt = (d: Date) => `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`
    const nueva: PQRSF = {
      id, radicado:`DZ-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}-${String(id).padStart(5,'0')}`,
      tipo: nuevaPQRSF.tipo as any,
      nombre: nuevaPQRSF.nombre, email: nuevaPQRSF.email,
      telefono: nuevaPQRSF.telefono, orden_id: nuevaPQRSF.orden_id,
      asunto: nuevaPQRSF.asunto, descripcion: nuevaPQRSF.descripcion,
      estado:'RECIBIDO', respuesta:'',
      fecha_creacion: fmt(now), fecha_respuesta:'',
      fecha_limite: fmt(limite),
      prioridad: ['R','Q'].includes(nuevaPQRSF.tipo) ? 'ALTA' : 'BAJA'
    }
    setPqrsf(prev => [nueva, ...prev])
    setNuevaPQRSF({ tipo:'R', nombre:'', email:'', telefono:'', orden_id:'', asunto:'', descripcion:'' })
    setTab('lista')
  }

  const s = { background:'#111520', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'12px' }
  const inp = { background:'#0A0D14', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'7px', color:'#E8EDF5', padding:'7px 10px', fontSize:'13px', outline:'none', width:'100%', boxSizing:'border-box' as const }

  return (
    <div style={{ color:'#E8EDF5', fontFamily:'system-ui,sans-serif' }}>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
        <div>
          <h1 style={{ fontSize:'22px', fontWeight:'700', marginBottom:'4px' }}>📬 PQRSF</h1>
          <p style={{ fontSize:'13px', color:'#8B96A8' }}>
            Peticiones · Quejas · Reclamos · Sugerencias · Felicitaciones · HACER
          </p>
        </div>
        <div style={{ display:'flex', gap:'8px' }}>
          <a href="/pqrsf/nuevo" target="_blank"
            style={{ padding:'9px 16px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'10px', color:'#8B96A8', textDecoration:'none', fontSize:'13px', fontWeight:'600' }}>
            🔗 Link público
          </a>
          <button onClick={() => setTab('nueva')}
            style={{ padding:'9px 18px', background:'#F5A623', color:'#0A0D14', border:'none', borderRadius:'10px', fontWeight:'700', fontSize:'13px', cursor:'pointer' }}>
            + Nueva PQRSF
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'8px', marginBottom:'16px' }}>
        {[
          { label:'Total', value:stats.total, color:'#E8EDF5', icon:'📬' },
          { label:'Recibidas', value:stats.recibidas, color:'#3D8EF0', icon:'📥' },
          { label:'En gestión', value:stats.en_gestion, color:'#F5A623', icon:'⏳' },
          { label:'Respondidas', value:stats.respondidas, color:'#9B6BFF', icon:'✉️' },
          { label:'Cerradas', value:stats.cerradas, color:'#2DD4A0', icon:'✅' },
          { label:'Vencidas', value:stats.vencidas, color: stats.vencidas > 0 ? '#F05C5C' : '#2DD4A0', icon:'🚨' },
        ].map((k,i) => (
          <div key={i} style={{ ...s, padding:'12px', borderTop:`2px solid ${k.color}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
              <span style={{ fontSize:'10px', color:'#8B96A8' }}>{k.label}</span>
              <span>{k.icon}</span>
            </div>
            <div style={{ fontSize:'22px', fontWeight:'800', color:k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'6px', marginBottom:'16px' }}>
        {[
          { key:'lista', label:'📋 Lista' },
          { key:'nueva', label:'✏️ Nueva PQRSF' },
          { key:'stats', label:'📊 Estadísticas' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            style={{ padding:'8px 16px', borderRadius:'9px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'600',
              background: tab === t.key ? '#F5A623' : 'rgba(255,255,255,0.05)',
              color: tab === t.key ? '#0A0D14' : '#8B96A8' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB LISTA */}
      {tab === 'lista' && (
        <div style={{ display:'grid', gridTemplateColumns: seleccionada ? '1fr 400px' : '1fr', gap:'16px' }}>
          <div>
            {/* Filtros */}
            <div style={{ display:'flex', gap:'6px', marginBottom:'12px', flexWrap:'wrap' }}>
              {['TODOS','RECIBIDO','EN_GESTION','RESPONDIDO','CERRADO'].map(f => (
                <button key={f} onClick={() => setFiltroEstado(f)}
                  style={{ padding:'5px 12px', borderRadius:'7px', border:'none', cursor:'pointer', fontSize:'11px', fontWeight:'600',
                    background: filtroEstado === f ? '#F5A623' : 'rgba(255,255,255,0.05)',
                    color: filtroEstado === f ? '#0A0D14' : '#8B96A8' }}>
                  {f.replace('_',' ')}
                </button>
              ))}
              <div style={{ width:'1px', background:'rgba(255,255,255,0.08)', margin:'0 4px' }} />
              {['TODOS','P','Q','R','S','F'].map(t => (
                <button key={t} onClick={() => setFiltroTipo(t)}
                  style={{ padding:'5px 10px', borderRadius:'7px', border:'none', cursor:'pointer', fontSize:'11px', fontWeight:'600',
                    background: filtroTipo === t ? (t === 'TODOS' ? '#F5A623' : `${TIPO_INFO[t]?.color || '#F5A623'}22`) : 'rgba(255,255,255,0.05)',
                    color: filtroTipo === t ? (t === 'TODOS' ? '#0A0D14' : TIPO_INFO[t]?.color || '#F5A623') : '#8B96A8',
                    border: filtroTipo === t && t !== 'TODOS' ? `1px solid ${TIPO_INFO[t]?.color}44` : '1px solid transparent' }}>
                  {t === 'TODOS' ? 'Todos' : `${TIPO_INFO[t]?.emoji} ${t}`}
                </button>
              ))}
            </div>

            {/* Lista */}
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              {filtradas.map(p => {
                const tipo = TIPO_INFO[p.tipo]
                const estado = ESTADO_INFO[p.estado]
                const dias = diasRestantes(p.fecha_limite)
                const activa = seleccionada?.id === p.id
                return (
                  <div key={p.id} onClick={() => setSeleccionada(activa ? null : p)}
                    style={{ ...s, padding:'14px 16px', cursor:'pointer', transition:'all .12s',
                      border:`1px solid ${activa ? tipo.color + '44' : 'rgba(255,255,255,0.07)'}`,
                      background: activa ? tipo.color + '06' : '#111520' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                      <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:`${tipo.color}15`,
                        display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0 }}>
                        {tipo.emoji}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'3px' }}>
                          <span style={{ fontSize:'13px', fontWeight:'700' }}>{p.nombre}</span>
                          <span style={{ fontSize:'10px', padding:'1px 7px', borderRadius:'5px', fontWeight:'700',
                            background:`${tipo.color}15`, color:tipo.color }}>
                            {tipo.label}
                          </span>
                          <span style={{ fontSize:'10px', padding:'1px 7px', borderRadius:'5px', fontWeight:'700',
                            background:estado.bg, color:estado.color }}>
                            {p.estado.replace('_',' ')}
                          </span>
                          {p.prioridad === 'ALTA' && (
                            <span style={{ fontSize:'9px', padding:'1px 6px', borderRadius:'4px', background:'rgba(240,92,92,0.12)', color:'#F05C5C', fontWeight:'700' }}>
                              ALTA PRIORIDAD
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize:'12px', color:'#E8EDF5', marginBottom:'2px' }}>{p.asunto}</div>
                        <div style={{ fontSize:'11px', color:'#5A6478' }}>
                          {p.radicado} · {p.fecha_creacion}
                          {p.orden_id && ` · Orden #${p.orden_id}`}
                        </div>
                      </div>
                      <div style={{ textAlign:'right', flexShrink:0 }}>
                        <div style={{ fontSize:'11px', fontWeight:'700',
                          color: dias < 0 ? '#F05C5C' : dias <= 3 ? '#F5A623' : '#5A6478' }}>
                          {dias < 0 ? `Vencida (${Math.abs(dias)}d)` : dias === 0 ? '¡Vence hoy!' : `${dias}d restantes`}
                        </div>
                        <div style={{ fontSize:'10px', color:'#5A6478', marginTop:'2px' }}>Límite: {p.fecha_limite}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
              {filtradas.length === 0 && (
                <div style={{ ...s, padding:'32px', textAlign:'center', color:'#5A6478', fontSize:'13px' }}>
                  Sin PQRSF con los filtros seleccionados
                </div>
              )}
            </div>
          </div>

          {/* Panel detalle */}
          {seleccionada && (
            <div style={{ ...s, padding:'20px', position:'sticky', top:'20px', maxHeight:'80vh', overflowY:'auto' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px' }}>
                <div>
                  <div style={{ fontSize:'11px', color:'#5A6478', marginBottom:'4px' }}>RADICADO</div>
                  <div style={{ fontSize:'14px', fontWeight:'800', color: TIPO_INFO[seleccionada.tipo].color }}>
                    {TIPO_INFO[seleccionada.tipo].emoji} {seleccionada.radicado}
                  </div>
                </div>
                <button onClick={() => setSeleccionada(null)}
                  style={{ background:'none', border:'none', color:'#8B96A8', cursor:'pointer', fontSize:'20px' }}>×</button>
              </div>

              {/* Info cliente */}
              <div style={{ background:'rgba(255,255,255,0.02)', borderRadius:'10px', padding:'12px 14px', marginBottom:'12px' }}>
                <div style={{ fontSize:'11px', color:'#5A6478', fontWeight:'700', marginBottom:'8px' }}>CLIENTE</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', fontSize:'12px' }}>
                  {[
                    { l:'Nombre', v:seleccionada.nombre },
                    { l:'Teléfono', v:seleccionada.telefono },
                    { l:'Email', v:seleccionada.email },
                    { l:'Orden', v:seleccionada.orden_id || 'N/A' },
                  ].map((f,i) => (
                    <div key={i}>
                      <div style={{ color:'#5A6478', fontSize:'10px' }}>{f.l}</div>
                      <div style={{ color:'#E8EDF5', fontWeight:'600' }}>{f.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Solicitud */}
              <div style={{ marginBottom:'12px' }}>
                <div style={{ fontSize:'13px', fontWeight:'700', marginBottom:'6px' }}>{seleccionada.asunto}</div>
                <div style={{ fontSize:'12px', color:'#8B96A8', lineHeight:'1.6', background:'rgba(255,255,255,0.02)', padding:'10px 12px', borderRadius:'8px' }}>
                  {seleccionada.descripcion}
                </div>
              </div>

              {/* Respuesta existente */}
              {seleccionada.respuesta && (
                <div style={{ marginBottom:'12px', padding:'12px', background:'rgba(45,212,160,0.06)', borderRadius:'10px', border:'1px solid rgba(45,212,160,0.15)' }}>
                  <div style={{ fontSize:'11px', color:'#2DD4A0', fontWeight:'700', marginBottom:'6px' }}>✅ RESPUESTA ENVIADA — {seleccionada.fecha_respuesta}</div>
                  <div style={{ fontSize:'12px', color:'#8B96A8', lineHeight:'1.6' }}>{seleccionada.respuesta}</div>
                </div>
              )}

              {/* Responder */}
              {seleccionada.estado !== 'CERRADO' && (
                <div>
                  <div style={{ fontSize:'11px', color:'#5A6478', fontWeight:'700', marginBottom:'6px' }}>
                    {seleccionada.respuesta ? 'ACTUALIZAR RESPUESTA' : 'RESPONDER'}
                  </div>
                  <textarea value={respuesta} onChange={e => setRespuesta(e.target.value)}
                    placeholder="Escribe tu respuesta al cliente..."
                    rows={4}
                    style={{ ...inp, resize:'vertical', marginBottom:'8px' }} />
                  <div style={{ display:'flex', gap:'8px' }}>
                    <button onClick={responder} disabled={!respuesta}
                      style={{ flex:1, padding:'9px', background: respuesta ? '#F5A623' : 'rgba(255,255,255,0.05)',
                        border:'none', borderRadius:'8px', color: respuesta ? '#0A0D14' : '#5A6478',
                        cursor: respuesta ? 'pointer' : 'not-allowed', fontSize:'13px', fontWeight:'700' }}>
                      ✉️ Enviar respuesta
                    </button>
                    {seleccionada.estado === 'RESPONDIDO' && (
                      <button onClick={() => cerrar(seleccionada.id)}
                        style={{ padding:'9px 14px', background:'rgba(45,212,160,0.1)', border:'none', borderRadius:'8px', color:'#2DD4A0', cursor:'pointer', fontSize:'13px', fontWeight:'700' }}>
                        ✅ Cerrar
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Fecha límite */}
              <div style={{ marginTop:'12px', padding:'10px 12px', borderRadius:'8px', display:'flex', justifyContent:'space-between',
                background: diasRestantes(seleccionada.fecha_limite) < 0 ? 'rgba(240,92,92,0.06)' : diasRestantes(seleccionada.fecha_limite) <= 3 ? 'rgba(245,166,35,0.06)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${diasRestantes(seleccionada.fecha_limite) < 0 ? 'rgba(240,92,92,0.2)' : 'rgba(255,255,255,0.06)'}` }}>
                <span style={{ fontSize:'11px', color:'#5A6478' }}>Fecha límite respuesta</span>
                <span style={{ fontSize:'12px', fontWeight:'700',
                  color: diasRestantes(seleccionada.fecha_limite) < 0 ? '#F05C5C' : diasRestantes(seleccionada.fecha_limite) <= 3 ? '#F5A623' : '#2DD4A0' }}>
                  {seleccionada.fecha_limite} ({diasRestantes(seleccionada.fecha_limite)}d)
                </span>
              </div>

              {/* Aviso legal */}
              <div style={{ marginTop:'10px', padding:'10px 12px', borderRadius:'8px', background:'rgba(61,142,240,0.05)', border:'1px solid rgba(61,142,240,0.15)', fontSize:'11px', color:'#5A6478', lineHeight:'1.5' }}>
                ⚖️ Según Ley 1480 (Estatuto del Consumidor), tienes hasta {TIPO_INFO[seleccionada.tipo]?.dias} días hábiles para responder esta {TIPO_INFO[seleccionada.tipo]?.label.toLowerCase()}.
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB NUEVA */}
      {tab === 'nueva' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div style={{ ...s, padding:'20px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'16px' }}>✏️ REGISTRAR NUEVA PQRSF</div>

            {/* Tipo */}
            <div style={{ marginBottom:'14px' }}>
              <label style={{ display:'block', fontSize:'11px', color:'#5A6478', marginBottom:'8px' }}>Tipo de solicitud</label>
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                {Object.entries(TIPO_INFO).map(([key, info]) => (
                  <button key={key} onClick={() => setNuevaPQRSF(p => ({...p, tipo:key}))}
                    style={{ padding:'7px 14px', borderRadius:'8px', border:`1px solid ${nuevaPQRSF.tipo === key ? info.color : 'rgba(255,255,255,0.08)'}`,
                      background: nuevaPQRSF.tipo === key ? `${info.color}15` : 'transparent',
                      color: nuevaPQRSF.tipo === key ? info.color : '#8B96A8', cursor:'pointer', fontSize:'12px', fontWeight:'600' }}>
                    {info.emoji} {info.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Campos */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'10px' }}>
              {[
                { label:'Nombre del cliente', key:'nombre', placeholder:'Ej: María García', full:true },
                { label:'Email', key:'email', placeholder:'cliente@email.com' },
                { label:'Teléfono', key:'telefono', placeholder:'3001234567' },
                { label:'Número de orden (opcional)', key:'orden_id', placeholder:'9012345' },
              ].map((f,i) => (
                <div key={i} style={{ gridColumn: f.full ? '1/-1' : 'auto' }}>
                  <label style={{ display:'block', fontSize:'11px', color:'#5A6478', marginBottom:'4px' }}>{f.label}</label>
                  <input value={(nuevaPQRSF as any)[f.key]} placeholder={f.placeholder}
                    onChange={e => setNuevaPQRSF(p => ({...p, [f.key]:e.target.value}))}
                    style={inp} />
                </div>
              ))}
            </div>

            <div style={{ marginBottom:'10px' }}>
              <label style={{ display:'block', fontSize:'11px', color:'#5A6478', marginBottom:'4px' }}>Asunto</label>
              <input value={nuevaPQRSF.asunto} placeholder="Resumen breve de la solicitud"
                onChange={e => setNuevaPQRSF(p => ({...p, asunto:e.target.value}))} style={inp} />
            </div>

            <div style={{ marginBottom:'14px' }}>
              <label style={{ display:'block', fontSize:'11px', color:'#5A6478', marginBottom:'4px' }}>Descripción detallada</label>
              <textarea value={nuevaPQRSF.descripcion}
                placeholder="Describe en detalle la solicitud del cliente..."
                rows={4} onChange={e => setNuevaPQRSF(p => ({...p, descripcion:e.target.value}))}
                style={{ ...inp, resize:'vertical' }} />
            </div>

            <button onClick={crearNueva}
              disabled={!nuevaPQRSF.nombre || !nuevaPQRSF.asunto || !nuevaPQRSF.descripcion}
              style={{ width:'100%', padding:'11px', background:'#F5A623', border:'none', borderRadius:'10px',
                color:'#0A0D14', cursor:'pointer', fontWeight:'700', fontSize:'13px',
                opacity: !nuevaPQRSF.nombre || !nuevaPQRSF.asunto ? 0.5 : 1 }}>
              📬 Radicar PQRSF
            </button>
          </div>

          {/* Info legal */}
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#3D8EF0', marginBottom:'12px' }}>⚖️ TIEMPOS LEGALES — LEY 1480</div>
              {Object.entries(TIPO_INFO).map(([key, info]) => (
                <div key={key} style={{ display:'flex', justifyContent:'space-between', padding:'8px 10px', borderRadius:'8px', marginBottom:'5px', background:`${info.color}06` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <span style={{ fontSize:'16px' }}>{info.emoji}</span>
                    <span style={{ fontSize:'12px', color:'#8B96A8' }}>{info.label}</span>
                  </div>
                  <span style={{ fontSize:'12px', fontWeight:'700', color:info.color }}>{info.dias} días hábiles</span>
                </div>
              ))}
              <div style={{ marginTop:'10px', padding:'10px 12px', background:'rgba(61,142,240,0.05)', borderRadius:'8px', fontSize:'11px', color:'#8B96A8', lineHeight:'1.6' }}>
                El incumplimiento de estos plazos puede generar sanciones ante la Superintendencia de Industria y Comercio (SIC).
              </div>
            </div>

            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#2DD4A0', marginBottom:'12px' }}>🔗 FORMULARIO PÚBLICO</div>
              <div style={{ fontSize:'12px', color:'#8B96A8', marginBottom:'12px', lineHeight:'1.6' }}>
                Comparte este link con tus clientes para que radiquen sus solicitudes directamente sin revelar la identidad de tu tienda.
              </div>
              <div style={{ padding:'10px 12px', background:'rgba(255,255,255,0.03)', borderRadius:'8px', fontFamily:'monospace', fontSize:'12px', color:'#2DD4A0', marginBottom:'10px', wordBreak:'break-all' }}>
                dizgo.app/pqrsf/nuevo
              </div>
              <div style={{ display:'flex', gap:'8px' }}>
                <button onClick={() => navigator.clipboard?.writeText('https://dizgo.app/pqrsf/nuevo')}
                  style={{ flex:1, padding:'8px', background:'rgba(45,212,160,0.1)', border:'none', borderRadius:'7px', color:'#2DD4A0', cursor:'pointer', fontSize:'12px', fontWeight:'600' }}>
                  📋 Copiar link
                </button>
                <button onClick={() => {
                  const msg = encodeURIComponent('Hola, si tienes alguna solicitud, queja o reclamo sobre tu pedido, puedes radicarlo aquí: https://dizgo.app/pqrsf/nuevo')
                  window.open(`https://wa.me/?text=${msg}`, '_blank')
                }}
                  style={{ flex:1, padding:'8px', background:'rgba(37,211,102,0.1)', border:'none', borderRadius:'7px', color:'#25D366', cursor:'pointer', fontSize:'12px', fontWeight:'600' }}>
                  💬 Compartir WA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB STATS */}
      {tab === 'stats' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div style={{ ...s, padding:'20px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'14px' }}>📊 POR TIPO DE SOLICITUD</div>
            {Object.entries(TIPO_INFO).map(([key, info]) => {
              const count = pqrsf.filter(p => p.tipo === key).length
              const pct = pqrsf.length > 0 ? Math.round(count/pqrsf.length*100) : 0
              return (
                <div key={key} style={{ marginBottom:'12px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                    <span style={{ fontSize:'12px', color:'#8B96A8' }}>{info.emoji} {info.label}</span>
                    <span style={{ fontSize:'13px', fontWeight:'700', color:info.color }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height:'8px', background:'rgba(255,255,255,0.05)', borderRadius:'4px' }}>
                    <div style={{ height:'8px', width:`${pct}%`, background:info.color, borderRadius:'4px' }} />
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#3D8EF0', marginBottom:'12px' }}>⏱️ TIEMPOS DE RESPUESTA</div>
              {[
                { label:'Respondidas a tiempo', value:pqrsf.filter(p=>p.estado==='RESPONDIDO'||p.estado==='CERRADO').length, color:'#2DD4A0', icon:'✅' },
                { label:'En gestión (a tiempo)', value:pqrsf.filter(p=>p.estado==='EN_GESTION' && diasRestantes(p.fecha_limite)>=0).length, color:'#F5A623', icon:'⏳' },
                { label:'Vencidas sin responder', value:pqrsf.filter(p=>p.estado!=='CERRADO'&&diasRestantes(p.fecha_limite)<0).length, color:'#F05C5C', icon:'🚨' },
              ].map((k, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 12px', borderRadius:'8px', marginBottom:'6px', background:`${k.color}08` }}>
                  <span style={{ fontSize:'12px', color:'#8B96A8', display:'flex', gap:'6px', alignItems:'center' }}>
                    <span>{k.icon}</span>{k.label}
                  </span>
                  <span style={{ fontSize:'16px', fontWeight:'800', color:k.color }}>{k.value}</span>
                </div>
              ))}
            </div>

            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#9B6BFF', marginBottom:'12px' }}>💡 RECOMENDACIONES</div>
              {[
                stats.en_gestion > 0 && { color:'#F5A623', texto:`${stats.en_gestion} solicitudes en gestión — responder antes del vencimiento` },
                stats.vencidas > 0 && { color:'#F05C5C', texto:`${stats.vencidas} solicitudes vencidas — riesgo legal ante la SIC` },
                { color:'#3D8EF0', texto:'Comparte el link público con cada cliente en el mensaje de confirmación' },
                { color:'#2DD4A0', texto:'Responder en menos de 24h genera mayor confianza y reduce reclamos formales' },
              ].filter(Boolean).map((a: any, i) => (
                <div key={i} style={{ display:'flex', gap:'8px', padding:'8px 10px', borderRadius:'7px', marginBottom:'5px', background:`${a.color}08`, borderLeft:`3px solid ${a.color}` }}>
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
