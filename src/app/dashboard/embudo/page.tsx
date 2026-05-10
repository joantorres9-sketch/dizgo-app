'use client'
import { useState } from 'react'

// Datos reales de agosto 2023 - campañas Meta
const DATOS_REALES = {
  // Pauta Meta - datos reales de las campañas
  presupuesto: 5200000,
  impresiones: 4763000,
  cpm: 1092, // COP
  clics: 47630,
  ctr: 1.45,
  cpc: 1092,
  // Landing / tienda
  visitas_landing: 28578,
  velocidad_carga: 0.60, // 60% llegan realmente
  visitantes_efectivos: 17147,
  conv_rate: 7.91,
  compras_fb: 1074,
  // Operación Dropi
  pedidos_generados: 3000,
  tasa_confirmacion: 62,
  pedidos_confirmados: 1860,
  tasa_despacho: 78,
  pedidos_despachados: 1451,
  tasa_entrega: 78,
  pedidos_entregados: 503,
  tasa_devolucion: 6,
  pedidos_devueltos: 68,
  // Financiero
  pvp_promedio: 71000,
  ganancia_por_pedido: 8940,
}

// Benchmarks mercado colombiano dropshipping
const BENCHMARKS = {
  cpm: { min:5000, bueno:9000, excelente:6000, label:'CPM (COP)' },
  ctr: { min:0.8, bueno:1.5, excelente:2.5, label:'CTR (%)' },
  conv_rate: { min:3, bueno:6, excelente:10, label:'Conv. Rate (%)' },
  tasa_confirmacion: { min:50, bueno:65, excelente:80, label:'% Confirmación' },
  tasa_despacho: { min:70, bueno:80, excelente:90, label:'% Despacho' },
  tasa_entrega: { min:65, bueno:78, excelente:88, label:'% Entrega efectiva' },
  tasa_devolucion: { min:20, bueno:12, excelente:5, label:'% Devolución', inv:true },
}

function diagBenchmark(valor: number, bm: any): { color: string; label: string; icono: string } {
  if (bm.inv) {
    if (valor <= bm.excelente) return { color:'#2DD4A0', label:'Excelente', icono:'🟢' }
    if (valor <= bm.bueno) return { color:'#F5A623', label:'Bueno', icono:'🟡' }
    if (valor <= bm.min) return { color:'#F5A623', label:'Aceptable', icono:'🟠' }
    return { color:'#F05C5C', label:'Crítico', icono:'🔴' }
  }
  if (valor >= bm.excelente) return { color:'#2DD4A0', label:'Excelente', icono:'🟢' }
  if (valor >= bm.bueno) return { color:'#F5A623', label:'Bueno', icono:'🟡' }
  if (valor >= bm.min) return { color:'#F5A623', label:'Aceptable', icono:'🟠' }
  return { color:'#F05C5C', label:'Crítico', icono:'🔴' }
}

function fmt(n: number, tipo = 'cop') {
  if (tipo === 'cop') return n >= 1000000 ? `$${(n/1000000).toFixed(1)}M` : `$${Math.round(n/1000)}K`
  if (tipo === 'num') return n.toLocaleString('es-CO')
  return `${n}`
}

