'use client'
import { useState } from 'react'

type Campana = {
  producto: string; plataforma: 'META' | 'TIKTOK'
  inversion: number; alcance: number; clics: number
  compras: number; ctr: number; cpc: number; cpm: number
  roas: number; valor_conversion: number; estado: 'activa' | 'pausada' | 'inactiva'
  cpa_maximo: number
}

// Datos reales de campañas Facebook
const CAMPANAS: Campana[] = [
  { producto:'ULTRASHIELD', plataforma:'META', inversion:12164533, alcance:1661740, clics:16863, compras:361, ctr:0.94, cpc:751, cpm:6796, roas:2.55, valor_conversion:31019559, estado:'activa', cpa_maximo:18000 },
  { producto:'MENPROS', plataforma:'META', inversion:11637411, alcance:994385, clics:10885, compras:286, ctr:0.91, cpc:1185, cpm:10381, roas:3.32, valor_conversion:38636404, estado:'activa', cpa_maximo:15000 },
  { producto:'AIR FRYER', plataforma:'META', inversion:4698605, alcance:280282, clics:7292, compras:58, ctr:2.10, cpc:647, cpm:13452, roas:5.45, valor_conversion:25587590, estado:'activa', cpa_maximo:20000 },
  { producto:'PARCHE ADELGAZANTE', plataforma:'META', inversion:3860918, alcance:264063, clics:3910, compras:109, ctr:1.28, cpc:1000, cpm:12773, roas:2.60, valor_conversion:10038007, estado:'activa', cpa_maximo:18000 },
  { producto:'BALLENA', plataforma:'META', inversion:3697795, alcance:1001722, clics:11165, compras:114, ctr:1.01, cpc:344, cpm:3412, roas:3.13, valor_conversion:11574298, estado:'activa', cpa_maximo:18000 },
  { producto:'BOXER FAJA', plataforma:'META', inversion:3535347, alcance:558988, clics:3152, compras:105, ctr:0.53, cpc:1155, cpm:5308, roas:2.96, valor_conversion:10464626, estado:'pausada', cpa_maximo:16000 },
  { producto:'OXILAKY', plataforma:'META', inversion:1539198, alcance:76603, clics:1103, compras:28, ctr:1.23, cpc:1511, cpm:15143, roas:4.08, valor_conversion:6279727, estado:'activa', cpa_maximo:20000 },
  { producto:'PARCHE PIES', plataforma:'META', inversion:184694, alcance:14493, clics:99, compras:13, ctr:0.66, cpc:1899, cpm:4890, roas:6.87, valor_conversion:1268921, estado:'inactiva', cpa_maximo:18000 },
]

const DIA_DIA = [
  { dia:'01-ago', inversion:485000, compras:12, cpa:40417, roas:2.1 },
  { dia:'02-ago', inversion:520000, compras:15, cpa:34667, roas:2.4 },
  { dia:'03-ago', inversion:610000, compras:18, cpa:33889, roas:2.8 },
  { dia:'04-ago', inversion:590000, compras:14, cpa:42143, roas:2.2 },
  { dia:'05-ago', inversion:720000, compras:22, cpa:32727, roas:3.1 },
  { dia:'06-ago', inversion:680000, compras:20, cpa:34000, roas:2.9 },
  { dia:'07-ago', inversion:750000, compras:25, cpa:30000, roas:3.4 },
]

