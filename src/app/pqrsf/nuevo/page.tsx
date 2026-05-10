'use client'
import { useState } from 'react'

const TIPO_INFO: Record<string, { label:string; color:string; emoji:string; desc:string; dias:number }> = {
  P: { label:'Petición', color:'#3D8EF0', emoji:'📋', desc:'Solicitud de información o documentos', dias:15 },
  Q: { label:'Queja', color:'#F5A623', emoji:'😤', desc:'Insatisfacción con el servicio recibido', dias:10 },
  R: { label:'Reclamo', color:'#F05C5C', emoji:'❗', desc:'Inconformidad con el producto o entrega', dias:10 },
  S: { label:'Sugerencia', color:'#2DD4A0', emoji:'💡', desc:'Ideas para mejorar nuestro servicio', dias:15 },
  F: { label:'Felicitación', color:'#F5A623', emoji:'⭐', desc:'Reconocimiento por buen servicio', dias:15 },
}

export default function NuevaPQRSFPage() {
  const [tipo, setTipo] = useState('R')
  const [form, setForm] = useState({ nombre:'', email:'', telefono:'', orden_id:'', asunto:'', descripcion:'' })
  const [enviado, setEnviado] = useState(false)
  const [radicado, setRadicado] = useState('')
  const [cargando, setCargando] = useState(false)

  function upd(k: string, v: string) { setForm(p => ({...p, [k]:v})) }

  async function enviar() {
    if (!form.nombre || !form.asunto || !form.descripcion) return
    setCargando(true)
    await new Promise(r => setTimeout(r, 1200))
    const now = new Date()
    const id = Math.floor(Math.random() * 90000) + 10000
    setRadicado(`DZ-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}-${id}`)
    setEnviado(true)
    setCargando(false)
  }

  const ti = TIPO_INFO[tipo]

  if (enviado) return (
    <div style={{ minHeight:'100vh', background:'#0A0D14', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', fontFamily:'system-ui,sans-serif' }}>
      <div style={{ maxWidth:'480px', width:'100%', textAlign:'center' }}>
        <div style={{ width:'72px', height:'72px', background:'rgba(45,212,160,0.15)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'32px', margin:'0 auto 20px' }}>✅</div>
        <h2 style={{ color:'#E8EDF5', fontSize:'22px', fontWeight:'700', marginBottom:'8px' }}>¡Solicitud radicada!</h2>
        <p style={{ color:'#8B96A8', fontSize:'14px', marginBottom:'20px' }}>Tu solicitud fue recibida exitosamente.</p>
        <div style={{ background:'#111520', border:'1px solid rgba(45,212,160,0.2)', borderRadius:'12px', padding:'20px', marginBottom:'20px' }}>
          <div style={{ fontSize:'12px', color:'#5A6478', marginBottom:'6px' }}>Número de radicado</div>
          <div style={{ fontSize:'20px', fontWeight:'800', color:'#2DD4A0', fontFamily:'monospace' }}>{radicado}</div>
          <div style={{ fontSize:'12px', color:'#8B96A8', marginTop:'8px' }}>
            Guarda este número para hacer seguimiento.<br/>
            Te responderemos en máximo <strong style={{ color:'#E8EDF5' }}>{ti.dias} días hábiles</strong>.
          </div>
        </div>
        <button onClick={() => { setEnviado(false); setForm({ nombre:'', email:'', telefono:'', orden_id:'', asunto:'', descripcion:'' }); setTipo('R') }}
          style={{ padding:'11px 24px', background:'#F5A623', border:'none', borderRadius:'10px', color:'#0A0D14', cursor:'pointer', fontWeight:'700', fontSize:'13px' }}>
          Enviar otra solicitud
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#0A0D14', padding:'32px 20px', fontFamily:'system-ui,sans-serif', color:'#E8EDF5' }}>
      <div style={{ maxWidth:'560px', margin:'0 auto' }}>

        <div style={{ textAlign:'center', marginBottom:'28px' }}>
          <div style={{ width:'48px', height:'48px', background:'#F5A623', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'800', fontSize:'16px', color:'#0A0D14', margin:'0 auto 12px' }}>DZ</div>
          <h1 style={{ fontSize:'22px', fontWeight:'800', marginBottom:'6px' }}>Radicación de PQRSF</h1>
          <p style={{ fontSize:'13px', color:'#8B96A8' }}>Peticiones · Quejas · Reclamos · Sugerencias · Felicitaciones</p>
        </div>

        <div style={{ background:'#111520', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'14px', padding:'20px', marginBottom:'16px' }}>
          <div style={{ fontSize:'12px', fontWeight:'700', color:'#5A6478', marginBottom:'12px' }}>¿QUÉ TIPO DE SOLICITUD ES?</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
            {Object.entries(TIPO_INFO).map(([key, info]) => (
              <button key={key} onClick={() => setTipo(key)}
                style={{ padding:'12px 14px', borderRadius:'10px', cursor:'pointer', textAlign:'left',
                  border:`1px solid ${tipo === key ? info.color + '55' : 'rgba(255,255,255,0.07)'}`,
                  background: tipo === key ? `${info.color}10` : 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize:'18px', marginBottom:'4px' }}>{info.emoji}</div>
                <div style={{ fontSize:'13px', fontWeight:'700', color: tipo === key ? info.color : '#E8EDF5', marginBottom:'2px' }}>{info.label}</div>
                <div style={{ fontSize:'11px', color:'#5A6478' }}>{info.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ background:'#111520', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'14px', padding:'20px', marginBottom:'16px' }}>
          <div style={{ fontSize:'12px', fontWeight:'700', color:'#5A6478', marginBottom:'14px' }}>TUS DATOS</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'12px' }}>
            {[
              { label:'Nombre completo *', key:'nombre', placeholder:'Tu nombre', full:true },
              { label:'Email', key:'email', placeholder:'tu@email.com' },
              { label:'Teléfono', key:'telefono', placeholder:'3001234567' },
              { label:'Número de orden (si aplica)', key:'orden_id', placeholder:'Ej: 9012345' },
            ].map((f,i) => (
              <div key={i} style={{ gridColumn: f.full ? '1/-1' : 'auto' }}>
                <label style={{ display:'block', fontSize:'11px', color:'#8B96A8', marginBottom:'5px' }}>{f.label}</label>
                <input value={(form as any)[f.key]} onChange={e => upd(f.key, e.target.value)} placeholder={f.placeholder}
                  style={{ width:'100%', background:'#0A0D14', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color:'#E8EDF5', padding:'10px 12px', fontSize:'13px', outline:'none', boxSizing:'border-box' as const }} />
              </div>
            ))}
          </div>
          <div style={{ marginBottom:'12px' }}>
            <label style={{ display:'block', fontSize:'11px', color:'#8B96A8', marginBottom:'5px' }}>Asunto *</label>
            <input value={form.asunto} onChange={e => upd('asunto', e.target.value)} placeholder="Resumen de tu solicitud"
              style={{ width:'100%', background:'#0A0D14', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color:'#E8EDF5', padding:'10px 12px', fontSize:'13px', outline:'none', boxSizing:'border-box' as const }} />
          </div>
          <div>
            <label style={{ display:'block', fontSize:'11px', color:'#8B96A8', marginBottom:'5px' }}>Descripción detallada *</label>
            <textarea value={form.descripcion} onChange={e => upd('descripcion', e.target.value)} rows={5}
              placeholder="Explica con detalle tu solicitud..."
              style={{ width:'100%', background:'#0A0D14', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color:'#E8EDF5', padding:'10px 12px', fontSize:'13px', outline:'none', resize:'vertical', boxSizing:'border-box' as const }} />
          </div>
        </div>

        <div style={{ padding:'12px 14px', background:'rgba(61,142,240,0.06)', borderRadius:'10px', border:'1px solid rgba(61,142,240,0.15)', marginBottom:'16px', fontSize:'12px', color:'#8B96A8', lineHeight:'1.6' }}>
          ⚖️ Según la <strong style={{ color:'#3D8EF0' }}>Ley 1480 (Estatuto del Consumidor)</strong>, tu {ti.label.toLowerCase()} será atendida en máximo <strong style={{ color:'#E8EDF5' }}>{ti.dias} días hábiles</strong>.
        </div>

        <button onClick={enviar} disabled={!form.nombre || !form.asunto || !form.descripcion || cargando}
          style={{ width:'100%', padding:'14px', borderRadius:'12px', border:'none',
            cursor: (!form.nombre || !form.asunto || !form.descripcion) ? 'not-allowed' : 'pointer',
            background: (!form.nombre || !form.asunto || !form.descripcion) ? 'rgba(255,255,255,0.05)' : ti.color,
            color: (!form.nombre || !form.asunto || !form.descripcion) ? '#5A6478' : ['R','Q'].includes(tipo) ? '#fff' : '#0A0D14',
            fontSize:'15px', fontWeight:'800' }}>
          {cargando ? '⏳ Radicando...' : `${ti.emoji} Radicar ${ti.label}`}
        </button>

        <p style={{ textAlign:'center', fontSize:'11px', color:'#5A6478', marginTop:'16px' }}>
          Powered by DIZGO · Plataforma de gestión e-commerce LATAM
        </p>
      </div>
    </div>
  )
}