export default function EmbudoPage() {
  const [tab, setTab] = useState<'embudo'|'diagnostico'|'simulador'|'benchmarks'>('embudo')

  // Simulador - valores ajustables
  const [simCTR, setSimCTR] = useState(DATOS_REALES.ctr)
  const [simConv, setSimConv] = useState(DATOS_REALES.conv_rate)
  const [simConf, setSimConf] = useState(DATOS_REALES.tasa_confirmacion)
  const [simDespacho, setSimDespacho] = useState(DATOS_REALES.tasa_despacho)
  const [simEntrega, setSimEntrega] = useState(DATOS_REALES.tasa_entrega)
  const [simDev, setSimDev] = useState(DATOS_REALES.tasa_devolucion)

  // Cálculos simulador
  const sim_clics = Math.round(DATOS_REALES.impresiones * simCTR / 100)
  const sim_compras = Math.round(DATOS_REALES.visitantes_efectivos * simConv / 100)
  const sim_confirmados = Math.round(sim_compras * simConf / 100)
  const sim_despachados = Math.round(sim_confirmados * simDespacho / 100)
  const sim_entregados = Math.round(sim_despachados * simEntrega / 100)
  const sim_devueltos = Math.round(sim_entregados * simDev / 100)
  const sim_entregados_netos = sim_entregados - sim_devueltos
  const sim_ganancia = sim_entregados_netos * DATOS_REALES.ganancia_por_pedido
  const ganancia_actual = DATOS_REALES.pedidos_entregados * DATOS_REALES.ganancia_por_pedido
  const mejora_ganancia = sim_ganancia - ganancia_actual

  // CPA acumulado por etapa
  const cpa_clic = Math.round(DATOS_REALES.presupuesto / DATOS_REALES.clics)
  const cpa_compra = Math.round(DATOS_REALES.presupuesto / DATOS_REALES.compras_fb)
  const cpa_confirmado = Math.round(DATOS_REALES.presupuesto / DATOS_REALES.pedidos_confirmados)
  const cpa_despachado = Math.round(DATOS_REALES.presupuesto / DATOS_REALES.pedidos_despachados)
  const cpa_entregado = Math.round(DATOS_REALES.presupuesto / DATOS_REALES.pedidos_entregados)

  const ETAPAS = [
    { label:'Impresiones', valor:DATOS_REALES.impresiones, color:'#5A6478', icon:'👁️', pct:100, capa:1 },
    { label:'Clics (CTR)', valor:DATOS_REALES.clics, color:'#3D8EF0', icon:'🖱️', pct:Math.round(DATOS_REALES.clics/DATOS_REALES.impresiones*100*100)/100, capa:2 },
    { label:'Visitas Landing', valor:DATOS_REALES.visitantes_efectivos, color:'#9B6BFF', icon:'🌐', pct:Math.round(DATOS_REALES.visitantes_efectivos/DATOS_REALES.clics*100), capa:3 },
    { label:'Compras (Conv.)', valor:DATOS_REALES.compras_fb, color:'#F5A623', icon:'🛒', pct:DATOS_REALES.conv_rate, capa:4 },
    { label:'Confirmados', valor:DATOS_REALES.pedidos_confirmados, color:'#F5A623', icon:'📞', pct:DATOS_REALES.tasa_confirmacion, capa:5 },
    { label:'Despachados', valor:DATOS_REALES.pedidos_despachados, color:'#3D8EF0', icon:'📦', pct:DATOS_REALES.tasa_despacho, capa:6 },
    { label:'Entregados', valor:DATOS_REALES.pedidos_entregados, color:'#2DD4A0', icon:'✅', pct:DATOS_REALES.tasa_entrega, capa:7 },
    { label:'Devueltos', valor:DATOS_REALES.pedidos_devueltos, color:'#F05C5C', icon:'🔄', pct:DATOS_REALES.tasa_devolucion, capa:8 },
  ]

  const s = { background:'#111520', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'12px' }
  const sld = (val: number, set: Function, min: number, max: number, step = 0.1) => (
    <input type="range" min={min} max={max} step={step} value={val}
      onChange={e => set(Number(e.target.value))}
      style={{ width:'100%', accentColor:'#F5A623', margin:'4px 0' }} />
  )

  return (
    <div style={{ color:'#E8EDF5', fontFamily:'system-ui,sans-serif' }}>

      <div style={{ marginBottom:'20px' }}>
        <h1 style={{ fontSize:'22px', fontWeight:'700', marginBottom:'4px' }}>🔬 Embudo de Tráfico</h1>
        <p style={{ fontSize:'13px', color:'#8B96A8' }}>CPM→CTR→Conv→Conf→Despacho→Entrega · Datos reales agosto · VERIFICAR</p>
      </div>

      {/* KPIs del embudo */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(8,1fr)', gap:'6px', marginBottom:'16px' }}>
        {[
          { label:'Impresiones', value:(DATOS_REALES.impresiones/1000).toFixed(0)+'K', color:'#5A6478', icon:'👁️' },
          { label:'Clics', value:(DATOS_REALES.clics/1000).toFixed(1)+'K', color:'#3D8EF0', icon:'🖱️' },
          { label:'CTR', value:`${DATOS_REALES.ctr}%`, color: diagBenchmark(DATOS_REALES.ctr, BENCHMARKS.ctr).color, icon:'📊' },
          { label:'Compras FB', value:DATOS_REALES.compras_fb.toLocaleString(), color:'#F5A623', icon:'🛒' },
          { label:'Confirmados', value:DATOS_REALES.pedidos_confirmados.toLocaleString(), color:'#F5A623', icon:'📞' },
          { label:'Despachados', value:DATOS_REALES.pedidos_despachados.toLocaleString(), color:'#3D8EF0', icon:'📦' },
          { label:'Entregados', value:DATOS_REALES.pedidos_entregados.toLocaleString(), color:'#2DD4A0', icon:'✅' },
          { label:'Conversión total', value:`${Math.round(DATOS_REALES.pedidos_entregados/DATOS_REALES.impresiones*10000)/100}%`, color:'#2DD4A0', icon:'🎯' },
        ].map((k,i) => (
          <div key={i} style={{ ...s, padding:'10px', borderTop:`2px solid ${k.color}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px' }}>
              <span style={{ fontSize:'9px', color:'#8B96A8', lineHeight:'1.3' }}>{k.label}</span>
              <span style={{ fontSize:'12px' }}>{k.icon}</span>
            </div>
            <div style={{ fontSize:'16px', fontWeight:'800', color:k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'6px', marginBottom:'16px' }}>
        {[
          { key:'embudo', label:'🔬 Embudo visual' },
          { key:'diagnostico', label:'🚨 Diagnóstico' },
          { key:'simulador', label:'⚡ Simulador' },
          { key:'benchmarks', label:'📊 Benchmarks' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            style={{ padding:'8px 16px', borderRadius:'9px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'600',
              background: tab === t.key ? '#F5A623' : 'rgba(255,255,255,0.05)',
              color: tab === t.key ? '#0A0D14' : '#8B96A8' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB EMBUDO VISUAL */}
      {tab === 'embudo' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>

          {/* Embudo visual */}
          <div style={{ ...s, padding:'20px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#3D8EF0', marginBottom:'16px' }}>🔬 EMBUDO COMPLETO — Impresiones → Entrega</div>
            {ETAPAS.map((e, i) => {
              const anchoPct = Math.max((e.valor / DATOS_REALES.impresiones) * 100, 3)
              const perdida = i > 0 ? ETAPAS[i-1].valor - e.valor : 0
              return (
                <div key={i} style={{ marginBottom:'6px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'3px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                      <span style={{ fontSize:'14px' }}>{e.icon}</span>
                      <span style={{ fontSize:'12px', color:'#8B96A8' }}>{e.label}</span>
                      <span style={{ fontSize:'10px', color:e.color, fontWeight:'700' }}>
                        {i === 0 ? '' : e.capa <= 2 ? `CTR: ${e.pct}%` : `${e.pct}%`}
                      </span>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                      {i > 0 && perdida > 0 && (
                        <span style={{ fontSize:'10px', color:'#F05C5C' }}>-{perdida.toLocaleString('es-CO')}</span>
                      )}
                      <span style={{ fontSize:'13px', fontWeight:'800', color:e.color }}>
                        {e.valor.toLocaleString('es-CO')}
                      </span>
                    </div>
                  </div>
                  {/* Barra trapecio */}
                  <div style={{ height:'28px', background:'rgba(255,255,255,0.04)', borderRadius:'4px', overflow:'hidden', position:'relative' }}>
                    <div style={{ position:'absolute', left:'50%', transform:'translateX(-50%)', height:'100%', width:`${anchoPct}%`, background:`${e.color}${i === 0 ? '40' : '25'}`, borderRadius:'3px', transition:'width .3s' }} />
                    <div style={{ position:'absolute', left:'50%', transform:'translateX(-50%)', height:'100%', width:`${anchoPct}%`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <span style={{ fontSize:'11px', color:e.color, fontWeight:'700' }}>
                        {i === 0 ? `${(e.valor/1000).toFixed(0)}K` : e.valor.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Conversión global */}
            <div style={{ marginTop:'14px', padding:'12px 14px', background:'rgba(45,212,160,0.06)', borderRadius:'10px', border:'1px solid rgba(45,212,160,0.15)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontSize:'12px', color:'#8B96A8' }}>Conversión global del embudo</div>
                <div style={{ fontSize:'11px', color:'#5A6478' }}>Impresiones → Entrega efectiva</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:'22px', fontWeight:'800', color:'#2DD4A0' }}>
                  {(DATOS_REALES.pedidos_entregados/DATOS_REALES.impresiones*100).toFixed(3)}%
                </div>
                <div style={{ fontSize:'11px', color:'#5A6478' }}>1 entrega por cada {Math.round(DATOS_REALES.impresiones/DATOS_REALES.pedidos_entregados).toLocaleString()} impresiones</div>
              </div>
            </div>
          </div>

          {/* CPA por etapa */}
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#9B6BFF', marginBottom:'14px' }}>💰 CPA ACUMULADO POR ETAPA</div>
              <div style={{ fontSize:'12px', color:'#5A6478', marginBottom:'12px', lineHeight:'1.6' }}>
                Cuánto de la pauta se invierte hasta lograr cada etapa del embudo.
              </div>
              {[
                { label:'Costo por clic', cpa:cpa_clic, color:'#3D8EF0', desc:'CPC real' },
                { label:'Costo por compra FB', cpa:cpa_compra, color:'#F5A623', desc:'CPA plataforma' },
                { label:'Costo por confirmado', cpa:cpa_confirmado, color:'#F5A623', desc:'CPA operativo' },
                { label:'Costo por despachado', cpa:cpa_despachado, color:'#9B6BFF', desc:'CPA logístico' },
                { label:'Costo por entregado', cpa:cpa_entregado, color:'#2DD4A0', desc:'CPA real final' },
              ].map((k, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'8px', marginBottom:'6px',
                  background:`${k.color}08`, borderLeft:`3px solid ${k.color}` }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'12px', fontWeight:'600', color:'#E8EDF5' }}>{k.label}</div>
                    <div style={{ fontSize:'10px', color:'#5A6478' }}>{k.desc}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:'16px', fontWeight:'800', color:k.color }}>${k.cpa.toLocaleString('es-CO')}</div>
                  </div>
                </div>
              ))}

              <div style={{ marginTop:'10px', padding:'10px 12px', background:'rgba(255,255,255,0.02)', borderRadius:'8px', fontSize:'11px', color:'#8B96A8', lineHeight:'1.6' }}>
                💡 El CPA real de entrega <strong style={{ color:'#2DD4A0' }}>${cpa_entregado.toLocaleString('es-CO')}</strong> es
                <strong style={{ color:cpa_entregado <= 18000 ? '#2DD4A0' : '#F05C5C' }}> {cpa_entregado <= 18000 ? '✅ menor' : '❌ mayor'}</strong> al CPA máximo de $18.000.
              </div>
            </div>

            {/* Pérdidas por etapa */}
            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#F05C5C', marginBottom:'12px' }}>📉 PEDIDOS PERDIDOS POR ETAPA</div>
              {[
                { etapa:'FB → Confirmación', perdidos: DATOS_REALES.compras_fb - DATOS_REALES.pedidos_confirmados, pct:Math.round((1-DATOS_REALES.tasa_confirmacion/100)*100), color:'#F5A623', causa:'No contesta · Rechaza · Número errado' },
                { etapa:'Conf → Despacho', perdidos: DATOS_REALES.pedidos_confirmados - DATOS_REALES.pedidos_despachados, pct:Math.round((1-DATOS_REALES.tasa_despacho/100)*100), color:'#9B6BFF', causa:'Sin inventario · Cancelaciones tardías' },
                { etapa:'Despacho → Entrega', perdidos: DATOS_REALES.pedidos_despachados - DATOS_REALES.pedidos_entregados, pct:Math.round((1-DATOS_REALES.tasa_entrega/100)*100), color:'#F05C5C', causa:'Novedades · Dirección errónea · Rechazos' },
                { etapa:'Devueltos', perdidos: DATOS_REALES.pedidos_devueltos, pct:DATOS_REALES.tasa_devolucion, color:'#F05C5C', causa:'Se rehúsa · No reconoce pedido' },
              ].map((p, i) => (
                <div key={i} style={{ padding:'8px 10px', borderRadius:'7px', marginBottom:'6px', background:`${p.color}06` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'3px' }}>
                    <span style={{ fontSize:'11px', fontWeight:'700', color:p.color }}>{p.etapa}</span>
                    <span style={{ fontSize:'12px', fontWeight:'800', color:p.color }}>-{p.perdidos.toLocaleString()} ({p.pct}%)</span>
                  </div>
                  <div style={{ fontSize:'10px', color:'#5A6478' }}>{p.causa}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB DIAGNÓSTICO */}
      {tab === 'diagnostico' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div style={{ ...s, padding:'20px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'14px' }}>🔍 DIAGNÓSTICO AUTOMÁTICO POR INDICADOR</div>
            {[
              { metrica:'CPM', valor:DATOS_REALES.cpm, bm:BENCHMARKS.cpm, unidad:'COP', formato:'cop',
                accion_buena:'CPM eficiente — audiencias bien segmentadas',
                accion_mala:'CPM alto — revisar audiencias, ampliar o cambiar intereses' },
              { metrica:'CTR', valor:DATOS_REALES.ctr, bm:BENCHMARKS.ctr, unidad:'%', formato:'pct',
                accion_buena:'CTR saludable — creativos funcionando bien',
                accion_mala:'CTR bajo — cambiar creative, hook o copy' },
              { metrica:'Conv. Rate', valor:DATOS_REALES.conv_rate, bm:BENCHMARKS.conv_rate, unidad:'%', formato:'pct',
                accion_buena:'Landing convirtiendo bien',
                accion_mala:'Mejorar landing: velocidad, precio visible, CTA claro' },
              { metrica:'% Confirmación', valor:DATOS_REALES.tasa_confirmacion, bm:BENCHMARKS.tasa_confirmacion, unidad:'%', formato:'pct',
                accion_buena:'Alta confirmación — buen proceso de ventas',
                accion_mala:'Activar WhatsApp inmediato — máximo 2h después del pedido' },
              { metrica:'% Despacho', valor:DATOS_REALES.tasa_despacho, bm:BENCHMARKS.tasa_despacho, unidad:'%', formato:'pct',
                accion_buena:'Proceso de despacho eficiente',
                accion_mala:'Revisar inventario y proceso de confirmación antes de despacho' },
              { metrica:'% Entrega', valor:DATOS_REALES.tasa_entrega, bm:BENCHMARKS.tasa_entrega, unidad:'%', formato:'pct',
                accion_buena:'Buena tasa de entrega — transportadora eficiente',
                accion_mala:'Gestionar novedades activamente — llamar en primeras 24h' },
              { metrica:'% Devolución', valor:DATOS_REALES.tasa_devolucion, bm:BENCHMARKS.tasa_devolucion, unidad:'%', formato:'pct',
                accion_buena:'Baja devolución — cliente satisfecho',
                accion_mala:'Revisar calidad del producto y descripción en ads' },
            ].map((d, i) => {
              const diag = diagBenchmark(d.valor, d.bm)
              const valFmt = d.formato === 'cop' ? `$${d.valor.toLocaleString('es-CO')}` : `${d.valor}${d.unidad}`
              return (
                <div key={i} style={{ padding:'12px 14px', borderRadius:'10px', marginBottom:'8px',
                  background:`${diag.color}06`, borderLeft:`3px solid ${diag.color}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'6px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      <span style={{ fontSize:'16px' }}>{diag.icono}</span>
                      <span style={{ fontSize:'13px', fontWeight:'700', color:'#E8EDF5' }}>{d.metrica}</span>
                      <span style={{ fontSize:'11px', fontWeight:'800', color:diag.color }}>[{diag.label}]</span>
                    </div>
                    <span style={{ fontSize:'16px', fontWeight:'800', color:diag.color }}>{valFmt}</span>
                  </div>
                  <div style={{ fontSize:'11px', color:diag.color, lineHeight:'1.5' }}>
                    → {diag.color === '#2DD4A0' ? d.accion_buena : d.accion_mala}
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {/* Score global */}
            <div style={{ ...s, padding:'20px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#3D8EF0', marginBottom:'14px' }}>📊 SCORE GLOBAL DEL EMBUDO</div>
              {(() => {
                const scores = [
                  diagBenchmark(DATOS_REALES.ctr, BENCHMARKS.ctr),
                  diagBenchmark(DATOS_REALES.conv_rate, BENCHMARKS.conv_rate),
                  diagBenchmark(DATOS_REALES.tasa_confirmacion, BENCHMARKS.tasa_confirmacion),
                  diagBenchmark(DATOS_REALES.tasa_despacho, BENCHMARKS.tasa_despacho),
                  diagBenchmark(DATOS_REALES.tasa_entrega, BENCHMARKS.tasa_entrega),
                  diagBenchmark(DATOS_REALES.tasa_devolucion, BENCHMARKS.tasa_devolucion),
                ]
                const verdes = scores.filter(s => s.color === '#2DD4A0').length
                const amarillos = scores.filter(s => s.color === '#F5A623').length
                const rojos = scores.filter(s => s.color === '#F05C5C').length
                const score = Math.round((verdes*100 + amarillos*60 + rojos*20) / scores.length)
                const scoreColor = score >= 75 ? '#2DD4A0' : score >= 50 ? '#F5A623' : '#F05C5C'
                return (
                  <>
                    <div style={{ textAlign:'center', marginBottom:'16px' }}>
                      <div style={{ fontSize:'52px', fontWeight:'900', color:scoreColor }}>{score}</div>
                      <div style={{ fontSize:'13px', color:'#8B96A8' }}>Score del embudo /100</div>
                      <div style={{ fontSize:'12px', color:scoreColor, fontWeight:'700', marginTop:'4px' }}>
                        {score >= 75 ? '✅ Embudo saludable' : score >= 50 ? '⚠️ Embudo con oportunidades' : '❌ Embudo con problemas críticos'}
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:'10px', justifyContent:'center', marginBottom:'14px' }}>
                      {[{n:verdes,l:'Excelente/Bueno',c:'#2DD4A0'},{n:amarillos,l:'Aceptable',c:'#F5A623'},{n:rojos,l:'Crítico',c:'#F05C5C'}].map((s,i) => (
                        <div key={i} style={{ textAlign:'center', padding:'8px 12px', background:`${s.c}10`, borderRadius:'8px' }}>
                          <div style={{ fontSize:'20px', fontWeight:'800', color:s.c }}>{s.n}</div>
                          <div style={{ fontSize:'10px', color:'#5A6478' }}>{s.l}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )
              })()}

              {/* Top oportunidades */}
              <div style={{ fontSize:'11px', fontWeight:'700', color:'#5A6478', marginBottom:'8px' }}>TOP OPORTUNIDADES DE MEJORA</div>
              {[
                { orden:1, area:'Confirmación', desc:`+5% confirmación = +${Math.round(DATOS_REALES.pedidos_confirmados*0.05*DATOS_REALES.tasa_despacho/100*DATOS_REALES.tasa_entrega/100*DATOS_REALES.ganancia_por_pedido/1000)}K ganancia/mes`, color:'#F5A623' },
                { orden:2, area:'CTR creativos', desc:`+0.5% CTR = +${Math.round(DATOS_REALES.impresiones*0.005*DATOS_REALES.conv_rate/100*DATOS_REALES.tasa_confirmacion/100*DATOS_REALES.tasa_entrega/100*DATOS_REALES.ganancia_por_pedido/1000)}K ganancia/mes`, color:'#3D8EF0' },
                { orden:3, area:'Tasa entrega', desc:`+5% entrega = +${Math.round(DATOS_REALES.pedidos_despachados*0.05*DATOS_REALES.ganancia_por_pedido/1000)}K ganancia/mes`, color:'#9B6BFF' },
              ].map((o, i) => (
                <div key={i} style={{ display:'flex', gap:'10px', padding:'8px 10px', borderRadius:'7px', marginBottom:'5px', background:`${o.color}08` }}>
                  <span style={{ fontSize:'14px', fontWeight:'800', color:o.color, flexShrink:0 }}>#{o.orden}</span>
                  <div>
                    <div style={{ fontSize:'12px', fontWeight:'700', color:'#E8EDF5' }}>{o.area}</div>
                    <div style={{ fontSize:'11px', color:'#5A6478' }}>{o.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB SIMULADOR */}
      {tab === 'simulador' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          {/* Palancas */}
          <div style={{ ...s, padding:'20px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'6px' }}>⚡ SIMULADOR DE MEJORA POR PALANCA</div>
            <div style={{ fontSize:'12px', color:'#8B96A8', marginBottom:'16px' }}>Ajusta cada indicador y ve el impacto en la ganancia real.</div>

            {[
              { label:'CTR', val:simCTR, set:setSimCTR, min:0.5, max:5, step:0.1, unidad:'%', actual:DATOS_REALES.ctr, bm:BENCHMARKS.ctr },
              { label:'Conv. Rate', val:simConv, set:setSimConv, min:1, max:20, step:0.1, unidad:'%', actual:DATOS_REALES.conv_rate, bm:BENCHMARKS.conv_rate },
              { label:'% Confirmación', val:simConf, set:setSimConf, min:30, max:95, step:1, unidad:'%', actual:DATOS_REALES.tasa_confirmacion, bm:BENCHMARKS.tasa_confirmacion },
              { label:'% Despacho', val:simDespacho, set:setSimDespacho, min:50, max:98, step:1, unidad:'%', actual:DATOS_REALES.tasa_despacho, bm:BENCHMARKS.tasa_despacho },
              { label:'% Entrega', val:simEntrega, set:setSimEntrega, min:50, max:98, step:1, unidad:'%', actual:DATOS_REALES.tasa_entrega, bm:BENCHMARKS.tasa_entrega },
              { label:'% Devolución', val:simDev, set:setSimDev, min:1, max:30, step:1, unidad:'%', actual:DATOS_REALES.tasa_devolucion, bm:BENCHMARKS.tasa_devolucion },
            ].map((sl, i) => {
              const diag = diagBenchmark(sl.val, sl.bm)
              const cambio = sl.val - sl.actual
              return (
                <div key={i} style={{ marginBottom:'14px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'3px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                      <span style={{ fontSize:'12px', color:'#8B96A8' }}>{sl.label}</span>
                      {cambio !== 0 && <span style={{ fontSize:'10px', color: cambio > 0 ? '#2DD4A0' : '#F05C5C', fontWeight:'700' }}>
                        {cambio > 0 ? '+' : ''}{cambio.toFixed(1)}
                      </span>}
                    </div>
                    <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                      <span style={{ fontSize:'10px', color:'#5A6478' }}>Actual: {sl.actual}{sl.unidad}</span>
                      <span style={{ fontSize:'13px', fontWeight:'800', color:diag.color }}>{sl.val}{sl.unidad}</span>
                    </div>
                  </div>
                  {sld(sl.val, sl.set, sl.min, sl.max, sl.step)}
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'9px', color:'#5A6478' }}>
                    <span>{sl.min}{sl.unidad}</span>
                    <span style={{ color:diag.color }}>{diag.icono} {diag.label}</span>
                    <span>{sl.max}{sl.unidad}</span>
                  </div>
                </div>
              )
            })}

            <button onClick={() => { setSimCTR(DATOS_REALES.ctr); setSimConv(DATOS_REALES.conv_rate); setSimConf(DATOS_REALES.tasa_confirmacion); setSimDespacho(DATOS_REALES.tasa_despacho); setSimEntrega(DATOS_REALES.tasa_entrega); setSimDev(DATOS_REALES.tasa_devolucion) }}
              style={{ width:'100%', padding:'8px', background:'rgba(255,255,255,0.05)', border:'none', borderRadius:'8px', color:'#8B96A8', cursor:'pointer', fontSize:'12px', marginTop:'4px' }}>
              🔄 Resetear a valores actuales
            </button>
          </div>

          {/* Resultados simulación */}
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {/* Impacto */}
            <div style={{ ...s, padding:'20px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#2DD4A0', marginBottom:'14px' }}>📊 RESULTADO DE LA SIMULACIÓN</div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'14px' }}>
                {[
                  { label:'Clics simulados', actual:DATOS_REALES.clics, sim:sim_clics, color:'#3D8EF0' },
                  { label:'Compras simuladas', actual:DATOS_REALES.compras_fb, sim:sim_compras, color:'#F5A623' },
                  { label:'Confirmados', actual:DATOS_REALES.pedidos_confirmados, sim:sim_confirmados, color:'#F5A623' },
                  { label:'Despachados', actual:DATOS_REALES.pedidos_despachados, sim:sim_despachados, color:'#9B6BFF' },
                  { label:'Entregados', actual:DATOS_REALES.pedidos_entregados, sim:sim_entregados, color:'#2DD4A0' },
                  { label:'Entregados netos', actual:DATOS_REALES.pedidos_entregados-DATOS_REALES.pedidos_devueltos, sim:sim_entregados_netos, color:'#2DD4A0' },
                ].map((k, i) => {
                  const diff = k.sim - k.actual
                  return (
                    <div key={i} style={{ background:'rgba(255,255,255,0.02)', borderRadius:'8px', padding:'10px 12px' }}>
                      <div style={{ fontSize:'10px', color:'#5A6478', marginBottom:'4px' }}>{k.label}</div>
                      <div style={{ display:'flex', gap:'6px', alignItems:'baseline' }}>
                        <span style={{ fontSize:'16px', fontWeight:'800', color:k.color }}>{k.sim.toLocaleString()}</span>
                        <span style={{ fontSize:'11px', fontWeight:'700', color: diff >= 0 ? '#2DD4A0' : '#F05C5C' }}>
                          {diff >= 0 ? '+' : ''}{diff.toLocaleString()}
                        </span>
                      </div>
                      <div style={{ fontSize:'10px', color:'#5A6478' }}>Actual: {k.actual.toLocaleString()}</div>
                    </div>
                  )
                })}
              </div>

              {/* Impacto financiero */}
              <div style={{ padding:'14px', background: mejora_ganancia >= 0 ? 'rgba(45,212,160,0.08)' : 'rgba(240,92,92,0.08)', borderRadius:'10px', border:`1px solid ${mejora_ganancia >= 0 ? 'rgba(45,212,160,0.2)' : 'rgba(240,92,92,0.2)'}` }}>
                <div style={{ fontSize:'12px', color:'#8B96A8', marginBottom:'8px' }}>IMPACTO FINANCIERO</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                  <div>
                    <div style={{ fontSize:'10px', color:'#5A6478' }}>Ganancia actual</div>
                    <div style={{ fontSize:'16px', fontWeight:'800', color:'#8B96A8' }}>{fmt(ganancia_actual)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize:'10px', color:'#5A6478' }}>Ganancia simulada</div>
                    <div style={{ fontSize:'16px', fontWeight:'800', color: mejora_ganancia >= 0 ? '#2DD4A0' : '#F05C5C' }}>{fmt(sim_ganancia)}</div>
                  </div>
                </div>
                <div style={{ marginTop:'10px', textAlign:'center' }}>
                  <div style={{ fontSize:'11px', color:'#8B96A8' }}>Diferencia mensual</div>
                  <div style={{ fontSize:'22px', fontWeight:'900', color: mejora_ganancia >= 0 ? '#2DD4A0' : '#F05C5C' }}>
                    {mejora_ganancia >= 0 ? '+' : ''}{fmt(mejora_ganancia)}
                  </div>
                  <div style={{ fontSize:'11px', color:'#5A6478', marginTop:'2px' }}>
                    = {fmt(mejora_ganancia * 12)} al año
                  </div>
                </div>
              </div>
            </div>

            {/* La palanca más poderosa */}
            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'12px' }}>🎯 ¿QUÉ PALANCA MOVER PRIMERO?</div>
              {[
                { palanca:'Confirmación +5%', impacto:Math.round(DATOS_REALES.pedidos_confirmados*0.05*0.78*0.78*DATOS_REALES.ganancia_por_pedido), dificultad:'Fácil', color:'#2DD4A0' },
                { palanca:'CTR +0.5%', impacto:Math.round(DATOS_REALES.impresiones*0.005*DATOS_REALES.conv_rate/100*0.62*0.78*0.78*DATOS_REALES.ganancia_por_pedido), dificultad:'Media', color:'#F5A623' },
                { palanca:'Entrega +5%', impacto:Math.round(DATOS_REALES.pedidos_despachados*0.05*DATOS_REALES.ganancia_por_pedido), dificultad:'Media', color:'#9B6BFF' },
                { palanca:'Conv. Rate +2%', impacto:Math.round(DATOS_REALES.visitantes_efectivos*0.02*0.62*0.78*0.78*DATOS_REALES.ganancia_por_pedido), dificultad:'Difícil', color:'#3D8EF0' },
              ].sort((a,b) => b.impacto-a.impacto).map((p, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'8px 10px', borderRadius:'7px', marginBottom:'5px', background:`${p.color}08` }}>
                  <span style={{ fontSize:'14px', fontWeight:'800', color:p.color, width:'20px', flexShrink:0 }}>#{i+1}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'12px', fontWeight:'600', color:'#E8EDF5' }}>{p.palanca}</div>
                    <div style={{ fontSize:'10px', color:'#5A6478' }}>Dificultad: {p.dificultad}</div>
                  </div>
                  <span style={{ fontSize:'13px', fontWeight:'800', color:p.color }}>+{fmt(p.impacto)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB BENCHMARKS */}
      {tab === 'benchmarks' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div style={{ ...s, overflow:'hidden' }}>
            <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', fontWeight:'700' }}>
              📊 Benchmarks Dropshipping Colombia — Tu resultado vs mercado
            </div>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
              <thead>
                <tr style={{ background:'#0A0D14', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                  {['Métrica','Tu valor','Mínimo','Bueno','Excelente','Estado'].map(h => (
                    <th key={h} style={{ padding:'9px 12px', textAlign:'left', fontSize:'10px', color:'#5A6478', fontWeight:'700' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { metrica:'CPM (COP)', tuval:DATOS_REALES.cpm, bm:BENCHMARKS.cpm, inv:true },
                  { metrica:'CTR (%)', tuval:DATOS_REALES.ctr, bm:BENCHMARKS.ctr, inv:false },
                  { metrica:'Conv. Rate (%)', tuval:DATOS_REALES.conv_rate, bm:BENCHMARKS.conv_rate, inv:false },
                  { metrica:'% Confirmación', tuval:DATOS_REALES.tasa_confirmacion, bm:BENCHMARKS.tasa_confirmacion, inv:false },
                  { metrica:'% Despacho', tuval:DATOS_REALES.tasa_despacho, bm:BENCHMARKS.tasa_despacho, inv:false },
                  { metrica:'% Entrega', tuval:DATOS_REALES.tasa_entrega, bm:BENCHMARKS.tasa_entrega, inv:false },
                  { metrica:'% Devolución', tuval:DATOS_REALES.tasa_devolucion, bm:BENCHMARKS.tasa_devolucion, inv:true },
                ].map((row, i) => {
                  const diag = diagBenchmark(row.tuval, row.bm)
                  return (
                    <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding:'10px 12px', fontWeight:'600' }}>{row.metrica}</td>
                      <td style={{ padding:'10px 12px', fontWeight:'800', color:diag.color }}>{row.tuval}</td>
                      <td style={{ padding:'10px 12px', color:'#F05C5C' }}>{row.bm.min}</td>
                      <td style={{ padding:'10px 12px', color:'#F5A623' }}>{row.bm.bueno}</td>
                      <td style={{ padding:'10px 12px', color:'#2DD4A0' }}>{row.bm.excelente}</td>
                      <td style={{ padding:'10px 12px' }}>
                        <span style={{ fontSize:'11px', padding:'2px 8px', borderRadius:'5px', fontWeight:'700',
                          background:`${diag.color}15`, color:diag.color }}>
                          {diag.icono} {diag.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div style={{ ...s, padding:'20px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#9B6BFF', marginBottom:'14px' }}>💡 GUÍA DE ACCIÓN POR INDICADOR</div>
            {[
              { icon:'🖱️', metrica:'CTR bajo (<1%)', accion:'Cambiar hook del video, probar imágenes vs video, variar copy del anuncio' },
              { icon:'🌐', metrica:'Conv. Rate bajo (<3%)', accion:'Mejorar velocidad landing, mostrar precio claramente, agregar testimonios, CTA más visible' },
              { icon:'📞', metrica:'Confirmación baja (<50%)', accion:'WhatsApp inmediato post-pedido, máx 2h. Llamar 3 veces distintos horarios. Mensaje directo y específico' },
              { icon:'📦', metrica:'Despacho bajo (<70%)', accion:'Confirmar dirección antes de despachar. Evitar despachar pedidos no confirmados' },
              { icon:'🚚', metrica:'Entrega baja (<65%)', accion:'Gestionar novedades en primeras 24h. Llamar al cliente. Cambiar transportadora en zonas con bajo desempeño' },
              { icon:'🔄', metrica:'Devolución alta (>15%)', accion:'Mejorar descripción del producto. Filtrar mejor las audiencias. Verificar calidad del producto' },
            ].map((a, i) => (
              <div key={i} style={{ display:'flex', gap:'10px', padding:'10px 12px', borderRadius:'8px', marginBottom:'7px', background:'rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize:'20px', flexShrink:0 }}>{a.icon}</span>
                <div>
                  <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'3px' }}>{a.metrica}</div>
                  <div style={{ fontSize:'11px', color:'#8B96A8', lineHeight:'1.5' }}>{a.accion}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
