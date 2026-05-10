'use client'
import { useState } from 'react'

type Producto = {
  nombre: string; sku: string; pvp: number; unidades: number
  costo_producto: number; flete_envio: number; pct_dev: number
  fulfillment: number; pct_pub: number; pct_comision: number
  cf_asignado: number; activo: boolean; color: string
}

const PRODUCTOS_BASE: Producto[] = [
  { nombre:'Reloj LED Moda', sku:'reloj-led', pvp:69900, unidades:85, costo_producto:12000, flete_envio:21195, pct_dev:20, fulfillment:1500, pct_pub:20, pct_comision:3, cf_asignado:0, activo:true, color:'#3D8EF0' },
  { nombre:'Reloj Dama Oro Rosa', sku:'reloj-oro', pvp:69900, unidades:72, costo_producto:14000, flete_envio:20695, pct_dev:20, fulfillment:1500, pct_pub:20, pct_comision:3, cf_asignado:0, activo:true, color:'#F5A623' },
  { nombre:'Pendientes Cristal', sku:'pend-cris', pvp:79900, unidades:58, costo_producto:8000, flete_envio:21195, pct_dev:20, fulfillment:1500, pct_pub:20, pct_comision:3, cf_asignado:0, activo:true, color:'#9B6BFF' },
  { nombre:'Reloj Vintage Mujer', sku:'reloj-vint', pvp:89900, unidades:45, costo_producto:18000, flete_envio:33891, pct_dev:20, fulfillment:1500, pct_pub:20, pct_comision:3, cf_asignado:0, activo:true, color:'#2DD4A0' },
  { nombre:'Prótesis Snap-On', sku:'prot-snap', pvp:79900, unidades:62, costo_producto:15000, flete_envio:33891, pct_dev:20, fulfillment:1500, pct_pub:20, pct_comision:3, cf_asignado:0, activo:true, color:'#F05C5C' },
  { nombre:'Anillo Feng Shui', sku:'anillo-feng', pvp:89900, unidades:38, costo_producto:10000, flete_envio:21695, pct_dev:20, fulfillment:1500, pct_pub:20, pct_comision:3, cf_asignado:0, activo:true, color:'#F5A623' },
  { nombre:'Gafas Sol Aviador', sku:'gafas-avi', pvp:69900, unidades:29, costo_producto:9000, flete_envio:20695, pct_dev:20, fulfillment:1500, pct_pub:20, pct_comision:3, cf_asignado:0, activo:true, color:'#3D8EF0' },
  { nombre:'Linterna Táctica LED', sku:'lint-tact', pvp:69900, unidades:22, costo_producto:11000, flete_envio:21847, pct_dev:20, fulfillment:1500, pct_pub:20, pct_comision:3, cf_asignado:0, activo:false, color:'#8B96A8' },
]

const CF_TOTAL = 1159000
const MESES_PROYECCION = ['Sep','Oct','Nov','Dic','Ene','Feb']

function calcProd(p: Producto, cfUnit: number) {
  const ventas = p.pvp * p.unidades
  const costo_prod = p.costo_producto * p.unidades
  const flete_env = p.flete_envio * p.unidades
  const flete_dev = Math.round(p.flete_envio * p.pct_dev / 100) * p.unidades
  const fulfill = p.fulfillment * p.unidades
  const pub = Math.round(p.pvp * p.pct_pub / 100) * p.unidades
  const comision = Math.round(p.pvp * p.pct_comision / 100) * p.unidades
  const cf = cfUnit * p.unidades
  const total_costos = costo_prod + flete_env + flete_dev + fulfill + pub + comision + cf
  const utilidad_bruta = ventas - costo_prod - flete_env - flete_dev - fulfill
  const utilidad_neta = ventas - total_costos
  const margen_bruto = ventas > 0 ? Math.round(utilidad_bruta / ventas * 100) : 0
  const margen_neto = ventas > 0 ? Math.round(utilidad_neta / ventas * 100) : 0
  const ganancia_unit = p.pvp > 0 ? Math.round(utilidad_neta / p.unidades) : 0
  const participacion = 0
  return { ventas, costo_prod, flete_env, flete_dev, fulfill, pub, comision, cf, total_costos, utilidad_bruta, utilidad_neta, margen_bruto, margen_neto, ganancia_unit, participacion }
}

