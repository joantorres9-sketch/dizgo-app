'use client'
import { useState } from 'react'

type Producto = {
  nombre: string
  pvp: number
  costo_proveedor: number
  costo_flete_envio: number
  pct_devolucion: number
  costo_fulfillment: number
  pct_publicidad: number
  pct_comision: number
  pct_pasarela: number
  cf_por_pedido: number
}

const PRODUCTOS_BASE: Producto[] = [
  { nombre:'Reloj LED Moda', pvp:69900, costo_proveedor:12000, costo_flete_envio:21195, pct_devolucion:20, costo_fulfillment:1500, pct_publicidad:20, pct_comision:3, pct_pasarela:0, cf_por_pedido:2318 },
  { nombre:'Reloj Dama Oro Rosa', pvp:69900, costo_proveedor:14000, costo_flete_envio:20695, pct_devolucion:20, costo_fulfillment:1500, pct_publicidad:20, pct_comision:3, pct_pasarela:0, cf_por_pedido:2318 },
  { nombre:'Pendientes Cristal', pvp:79900, costo_proveedor:8000, costo_flete_envio:21195, pct_devolucion:20, costo_fulfillment:1500, pct_publicidad:20, pct_comision:3, pct_pasarela:0, cf_por_pedido:2318 },
  { nombre:'Reloj Vintage Mujer', pvp:89900, costo_proveedor:18000, costo_flete_envio:33891, pct_devolucion:20, costo_fulfillment:1500, pct_publicidad:20, pct_comision:3, pct_pasarela:0, cf_por_pedido:2318 },
  { nombre:'Prótesis Snap-On', pvp:79900, costo_proveedor:15000, costo_flete_envio:33891, pct_devolucion:20, costo_fulfillment:1500, pct_publicidad:20, pct_comision:3, pct_pasarela:0, cf_por_pedido:2318 },
  { nombre:'Anillo Feng Shui', pvp:89900, costo_proveedor:10000, costo_flete_envio:21695, pct_devolucion:20, costo_fulfillment:1500, pct_publicidad:20, pct_comision:3, pct_pasarela:0, cf_por_pedido:2318 },
]

function calcular(p: Producto) {
  const flete_dev = Math.round(p.costo_flete_envio * (p.pct_devolucion / 100))
  const fulfill_dev = Math.round(p.costo_fulfillment * (p.pct_devolucion / 100))
  const publicidad = Math.round(p.pvp * (p.pct_publicidad / 100))
  const comision = Math.round(p.pvp * (p.pct_comision / 100))
  const pasarela = Math.round(p.pvp * (p.pct_pasarela / 100))
  const total_costos = p.costo_proveedor + p.costo_flete_envio + flete_dev + p.costo_fulfillment + fulfill_dev + publicidad + comision + pasarela + p.cf_por_pedido
  const ganancia = p.pvp - total_costos
  const margen = Math.round((ganancia / p.pvp) * 100 * 10) / 10
  const cpa_maximo = Math.round(ganancia + publicidad)
  const roi_ads = publicidad > 0 ? Math.round((p.pvp / publicidad) * 100) / 100 : 0
  return { flete_dev, fulfill_dev, publicidad, comision, pasarela, total_costos, ganancia, margen, cpa_maximo, roi_ads }
}

function colorMargen(m: number) {
  if (m >= 15) return '#2DD4A0'
  if (m >= 8) return '#F5A623'
  return '#F05C5C'
}

