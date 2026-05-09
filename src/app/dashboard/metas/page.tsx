'use client'
import { useState } from 'react'

const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

export default function MetasPage() {
  const hoy = new Date()
  const diaActual = hoy.getDate()
  const diasMes = new Date(hoy.getFullYear(), hoy.getMonth()+1, 0).getDate()
  const diasRestantes = diasMes - diaActual

  // Metas configurables
  const [metaPedidos, setMetaPedidos] = useState(500)
  const [metaVentas, setMetaVentas] = useState(35000000)
  const [metaUtilidad, setMetaUtilidad] = useState(4500000)
  const [metaConfirmacion, setMetaConfirmacion] = useState(65)
  const [metaEntrega, setMetaEntrega] = useState(78)
  const [metaDevolucion, setMetaDevolucion] = useState(12)
  const [metaCPA, setMetaCPA] = useState(15000)
  const [metaPauta, setMetaPauta] = useState(1500000)

  // Ejecución actual (simulada con datos reales de agosto)
  const [pedidosActuales, setPedidosActuales] = useState(187)
  const [ventasActuales, setVentasActuales] = useState(13200000)
  const [utilidadActual, setUtilidadActual] = useState(1670000)
  const [confirmacionActual, setConfirmacionActual] = useState(58)
  const [entregaActual, setEntregaActual] = useState(67)
  const [devolucionActual, setDevolucionActual] = useState(8)
  const [cpaActual, setCpaActual] = useState(18500)
  const [pautaActual, setPautaActual] = useState(580000)

  const [tab, setTab] = useState<'metas'|'proyeccion'|'historial'>('metas')

  // Cálculos
  const pctDias = Math.round(diaActual / diasMes * 100)
  const pctPedidos = Math.round(pedidosActuales / metaPedidos * 100)
  const pctVentas = Math.round(ventasActuales / metaVentas * 100)
  const pctUtilidad = Math.round(utilidadActual / metaUtilidad * 100)
  const vaEnRitmoPedidos = pedidosActuales >= Math.round(metaPedidos * diaActual / diasMes)

  // Proyecciones
  const ritmoActual = pedidosActuales / diaActual
  const proyeccionPedidosMes = Math.round(ritmoActual * diasMes)
  const proyeccionVentasMes = Math.round((ventasActuales / diaActual) * diasMes)
  const proyeccionUtilidadMes = Math.round((utilidadActual / diaActual) * diasMes)
  const pedidosFaltantes = Math.max(metaPedidos - pedidosActuales, 0)
  const pedidosDiaNecesarios = diasRestantes > 0 ? Math.ceil(pedidosFaltantes / diasRestantes) : 0
  const ventasDiaNecesarias = diasRestantes > 0 ? Math.ceil((metaVentas - ventasActuales) / diasRestantes) : 0

  function semaforo(actual: number, meta: number, inv = false) {
    const pct = actual / meta * 100
    if (inv) return pct <= 80 ? '#2DD4A0' : pct <= 100 ? '#F5A623' : '#F05C5C'
    return pct >= 90 ? '#2DD4A0' : pct >= 70 ? '#F5A623' : '#F05C5C'
  }

  const s = { background:'#111520', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'12px' }
  const inp = { background:'#0A0D14', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'7px', color:'#E8EDF5', padding:'6px 10px', fontSize:'13px', outline:'none', width:'100%', boxSizing:'border-box' as const }

  // Historial simulado 6 meses
  const historial = [
    { mes:'Ene', pedidos:320, meta:400, ventas:22400000, utilidad:2880000 },
    { mes:'Feb', pedidos:415, meta:400, ventas:29050000, utilidad:3730000 },
    { mes:'Mar', pedidos:380, meta:450, ventas:26600000, utilidad:3420000 },
    { mes:'Abr', pedidos:490, meta:450, ventas:34300000, utilidad:4410000 },
    { mes:'May', pedidos:445, meta:500, ventas:31150000, utilidad:4005000 },
    { mes:'Ago', pedidos:pedidosActuales, meta:metaPedidos, ventas:ventasActuales, utilidad:utilidadActual, activo:true },
  ]

  return (
    <div style={{ color:'#E8EDF5', fontFamily:'system-ui,sans-serif' }}>

      <div style={{ marginBottom:'20px' }}>
        <h1 style={{ fontSize:'22px', fontWeight:'700', marginBottom:'4px' }}>🎯 Metas & Proyecciones</h1>
        <p style={{ fontSize:'13px', color:'#8B96A8' }}>
          Día {diaActual} de {diasMes} · {diasRestantes} días restantes · PLANEAR → VERIFICAR
        </p>
      </div>

      {/* Barra de progreso del mes */}
      <div style={{ ...s, padding:'14px 18px', marginBottom:'16px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
          <span style={{ fontSize:'12px', color:'#8B96A8' }}>Progreso del mes</span>
          <span style={{ fontSize:'12px', fontWeight:'700', color: vaEnRitmoPedidos ? '#2DD4A0' : '#F5A623' }}>
            {vaEnRitmoPedidos ? '✅ En ritmo' : '⚠️ Necesitas acelerar'}
          </span>
        </div>
        <div style={{ height:'8px', background:'rgba(255,255,255,0.05)', borderRadius:'4px', position:'relative', marginBottom:'6px' }}>
          <div style={{ height:'8px', width:`${pctDias}%`, background:'rgba(255,255,255,0.1)', borderRadius:'4px', position:'absolute' }} />
          <div style={{ height:'8px', width:`${Math.min(pctPedidos,100)}%`, background: vaEnRitmoPedidos ? '#2DD4A0' : '#F5A623', borderRadius:'4px', position:'absolute' }} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'11px', color:'#5A6478' }}>
          <span>Tiempo transcurrido: {pctDias}%</span>
          <span>Pedidos: {pctPedidos}% de la meta</span>
          <span>{pedidosActuales} / {metaPedidos} pedidos</span>
        </div>
      </div>

      {/* KPIs principales */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'10px', marginBottom:'16px' }}>
        {[
          { label:'Pedidos', actual:pedidosActuales, meta:metaPedidos, formato:'num', color:semaforo(pedidosActuales,metaPedidos) },
          { label:'Ventas', actual:ventasActuales, meta:metaVentas, formato:'cop', color:semaforo(ventasActuales,metaVentas) },
          { label:'Utilidad', actual:utilidadActual, meta:metaUtilidad, formato:'cop', color:semaforo(utilidadActual,metaUtilidad) },
          { label:'Pedidos/día necesarios', actual:pedidosDiaNecesarios, meta:metaPedidos/diasMes, formato:'num', color: pedidosDiaNecesarios <= 20 ? '#2DD4A0' : '#F5A623' },
        ].map((k, i) => {
          const pct = Math.min(Math.round(k.actual / k.meta * 100), 100)
          const val = k.formato === 'cop' ? `$${Math.round(k.actual/1000)}K` : k.actual.toLocaleString('es-CO')
          return (
            <div key={i} style={{ ...s, padding:'14px', borderTop:`2px solid ${k.color}` }}>
              <div style={{ fontSize:'11px', color:'#8B96A8', marginBottom:'8px' }}>{k.label}</div>
              <div style={{ fontSize:'22px', fontWeight:'800', color:k.color, marginBottom:'6px' }}>{val}</div>
              <div style={{ height:'4px', background:'rgba(255,255,255,0.05)', borderRadius:'2px', marginBottom:'4px' }}>
                <div style={{ height:'4px', width:`${pct}%`, background:k.color, borderRadius:'2px' }} />
              </div>
              <div style={{ fontSize:'10px', color:'#5A6478' }}>{pct}% de la meta</div>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'6px', marginBottom:'16px' }}>
        {[
          { key:'metas', label:'🎯 Configurar Metas' },
          { key:'proyeccion', label:'📈 Proyección' },
          { key:'historial', label:'📅 Historial' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            style={{ padding:'8px 16px', borderRadius:'9px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'600',
              background: tab === t.key ? '#F5A623' : 'rgba(255,255,255,0.05)',
              color: tab === t.key ? '#0A0D14' : '#8B96A8' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB METAS */}
      {tab === 'metas' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          {/* Metas */}
          <div style={{ ...s, padding:'20px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'14px' }}>🎯 METAS DEL MES</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {[
                { label:'Meta de Pedidos', val:metaPedidos, set:setMetaPedidos, prefix:'' },
                { label:'Meta de Ventas ($)', val:metaVentas, set:setMetaVentas, prefix:'$' },
                { label:'Meta de Utilidad ($)', val:metaUtilidad, set:setMetaUtilidad, prefix:'$' },
                { label:'Meta CPA Máximo ($)', val:metaCPA, set:setMetaCPA, prefix:'$' },
                { label:'Meta Inversión Pauta ($)', val:metaPauta, set:setMetaPauta, prefix:'$' },
                { label:'% Confirmación mínimo', val:metaConfirmacion, set:setMetaConfirmacion, prefix:'%' },
                { label:'% Entrega mínimo', val:metaEntrega, set:setMetaEntrega, prefix:'%' },
                { label:'% Devolución máximo', val:metaDevolucion, set:setMetaDevolucion, prefix:'%' },
              ].map((item, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <label style={{ flex:1, fontSize:'12px', color:'#8B96A8' }}>{item.label}</label>
                  <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                    {item.prefix && <span style={{ fontSize:'12px', color:'#5A6478' }}>{item.prefix}</span>}
                    <input type="number" value={item.val} onChange={e => item.set(Number(e.target.value))}
                      style={{ ...inp, width:'120px', textAlign:'right' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ejecución actual */}
          <div style={{ ...s, padding:'20px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#2DD4A0', marginBottom:'14px' }}>📊 EJECUCIÓN ACTUAL — Día {diaActual}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {[
                { label:'Pedidos entregados', val:pedidosActuales, set:setPedidosActuales, meta:metaPedidos, inv:false },
                { label:'Ventas generadas ($)', val:ventasActuales, set:setVentasActuales, meta:metaVentas, inv:false },
                { label:'Utilidad real ($)', val:utilidadActual, set:setUtilidadActual, meta:metaUtilidad, inv:false },
                { label:'CPA actual ($)', val:cpaActual, set:setCpaActual, meta:metaCPA, inv:true },
                { label:'Pauta invertida ($)', val:pautaActual, set:setPautaActual, meta:metaPauta, inv:false },
                { label:'% Confirmación', val:confirmacionActual, set:setConfirmacionActual, meta:metaConfirmacion, inv:false },
                { label:'% Entrega', val:entregaActual, set:setEntregaActual, meta:metaEntrega, inv:false },
                { label:'% Devolución', val:devolucionActual, set:setDevolucionActual, meta:metaDevolucion, inv:true },
              ].map((item, i) => {
                const color = semaforo(item.val, item.meta, item.inv)
                const pct = Math.min(Math.round(item.val / item.meta * 100), 150)
                return (
                  <div key={i}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                      <label style={{ flex:1, fontSize:'12px', color:'#8B96A8' }}>{item.label}</label>
                      <input type="number" value={item.val} onChange={e => item.set(Number(e.target.value))}
                        style={{ ...inp, width:'110px', textAlign:'right' }} />
                      <span style={{ fontSize:'12px', fontWeight:'700', color, width:'40px', textAlign:'right' }}>
                        {Math.round(item.val/item.meta*100)}%
                      </span>
                    </div>
                    <div style={{ height:'3px', background:'rgba(255,255,255,0.05)', borderRadius:'2px' }}>
                      <div style={{ height:'3px', width:`${Math.min(pct,100)}%`, background:color, borderRadius:'2px' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB PROYECCION */}
      {tab === 'proyeccion' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div style={{ ...s, padding:'20px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#3D8EF0', marginBottom:'16px' }}>📈 PROYECCIÓN AL CIERRE DEL MES</div>
            <div style={{ fontSize:'12px', color:'#5A6478', marginBottom:'16px', lineHeight:'1.6' }}>
              Basado en el ritmo actual de <strong style={{ color:'#E8EDF5' }}>{ritmoActual.toFixed(1)} pedidos/día</strong>
            </div>
            {[
              { label:'Pedidos proyectados', proyectado:proyeccionPedidosMes, meta:metaPedidos, formato:'num', color:'#3D8EF0' },
              { label:'Ventas proyectadas', proyectado:proyeccionVentasMes, meta:metaVentas, formato:'cop', color:'#9B6BFF' },
              { label:'Utilidad proyectada', proyectado:proyeccionUtilidadMes, meta:metaUtilidad, formato:'cop', color:'#2DD4A0' },
            ].map((k, i) => {
              const cumple = k.proyectado >= k.meta
              const val = k.formato === 'cop' ? `$${Math.round(k.proyectado/1000)}K` : k.proyectado.toLocaleString()
              const metaFmt = k.formato === 'cop' ? `$${Math.round(k.meta/1000)}K` : k.meta.toLocaleString()
              return (
                <div key={i} style={{ padding:'14px', background:'rgba(255,255,255,0.02)', borderRadius:'10px', marginBottom:'10px', borderLeft:`3px solid ${cumple ? '#2DD4A0' : '#F05C5C'}` }}>
                  <div style={{ fontSize:'11px', color:'#8B96A8', marginBottom:'6px' }}>{k.label}</div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div>
                      <span style={{ fontSize:'20px', fontWeight:'800', color: cumple ? '#2DD4A0' : '#F05C5C' }}>{val}</span>
                      <span style={{ fontSize:'11px', color:'#5A6478', marginLeft:'8px' }}>meta: {metaFmt}</span>
                    </div>
                    <span style={{ fontSize:'12px', fontWeight:'700', padding:'4px 10px', borderRadius:'6px',
                      background: cumple ? 'rgba(45,212,160,0.1)' : 'rgba(240,92,92,0.1)',
                      color: cumple ? '#2DD4A0' : '#F05C5C' }}>
                      {cumple ? '✓ Alcanzarás' : '✗ No alcanzarás'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ ...s, padding:'20px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'16px' }}>⚡ ¿QUÉ NECESITAS HACER HOY?</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {[
                { pregunta:'Pedidos/día necesarios', respuesta:`${pedidosDiaNecesarios} pedidos`, alerta: pedidosDiaNecesarios > 25, icon:'📦' },
                { pregunta:'Ventas/día necesarias', respuesta:`$${Math.round(ventasDiaNecesarias/1000)}K`, alerta: ventasDiaNecesarias > 1500000, icon:'💰' },
                { pregunta:'Días restantes del mes', respuesta:`${diasRestantes} días`, alerta: diasRestantes < 7, icon:'📅' },
                { pregunta:'Pedidos que te faltan', respuesta:`${pedidosFaltantes} pedidos`, alerta: pedidosFaltantes > metaPedidos * 0.5, icon:'🎯' },
                { pregunta:'Ritmo actual', respuesta:`${ritmoActual.toFixed(1)}/día`, alerta: ritmoActual < metaPedidos/diasMes, icon:'⚡' },
                { pregunta:'Ritmo necesario', respuesta:`${pedidosDiaNecesarios}/día`, alerta: pedidosDiaNecesarios > ritmoActual * 1.5, icon:'🔥' },
              ].map((item, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 12px', borderRadius:'8px',
                  background: item.alerta ? 'rgba(240,92,92,0.06)' : 'rgba(255,255,255,0.02)',
                  border: item.alerta ? '1px solid rgba(240,92,92,0.15)' : '1px solid transparent' }}>
                  <span style={{ fontSize:'12px', color:'#8B96A8', display:'flex', alignItems:'center', gap:'6px' }}>
                    <span>{item.icon}</span>{item.pregunta}
                  </span>
                  <span style={{ fontSize:'14px', fontWeight:'800', color: item.alerta ? '#F05C5C' : '#2DD4A0' }}>
                    {item.respuesta}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ marginTop:'14px', padding:'14px', background: vaEnRitmoPedidos ? 'rgba(45,212,160,0.06)' : 'rgba(240,92,92,0.06)',
              borderRadius:'10px', border:`1px solid ${vaEnRitmoPedidos ? 'rgba(45,212,160,0.2)' : 'rgba(240,92,92,0.2)'}` }}>
              <div style={{ fontSize:'14px', fontWeight:'700', color: vaEnRitmoPedidos ? '#2DD4A0' : '#F05C5C', marginBottom:'6px' }}>
                {vaEnRitmoPedidos ? '✅ Vas en buen ritmo' : '⚠️ Necesitas acelerar'}
              </div>
              <div style={{ fontSize:'12px', color:'#8B96A8', lineHeight:'1.7' }}>
                {vaEnRitmoPedidos
                  ? `Si mantienes el ritmo actual, cerrarás el mes con ${proyeccionPedidosMes} pedidos — ${proyeccionPedidosMes >= metaPedidos ? 'superando' : 'cerca de'} tu meta.`
                  : `Para alcanzar tu meta de ${metaPedidos} pedidos necesitas ${pedidosDiaNecesarios} pedidos/día en los próximos ${diasRestantes} días.`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB HISTORIAL */}
      {tab === 'historial' && (
        <div style={{ ...s, overflow:'hidden' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontWeight:'700' }}>📅 Historial de 6 meses</span>
          </div>

          {/* Gráfico de barras */}
          <div style={{ padding:'20px', display:'flex', alignItems:'flex-end', gap:'16px', height:'160px' }}>
            {historial.map((m, i) => {
              const pct = Math.min((m.pedidos / Math.max(...historial.map(x => x.meta))) * 100, 100)
              const metaPct = Math.min((m.meta / Math.max(...historial.map(x => x.meta))) * 100, 100)
              const cumple = m.pedidos >= m.meta
              return (
                <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' }}>
                  <div style={{ fontSize:'10px', color: cumple ? '#2DD4A0' : '#F05C5C', fontWeight:'700' }}>
                    {m.pedidos}
                  </div>
                  <div style={{ width:'100%', height:'100px', display:'flex', alignItems:'flex-end', gap:'3px', position:'relative' }}>
                    <div style={{ flex:1, height:`${metaPct}%`, background:'rgba(255,255,255,0.06)', borderRadius:'3px 3px 0 0', position:'relative' }}>
                      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:`${(m.pedidos/m.meta)*metaPct}%`, background: cumple ? '#2DD4A0' : '#F05C5C', borderRadius:'3px 3px 0 0', transition:'height .3s' }} />
                    </div>
                  </div>
                  <div style={{ fontSize:'11px', color: (m as any).activo ? '#F5A623' : '#5A6478', fontWeight:(m as any).activo ? '700' : '400' }}>
                    {m.mes}{(m as any).activo ? ' ←' : ''}
                  </div>
                </div>
              )
            })}
          </div>

          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
            <thead>
              <tr style={{ background:'#0A0D14', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                {['Mes','Pedidos','Meta','Cumplimiento','Ventas','Utilidad','Estado'].map(h => (
                  <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:'10px', color:'#5A6478', fontWeight:'700' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {historial.map((m, i) => {
                const cumple = m.pedidos >= m.meta
                const pct = Math.round(m.pedidos/m.meta*100)
                return (
                  <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)', background:(m as any).activo ? 'rgba(245,166,35,0.04)' : 'transparent' }}>
                    <td style={{ padding:'10px 14px', fontWeight:(m as any).activo ? '700' : '400', color:(m as any).activo ? '#F5A623' : '#E8EDF5' }}>{m.mes}</td>
                    <td style={{ padding:'10px 14px', fontWeight:'700', color: cumple ? '#2DD4A0' : '#F05C5C' }}>{m.pedidos}</td>
                    <td style={{ padding:'10px 14px', color:'#8B96A8' }}>{m.meta}</td>
                    <td style={{ padding:'10px 14px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                        <div style={{ flex:1, height:'6px', background:'rgba(255,255,255,0.05)', borderRadius:'3px' }}>
                          <div style={{ height:'6px', width:`${Math.min(pct,100)}%`, background: cumple ? '#2DD4A0' : '#F05C5C', borderRadius:'3px' }} />
                        </div>
                        <span style={{ fontSize:'12px', fontWeight:'700', color: cumple ? '#2DD4A0' : '#F05C5C', width:'35px' }}>{pct}%</span>
                      </div>
                    </td>
                    <td style={{ padding:'10px 14px', color:'#8B96A8' }}>${Math.round(m.ventas/1000)}K</td>
                    <td style={{ padding:'10px 14px', color:'#2DD4A0' }}>${Math.round(m.utilidad/1000)}K</td>
                    <td style={{ padding:'10px 14px' }}>
                      <span style={{ fontSize:'10px', fontWeight:'700', padding:'2px 8px', borderRadius:'6px',
                        background: cumple ? 'rgba(45,212,160,0.1)' : 'rgba(240,92,92,0.1)',
                        color: cumple ? '#2DD4A0' : '#F05C5C' }}>
                        {cumple ? '✓ Cumplida' : '✗ No cumplida'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop:'14px', padding:'12px 16px', background:'#111520', borderRadius:'10px', border:'1px solid rgba(255,255,255,0.05)', fontSize:'12px', color:'#5A6478' }}>
        📌 Las proyecciones se calculan con el ritmo de los primeros {diaActual} días del mes. Actualiza la ejecución actual diariamente para tener proyecciones precisas.
      </div>
    </div>
  )
}
