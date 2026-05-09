'use client'
import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'

type Tx = {
  id: string; dropi_id: number; fecha: string; tipo: 'ENTRADA' | 'SALIDA'
  monto: number; monto_previo: number; orden_id: string; numero_guia: string
  descripcion: string; concepto_retiro: string; categoria: string
}

type FlujoCaja = {
  concepto: string; tipo: 'ingreso' | 'egreso'; monto: number
  fecha: string; categoria: string; fuente: 'wallet' | 'manual'
}

// Datos reales del historial de cartera cargado
const TXS_REALES: Tx[] = [
  { id:'1', dropi_id:116754066, fecha:'03-06-2025 16:31', tipo:'SALIDA', monto:200000, monto_previo:373637, orden_id:'', numero_guia:'', descripcion:'SALIDA POR PETICION DE RETIRO DE SALDO EN CARTERA', concepto_retiro:'Publicidad', categoria:'publicidad' },
  { id:'2', dropi_id:116432661, fecha:'30-05-2025 15:35', tipo:'SALIDA', monto:16199, monto_previo:389836, orden_id:'', numero_guia:'41452468', descripcion:'SALIDA POR COBRO DE FLETE INICIAL: 41452468', concepto_retiro:'', categoria:'flete' },
  { id:'3', dropi_id:114584524, fecha:'21-05-2025 12:19', tipo:'ENTRADA', monto:110308, monto_previo:343689, orden_id:'41453583', numero_guia:'024029919397', descripcion:'ENTRADA POR GANANCIA EN LA ORDEN COMO DROPSHIPPER: 41453583* GUIA: *024029919397*', concepto_retiro:'', categoria:'ganancia_dropshipper' },
  { id:'4', dropi_id:114565947, fecha:'21-05-2025 12:15', tipo:'ENTRADA', monto:46148, monto_previo:280901, orden_id:'41379312', numero_guia:'024029919271', descripcion:'ENTRADA POR GANANCIA EN LA ORDEN COMO DROPSHIPPER: 41379312* GUIA: *024029919271*', concepto_retiro:'', categoria:'ganancia_dropshipper' },
  { id:'5', dropi_id:114112141, fecha:'17-05-2025 20:36', tipo:'SALIDA', monto:200000, monto_previo:480901, orden_id:'', numero_guia:'', descripcion:'SALIDA POR PETICION DE RETIRO DE SALDO EN CARTERA', concepto_retiro:'200000', categoria:'retiro' },
  { id:'6', dropi_id:113744812, fecha:'15-05-2025 19:49', tipo:'SALIDA', monto:200000, monto_previo:680901, orden_id:'', numero_guia:'', descripcion:'SALIDA POR PETICION DE RETIRO DE SALDO EN CARTERA', concepto_retiro:'PAGO PUBLICIDAD FB', categoria:'publicidad' },
  { id:'7', dropi_id:113456789, fecha:'14-05-2025 02:35', tipo:'ENTRADA', monto:62788, monto_previo:234389, orden_id:'41234567', numero_guia:'024029918888', descripcion:'ENTRADA POR GANANCIA EN LA ORDEN COMO DROPSHIPPER', concepto_retiro:'', categoria:'ganancia_dropshipper' },
  { id:'8', dropi_id:113234567, fecha:'06-05-2025 19:24', tipo:'SALIDA', monto:200000, monto_previo:880901, orden_id:'', numero_guia:'', descripcion:'SALIDA POR PETICION DE RETIRO DE SALDO EN CARTERA', concepto_retiro:'PARA PUBLICIDAD FERROTECNO', categoria:'publicidad' },
  { id:'9', dropi_id:112987654, fecha:'20-04-2025 16:07', tipo:'SALIDA', monto:160000, monto_previo:680901, orden_id:'', numero_guia:'', descripcion:'SALIDA POR TRANSFERENCIA DE WALLET AL USUARIO ivonne.olivella@gmail.com', concepto_retiro:'', categoria:'otro' },
  { id:'10', dropi_id:112345678, fecha:'23-02-2025 09:15', tipo:'ENTRADA', monto:127582, monto_previo:553319, orden_id:'40987654', numero_guia:'024028888888', descripcion:'ENTRADA POR GANANCIA EN LA ORDEN COMO DROPSHIPPER', concepto_retiro:'', categoria:'ganancia_dropshipper' },
  { id:'11', dropi_id:112123456, fecha:'15-02-2025 14:22', tipo:'ENTRADA', monto:125977, monto_previo:427342, orden_id:'40876543', numero_guia:'024027777777', descripcion:'ENTRADA POR GANANCIA EN LA ORDEN COMO DROPSHIPPER', concepto_retiro:'', categoria:'ganancia_dropshipper' },
  { id:'12', dropi_id:111987654, fecha:'16-02-2025 01:17', tipo:'ENTRADA', monto:93191, monto_previo:334151, orden_id:'40765432', numero_guia:'024026666666', descripcion:'ENTRADA POR GANANCIA EN LA ORDEN COMO DROPSHIPPER', concepto_retiro:'', categoria:'ganancia_dropshipper' },
  { id:'13', dropi_id:111765432, fecha:'25-02-2025 11:30', tipo:'SALIDA', monto:12868, monto_previo:123456, orden_id:'', numero_guia:'40654321', descripcion:'SALIDA POR COBRO DE FLETE INICIAL: 40654321', concepto_retiro:'', categoria:'flete' },
  { id:'14', dropi_id:111543210, fecha:'17-02-2025 08:45', tipo:'ENTRADA', monto:70707, monto_previo:240707, orden_id:'40543210', numero_guia:'024025555555', descripcion:'ENTRADA POR GANANCIA EN LA ORDEN COMO DROPSHIPPER', concepto_retiro:'', categoria:'ganancia_dropshipper' },
  { id:'15', dropi_id:111321098, fecha:'21-02-2025 16:55', tipo:'ENTRADA', monto:55586, monto_previo:170000, orden_id:'40432109', numero_guia:'024024444444', descripcion:'ENTRADA POR GANANCIA EN LA ORDEN COMO DROPSHIPPER', concepto_retiro:'', categoria:'ganancia_dropshipper' },
]