export default function PrecioPage() {
  const [productos, setProductos] = useState<Producto[]>(PRODUCTOS_BASE)
  const [selIdx, setSelIdx] = useState(0)
  const [tab, setTab] = useState<'costeo'|'inverso'|'comparativo'>('costeo')

  const prod = productos[selIdx]
  const calc = calcular(prod)

  function update(field: keyof Producto, val: number) {
    setProductos(prev => prev.map((p, i) => i === selIdx ? { ...p, [field]: val } : p))
  }

  // Precio inverso: dado el margen deseado, ¿cuál debe ser el PVP?
  const [margenDeseado, setMargenDeseado] = useState(20)
  const costos_fijos_sin_pub = prod.costo_proveedor + prod.costo_flete_envio +
    Math.round(prod.costo_flete_envio * prod.pct_devolucion / 100) +
    prod.costo_fulfillment + Math.round(prod.costo_fulfillment * prod.pct_devolucion / 100) + prod.cf_por_pedido
  const pct_variables = (prod.pct_publicidad + prod.pct_comision + prod.pct_pasarela) / 100
  const pvp_sugerido = margenDeseado < 100
    ? Math.round(costos_fijos_sin_pub / (1 - pct_variables - margenDeseado / 100))
    : 0

  const s = { background: '#111520', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px' }
  const inp = (w?: string) => ({
    background: '#0A0D14', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '7px', color: '#E8EDF5', padding: '7px 10px',
    fontSize: '13px', outline: 'none', width: w || '100%', boxSizing: 'border-box' as const
  })

  return (
    <div style={{ color: '#E8EDF5', fontFamily: 'system-ui, sans-serif' }}>

      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>💡 Precio & Costeo Inverso</h1>
        <p style={{ fontSize: '13px', color: '#8B96A8' }}>Costeo ABC real · Precio mínimo viable · CPA máximo · PLANEAR</p>
      </div>

      {/* Selector de producto */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {productos.map((p, i) => (
          <button key={i} onClick={() => setSelIdx(i)}
            style={{ padding: '7px 14px', borderRadius: '9px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600',
              background: selIdx === i ? '#F5A623' : 'rgba(255,255,255,0.05)',
              color: selIdx === i ? '#0A0D14' : '#8B96A8' }}>
            {p.nombre}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
        {[
          { key: 'costeo', label: '📊 Costeo Real ABC' },
          { key: 'inverso', label: '🔄 Precio Inverso' },
          { key: 'comparativo', label: '📈 Comparativo' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            style={{ padding: '8px 16px', borderRadius: '9px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
              background: tab === t.key ? '#F5A623' : 'rgba(255,255,255,0.05)',
              color: tab === t.key ? '#0A0D14' : '#8B96A8' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB: COSTEO ABC */}
      {tab === 'costeo' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

          {/* Inputs */}
          <div style={{ ...s, padding: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#F5A623', marginBottom: '14px' }}>⚙️ PARÁMETROS DEL PRODUCTO</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { label: 'PVP (Precio de venta)', field: 'pvp' as keyof Producto, prefix: '$' },
                { label: 'Costo Proveedor', field: 'costo_proveedor' as keyof Produto, prefix: '$' },
                { label: 'Costo Flete Envío', field: 'costo_flete_envio' as keyof Produto, prefix: '$' },
                { label: '% Devolución', field: 'pct_devolucion' as keyof Produto, prefix: '%' },
                { label: 'Fulfillment', field: 'costo_fulfillment' as keyof Produto, prefix: '$' },
                { label: '% Publicidad', field: 'pct_publicidad' as keyof Produto, prefix: '%' },
                { label: '% Comisión plataforma', field: 'pct_comision' as keyof Produto, prefix: '%' },
                { label: '% Pasarela de pago', field: 'pct_pasarela' as keyof Produto, prefix: '%' },
                { label: 'CF por pedido', field: 'cf_por_pedido' as keyof Produto, prefix: '$' },
              ].map((item, i) => (
                <div key={i} style={{ gridColumn: i === 0 ? '1/-1' : 'auto' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#5A6478', marginBottom: '4px' }}>{item.label}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '12px', color: '#8B96A8' }}>{item.prefix}</span>
                    <input type="number" value={prod[item.field] as number}
                      onChange={e => update(item.field, Number(e.target.value))}
                      style={inp()} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cascada de costos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

            {/* KPIs principales */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { label: 'PVP', value: `$${prod.pvp.toLocaleString('es-CO')}`, color: '#E8EDF5' },
                { label: 'Total Costos', value: `$${calc.total_costos.toLocaleString('es-CO')}`, color: '#F05C5C' },
                { label: 'Ganancia/pedido', value: `$${calc.ganancia.toLocaleString('es-CO')}`, color: calc.ganancia > 0 ? '#2DD4A0' : '#F05C5C' },
                { label: 'Margen Neto', value: `${calc.margen}%`, color: colorMargen(calc.margen) },
                { label: 'CPA Máximo', value: `$${calc.cpa_maximo.toLocaleString('es-CO')}`, color: '#9B6BFF' },
                { label: 'ROI Ads', value: `${calc.roi_ads}x`, color: calc.roi_ads >= 2 ? '#2DD4A0' : '#F5A623' },
              ].map((k, i) => (
                <div key={i} style={{ ...s, padding: '12px 14px' }}>
                  <div style={{ fontSize: '11px', color: '#5A6478', marginBottom: '4px' }}>{k.label}</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: k.color }}>{k.value}</div>
                </div>
              ))}
            </div>

            {/* Cascada visual */}
            <div style={{ ...s, padding: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#F5A623', marginBottom: '10px' }}>CASCADA DE COSTOS ABC</div>
              {[
                { label: 'PVP', value: prod.pvp, color: '#E8EDF5', tipo: 'entrada' },
                { label: 'Costo Proveedor', value: prod.costo_proveedor, color: '#F05C5C', tipo: 'costo' },
                { label: 'Flete Envío', value: prod.costo_flete_envio, color: '#F05C5C', tipo: 'costo' },
                { label: `Flete Devolución (${prod.pct_devolucion}%)`, value: calc.flete_dev, color: '#F05C5C', tipo: 'costo' },
                { label: 'Fulfillment', value: prod.costo_fulfillment, color: '#F05C5C', tipo: 'costo' },
                { label: `Publicidad (${prod.pct_publicidad}%)`, value: calc.publicidad, color: '#9B6BFF', tipo: 'variable' },
                { label: `Comisión (${prod.pct_comision}%)`, value: calc.comision, color: '#9B6BFF', tipo: 'variable' },
                { label: 'Costos Fijos / pedido', value: prod.cf_por_pedido, color: '#3D8EF0', tipo: 'fijo' },
                { label: 'GANANCIA NETA', value: calc.ganancia, color: colorMargen(calc.margen), tipo: 'resultado' },
              ].map((row, i) => {
                const pct = Math.round(Math.abs(row.value) / prod.pvp * 100)
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px',
                    padding: '6px 8px', borderRadius: '6px',
                    background: row.tipo === 'resultado' ? `${colorMargen(calc.margen)}12` : 'rgba(255,255,255,0.02)',
                    borderLeft: `3px solid ${row.tipo === 'resultado' ? colorMargen(calc.margen) : row.color}` }}>
                    <div style={{ flex: 1, fontSize: '12px', color: row.tipo === 'resultado' ? row.color : '#8B96A8', fontWeight: row.tipo === 'resultado' ? '700' : '400' }}>
                      {row.label}
                    </div>
                    <div style={{ width: '60px', textAlign: 'right', fontSize: '11px', color: '#5A6478' }}>{pct}%</div>
                    <div style={{ width: '90px', textAlign: 'right', fontSize: '13px', fontWeight: '700', color: row.color }}>
                      {row.tipo === 'entrada' ? '' : row.value >= 0 && row.tipo !== 'costo' && row.tipo !== 'variable' && row.tipo !== 'fijo' ? '+' : '-'}
                      ${Math.abs(row.value).toLocaleString('es-CO')}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB: PRECIO INVERSO */}
      {tab === 'inverso' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ ...s, padding: '24px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#3D8EF0', marginBottom: '6px' }}>🔄 COSTEO INVERSO</div>
            <p style={{ fontSize: '13px', color: '#8B96A8', marginBottom: '20px', lineHeight: '1.6' }}>
              Define el margen que quieres ganar y DIZGO calcula el precio de venta mínimo que debes cobrar para lograrlo.
            </p>

            <label style={{ display: 'block', fontSize: '12px', color: '#5A6478', marginBottom: '8px' }}>
              Margen neto deseado: <strong style={{ color: '#3D8EF0' }}>{margenDeseado}%</strong>
            </label>
            <input type="range" min={5} max={50} value={margenDeseado}
              onChange={e => setMargenDeseado(Number(e.target.value))}
              style={{ width: '100%', marginBottom: '20px', accentColor: '#3D8EF0' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              {[
                { label: 'Margen deseado', value: `${margenDeseado}%`, color: '#3D8EF0' },
                { label: 'PVP actual', value: `$${prod.pvp.toLocaleString('es-CO')}`, color: '#8B96A8' },
                { label: 'PVP sugerido', value: `$${pvp_sugerido.toLocaleString('es-CO')}`, color: '#F5A623' },
                { label: 'Diferencia', value: `$${(pvp_sugerido - prod.pvp).toLocaleString('es-CO')}`, color: pvp_sugerido > prod.pvp ? '#F05C5C' : '#2DD4A0' },
              ].map((k, i) => (
                <div key={i} style={{ ...s, padding: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#5A6478', marginBottom: '4px' }}>{k.label}</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: k.color }}>{k.value}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: '14px', background: 'rgba(61,142,240,0.06)', borderRadius: '10px', border: '1px solid rgba(61,142,240,0.2)' }}>
              <div style={{ fontSize: '12px', color: '#3D8EF0', fontWeight: '700', marginBottom: '6px' }}>💡 Interpretación</div>
              <p style={{ fontSize: '12px', color: '#8B96A8', lineHeight: '1.6' }}>
                Para lograr un margen del <strong style={{ color: '#3D8EF0' }}>{margenDeseado}%</strong> en <strong style={{ color: '#E8EDF5' }}>{prod.nombre}</strong>,
                debes venderlo a mínimo <strong style={{ color: '#F5A623' }}>${pvp_sugerido.toLocaleString('es-CO')}</strong>.
                {pvp_sugerido > prod.pvp
                  ? ` Tu PVP actual ($${prod.pvp.toLocaleString('es-CO')}) está $${(pvp_sugerido - prod.pvp).toLocaleString('es-CO')} por debajo.`
                  : ` Tu PVP actual ya cubre este margen. ✅`}
              </p>
            </div>
          </div>

          {/* Tabla de escenarios */}
          <div style={{ ...s, padding: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#F5A623', marginBottom: '14px' }}>📊 ESCENARIOS DE PRECIO</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Margen %', 'PVP Mínimo', 'Ganancia/pedido', '¿Viable?'].map(h => (
                    <th key={h} style={{ padding: '8px', textAlign: 'left', fontSize: '10px', color: '#5A6478', fontWeight: '700' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[5, 10, 15, 20, 25, 30].map(mg => {
                  const pvp_calc = Math.round(costos_fijos_sin_pub / (1 - pct_variables - mg / 100))
                  const gan = Math.round(pvp_calc * mg / 100)
                  const viable = pvp_calc <= 99900
                  return (
                    <tr key={mg} style={{
                      borderBottom: '1px solid rgba(255,255,255,0.03)',
                      background: mg === margenDeseado ? 'rgba(61,142,240,0.06)' : 'transparent'
                    }}>
                      <td style={{ padding: '8px', fontWeight: '700', color: colorMargen(mg) }}>{mg}%</td>
                      <td style={{ padding: '8px', color: '#E8EDF5' }}>${pvp_calc.toLocaleString('es-CO')}</td>
                      <td style={{ padding: '8px', color: '#2DD4A0' }}>${gan.toLocaleString('es-CO')}</td>
                      <td style={{ padding: '8px' }}>
                        <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '5px', fontWeight: '700',
                          background: viable ? 'rgba(45,212,160,0.1)' : 'rgba(240,92,92,0.1)',
                          color: viable ? '#2DD4A0' : '#F05C5C' }}>
                          {viable ? '✓ Sí' : '✗ Muy alto'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: COMPARATIVO */}
      {tab === 'comparativo' && (
        <div style={{ ...s, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontWeight: '700' }}>📈 Comparativo de margen — todos los productos</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#0A0D14', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Producto', 'PVP', 'Total Costos', 'Ganancia', 'Margen', 'CPA Máx', 'ROI Ads', 'Estado'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '10px', color: '#5A6478', fontWeight: '700' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productos.map((p, i) => {
                const c = calcular(p)
                return (
                  <tr key={i} onClick={() => { setSelIdx(i); setTab('costeo') }}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '10px 12px', fontWeight: '600' }}>{p.nombre}</td>
                    <td style={{ padding: '10px 12px' }}>${p.pvp.toLocaleString('es-CO')}</td>
                    <td style={{ padding: '10px 12px', color: '#F05C5C' }}>${c.total_costos.toLocaleString('es-CO')}</td>
                    <td style={{ padding: '10px 12px', color: c.ganancia > 0 ? '#2DD4A0' : '#F05C5C', fontWeight: '700' }}>
                      ${c.ganancia.toLocaleString('es-CO')}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontWeight: '800', fontSize: '14px', color: colorMargen(c.margen) }}>{c.margen}%</span>
                    </td>
                    <td style={{ padding: '10px 12px', color: '#9B6BFF' }}>${c.cpa_maximo.toLocaleString('es-CO')}</td>
                    <td style={{ padding: '10px 12px', color: c.roi_ads >= 2 ? '#2DD4A0' : '#F5A623' }}>{c.roi_ads}x</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '5px', fontWeight: '700',
                        background: c.margen >= 15 ? 'rgba(45,212,160,0.1)' : c.margen >= 8 ? 'rgba(245,166,35,0.1)' : 'rgba(240,92,92,0.1)',
                        color: c.margen >= 15 ? '#2DD4A0' : c.margen >= 8 ? '#F5A623' : '#F05C5C' }}>
                        {c.margen >= 15 ? '✓ Saludable' : c.margen >= 8 ? '⚠ Atención' : '✗ Crítico'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer info */}
      <div style={{ marginTop: '16px', padding: '12px 16px', background: '#111520', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '24px' }}>
        <div style={{ fontSize: '12px', color: '#5A6478' }}>
          📌 <strong style={{ color: '#8B96A8' }}>CPA Máximo</strong> = cuánto puedes pagar por adquisición sin perder dinero
        </div>
        <div style={{ fontSize: '12px', color: '#5A6478' }}>
          📌 <strong style={{ color: '#8B96A8' }}>ROI Ads</strong> = cuántos pesos genera cada peso invertido en publicidad
        </div>
        <div style={{ fontSize: '12px', color: '#5A6478' }}>
          📌 <strong style={{ color: '#8B96A8' }}>Margen saludable</strong> para dropshipping: mínimo 15%
        </div>
      </div>
    </div>
  )
}
