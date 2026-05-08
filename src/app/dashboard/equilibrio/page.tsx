'use client'
import { useState } from 'react'

const PRODUCTOS = [
  { nombre:'Reloj LED Moda', pvp:69900, ganancia_neta:8200, participacion:25 },
  { nombre:'Reloj Dama Oro Rosa', pvp:69900, ganancia_neta:7100, participacion:20 },
  { nombre:'Pendientes Cristal', pvp:79900, ganancia_neta:12300, participacion:15 },
  { nombre:'Reloj Vintage Mujer', pvp:89900, ganancia_neta:6800, participacion:15 },
  { nombre:'Prótesis Snap-On', pvp:79900, ganancia_neta:9200, participacion:10 },
  { nombre:'Anillo Feng Shui', pvp:89900, ganancia_neta:14100, participacion:10 },
  { nombre:'Gafas Sol Aviador', pvp:69900, ganancia_neta:7900, participacion:5 },
]

export default function EquilibrioPage() {
  const [cf, setCf] = useState(1159000)
  const [pauta, setPauta] = useState(1500000)
  const [diaActual, setDiaActual] = useState(new Date().getDate())
  const [pedidosActuales, setPedidosActuales] = useState(187)
  const [tab, setTab] = useState<'pe'|'tiempo_real'|'proyeccion'>('pe')

  // Ganancia ponderada por mezcla de productos
  const ganancia_pond = Math.round(
    PRODUCTOS.reduce((sum, p) => sum + (p.ganancia_neta * p.participacion / 100), 0)
  )
  const total_cubrir = cf + pauta
  const pe_pedidos = Math.ceil(total_cubrir / ganancia_pond)
  const pe_ventas = pe_pedidos * PRODUCTOS.reduce((s,p) => s + p.pvp * p.participacion/100, 0)
  const pe_por_dia = Math.ceil(pe_pedidos / 30)

  // Tiempo real
  const ganancia_acum = pedidosActuales * ganancia_pond
  const pct_cubierto = Math.min(Math.round((ganancia_acum / total_cubrir) * 100), 100)
  const cf_cubierto = Math.min(Math.round((ganancia_acum / cf) * 100), 100)
  const pauta_cubierta = ganancia_acum > cf ? Math.min(Math.round(((ganancia_acum - cf) / pauta) * 100), 100) : 0
  const dias_restantes = 30 - diaActual
  const pedidos_necesarios = Math.max(pe_pedidos - pedidosActuales, 0)
  const pedidos_dia_necesarios = dias_restantes > 0 ? Math.ceil(pedidos_necesarios / dias_restantes) : 0
  const va_bien = pedidosActuales >= (pe_pedidos * diaActual / 30)

  // Escenarios
  const escenarios = [
    { nombre:'Pesimista', pct:0.7, color:'#F05C5C' },
    { nombre:'Realista', pct:1.0, color:'#F5A623' },
    { nombre:'Optimista', pct:1.3, color:'#2DD4A0' },
  ].map(e => ({
    ...e,
    pedidos_mes: Math.round(pe_pedidos * e.pct),
    ganancia_mes: Math.round(pe_pedidos * e.pct * ganancia_pond - total_cubrir),
    ventas_mes: Math.round(pe_pedidos * e.pct * (pe_ventas / pe_pedidos)),
  }))

  const s = { background:'#111520', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'12px' }
  const inp = { background:'#0A0D14', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'7px', color:'#E8EDF5', padding:'7px 10px', fontSize:'13px', outline:'none', width:'140px' }

  return (
    <div style={{ color:'#E8EDF5', fontFamily:'system-ui, sans-serif' }}>

      <div style={{ marginBottom:'20px' }}>
        <h1 style={{ fontSize:'22px', fontWeight:'700', marginBottom:'4px' }}>⚖️ Punto de Equilibrio</h1>
        <p style={{ fontSize:'13px', color:'#8B96A8' }}>¿Cuántos pedidos necesito para no perder dinero? · PLANEAR → VERIFICAR</p>
      </div>

      {/* Parámetros */}
      <div style={{ ...s, padding:'16px 20px', marginBottom:'16px', display:'flex', gap:'24px', alignItems:'center', flexWrap:'wrap' }}>
        <span style={{ fontSize:'12px', color:'#8B96A8', fontWeight:'700' }}>⚙️ Parámetros:</span>
        {[
          { label:'Costos Fijos/mes', val:cf, set:setCf },
          { label:'Inversión Pauta/mes', val:pauta, set:setPauta },
        ].map((item, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <label style={{ fontSize:'11px', color:'#5A6478' }}>{item.label}</label>
            <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
              <span style={{ fontSize:'12px', color:'#8B96A8' }}>$</span>
              <input type="number" value={item.val} onChange={e => item.set(Number(e.target.value))} style={inp} />
            </div>
          </div>
        ))}
        <div style={{ marginLeft:'auto', textAlign:'right' }}>
          <div style={{ fontSize:'11px', color:'#5A6478' }}>Total a cubrir</div>
          <div style={{ fontSize:'18px', fontWeight:'800', color:'#F05C5C' }}>${total_cubrir.toLocaleString('es-CO')}</div>
        </div>
      </div>

      {/* KPIs principales */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', marginBottom:'16px' }}>
        {[
          { label:'Pedidos para PE', value:pe_pedidos.toLocaleString(), sub:'entregas efectivas', color:'#F5A623', icon:'📦' },
          { label:'Pedidos / día', value:pe_por_dia.toString(), sub:'para cubrir en 30 días', color:'#3D8EF0', icon:'📅' },
          { label:'Ventas para PE', value:`$${Math.round(pe_ventas/1000)}K`, sub:'facturación mínima', color:'#9B6BFF', icon:'💰' },
          { label:'Ganancia pond.', value:`$${ganancia_pond.toLocaleString('es-CO')}`, sub:'por pedido entregado', color:'#2DD4A0', icon:'💹' },
        ].map((k,i) => (
          <div key={i} style={{ ...s, padding:'16px', borderTop:`2px solid ${k.color}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
              <span style={{ fontSize:'11px', color:'#8B96A8' }}>{k.label}</span>
              <span style={{ fontSize:'16px' }}>{k.icon}</span>
            </div>
            <div style={{ fontSize:'22px', fontWeight:'800', color:k.color }}>{k.value}</div>
            <div style={{ fontSize:'10px', color:'#5A6478', marginTop:'3px' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'6px', marginBottom:'16px' }}>
        {[
          { key:'pe', label:'⚖️ Punto de Equilibrio' },
          { key:'tiempo_real', label:'📊 Tiempo Real' },
          { key:'proyeccion', label:'🎯 Escenarios' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            style={{ padding:'8px 16px', borderRadius:'9px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'600',
              background: tab === t.key ? '#F5A623' : 'rgba(255,255,255,0.05)',
              color: tab === t.key ? '#0A0D14' : '#8B96A8' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB PE */}
      {tab === 'pe' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>

          {/* Cascada de obligaciones */}
          <div style={{ ...s, padding:'20px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'14px' }}>💸 OBLIGACIONES MENSUALES</div>
            {[
              { label:'Costos Fijos', value:cf, color:'#F05C5C', icon:'🏢' },
              { label:'Inversión en Pauta', value:pauta, color:'#9B6BFF', icon:'📢' },
              { label:'TOTAL A CUBRIR', value:total_cubrir, color:'#F5A623', icon:'⚖️', total:true },
            ].map((row, i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
                padding:'12px 14px', borderRadius:'8px', marginBottom:'6px',
                background: row.total ? 'rgba(245,166,35,0.06)' : 'rgba(255,255,255,0.02)',
                border: row.total ? '1px solid rgba(245,166,35,0.2)' : '1px solid transparent' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  <span>{row.icon}</span>
                  <span style={{ fontSize:'13px', color: row.total ? '#E8EDF5' : '#8B96A8', fontWeight: row.total ? '700' : '400' }}>{row.label}</span>
                </div>
                <span style={{ fontSize:row.total ? '18px' : '14px', fontWeight:'800', color:row.color }}>
                  ${row.value.toLocaleString('es-CO')}
                </span>
              </div>
            ))}

            <div style={{ marginTop:'16px', padding:'12px 14px', background:'rgba(45,212,160,0.06)', borderRadius:'8px', border:'1px solid rgba(45,212,160,0.2)' }}>
              <div style={{ fontSize:'11px', color:'#2DD4A0', fontWeight:'700', marginBottom:'6px' }}>📊 MEZCLA DE PRODUCTOS</div>
              {PRODUCTOS.map((p, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'4px 0', borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                  <span style={{ fontSize:'11px', color:'#8B96A8' }}>{p.nombre}</span>
                  <div style={{ display:'flex', gap:'12px' }}>
                    <span style={{ fontSize:'11px', color:'#5A6478' }}>{p.participacion}%</span>
                    <span style={{ fontSize:'11px', color:'#2DD4A0', fontWeight:'600' }}>${p.ganancia_neta.toLocaleString()}/pedido</span>
                  </div>
                </div>
              ))}
              <div style={{ marginTop:'8px', display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontSize:'12px', color:'#8B96A8' }}>Ganancia ponderada</span>
                <span style={{ fontSize:'14px', fontWeight:'800', color:'#2DD4A0' }}>${ganancia_pond.toLocaleString('es-CO')}</span>
              </div>
            </div>
          </div>

          {/* Gráfico de barras PE */}
          <div style={{ ...s, padding:'20px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#3D8EF0', marginBottom:'14px' }}>📈 PEDIDOS vs PUNTO DE EQUILIBRIO</div>

            <div style={{ marginBottom:'20px' }}>
              {[100,200,300,pe_pedidos,500,600].sort((a,b)=>a-b).map((n, i) => {
                const pct = Math.min((n / (pe_pedidos * 1.5)) * 100, 100)
                const esPE = n === pe_pedidos
                const gana = n > pe_pedidos
                return (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
                    <span style={{ fontSize:'11px', color: esPE ? '#F5A623' : '#5A6478', width:'50px', textAlign:'right', fontWeight: esPE ? '700' : '400' }}>
                      {n}
                    </span>
                    <div style={{ flex:1, height:'20px', background:'rgba(255,255,255,0.04)', borderRadius:'4px', overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${pct}%`, borderRadius:'4px', transition:'width .3s',
                        background: esPE ? '#F5A623' : gana ? '#2DD4A0' : '#F05C5C' }} />
                    </div>
                    <span style={{ fontSize:'10px', color: esPE ? '#F5A623' : gana ? '#2DD4A0' : '#F05C5C', width:'70px', fontWeight:'600' }}>
                      {esPE ? '⚖️ PE' : gana ? `+$${Math.round((n-pe_pedidos)*ganancia_pond/1000)}K` : `-$${Math.round((pe_pedidos-n)*ganancia_pond/1000)}K`}
                    </span>
                  </div>
                )
              })}
            </div>

            <div style={{ padding:'14px', background:'rgba(245,166,35,0.06)', borderRadius:'10px', border:'1px solid rgba(245,166,35,0.2)' }}>
              <div style={{ fontSize:'13px', color:'#8B96A8', lineHeight:'1.7' }}>
                Con <strong style={{ color:'#E8EDF5' }}>{pe_pedidos} pedidos entregados</strong> al mes
                ({pe_por_dia}/día) cubres tus costos fijos y pauta.
                A partir del pedido {pe_pedidos + 1}, <strong style={{ color:'#2DD4A0' }}>cada entrega
                genera ${ganancia_pond.toLocaleString('es-CO')} de utilidad real</strong> para tu bolsillo.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB TIEMPO REAL */}
      {tab === 'tiempo_real' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div style={{ ...s, padding:'20px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#2DD4A0', marginBottom:'16px' }}>📊 SEGUIMIENTO DEL MES</div>

            <div style={{ display:'flex', gap:'16px', marginBottom:'20px' }}>
              {[
                { label:'Día actual', val:diaActual, set:setDiaActual, max:30 },
                { label:'Pedidos entregados', val:pedidosActuales, set:setPedidosActuales, max:2000 },
              ].map((item, i) => (
                <div key={i}>
                  <label style={{ display:'block', fontSize:'11px', color:'#5A6478', marginBottom:'5px' }}>{item.label}</label>
                  <input type="number" value={item.val} min={1} max={item.max}
                    onChange={e => item.set(Number(e.target.value))}
                    style={{ ...inp, width:'110px' }} />
                </div>
              ))}
            </div>

            {/* Barra de progreso total */}
            <div style={{ marginBottom:'16px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                <span style={{ fontSize:'12px', color:'#8B96A8' }}>Progreso hacia el PE</span>
                <span style={{ fontSize:'14px', fontWeight:'800', color: va_bien ? '#2DD4A0' : '#F05C5C' }}>{pct_cubierto}%</span>
              </div>
              <div style={{ height:'16px', background:'rgba(255,255,255,0.06)', borderRadius:'8px', overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${pct_cubierto}%`, background: va_bien ? '#2DD4A0' : '#F05C5C', borderRadius:'8px', transition:'width .5s' }} />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:'4px' }}>
                <span style={{ fontSize:'10px', color:'#5A6478' }}>$0</span>
                <span style={{ fontSize:'10px', color:'#F5A623' }}>PE: ${total_cubrir.toLocaleString('es-CO')}</span>
              </div>
            </div>

            {/* Barras CF y Pauta */}
            <div style={{ marginBottom:'16px' }}>
              {[
                { label:'Costos Fijos cubiertos', pct:cf_cubierto, color:'#3D8EF0' },
                { label:'Pauta cubierta', pct:pauta_cubierta, color:'#9B6BFF' },
              ].map((bar, i) => (
                <div key={i} style={{ marginBottom:'10px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                    <span style={{ fontSize:'11px', color:'#8B96A8' }}>{bar.label}</span>
                    <span style={{ fontSize:'12px', fontWeight:'700', color:bar.color }}>{bar.pct}%</span>
                  </div>
                  <div style={{ height:'8px', background:'rgba(255,255,255,0.05)', borderRadius:'4px', overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${bar.pct}%`, background:bar.color, borderRadius:'4px' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Status */}
            <div style={{ padding:'14px', background: va_bien ? 'rgba(45,212,160,0.06)' : 'rgba(240,92,92,0.06)', borderRadius:'10px', border:`1px solid ${va_bien ? 'rgba(45,212,160,0.2)' : 'rgba(240,92,92,0.2)'}` }}>
              <div style={{ fontSize:'15px', fontWeight:'700', color: va_bien ? '#2DD4A0' : '#F05C5C', marginBottom:'6px' }}>
                {va_bien ? '✅ Vas bien — en ritmo para cubrir el PE' : '⚠️ Vas por debajo — necesitas acelerar'}
              </div>
              <div style={{ fontSize:'12px', color:'#8B96A8', lineHeight:'1.6' }}>
                {pedidosActuales >= pe_pedidos
                  ? `🎉 ¡Ya superaste el punto de equilibrio! Ganancia adicional: $${((pedidosActuales - pe_pedidos) * ganancia_pond).toLocaleString('es-CO')}`
                  : `Necesitas ${pedidosActuales_necesarios || pedidos_necesarios} pedidos más en ${dias_restantes} días → ${pedidos_dia_necesarios}/día`}
              </div>
            </div>
          </div>

          <div style={{ ...s, padding:'20px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'14px' }}>📅 CALENDARIO DEL MES</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'4px' }}>
              {Array.from({length:30}, (_, i) => i+1).map(dia => {
                const pedidosDia = Math.round(pedidosActuales / diaActual)
                const acumDia = pedidosDia * dia
                const cubreDia = acumDia >= pe_pedidos
                const esPE_dia = !cubreDia && (pedidosDia * (dia+1)) >= pe_pedidos
                const esFuturo = dia > diaActual
                const esHoy = dia === diaActual
                return (
                  <div key={dia} style={{ padding:'6px 4px', borderRadius:'6px', textAlign:'center',
                    background: esHoy ? '#F5A623' : esPE_dia ? '#9B6BFF33' : cubreDia ? 'rgba(45,212,160,0.15)' : esFuturo ? 'rgba(255,255,255,0.03)' : 'rgba(240,92,92,0.1)',
                    border: esHoy ? 'none' : '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ fontSize:'11px', fontWeight:'700', color: esHoy ? '#0A0D14' : esPE_dia ? '#9B6BFF' : cubreDia ? '#2DD4A0' : esFuturo ? '#3A4460' : '#F05C5C' }}>
                      {dia}
                    </div>
                    {!esFuturo && <div style={{ fontSize:'8px', color: esHoy ? '#0A0D14' : '#5A6478' }}>{acumDia}</div>}
                  </div>
                )
              })}
            </div>
            <div style={{ display:'flex', gap:'12px', marginTop:'12px', flexWrap:'wrap' }}>
              {[
                { color:'rgba(240,92,92,0.3)', label:'Bajo PE' },
                { color:'#9B6BFF33', label:'Día PE' },
                { color:'rgba(45,212,160,0.15)', label:'Sobre PE' },
                { color:'#F5A623', label:'Hoy' },
              ].map((l, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'5px' }}>
                  <div style={{ width:'10px', height:'10px', borderRadius:'3px', background:l.color }} />
                  <span style={{ fontSize:'10px', color:'#5A6478' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB ESCENARIOS */}
      {tab === 'proyeccion' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px' }}>
          {escenarios.map((e, i) => (
            <div key={i} style={{ ...s, padding:'20px', borderTop:`3px solid ${e.color}` }}>
              <div style={{ fontSize:'14px', fontWeight:'800', color:e.color, marginBottom:'4px' }}>{e.nombre}</div>
              <div style={{ fontSize:'12px', color:'#5A6478', marginBottom:'16px' }}>
                {e.pct < 1 ? 'Peores tasas — devolución alta, pauta cara' :
                 e.pct === 1 ? 'Tasas actuales mantenidas' :
                 'Mejores tasas — conversión alta, pocas devoluciones'}
              </div>
              {[
                { label:'Pedidos/mes', value:e.pedidos_mes.toLocaleString(), color:'#E8EDF5' },
                { label:'Ventas brutas', value:`$${Math.round(e.ventas_mes/1000)}K`, color:'#8B96A8' },
                { label:'Costos totales', value:`$${total_cubrir.toLocaleString('es-CO')}`, color:'#F05C5C' },
                { label:'Utilidad neta', value:`$${e.ganancia_mes.toLocaleString('es-CO')}`, color: e.ganancia_mes >= 0 ? '#2DD4A0' : '#F05C5C' },
              ].map((row, j) => (
                <div key={j} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize:'12px', color:'#8B96A8' }}>{row.label}</span>
                  <span style={{ fontSize:'14px', fontWeight:'700', color:row.color }}>{row.value}</span>
                </div>
              ))}
              <div style={{ marginTop:'14px', padding:'10px 12px', background:`${e.color}12`, borderRadius:'8px', border:`1px solid ${e.color}33` }}>
                <div style={{ fontSize:'11px', color:e.color, fontWeight:'700', marginBottom:'3px' }}>
                  {e.ganancia_mes >= 0 ? '✓ Negocio rentable' : '✗ Negocio en pérdida'}
                </div>
                <div style={{ fontSize:'11px', color:'#8B96A8' }}>
                  {e.ganancia_mes >= 0
                    ? `Genera $${e.ganancia_mes.toLocaleString('es-CO')} después de cubrir todo`
                    : `Pierde $${Math.abs(e.ganancia_mes).toLocaleString('es-CO')} al mes`}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop:'16px', padding:'12px 16px', background:'#111520', borderRadius:'10px', border:'1px solid rgba(255,255,255,0.05)', fontSize:'12px', color:'#5A6478' }}>
        📌 El PE se calcula con la mezcla real de tus productos — no con un solo producto.
        La ganancia ponderada de <strong style={{ color:'#2DD4A0' }}>${ganancia_pond.toLocaleString('es-CO')}/pedido</strong> refleja tu mix actual.
      </div>
    </div>
  )
}
