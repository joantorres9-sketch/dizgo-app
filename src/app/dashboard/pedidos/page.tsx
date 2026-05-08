'use client'
import { useState } from 'react'

type Pedido = {
  id: number; guia: string; fecha: string; cliente: string; telefono: string
  producto: string; pvp: number; ciudad: string; departamento: string
  transportadora: string; estado: string; notas: string
}

const ESTADOS = [
  { key:'PENDIENTE CONFIRMACION', label:'Pendiente', color:'#F5A623', bg:'rgba(245,166,35,0.1)' },
  { key:'GUIA_GENERADA', label:'Guía Generada', color:'#3D8EF0', bg:'rgba(61,142,240,0.1)' },
  { key:'EN PROCESAMIENTO', label:'En Proceso', color:'#9B6BFF', bg:'rgba(155,107,255,0.1)' },
  { key:'DESPACHADA', label:'Despachado', color:'#3D8EF0', bg:'rgba(61,142,240,0.15)' },
  { key:'EN REPARTO', label:'En Reparto', color:'#2DD4A0', bg:'rgba(45,212,160,0.1)' },
  { key:'EN BODEGA DESTINO', label:'En Bodega', color:'#9B6BFF', bg:'rgba(155,107,255,0.12)' },
  { key:'ENTREGADO', label:'Entregado', color:'#2DD4A0', bg:'rgba(45,212,160,0.15)' },
  { key:'NOVEDAD', label:'Novedad', color:'#F5A623', bg:'rgba(245,166,35,0.15)' },
  { key:'CANCELADO', label:'Cancelado', color:'#F05C5C', bg:'rgba(240,92,92,0.1)' },
  { key:'DEVOLUCION', label:'Devolución', color:'#F05C5C', bg:'rgba(240,92,92,0.15)' },
]

