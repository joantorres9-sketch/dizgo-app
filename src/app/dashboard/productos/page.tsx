'use client'
import { useState, useEffect } from 'react'

type Producto = {
  id: string
  nombre: string
  sku: string
  estado: 'activo' | 'inactivo' | 'temporada'
  pvp: number
  costo_proveedor: number
  costo_flete_envio: number
  costo_flete_dev: number
  costo_fulfillment: number
  pct_publicidad: number
  pct_comision: number
  margen_neto: number
  es_combo: boolean
}

// Productos de prueba con datos reales de las tiendas
const PRODUCTOS_PRUEBA: Producto[] = [
  { id:'1', nombre:'Reloj Electrónico Led de Moda', sku:'reloj-led-001', estado:'activo', pvp:69900, costo_proveedor:12000, costo_flete_envio:21195, costo_flete_dev:4239, costo_fulfillment:1500, pct_publicidad:20, pct_comision:3, margen_neto:0, es_combo:false },
  { id:'2', nombre:'Reloj De Dama En Oro Rosa Con Esfera', sku:'reloj-oro-002', estado:'activo', pvp:69900, costo_proveedor:14000, costo_flete_envio:20695, costo_flete_dev:4139, costo_fulfillment:1500, pct_publicidad:20, pct_comision:3, margen_neto:0, es_combo:false },
  { id:'3', nombre:'Pendientes Clásicos de Cristal Dorado', sku:'pend-cris-003', estado:'activo', pvp:79900, costo_proveedor:8000, costo_flete_envio:21195, costo_flete_dev:4239, costo_fulfillment:1500, pct_publicidad:20, pct_comision:3, margen_neto:0, es_combo:false },
  { id:'4', nombre:'Reloj Vintage de Mujer', sku:'reloj-vint-004', estado:'activo', pvp:89900, costo_proveedor:18000, costo_flete_envio:33891, costo_flete_dev:6778, costo_fulfillment:1500, pct_publicidad:20, pct_comision:3, margen_neto:0, es_combo:false },
  { id:'5', nombre:'Prótesis Snap-On Dental', sku:'prot-snap-005', estado:'activo', pvp:79900, costo_proveedor:15000, costo_flete_envio:33891, costo_flete_dev:6778, costo_fulfillment:1500, pct_publicidad:20, pct_comision:3, margen_neto:0, es_combo:false },
  { id:'6', nombre:'Gafas de Sol Aviador', sku:'gafas-avi-006', estado:'activo', pvp:69900, costo_proveedor:9000, costo_flete_envio:20695, costo_flete_dev:4139, costo_fulfillment:1500, pct_publicidad:20, pct_comision:3, margen_neto:0, es_combo:false },
  { id:'7', nombre:'Anillo Feng Shui', sku:'anillo-feng-007', estado:'activo', pvp:89900, costo_proveedor:10000, costo_flete_envio:21695, costo_flete_dev:4339, costo_fulfillment:1500, pct_publicidad:20, pct_comision:3, margen_neto:0, es_combo:false },
  { id:'8', nombre:'Pulsera Con Dije De Corazón', sku:'puls-dije-008', estado:'activo', pvp:69900, costo_proveedor:7000, costo_flete_envio:16955, costo_flete_dev:3391, costo_fulfillment:1500, pct_publicidad:20, pct_comision:3, margen_neto:0, es_combo:false },
  { id:'9', nombre:'Linterna Táctica LED', sku:'lint-tact-009', estado:'activo', pvp:69900, costo_proveedor:11000, costo_flete_envio:21847, costo_flete_dev:4369, costo_fulfillment:1500, pct_publicidad:20, pct_comision:3, margen_neto:0, es_combo:false },
  { id:'10', nombre:'HADAS VOLADORAS Edición Mágica', sku:'hadas-vol-010', estado:'temporada', pvp:69900, costo_proveedor:13000, costo_flete_envio:38195, costo_flete_dev:7639, costo_fulfillment:1500, pct_publicidad:20, pct_comision:3, margen_neto:0, es_combo:false },
  { id:'11', nombre:'Gafas de Lectura Doble Uso', sku:'gafas-lec-011', estado:'activo', pvp:79900, costo_proveedor:12000, costo_flete_envio:21847, costo_flete_dev:4369, costo_fulfillment:1500, pct_publicidad:20, pct_comision:3, margen_neto:0, es_combo:false },
  { id:'12', nombre:'Trébol de la Suerte + Cadena', sku:'trebol-sue-012', estado:'activo', pvp:69900, costo_proveedor:8000, costo_flete_envio:21847, costo_flete_dev:4369, costo_fulfillment:1500, pct_publicidad:20, pct_comision:3, margen_neto:0, es_combo:false },
  { id:'13', nombre:'Reloj Cuarzo + Circonita x2', sku:'reloj-cir-013', estado:'activo', pvp:149900, costo_proveedor:24000, costo_flete_envio:38195, costo_flete_dev:7639, costo_fulfillment:2500, pct_publicidad:20, pct_comision:3, margen_neto:0, es_combo:true },
  { id:'14', nombre:'Pendientes Colibrí', sku:'pend-col-014', estado:'inactivo', pvp:69900, costo_proveedor:9000, costo_flete_envio:20695, costo_flete_dev:4139, costo_fulfillment:1500, pct_publicidad:20, pct_comision:3, margen_neto:0, es_combo:false },
  { id:'15', nombre:'Anillo San Benito Acero', sku:'anillo-ben-015', estado:'activo', pvp:69900, costo_proveedor:8500, costo_flete_envio:20695, costo_flete_dev:4139, costo_fulfillment:1500, pct_publicidad:20, pct_comision:3, margen_neto:0, es_combo:false },
]