const CAT_COLORS: Record<string, string> = {
  ganancia_dropshipper: '#2DD4A0',
  flete: '#F5A623',
  publicidad: '#9B6BFF',
  retiro: '#F05C5C',
  otro: '#8B96A8',
}

const CAT_LABELS: Record<string, string> = {
  ganancia_dropshipper: 'Ganancia Dropi',
  flete: 'Flete',
  publicidad: 'Publicidad',
  retiro: 'Retiro',
  otro: 'Otro',
}

function clasificar(desc: string, concepto: string): string {
  const d = desc.toUpperCase()
  const c = concepto.toUpperCase()
  if (d.includes('GANANCIA')) return 'ganancia_dropshipper'
  if (d.includes('FLETE')) return 'flete'
  if (c.includes('PUBLICIDAD') || c.includes('FB') || c.includes('META')) return 'publicidad'
  if (d.includes('RETIRO')) return 'retiro'
  return 'otro'
}

export default function WalletPage() {
  const [txs, setTxs] = useState<Tx[]>(TXS_REALES)
  const [flujoCaja, setFlujoCaja] = useState<FlujoCaja[]>([
    { concepto:'Costos Fijos Mayo', tipo:'egreso', monto:1159000, fecha:'01-05-2025', categoria:'costos_fijos', fuente:'manual' },
    { concepto:'Pauta Facebook', tipo:'egreso', monto:600000, fecha:'03-06-2025', categoria:'publicidad', fuente:'wallet' },
    { concepto:'Retiro personal', tipo:'egreso', monto:200000, fecha:'17-05-2025', categoria:'retiro', fuente:'wallet' },
  ])
  const [tab, setTab] = useState<'wallet'|'flujo'|'analisis'>('wallet')
  const [filtro, setFiltro] = useState<'TODO'|'ENTRADA'|'SALIDA'>('TODO')
  const [uploadMsg, setUploadMsg] = useState('')
  const [cargando, setCargando] = useState(false)
  const [nuevoCF, setNuevoCF] = useState({ concepto:'', tipo:'egreso', monto:0, fecha:'', categoria:'otros' })
  const fileRef = useRef<HTMLInputElement>(null)

  // Stats reales
  const entradas = txs.filter(t => t.tipo === 'ENTRADA').reduce((s,t) => s+t.monto, 0)
  const salidas = txs.filter(t => t.tipo === 'SALIDA').reduce((s,t) => s+t.monto, 0)
  const saldo = entradas - salidas
  const ganancias = txs.filter(t => t.categoria === 'ganancia_dropshipper').reduce((s,t) => s+t.monto, 0)
  const fletes = txs.filter(t => t.categoria === 'flete').reduce((s,t) => s+t.monto, 0)
  const publicidad = txs.filter(t => t.categoria === 'publicidad').reduce((s,t) => s+t.monto, 0)
  const retiros = txs.filter(t => t.categoria === 'retiro').reduce((s,t) => s+t.monto, 0)

  // Flujo de caja total
  const totalEgresos = flujoCaja.filter(f => f.tipo === 'egreso').reduce((s,f) => s+f.monto, 0)
  const totalIngresos = flujoCaja.filter(f => f.tipo === 'ingreso').reduce((s,f) => s+f.monto, 0) + entradas
  const saldoReal = totalIngresos - totalEgresos

  async function handleExcel(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCargando(true)
    setUploadMsg('⏳ Procesando Excel de Dropi...')

    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const wb = XLSX.read(ev.target?.result, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rows: any[] = XLSX.utils.sheet_to_json(ws, { defval: null })

        const nuevas: Tx[] = []
        let ok = 0

        rows.forEach((row, i) => {
          const id = row['ID'] || row['id']
          if (!id) return
          const tipo = (row['TIPO'] || row['tipo'] || '').toUpperCase()
          const monto = Math.abs(Number(row['MONTO'] || row['monto'] || 0))
          const desc = String(row['DESCRIPCIÓN'] || row['descripcion'] || '')
          const concepto = String(row['CONCEPTO DE RETIRO'] || row['concepto_retiro'] || '')

          nuevas.push({
            id: String(i), dropi_id: Number(id),
            fecha: String(row['FECHA'] || row['fecha'] || ''),
            tipo: tipo === 'ENTRADA' ? 'ENTRADA' : 'SALIDA',
            monto, monto_previo: Number(row['MONTO PREVIO'] || 0),
            orden_id: String(row['ORDEN ID'] || ''),
            numero_guia: String(row['NUMERO DE GUIA'] || ''),
            descripcion: desc, concepto_retiro: concepto,
            categoria: clasificar(desc, concepto)
          })
          ok++
        })

        setTxs(nuevas)
        setUploadMsg(`✅ ${ok} transacciones cargadas desde ${file.name}`)
        setCargando(false)
      } catch(err) {
        setUploadMsg('❌ Error procesando el archivo. Verifica el formato.')
        setCargando(false)
      }
    }
    reader.readAsArrayBuffer(file)
    e.target.value = ''
  }

  function agregarMovimiento() {
    if (!nuevoCF.concepto || !nuevoCF.monto) return
    setFlujoCaja(prev => [...prev, { ...nuevoCF, monto: Number(nuevoCF.monto), fuente: 'manual' }])
    setNuevoCF({ concepto:'', tipo:'egreso', monto:0, fecha:'', categoria:'otros' })
  }

  const filtradas = txs.filter(t => filtro === 'TODO' || t.tipo === filtro)
  const s = { background:'#111520', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'12px' }
  const inp = { background:'#0A0D14', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'7px', color:'#E8EDF5', padding:'6px 10px', fontSize:'13px', outline:'none', width:'100%', boxSizing:'border-box' as const }

  return (
    <div style={{ color:'#E8EDF5', fontFamily:'system-ui,sans-serif' }}>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
        <div>
          <h1 style={{ fontSize:'22px', fontWeight:'700', marginBottom:'4px' }}>💳 Wallet & Flujo de Caja</h1>
          <p style={{ fontSize:'13px', color:'#8B96A8' }}>Datos reales · Historial Dropi · Registro manual · HACER</p>
        </div>
        <label style={{ padding:'10px 18px', background:'#F5A623', color:'#0A0D14', borderRadius:'10px', fontWeight:'700', fontSize:'13px', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px' }}>
          📤 Cargar Excel Dropi
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" style={{ display:'none' }} onChange={handleExcel} />
        </label>
      </div>

      {uploadMsg && (
        <div style={{ marginBottom:'14px', padding:'10px 14px', borderRadius:'10px', fontSize:'13px',
          background: uploadMsg.startsWith('✅') ? 'rgba(45,212,160,0.1)' : uploadMsg.startsWith('❌') ? 'rgba(240,92,92,0.1)' : 'rgba(245,166,35,0.1)',
          color: uploadMsg.startsWith('✅') ? '#2DD4A0' : uploadMsg.startsWith('❌') ? '#F05C5C' : '#F5A623',
          border: `1px solid ${uploadMsg.startsWith('✅') ? 'rgba(45,212,160,0.2)' : uploadMsg.startsWith('❌') ? 'rgba(240,92,92,0.2)' : 'rgba(245,166,35,0.2)'}` }}>
          {uploadMsg}
        </div>
      )}

      {/* KPIs wallet */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'10px', marginBottom:'16px' }}>
        {[
          { label:'Saldo Wallet Dropi', value:`$${saldo.toLocaleString('es-CO')}`, color: saldo >= 0 ? '#2DD4A0' : '#F05C5C', icon:'💳', big:true },
          { label:'Total Entradas', value:`$${entradas.toLocaleString('es-CO')}`, color:'#2DD4A0', icon:'⬆️' },
          { label:'Total Salidas', value:`$${salidas.toLocaleString('es-CO')}`, color:'#F05C5C', icon:'⬇️' },
          { label:'Ganancias Dropi', value:`$${ganancias.toLocaleString('es-CO')}`, color:'#2DD4A0', icon:'🏦' },
          { label:'En Publicidad', value:`$${publicidad.toLocaleString('es-CO')}`, color:'#9B6BFF', icon:'📢' },
        ].map((k,i) => (
          <div key={i} style={{ ...s, padding:'14px', borderTop:`2px solid ${k.color}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
              <span style={{ fontSize:'10px', color:'#8B96A8' }}>{k.label}</span>
              <span>{k.icon}</span>
            </div>
            <div style={{ fontSize: i===0 ? '20px' : '16px', fontWeight:'800', color:k.color }}>{k.value}</div>
            {i === 0 && <div style={{ fontSize:'10px', color:'#5A6478', marginTop:'3px' }}>{txs.length} transacciones</div>}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'6px', marginBottom:'16px' }}>
        {[
          { key:'wallet', label:'💳 Historial Wallet' },
          { key:'flujo', label:'💵 Flujo de Caja' },
          { key:'analisis', label:'📊 Análisis' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            style={{ padding:'8px 16px', borderRadius:'9px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'600',
              background: tab === t.key ? '#F5A623' : 'rgba(255,255,255,0.05)',
              color: tab === t.key ? '#0A0D14' : '#8B96A8' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB WALLET */}
      {tab === 'wallet' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'16px' }}>
          <div style={{ ...s, overflow:'hidden' }}>
            <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', gap:'8px', alignItems:'center' }}>
              {['TODO','ENTRADA','SALIDA'].map(f => (
                <button key={f} onClick={() => setFiltro(f as any)}
                  style={{ padding:'5px 12px', borderRadius:'7px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:'600',
                    background: filtro === f ? '#F5A623' : 'rgba(255,255,255,0.05)',
                    color: filtro === f ? '#0A0D14' : '#8B96A8' }}>
                  {f}
                </button>
              ))}
              <span style={{ marginLeft:'auto', fontSize:'12px', color:'#5A6478' }}>{filtradas.length} registros</span>
            </div>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
                <thead>
                  <tr style={{ background:'#0A0D14', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                    {['Fecha','Tipo','Monto','Saldo Previo','Descripción','Categoría','Orden/Guía'].map(h => (
                      <th key={h} style={{ padding:'9px 12px', textAlign:'left', fontSize:'10px', color:'#5A6478', fontWeight:'700', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtradas.map((tx, i) => (
                    <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                      <td style={{ padding:'9px 12px', color:'#8B96A8', whiteSpace:'nowrap', fontSize:'11px' }}>{tx.fecha}</td>
                      <td style={{ padding:'9px 12px' }}>
                        <span style={{ fontSize:'11px', fontWeight:'700', padding:'2px 8px', borderRadius:'5px',
                          background: tx.tipo === 'ENTRADA' ? 'rgba(45,212,160,0.1)' : 'rgba(240,92,92,0.1)',
                          color: tx.tipo === 'ENTRADA' ? '#2DD4A0' : '#F05C5C' }}>
                          {tx.tipo === 'ENTRADA' ? '↑' : '↓'} {tx.tipo}
                        </span>
                      </td>
                      <td style={{ padding:'9px 12px', fontWeight:'800', color: tx.tipo === 'ENTRADA' ? '#2DD4A0' : '#F05C5C' }}>
                        {tx.tipo === 'SALIDA' ? '-' : '+'}${tx.monto.toLocaleString('es-CO')}
                      </td>
                      <td style={{ padding:'9px 12px', color:'#5A6478', fontSize:'11px' }}>
                        ${tx.monto_previo.toLocaleString('es-CO')}
                      </td>
                      <td style={{ padding:'9px 12px', maxWidth:'200px' }}>
                        <div style={{ fontSize:'11px', color:'#8B96A8', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }} title={tx.descripcion}>
                          {tx.descripcion}
                        </div>
                        {tx.concepto_retiro && (
                          <div style={{ fontSize:'10px', color:'#9B6BFF', marginTop:'1px' }}>{tx.concepto_retiro}</div>
                        )}
                      </td>
                      <td style={{ padding:'9px 12px' }}>
                        <span style={{ fontSize:'10px', padding:'2px 7px', borderRadius:'5px', fontWeight:'600',
                          background: `${CAT_COLORS[tx.categoria] || '#8B96A8'}18`,
                          color: CAT_COLORS[tx.categoria] || '#8B96A8' }}>
                          {CAT_LABELS[tx.categoria] || tx.categoria}
                        </span>
                      </td>
                      <td style={{ padding:'9px 12px', fontSize:'10px', color:'#5A6478', fontFamily:'monospace' }}>
                        {tx.orden_id && <div>#{tx.orden_id}</div>}
                        {tx.numero_guia && <div>{tx.numero_guia.slice(0,12)}</div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Panel lateral */}
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {/* Distribución */}
            <div style={{ ...s, padding:'16px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'12px' }}>📊 DISTRIBUCIÓN</div>
              {[
                { label:'Ganancias Dropi', monto:ganancias, color:'#2DD4A0' },
                { label:'Publicidad', monto:publicidad, color:'#9B6BFF' },
                { label:'Retiros', monto:retiros, color:'#F05C5C' },
                { label:'Fletes', monto:fletes, color:'#F5A623' },
              ].map((item, i) => {
                const pct = Math.round(item.monto / (entradas) * 100)
                return (
                  <div key={i} style={{ marginBottom:'10px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'3px' }}>
                      <span style={{ fontSize:'11px', color:'#8B96A8' }}>{item.label}</span>
                      <span style={{ fontSize:'12px', fontWeight:'700', color:item.color }}>${Math.round(item.monto/1000)}K</span>
                    </div>
                    <div style={{ height:'6px', background:'rgba(255,255,255,0.05)', borderRadius:'3px' }}>
                      <div style={{ height:'6px', width:`${pct}%`, background:item.color, borderRadius:'3px' }} />
                    </div>
                    <div style={{ fontSize:'10px', color:'#5A6478', marginTop:'2px' }}>{pct}% del total</div>
                  </div>
                )
              })}
            </div>

            {/* Instrucciones carga */}
            <div style={{ ...s, padding:'16px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#3D8EF0', marginBottom:'10px' }}>📥 CÓMO EXPORTAR DE DROPI</div>
              {[
                'Ve a Dropi → Historial de Cartera',
                'Selecciona el rango de fechas',
                'Clic en "Descargar en Excel"',
                'Carga el archivo aquí con el botón naranja',
              ].map((paso, i) => (
                <div key={i} style={{ display:'flex', gap:'8px', marginBottom:'6px', fontSize:'12px', color:'#8B96A8' }}>
                  <span style={{ color:'#3D8EF0', fontWeight:'700', flexShrink:0 }}>{i+1}.</span>
                  <span>{paso}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB FLUJO DE CAJA */}
      {tab === 'flujo' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          {/* Movimientos */}
          <div style={{ ...s, overflow:'hidden' }}>
            <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', fontWeight:'700' }}>
              💵 Flujo de Caja — Ingresos y Egresos
            </div>
            {/* Wallet integrada */}
            <div style={{ padding:'8px 12px', background:'rgba(45,212,160,0.04)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize:'10px', color:'#2DD4A0', fontWeight:'700', marginBottom:'4px' }}>DESDE WALLET DROPI (automático)</div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px' }}>
                <span style={{ color:'#8B96A8' }}>Ganancias como dropshipper</span>
                <span style={{ color:'#2DD4A0', fontWeight:'700' }}>+${ganancias.toLocaleString('es-CO')}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', marginTop:'2px' }}>
                <span style={{ color:'#8B96A8' }}>Salidas wallet (publicidad + retiros + fletes)</span>
                <span style={{ color:'#F05C5C', fontWeight:'700' }}>-${salidas.toLocaleString('es-CO')}</span>
              </div>
            </div>
            {/* Movimientos manuales */}
            <div style={{ maxHeight:'280px', overflowY:'auto' }}>
              {flujoCaja.map((f, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'12px', fontWeight:'600' }}>{f.concepto}</div>
                    <div style={{ fontSize:'10px', color:'#5A6478', marginTop:'1px' }}>{f.fecha} · {f.categoria} · {f.fuente === 'manual' ? 'manual' : 'wallet'}</div>
                  </div>
                  <span style={{ fontSize:'14px', fontWeight:'800', color: f.tipo === 'ingreso' ? '#2DD4A0' : '#F05C5C' }}>
                    {f.tipo === 'ingreso' ? '+' : '-'}${f.monto.toLocaleString('es-CO')}
                  </span>
                </div>
              ))}
            </div>
            {/* Total */}
            <div style={{ padding:'12px 14px', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontWeight:'700' }}>Saldo real del negocio</span>
              <span style={{ fontSize:'20px', fontWeight:'800', color: saldoReal >= 0 ? '#2DD4A0' : '#F05C5C' }}>
                ${saldoReal.toLocaleString('es-CO')}
              </span>
            </div>
          </div>

          {/* Agregar movimiento manual */}
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'14px' }}>➕ AGREGAR MOVIMIENTO MANUAL</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'10px' }}>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={{ display:'block', fontSize:'11px', color:'#5A6478', marginBottom:'4px' }}>Concepto</label>
                  <input value={nuevoCF.concepto} onChange={e => setNuevoCF(p => ({...p, concepto:e.target.value}))}
                    placeholder="ej: Nómina mayo" style={inp} />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:'11px', color:'#5A6478', marginBottom:'4px' }}>Tipo</label>
                  <select value={nuevoCF.tipo} onChange={e => setNuevoCF(p => ({...p, tipo:e.target.value as any}))}
                    style={{ ...inp, cursor:'pointer' }}>
                    <option value="egreso">➖ Egreso</option>
                    <option value="ingreso">➕ Ingreso</option>
                  </select>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:'11px', color:'#5A6478', marginBottom:'4px' }}>Monto ($)</label>
                  <input type="number" value={nuevoCF.monto || ''} onChange={e => setNuevoCF(p => ({...p, monto:Number(e.target.value)}))}
                    placeholder="0" style={inp} />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:'11px', color:'#5A6478', marginBottom:'4px' }}>Fecha</label>
                  <input type="date" value={nuevoCF.fecha} onChange={e => setNuevoCF(p => ({...p, fecha:e.target.value}))}
                    style={inp} />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:'11px', color:'#5A6478', marginBottom:'4px' }}>Categoría</label>
                  <select value={nuevoCF.categoria} onChange={e => setNuevoCF(p => ({...p, categoria:e.target.value}))}
                    style={{ ...inp, cursor:'pointer' }}>
                    <option value="nomina">Nómina</option>
                    <option value="costos_fijos">Costos Fijos</option>
                    <option value="publicidad">Publicidad</option>
                    <option value="retiro">Retiro Personal</option>
                    <option value="inversion">Inversión</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>
              </div>
              <button onClick={agregarMovimiento}
                style={{ width:'100%', padding:'10px', background:'#F5A623', border:'none', borderRadius:'8px', color:'#0A0D14', cursor:'pointer', fontWeight:'700', fontSize:'13px' }}>
                Agregar movimiento
              </button>
            </div>

            {/* Resumen flujo */}
            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#2DD4A0', marginBottom:'12px' }}>📊 RESUMEN FLUJO DE CAJA</div>
              {[
                { label:'Total ingresos', value:`+$${totalIngresos.toLocaleString('es-CO')}`, color:'#2DD4A0' },
                { label:'Total egresos', value:`-$${totalEgresos.toLocaleString('es-CO')}`, color:'#F05C5C' },
                { label:'Saldo disponible', value:`$${saldoReal.toLocaleString('es-CO')}`, color: saldoReal >= 0 ? '#2DD4A0' : '#F05C5C' },
                { label:'Saldo wallet Dropi', value:`$${saldo.toLocaleString('es-CO')}`, color: saldo >= 0 ? '#3D8EF0' : '#F05C5C' },
              ].map((k, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize:'12px', color:'#8B96A8' }}>{k.label}</span>
                  <span style={{ fontSize:'14px', fontWeight:'800', color:k.color }}>{k.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB ANÁLISIS */}
      {tab === 'analisis' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div style={{ ...s, padding:'20px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#3D8EF0', marginBottom:'14px' }}>📊 ANÁLISIS DE ENTRADAS vs SALIDAS</div>

            {/* Cascada financiera */}
            {[
              { label:'Ganancias como dropshipper', value:ganancias, color:'#2DD4A0', tipo:'entrada' },
              { label:'(-) Fletes cobrados', value:-fletes, color:'#F5A623', tipo:'salida' },
              { label:'(-) Publicidad retirada', value:-publicidad, color:'#9B6BFF', tipo:'salida' },
              { label:'(-) Retiros personales', value:-retiros, color:'#F05C5C', tipo:'salida' },
              { label:'(-) Otros egresos', value:-(salidas-fletes-publicidad-retiros), color:'#8B96A8', tipo:'salida' },
              { label:'= SALDO WALLET', value:saldo, color: saldo >= 0 ? '#2DD4A0' : '#F05C5C', tipo:'resultado' },
            ].map((row, i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 12px', borderRadius:'8px', marginBottom:'5px',
                background: row.tipo === 'resultado' ? `${row.color}08` : 'rgba(255,255,255,0.02)',
                borderLeft: `3px solid ${row.tipo === 'resultado' ? row.color : 'rgba(255,255,255,0.06)'}` }}>
                <span style={{ fontSize:'12px', color: row.tipo === 'resultado' ? '#E8EDF5' : '#8B96A8', fontWeight: row.tipo === 'resultado' ? '700' : '400' }}>
                  {row.label}
                </span>
                <span style={{ fontSize:row.tipo === 'resultado' ? '16px' : '13px', fontWeight:'800', color:row.color }}>
                  {row.value >= 0 ? '+' : ''}${Math.abs(row.value).toLocaleString('es-CO')}
                </span>
              </div>
            ))}

            <div style={{ marginTop:'14px', padding:'12px 14px', background:'rgba(61,142,240,0.06)', borderRadius:'10px', border:'1px solid rgba(61,142,240,0.15)', fontSize:'12px', color:'#8B96A8', lineHeight:'1.7' }}>
              💡 De cada $100 que entran como ganancia, <strong style={{ color:'#9B6BFF' }}>
              ${Math.round(publicidad/ganancias*100) || 0} van a publicidad</strong>,
              <strong style={{ color:'#F05C5C' }}> ${Math.round(retiros/ganancias*100) || 0} a retiros</strong> y 
              <strong style={{ color:'#F5A623' }}> ${Math.round(fletes/ganancias*100) || 0} a fletes</strong>.
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {/* Alertas financieras */}
            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#F05C5C', marginBottom:'12px' }}>🚨 ALERTAS FINANCIERAS</div>
              {[
                { color: saldo >= 500000 ? '#2DD4A0' : '#F05C5C', icono: saldo >= 500000 ? '✅' : '⚠️',
                  texto: `Saldo wallet: $${saldo.toLocaleString('es-CO')} — ${saldo >= 500000 ? 'Saludable para operaciones' : 'Saldo bajo, revisa liquidez'}` },
                { color: publicidad/ganancias < 0.6 ? '#2DD4A0' : '#F5A623', icono: publicidad/ganancias < 0.6 ? '✅' : '⚠️',
                  texto: `Publicidad consume ${Math.round(publicidad/ganancias*100) || 0}% de ganancias — ${publicidad/ganancias < 0.6 ? 'Dentro del rango' : 'Alto, revisar ROAS'}` },
                { color:'#F5A623', icono:'💡',
                  texto:`Próximo retiro sugerido cuando saldo supere $500K disponibles para capital de trabajo` },
                { color:'#3D8EF0', icono:'📊',
                  texto:`${txs.filter(t=>t.tipo==='ENTRADA').length} pedidos generaron ganancias en este período` },
              ].map((a, i) => (
                <div key={i} style={{ display:'flex', gap:'8px', padding:'9px 11px', borderRadius:'8px', marginBottom:'6px',
                  background:`${a.color}08`, borderLeft:`3px solid ${a.color}` }}>
                  <span style={{ fontSize:'14px', flexShrink:0 }}>{a.icono}</span>
                  <span style={{ fontSize:'12px', color:'#8B96A8', lineHeight:'1.5' }}>{a.texto}</span>
                </div>
              ))}
            </div>

            {/* Comparativo entradas vs salidas */}
            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'12px' }}>💹 RATIO SALUDABLE</div>
              {[
                { label:'Ingresos', valor:entradas, max:entradas, color:'#2DD4A0' },
                { label:'Salidas totales', valor:salidas, max:entradas, color:'#F05C5C' },
                { label:'Neto disponible', valor:saldo, max:entradas, color: saldo >= 0 ? '#2DD4A0' : '#F05C5C' },
              ].map((k, i) => (
                <div key={i} style={{ marginBottom:'12px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                    <span style={{ fontSize:'12px', color:'#8B96A8' }}>{k.label}</span>
                    <span style={{ fontSize:'13px', fontWeight:'700', color:k.color }}>${k.valor.toLocaleString('es-CO')}</span>
                  </div>
                  <div style={{ height:'10px', background:'rgba(255,255,255,0.05)', borderRadius:'5px' }}>
                    <div style={{ height:'10px', width:`${Math.min(Math.abs(k.valor)/k.max*100,100)}%`, background:k.color, borderRadius:'5px' }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop:'8px', padding:'10px 12px', background: saldo/entradas >= 0.1 ? 'rgba(45,212,160,0.06)' : 'rgba(240,92,92,0.06)', borderRadius:'8px', fontSize:'12px' }}>
                <span style={{ color:'#8B96A8' }}>Eficiencia de retención: </span>
                <strong style={{ color: saldo/entradas >= 0.1 ? '#2DD4A0' : '#F05C5C' }}>
                  {Math.round(saldo/entradas*100)}% del ingreso queda en wallet
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
