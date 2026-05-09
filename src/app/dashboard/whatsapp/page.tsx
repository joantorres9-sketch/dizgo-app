'use client'
import { useState } from 'react'

type Pedido = {
  id: number; guia: string; fecha: string
  cliente: string; telefono: string; producto: string
  pvp: number; ciudad: string; estado: string
  novedad: string; wa_enviado: boolean; wa_fecha: string
}

type Plantilla = {
  id: string; nombre: string; emoji: string; color: string
  descripcion: string; estado_aplicable: string[]
  mensaje: (p: Pedido) => string
}

const PEDIDOS: Pedido[] = [
  { id:9012507, guia:'', fecha:'04-09-2023', cliente:'Mari Erazo', telefono:'3015081521', producto:'Pendientes clásicos de cristal dorado', pvp:79900, ciudad:'PASTO', estado:'PENDIENTE CONFIRMACION', novedad:'', wa_enviado:false, wa_fecha:'' },
  { id:9012457, guia:'COL123457', fecha:'04-09-2023', cliente:'Esneider Gamboa', telefono:'3132342712', producto:'Reloj Electrónico Led de Moda', pvp:69900, ciudad:'CANTAGALLO', estado:'GUIA_GENERADA', novedad:'', wa_enviado:true, wa_fecha:'04-09-2023 18:30' },
  { id:9012096, guia:'COL123460', fecha:'04-09-2023', cliente:'Rosa Maria Orozco', telefono:'3148465012', producto:'Pulsera Con Dije De Corazón', pvp:69900, ciudad:'BELLO', estado:'EN REPARTO', novedad:'', wa_enviado:false, wa_fecha:'' },
  { id:9011835, guia:'COL123462', fecha:'04-09-2023', cliente:'Sedalis Torres', telefono:'3164994940', producto:'Prótesis Snap-On Dental', pvp:79900, ciudad:'URUMITA', estado:'NOVEDAD', novedad:'No encontrado en dirección', wa_enviado:false, wa_fecha:'' },
  { id:9011650, guia:'COL123464', fecha:'03-09-2023', cliente:'Carlos Mendez', telefono:'3001234567', producto:'Reloj Vintage de Mujer', pvp:89900, ciudad:'CALI', estado:'CANCELADO', novedad:'', wa_enviado:false, wa_fecha:'' },
  { id:9011600, guia:'COL123465', fecha:'03-09-2023', cliente:'Ana Lucia Perez', telefono:'3109876543', producto:'Gafas de Sol Aviador', pvp:69900, ciudad:'BARRANQUILLA', estado:'DESPACHADA', novedad:'', wa_enviado:false, wa_fecha:'' },
  { id:9011500, guia:'COL123467', fecha:'02-09-2023', cliente:'Jorge Ramirez', telefono:'3156789012', producto:'Reloj Cuarzo + Circonita x2', pvp:149900, ciudad:'BOGOTA', estado:'EN BODEGA DESTINO', novedad:'', wa_enviado:false, wa_fecha:'' },
  { id:9011450, guia:'COL123468', fecha:'02-09-2023', cliente:'Sandra Vargas', telefono:'3134567890', producto:'Gafas Antirradiaciones', pvp:69900, ciudad:'MEDELLIN', estado:'DEVOLUCION', novedad:'Cliente rechazó el pedido', wa_enviado:false, wa_fecha:'' },
  { id:9011350, guia:'COL123469', fecha:'02-09-2023', cliente:'Pedro Castro', telefono:'3165432109', producto:'Trébol de la Suerte', pvp:69900, ciudad:'PASTO', estado:'ENTREGADO', novedad:'', wa_enviado:true, wa_fecha:'02-09-2023 14:00' },
  { id:9011300, guia:'', fecha:'01-09-2023', cliente:'Diana Lopez', telefono:'3198765432', producto:'Linterna Táctica LED', pvp:69900, ciudad:'VILLAVICENCIO', estado:'PENDIENTE CONFIRMACION', novedad:'No contesta', wa_enviado:false, wa_fecha:'' },
]