function semG(mg: number) {
  return mg >= 15 ? '#2DD4A0' : mg >= 8 ? '#F5A623' : '#F05C5C'
}
function fmt(n: number) {
  return n >= 1000000 ? `$${(n/1000000).toFixed(1)}M` : n >= 1000 ? `$${Math.round(n/1000)}K` : `$${n}`
}

export default function PYGPage() {
  const [productos, setProductos] = useState<Producto[]>(PRODUCTOS_BASE)
  const [tab, setTab] = useState<'total'|'producto'|'proyeccion'|'mezcla'>('total')
  const [prodSel, setProdSel] = useState<string | null>(null)
  const [crecimiento, setCrecimiento] = useState(8)

  const activos = productos.filter(p => p.activo)
  const totalUnidades = activos.reduce((s,p) => s+p.unidades, 0)
  const cfPorUnidad = totalUnidades > 0 ? Math.round(CF_TOTAL / totalUnidades) : 0

  // P&G total tienda
  const calcTodos = activos.map(p => ({ ...p, ...calcProd(p, cfPorUnidad) }))
  const totalVentas = calcTodos.reduce((s,p) => s+p.ventas, 0)
  const totalCostoProd = calcTodos.reduce((s,p) => s+p.costo_prod, 0)
  const totalFleteEnv = calcTodos.reduce((s,p) => s+p.flete_env, 0)
  const totalFleteDev = calcTodos.reduce((s,p) => s+p.flete_dev, 0)
  const totalFulfill = calcTodos.reduce((s,p) => s+p.fulfill, 0)
  const totalPub = calcTodos.reduce((s,p) => s+p.pub, 0)
  const totalComision = calcTodos.reduce((s,p) => s+p.comision, 0)
  const totalUtilBruta = calcTodos.reduce((s,p) => s+p.utilidad_bruta, 0)
  const totalUtilNeta = calcTodos.reduce((s,p) => s+p.utilidad_neta, 0)
  const totalCostos = calcTodos.reduce((s,p) => s+p.total_costos, 0)
  const margenBrutoTotal = totalVentas > 0 ? Math.round(totalUtilBruta/totalVentas*100) : 0
  const margenNetoTotal = totalVentas > 0 ? Math.round(totalUtilNeta/totalVentas*100) : 0

  // Proyecciones
  const proyecciones = MESES_PROYECCION.map((mes, i) => {
    const factor = Math.pow(1 + crecimiento/100, i+1)
    const ventas_p = Math.round(totalVentas * factor)
    const costos_p = Math.round(totalCostos * factor * 0.97)
    return {
      mes, ventas: ventas_p,
      utilidad_neta: ventas_p - costos_p,
      margen: Math.round((ventas_p - costos_p) / ventas_p * 100),
      unidades: Math.round(totalUnidades * factor)
    }
  })

  const prodActual = prodSel ? calcTodos.find(p => p.sku === prodSel) : null

  const s = (color?: string) => ({
    background: '#111520',
    border: `1px solid ${color ? color+'22' : 'rgba(255,255,255,0.07)'}`,
    borderRadius: '12px'
  })

  return (
    <div style={{ color:'#E8EDF5', fontFamily:'system-ui,sans-serif' }}>

      <div style={{ marginBottom:'20px' }}>
        <h1 style={{ fontSize:'22px', fontWeight:'700', marginBottom:'4px' }}>💰 Estado de Resultados P&G</h1>
        <p style={{ fontSize:'13px', color:'#8B96A8' }}>P&G por producto · Cascada de costos · Proyección 6M · VERIFICAR</p>
      </div>

      {/* KPIs totales */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'8px', marginBottom:'16px' }}>
        {[
          { label:'Ventas brutas', value:fmt(totalVentas), color:'#2DD4A0', icon:'💰' },
          { label:'Total costos', value:fmt(totalCostos), color:'#F05C5C', icon:'💸' },
          { label:'Utilidad bruta', value:fmt(totalUtilBruta), color:semG(margenBrutoTotal), icon:'📊' },
          { label:'Utilidad neta', value:fmt(totalUtilNeta), color:semG(margenNetoTotal), icon:'💎' },
          { label:'Margen bruto', value:`${margenBrutoTotal}%`, color:semG(margenBrutoTotal), icon:'📈' },
          { label:'Margen neto', value:`${margenNetoTotal}%`, color:semG(margenNetoTotal), icon:'🎯' },
        ].map((k,i) => (
          <div key={i} style={{ ...s(k.color), padding:'12px', borderTop:`2px solid ${k.color}` }}>
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
          { key:'total', label:'🏪 P&G Total Tienda' },
          { key:'producto', label:'📦 P&G por Producto' },
          { key:'mezcla', label:'🔀 Mezcla de Productos' },
          { key:'proyeccion', label:'🔮 Proyección 6M' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            style={{ padding:'8px 16px', borderRadius:'9px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'600',
              background: tab === t.key ? '#F5A623' : 'rgba(255,255,255,0.05)',
              color: tab === t.key ? '#0A0D14' : '#8B96A8' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB P&G TOTAL */}
      {tab === 'total' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>

          {/* Cascada visual */}
          <div style={{ ...s(), overflow:'hidden' }}>
            <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', fontWeight:'700' }}>
              💰 Cascada de Costos — Tienda completa
            </div>
            {[
              { concepto:'VENTAS BRUTAS', valor:totalVentas, tipo:'entrada', color:'#E8EDF5' },
              { sep:true },
              { concepto:'(-) Costo de productos', valor:totalCostoProd, tipo:'egreso', color:'#F05C5C', pct:Math.round(totalCostoProd/totalVentas*100) },
              { concepto:'(-) Flete de envío', valor:totalFleteEnv, tipo:'egreso', color:'#F05C5C', pct:Math.round(totalFleteEnv/totalVentas*100) },
              { concepto:'(-) Flete devolución (20%)', valor:totalFleteDev, tipo:'egreso', color:'#F05C5C', pct:Math.round(totalFleteDev/totalVentas*100) },
              { concepto:'(-) Fulfillment', valor:totalFulfill, tipo:'egreso', color:'#F05C5C', pct:Math.round(totalFulfill/totalVentas*100) },
              { concepto:'= UTILIDAD BRUTA', valor:totalUtilBruta, tipo:'subtotal', color:semG(margenBrutoTotal), pct:margenBrutoTotal },
              { sep:true },
              { concepto:'(-) Inversión en publicidad', valor:totalPub, tipo:'variable', color:'#9B6BFF', pct:Math.round(totalPub/totalVentas*100) },
              { concepto:'(-) Comisiones plataforma', valor:totalComision, tipo:'variable', color:'#9B6BFF', pct:Math.round(totalComision/totalVentas*100) },
              { concepto:'(-) Costos fijos del mes', valor:CF_TOTAL, tipo:'fijo', color:'#3D8EF0', pct:Math.round(CF_TOTAL/totalVentas*100) },
              { concepto:'= UTILIDAD NETA', valor:totalUtilNeta, tipo:'resultado', color:semG(margenNetoTotal), pct:margenNetoTotal },
            ].map((row: any, i) => {
              if (row.sep) return <div key={i} style={{ height:'1px', background:'rgba(255,255,255,0.05)', margin:'4px 0' }} />
              return (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'9px 16px',
                  background: row.tipo === 'resultado' ? `${row.color}08` : row.tipo === 'subtotal' ? `${row.color}05` : 'transparent',
                  borderLeft: ['resultado','subtotal'].includes(row.tipo) ? `3px solid ${row.color}` : '3px solid transparent' }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'12px', color: ['resultado','subtotal','entrada'].includes(row.tipo) ? '#E8EDF5' : '#8B96A8',
                      fontWeight: ['resultado','subtotal','entrada'].includes(row.tipo) ? '700' : '400' }}>
                      {row.concepto}
                    </div>
                    {row.pct !== undefined && (
                      <div style={{ display:'flex', alignItems:'center', gap:'6px', marginTop:'3px' }}>
                        <div style={{ height:'3px', width:`${Math.min(Math.abs(row.pct), 100)}%`, maxWidth:'120px', background:row.color, borderRadius:'2px' }} />
                        <span style={{ fontSize:'10px', color:row.color }}>{row.pct}%</span>
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div style={{ fontSize: ['resultado','subtotal'].includes(row.tipo) ? '16px' : '13px', fontWeight:'800', color:row.color }}>
                      {row.tipo === 'entrada' ? '' : row.valor > 0 && !['resultado','subtotal'].includes(row.tipo) ? '-' : ''}
                      ${Math.abs(row.valor).toLocaleString('es-CO')}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Distribución de costos */}
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            <div style={{ ...s(), padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'14px' }}>📊 DISTRIBUCIÓN DE COSTOS SOBRE VENTAS</div>
              {[
                { label:'Costo producto', valor:totalCostoProd, color:'#F05C5C' },
                { label:'Flete envío + dev', valor:totalFleteEnv+totalFleteDev, color:'#F5A623' },
                { label:'Publicidad (20%)', valor:totalPub, color:'#9B6BFF' },
                { label:'Comisiones (3%)', valor:totalComision, color:'#9B6BFF' },
                { label:'Costos fijos', valor:CF_TOTAL, color:'#3D8EF0' },
                { label:'Fulfillment', valor:totalFulfill, color:'#8B96A8' },
              ].map((c, i) => {
                const pct = Math.round(c.valor/totalVentas*100)
                return (
                  <div key={i} style={{ marginBottom:'10px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                      <span style={{ fontSize:'12px', color:'#8B96A8' }}>{c.label}</span>
                      <div style={{ display:'flex', gap:'10px' }}>
                        <span style={{ fontSize:'11px', color:'#5A6478' }}>{pct}%</span>
                        <span style={{ fontSize:'12px', fontWeight:'700', color:c.color }}>{fmt(c.valor)}</span>
                      </div>
                    </div>
                    <div style={{ height:'8px', background:'rgba(255,255,255,0.05)', borderRadius:'4px' }}>
                      <div style={{ height:'8px', width:`${pct*2.5}%`, background:c.color, borderRadius:'4px', maxWidth:'100%' }} />
                    </div>
                  </div>
                )
              })}
              <div style={{ marginTop:'12px', padding:'10px 12px', borderRadius:'8px', background:'rgba(255,255,255,0.02)', display:'flex', justifyContent:'space-between', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize:'12px', color:'#8B96A8' }}>Total costos / Ventas</span>
                <span style={{ fontSize:'14px', fontWeight:'800', color:semG(margenNetoTotal) }}>{Math.round(totalCostos/totalVentas*100)}%</span>
              </div>
            </div>

            {/* Resumen ejecutivo */}
            <div style={{ ...s(), padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#2DD4A0', marginBottom:'12px' }}>📋 RESUMEN EJECUTIVO</div>
              {[
                { label:'Productos activos', value:`${activos.length} de ${productos.length}` },
                { label:'Unidades vendidas total', value:totalUnidades.toLocaleString() },
                { label:'CF por unidad distribuido', value:`$${cfPorUnidad.toLocaleString('es-CO')}` },
                { label:'Ingreso promedio por pedido', value:fmt(totalVentas/totalUnidades) },
                { label:'Ganancia promedio por pedido', value:fmt(totalUtilNeta/totalUnidades) },
                { label:'Punto de equilibrio', value:`${Math.ceil(CF_TOTAL/(totalUtilNeta/totalUnidades+CF_TOTAL/totalUnidades))} pedidos/mes` },
              ].map((k, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize:'12px', color:'#8B96A8' }}>{k.label}</span>
                  <span style={{ fontSize:'13px', fontWeight:'700', color:'#E8EDF5' }}>{k.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB P&G POR PRODUCTO */}
      {tab === 'producto' && (
        <div style={{ display:'grid', gridTemplateColumns: prodActual ? '1fr 380px' : '1fr', gap:'16px' }}>
          <div style={{ ...s(), overflow:'hidden' }}>
            <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', fontWeight:'700' }}>
              📦 P&G por producto — clic para ver detalle
            </div>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
                <thead>
                  <tr style={{ background:'#0A0D14', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                    {['Producto','Unid.','PVP','Ventas','C.Total/u','Util.Bruta','Util.Neta','MB%','MN%','Ganancia/u','Estado'].map(h => (
                      <th key={h} style={{ padding:'9px 10px', textAlign:'left', fontSize:'10px', color:'#5A6478', fontWeight:'700', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {calcTodos.sort((a,b) => b.utilidad_neta-a.utilidad_neta).map((p, i) => (
                    <tr key={i} onClick={() => setProdSel(prodSel === p.sku ? null : p.sku)}
                      style={{ borderBottom:'1px solid rgba(255,255,255,0.03)', cursor:'pointer',
                        background: prodSel === p.sku ? `${p.color}08` : 'transparent' }}
                      onMouseEnter={e => { if(prodSel !== p.sku)(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)' }}
                      onMouseLeave={e => { if(prodSel !== p.sku)(e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                      <td style={{ padding:'9px 10px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                          <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:p.color, flexShrink:0 }} />
                          <span style={{ fontWeight:'600', fontSize:'12px' }}>{p.nombre}</span>
                        </div>
                      </td>
                      <td style={{ padding:'9px 10px', color:'#8B96A8' }}>{p.unidades}</td>
                      <td style={{ padding:'9px 10px', color:'#8B96A8' }}>${p.pvp.toLocaleString('es-CO')}</td>
                      <td style={{ padding:'9px 10px', color:'#E8EDF5', fontWeight:'600' }}>{fmt(p.ventas)}</td>
                      <td style={{ padding:'9px 10px', color:'#F05C5C' }}>${Math.round(p.total_costos/p.unidades).toLocaleString('es-CO')}</td>
                      <td style={{ padding:'9px 10px', color:semG(p.margen_bruto), fontWeight:'600' }}>{fmt(p.utilidad_bruta)}</td>
                      <td style={{ padding:'9px 10px', color:semG(p.margen_neto), fontWeight:'700' }}>{fmt(p.utilidad_neta)}</td>
                      <td style={{ padding:'9px 10px', fontWeight:'700', color:semG(p.margen_bruto) }}>{p.margen_bruto}%</td>
                      <td style={{ padding:'9px 10px', fontWeight:'800', fontSize:'13px', color:semG(p.margen_neto) }}>{p.margen_neto}%</td>
                      <td style={{ padding:'9px 10px', fontWeight:'700', color:semG(p.margen_neto) }}>{fmt(p.ganancia_unit)}</td>
                      <td style={{ padding:'9px 10px' }}>
                        <span style={{ fontSize:'10px', padding:'2px 7px', borderRadius:'5px', fontWeight:'700',
                          background: p.margen_neto >= 15 ? 'rgba(45,212,160,0.1)' : p.margen_neto >= 8 ? 'rgba(245,166,35,0.1)' : 'rgba(240,92,92,0.1)',
                          color: semG(p.margen_neto) }}>
                          {p.margen_neto >= 15 ? '✓ Escalar' : p.margen_neto >= 8 ? '⚠ Revisar' : '✗ Problema'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background:'rgba(245,166,35,0.04)', borderTop:'2px solid rgba(245,166,35,0.2)' }}>
                    <td style={{ padding:'9px 10px', fontWeight:'800', color:'#F5A623' }}>TOTAL TIENDA</td>
                    <td style={{ padding:'9px 10px', color:'#F5A623' }}>{totalUnidades}</td>
                    <td colSpan={2} style={{ padding:'9px 10px', color:'#F5A623', fontWeight:'700' }}>{fmt(totalVentas)}</td>
                    <td colSpan={1} />
                    <td style={{ padding:'9px 10px', color:semG(margenBrutoTotal), fontWeight:'700' }}>{fmt(totalUtilBruta)}</td>
                    <td style={{ padding:'9px 10px', color:semG(margenNetoTotal), fontWeight:'800' }}>{fmt(totalUtilNeta)}</td>
                    <td style={{ padding:'9px 10px', fontWeight:'700', color:semG(margenBrutoTotal) }}>{margenBrutoTotal}%</td>
                    <td style={{ padding:'9px 10px', fontWeight:'800', color:semG(margenNetoTotal) }}>{margenNetoTotal}%</td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Panel detalle producto */}
          {prodActual && (
            <div style={{ ...s(prodActual.color), padding:'20px', position:'sticky', top:'20px', maxHeight:'80vh', overflowY:'auto' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px' }}>
                <div>
                  <div style={{ fontSize:'14px', fontWeight:'800', color:prodActual.color }}>{prodActual.nombre}</div>
                  <div style={{ fontSize:'11px', color:'#5A6478', marginTop:'2px' }}>{prodActual.unidades} unidades · PVP ${prodActual.pvp.toLocaleString('es-CO')}</div>
                </div>
                <button onClick={() => setProdSel(null)} style={{ background:'none', border:'none', color:'#8B96A8', cursor:'pointer', fontSize:'20px' }}>×</button>
              </div>

              {/* Cascada del producto */}
              <div style={{ fontSize:'11px', fontWeight:'700', color:'#5A6478', marginBottom:'8px' }}>P&G POR UNIDAD</div>
              {[
                { label:'PVP (precio venta)', valor:prodActual.pvp, color:'#E8EDF5', entrada:true },
                { label:'(-) Costo producto', valor:prodActual.costo_producto, color:'#F05C5C' },
                { label:'(-) Flete envío', valor:prodActual.flete_envio, color:'#F05C5C' },
                { label:`(-) Flete dev (${prodActual.pct_dev}%)`, valor:Math.round(prodActual.flete_envio*prodActual.pct_dev/100), color:'#F05C5C' },
                { label:'(-) Fulfillment', valor:prodActual.fulfillment, color:'#F05C5C' },
                { label:`(-) Publicidad (${prodActual.pct_pub}%)`, valor:Math.round(prodActual.pvp*prodActual.pct_pub/100), color:'#9B6BFF' },
                { label:`(-) Comisión (${prodActual.pct_comision}%)`, valor:Math.round(prodActual.pvp*prodActual.pct_comision/100), color:'#9B6BFF' },
                { label:'(-) CF / unidad', valor:cfPorUnidad, color:'#3D8EF0' },
                { label:'= GANANCIA NETA / UNIDAD', valor:prodActual.ganancia_unit, color:semG(prodActual.margen_neto), resultado:true },
              ].map((row, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'7px 10px', borderRadius:'6px', marginBottom:'3px',
                  background: row.resultado ? `${row.color}08` : 'rgba(255,255,255,0.02)',
                  borderLeft: row.resultado || row.entrada ? `3px solid ${row.color}` : '3px solid transparent' }}>
                  <span style={{ fontSize:'11px', color: row.resultado || row.entrada ? '#E8EDF5' : '#8B96A8', fontWeight: row.resultado ? '700' : '400' }}>{row.label}</span>
                  <span style={{ fontSize:'12px', fontWeight: row.resultado ? '800' : '600', color:row.color }}>
                    {row.entrada ? '' : row.valor >= 0 && !row.resultado ? '-' : ''}${Math.abs(row.valor).toLocaleString('es-CO')}
                  </span>
                </div>
              ))}

              <div style={{ marginTop:'12px', padding:'12px', borderRadius:'10px', background:`${semG(prodActual.margen_neto)}08`, border:`1px solid ${semG(prodActual.margen_neto)}22` }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                  <span style={{ fontSize:'12px', color:'#8B96A8' }}>Margen neto</span>
                  <span style={{ fontSize:'18px', fontWeight:'800', color:semG(prodActual.margen_neto) }}>{prodActual.margen_neto}%</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontSize:'12px', color:'#8B96A8' }}>Utilidad neta total ({prodActual.unidades}u)</span>
                  <span style={{ fontSize:'14px', fontWeight:'700', color:semG(prodActual.margen_neto) }}>{fmt(prodActual.utilidad_neta)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB MEZCLA */}
      {tab === 'mezcla' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div style={{ ...s(), padding:'20px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#3D8EF0', marginBottom:'14px' }}>🔀 MEZCLA DE PRODUCTOS — Contribución a utilidad</div>
            {calcTodos.sort((a,b) => b.utilidad_neta-a.utilidad_neta).map((p, i) => {
              const pctUtil = totalUtilNeta > 0 ? Math.round(p.utilidad_neta/totalUtilNeta*100) : 0
              const pctVentas = Math.round(p.ventas/totalVentas*100)
              return (
                <div key={i} style={{ marginBottom:'14px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                      <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:p.color }} />
                      <span style={{ fontSize:'12px', fontWeight:'600' }}>{p.nombre}</span>
                    </div>
                    <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
                      <span style={{ fontSize:'11px', color:'#5A6478' }}>{p.unidades}u</span>
                      <span style={{ fontSize:'12px', fontWeight:'700', color:p.color }}>{fmt(p.utilidad_neta)}</span>
                    </div>
                  </div>
                  {/* Barra ventas */}
                  <div style={{ height:'6px', background:'rgba(255,255,255,0.05)', borderRadius:'3px', marginBottom:'3px' }}>
                    <div style={{ height:'6px', width:`${pctVentas}%`, background:p.color, borderRadius:'3px', opacity:0.4 }} />
                  </div>
                  {/* Barra utilidad */}
                  <div style={{ height:'8px', background:'rgba(255,255,255,0.05)', borderRadius:'3px' }}>
                    <div style={{ height:'8px', width:`${Math.max(pctUtil,2)}%`, background:p.color, borderRadius:'3px' }} />
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:'3px', fontSize:'10px', color:'#5A6478' }}>
                    <span>{pctVentas}% de ventas</span>
                    <span style={{ color:p.color, fontWeight:'700' }}>{pctUtil}% de utilidad</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {/* Rankings */}
            <div style={{ ...s(), padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'12px' }}>🏆 RANKING POR UTILIDAD NETA</div>
              {calcTodos.sort((a,b) => b.utilidad_neta-a.utilidad_neta).map((p, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ width:'22px', height:'22px', borderRadius:'6px', background: i < 3 ? '#F5A623' : 'rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'800', color: i < 3 ? '#0A0D14' : '#5A6478', flexShrink:0 }}>
                    {i+1}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'12px', fontWeight:'600' }}>{p.nombre}</div>
                    <div style={{ fontSize:'10px', color:'#5A6478' }}>Margen: {p.margen_neto}%</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:'13px', fontWeight:'800', color:semG(p.margen_neto) }}>{fmt(p.utilidad_neta)}</div>
                    <div style={{ fontSize:'10px', color:'#5A6478' }}>{p.unidades}u</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Alertas mezcla */}
            <div style={{ ...s(), padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#F05C5C', marginBottom:'10px' }}>🚨 ALERTAS DE MEZCLA</div>
              {calcTodos.filter(p => p.margen_neto < 8).map((p, i) => (
                <div key={i} style={{ padding:'10px 12px', background:'rgba(240,92,92,0.06)', borderRadius:'8px', marginBottom:'6px', borderLeft:'3px solid #F05C5C' }}>
                  <div style={{ fontSize:'12px', fontWeight:'700', color:'#F05C5C', marginBottom:'3px' }}>⚠️ {p.nombre}</div>
                  <div style={{ fontSize:'11px', color:'#8B96A8' }}>Margen neto: {p.margen_neto}% — Revisar precio o reducir costos logísticos</div>
                </div>
              ))}
              {calcTodos.filter(p => p.margen_neto >= 15).length > 0 && (
                <div style={{ padding:'10px 12px', background:'rgba(45,212,160,0.06)', borderRadius:'8px', borderLeft:'3px solid #2DD4A0' }}>
                  <div style={{ fontSize:'12px', fontWeight:'700', color:'#2DD4A0', marginBottom:'3px' }}>✅ Productos para escalar</div>
                  <div style={{ fontSize:'11px', color:'#8B96A8' }}>{calcTodos.filter(p=>p.margen_neto>=15).map(p=>p.nombre).join(', ')}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB PROYECCIÓN */}
      {tab === 'proyeccion' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div style={{ ...s(), padding:'20px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#9B6BFF' }}>🔮 PROYECCIÓN 6 MESES</div>
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                <span style={{ fontSize:'11px', color:'#8B96A8' }}>Crecimiento mensual:</span>
                <input type="range" min={0} max={20} value={crecimiento} onChange={e => setCrecimiento(Number(e.target.value))}
                  style={{ width:'80px', accentColor:'#9B6BFF' }} />
                <span style={{ fontSize:'12px', fontWeight:'700', color:'#9B6BFF', width:'30px' }}>{crecimiento}%</span>
              </div>
            </div>

            {/* Gráfico barras proyección */}
            <div style={{ display:'flex', alignItems:'flex-end', gap:'10px', height:'160px', marginBottom:'16px' }}>
              {/* Mes actual */}
              <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', height:'100%' }}>
                <div style={{ fontSize:'10px', color:'#F5A623', marginBottom:'4px', fontWeight:'700' }}>{fmt(totalUtilNeta)}</div>
                <div style={{ flex:1, width:'100%', display:'flex', alignItems:'flex-end' }}>
                  <div style={{ width:'100%', height:`${(totalUtilNeta/proyecciones[5].utilidad_neta)*100}%`, background:'#F5A623', borderRadius:'4px 4px 0 0', minHeight:'4px' }} />
                </div>
                <div style={{ fontSize:'11px', color:'#F5A623', marginTop:'6px', fontWeight:'700' }}>Ago</div>
              </div>
              {proyecciones.map((m, i) => {
                const maxVal = Math.max(totalUtilNeta, ...proyecciones.map(p=>p.utilidad_neta))
                const pct = (m.utilidad_neta/maxVal)*100
                return (
                  <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', height:'100%' }}>
                    <div style={{ fontSize:'10px', color:'#9B6BFF', marginBottom:'4px' }}>{fmt(m.utilidad_neta)}</div>
                    <div style={{ flex:1, width:'100%', display:'flex', alignItems:'flex-end' }}>
                      <div style={{ width:'100%', height:`${pct}%`, background:`rgba(155,107,255,${0.4+i*0.1})`, borderRadius:'4px 4px 0 0', minHeight:'4px' }} />
                    </div>
                    <div style={{ fontSize:'11px', color:'#5A6478', marginTop:'6px' }}>{m.mes}</div>
                  </div>
                )
              })}
            </div>

            {/* Tabla proyección */}
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'11px' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                  {['Mes','Unidades','Ventas','Utilidad Neta','Margen'].map(h => (
                    <th key={h} style={{ padding:'6px 8px', textAlign:'left', fontSize:'10px', color:'#5A6478', fontWeight:'700' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom:'1px solid rgba(245,166,35,0.15)', background:'rgba(245,166,35,0.04)' }}>
                  <td style={{ padding:'7px 8px', fontWeight:'700', color:'#F5A623' }}>Ago (actual)</td>
                  <td style={{ padding:'7px 8px', color:'#8B96A8' }}>{totalUnidades}</td>
                  <td style={{ padding:'7px 8px', color:'#8B96A8' }}>{fmt(totalVentas)}</td>
                  <td style={{ padding:'7px 8px', fontWeight:'700', color:semG(margenNetoTotal) }}>{fmt(totalUtilNeta)}</td>
                  <td style={{ padding:'7px 8px', fontWeight:'700', color:semG(margenNetoTotal) }}>{margenNetoTotal}%</td>
                </tr>
                {proyecciones.map((m, i) => (
                  <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding:'7px 8px', color:'#9B6BFF', fontWeight:'600' }}>{m.mes}</td>
                    <td style={{ padding:'7px 8px', color:'#8B96A8' }}>{m.unidades}</td>
                    <td style={{ padding:'7px 8px', color:'#8B96A8' }}>{fmt(m.ventas)}</td>
                    <td style={{ padding:'7px 8px', fontWeight:'700', color:semG(m.margen) }}>{fmt(m.utilidad_neta)}</td>
                    <td style={{ padding:'7px 8px', fontWeight:'700', color:semG(m.margen) }}>{m.margen}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {/* Resumen proyección */}
            <div style={{ ...s(), padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'12px' }}>📊 RESUMEN PROYECCIÓN 6M</div>
              {[
                { label:'Utilidad acumulada 6M', valor:fmt(proyecciones.reduce((s,p)=>s+p.utilidad_neta,0)), color:'#2DD4A0' },
                { label:'Ventas acumuladas 6M', valor:fmt(proyecciones.reduce((s,p)=>s+p.ventas,0)), color:'#3D8EF0' },
                { label:'Mejor mes proyectado', valor:`${proyecciones[5].mes}: ${fmt(proyecciones[5].utilidad_neta)}`, color:'#9B6BFF' },
                { label:'Crecimiento total 6M', valor:`${Math.round((proyecciones[5].utilidad_neta/totalUtilNeta-1)*100)}%`, color:'#F5A623' },
              ].map((k,i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize:'12px', color:'#8B96A8' }}>{k.label}</span>
                  <span style={{ fontSize:'14px', fontWeight:'800', color:k.color }}>{k.valor}</span>
                </div>
              ))}
            </div>

            {/* Escenarios */}
            <div style={{ ...s(), padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#3D8EF0', marginBottom:'12px' }}>🎯 ESCENARIOS PRÓXIMO MES</div>
              {[
                { nombre:'Pesimista', crecimiento:-5, color:'#F05C5C' },
                { nombre:'Conservador', crecimiento:5, color:'#F5A623' },
                { nombre:'Realista', crecimiento:crecimiento, color:'#3D8EF0' },
                { nombre:'Optimista', crecimiento:15, color:'#2DD4A0' },
              ].map((e, i) => {
                const utilidad_e = Math.round(totalUtilNeta * (1 + e.crecimiento/100))
                const ventas_e = Math.round(totalVentas * (1 + e.crecimiento/100))
                return (
                  <div key={i} style={{ padding:'10px 12px', borderRadius:'8px', marginBottom:'6px', background:`${e.color}08`, borderLeft:`3px solid ${e.color}` }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                      <span style={{ fontSize:'12px', fontWeight:'700', color:e.color }}>{e.nombre} ({e.crecimiento > 0 ? '+' : ''}{e.crecimiento}%)</span>
                      <span style={{ fontSize:'13px', fontWeight:'800', color:e.color }}>{fmt(utilidad_e)}</span>
                    </div>
                    <div style={{ fontSize:'11px', color:'#5A6478' }}>Ventas: {fmt(ventas_e)}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