// Calcular margen neto real
function calcularMargen(p: Producto): number {
  const costos_directos = p.costo_proveedor + p.costo_flete_envio + p.costo_flete_dev + p.costo_fulfillment
  const publicidad = p.pvp * (p.pct_publicidad / 100)
  const comision = p.pvp * (p.pct_comision / 100)
  const total_costos = costos_directos + publicidad + comision
  const ganancia = p.pvp - total_costos
  return Math.round((ganancia / p.pvp) * 100 * 10) / 10
}

function semaforo(margen: number): string {
  if (margen >= 15) return '#2DD4A0'
  if (margen >= 8) return '#F5A623'
  return '#F05C5C'
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>(
    PRODUCTOS_PRUEBA.map(p => ({ ...p, margen_neto: calcularMargen(p) }))
  )
  const [filtro, setFiltro] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [vista, setVista] = useState<'tabla' | 'cards'>('tabla')
  const [modalAgregar, setModalAgregar] = useState(false)
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null)

  const filtrados = productos.filter(p => {
    if (filtro !== 'todos' && p.estado !== filtro) return false
    if (busqueda && !p.nombre.toLowerCase().includes(busqueda.toLowerCase())) return false
    return true
  })

  const stats = {
    activos: productos.filter(p => p.estado === 'activo').length,
    inactivos: productos.filter(p => p.estado === 'inactivo').length,
    temporada: productos.filter(p => p.estado === 'temporada').length,
    combos: productos.filter(p => p.es_combo).length,
    margen_prom: Math.round(productos.reduce((a, p) => a + p.margen_neto, 0) / productos.length * 10) / 10,
  }

  const s = { background: '#111520', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px' }
  const input = { background: '#161C2E', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#E8EDF5', padding: '8px 12px', fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' as const }

  return (
    <div style={{ color: '#E8EDF5', fontFamily: 'system-ui, sans-serif', maxWidth: '100%' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
        <div>
          <h1 style={{ fontSize:'22px', fontWeight:'700', marginBottom:'4px' }}>🛍️ Catálogo de Productos</h1>
          <p style={{ fontSize:'13px', color:'#8B96A8' }}>Núcleo del negocio · Todo el costeo nace de aquí · PLANEAR</p>
        </div>
        <button onClick={() => setModalAgregar(true)}
          style={{ padding:'10px 20px', background:'#F5A623', color:'#0A0D14', border:'none', borderRadius:'10px', fontWeight:'700', fontSize:'13px', cursor:'pointer' }}>
          + Agregar Producto
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'10px', marginBottom:'20px' }}>
        {[
          { label:'Activos', value: stats.activos, color:'#2DD4A0', icon:'✅' },
          { label:'Inactivos', value: stats.inactivos, color:'#F05C5C', icon:'⏸️' },
          { label:'Temporada', value: stats.temporada, color:'#9B6BFF', icon:'📅' },
          { label:'Combos', value: stats.combos, color:'#3D8EF0', icon:'📦' },
          { label:'Margen Prom.', value: stats.margen_prom + '%', color: semaforo(stats.margen_prom), icon:'💹' },
        ].map((k, i) => (
          <div key={i} style={{ ...s, padding:'14px', borderTop:`2px solid ${k.color}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
              <span style={{ fontSize:'11px', color:'#8B96A8' }}>{k.label}</span>
              <span style={{ fontSize:'16px' }}>{k.icon}</span>
            </div>
            <div style={{ fontSize:'22px', fontWeight:'800', color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Filtros y búsqueda */}
      <div style={{ display:'flex', gap:'10px', marginBottom:'16px', alignItems:'center' }}>
        <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
          placeholder="🔍 Buscar producto..."
          style={{ ...input, maxWidth:'280px' }} />
        <div style={{ display:'flex', gap:'6px' }}>
          {['todos','activo','inactivo','temporada'].map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              style={{ padding:'6px 14px', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:'600',
                background: filtro === f ? '#F5A623' : 'rgba(255,255,255,0.05)',
                color: filtro === f ? '#0A0D14' : '#8B96A8' }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ marginLeft:'auto', display:'flex', gap:'6px' }}>
          {['tabla','cards'].map(v => (
            <button key={v} onClick={() => setVista(v as any)}
              style={{ padding:'6px 12px', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'12px',
                background: vista === v ? '#F5A623' : 'rgba(255,255,255,0.05)',
                color: vista === v ? '#0A0D14' : '#8B96A8' }}>
              {v === 'tabla' ? '☰' : '⊞'}
            </button>
          ))}
        </div>
        <span style={{ fontSize:'12px', color:'#5A6478' }}>{filtrados.length} productos</span>
      </div>

      {/* Vista Tabla */}
      {vista === 'tabla' && (
        <div style={{ ...s, overflow:'hidden' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
              <thead>
                <tr style={{ background:'#0A0D14', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                  {['Producto','SKU','Estado','PVP','C.Proveedor','C.Flete','Fulfill','% Pauta','Margen','Acción'].map(h => (
                    <th key={h} style={{ padding:'10px 12px', textAlign:'left', fontSize:'11px', fontWeight:'700', color:'#5A6478', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map((p, i) => {
                  const mg = calcularMargen(p)
                  return (
                    <tr key={p.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding:'10px 12px' }}>
                        <div style={{ fontWeight:'600', fontSize:'13px' }}>
                          {p.es_combo && <span style={{ fontSize:'10px', background:'rgba(61,142,240,0.15)', color:'#3D8EF0', padding:'1px 6px', borderRadius:'4px', marginRight:'6px' }}>COMBO</span>}
                          {p.nombre}
                        </div>
                      </td>
                      <td style={{ padding:'10px 12px', color:'#5A6478', fontSize:'11px', fontFamily:'monospace' }}>{p.sku}</td>
                      <td style={{ padding:'10px 12px' }}>
                        <span style={{ fontSize:'11px', fontWeight:'600', padding:'2px 8px', borderRadius:'6px',
                          background: p.estado === 'activo' ? 'rgba(45,212,160,0.1)' : p.estado === 'temporada' ? 'rgba(155,107,255,0.1)' : 'rgba(240,92,92,0.1)',
                          color: p.estado === 'activo' ? '#2DD4A0' : p.estado === 'temporada' ? '#9B6BFF' : '#F05C5C' }}>
                          {p.estado}
                        </span>
                      </td>
                      <td style={{ padding:'10px 12px', fontWeight:'700', color:'#E8EDF5' }}>${p.pvp.toLocaleString('es-CO')}</td>
                      <td style={{ padding:'10px 12px', color:'#8B96A8' }}>${p.costo_proveedor.toLocaleString('es-CO')}</td>
                      <td style={{ padding:'10px 12px', color:'#8B96A8' }}>${p.costo_flete_envio.toLocaleString('es-CO')}</td>
                      <td style={{ padding:'10px 12px', color:'#8B96A8' }}>${p.costo_fulfillment.toLocaleString('es-CO')}</td>
                      <td style={{ padding:'10px 12px', color:'#8B96A8' }}>{p.pct_publicidad}%</td>
                      <td style={{ padding:'10px 12px' }}>
                        <span style={{ fontWeight:'800', color: semaforo(mg), fontSize:'14px' }}>{mg}%</span>
                      </td>
                      <td style={{ padding:'10px 12px' }}>
                        <button onClick={() => setProductoEditar(p)}
                          style={{ padding:'4px 10px', background:'rgba(61,142,240,0.1)', color:'#3D8EF0', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'11px' }}>
                          Editar
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vista Cards */}
      {vista === 'cards' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px' }}>
          {filtrados.map(p => {
            const mg = calcularMargen(p)
            const costos = p.costo_proveedor + p.costo_flete_envio + p.costo_flete_dev + p.costo_fulfillment
            const pub = p.pvp * (p.pct_publicidad/100)
            const ganancia = p.pvp - costos - pub - (p.pvp * p.pct_comision/100)
            return (
              <div key={p.id} style={{ ...s, padding:'16px', borderTop:`2px solid ${semaforo(mg)}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'10px' }}>
                  <div>
                    {p.es_combo && <div style={{ fontSize:'10px', color:'#3D8EF0', fontWeight:'700', marginBottom:'3px' }}>COMBO</div>}
                    <div style={{ fontWeight:'700', fontSize:'13px', lineHeight:'1.3' }}>{p.nombre}</div>
                    <div style={{ fontSize:'11px', color:'#5A6478', marginTop:'2px', fontFamily:'monospace' }}>{p.sku}</div>
                  </div>
                  <span style={{ fontSize:'11px', fontWeight:'600', padding:'2px 8px', borderRadius:'6px', flexShrink:0,
                    background: p.estado === 'activo' ? 'rgba(45,212,160,0.1)' : p.estado === 'temporada' ? 'rgba(155,107,255,0.1)' : 'rgba(240,92,92,0.1)',
                    color: p.estado === 'activo' ? '#2DD4A0' : p.estado === 'temporada' ? '#9B6BFF' : '#F05C5C' }}>
                    {p.estado}
                  </span>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px', marginBottom:'10px' }}>
                  {[
                    { l:'PVP', v:`$${p.pvp.toLocaleString('es-CO')}`, c:'#E8EDF5' },
                    { l:'Proveedor', v:`$${p.costo_proveedor.toLocaleString('es-CO')}`, c:'#8B96A8' },
                    { l:'Flete', v:`$${p.costo_flete_envio.toLocaleString('es-CO')}`, c:'#8B96A8' },
                    { l:'Ganancia', v:`$${Math.round(ganancia).toLocaleString('es-CO')}`, c: ganancia > 0 ? '#2DD4A0' : '#F05C5C' },
                  ].map((item, j) => (
                    <div key={j} style={{ background:'rgba(255,255,255,0.02)', borderRadius:'6px', padding:'6px 8px' }}>
                      <div style={{ fontSize:'10px', color:'#5A6478' }}>{item.l}</div>
                      <div style={{ fontSize:'13px', fontWeight:'700', color:item.c }}>{item.v}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <span style={{ fontSize:'11px', color:'#5A6478' }}>Margen neto: </span>
                    <span style={{ fontWeight:'800', color: semaforo(mg), fontSize:'16px' }}>{mg}%</span>
                  </div>
                  <button onClick={() => setProductoEditar(p)}
                    style={{ padding:'5px 12px', background:'rgba(61,142,240,0.1)', color:'#3D8EF0', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'11px' }}>
                    Ver costeo
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Leyenda semáforo */}
      <div style={{ display:'flex', gap:'16px', marginTop:'16px', padding:'10px 14px', background:'#111520', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.05)' }}>
        <span style={{ fontSize:'12px', color:'#5A6478' }}>Semáforo de margen:</span>
        {[
          { color:'#2DD4A0', label:'≥15% Saludable' },
          { color:'#F5A623', label:'8-14% Atención' },
          { color:'#F05C5C', label:'<8% Crítico' },
        ].map((s, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:'5px' }}>
            <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:s.color }} />
            <span style={{ fontSize:'11px', color:'#8B96A8' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Modal editar producto - costeo detallado */}
      {productoEditar && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <div style={{ background:'#111520', borderRadius:'16px', padding:'24px', width:'520px', maxHeight:'85vh', overflowY:'auto', border:'1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
              <div>
                <h3 style={{ fontSize:'16px', fontWeight:'700', marginBottom:'4px' }}>{productoEditar.nombre}</h3>
                <p style={{ fontSize:'12px', color:'#8B96A8' }}>Costeo completo ABC · PLANEAR</p>
              </div>
              <button onClick={() => setProductoEditar(null)}
                style={{ background:'none', border:'none', color:'#8B96A8', cursor:'pointer', fontSize:'20px' }}>×</button>
            </div>

            {/* Cascada de costos */}
            <div style={{ marginBottom:'16px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'8px' }}>ESTRUCTURA DE COSTOS ABC</div>
              {[
                { label:'PVP (Precio de Venta)', value: productoEditar.pvp, color:'#E8EDF5', bold:true },
                { label:'(-) Costo Proveedor', value: -productoEditar.costo_proveedor, color:'#F05C5C' },
                { label:'(-) Flete Envío', value: -productoEditar.costo_flete_envio, color:'#F05C5C' },
                { label:'(-) Flete Devolución (20%)', value: -productoEditar.costo_flete_dev, color:'#F05C5C' },
                { label:'(-) Fulfillment', value: -productoEditar.costo_fulfillment, color:'#F05C5C' },
                { label:`(-) Publicidad (${productoEditar.pct_publicidad}%)`, value: -Math.round(productoEditar.pvp * productoEditar.pct_publicidad/100), color:'#9B6BFF' },
                { label:`(-) Comisión plataforma (${productoEditar.pct_comision}%)`, value: -Math.round(productoEditar.pvp * productoEditar.pct_comision/100), color:'#9B6BFF' },
              ].map((row, i) => {
                const acum = i === 0 ? productoEditar.pvp :
                  productoEditar.pvp - productoEditar.costo_proveedor - productoEditar.costo_flete_envio -
                  productoEditar.costo_flete_dev - productoEditar.costo_fulfillment -
                  Math.round(productoEditar.pvp * productoEditar.pct_publicidad/100) -
                  (i === 6 ? Math.round(productoEditar.pvp * productoEditar.pct_comision/100) : 0)
                return (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'7px 10px', borderRadius:'6px', marginBottom:'3px', background: i === 0 ? 'rgba(245,166,35,0.06)' : 'rgba(255,255,255,0.02)' }}>
                    <span style={{ fontSize:'12px', color:'#8B96A8' }}>{row.label}</span>
                    <span style={{ fontSize:'13px', fontWeight: row.bold ? '800' : '600', color: row.color }}>
                      {row.value > 0 ? '$' : '-$'}{Math.abs(row.value).toLocaleString('es-CO')}
                    </span>
                  </div>
                )
              })}

              {/* Ganancia final */}
              {(() => {
                const p = productoEditar
                const ganancia = p.pvp - p.costo_proveedor - p.costo_flete_envio - p.costo_flete_dev - p.costo_fulfillment - Math.round(p.pvp*p.pct_publicidad/100) - Math.round(p.pvp*p.pct_comision/100)
                const margen = Math.round(ganancia/p.pvp*100*10)/10
                return (
                  <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 12px', borderRadius:'8px', marginTop:'6px', background: ganancia > 0 ? 'rgba(45,212,160,0.08)' : 'rgba(240,92,92,0.08)', border:`1px solid ${ganancia > 0 ? 'rgba(45,212,160,0.2)' : 'rgba(240,92,92,0.2)'}` }}>
                    <div>
                      <div style={{ fontSize:'12px', color:'#8B96A8' }}>Ganancia neta por pedido entregado</div>
                      <div style={{ fontSize:'10px', color:'#5A6478', marginTop:'2px' }}>Sin costos fijos distribuidos aún</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:'18px', fontWeight:'800', color: ganancia > 0 ? '#2DD4A0' : '#F05C5C' }}>${Math.abs(ganancia).toLocaleString('es-CO')}</div>
                      <div style={{ fontSize:'12px', fontWeight:'700', color: ganancia > 0 ? '#2DD4A0' : '#F05C5C' }}>{margen}% margen</div>
                    </div>
                  </div>
                )
              })()}
            </div>

            <div style={{ display:'flex', gap:'8px' }}>
              <button onClick={() => setProductoEditar(null)}
                style={{ flex:1, padding:'10px', background:'rgba(255,255,255,0.05)', border:'none', borderRadius:'8px', color:'#8B96A8', cursor:'pointer', fontSize:'13px' }}>
                Cerrar
              </button>
              <button style={{ flex:1, padding:'10px', background:'#F5A623', border:'none', borderRadius:'8px', color:'#0A0D14', cursor:'pointer', fontSize:'13px', fontWeight:'700' }}>
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Agregar */}
      {modalAgregar && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <div style={{ background:'#111520', borderRadius:'16px', padding:'24px', width:'480px', border:'1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
              <h3 style={{ fontSize:'16px', fontWeight:'700' }}>Agregar Producto</h3>
              <button onClick={() => setModalAgregar(false)} style={{ background:'none', border:'none', color:'#8B96A8', cursor:'pointer', fontSize:'20px' }}>×</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
              {[
                { label:'Nombre del producto', placeholder:'ej: Reloj LED Mujer', full:true },
                { label:'SKU', placeholder:'reloj-led-001' },
                { label:'PVP (precio venta)', placeholder:'69900' },
                { label:'Costo Proveedor', placeholder:'12000' },
                { label:'Flete Envío', placeholder:'21195' },
                { label:'Fulfillment', placeholder:'1500' },
                { label:'% Publicidad', placeholder:'20' },
                { label:'% Comisión', placeholder:'3' },
              ].map((f, i) => (
                <div key={i} style={{ gridColumn: f.full ? '1/-1' : 'auto' }}>
                  <label style={{ display:'block', fontSize:'12px', color:'#8B96A8', marginBottom:'5px' }}>{f.label}</label>
                  <input placeholder={f.placeholder} style={input} />
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:'8px', marginTop:'16px' }}>
              <button onClick={() => setModalAgregar(false)}
                style={{ flex:1, padding:'10px', background:'rgba(255,255,255,0.05)', border:'none', borderRadius:'8px', color:'#8B96A8', cursor:'pointer' }}>
                Cancelar
              </button>
              <button style={{ flex:1, padding:'10px', background:'#F5A623', border:'none', borderRadius:'8px', color:'#0A0D14', cursor:'pointer', fontWeight:'700' }}>
                Guardar Producto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