const PLANTILLAS: Plantilla[] = [
  {
    id:'confirmacion',
    nombre:'Confirmación de Pedido',
    emoji:'✅',
    color:'#2DD4A0',
    descripcion:'Para pendientes por confirmar — datos del pedido',
    estado_aplicable:['PENDIENTE CONFIRMACION','PENDIENTE'],
    mensaje:(p) => `¡Hola ${p.cliente.split(' ')[0]}! 👋\n\nTe contactamos de *${p.producto.split(' ').slice(0,3).join(' ')}* para confirmar tu pedido.\n\n📦 *Producto:* ${p.producto}\n💰 *Valor:* $${p.pvp.toLocaleString('es-CO')}\n📍 *Ciudad entrega:* ${p.ciudad}\n\n¿Confirmamos tu pedido y dirección exacta?\n\nResponde con *SÍ* para confirmar o cuéntanos si hay algún cambio. ¡Gracias! 🙏`
  },
  {
    id:'despacho',
    nombre:'Pedido Despachado',
    emoji:'🚚',
    color:'#3D8EF0',
    descripcion:'Cuando la guía ya fue generada y el pedido sale',
    estado_aplicable:['GUIA_GENERADA','DESPACHADA','EN PROCESAMIENTO'],
    mensaje:(p) => `¡Hola ${p.cliente.split(' ')[0]}! 🎉\n\n*Tu pedido está en camino* 🚚\n\n📦 *Producto:* ${p.producto}\n📋 *Guía:* ${p.guia || 'En proceso'}\n📍 *Destino:* ${p.ciudad}\n\nTu pedido fue despachado y llegará en los próximos días hábiles. Puedes rastrear tu guía con el número indicado.\n\n¿Tienes alguna pregunta? Estamos aquí para ayudarte 😊`
  },
  {
    id:'transito',
    nombre:'En Reparto / Tránsito',
    emoji:'📍',
    color:'#9B6BFF',
    descripcion:'Pedido en camino — recordatorio antes de entrega',
    estado_aplicable:['EN REPARTO','EN BODEGA DESTINO'],
    mensaje:(p) => `¡Hola ${p.cliente.split(' ')[0]}! 📍\n\n*Tu pedido está muy cerca* ⏰\n\n📦 *Producto:* ${p.producto}\n🚚 *Estado:* En reparto en ${p.ciudad}\n\n*Por favor asegúrate de:*\n✅ Estar disponible para recibir\n✅ Tener el valor exacto listo: *$${p.pvp.toLocaleString('es-CO')}*\n✅ Tu dirección: confirma que sea correcta\n\n¿Tienes alguna observación para el mensajero? 🙏`
  },
  {
    id:'novedad',
    nombre:'Gestión de Novedad',
    emoji:'⚠️',
    color:'#F5A623',
    descripcion:'Para novedades — dirección incorrecta, no encontrado',
    estado_aplicable:['NOVEDAD'],
    mensaje:(p) => `¡Hola ${p.cliente.split(' ')[0]}! ⚠️\n\nTe escribimos porque tuvimos una *novedad con tu pedido*.\n\n📦 *Producto:* ${p.producto}\n❗ *Novedad:* ${p.novedad || 'El mensajero tuvo dificultades para encontrarte'}\n\n*Necesitamos que nos ayudes con:*\n📍 Dirección exacta (barrio, referencia)\n📞 Mejor horario para entrega\n\nSi no resolvemos la novedad, el pedido podría devolverse. ¿Nos ayudas? 🙏`
  },
  {
    id:'devolucion',
    nombre:'Gestión de Devolución',
    emoji:'🔄',
    color:'#F05C5C',
    descripcion:'Para devoluciones — recuperar o gestionar el proceso',
    estado_aplicable:['DEVOLUCION','CANCELADO'],
    mensaje:(p) => `¡Hola ${p.cliente.split(' ')[0]}! 🔄\n\nNos enteramos que tu pedido fue devuelto o cancelado.\n\n📦 *Producto:* ${p.producto}\n💰 *Valor:* $${p.pvp.toLocaleString('es-CO')}\n\n¿Qué pasó? Queremos entender para mejorar 🙏\n\nSi deseas *reagendar la entrega* o tienes alguna duda, con gusto te ayudamos. También puedes solicitar información sobre tu reembolso.\n\n¿Cómo podemos ayudarte? 😊`
  },
  {
    id:'recompra',
    nombre:'Recompra / Fidelización',
    emoji:'⭐',
    color:'#F5A623',
    descripcion:'Para clientes que ya recibieron — generar recompra',
    estado_aplicable:['ENTREGADO'],
    mensaje:(p) => `¡Hola ${p.cliente.split(' ')[0]}! ⭐\n\n¡Esperamos que estés disfrutando tu *${p.producto.split(' ').slice(0,3).join(' ')}*! 🎉\n\n¿Todo llegó perfecto? Tu opinión nos importa mucho.\n\n💛 Si quedaste satisfecho/a, tenemos *nuevos productos* que podrían gustarte.\n🎁 Como cliente especial, tienes *descuento exclusivo* en tu próxima compra.\n\n¿Te interesa ver las novedades? Te comparto el catálogo 😊`
  },
]

