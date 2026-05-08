'use client'
import { useState } from 'react'

type CostoItem = {
  id: string; concepto: string; cantidad: number; valor_unitario: number; activo: boolean
}
type Categoria = {
  id: string; nombre: string; emoji: string; color: string; items: CostoItem[]
}

const CATEGORIAS_INICIALES: Categoria[] = [
  { id:'personal_op', nombre:'Personal Operativo', emoji:'👥', color:'#3D8EF0', items:[
    { id:'p1', concepto:'Publicista', cantidad:0, valor_unitario:0, activo:false },
    { id:'p2', concepto:'Diseñador Gráfico', cantidad:1, valor_unitario:400000, activo:true },
    { id:'p3', concepto:'Trafficker Digital', cantidad:1, valor_unitario:500000, activo:true },
    { id:'p4', concepto:'Gestor de Novedades', cantidad:0, valor_unitario:0, activo:false },
    { id:'p5', concepto:'Confirmador de Pedidos', cantidad:0, valor_unitario:0, activo:false },
    { id:'p6', concepto:'Empacador', cantidad:0, valor_unitario:0, activo:false },
  ]},
  { id:'administrativos', nombre:'Gastos Administrativos', emoji:'🏢', color:'#9B6BFF', items:[
    { id:'a1', concepto:'Administrador', cantidad:0, valor_unitario:0, activo:false },
    { id:'a2', concepto:'Financiero / Contador', cantidad:0, valor_unitario:0, activo:false },
    { id:'a3', concepto:'Socio 01 (retiro)', cantidad:0, valor_unitario:0, activo:false },
    { id:'a4', concepto:'Socio 02 (retiro)', cantidad:0, valor_unitario:0, activo:false },
  ]},
  { id:'honorarios', nombre:'Honorarios Profesionales', emoji:'⚖️', color:'#F5A623', items:[
    { id:'h1', concepto:'Servicio de Contabilidad', cantidad:0, valor_unitario:0, activo:false },
    { id:'h2', concepto:'Servicio Legal', cantidad:0, valor_unitario:0, activo:false },
    { id:'h3', concepto:'Seguridad & Salud SST', cantidad:0, valor_unitario:0, activo:false },
  ]},
  { id:'servicios', nombre:'Servicios Públicos & Arriendo', emoji:'🔌', color:'#2DD4A0', items:[
    { id:'s1', concepto:'Internet', cantidad:1, valor_unitario:40000, activo:true },
    { id:'s2', concepto:'Paquete Voz-Datos', cantidad:1, valor_unitario:20000, activo:true },
    { id:'s3', concepto:'Energía eléctrica', cantidad:1, valor_unitario:15000, activo:true },
    { id:'s4', concepto:'Agua', cantidad:1, valor_unitario:5000, activo:true },
    { id:'s5', concepto:'Saneamiento', cantidad:1, valor_unitario:5000, activo:true },
    { id:'s6', concepto:'Recolección Basuras', cantidad:1, valor_unitario:2000, activo:true },
    { id:'s7', concepto:'Arriendo / Oficina', cantidad:0, valor_unitario:0, activo:false },
  ]},
  { id:'plataformas', nombre:'Plataformas & Aplicaciones', emoji:'💻', color:'#F05C5C', items:[
    { id:'pl1', concepto:'Hosting & Dominio', cantidad:1, valor_unitario:50000, activo:true },
    { id:'pl2', concepto:'Shopify + Releasit', cantidad:0, valor_unitario:0, activo:false },
    { id:'pl3', concepto:'GemPages (Landing)', cantidad:0, valor_unitario:0, activo:false },
    { id:'pl4', concepto:'Canva Pro', cantidad:1, valor_unitario:26000, activo:true },
    { id:'pl5', concepto:'CapCut Pro', cantidad:1, valor_unitario:28000, activo:true },
    { id:'pl6', concepto:'iCloud / Drive', cantidad:1, valor_unitario:10000, activo:true },
    { id:'pl7', concepto:'Zoom / Meet', cantidad:1, valor_unitario:38000, activo:true },
    { id:'pl8', concepto:'Chat GPT (OpenAI)', cantidad:0, valor_unitario:0, activo:false },
    { id:'pl9', concepto:'WhatsApp API', cantidad:0, valor_unitario:0, activo:false },
    { id:'pl10', concepto:'Pancake / CRM', cantidad:0, valor_unitario:0, activo:false },
    { id:'pl11', concepto:'Linktree / Bio', cantidad:1, valor_unitario:20000, activo:true },
    { id:'pl12', concepto:'Dropkiller / Spy', cantidad:0, valor_unitario:0, activo:false },
  ]},
  { id:'testeos', nombre:'Testeos de Productos', emoji:'🧪', color:'#F5A623', items:[
    { id:'t1', concepto:'Creativos (imágenes/video)', cantidad:0, valor_unitario:0, activo:false },
    { id:'t2', concepto:'Landing de testeo', cantidad:0, valor_unitario:0, activo:false },
    { id:'t3', concepto:'Pauta para testeo', cantidad:0, valor_unitario:0, activo:false },
    { id:'t4', concepto:'Muestra de producto', cantidad:0, valor_unitario:0, activo:false },
  ]},
  { id:'formacion', nombre:'Formación & Mentoría', emoji:'🎓', color:'#9B6BFF', items:[
    { id:'f1', concepto:'Mentoría Facebook/TikTok Ads', cantidad:0, valor_unitario:0, activo:false },
    { id:'f2', concepto:'Mentoría Creativos', cantidad:0, valor_unitario:0, activo:false },
    { id:'f3', concepto:'Mentoría Búsqueda Productos', cantidad:0, valor_unitario:0, activo:false },
    { id:'f4', concepto:'EcommDay / Eventos', cantidad:0, valor_unitario:0, activo:false },
  ]},
]

