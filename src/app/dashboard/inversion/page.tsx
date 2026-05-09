'use client'
import { useState } from 'react'

export default function InversionPage() {
  const [tab, setTab] = useState<'inversion'|'credito'|'roi'>('inversion')

  // Inversión inicial
  const [activos, setActivos] = useState([
    { id:1, concepto:'Computador / Portátil', valor:2500000, vida:36, activo:true },
    { id:2, concepto:'Celular', valor:1200000, vida:24, activo:true },
    { id:3, concepto:'Cámara para fotos/video', valor:800000, vida:36, activo:false },
    { id:4, concepto:'Ring Light / Iluminación', valor:150000, vida:24, activo:false },
    { id:5, concepto:'Micrófono', valor:120000, vida:36, activo:false },
    { id:6, concepto:'Escritorio y silla', valor:600000, vida:60, activo:true },
    { id:7, concepto:'Router / Red', valor:200000, vida:36, activo:true },
  ])

  const [capital, setCapital] = useState([
    { id:1, concepto:'Capital de trabajo inicial', valor:3000000, tipo:'propio', activo:true },
    { id:2, concepto:'Inversión en testeo de productos', valor:500000, tipo:'propio', activo:true },
    { id:3, concepto:'Primera pauta publicitaria', valor:1500000, tipo:'propio', activo:true },
    { id:4, concepto:'Licencias y plataformas (3 meses)', valor:450000, tipo:'propio', activo:true },
    { id:5, concepto:'Inventario inicial (si aplica)', valor:0, tipo:'propio', activo:false },
    { id:6, concepto:'Reserva emergencias (1 mes CF)', valor:1159000, tipo:'propio', activo:true },
  ])

  const [socios, setSocios] = useState([
    { id:1, nombre:'Socio 1 (Joan)', aporte:3000000, pct:60 },
    { id:2, nombre:'Socio 2', aporte:0, pct:0 },
    { id:3, nombre:'Socio 3', aporte:0, pct:0 },
  ])

  // Simulador crédito
  const [monto, setMonto] = useState(5000000)
  const [tasaMensual, setTasaMensual] = useState(2.5)
  const [plazo, setPlazo] = useState(12)
  const [tipoCuota, setTipoCuota] = useState<'fija'|'variable'>('fija')
  const [destinoCredito, setDestinoCredito] = useState('pauta')

  // Cálculos inversión
  const totalActivos = activos.filter(a => a.activo).reduce((s, a) => s + a.valor, 0)
  const totalCapital = capital.filter(c => c.activo).reduce((s, c) => s + c.valor, 0)
  const totalInversion = totalActivos + totalCapital
  const totalAportes = socios.reduce((s, so) => s + so.aporte, 0)
  const brechaFinanciamiento = totalInversion - totalAportes
  const depreciacionMensual = activos.filter(a => a.activo).reduce((s, a) => s + a.valor / a.vida, 0)

  // Cálculos crédito cuota fija
  const tasaD = tasaMensual / 100
  const cuotaFija = tasaD > 0
    ? Math.round(monto * (tasaD * Math.pow(1 + tasaD, plazo)) / (Math.pow(1 + tasaD, plazo) - 1))
    : Math.round(monto / plazo)
  const totalPagar = cuotaFija * plazo
  const totalIntereses = totalPagar - monto
  const cfAdicionalMes = cuotaFija

  // Tabla amortización
  const amortizacion = []
  let saldo = monto
  for (let i = 1; i <= Math.min(plazo, 12); i++) {
    const interes = Math.round(saldo * tasaD)
    const capital_pago = cuotaFija - interes
    saldo = Math.max(saldo - capital_pago, 0)
    amortizacion.push({ mes: i, cuota: cuotaFija, interes, capital: capital_pago, saldo })
  }

  // Impacto en costeo
  const cfActual = 1159000
  const cfConCredito = cfActual + cuotaFija
  const pedidosActuales = 500
  const cfPorPedidoSin = Math.round(cfActual / pedidosActuales)
  const cfPorPedidoCon = Math.round(cfConCredito / pedidosActuales)
  const impactoMargen = cfPorPedidoCon - cfPorPedidoSin

  // ROI
  const [ingresoProyectado, setIngresoProyectado] = useState(4500000)
  const [mesesRecupero, setMesesRecupero] = useState(6)
  const roiPct = Math.round((ingresoProyectado * mesesRecupero - totalInversion) / totalInversion * 100)
  const payback = totalInversion > 0 ? Math.ceil(totalInversion / ingresoProyectado) : 0

  const s = { background:'#111520', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'12px' }
  const inp = { background:'#0A0D14', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'7px', color:'#E8EDF5', padding:'6px 10px', fontSize:'13px', outline:'none', width:'100%', boxSizing:'border-box' as const }
  const inpSm = { ...inp, width:'120px', textAlign:'right' as const }

  function toggleActivo(arr: any[], setArr: any, id: number) {
    setArr(arr.map((a: any) => a.id === id ? { ...a, activo: !a.activo } : a))
  }
  function updateValor(arr: any[], setArr: any, id: number, field: string, val: number) {
    setArr(arr.map((a: any) => a.id === id ? { ...a, [field]: val } : a))
  }

  return (
    <div style={{ color:'#E8EDF5', fontFamily:'system-ui,sans-serif' }}>

      <div style={{ marginBottom:'20px' }}>
        <h1 style={{ fontSize:'22px', fontWeight:'700', marginBottom:'4px' }}>💰 Inversión & Créditos</h1>
        <p style={{ fontSize:'13px', color:'#8B96A8' }}>Capital inicial · Simulador de crédito · Impacto en costeo · PLANEAR</p>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'10px', marginBottom:'16px' }}>
        {[
          { label:'Inversión total', value:`$${Math.round(totalInversion/1000)}K`, color:'#F05C5C', icon:'💸' },
          { label:'Aportes socios', value:`$${Math.round(totalAportes/1000)}K`, color:'#3D8EF0', icon:'👥' },
          { label:'Brecha financ.', value:`$${Math.round(Math.max(brechaFinanciamiento,0)/1000)}K`, color: brechaFinanciamiento > 0 ? '#F5A623' : '#2DD4A0', icon:'⚠️' },
          { label:'Deprec./mes', value:`$${Math.round(depreciacionMensual/1000)}K`, color:'#9B6BFF', icon:'📉' },
        ].map((k,i) => (
          <div key={i} style={{ ...s, padding:'14px', borderTop:`2px solid ${k.color}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
              <span style={{ fontSize:'11px', color:'#8B96A8' }}>{k.label}</span>
              <span>{k.icon}</span>
            </div>
            <div style={{ fontSize:'20px', fontWeight:'800', color:k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'6px', marginBottom:'16px' }}>
        {[
          { key:'inversion', label:'💼 Inversión Inicial' },
          { key:'credito', label:'🏦 Simulador Crédito' },
          { key:'roi', label:'📊 ROI & Payback' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            style={{ padding:'8px 16px', borderRadius:'9px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'600',
              background: tab === t.key ? '#F5A623' : 'rgba(255,255,255,0.05)',
              color: tab === t.key ? '#0A0D14' : '#8B96A8' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB INVERSIÓN */}
      {tab === 'inversion' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          {/* Activos */}
          <div style={{ ...s, padding:'18px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#3D8EF0', marginBottom:'12px' }}>🖥️ ACTIVOS (Equipos & Hardware)</div>
            {activos.map(a => (
              <div key={a.id} style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px', opacity: a.activo ? 1 : 0.4 }}>
                <input type="checkbox" checked={a.activo} onChange={() => toggleActivo(activos, setActivos, a.id)}
                  style={{ width:'14px', height:'14px', cursor:'pointer', accentColor:'#3D8EF0' }} />
                <span style={{ flex:1, fontSize:'12px', color: a.activo ? '#E8EDF5' : '#5A6478' }}>{a.concepto}</span>
                <input type="number" value={a.valor} disabled={!a.activo}
                  onChange={e => updateValor(activos, setActivos, a.id, 'valor', Number(e.target.value))}
                  style={{ ...inpSm, opacity: a.activo ? 1 : 0.4 }} />
              </div>
            ))}
            <div style={{ marginTop:'10px', padding:'10px 12px', background:'rgba(61,142,240,0.06)', borderRadius:'8px', display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontSize:'12px', color:'#8B96A8' }}>Subtotal activos</span>
              <span style={{ fontSize:'14px', fontWeight:'800', color:'#3D8EF0' }}>${totalActivos.toLocaleString('es-CO')}</span>
            </div>
            <div style={{ marginTop:'6px', padding:'8px 12px', background:'rgba(155,107,255,0.06)', borderRadius:'8px', display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontSize:'11px', color:'#8B96A8' }}>Depreciación mensual</span>
              <span style={{ fontSize:'12px', fontWeight:'700', color:'#9B6BFF' }}>${Math.round(depreciacionMensual).toLocaleString('es-CO')}/mes</span>
            </div>
          </div>

          {/* Capital */}
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#2DD4A0', marginBottom:'12px' }}>💵 CAPITAL DE TRABAJO & OTROS</div>
              {capital.map(c => (
                <div key={c.id} style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px', opacity: c.activo ? 1 : 0.4 }}>
                  <input type="checkbox" checked={c.activo} onChange={() => toggleActivo(capital, setCapital, c.id)}
                    style={{ width:'14px', height:'14px', cursor:'pointer', accentColor:'#2DD4A0' }} />
                  <span style={{ flex:1, fontSize:'11px', color: c.activo ? '#E8EDF5' : '#5A6478' }}>{c.concepto}</span>
                  <input type="number" value={c.valor} disabled={!c.activo}
                    onChange={e => updateValor(capital, setCapital, c.id, 'valor', Number(e.target.value))}
                    style={{ ...inpSm, opacity: c.activo ? 1 : 0.4 }} />
                </div>
              ))}
              <div style={{ marginTop:'10px', padding:'10px 12px', background:'rgba(45,212,160,0.06)', borderRadius:'8px', display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontSize:'12px', color:'#8B96A8' }}>Subtotal capital</span>
                <span style={{ fontSize:'14px', fontWeight:'800', color:'#2DD4A0' }}>${totalCapital.toLocaleString('es-CO')}</span>
              </div>
            </div>

            {/* Socios */}
            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'12px' }}>👥 APORTES DE SOCIOS</div>
              {socios.map(so => (
                <div key={so.id} style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px' }}>
                  <span style={{ flex:1, fontSize:'12px', color:'#8B96A8' }}>{so.nombre}</span>
                  <input type="number" value={so.aporte}
                    onChange={e => updateValor(socios, setSocios, so.id, 'aporte', Number(e.target.value))}
                    style={{ ...inpSm }} />
                  <span style={{ fontSize:'11px', color:'#5A6478', width:'30px' }}>{so.pct}%</span>
                </div>
              ))}
              <div style={{ marginTop:'10px', padding:'10px 12px', background: brechaFinanciamiento > 0 ? 'rgba(245,166,35,0.06)' : 'rgba(45,212,160,0.06)', borderRadius:'8px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                  <span style={{ fontSize:'12px', color:'#8B96A8' }}>Total necesario</span>
                  <span style={{ fontSize:'13px', fontWeight:'700', color:'#E8EDF5' }}>${totalInversion.toLocaleString('es-CO')}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                  <span style={{ fontSize:'12px', color:'#8B96A8' }}>Aportes socios</span>
                  <span style={{ fontSize:'13px', fontWeight:'700', color:'#3D8EF0' }}>${totalAportes.toLocaleString('es-CO')}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontSize:'12px', color:'#8B96A8' }}>Brecha (necesitas crédito)</span>
                  <span style={{ fontSize:'14px', fontWeight:'800', color: brechaFinanciamiento > 0 ? '#F5A623' : '#2DD4A0' }}>
                    {brechaFinanciamiento > 0 ? `$${brechaFinanciamiento.toLocaleString('es-CO')}` : '✅ Cubierto'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CRÉDITO */}
      {tab === 'credito' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          {/* Parámetros */}
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            <div style={{ ...s, padding:'20px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'14px' }}>🏦 PARÁMETROS DEL CRÉDITO</div>
              {[
                { label:'Monto del crédito ($)', val:monto, set:setMonto },
                { label:'Tasa mensual (%)', val:tasaMensual, set:setTasaMensual },
                { label:'Plazo (meses)', val:plazo, set:setPlazo },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom:'12px' }}>
                  <label style={{ display:'block', fontSize:'11px', color:'#5A6478', marginBottom:'5px' }}>{item.label}</label>
                  <input type="number" value={item.val} step={i===1?0.1:1}
                    onChange={e => item.set(Number(e.target.value))} style={inp} />
                </div>
              ))}
              <div style={{ marginBottom:'12px' }}>
                <label style={{ display:'block', fontSize:'11px', color:'#5A6478', marginBottom:'5px' }}>Tipo de cuota</label>
                <div style={{ display:'flex', gap:'8px' }}>
                  {['fija','variable'].map(t => (
                    <button key={t} onClick={() => setTipoCuota(t as any)}
                      style={{ flex:1, padding:'8px', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:'600',
                        background: tipoCuota === t ? '#F5A623' : 'rgba(255,255,255,0.05)',
                        color: tipoCuota === t ? '#0A0D14' : '#8B96A8' }}>
                      Cuota {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display:'block', fontSize:'11px', color:'#5A6478', marginBottom:'5px' }}>Destino del crédito</label>
                <select value={destinoCredito} onChange={e => setDestinoCredito(e.target.value)}
                  style={{ ...inp, cursor:'pointer' }}>
                  <option value="pauta">Inversión en Pauta publicitaria</option>
                  <option value="capital">Capital de trabajo</option>
                  <option value="equipos">Equipos y activos</option>
                  <option value="inventario">Inventario inicial</option>
                  <option value="escalar">Escalar operación</option>
                </select>
              </div>
            </div>

            {/* Resumen */}
            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#3D8EF0', marginBottom:'12px' }}>📊 RESUMEN DEL CRÉDITO</div>
              {[
                { label:'Cuota mensual', value:`$${cuotaFija.toLocaleString('es-CO')}`, color:'#F05C5C' },
                { label:'Total a pagar', value:`$${totalPagar.toLocaleString('es-CO')}`, color:'#F5A623' },
                { label:'Total intereses', value:`$${totalIntereses.toLocaleString('es-CO')}`, color:'#F05C5C' },
                { label:'% sobre monto', value:`${Math.round(totalIntereses/monto*100)}%`, color:'#9B6BFF' },
              ].map((k, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize:'12px', color:'#8B96A8' }}>{k.label}</span>
                  <span style={{ fontSize:'14px', fontWeight:'700', color:k.color }}>{k.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Impacto + Tabla amortización */}
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {/* Impacto en costeo */}
            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#F05C5C', marginBottom:'12px' }}>⚠️ IMPACTO EN TU COSTEO</div>
              <div style={{ fontSize:'12px', color:'#8B96A8', marginBottom:'12px', lineHeight:'1.6' }}>
                La cuota mensual de <strong style={{ color:'#F05C5C' }}>${cuotaFija.toLocaleString('es-CO')}</strong> se suma a tus costos fijos actuales.
              </div>
              {[
                { label:'CF sin crédito', value:`$${cfActual.toLocaleString('es-CO')}`, color:'#8B96A8' },
                { label:'CF con crédito', value:`$${cfConCredito.toLocaleString('es-CO')}`, color:'#F05C5C' },
                { label:'CF/pedido sin crédito (500 ped)', value:`$${cfPorPedidoSin.toLocaleString('es-CO')}`, color:'#8B96A8' },
                { label:'CF/pedido con crédito', value:`$${cfPorPedidoCon.toLocaleString('es-CO')}`, color:'#F05C5C' },
                { label:'Impacto en margen/pedido', value:`-$${impactoMargen.toLocaleString('es-CO')}`, color:'#F05C5C' },
              ].map((k, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                  <span style={{ fontSize:'11px', color:'#8B96A8' }}>{k.label}</span>
                  <span style={{ fontSize:'13px', fontWeight:'700', color:k.color }}>{k.value}</span>
                </div>
              ))}
              <div style={{ marginTop:'10px', padding:'10px 12px', background:'rgba(240,92,92,0.06)', borderRadius:'8px', border:'1px solid rgba(240,92,92,0.15)', fontSize:'12px', color:'#8B96A8', lineHeight:'1.6' }}>
                💡 Para mantener tu margen con el crédito, necesitas generar al menos <strong style={{ color:'#F5A623' }}>
                {Math.ceil(cfConCredito / (cfActual / pedidosActuales * pedidosActuales / pedidosActuales * pedidosActuales) * pedidosActuales)} pedidos/mes</strong> o aumentar el PVP.
              </div>
            </div>

            {/* Tabla amortización */}
            <div style={{ ...s, overflow:'hidden' }}>
              <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', fontSize:'12px', fontWeight:'700', color:'#9B6BFF' }}>
                📋 TABLA DE AMORTIZACIÓN (primeros 12 meses)
              </div>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'11px' }}>
                  <thead>
                    <tr style={{ background:'#0A0D14', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                      {['Mes','Cuota','Interés','Capital','Saldo'].map(h => (
                        <th key={h} style={{ padding:'8px 12px', textAlign:'right', fontSize:'10px', color:'#5A6478', fontWeight:'700' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {amortizacion.map((row, i) => (
                      <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                        <td style={{ padding:'7px 12px', textAlign:'right', color:'#8B96A8' }}>{row.mes}</td>
                        <td style={{ padding:'7px 12px', textAlign:'right', color:'#F05C5C', fontWeight:'600' }}>${row.cuota.toLocaleString('es-CO')}</td>
                        <td style={{ padding:'7px 12px', textAlign:'right', color:'#F5A623' }}>${row.interes.toLocaleString('es-CO')}</td>
                        <td style={{ padding:'7px 12px', textAlign:'right', color:'#2DD4A0' }}>${row.capital.toLocaleString('es-CO')}</td>
                        <td style={{ padding:'7px 12px', textAlign:'right', color:'#8B96A8' }}>${row.saldo.toLocaleString('es-CO')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB ROI */}
      {tab === 'roi' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div style={{ ...s, padding:'20px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#2DD4A0', marginBottom:'14px' }}>📊 ANÁLISIS ROI DE LA INVERSIÓN</div>
            <div style={{ marginBottom:'16px' }}>
              <label style={{ display:'block', fontSize:'11px', color:'#5A6478', marginBottom:'5px' }}>Utilidad mensual proyectada ($)</label>
              <input type="number" value={ingresoProyectado} onChange={e => setIngresoProyectado(Number(e.target.value))} style={inp} />
            </div>
            <div style={{ marginBottom:'16px' }}>
              <label style={{ display:'block', fontSize:'11px', color:'#5A6478', marginBottom:'5px' }}>Meses de evaluación</label>
              <input type="range" min={3} max={24} value={mesesRecupero} onChange={e => setMesesRecupero(Number(e.target.value))}
                style={{ width:'100%', accentColor:'#2DD4A0' }} />
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'10px', color:'#5A6478', marginTop:'4px' }}>
                <span>3 meses</span>
                <strong style={{ color:'#2DD4A0' }}>{mesesRecupero} meses</strong>
                <span>24 meses</span>
              </div>
            </div>

            {[
              { label:'Inversión total', value:`$${totalInversion.toLocaleString('es-CO')}`, color:'#F05C5C' },
              { label:'Retorno en período', value:`$${(ingresoProyectado*mesesRecupero).toLocaleString('es-CO')}`, color:'#2DD4A0' },
              { label:'ROI del período', value:`${roiPct}%`, color: roiPct >= 0 ? '#2DD4A0' : '#F05C5C' },
              { label:'Payback (recupero)', value:`${payback} meses`, color:'#F5A623' },
            ].map((k, i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'10px 12px', borderRadius:'8px', marginBottom:'6px',
                background: i === 2 ? `${k.color}08` : 'rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize:'12px', color:'#8B96A8' }}>{k.label}</span>
                <span style={{ fontSize:'16px', fontWeight:'800', color:k.color }}>{k.value}</span>
              </div>
            ))}

            <div style={{ marginTop:'14px', padding:'14px', background: roiPct >= 50 ? 'rgba(45,212,160,0.06)' : roiPct >= 0 ? 'rgba(245,166,35,0.06)' : 'rgba(240,92,92,0.06)',
              borderRadius:'10px', border:`1px solid ${roiPct >= 50 ? 'rgba(45,212,160,0.2)' : roiPct >= 0 ? 'rgba(245,166,35,0.2)' : 'rgba(240,92,92,0.2)'}` }}>
              <div style={{ fontSize:'14px', fontWeight:'700', color: roiPct >= 50 ? '#2DD4A0' : roiPct >= 0 ? '#F5A623' : '#F05C5C', marginBottom:'6px' }}>
                {roiPct >= 100 ? '🚀 Inversión muy rentable' : roiPct >= 50 ? '✅ Inversión rentable' : roiPct >= 0 ? '⚠️ Inversión marginal' : '❌ Inversión no rentable'}
              </div>
              <div style={{ fontSize:'12px', color:'#8B96A8', lineHeight:'1.6' }}>
                En {mesesRecupero} meses recuperas la inversión y generas un ROI del {roiPct}%.
                El payback se logra en {payback} {payback === 1 ? 'mes' : 'meses'}.
              </div>
            </div>
          </div>

          {/* Tabla proyección mensual */}
          <div style={{ ...s, overflow:'hidden' }}>
            <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', fontSize:'12px', fontWeight:'700', color:'#F5A623' }}>
              📅 PROYECCIÓN MES A MES
            </div>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
              <thead>
                <tr style={{ background:'#0A0D14', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                  {['Mes','Utilidad','Acumulado','Inversión pendiente','ROI acum.'].map(h => (
                    <th key={h} style={{ padding:'8px 12px', textAlign:'right', fontSize:'10px', color:'#5A6478', fontWeight:'700' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({length:Math.min(mesesRecupero, 12)}, (_,i) => {
                  const acum = ingresoProyectado * (i+1)
                  const pendiente = Math.max(totalInversion - acum, 0)
                  const roi = Math.round((acum - totalInversion) / totalInversion * 100)
                  const recuperado = acum >= totalInversion
                  return (
                    <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)', background: recuperado && acum-ingresoProyectado < totalInversion ? 'rgba(45,212,160,0.04)' : 'transparent' }}>
                      <td style={{ padding:'7px 12px', textAlign:'right', color:'#8B96A8' }}>Mes {i+1}</td>
                      <td style={{ padding:'7px 12px', textAlign:'right', color:'#2DD4A0' }}>${ingresoProyectado.toLocaleString('es-CO')}</td>
                      <td style={{ padding:'7px 12px', textAlign:'right', fontWeight:'600', color: recuperado ? '#2DD4A0' : '#E8EDF5' }}>${acum.toLocaleString('es-CO')}</td>
                      <td style={{ padding:'7px 12px', textAlign:'right', color: pendiente > 0 ? '#F05C5C' : '#2DD4A0' }}>
                        {pendiente > 0 ? `$${pendiente.toLocaleString('es-CO')}` : '✅ Recuperado'}
                      </td>
                      <td style={{ padding:'7px 12px', textAlign:'right', fontWeight:'700', color: roi >= 0 ? '#2DD4A0' : '#F05C5C' }}>{roi}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