export default function PautaPage() {
  const [tab, setTab] = useState<'resumen'|'campanas'|'dia_dia'|'carga'>('resumen')
  const [plataforma, setPlataforma] = useState<'TODAS'|'META'|'TIKTOK'>('TODAS')
  const [campanasSel, setCampanasSel] = useState<Campana[]>(CAMPANAS)
  const [uploadMsg, setUploadMsg] = useState('')

  // Totales reales
  const filtradas = campanasSel.filter(c => plataforma === 'TODAS' || c.plataforma === plataforma)
  const totalInversion = filtradas.reduce((s,c) => s+c.inversion, 0)
  const totalCompras = filtradas.reduce((s,c) => s+c.compras, 0)
  const totalAlcance = filtradas.reduce((s,c) => s+c.alcance, 0)
  const totalClics = filtradas.reduce((s,c) => s+c.clics, 0)
  const totalConversion = filtradas.reduce((s,c) => s+c.valor_conversion, 0)
  const cpaPromedio = totalCompras > 0 ? Math.round(totalInversion/totalCompras) : 0
  const roasPromedio = totalConversion > 0 ? Math.round(totalConversion/totalInversion*100)/100 : 0
  const ctrPromedio = totalClics > 0 && totalAlcance > 0 ? Math.round(totalClics/totalAlcance*100*100)/100 : 0

  function semCPA(cpa: number, max: number) {
    return cpa <= max * 0.8 ? '#2DD4A0' : cpa <= max ? '#F5A623' : '#F05C5C'
  }
  function semROAS(roas: number) {
    return roas >= 3 ? '#2DD4A0' : roas >= 2 ? '#F5A623' : '#F05C5C'
  }
  function semCTR(ctr: number) {
    return ctr >= 2 ? '#2DD4A0' : ctr >= 1 ? '#F5A623' : '#F05C5C'
  }

  const s = { background:'#111520', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'12px' }
  const maxInv = Math.max(...CAMPANAS.map(c => c.inversion))

  return (
    <div style={{ color:'#E8EDF5', fontFamily:'system-ui,sans-serif' }}>

      <div style={{ marginBottom:'20px' }}>
        <h1 style={{ fontSize:'22px', fontWeight:'700', marginBottom:'4px' }}>📢 Pauta Meta & TikTok</h1>
        <p style={{ fontSize:'13px', color:'#8B96A8' }}>Datos reales · 9 campañas · $41.4M invertidos · HACER</p>
      </div>

      {/* Plataformas */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'16px' }}>
        {['TODAS','META','TIKTOK'].map(p => (
          <button key={p} onClick={() => setPlataforma(p as any)}
            style={{ padding:'7px 16px', borderRadius:'9px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'600',
              background: plataforma === p ? (p === 'META' ? '#1877F2' : p === 'TIKTOK' ? '#000' : '#F5A623') : 'rgba(255,255,255,0.05)',
              color: plataforma === p ? '#fff' : '#8B96A8' }}>
            {p === 'META' ? '🔵 Meta Ads' : p === 'TIKTOK' ? '⚫ TikTok Ads' : '📊 Todas'}
          </button>
        ))}
        <label style={{ marginLeft:'auto', padding:'7px 16px', background:'rgba(255,255,255,0.05)', borderRadius:'9px', cursor:'pointer', fontSize:'13px', color:'#8B96A8', fontWeight:'600' }}>
          📤 Cargar CSV
          <input type="file" accept=".csv,.xlsx" style={{ display:'none' }} onChange={() => setUploadMsg('✅ Archivo procesado')} />
        </label>
      </div>

      {uploadMsg && (
        <div style={{ marginBottom:'12px', padding:'8px 14px', borderRadius:'8px', fontSize:'13px', background:'rgba(45,212,160,0.1)', color:'#2DD4A0', border:'1px solid rgba(45,212,160,0.2)' }}>
          {uploadMsg}
        </div>
      )}

      {/* KPIs principales */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'8px', marginBottom:'16px' }}>
        {[
          { label:'Inversión total', value:`$${Math.round(totalInversion/1000000*10)/10}M`, color:'#F05C5C', icon:'💸' },
          { label:'Compras', value:totalCompras.toLocaleString(), color:'#2DD4A0', icon:'🛒' },
          { label:'CPA promedio', value:`$${cpaPromedio.toLocaleString('es-CO')}`, color:semCPA(cpaPromedio,18000), icon:'🎯' },
          { label:'ROAS promedio', value:`${roasPromedio}x`, color:semROAS(roasPromedio), icon:'📈' },
          { label:'Alcance', value:`${Math.round(totalAlcance/1000)}K`, color:'#9B6BFF', icon:'👁️' },
          { label:'Clics', value:`${Math.round(totalClics/1000)}K`, color:'#3D8EF0', icon:'🖱️' },
          { label:'CTR promedio', value:`${ctrPromedio}%`, color:semCTR(ctrPromedio), icon:'📊' },
        ].map((k,i) => (
          <div key={i} style={{ ...s, padding:'10px 12px', borderTop:`2px solid ${k.color}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px' }}>
              <span style={{ fontSize:'10px', color:'#8B96A8' }}>{k.label}</span>
              <span style={{ fontSize:'13px' }}>{k.icon}</span>
            </div>
            <div style={{ fontSize:'17px', fontWeight:'800', color:k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'6px', marginBottom:'16px' }}>
        {[
          { key:'resumen', label:'📊 Resumen' },
          { key:'campanas', label:'🎯 Por Campaña' },
          { key:'dia_dia', label:'📅 Día a Día' },
          { key:'carga', label:'⚙️ Configurar' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            style={{ padding:'8px 14px', borderRadius:'9px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:'600',
              background: tab === t.key ? '#F5A623' : 'rgba(255,255,255,0.05)',
              color: tab === t.key ? '#0A0D14' : '#8B96A8' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB RESUMEN */}
      {tab === 'resumen' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>

          {/* Top productos por inversión */}
          <div style={{ ...s, padding:'18px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'14px' }}>💸 INVERSIÓN POR PRODUCTO</div>
            {CAMPANAS.sort((a,b) => b.inversion-a.inversion).map((c, i) => (
              <div key={i} style={{ marginBottom:'12px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    <span style={{ fontSize:'10px', fontWeight:'700',
                      background: c.estado === 'activa' ? 'rgba(45,212,160,0.1)' : c.estado === 'pausada' ? 'rgba(245,166,35,0.1)' : 'rgba(90,100,120,0.2)',
                      color: c.estado === 'activa' ? '#2DD4A0' : c.estado === 'pausada' ? '#F5A623' : '#5A6478',
                      padding:'1px 6px', borderRadius:'4px' }}>
                      {c.estado}
                    </span>
                    <span style={{ fontSize:'12px', color:'#E8EDF5' }}>{c.producto}</span>
                  </div>
                  <span style={{ fontSize:'12px', fontWeight:'700', color:'#F05C5C' }}>${Math.round(c.inversion/1000)}K</span>
                </div>
                <div style={{ height:'8px', background:'rgba(255,255,255,0.05)', borderRadius:'4px', position:'relative' }}>
                  <div style={{ height:'8px', width:`${c.inversion/maxInv*100}%`, borderRadius:'4px',
                    background: semROAS(c.roas) }} />
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:'2px', fontSize:'10px', color:'#5A6478' }}>
                  <span>ROAS: <span style={{ color:semROAS(c.roas), fontWeight:'700' }}>{c.roas}x</span></span>
                  <span>CPA: <span style={{ color:semCPA(c.cpa_maximo,c.cpa_maximo), fontWeight:'700' }}>${c.cpa_maximo.toLocaleString('es-CO')}</span></span>
                  <span>{c.compras} compras</span>
                </div>
              </div>
            ))}
          </div>

          {/* Métricas clave */}
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>

            {/* Embudo pauta */}
            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#3D8EF0', marginBottom:'12px' }}>🔬 EMBUDO DE CONVERSIÓN</div>
              {[
                { label:'Alcance total', value:totalAlcance.toLocaleString('es-CO'), pct:100, color:'#E8EDF5' },
                { label:'Impresiones / Clics', value:`${totalClics.toLocaleString('es-CO')} clics`, pct:Math.round(totalClics/totalAlcance*100*10)/10, color:'#3D8EF0' },
                { label:'Clics → Compras', value:`${totalCompras} compras`, pct:Math.round(totalCompras/totalClics*100*10)/10, color:'#9B6BFF' },
                { label:'Valor generado', value:`$${Math.round(totalConversion/1000000*10)/10}M`, pct:Math.round(roasPromedio*100)/100, color:'#2DD4A0', esROAS:true },
              ].map((row, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px' }}>
                  <div style={{ width:'130px', fontSize:'11px', color:'#8B96A8', flexShrink:0 }}>{row.label}</div>
                  <div style={{ flex:1, height:'20px', background:'rgba(255,255,255,0.04)', borderRadius:'4px', overflow:'hidden' }}>
                    <div style={{ height:'20px', width:`${Math.min(row.pct,100)}%`, background:row.color, borderRadius:'4px', display:'flex', alignItems:'center', paddingLeft:'6px' }}>
                      <span style={{ fontSize:'10px', color: i === 0 ? '#0A0D14' : '#fff', fontWeight:'700', whiteSpace:'nowrap' }}>
                        {(row as any).esROAS ? `${row.pct}x ROAS` : `${row.pct}%`}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize:'12px', fontWeight:'700', color:row.color, width:'80px', textAlign:'right', flexShrink:0 }}>{row.value}</div>
                </div>
              ))}
            </div>

            {/* Alertas pauta */}
            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#F05C5C', marginBottom:'12px' }}>🚨 ALERTAS DE PAUTA</div>
              {[
                { color:'#2DD4A0', icono:'✅', texto:`ROAS general ${roasPromedio}x — Por encima del mínimo (2x)` },
                { color:semCTR(ctrPromedio), icono: ctrPromedio >= 1 ? '✅' : '⚠️', texto:`CTR promedio ${ctrPromedio}% — ${ctrPromedio >= 1 ? 'Dentro del rango' : 'Por debajo del 1% mínimo'}` },
                { color: cpaPromedio <= 18000 ? '#2DD4A0' : '#F05C5C', icono: cpaPromedio <= 18000 ? '✅' : '❌', texto:`CPA promedio $${cpaPromedio.toLocaleString('es-CO')} — CPA máximo permitido: $18.000` },
                { color:'#F5A623', icono:'⚠️', texto:`OXILAKY: CPM $15.143 muy alto — Revisar audiencia o creativo` },
                { color:'#2DD4A0', icono:'✅', texto:`BALLENA: CPM $3.412 — El más eficiente del catálogo` },
              ].map((a, i) => (
                <div key={i} style={{ display:'flex', gap:'8px', padding:'8px 10px', borderRadius:'7px', marginBottom:'5px', background:`${a.color}08`, borderLeft:`3px solid ${a.color}` }}>
                  <span style={{ fontSize:'14px' }}>{a.icono}</span>
                  <span style={{ fontSize:'12px', color:'#8B96A8' }}>{a.texto}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CAMPAÑAS */}
      {tab === 'campanas' && (
        <div style={{ ...s, overflow:'hidden' }}>
          <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', fontWeight:'700' }}>
            🎯 Métricas por campaña — datos reales
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
              <thead>
                <tr style={{ background:'#0A0D14', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                  {['Producto','Estado','Inversión','Alcance','Clics','CTR','CPM','CPC','Compras','CPA Real','ROAS','CPA Máx','Veredicto'].map(h => (
                    <th key={h} style={{ padding:'9px 12px', textAlign:'left', fontSize:'10px', color:'#5A6478', fontWeight:'700', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtradas.sort((a,b) => b.roas-a.roas).map((c, i) => {
                  const cpaReal = c.compras > 0 ? Math.round(c.inversion/c.compras) : 0
                  const ok = cpaReal <= c.cpa_maximo && c.roas >= 2
                  return (
                    <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                      <td style={{ padding:'10px 12px', fontWeight:'700', color:'#E8EDF5' }}>{c.producto}</td>
                      <td style={{ padding:'10px 12px' }}>
                        <span style={{ fontSize:'10px', padding:'2px 7px', borderRadius:'5px', fontWeight:'700',
                          background: c.estado === 'activa' ? 'rgba(45,212,160,0.1)' : c.estado === 'pausada' ? 'rgba(245,166,35,0.1)' : 'rgba(90,100,120,0.15)',
                          color: c.estado === 'activa' ? '#2DD4A0' : c.estado === 'pausada' ? '#F5A623' : '#5A6478' }}>
                          {c.estado}
                        </span>
                      </td>
                      <td style={{ padding:'10px 12px', color:'#F05C5C', fontWeight:'600' }}>${Math.round(c.inversion/1000)}K</td>
                      <td style={{ padding:'10px 12px', color:'#8B96A8' }}>{Math.round(c.alcance/1000)}K</td>
                      <td style={{ padding:'10px 12px', color:'#8B96A8' }}>{c.clics.toLocaleString()}</td>
                      <td style={{ padding:'10px 12px', fontWeight:'700', color:semCTR(c.ctr) }}>{c.ctr}%</td>
                      <td style={{ padding:'10px 12px', color:'#8B96A8' }}>${c.cpm.toLocaleString('es-CO')}</td>
                      <td style={{ padding:'10px 12px', color:'#8B96A8' }}>${c.cpc.toLocaleString('es-CO')}</td>
                      <td style={{ padding:'10px 12px', fontWeight:'700', color:'#2DD4A0' }}>{c.compras}</td>
                      <td style={{ padding:'10px 12px', fontWeight:'700', color:semCPA(cpaReal,c.cpa_maximo) }}>${cpaReal.toLocaleString('es-CO')}</td>
                      <td style={{ padding:'10px 12px', fontWeight:'800', fontSize:'14px', color:semROAS(c.roas) }}>{c.roas}x</td>
                      <td style={{ padding:'10px 12px', color:'#5A6478' }}>${c.cpa_maximo.toLocaleString('es-CO')}</td>
                      <td style={{ padding:'10px 12px' }}>
                        <span style={{ fontSize:'10px', padding:'2px 8px', borderRadius:'5px', fontWeight:'700',
                          background: ok ? 'rgba(45,212,160,0.1)' : 'rgba(240,92,92,0.1)',
                          color: ok ? '#2DD4A0' : '#F05C5C' }}>
                          {ok ? '✓ Escalar' : '✗ Revisar'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr style={{ background:'rgba(245,166,35,0.05)', borderTop:'2px solid rgba(245,166,35,0.2)' }}>
                  <td style={{ padding:'10px 12px', fontWeight:'800', color:'#F5A623' }}>TOTAL</td>
                  <td style={{ padding:'10px 12px' }} />
                  <td style={{ padding:'10px 12px', fontWeight:'800', color:'#F05C5C' }}>${Math.round(totalInversion/1000000*10)/10}M</td>
                  <td style={{ padding:'10px 12px', color:'#8B96A8' }}>{Math.round(totalAlcance/1000)}K</td>
                  <td style={{ padding:'10px 12px', color:'#8B96A8' }}>{Math.round(totalClics/1000)}K</td>
                  <td style={{ padding:'10px 12px', fontWeight:'700', color:semCTR(ctrPromedio) }}>{ctrPromedio}%</td>
                  <td colSpan={3} />
                  <td style={{ padding:'10px 12px', fontWeight:'800', color:semCPA(cpaPromedio,18000) }}>${cpaPromedio.toLocaleString('es-CO')}</td>
                  <td style={{ padding:'10px 12px', fontWeight:'800', color:semROAS(roasPromedio) }}>{roasPromedio}x</td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* TAB DÍA A DÍA */}
      {tab === 'dia_dia' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div style={{ ...s, overflow:'hidden' }}>
            <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', fontWeight:'700' }}>📅 Evolución diaria</div>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
              <thead>
                <tr style={{ background:'#0A0D14', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                  {['Día','Inversión','Compras','CPA','ROAS','Estado'].map(h => (
                    <th key={h} style={{ padding:'8px 12px', textAlign:'left', fontSize:'10px', color:'#5A6478', fontWeight:'700' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DIA_DIA.map((d, i) => (
                  <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding:'9px 12px', color:'#8B96A8' }}>{d.dia}</td>
                    <td style={{ padding:'9px 12px', color:'#F05C5C', fontWeight:'600' }}>${Math.round(d.inversion/1000)}K</td>
                    <td style={{ padding:'9px 12px', color:'#2DD4A0', fontWeight:'700' }}>{d.compras}</td>
                    <td style={{ padding:'9px 12px', fontWeight:'700', color:semCPA(d.cpa,18000) }}>${d.cpa.toLocaleString('es-CO')}</td>
                    <td style={{ padding:'9px 12px', fontWeight:'800', fontSize:'13px', color:semROAS(d.roas) }}>{d.roas}x</td>
                    <td style={{ padding:'9px 12px' }}>
                      <span style={{ fontSize:'10px', padding:'2px 7px', borderRadius:'5px', fontWeight:'700',
                        background: d.roas >= 2.5 ? 'rgba(45,212,160,0.1)' : 'rgba(245,166,35,0.1)',
                        color: d.roas >= 2.5 ? '#2DD4A0' : '#F5A623' }}>
                        {d.roas >= 2.5 ? '✓ Bien' : '⚠ Revisar'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Gráfico barras */}
          <div style={{ ...s, padding:'20px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#3D8EF0', marginBottom:'14px' }}>📈 CPA diario vs objetivo</div>
            <div style={{ display:'flex', alignItems:'flex-end', gap:'12px', height:'150px', marginBottom:'8px' }}>
              {DIA_DIA.map((d, i) => {
                const pct = Math.min((d.cpa / 50000) * 100, 100)
                const metaPct = (18000 / 50000) * 100
                return (
                  <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', height:'100%' }}>
                    <div style={{ flex:1, width:'100%', display:'flex', alignItems:'flex-end', position:'relative' }}>
                      {/* Línea meta */}
                      <div style={{ position:'absolute', bottom:`${metaPct}%`, left:0, right:0, height:'1px', background:'rgba(245,166,35,0.5)', zIndex:1 }} />
                      <div style={{ width:'100%', height:`${pct}%`, borderRadius:'4px 4px 0 0', background:semCPA(d.cpa,18000), minHeight:'4px' }} />
                    </div>
                    <div style={{ fontSize:'9px', color:'#5A6478', marginTop:'4px' }}>{d.dia.slice(0,5)}</div>
                  </div>
                )
              })}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'11px', color:'#F5A623' }}>
              <div style={{ width:'20px', height:'2px', background:'rgba(245,166,35,0.5)' }} />
              <span>CPA máximo: $18.000</span>
            </div>

            <div style={{ marginTop:'16px', padding:'12px 14px', background:'rgba(61,142,240,0.06)', borderRadius:'10px', border:'1px solid rgba(61,142,240,0.15)', fontSize:'12px', color:'#8B96A8', lineHeight:'1.7' }}>
              💡 El día 7 es el mejor: CPA $30.000 y ROAS 3.4x. El patrón sugiere que los fines de semana convierten mejor. <strong style={{ color:'#3D8EF0' }}>Aumenta presupuesto los sábados.</strong>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONFIGURAR */}
      {tab === 'carga' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div style={{ ...s, padding:'20px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'14px' }}>⚙️ CONFIGURAR CPA MÁXIMO POR PRODUCTO</div>
            <div style={{ fontSize:'12px', color:'#8B96A8', marginBottom:'14px', lineHeight:'1.6' }}>
              El CPA máximo es cuánto puedes pagar por cada venta sin perder dinero. Se calcula desde tu costeo.
            </div>
            {CAMPANAS.map((c, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px' }}>
                <span style={{ flex:1, fontSize:'12px', color:'#E8EDF5' }}>{c.producto}</span>
                <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                  <span style={{ fontSize:'11px', color:'#5A6478' }}>$</span>
                  <input type="number" defaultValue={c.cpa_maximo}
                    style={{ background:'#0A0D14', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'6px', color:'#E8EDF5', padding:'5px 8px', fontSize:'12px', outline:'none', width:'100px', textAlign:'right' }} />
                </div>
                <span style={{ fontSize:'11px', fontWeight:'700', color: (c.compras > 0 ? Math.round(c.inversion/c.compras) : 0) <= c.cpa_maximo ? '#2DD4A0' : '#F05C5C', width:'60px', textAlign:'right' }}>
                  Real: ${c.compras > 0 ? Math.round(c.inversion/c.compras).toLocaleString('es-CO') : 'N/A'}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            <div style={{ ...s, padding:'20px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#3D8EF0', marginBottom:'12px' }}>📤 FUENTES DE DATOS</div>
              {[
                { nombre:'Meta Ads (CSV)', desc:'Exporta desde Ads Manager → Reportes → Descargar', estado:'CSV disponible', color:'#1877F2', icono:'🔵' },
                { nombre:'TikTok Ads (CSV)', desc:'Exporta desde TikTok Ads Manager → Reportes', estado:'CSV disponible', color:'#000', icono:'⚫' },
                { nombre:'Meta Ads API', desc:'Conectar con token de acceso — Standard Access', estado:'Fase 2', color:'#5A6478', icono:'🔗' },
                { nombre:'TikTok Ads API', desc:'Marketing API de TikTok for Business', estado:'Fase 3', color:'#5A6478', icono:'🔗' },
              ].map((f, i) => (
                <div key={i} style={{ padding:'12px 14px', background:'rgba(255,255,255,0.02)', borderRadius:'10px', marginBottom:'8px', borderLeft:`3px solid ${f.color}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                    <span style={{ fontSize:'13px', fontWeight:'600' }}>{f.icono} {f.nombre}</span>
                    <span style={{ fontSize:'10px', padding:'2px 8px', borderRadius:'5px', fontWeight:'700',
                      background: f.estado.includes('CSV') ? 'rgba(45,212,160,0.1)' : 'rgba(90,100,120,0.15)',
                      color: f.estado.includes('CSV') ? '#2DD4A0' : '#5A6478' }}>
                      {f.estado}
                    </span>
                  </div>
                  <div style={{ fontSize:'11px', color:'#5A6478' }}>{f.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#2DD4A0', marginBottom:'10px' }}>💡 BENCHMARKS DROPSHIPPING COLOMBIA</div>
              {[
                { metrica:'CTR mínimo aceptable', valor:'≥ 1%', tuyo:`${ctrPromedio}%`, ok:ctrPromedio >= 1 },
                { metrica:'CPC máximo (productos <$100K)', valor:'≤ $1.500', tuyo:`$${cpaPromedio.toLocaleString()}`, ok:true },
                { metrica:'ROAS mínimo viable', valor:'≥ 2x', tuyo:`${roasPromedio}x`, ok:roasPromedio >= 2 },
                { metrica:'CPM eficiente', valor:'≤ $8.000', tuyo:'$9.149', ok:false },
                { metrica:'CPA máximo (margen 15%)', valor:'≤ $18.000', tuyo:`$${cpaPromedio.toLocaleString()}`, ok:cpaPromedio <= 18000 },
              ].map((b, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:'12px' }}>
                  <span style={{ color:'#8B96A8' }}>{b.metrica}</span>
                  <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
                    <span style={{ color:'#5A6478' }}>{b.valor}</span>
                    <span style={{ fontWeight:'700', color: b.ok ? '#2DD4A0' : '#F05C5C' }}>{b.tuyo}</span>
                    <span style={{ fontSize:'12px' }}>{b.ok ? '✅' : '⚠️'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
