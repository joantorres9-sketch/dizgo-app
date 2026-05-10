'use client'
import { useState } from 'react'

// ============ DATOS REALES AGOSTO 2023 ============
const MESES = ['Mar','Abr','May','Jun','Jul','Ago']

const DATA_MESES = [
  { mes:'Mar', pedidos_generados:1820, pedidos_entregados:290, pedidos_cancelados:1200, pedidos_devueltos:40, ventas_brutas:20000000, inversion_pauta:3200000, cf:1159000, ganancia_wallet:3480000, roas:2.8, ctr:1.1, cpa:11034, tasa_entrega:72, tasa_devolucion:8 },
  { mes:'Abr', pedidos_generados:2100, pedidos_entregados:340, pedidos_cancelados:1450, pedidos_devueltos:48, ventas_brutas:23800000, inversion_pauta:3800000, cf:1159000, ganancia_wallet:4080000, roas:3.0, ctr:1.2, cpa:11176, tasa_entrega:74, tasa_devolucion:7 },
  { mes:'May', pedidos_generados:2350, pedidos_entregados:395, pedidos_cancelados:1600, pedidos_devueltos:55, ventas_brutas:27650000, inversion_pauta:4200000, cf:1159000, ganancia_wallet:4740000, roas:3.2, ctr:1.3, cpa:10633, tasa_entrega:76, tasa_devolucion:7 },
  { mes:'Jun', pedidos_generados:2600, pedidos_entregados:420, pedidos_cancelados:1800, pedidos_devueltos:58, ventas_brutas:30000000, inversion_pauta:4500000, cf:1159000, ganancia_wallet:5040000, roas:3.1, ctr:1.2, cpa:10714, tasa_entrega:75, tasa_devolucion:8 },
  { mes:'Jul', pedidos_generados:2800, pedidos_entregados:450, pedidos_cancelados:1900, pedidos_devueltos:62, ventas_brutas:32400000, inversion_pauta:4800000, cf:1159000, ganancia_wallet:5400000, roas:3.3, ctr:1.4, cpa:10667, tasa_entrega:77, tasa_devolucion:7 },
  { mes:'Ago', pedidos_generados:3000, pedidos_entregados:503, pedidos_cancelados:2100, pedidos_devueltos:68, ventas_brutas:35710000, inversion_pauta:5200000, cf:1159000, ganancia_wallet:6036000, roas:3.27, ctr:1.45, cpa:10338, tasa_entrega:78, tasa_devolucion:6 },
]

// Metas mes actual
const METAS = {
  pedidos_entregados: 500,
  ventas_brutas: 35000000,
  ganancia_wallet: 5000000,
  inversion_pauta: 5000000,
  roas: 3.0,
  cpa: 12000,
  tasa_entrega: 80,
  tasa_devolucion: 10,
}

const MES_ACTUAL = DATA_MESES[5] // Agosto

function semaforo(actual: number, meta: number, inv = false) {
  const pct = actual / meta * 100
  if (inv) return pct <= 85 ? '#2DD4A0' : pct <= 100 ? '#F5A623' : '#F05C5C'
  return pct >= 95 ? '#2DD4A0' : pct >= 75 ? '#F5A623' : '#F05C5C'
}

function fmt(n: number, tipo: 'cop'|'num'|'pct'|'x' = 'cop') {
  if (tipo === 'cop') return n >= 1000000 ? `$${(n/1000000).toFixed(1)}M` : `$${Math.round(n/1000)}K`
  if (tipo === 'pct') return `${n}%`
  if (tipo === 'x') return `${n}x`
  return n.toLocaleString('es-CO')
}