export default function WhatsAppPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>(PEDIDOS)
  const [plantillaActiva, setPlantillaActiva] = useState<string>('confirmacion')
  const [filtroEstado, setFiltroEstado] = useState('TODOS')
  const [seleccionados, setSeleccionados] = useState<number[]>([])
  const [preview, setPreview] = useState<Pedido | null>(null)
  const [tab, setTab] = useState<'plantillas'|'lotes'|'stats'>('plantillas')
  const [msgPersonalizado, setMsgPersonalizado] = useState('')

  const plantilla = PLANTILLAS.find(p => p.id === plantillaActiva)!

  const pedidosFiltrados = pedidos.filter(p => {
    if (filtroEstado === 'TODOS') return true
    if (filtroEstado === 'NO_ENVIADO') return !p.wa_enviado
    if (filtroEstado === 'ENVIADO') return p.wa_enviado
    return p.estado === filtroEstado
  })

  const aplicables = pedidosFiltrados.filter(p =>
    plantilla.estado_aplicable.includes(p.estado)
  )

  function toggleSeleccion(id: number) {
    setSeleccionados(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  function selectAll() {
    const ids = aplicables.map(p => p.id)
    setSeleccionados(prev => prev.length === ids.length ? [] : ids)
  }

  function abrirWA(p: Pedido, plantillaMensaje?: Plantilla) {
    const pl = plantillaMensaje || plantilla
    const msg = encodeURIComponent(pl.mensaje(p))
    const tel = p.telefono.replace(/\D/g, '')
    const prefijo = tel.startsWith('57') ? '' : '57'
    window.open(`https://wa.me/${prefijo}${tel}?text=${msg}`, '_blank')
    setPedidos(prev => prev.map(x => x.id === p.id ? { ...x, wa_enviado: true, wa_fecha: new Date().toLocaleString('es-CO') } : x))
  }

  function enviarLote() {
    const pedidosLote = pedidos.filter(p => seleccionados.includes(p.id))
    if (pedidosLote.length === 0) return
    abrirWA(pedidosLote[0])
    setSeleccionados([])
  }

  const stats = {
    total: pedidos.length,
    enviados: pedidos.filter(p => p.wa_enviado).length,
    pendientes_wa: pedidos.filter(p => !p.wa_enviado && ['PENDIENTE CONFIRMACION','NOVEDAD'].includes(p.estado)).length,
    novedades: pedidos.filter(p => p.estado === 'NOVEDAD').length,
    devoluciones: pedidos.filter(p => p.estado === 'DEVOLUCION').length,
  }

  const colorEstado: Record<string, string> = {
    'PENDIENTE CONFIRMACION':'#F5A623', 'PENDIENTE':'#F5A623',
    'GUIA_GENERADA':'#3D8EF0', 'EN PROCESAMIENTO':'#9B6BFF',
    'DESPACHADA':'#3D8EF0', 'EN REPARTO':'#2DD4A0',
    'EN BODEGA DESTINO':'#9B6BFF', 'ENTREGADO':'#2DD4A0',
    'NOVEDAD':'#F5A623', 'CANCELADO':'#F05C5C', 'DEVOLUCION':'#F05C5C',
  }

  const s = { background:'#111520', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'12px' }

  return (
    <div style={{ color:'#E8EDF5', fontFamily:'system-ui,sans-serif' }}>

      <div style={{ marginBottom:'20px' }}>
        <h1 style={{ fontSize:'22px', fontWeight:'700', marginBottom:'4px' }}>💬 Centro WhatsApp</h1>
        <p style={{ fontSize:'13px', color:'#8B96A8' }}>6 plantillas · Envío por lotes · Seguimiento · HACER</p>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'8px', marginBottom:'16px' }}>
        {[
          { label:'Total pedidos', value:stats.total, color:'#E8EDF5', icon:'📦' },
          { label:'WA enviados', value:stats.enviados, color:'#2DD4A0', icon:'✅' },
          { label:'Urgente (WA)', value:stats.pendientes_wa, color:'#F5A623', icon:'⚡' },
          { label:'Novedades', value:stats.novedades, color:'#F5A623', icon:'⚠️' },
          { label:'Devoluciones', value:stats.devoluciones, color:'#F05C5C', icon:'🔄' },
        ].map((k,i) => (
          <div key={i} style={{ ...s, padding:'12px 14px', borderTop:`2px solid ${k.color}` }}>
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
          { key:'plantillas', label:'📝 Plantillas' },
          { key:'lotes', label:'📤 Envío por Lotes' },
          { key:'stats', label:'📊 Seguimiento' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            style={{ padding:'8px 16px', borderRadius:'9px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'600',
              background: tab === t.key ? '#25D366' : 'rgba(255,255,255,0.05)',
              color: tab === t.key ? '#fff' : '#8B96A8' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB PLANTILLAS */}
      {tab === 'plantillas' && (
        <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:'16px' }}>

          {/* Lista plantillas */}
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            {PLANTILLAS.map(pl => (
              <button key={pl.id} onClick={() => setPlantillaActiva(pl.id)}
                style={{ padding:'12px 14px', borderRadius:'10px', border:`1px solid ${plantillaActiva === pl.id ? pl.color + '44' : 'rgba(255,255,255,0.06)'}`,
                  background: plantillaActiva === pl.id ? pl.color + '10' : '#111520',
                  cursor:'pointer', textAlign:'left', transition:'all .12s' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                  <span style={{ fontSize:'18px' }}>{pl.emoji}</span>
                  <span style={{ fontSize:'13px', fontWeight:'600', color: plantillaActiva === pl.id ? pl.color : '#E8EDF5' }}>{pl.nombre}</span>
                </div>
                <div style={{ fontSize:'11px', color:'#5A6478' }}>{pl.descripcion}</div>
                <div style={{ marginTop:'6px', display:'flex', gap:'4px', flexWrap:'wrap' }}>
                  {pl.estado_aplicable.map(est => (
                    <span key={est} style={{ fontSize:'9px', padding:'1px 6px', borderRadius:'4px', background:`${pl.color}15`, color:pl.color, fontWeight:'600' }}>
                      {est.replace('_',' ').slice(0,12)}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {/* Panel derecho */}
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>

            {/* Preview plantilla */}
            <div style={{ ...s, padding:'18px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
                <span style={{ fontSize:'20px' }}>{plantilla.emoji}</span>
                <div>
                  <div style={{ fontWeight:'700', color:plantilla.color }}>{plantilla.nombre}</div>
                  <div style={{ fontSize:'11px', color:'#5A6478' }}>Vista previa del mensaje</div>
                </div>
              </div>
              <div style={{ background:'#0A0D14', borderRadius:'10px', padding:'14px', fontSize:'13px', lineHeight:'1.8', color:'#E8EDF5', fontFamily:'system-ui', whiteSpace:'pre-wrap', maxHeight:'200px', overflowY:'auto', border:'1px solid rgba(37,211,102,0.2)' }}>
                {plantilla.mensaje(preview || pedidos[0])}
              </div>
              {preview && (
                <div style={{ marginTop:'10px', fontSize:'11px', color:'#5A6478' }}>
                  Vista previa para: <strong style={{ color:plantilla.color }}>{preview.cliente}</strong>
                </div>
              )}
            </div>

            {/* Lista de pedidos aplicables */}
            <div style={{ ...s, overflow:'hidden' }}>
              <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'13px', fontWeight:'700' }}>
                  Pedidos para esta plantilla
                  <span style={{ marginLeft:'6px', fontSize:'11px', color:plantilla.color }}>({aplicables.length})</span>
                </span>
                <div style={{ display:'flex', gap:'6px' }}>
                  {['TODOS','NO_ENVIADO','ENVIADO'].map(f => (
                    <button key={f} onClick={() => setFiltroEstado(f)}
                      style={{ padding:'4px 10px', borderRadius:'6px', border:'none', cursor:'pointer', fontSize:'11px',
                        background: filtroEstado === f ? 'rgba(255,255,255,0.1)' : 'transparent',
                        color: filtroEstado === f ? '#E8EDF5' : '#5A6478' }}>
                      {f.replace('_',' ')}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ maxHeight:'280px', overflowY:'auto' }}>
                {aplicables.length === 0 ? (
                  <div style={{ padding:'24px', textAlign:'center', color:'#5A6478', fontSize:'13px' }}>
                    Sin pedidos en estado {plantilla.estado_aplicable.join(' / ')}
                  </div>
                ) : aplicables.map(p => (
                  <div key={p.id} onMouseEnter={() => setPreview(p)} onMouseLeave={() => setPreview(null)}
                    style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.03)', transition:'background .1s' }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'2px' }}>
                        <span style={{ fontSize:'13px', fontWeight:'600' }}>{p.cliente}</span>
                        <span style={{ fontSize:'10px', padding:'1px 6px', borderRadius:'4px', background:`${colorEstado[p.estado] || '#8B96A8'}15`, color:colorEstado[p.estado] || '#8B96A8' }}>
                          {p.estado.replace('_',' ').slice(0,14)}
                        </span>
                        {p.wa_enviado && <span style={{ fontSize:'10px', color:'#25D366' }}>✓ Enviado</span>}
                      </div>
                      <div style={{ fontSize:'11px', color:'#5A6478' }}>{p.producto.slice(0,35)}... · {p.ciudad}</div>
                    </div>
                    <div style={{ fontSize:'13px', fontWeight:'700', color:'#E8EDF5', marginRight:'8px' }}>${p.pvp.toLocaleString('es-CO')}</div>
                    <button onClick={() => abrirWA(p)}
                      style={{ padding:'6px 14px', background:'#25D366', border:'none', borderRadius:'8px', color:'#fff', cursor:'pointer', fontSize:'12px', fontWeight:'700', flexShrink:0, display:'flex', alignItems:'center', gap:'5px' }}>
                      💬 Enviar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB LOTES */}
      {tab === 'lotes' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div style={{ ...s, overflow:'hidden' }}>
            <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <span style={{ fontWeight:'700' }}>Seleccionar pedidos</span>
                <span style={{ marginLeft:'8px', fontSize:'12px', color:'#5A6478' }}>{seleccionados.length} seleccionados</span>
              </div>
              <button onClick={selectAll}
                style={{ padding:'5px 12px', background:'rgba(255,255,255,0.05)', border:'none', borderRadius:'6px', color:'#8B96A8', cursor:'pointer', fontSize:'12px' }}>
                {seleccionados.length === pedidos.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
              </button>
            </div>
            <div style={{ maxHeight:'400px', overflowY:'auto' }}>
              {pedidos.map(p => (
                <div key={p.id} onClick={() => toggleSeleccion(p.id)}
                  style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.03)', cursor:'pointer',
                    background: seleccionados.includes(p.id) ? 'rgba(37,211,102,0.05)' : 'transparent' }}>
                  <input type="checkbox" checked={seleccionados.includes(p.id)} onChange={() => {}} onClick={e => e.stopPropagation()}
                    style={{ width:'15px', height:'15px', accentColor:'#25D366', cursor:'pointer' }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'13px', fontWeight:'600' }}>{p.cliente}</div>
                    <div style={{ fontSize:'11px', color:'#5A6478' }}>{p.telefono} · {p.ciudad}</div>
                  </div>
                  <span style={{ fontSize:'10px', padding:'2px 6px', borderRadius:'4px', background:`${colorEstado[p.estado] || '#8B96A8'}15`, color:colorEstado[p.estado] || '#8B96A8', whiteSpace:'nowrap' }}>
                    {p.estado.replace('_',' ').slice(0,10)}
                  </span>
                  {p.wa_enviado && <span style={{ fontSize:'11px', color:'#25D366' }}>✓</span>}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#25D366', marginBottom:'12px' }}>📤 CONFIGURAR ENVÍO MASIVO</div>
              <div style={{ marginBottom:'12px' }}>
                <label style={{ display:'block', fontSize:'11px', color:'#5A6478', marginBottom:'6px' }}>Plantilla a usar</label>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px' }}>
                  {PLANTILLAS.map(pl => (
                    <button key={pl.id} onClick={() => setPlantillaActiva(pl.id)}
                      style={{ padding:'7px 10px', borderRadius:'7px', border:`1px solid ${plantillaActiva === pl.id ? pl.color : 'rgba(255,255,255,0.06)'}`,
                        background: plantillaActiva === pl.id ? pl.color + '15' : 'transparent',
                        color: plantillaActiva === pl.id ? pl.color : '#8B96A8', cursor:'pointer', fontSize:'11px', textAlign:'left' }}>
                      {pl.emoji} {pl.nombre}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom:'14px' }}>
                <label style={{ display:'block', fontSize:'11px', color:'#5A6478', marginBottom:'6px' }}>Mensaje adicional (opcional)</label>
                <textarea value={msgPersonalizado} onChange={e => setMsgPersonalizado(e.target.value)}
                  placeholder="Agrega un texto personalizado al final del mensaje..."
                  rows={3}
                  style={{ width:'100%', background:'#0A0D14', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color:'#E8EDF5', padding:'8px 10px', fontSize:'12px', outline:'none', resize:'vertical', boxSizing:'border-box' }} />
              </div>

              <div style={{ padding:'12px', background:'rgba(37,211,102,0.06)', borderRadius:'8px', border:'1px solid rgba(37,211,102,0.15)', marginBottom:'14px' }}>
                <div style={{ fontSize:'12px', color:'#25D366', fontWeight:'700', marginBottom:'4px' }}>Resumen del envío</div>
                <div style={{ fontSize:'12px', color:'#8B96A8' }}>
                  • {seleccionados.length} pedidos seleccionados<br/>
                  • Plantilla: {plantilla.nombre}<br/>
                  • Se abre WA para el primero — continúa manualmente
                </div>
              </div>

              <button onClick={enviarLote} disabled={seleccionados.length === 0}
                style={{ width:'100%', padding:'12px', background: seleccionados.length > 0 ? '#25D366' : 'rgba(255,255,255,0.05)',
                  border:'none', borderRadius:'10px', color: seleccionados.length > 0 ? '#fff' : '#5A6478',
                  cursor: seleccionados.length > 0 ? 'pointer' : 'not-allowed', fontSize:'14px', fontWeight:'700' }}>
                💬 Iniciar envío ({seleccionados.length} pedidos)
              </button>
            </div>

            {/* Instrucciones */}
            <div style={{ ...s, padding:'16px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'8px' }}>💡 CÓMO FUNCIONA</div>
              {[
                'Selecciona los pedidos que quieres contactar',
                'Elige la plantilla según el tipo de gestión',
                'Haz clic en "Iniciar envío" — abre WA con el mensaje listo',
                'Envía a cada uno manualmente (evita bloqueos de WA)',
                'El sistema registra quién ya fue contactado',
              ].map((paso, i) => (
                <div key={i} style={{ display:'flex', gap:'8px', marginBottom:'6px', fontSize:'12px', color:'#8B96A8' }}>
                  <span style={{ color:'#25D366', fontWeight:'700', flexShrink:0 }}>{i+1}.</span>
                  <span>{paso}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB SEGUIMIENTO */}
      {tab === 'stats' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div style={{ ...s, overflow:'hidden' }}>
            <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', fontWeight:'700' }}>
              📊 Estado de contactos WA
            </div>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
              <thead>
                <tr style={{ background:'#0A0D14', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                  {['Cliente','Producto','Estado pedido','WA','Fecha WA'].map(h => (
                    <th key={h} style={{ padding:'8px 12px', textAlign:'left', fontSize:'10px', color:'#5A6478', fontWeight:'700' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p, i) => (
                  <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding:'8px 12px', fontWeight:'600', fontSize:'12px' }}>{p.cliente}</td>
                    <td style={{ padding:'8px 12px', fontSize:'11px', color:'#5A6478', maxWidth:'120px' }}>
                      <div style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.producto}</div>
                    </td>
                    <td style={{ padding:'8px 12px' }}>
                      <span style={{ fontSize:'10px', padding:'2px 6px', borderRadius:'4px', background:`${colorEstado[p.estado] || '#8B96A8'}15`, color:colorEstado[p.estado] || '#8B96A8' }}>
                        {p.estado.slice(0,12)}
                      </span>
                    </td>
                    <td style={{ padding:'8px 12px' }}>
                      {p.wa_enviado
                        ? <span style={{ color:'#25D366', fontSize:'12px', fontWeight:'600' }}>✅ Sí</span>
                        : <button onClick={() => abrirWA(p)} style={{ padding:'3px 8px', background:'rgba(37,211,102,0.1)', border:'none', borderRadius:'5px', color:'#25D366', cursor:'pointer', fontSize:'11px' }}>Enviar</button>
                      }
                    </td>
                    <td style={{ padding:'8px 12px', fontSize:'11px', color:'#5A6478' }}>{p.wa_fecha || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#25D366', marginBottom:'14px' }}>📈 RESUMEN DE GESTIÓN WA</div>
              {[
                { label:'Pedidos contactados', value:`${stats.enviados}/${stats.total}`, pct:Math.round(stats.enviados/stats.total*100), color:'#25D366' },
                { label:'Sin contactar', value:`${stats.total-stats.enviados}`, pct:Math.round((stats.total-stats.enviados)/stats.total*100), color:'#F5A623' },
                { label:'Novedades activas', value:`${stats.novedades}`, pct:Math.round(stats.novedades/stats.total*100), color:'#F5A623' },
                { label:'Devoluciones', value:`${stats.devoluciones}`, pct:Math.round(stats.devoluciones/stats.total*100), color:'#F05C5C' },
              ].map((k, i) => (
                <div key={i} style={{ marginBottom:'12px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                    <span style={{ fontSize:'12px', color:'#8B96A8' }}>{k.label}</span>
                    <span style={{ fontSize:'13px', fontWeight:'700', color:k.color }}>{k.value} ({k.pct}%)</span>
                  </div>
                  <div style={{ height:'6px', background:'rgba(255,255,255,0.05)', borderRadius:'3px' }}>
                    <div style={{ height:'6px', width:`${k.pct}%`, background:k.color, borderRadius:'3px' }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'12px' }}>⚡ ACCIONES RÁPIDAS</div>
              {[
                { label:'Contactar todos los pendientes', estado:'PENDIENTE CONFIRMACION', plantilla:'confirmacion', count: pedidos.filter(p=>p.estado==='PENDIENTE CONFIRMACION' && !p.wa_enviado).length },
                { label:'Gestionar novedades', estado:'NOVEDAD', plantilla:'novedad', count: pedidos.filter(p=>p.estado==='NOVEDAD' && !p.wa_enviado).length },
                { label:'Seguimiento en reparto', estado:'EN REPARTO', plantilla:'transito', count: pedidos.filter(p=>p.estado==='EN REPARTO' && !p.wa_enviado).length },
                { label:'Fidelizar entregados', estado:'ENTREGADO', plantilla:'recompra', count: pedidos.filter(p=>p.estado==='ENTREGADO' && !p.wa_enviado).length },
              ].map((accion, i) => (
                <button key={i} onClick={() => { setPlantillaActiva(accion.plantilla); setFiltroEstado(accion.estado); setTab('plantillas') }}
                  style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 12px', marginBottom:'6px',
                    background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'8px', cursor:'pointer', color:'#E8EDF5', transition:'all .12s' }}>
                  <span style={{ fontSize:'12px' }}>{accion.label}</span>
                  <span style={{ fontSize:'11px', fontWeight:'700', padding:'2px 8px', borderRadius:'5px', background:'rgba(37,211,102,0.1)', color:'#25D366' }}>
                    {accion.count} sin contactar
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