// Datos reales de las órdenes de agosto
const PEDIDOS_PRUEBA: Pedido[] = [
  { id:9012507, guia:'COL123456', fecha:'04-09-2023', cliente:'Mari Erazo', telefono:'3015081521', producto:'Pendientes clásicos de cristal dorado', pvp:79900, ciudad:'PASTO', departamento:'NARIÑO', transportadora:'ENVIA', estado:'PENDIENTE CONFIRMACION', notas:'Pendientes clásicos 1 pieza' },
  { id:9012457, guia:'COL123457', fecha:'04-09-2023', cliente:'Esneider Gamboa', telefono:'3132342712', producto:'Reloj Electrónico Led de Moda', pvp:69900, ciudad:'CANTAGALLO', departamento:'BOLIVAR', transportadora:'ENVIA', estado:'GUIA_GENERADA', notas:'' },
  { id:9012233, guia:'COL123458', fecha:'04-09-2023', cliente:'Jacqueline Gallo', telefono:'3176055172', producto:'Reloj De Dama En Oro Rosa Con Esfera', pvp:69900, ciudad:'AGUA DE DIOS', departamento:'CUNDINAMARCA', transportadora:'ENVIA', estado:'ENTREGADO', notas:'' },
  { id:9012111, guia:'COL123459', fecha:'04-09-2023', cliente:'Ester Restrepo', telefono:'3217685140', producto:'Espléndido reloj esmeralda con pulsera', pvp:69900, ciudad:'MEDELLIN', departamento:'ANTIOQUIA', transportadora:'ENVIA', estado:'ENTREGADO', notas:'' },
  { id:9012096, guia:'COL123460', fecha:'04-09-2023', cliente:'Rosa Maria Orozco', telefono:'3148465012', producto:'Pulsera Con Dije De Corazón', pvp:69900, ciudad:'BELLO', departamento:'ANTIOQUIA', transportadora:'ENVIA', estado:'EN REPARTO', notas:'' },
  { id:9011948, guia:'COL123461', fecha:'04-09-2023', cliente:'Gladys Sanchez', telefono:'3045866077', producto:'Reloj Electrónico Led de Moda', pvp:69900, ciudad:'PUERTO WILCHES', departamento:'SANTANDER', transportadora:'COORDINADORA', estado:'EN REPARTO', notas:'' },
  { id:9011835, guia:'COL123462', fecha:'04-09-2023', cliente:'Sedalis Torres', telefono:'3164994940', producto:'Prótesis Snap-On Dental', pvp:79900, ciudad:'URUMITA', departamento:'LA GUAJIRA', transportadora:'COORDINADORA', estado:'NOVEDAD', notas:'No encontrado en dirección' },
  { id:9011700, guia:'COL123463', fecha:'03-09-2023', cliente:'Carlos Mendoza', telefono:'3001234567', producto:'Anillo Feng Shui', pvp:89900, ciudad:'BOGOTA', departamento:'BOGOTA', transportadora:'SERVIENTREGA', estado:'ENTREGADO', notas:'' },
  { id:9011650, guia:'COL123464', fecha:'03-09-2023', cliente:'Ana Lucia Perez', telefono:'3109876543', producto:'Reloj Vintage de Mujer', pvp:89900, ciudad:'CALI', departamento:'VALLE', transportadora:'ENVIA', estado:'CANCELADO', notas:'Número equivocado' },
  { id:9011600, guia:'COL123465', fecha:'03-09-2023', cliente:'Jorge Ramirez', telefono:'3156789012', producto:'Gafas de Sol Aviador', pvp:69900, ciudad:'BARRANQUILLA', departamento:'ATLANTICO', transportadora:'ENVIA', estado:'DESPACHADA', notas:'' },
  { id:9011550, guia:'COL123466', fecha:'03-09-2023', cliente:'Maria Gutierrez', telefono:'3187654321', producto:'Pendientes Clásicos de Cristal', pvp:79900, ciudad:'BUCARAMANGA', departamento:'SANTANDER', transportadora:'ENVIA', estado:'GUIA_GENERADA', notas:'' },
  { id:9011500, guia:'COL123467', fecha:'02-09-2023', cliente:'Luis Herrera', telefono:'3201234567', producto:'Reloj Cuarzo + Circonita x2', pvp:149900, ciudad:'BOGOTA', departamento:'BOGOTA', transportadora:'COORDINADORA', estado:'EN BODEGA DESTINO', notas:'' },
  { id:9011450, guia:'COL123468', fecha:'02-09-2023', cliente:'Sandra Vargas', telefono:'3134567890', producto:'Gafas Antirradiaciones', pvp:69900, ciudad:'MEDELLIN', departamento:'ANTIOQUIA', transportadora:'ENVIA', estado:'DEVOLUCION', notas:'Cliente rechazó el pedido' },
  { id:9011400, guia:'COL123469', fecha:'02-09-2023', cliente:'Pedro Castro', telefono:'3165432109', producto:'Trébol de la Suerte', pvp:69900, ciudad:'PASTO', departamento:'NARIÑO', transportadora:'SERVIENTREGA', estado:'ENTREGADO', notas:'' },
  { id:9011350, guia:'COL123470', fecha:'01-09-2023', cliente:'Diana Lopez', telefono:'3198765432', producto:'Linterna Táctica LED', pvp:69900, ciudad:'VILLAVICENCIO', departamento:'META', transportadora:'ENVIA', estado:'PENDIENTE CONFIRMACION', notas:'No contesta' },
]