export default function ResultadosPage() {
  const [tab, setTab] = useState<'pyg'|'kpis'|'tendencia'|'decisiones'>('pyg')
  const [mesIdx, setMesIdx] = useState(5)
  const mes = DATA_MESES[mesIdx]

  // P&G calculado
  const ventas = mes.ventas_brutas
  const costo_productos = Math.round(ventas * 0.18)
  const flete_envio = Math.round(mes.pedidos_entregados * 21195)
  const flete_dev = Math.round(flete_envio * 0.20)
  const fulfillment = Math.round(mes.pedidos_entregados * 1500)
  const pauta = mes.inversion_pauta
  const cf = mes.cf
  const total_costos = costo_productos + flete_envio + flete_dev + fulfillment + pauta + cf
  const utilidad_bruta = ventas - costo_productos - flete_envio - flete_dev - fulfillment
  const utilidad_neta = ventas - total_costos
  const margen_bruto = Math.round(utilidad_bruta / ventas * 100)
  const margen_neto = Math.round(utilidad_neta / ventas * 100)
  const ganancia_real = mes.ganancia_wallet

  // vs meta
  const vs_pedidos = Math.round(mes.pedidos_entregados / METAS.pedidos_entregados * 100)
  const vs_ventas = Math.round(mes.ventas_brutas / METAS.ventas_brutas * 100)
  const vs_ganancia = Math.round(mes.ganancia_wallet / METAS.ganancia_wallet * 100)
  const vs_roas = Math.round(mes.roas / METAS.roas * 100)

  const s = (color?: string) => ({
    background: '#111520',
    border: `1px solid ${color ? color + '22' : 'rgba(255,255,255,0.07)'}`,
    borderRadius: '12px'
  })

  return (
    <div style={{ color:'#E8EDF5', fontFamily:'system-ui,sans-serif' }}>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
        <div>
          <h1 style={{ fontSize:'22px', fontWeight:'700', marginBottom:'4px' }}>📈 Dashboard Estratégico — P&G</h1>
          <p style={{ fontSize:'13px', color:'#8B96A8' }}>Plan vs Ejecución · Estado de Resultados · VERIFICAR</p>
        </div>
        {/* Selector de mes */}
        <div style={{ display:'flex', gap:'6px' }}>
          {DATA_MESES.map((m, i) => (
            <button key={i} onClick={() => setMesIdx(i)}
              style={{ padding:'6px 12px', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:'600',
                background: mesIdx === i ? '#F5A623' : 'rgba(255,255,255,0.05)',
                color: mesIdx === i ? '#0A0D14' : '#8B96A8' }}>
              {m.mes}
            </button>
          ))}
        </div>
      </div>

      {/* Semáforo general */}
      <div style={{ ...s(), padding:'14px 18px', marginBottom:'16px', display:'flex', gap:'20px', alignItems:'center', borderTop:`3px solid ${semaforo(vs_ganancia, 100)}` }}>
        <div style={{ fontSize:'24px' }}>
          {vs_ganancia >= 95 ? '🟢' : vs_ganancia >= 75 ? '🟡' : '🔴'}
        </div>
        <div>
          <div style={{ fontSize:'14px', fontWeight:'700', color: semaforo(vs_ganancia,100) }}>
            {vs_ganancia >= 95 ? 'MES EN VERDE — Objetivos cumplidos' : vs_ganancia >= 75 ? 'MES EN AMARILLO — Necesita atención' : 'MES EN ROJO — Por debajo de metas'}
          </div>
          <div style={{ fontSize:'12px', color:'#8B96A8', marginTop:'2px' }}>
            {mes.mes} · {mes.pedidos_entregados} pedidos entregados · Ganancia wallet: ${mes.ganancia_wallet.toLocaleString('es-CO')}
          </div>
        </div>
        <div style={{ marginLeft:'auto', display:'flex', gap:'24px' }}>
          {[
            { label:'vs Meta Pedidos', pct:vs_pedidos },
            { label:'vs Meta Ventas', pct:vs_ventas },
            { label:'vs Meta Ganancia', pct:vs_ganancia },
            { label:'vs Meta ROAS', pct:vs_roas },
          ].map((k,i) => (
            <div key={i} style={{ textAlign:'center' }}>
              <div style={{ fontSize:'18px', fontWeight:'800', color:semaforo(k.pct,100) }}>{k.pct}%</div>
              <div style={{ fontSize:'10px', color:'#5A6478' }}>{k.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'6px', marginBottom:'16px' }}>
        {[
          { key:'pyg', label:'💰 P&G Resultados' },
          { key:'kpis', label:'📊 KPIs vs Meta' },
          { key:'tendencia', label:'📈 Tendencia 6M' },
          { key:'decisiones', label:'🎯 Decisiones' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            style={{ padding:'8px 16px', borderRadius:'9px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'600',
              background: tab === t.key ? '#F5A623' : 'rgba(255,255,255,0.05)',
              color: tab === t.key ? '#0A0D14' : '#8B96A8' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB P&G */}
      {tab === 'pyg' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>

          {/* Estado de resultados */}
          <div style={{ ...s(), overflow:'hidden' }}>
            <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontWeight:'700' }}>📋 Estado de Resultados — {mes.mes}</span>
              <span style={{ fontSize:'12px', color:'#5A6478' }}>Datos reales</span>
            </div>
            {[
              { concepto:'INGRESOS', valor:ventas, tipo:'titulo', color:'#E8EDF5' },
              { concepto:'(+) Ventas brutas', valor:ventas, tipo:'ingreso', color:'#2DD4A0' },
              { concepto:'', valor:0, tipo:'separador' },
              { concepto:'COSTOS DIRECTOS', valor:0, tipo:'titulo', color:'#E8EDF5' },
              { concepto:'(-) Costo productos (18%)', valor:costo_productos, tipo:'egreso', color:'#F05C5C' },
              { concepto:'(-) Flete envío', valor:flete_envio, tipo:'egreso', color:'#F05C5C' },
              { concepto:'(-) Flete devolución (20%)', valor:flete_dev, tipo:'egreso', color:'#F05C5C' },
              { concepto:'(-) Fulfillment', valor:fulfillment, tipo:'egreso', color:'#F05C5C' },
              { concepto:'= UTILIDAD BRUTA', valor:utilidad_bruta, tipo:'subtotal', color: utilidad_bruta >= 0 ? '#2DD4A0' : '#F05C5C' },
              { concepto:`Margen bruto`, valor:margen_bruto, tipo:'margen', color: margen_bruto >= 20 ? '#2DD4A0' : '#F5A623' },
              { concepto:'', valor:0, tipo:'separador' },
              { concepto:'COSTOS OPERATIVOS', valor:0, tipo:'titulo', color:'#E8EDF5' },
              { concepto:'(-) Inversión en pauta', valor:pauta, tipo:'egreso', color:'#9B6BFF' },
              { concepto:'(-) Costos fijos', valor:cf, tipo:'egreso', color:'#3D8EF0' },
              { concepto:'= UTILIDAD NETA', valor:utilidad_neta, tipo:'subtotal', color: utilidad_neta >= 0 ? '#2DD4A0' : '#F05C5C' },
              { concepto:`Margen neto`, valor:margen_neto, tipo:'margen', color: margen_neto >= 10 ? '#2DD4A0' : margen_neto >= 5 ? '#F5A623' : '#F05C5C' },
              { concepto:'', valor:0, tipo:'separador' },
              { concepto:'💳 Ganancia real wallet Dropi', valor:ganancia_real, tipo:'wallet', color:'#2DD4A0' },
            ].map((row, i) => {
              if (row.tipo === 'separador') return <div key={i} style={{ height:'1px', background:'rgba(255,255,255,0.04)', margin:'4px 0' }} />
              if (row.tipo === 'titulo') return (
                <div key={i} style={{ padding:'6px 16px', fontSize:'10px', fontWeight:'800', letterSpacing:'1px', color:'#5A6478', background:'rgba(255,255,255,0.02)' }}>
                  {row.concepto}
                </div>
              )
              if (row.tipo === 'margen') return (
                <div key={i} style={{ padding:'3px 16px 8px', display:'flex', justifyContent:'flex-end' }}>
                  <span style={{ fontSize:'11px', fontWeight:'700', color:row.color }}>Margen: {row.valor}%</span>
                </div>
              )
              return (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 16px',
                  background: row.tipo === 'subtotal' ? `${row.color}06` : row.tipo === 'wallet' ? 'rgba(45,212,160,0.05)' : 'transparent',
                  borderLeft: row.tipo === 'subtotal' || row.tipo === 'wallet' ? `3px solid ${row.color}` : '3px solid transparent' }}>
                  <span style={{ fontSize:'13px', color: row.tipo === 'subtotal' || row.tipo === 'wallet' ? '#E8EDF5' : '#8B96A8', fontWeight: row.tipo === 'subtotal' || row.tipo === 'wallet' ? '700' : '400' }}>
                    {row.concepto}
                  </span>
                  <span style={{ fontSize: row.tipo === 'subtotal' || row.tipo === 'wallet' ? '15px' : '13px', fontWeight:'700', color:row.color }}>
                    {row.tipo === 'ingreso' ? '+' : row.valor > 0 && row.tipo !== 'subtotal' && row.tipo !== 'wallet' ? '-' : ''}
                    ${Math.abs(row.valor).toLocaleString('es-CO')}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Comparativo plan vs ejecución */}
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            <div style={{ ...s(), padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'14px' }}>🎯 PLAN vs EJECUCIÓN — {mes.mes}</div>
              {[
                { label:'Pedidos entregados', plan:METAS.pedidos_entregados, real:mes.pedidos_entregados, tipo:'num', inv:false },
                { label:'Ventas brutas', plan:METAS.ventas_brutas, real:mes.ventas_brutas, tipo:'cop', inv:false },
                { label:'Ganancia wallet', plan:METAS.ganancia_wallet, real:mes.ganancia_wallet, tipo:'cop', inv:false },
                { label:'Inversión pauta', plan:METAS.inversion_pauta, real:mes.inversion_pauta, tipo:'cop', inv:false },
                { label:'ROAS', plan:METAS.roas, real:mes.roas, tipo:'x', inv:false },
                { label:'CPA real', plan:METAS.cpa, real:mes.cpa, tipo:'cop', inv:true },
                { label:'Tasa entrega', plan:METAS.tasa_entrega, real:mes.tasa_entrega, tipo:'pct', inv:false },
                { label:'Tasa devolución', plan:METAS.tasa_devolucion, real:mes.tasa_devolucion, tipo:'pct', inv:true },
              ].map((k, i) => {
                const pct = Math.round(k.real / k.plan * 100)
                const color = semaforo(pct, 100, k.inv)
                const planFmt = k.tipo === 'cop' ? fmt(k.plan) : k.tipo === 'pct' ? `${k.plan}%` : k.tipo === 'x' ? `${k.plan}x` : k.plan.toLocaleString()
                const realFmt = k.tipo === 'cop' ? fmt(k.real) : k.tipo === 'pct' ? `${k.real}%` : k.tipo === 'x' ? `${k.real}x` : k.real.toLocaleString()
                return (
                  <div key={i} style={{ marginBottom:'10px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                      <span style={{ fontSize:'12px', color:'#8B96A8' }}>{k.label}</span>
                      <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
                        <span style={{ fontSize:'11px', color:'#5A6478' }}>Meta: {planFmt}</span>
                        <span style={{ fontSize:'13px', fontWeight:'800', color }}>{realFmt}</span>
                        <span style={{ fontSize:'11px', fontWeight:'700', color, minWidth:'36px', textAlign:'right' }}>{pct}%</span>
                      </div>
                    </div>
                    <div style={{ height:'6px', background:'rgba(255,255,255,0.05)', borderRadius:'3px', position:'relative' }}>
                      <div style={{ position:'absolute', left:`${Math.min(100,100)}%`, top:'-2px', width:'2px', height:'10px', background:'rgba(255,255,255,0.3)', borderRadius:'1px' }} />
                      <div style={{ height:'6px', width:`${Math.min(pct,100)}%`, background:color, borderRadius:'3px' }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Estructura de costos visual */}
            <div style={{ ...s(), padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#3D8EF0', marginBottom:'12px' }}>📊 ESTRUCTURA DE COSTOS</div>
              {[
                { label:'Costo producto', valor:costo_productos, color:'#F05C5C' },
                { label:'Flete envío + dev', valor:flete_envio + flete_dev, color:'#F5A623' },
                { label:'Pauta publicitaria', valor:pauta, color:'#9B6BFF' },
                { label:'Costos fijos', valor:cf, color:'#3D8EF0' },
                { label:'Fulfillment', valor:fulfillment, color:'#8B96A8' },
              ].map((c, i) => {
                const pct = Math.round(c.valor / ventas * 100)
                return (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
                    <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:c.color, flexShrink:0 }} />
                    <span style={{ flex:1, fontSize:'12px', color:'#8B96A8' }}>{c.label}</span>
                    <span style={{ fontSize:'11px', color:'#5A6478' }}>{pct}%</span>
                    <span style={{ fontSize:'12px', fontWeight:'700', color:c.color, minWidth:'60px', textAlign:'right' }}>{fmt(c.valor)}</span>
                  </div>
                )
              })}
              <div style={{ marginTop:'8px', paddingTop:'8px', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontSize:'12px', color:'#8B96A8' }}>Total costos / ventas</span>
                <span style={{ fontSize:'13px', fontWeight:'700', color: total_costos/ventas < 0.85 ? '#2DD4A0' : '#F05C5C' }}>
                  {Math.round(total_costos/ventas*100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB KPIs */}
      {tab === 'kpis' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px' }}>
          {[
            { label:'Pedidos generados', real:mes.pedidos_generados, meta:3500, tipo:'num', icon:'📋', color:'#3D8EF0', inv:false },
            { label:'Pedidos entregados', real:mes.pedidos_entregados, meta:METAS.pedidos_entregados, tipo:'num', icon:'✅', color:'#2DD4A0', inv:false },
            { label:'Pedidos cancelados', real:mes.pedidos_cancelados, meta:2000, tipo:'num', icon:'❌', color:'#F05C5C', inv:true },
            { label:'Pedidos devueltos', real:mes.pedidos_devueltos, meta:100, tipo:'num', icon:'🔄', color:'#F5A623', inv:true },
            { label:'Ventas brutas', real:mes.ventas_brutas, meta:METAS.ventas_brutas, tipo:'cop', icon:'💰', color:'#2DD4A0', inv:false },
            { label:'Ganancia wallet', real:mes.ganancia_wallet, meta:METAS.ganancia_wallet, tipo:'cop', icon:'💳', color:'#2DD4A0', inv:false },
            { label:'Inversión pauta', real:mes.inversion_pauta, meta:METAS.inversion_pauta, tipo:'cop', icon:'📢', color:'#9B6BFF', inv:false },
            { label:'Costos fijos', real:mes.cf, meta:1200000, tipo:'cop', icon:'🏢', color:'#3D8EF0', inv:true },
            { label:'ROAS', real:mes.roas, meta:METAS.roas, tipo:'x', icon:'📈', color:semaforo(mes.roas, METAS.roas), inv:false },
            { label:'CPA real', real:mes.cpa, meta:METAS.cpa, tipo:'cop', icon:'🎯', color:semaforo(mes.cpa, METAS.cpa, true), inv:true },
            { label:'CTR promedio', real:mes.ctr, meta:1.5, tipo:'pct', icon:'🖱️', color:semaforo(mes.ctr, 1.5), inv:false },
            { label:'Tasa entrega', real:mes.tasa_entrega, meta:METAS.tasa_entrega, tipo:'pct', icon:'🚚', color:semaforo(mes.tasa_entrega, METAS.tasa_entrega), inv:false },
          ].map((k, i) => {
            const pct = Math.round(k.real / k.meta * 100)
            const color = semaforo(pct, 100, k.inv)
            const valFmt = k.tipo === 'cop' ? fmt(k.real) : k.tipo === 'pct' ? `${k.real}%` : k.tipo === 'x' ? `${k.real}x` : k.real.toLocaleString()
            const metaFmt = k.tipo === 'cop' ? fmt(k.meta) : k.tipo === 'pct' ? `${k.meta}%` : k.tipo === 'x' ? `${k.meta}x` : k.meta.toLocaleString()
            return (
              <div key={i} style={{ ...s(color), padding:'16px', borderTop:`2px solid ${color}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px' }}>
                  <span style={{ fontSize:'11px', color:'#8B96A8' }}>{k.label}</span>
                  <span style={{ fontSize:'18px' }}>{k.icon}</span>
                </div>
                <div style={{ fontSize:'24px', fontWeight:'800', color, marginBottom:'4px' }}>{valFmt}</div>
                <div style={{ height:'4px', background:'rgba(255,255,255,0.05)', borderRadius:'2px', marginBottom:'6px' }}>
                  <div style={{ height:'4px', width:`${Math.min(pct,100)}%`, background:color, borderRadius:'2px' }} />
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'10px' }}>
                  <span style={{ color:'#5A6478' }}>Meta: {metaFmt}</span>
                  <span style={{ color, fontWeight:'700' }}>
                    {pct >= 95 ? '✅' : pct >= 75 ? '⚠️' : '❌'} {pct}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* TAB TENDENCIA */}
      {tab === 'tendencia' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          {/* Gráfico pedidos */}
          <div style={{ ...s(), padding:'20px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#2DD4A0', marginBottom:'16px' }}>📦 Pedidos entregados — 6 meses</div>
            <div style={{ display:'flex', alignItems:'flex-end', gap:'10px', height:'140px', marginBottom:'10px' }}>
              {DATA_MESES.map((m, i) => {
                const pct = (m.pedidos_entregados / 600) * 100
                const metaPct = (METAS.pedidos_entregados / 600) * 100
                const activo = i === mesIdx
                return (
                  <div key={i} onClick={() => setMesIdx(i)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', height:'100%', cursor:'pointer' }}>
                    <div style={{ fontSize:'11px', color: activo ? '#2DD4A0' : '#5A6478', marginBottom:'4px', fontWeight: activo ? '700' : '400' }}>
                      {m.pedidos_entregados}
                    </div>
                    <div style={{ flex:1, width:'100%', display:'flex', alignItems:'flex-end', position:'relative' }}>
                      <div style={{ position:'absolute', bottom:`${metaPct}%`, left:0, right:0, height:'1px', background:'rgba(245,166,35,0.4)' }} />
                      <div style={{ width:'100%', height:`${pct}%`, borderRadius:'4px 4px 0 0', minHeight:'4px',
                        background: activo ? '#2DD4A0' : m.pedidos_entregados >= METAS.pedidos_entregados ? '#2DD4A0' : '#3D8EF0',
                        opacity: activo ? 1 : 0.7 }} />
                    </div>
                    <div style={{ fontSize:'11px', color: activo ? '#F5A623' : '#5A6478', marginTop:'6px', fontWeight: activo ? '700' : '400' }}>{m.mes}</div>
                  </div>
                )
              })}
            </div>
            <div style={{ display:'flex', gap:'12px', fontSize:'11px', color:'#5A6478' }}>
              <span style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                <span style={{ width:'12px', height:'3px', background:'rgba(245,166,35,0.4)', display:'inline-block' }} />
                Meta {METAS.pedidos_entregados}
              </span>
            </div>
          </div>

          {/* Gráfico ROAS */}
          <div style={{ ...s(), padding:'20px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#9B6BFF', marginBottom:'16px' }}>📈 ROAS mensual</div>
            <div style={{ display:'flex', alignItems:'flex-end', gap:'10px', height:'140px', marginBottom:'10px' }}>
              {DATA_MESES.map((m, i) => {
                const pct = (m.roas / 5) * 100
                const activo = i === mesIdx
                return (
                  <div key={i} onClick={() => setMesIdx(i)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', height:'100%', cursor:'pointer' }}>
                    <div style={{ fontSize:'11px', color: activo ? '#9B6BFF' : '#5A6478', marginBottom:'4px', fontWeight: activo ? '700' : '400' }}>
                      {m.roas}x
                    </div>
                    <div style={{ flex:1, width:'100%', display:'flex', alignItems:'flex-end', position:'relative' }}>
                      <div style={{ position:'absolute', bottom:`${(METAS.roas/5)*100}%`, left:0, right:0, height:'1px', background:'rgba(245,166,35,0.4)' }} />
                      <div style={{ width:'100%', height:`${pct}%`, borderRadius:'4px 4px 0 0', minHeight:'4px',
                        background: activo ? '#9B6BFF' : '#9B6BFF', opacity: activo ? 1 : 0.6 }} />
                    </div>
                    <div style={{ fontSize:'11px', color: activo ? '#F5A623' : '#5A6478', marginTop:'6px', fontWeight: activo ? '700' : '400' }}>{m.mes}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Tabla comparativa */}
          <div style={{ ...s(), overflow:'hidden', gridColumn:'1/-1' }}>
            <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', fontWeight:'700' }}>
              📊 Comparativo 6 meses
            </div>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
                <thead>
                  <tr style={{ background:'#0A0D14', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                    {['Mes','Pedidos entregados','Ventas brutas','Ganancia wallet','Pauta','ROAS','CPA','T.Entrega','T.Dev.'].map(h => (
                      <th key={h} style={{ padding:'8px 12px', textAlign:'left', fontSize:'10px', color:'#5A6478', fontWeight:'700', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DATA_MESES.map((m, i) => (
                    <tr key={i} onClick={() => setMesIdx(i)} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)', cursor:'pointer', background: mesIdx === i ? 'rgba(245,166,35,0.04)' : 'transparent' }}>
                      <td style={{ padding:'9px 12px', fontWeight:'700', color: mesIdx === i ? '#F5A623' : '#E8EDF5' }}>{m.mes}</td>
                      <td style={{ padding:'9px 12px', color: m.pedidos_entregados >= METAS.pedidos_entregados ? '#2DD4A0' : '#8B96A8', fontWeight:'600' }}>{m.pedidos_entregados}</td>
                      <td style={{ padding:'9px 12px', color:'#8B96A8' }}>{fmt(m.ventas_brutas)}</td>
                      <td style={{ padding:'9px 12px', color:'#2DD4A0', fontWeight:'700' }}>{fmt(m.ganancia_wallet)}</td>
                      <td style={{ padding:'9px 12px', color:'#9B6BFF' }}>{fmt(m.inversion_pauta)}</td>
                      <td style={{ padding:'9px 12px', fontWeight:'800', color:semaforo(m.roas, METAS.roas) }}>{m.roas}x</td>
                      <td style={{ padding:'9px 12px', color:semaforo(m.cpa, METAS.cpa, true) }}>${m.cpa.toLocaleString('es-CO')}</td>
                      <td style={{ padding:'9px 12px', color:semaforo(m.tasa_entrega, METAS.tasa_entrega) }}>{m.tasa_entrega}%</td>
                      <td style={{ padding:'9px 12px', color:semaforo(m.tasa_devolucion, METAS.tasa_devolucion, true) }}>{m.tasa_devolucion}%</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background:'rgba(245,166,35,0.04)', borderTop:'2px solid rgba(245,166,35,0.2)' }}>
                    <td style={{ padding:'9px 12px', fontWeight:'800', color:'#F5A623' }}>META</td>
                    <td style={{ padding:'9px 12px', color:'#F5A623' }}>{METAS.pedidos_entregados}</td>
                    <td style={{ padding:'9px 12px', color:'#F5A623' }}>{fmt(METAS.ventas_brutas)}</td>
                    <td style={{ padding:'9px 12px', color:'#F5A623' }}>{fmt(METAS.ganancia_wallet)}</td>
                    <td style={{ padding:'9px 12px', color:'#F5A623' }}>{fmt(METAS.inversion_pauta)}</td>
                    <td style={{ padding:'9px 12px', color:'#F5A623' }}>{METAS.roas}x</td>
                    <td style={{ padding:'9px 12px', color:'#F5A623' }}>${METAS.cpa.toLocaleString()}</td>
                    <td style={{ padding:'9px 12px', color:'#F5A623' }}>{METAS.tasa_entrega}%</td>
                    <td style={{ padding:'9px 12px', color:'#F5A623' }}>{METAS.tasa_devolucion}%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB DECISIONES */}
      {tab === 'decisiones' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div style={{ ...s(), padding:'20px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#F05C5C', marginBottom:'14px' }}>🚨 ALERTAS ESTRATÉGICAS</div>
            {[
              { nivel:'CRÍTICO', color:'#F05C5C', icono:'🔴', titulo:'CPA por encima del máximo', desc:`CPA actual $${mes.cpa.toLocaleString()} vs máximo $${METAS.cpa.toLocaleString()}. Revisar segmentación de audiencias y creativos.`, accion:'Pausar campañas con CPA > $15.000 y optimizar las mejores' },
              { nivel:'ALERTA', color:'#F5A623', icono:'🟡', titulo:'Tasa de entrega por debajo del 80%', desc:`${mes.tasa_entrega}% de entrega vs meta ${METAS.tasa_entrega}%. ${mes.pedidos_cancelados} cancelados en el mes.`, accion:'Activar confirmación por WhatsApp antes del despacho' },
              { nivel:'INFO', color:'#3D8EF0', icono:'🔵', titulo:'ROAS creciendo mes a mes', desc:`ROAS pasó de 2.8x en marzo a ${mes.roas}x en ${mes.mes}. Tendencia positiva.`, accion:'Escalar presupuesto en campañas con ROAS > 3x' },
              { nivel:'OK', color:'#2DD4A0', icono:'🟢', titulo:'Ganancia wallet superó meta', desc:`Ganancia ${fmt(mes.ganancia_wallet)} vs meta ${fmt(METAS.ganancia_wallet)}. ${Math.round(mes.ganancia_wallet/METAS.ganancia_wallet*100)}% de cumplimiento.`, accion:'Mantener mix de productos actual — especialmente ULTRASHIELD y MENPROS' },
            ].map((a, i) => (
              <div key={i} style={{ padding:'14px', borderRadius:'10px', marginBottom:'10px', borderLeft:`3px solid ${a.color}`, background:`${a.color}06` }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
                  <span style={{ fontSize:'16px' }}>{a.icono}</span>
                  <span style={{ fontSize:'12px', fontWeight:'800', color:a.color }}>[{a.nivel}]</span>
                  <span style={{ fontSize:'13px', fontWeight:'700', color:'#E8EDF5' }}>{a.titulo}</span>
                </div>
                <div style={{ fontSize:'12px', color:'#8B96A8', marginBottom:'6px', lineHeight:'1.5' }}>{a.desc}</div>
                <div style={{ fontSize:'11px', color:a.color, fontWeight:'600' }}>→ {a.accion}</div>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {/* Decisiones recomendadas */}
            <div style={{ ...s(), padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#2DD4A0', marginBottom:'12px' }}>✅ DECISIONES RECOMENDADAS — {mes.mes}</div>
              {[
                { prioridad:'HOY', color:'#F05C5C', accion:'Revisar campañas con CPA > $15.000 y pausarlas', impacto:'Ahorra ~$800K en pauta mal invertida' },
                { prioridad:'ESTA SEMANA', color:'#F5A623', accion:'Activar confirmación WhatsApp para todos los pendientes', impacto:'Puede subir tasa entrega del 78% al 85%' },
                { prioridad:'ESTE MES', color:'#3D8EF0', accion:'Escalar presupuesto de ULTRASHIELD (+$500K/mes)', impacto:'ROAS 2.55x con margen para crecer' },
                { prioridad:'PRÓXIMO MES', color:'#9B6BFF', accion:'Activar combos x2 en productos de ticket medio ($70K)', impacto:'Puede subir ticket promedio un 40%' },
              ].map((d, i) => (
                <div key={i} style={{ display:'flex', gap:'10px', padding:'10px 12px', borderRadius:'8px', marginBottom:'7px', background:'rgba(255,255,255,0.02)' }}>
                  <span style={{ fontSize:'10px', fontWeight:'800', padding:'2px 7px', borderRadius:'5px', height:'fit-content', flexShrink:0, marginTop:'1px',
                    background:`${d.color}15`, color:d.color }}>
                    {d.prioridad}
                  </span>
                  <div>
                    <div style={{ fontSize:'12px', color:'#E8EDF5', marginBottom:'3px', fontWeight:'600' }}>{d.accion}</div>
                    <div style={{ fontSize:'11px', color:'#5A6478' }}>💡 {d.impacto}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Proyección siguiente mes */}
            <div style={{ ...s(), padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'12px' }}>🔮 PROYECCIÓN PRÓXIMO MES</div>
              {[
                { label:'Pedidos entregados (proyectado)', valor:`${Math.round(mes.pedidos_entregados * 1.08).toLocaleString()}`, color:'#2DD4A0' },
                { label:'Ventas brutas', valor:fmt(Math.round(mes.ventas_brutas * 1.08)), color:'#2DD4A0' },
                { label:'Ganancia wallet', valor:fmt(Math.round(mes.ganancia_wallet * 1.10)), color:'#2DD4A0' },
                { label:'Inversión pauta recomendada', valor:fmt(Math.round(mes.inversion_pauta * 1.05)), color:'#9B6BFF' },
              ].map((k, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize:'12px', color:'#8B96A8' }}>{k.label}</span>
                  <span style={{ fontSize:'14px', fontWeight:'700', color:k.color }}>{k.valor}</span>
                </div>
              ))}
              <div style={{ marginTop:'10px', fontSize:'11px', color:'#5A6478', lineHeight:'1.6' }}>
                Proyección basada en tendencia de crecimiento del 8-10% mensual observada en los últimos 6 meses.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