export default function CostosPage() {
  const [cats, setCats] = useState<Categoria[]>(CATEGORIAS_INICIALES)
  const [pedidosMes, setPedidosMes] = useState(500)
  const [catActiva, setCatActiva] = useState('personal_op')

  const totalCF = cats.reduce((sum, cat) =>
    sum + cat.items.filter(i => i.activo).reduce((s, i) => s + (i.cantidad * i.valor_unitario), 0), 0)
  const cfPorDia = Math.round(totalCF / 30)
  const cfPorPedido = pedidosMes > 0 ? Math.round(totalCF / pedidosMes) : 0

  function toggleItem(catId: string, itemId: string) {
    setCats(prev => prev.map(cat =>
      cat.id !== catId ? cat : {
        ...cat, items: cat.items.map(item =>
          item.id !== itemId ? item : { ...item, activo: !item.activo }
        )
      }
    ))
  }

  function updateItem(catId: string, itemId: string, field: 'cantidad'|'valor_unitario', val: number) {
    setCats(prev => prev.map(cat =>
      cat.id !== catId ? cat : {
        ...cat, items: cat.items.map(item =>
          item.id !== itemId ? item : { ...item, [field]: val }
        )
      }
    ))
  }

  const catActual = cats.find(c => c.id === catActiva)!
  const subtotalCat = catActual.items.filter(i => i.activo).reduce((s, i) => s + i.cantidad * i.valor_unitario, 0)

  const s = (color?: string) => ({
    background: '#111520',
    border: `1px solid ${color ? color + '33' : 'rgba(255,255,255,0.07)'}`,
    borderRadius: '12px'
  })

  const inputN = {
    background: '#0A0D14', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '6px', color: '#E8EDF5', padding: '5px 8px',
    fontSize: '12px', outline: 'none', width: '90px', textAlign: 'right' as const
  }

  return (
    <div style={{ color:'#E8EDF5', fontFamily:'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom:'20px' }}>
        <h1 style={{ fontSize:'22px', fontWeight:'700', marginBottom:'4px' }}>📊 Costos Fijos</h1>
        <p style={{ fontSize:'13px', color:'#8B96A8' }}>Estructura de costos mensuales · Datos reales de la tienda · PLANEAR</p>
      </div>

      {/* KPIs principales */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:'12px', marginBottom:'20px' }}>
        {[
          { label:'Total CF Mensual', value:`$${totalCF.toLocaleString('es-CO')}`, sub:'COP / mes', color:'#F05C5C', icon:'💸' },
          { label:'CF por Día', value:`$${cfPorDia.toLocaleString('es-CO')}`, sub:'COP / día', color:'#F5A623', icon:'📅' },
          { label:'CF por Pedido', value:`$${cfPorPedido.toLocaleString('es-CO')}`, sub:`Con ${pedidosMes} pedidos/mes`, color:'#3D8EF0', icon:'📦' },
          { label:'Pedidos para cubrir CF', value: Math.ceil(totalCF / 20000).toLocaleString('es-CO'), sub:'Con margen $20k/pedido', color:'#2DD4A0', icon:'🎯' },
        ].map((k, i) => (
          <div key={i} style={{ ...s(k.color), padding:'16px', borderTop:`2px solid ${k.color}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
              <span style={{ fontSize:'11px', color:'#8B96A8' }}>{k.label}</span>
              <span>{k.icon}</span>
            </div>
            <div style={{ fontSize:'20px', fontWeight:'800', color:k.color }}>{k.value}</div>
            <div style={{ fontSize:'10px', color:'#5A6478', marginTop:'3px' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Simulador de pedidos */}
      <div style={{ ...s(), padding:'14px 18px', marginBottom:'20px', display:'flex', alignItems:'center', gap:'20px' }}>
        <span style={{ fontSize:'13px', color:'#8B96A8' }}>📦 Simula con pedidos/mes:</span>
        <div style={{ display:'flex', gap:'8px' }}>
          {[100, 200, 300, 500, 1000, 2000].map(n => (
            <button key={n} onClick={() => setPedidosMes(n)}
              style={{ padding:'5px 12px', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:'600',
                background: pedidosMes === n ? '#F5A623' : 'rgba(255,255,255,0.05)',
                color: pedidosMes === n ? '#0A0D14' : '#8B96A8' }}>
              {n.toLocaleString()}
            </button>
          ))}
        </div>
        <span style={{ marginLeft:'auto', fontSize:'13px', color:'#5A6478' }}>
          CF/pedido: <strong style={{ color:'#3D8EF0' }}>${cfPorPedido.toLocaleString('es-CO')}</strong>
        </span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gap:'16px' }}>

        {/* Menú categorías */}
        <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
          {cats.map(cat => {
            const subtotal = cat.items.filter(i => i.activo).reduce((s, i) => s + i.cantidad * i.valor_unitario, 0)
            const activos = cat.items.filter(i => i.activo).length
            return (
              <button key={cat.id} onClick={() => setCatActiva(cat.id)}
                style={{ padding:'10px 12px', borderRadius:'10px', border:`1px solid ${catActiva === cat.id ? cat.color + '44' : 'rgba(255,255,255,0.06)'}`,
                  background: catActiva === cat.id ? cat.color + '12' : '#111520',
                  cursor:'pointer', textAlign:'left', transition:'all .15s' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'4px' }}>
                  <span style={{ fontSize:'14px' }}>{cat.emoji}</span>
                  <span style={{ fontSize:'12px', fontWeight:'600', color: catActiva === cat.id ? cat.color : '#E8EDF5' }}>{cat.nombre}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontSize:'10px', color:'#5A6478' }}>{activos} activos</span>
                  <span style={{ fontSize:'11px', fontWeight:'700', color: subtotal > 0 ? cat.color : '#5A6478' }}>
                    {subtotal > 0 ? `$${subtotal.toLocaleString('es-CO')}` : '$0'}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Tabla de items */}
        <div style={{ ...s(catActual.color), overflow:'hidden' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <span style={{ fontSize:'16px', marginRight:'8px' }}>{catActual.emoji}</span>
              <span style={{ fontWeight:'700', color: catActual.color }}>{catActual.nombre}</span>
            </div>
            <span style={{ fontSize:'14px', fontWeight:'800', color: catActual.color }}>
              Subtotal: ${subtotalCat.toLocaleString('es-CO')}
            </span>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                <th style={{ padding:'8px 16px', textAlign:'left', fontSize:'10px', color:'#5A6478', fontWeight:'700' }}>ACTIVO</th>
                <th style={{ padding:'8px 16px', textAlign:'left', fontSize:'10px', color:'#5A6478', fontWeight:'700' }}>CONCEPTO</th>
                <th style={{ padding:'8px 16px', textAlign:'right', fontSize:'10px', color:'#5A6478', fontWeight:'700' }}>CANTIDAD</th>
                <th style={{ padding:'8px 16px', textAlign:'right', fontSize:'10px', color:'#5A6478', fontWeight:'700' }}>VALOR UNIT.</th>
                <th style={{ padding:'8px 16px', textAlign:'right', fontSize:'10px', color:'#5A6478', fontWeight:'700' }}>TOTAL MES</th>
              </tr>
            </thead>
            <tbody>
              {catActual.items.map(item => (
                <tr key={item.id} style={{
                  borderBottom:'1px solid rgba(255,255,255,0.03)',
                  background: item.activo ? 'rgba(255,255,255,0.01)' : 'transparent',
                  opacity: item.activo ? 1 : 0.5
                }}>
                  <td style={{ padding:'8px 16px' }}>
                    <input type="checkbox" checked={item.activo}
                      onChange={() => toggleItem(catActual.id, item.id)}
                      style={{ width:'15px', height:'15px', cursor:'pointer', accentColor: catActual.color }} />
                  </td>
                  <td style={{ padding:'8px 16px', fontWeight: item.activo ? '500' : '400', color: item.activo ? '#E8EDF5' : '#5A6478' }}>
                    {item.concepto}
                  </td>
                  <td style={{ padding:'8px 16px', textAlign:'right' }}>
                    <input type="number" value={item.cantidad} min={0}
                      onChange={e => updateItem(catActual.id, item.id, 'cantidad', Number(e.target.value))}
                      disabled={!item.activo}
                      style={{ ...inputN, opacity: item.activo ? 1 : 0.4 }} />
                  </td>
                  <td style={{ padding:'8px 16px', textAlign:'right' }}>
                    <input type="number" value={item.valor_unitario} min={0}
                      onChange={e => updateItem(catActual.id, item.id, 'valor_unitario', Number(e.target.value))}
                      disabled={!item.activo}
                      style={{ ...inputN, width:'110px', opacity: item.activo ? 1 : 0.4 }} />
                  </td>
                  <td style={{ padding:'8px 16px', textAlign:'right', fontWeight:'700',
                    color: item.activo && item.cantidad * item.valor_unitario > 0 ? catActual.color : '#5A6478' }}>
                    {item.activo ? `$${(item.cantidad * item.valor_unitario).toLocaleString('es-CO')}` : '$0'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resumen total por categoría */}
      <div style={{ ...s(), padding:'16px', marginTop:'16px' }}>
        <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'12px' }}>📊 RESUMEN POR CATEGORÍA</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'10px' }}>
          {cats.map(cat => {
            const sub = cat.items.filter(i => i.activo).reduce((s, i) => s + i.cantidad * i.valor_unitario, 0)
            const pct = totalCF > 0 ? Math.round(sub/totalCF*100) : 0
            return (
              <div key={cat.id} style={{ background:'rgba(255,255,255,0.02)', borderRadius:'8px', padding:'10px 12px' }}>
                <div style={{ fontSize:'10px', color:'#5A6478', marginBottom:'4px' }}>{cat.emoji} {cat.nombre}</div>
                <div style={{ fontSize:'14px', fontWeight:'700', color: sub > 0 ? cat.color : '#5A6478' }}>
                  ${sub.toLocaleString('es-CO')}
                </div>
                <div style={{ marginTop:'5px', height:'3px', background:'rgba(255,255,255,0.06)', borderRadius:'2px' }}>
                  <div style={{ height:'3px', background:cat.color, borderRadius:'2px', width:`${pct}%` }} />
                </div>
                <div style={{ fontSize:'10px', color:'#5A6478', marginTop:'3px' }}>{pct}% del total</div>
              </div>
            )
          })}
        </div>
        <div style={{ marginTop:'14px', padding:'12px 16px', background:'rgba(240,92,92,0.06)', borderRadius:'10px', border:'1px solid rgba(240,92,92,0.2)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:'13px', fontWeight:'700', color:'#E8EDF5' }}>TOTAL COSTOS FIJOS MENSUALES</div>
            <div style={{ fontSize:'11px', color:'#8B96A8', marginTop:'2px' }}>Estos costos existen aunque no vendas un solo producto</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:'26px', fontWeight:'800', color:'#F05C5C' }}>${totalCF.toLocaleString('es-CO')}</div>
            <div style={{ fontSize:'12px', color:'#8B96A8' }}>COP / mes</div>
          </div>
        </div>
      </div>
    </div>
  )
}