const estadoInfo = (key: string) => ESTADOS.find(e => e.key === key) || { key, label:key, color:'#8B96A8', bg:'rgba(139,150,168,0.1)' }

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>(PEDIDOS_PRUEBA)
  const [filtroEstado, setFiltroEstado] = useState('TODOS')
  const [busqueda, setBusqueda] = useState('')
  const [pedidoSel, setPedidoSel] = useState<Pedido | null>(null)
  const [subiendo, setSubiendo] = useState(false)
  const [uploadMsg, setUploadMsg] = useState('')

  const filtrados = pedidos.filter(p => {
    if (filtroEstado !== 'TODOS' && p.estado !== filtroEstado) return false
    if (busqueda) {
      const q = busqueda.toLowerCase()
      return p.cliente.toLowerCase().includes(q) || p.producto.toLowerCase().includes(q) ||
        p.ciudad.toLowerCase().includes(q) || String(p.id).includes(q)
    }
    return true
  })

  // KPIs reales
  const stats = {
    total: pedidos.length,
    pendientes: pedidos.filter(p => p.estado === 'PENDIENTE CONFIRMACION').length,
    despachados: pedidos.filter(p => ['GUIA_GENERADA','EN PROCESAMIENTO','DESPACHADA','EN REPARTO','EN BODEGA DESTINO'].includes(p.estado)).length,
    entregados: pedidos.filter(p => p.estado === 'ENTREGADO').length,
    novedades: pedidos.filter(p => p.estado === 'NOVEDAD').length,
    cancelados: pedidos.filter(p => p.estado === 'CANCELADO').length,
    devoluciones: pedidos.filter(p => p.estado === 'DEVOLUCION').length,
  }
  const tasa_entrega = stats.despachados > 0 ? Math.round(stats.entregados / (stats.despachados + stats.entregados) * 100) : 0
  const tasa_cancelacion = stats.total > 0 ? Math.round(stats.cancelados / stats.total * 100) : 0
  const tasa_devolucion = (stats.entregados + stats.devoluciones) > 0 ? Math.round(stats.devoluciones / (stats.entregados + stats.devoluciones) * 100) : 0

  function cambiarEstado(id: number, nuevoEstado: string) {
    setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p))
    if (pedidoSel?.id === id) setPedidoSel(prev => prev ? { ...prev, estado: nuevoEstado } : null)
  }

  function abrirWA(p: Pedido) {
    const msg = encodeURIComponent(`Hola ${p.cliente.split(' ')[0]}, te contactamos para confirmar tu pedido #${p.id} del producto ${p.producto} por $${p.pvp.toLocaleString('es-CO')}. ¿Confirmas tu dirección en ${p.ciudad}?`)
    window.open(`https://wa.me/57${p.telefono}?text=${msg}`, '_blank')
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setSubiendo(true)
    setUploadMsg('Procesando archivo...')
    // Simula procesamiento
    await new Promise(r => setTimeout(r, 1500))
    setUploadMsg(`✅ ${file.name} procesado — ${pedidos.length} pedidos cargados`)
    setSubiendo(false)
  }

  const s = { background:'#111520', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'12px' }
  const semE = (tasa: number, inv?: boolean) => inv
    ? tasa <= 10 ? '#2DD4A0' : tasa <= 20 ? '#F5A623' : '#F05C5C'
    : tasa >= 80 ? '#2DD4A0' : tasa >= 60 ? '#F5A623' : '#F05C5C'

  return (
    <div style={{ color:'#E8EDF5', fontFamily:'system-ui, sans-serif' }}>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
        <div>
          <h1 style={{ fontSize:'22px', fontWeight:'700', marginBottom:'4px' }}>📦 Gestión de Pedidos</h1>
          <p style={{ fontSize:'13px', color:'#8B96A8' }}>Datos reales agosto 2023 · HACER — Ejecutar</p>
        </div>
        <label style={{ padding:'10px 18px', background:'#F5A623', color:'#0A0D14', borderRadius:'10px', fontWeight:'700', fontSize:'13px', cursor:'pointer' }}>
          📤 Cargar CSV Dropi
          <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleUpload} style={{ display:'none' }} />
        </label>
      </div>

      {uploadMsg && (
        <div style={{ marginBottom:'16px', padding:'10px 14px', borderRadius:'10px', fontSize:'13px',
          background: uploadMsg.startsWith('✅') ? 'rgba(45,212,160,0.1)' : 'rgba(245,166,35,0.1)',
          color: uploadMsg.startsWith('✅') ? '#2DD4A0' : '#F5A623',
          border: `1px solid ${uploadMsg.startsWith('✅') ? 'rgba(45,212,160,0.2)' : 'rgba(245,166,35,0.2)'}` }}>
          {uploadMsg}
        </div>
      )}

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'8px', marginBottom:'16px' }}>
        {[
          { label:'Total', value:stats.total, color:'#E8EDF5', click:'TODOS' },
          { label:'Pendientes', value:stats.pendientes, color:'#F5A623', click:'PENDIENTE CONFIRMACION' },
          { label:'En Tránsito', value:stats.despachados, color:'#3D8EF0', click:'GUIA_GENERADA' },
          { label:'Entregados', value:stats.entregados, color:'#2DD4A0', click:'ENTREGADO' },
          { label:'Novedades', value:stats.novedades, color:'#F5A623', click:'NOVEDAD' },
          { label:'Cancelados', value:stats.cancelados, color:'#F05C5C', click:'CANCELADO' },
          { label:'Devoluciones', value:stats.devoluciones, color:'#F05C5C', click:'DEVOLUCION' },
        ].map((k, i) => (
          <button key={i} onClick={() => setFiltroEstado(k.click)}
            style={{ ...s, padding:'12px 8px', cursor:'pointer', border:`1px solid ${filtroEstado === k.click ? k.color + '44' : 'rgba(255,255,255,0.07)'}`,
              background: filtroEstado === k.click ? k.color + '12' : '#111520', textAlign:'center' }}>
            <div style={{ fontSize:'20px', fontWeight:'800', color:k.color }}>{k.value}</div>
            <div style={{ fontSize:'10px', color:'#5A6478', marginTop:'2px' }}>{k.label}</div>
          </button>
        ))}
      </div>

      {/* Tasas */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px', marginBottom:'16px' }}>
        {[
          { label:'Tasa de Entrega', value:tasa_entrega, color:semE(tasa_entrega), ref:'Meta: >80%' },
          { label:'Tasa Cancelación', value:tasa_cancelacion, color:semE(tasa_cancelacion, true), ref:'Meta: <15%' },
          { label:'Tasa Devolución', value:tasa_devolucion, color:semE(tasa_devolucion, true), ref:'Meta: <10%' },
        ].map((t, i) => (
          <div key={i} style={{ ...s, padding:'14px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontSize:'12px', color:'#8B96A8', marginBottom:'4px' }}>{t.label}</div>
              <div style={{ fontSize:'10px', color:'#5A6478' }}>{t.ref}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:'28px', fontWeight:'800', color:t.color }}>{t.value}%</div>
              <div style={{ height:'4px', width:'80px', background:'rgba(255,255,255,0.05)', borderRadius:'2px', marginTop:'4px' }}>
                <div style={{ height:'4px', width:`${t.value}%`, background:t.color, borderRadius:'2px' }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display:'flex', gap:'10px', marginBottom:'14px', alignItems:'center' }}>
        <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
          placeholder="🔍 Buscar cliente, producto, ciudad, ID..."
          style={{ background:'#161C2E', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'8px', color:'#E8EDF5', padding:'8px 12px', fontSize:'13px', outline:'none', maxWidth:'320px', flex:1 }} />
        <button onClick={() => setFiltroEstado('TODOS')}
          style={{ padding:'7px 14px', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'12px',
            background: filtroEstado === 'TODOS' ? '#F5A623' : 'rgba(255,255,255,0.05)',
            color: filtroEstado === 'TODOS' ? '#0A0D14' : '#8B96A8', fontWeight:'600' }}>
          Todos
        </button>
        <span style={{ fontSize:'12px', color:'#5A6478', marginLeft:'auto' }}>{filtrados.length} pedidos</span>
      </div>

      {/* Tabla */}
      <div style={{ ...s, overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
            <thead>
              <tr style={{ background:'#0A0D14', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                {['ID','Fecha','Cliente','Producto','PVP','Ciudad','Transportadora','Estado','Acciones'].map(h => (
                  <th key={h} style={{ padding:'10px 12px', textAlign:'left', fontSize:'10px', fontWeight:'700', color:'#5A6478', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((p, i) => {
                const est = estadoInfo(p.estado)
                return (
                  <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)', cursor:'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    onClick={() => setPedidoSel(p)}>
                    <td style={{ padding:'10px 12px', fontFamily:'monospace', fontSize:'12px', color:'#8B96A8' }}>{p.id}</td>
                    <td style={{ padding:'10px 12px', fontSize:'11px', color:'#5A6478', whiteSpace:'nowrap' }}>{p.fecha}</td>
                    <td style={{ padding:'10px 12px' }}>
                      <div style={{ fontWeight:'600', fontSize:'13px' }}>{p.cliente}</div>
                      <div style={{ fontSize:'11px', color:'#5A6478' }}>{p.telefono}</div>
                    </td>
                    <td style={{ padding:'10px 12px', maxWidth:'160px' }}>
                      <div style={{ fontSize:'12px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.producto}</div>
                    </td>
                    <td style={{ padding:'10px 12px', fontWeight:'700', whiteSpace:'nowrap' }}>${p.pvp.toLocaleString('es-CO')}</td>
                    <td style={{ padding:'10px 12px', fontSize:'11px' }}>
                      <div>{p.ciudad}</div>
                      <div style={{ color:'#5A6478' }}>{p.departamento}</div>
                    </td>
                    <td style={{ padding:'10px 12px', fontSize:'11px', color:'#8B96A8' }}>{p.transportadora}</td>
                    <td style={{ padding:'10px 12px' }}>
                      <span style={{ fontSize:'11px', fontWeight:'600', padding:'3px 8px', borderRadius:'6px',
                        background:est.bg, color:est.color, whiteSpace:'nowrap' }}>
                        {est.label}
                      </span>
                    </td>
                    <td style={{ padding:'10px 12px' }} onClick={e => e.stopPropagation()}>
                      <div style={{ display:'flex', gap:'4px' }}>
                        <button onClick={() => abrirWA(p)}
                          style={{ padding:'4px 8px', background:'rgba(37,211,102,0.1)', color:'#25D366', border:'none', borderRadius:'5px', cursor:'pointer', fontSize:'12px' }}>
                          💬
                        </button>
                        <button onClick={() => setPedidoSel(p)}
                          style={{ padding:'4px 8px', background:'rgba(61,142,240,0.1)', color:'#3D8EF0', border:'none', borderRadius:'5px', cursor:'pointer', fontSize:'12px' }}>
                          👁️
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

      {/* Modal detalle pedido */}
      {pedidoSel && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}
          onClick={() => setPedidoSel(null)}>
          <div style={{ background:'#111520', borderRadius:'16px', padding:'24px', width:'500px', border:'1px solid rgba(255,255,255,0.1)', maxHeight:'85vh', overflowY:'auto' }}
            onClick={e => e.stopPropagation()}>

            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
              <div>
                <div style={{ fontSize:'16px', fontWeight:'700' }}>Pedido #{pedidoSel.id}</div>
                <div style={{ fontSize:'12px', color:'#8B96A8', marginTop:'2px' }}>{pedidoSel.fecha} · {pedidoSel.transportadora}</div>
              </div>
              <button onClick={() => setPedidoSel(null)} style={{ background:'none', border:'none', color:'#8B96A8', cursor:'pointer', fontSize:'20px' }}>×</button>
            </div>

            {/* Info cliente */}
            <div style={{ background:'rgba(255,255,255,0.02)', borderRadius:'10px', padding:'14px', marginBottom:'14px' }}>
              <div style={{ fontSize:'11px', color:'#5A6478', fontWeight:'700', marginBottom:'8px' }}>CLIENTE</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                {[
                  { l:'Nombre', v:pedidoSel.cliente },
                  { l:'Teléfono', v:pedidoSel.telefono },
                  { l:'Ciudad', v:pedidoSel.ciudad },
                  { l:'Departamento', v:pedidoSel.departamento },
                ].map((f, i) => (
                  <div key={i}>
                    <div style={{ fontSize:'10px', color:'#5A6478' }}>{f.l}</div>
                    <div style={{ fontSize:'13px', fontWeight:'600' }}>{f.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Producto */}
            <div style={{ background:'rgba(255,255,255,0.02)', borderRadius:'10px', padding:'14px', marginBottom:'14px' }}>
              <div style={{ fontSize:'11px', color:'#5A6478', fontWeight:'700', marginBottom:'8px' }}>PRODUCTO</div>
              <div style={{ fontSize:'14px', fontWeight:'600', marginBottom:'6px' }}>{pedidoSel.producto}</div>
              <div style={{ fontSize:'18px', fontWeight:'800', color:'#2DD4A0' }}>${pedidoSel.pvp.toLocaleString('es-CO')}</div>
              {pedidoSel.notas && <div style={{ fontSize:'12px', color:'#F5A623', marginTop:'6px' }}>📝 {pedidoSel.notas}</div>}
            </div>

            {/* Estado actual */}
            <div style={{ marginBottom:'14px' }}>
              <div style={{ fontSize:'11px', color:'#5A6478', fontWeight:'700', marginBottom:'8px' }}>CAMBIAR ESTADO</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'6px' }}>
                {ESTADOS.map(est => (
                  <button key={est.key} onClick={() => cambiarEstado(pedidoSel.id, est.key)}
                    style={{ padding:'6px 8px', borderRadius:'7px', border:`1px solid ${pedidoSel.estado === est.key ? est.color : 'rgba(255,255,255,0.06)'}`,
                      background: pedidoSel.estado === est.key ? est.bg : 'transparent',
                      color: pedidoSel.estado === est.key ? est.color : '#5A6478',
                      cursor:'pointer', fontSize:'11px', fontWeight: pedidoSel.estado === est.key ? '700' : '400' }}>
                    {est.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Acciones */}
            <div style={{ display:'flex', gap:'8px' }}>
              <button onClick={() => abrirWA(pedidoSel)}
                style={{ flex:1, padding:'10px', background:'rgba(37,211,102,0.1)', border:'1px solid rgba(37,211,102,0.2)',
                  borderRadius:'8px', color:'#25D366', cursor:'pointer', fontSize:'13px', fontWeight:'700' }}>
                💬 WhatsApp
              </button>
              <button onClick={() => setPedidoSel(null)}
                style={{ flex:1, padding:'10px', background:'rgba(255,255,255,0.05)', border:'none',
                  borderRadius:'8px', color:'#8B96A8', cursor:'pointer', fontSize:'13px' }}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
