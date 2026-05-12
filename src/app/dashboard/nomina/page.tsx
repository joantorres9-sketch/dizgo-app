'use client'
import { useState } from 'react'

// ============ TIPOS ============
type TipoContrato = 'Empleado'|'Contratista'|'Honorarios'
type EstadoEmp = 'Activo'|'Inactivo'|'Vacaciones'|'Incapacidad'
type Equipo = 'Producto'|'Comercial'|'Marketing'|'Logística'|'Admin Colombia'|'Admin Internacional'

type Empleado = {
  id: string
  // Info básica
  nombres: string; apellidos: string
  tipo_doc: 'CC'|'CE'|'Pasaporte'|'NIT'; num_doc: string
  fecha_nacimiento: string; genero: 'M'|'F'|'Otro'
  estado_civil: 'Soltero'|'Casado'|'Unión libre'|'Otro'
  nacionalidad: string; pais: string; departamento: string
  ciudad: string; direccion: string; telefono: string; email: string
  // Laboral
  cargo: string; equipo: Equipo; tipo_contrato: TipoContrato
  fecha_ingreso: string; fecha_fin?: string; estado: EstadoEmp
  jefe: string; sede: string
  // Salarial
  salario_base: number; aux_transporte: number
  tipo_salario: 'Fijo'|'Variable'|'Integral'
  // Seguridad Social
  eps: string; pension: string; arl: string
  caja: string; cesantias: string; nivel_riesgo: 1|2|3|4|5
  // Bancario
  banco: string; tipo_cuenta: 'Ahorros'|'Corriente'; num_cuenta: string
}

type Novedad = {
  empleado_id: string; tipo: 'Incapacidad'|'Vacaciones'|'Permiso'|'Ausencia'|'HoraExtra'
  dias: number; valor?: number; fecha: string; descripcion: string
}

// ============ TASAS LEGALES COLOMBIA 2025 ============
const TASAS = {
  salud: 0.085,        // Empleador
  pension: 0.12,       // Empleador
  arl: 0.00522,        // Nivel 1
  sena: 0.02,
  icbf: 0.03,
  caja: 0.04,
  cesantias: 0.0833,
  intereses_ces: 0.01,
  prima: 0.0833,
  vacaciones: 0.0417,
  salario_minimo: 1300000,
  aux_transporte: 162000,
  smmlv_2025: 1300000,
}

// ============ DATOS INICIALES (del Excel) ============
const EMPLEADOS_INICIALES: Empleado[] = [
  { id:'E001', nombres:'Juan', apellidos:'García', tipo_doc:'CC', num_doc:'1234567890', fecha_nacimiento:'1990-03-15', genero:'M', estado_civil:'Soltero', nacionalidad:'Colombiana', pais:'Colombia', departamento:'Antioquia', ciudad:'Medellín', direccion:'Cra 50 #45-30', telefono:'3001234567', email:'juan@tienda.com', cargo:'Cazador de Productos', equipo:'Producto', tipo_contrato:'Empleado', fecha_ingreso:'2024-01-01', estado:'Activo', jefe:'Joan Torres', sede:'Medellín', salario_base:1300000, aux_transporte:162000, tipo_salario:'Fijo', eps:'Sura', pension:'Protección', arl:'Sura', caja:'Comfama', cesantias:'Protección', nivel_riesgo:1, banco:'Bancolombia', tipo_cuenta:'Ahorros', num_cuenta:'123456789' },
  { id:'E002', nombres:'María', apellidos:'López', tipo_doc:'CC', num_doc:'9876543210', fecha_nacimiento:'1988-07-22', genero:'F', estado_civil:'Casado', nacionalidad:'Colombiana', pais:'Colombia', departamento:'Antioquia', ciudad:'Medellín', direccion:'Cll 10 #20-15', telefono:'3109876543', email:'maria@tienda.com', cargo:'Director Comercial', equipo:'Comercial', tipo_contrato:'Empleado', fecha_ingreso:'2024-01-01', estado:'Activo', jefe:'Joan Torres', sede:'Medellín', salario_base:1300000, aux_transporte:162000, tipo_salario:'Fijo', eps:'Sura', pension:'Colpensiones', arl:'Sura', caja:'Comfama', cesantias:'Protección', nivel_riesgo:1, banco:'Davivienda', tipo_cuenta:'Ahorros', num_cuenta:'987654321' },
  { id:'E003', nombres:'Carlos', apellidos:'Martínez', tipo_doc:'CC', num_doc:'5556667778', fecha_nacimiento:'1992-11-05', genero:'M', estado_civil:'Soltero', nacionalidad:'Colombiana', pais:'Colombia', departamento:'Antioquia', ciudad:'Bello', direccion:'Av Principal #5-20', telefono:'3156667778', email:'carlos@tienda.com', cargo:'Confirmador', equipo:'Comercial', tipo_contrato:'Empleado', fecha_ingreso:'2024-02-01', estado:'Activo', jefe:'María López', sede:'Medellín', salario_base:1300000, aux_transporte:162000, tipo_salario:'Fijo', eps:'Coomeva', pension:'Protección', arl:'Sura', caja:'Comfama', cesantias:'Protección', nivel_riesgo:1, banco:'Nequi', tipo_cuenta:'Ahorros', num_cuenta:'555666777' },
  { id:'E004', nombres:'Valentina', apellidos:'Ruiz', tipo_doc:'CC', num_doc:'3334445556', fecha_nacimiento:'1995-05-18', genero:'F', estado_civil:'Soltero', nacionalidad:'Colombiana', pais:'Colombia', departamento:'Antioquia', ciudad:'Medellín', direccion:'Cra 80 #30-10', telefono:'3201234567', email:'valentina@tienda.com', cargo:'Traffic Manager', equipo:'Marketing', tipo_contrato:'Empleado', fecha_ingreso:'2024-01-15', estado:'Activo', jefe:'Joan Torres', sede:'Medellín', salario_base:1300000, aux_transporte:162000, tipo_salario:'Fijo', eps:'Sura', pension:'Protección', arl:'Sura', caja:'Comfama', cesantias:'Protección', nivel_riesgo:1, banco:'Bancolombia', tipo_cuenta:'Corriente', num_cuenta:'333444555' },
  { id:'E005', nombres:'Andrés', apellidos:'Soto', tipo_doc:'CC', num_doc:'7778889990', fecha_nacimiento:'1987-09-30', genero:'M', estado_civil:'Casado', nacionalidad:'Colombiana', pais:'Colombia', departamento:'Antioquia', ciudad:'Medellín', direccion:'Cll 50 #70-25', telefono:'3157778889', email:'andres@tienda.com', cargo:'Director Logístico', equipo:'Logística', tipo_contrato:'Empleado', fecha_ingreso:'2024-01-01', estado:'Activo', jefe:'Joan Torres', sede:'Medellín', salario_base:1300000, aux_transporte:162000, tipo_salario:'Fijo', eps:'Coomeva', pension:'Colpensiones', arl:'Sura', caja:'Comfenalco', cesantias:'Protección', nivel_riesgo:2, banco:'Davivienda', tipo_cuenta:'Ahorros', num_cuenta:'777888999' },
  { id:'E006', nombres:'Joan Alexander', apellidos:'Torres', tipo_doc:'CC', num_doc:'1111111111', fecha_nacimiento:'1985-04-12', genero:'M', estado_civil:'Soltero', nacionalidad:'Colombiana', pais:'Colombia', departamento:'Antioquia', ciudad:'Medellín', direccion:'Palmitas, Medellín', telefono:'3206348574', email:'joantorres9@gmail.com', cargo:'Director General', equipo:'Admin Colombia', tipo_contrato:'Empleado', fecha_ingreso:'2023-01-01', estado:'Activo', jefe:'', sede:'Medellín', salario_base:2400000, aux_transporte:162000, tipo_salario:'Fijo', eps:'Sura', pension:'Protección', arl:'Sura', caja:'Comfama', cesantias:'Protección', nivel_riesgo:1, banco:'Bancolombia', tipo_cuenta:'Ahorros', num_cuenta:'111111111' },
  { id:'C001', nombres:'Luis', apellidos:'Diseño', tipo_doc:'CC', num_doc:'2223334445', fecha_nacimiento:'1993-08-20', genero:'M', estado_civil:'Soltero', nacionalidad:'Colombiana', pais:'Colombia', departamento:'Antioquia', ciudad:'Medellín', direccion:'Cra 70 #15-30', telefono:'3142223334', email:'luis@diseño.com', cargo:'Diseñador Gráfico', equipo:'Marketing', tipo_contrato:'Contratista', fecha_ingreso:'2024-03-01', estado:'Activo', jefe:'Valentina Ruiz', sede:'Remoto', salario_base:1300000, aux_transporte:0, tipo_salario:'Fijo', eps:'Aliansalud', pension:'Protección', arl:'Positiva', caja:'', cesantias:'', nivel_riesgo:1, banco:'Nequi', tipo_cuenta:'Ahorros', num_cuenta:'222333444' },
]

const NOVEDADES_INICIALES: Novedad[] = [
  { empleado_id:'E003', tipo:'Vacaciones', dias:5, fecha:'2026-05-01', descripcion:'Vacaciones aprobadas' },
  { empleado_id:'E004', tipo:'HoraExtra', dias:0, valor:50000, fecha:'2026-05-10', descripcion:'Horas extra sábado' },
]

// ============ CÁLCULOS NÓMINA ============
function calcNomina(e: Empleado, novedades: Novedad[]) {
  const s = e.salario_base
  const aux = e.tipo_contrato === 'Empleado' && s <= TASAS.smmlv_2025 * 2 ? e.aux_transporte : 0
  const novEmp = novedades.filter(n => n.empleado_id === e.id)
  const horasExtra = novEmp.filter(n => n.tipo === 'HoraExtra').reduce((sum, n) => sum + (n.valor||0), 0)

  const salud_emp = Math.round(s * TASAS.salud)
  const pension_emp = Math.round(s * TASAS.pension)
  const arl_val = Math.round(s * TASAS.arl)
  const sena_val = Math.round(s * TASAS.sena)
  const icbf_val = Math.round(s * TASAS.icbf)
  const caja_val = Math.round(s * TASAS.caja)
  const cesantias_val = Math.round((s + aux) * TASAS.cesantias)
  const intereses_val = Math.round(cesantias_val * TASAS.intereses_ces)
  const prima_val = Math.round((s + aux) * TASAS.prima)
  const vacaciones_val = Math.round(s * TASAS.vacaciones)
  const total_seguridad = salud_emp + pension_emp + arl_val
  const total_parafiscal = sena_val + icbf_val + caja_val
  const total_prestacional = cesantias_val + intereses_val + prima_val + vacaciones_val
  const total_carga = s + aux + horasExtra + total_seguridad + total_parafiscal + total_prestacional

  // Deducciones empleado
  const salud_trabajador = e.tipo_contrato === 'Empleado' ? Math.round(s * 0.04) : 0
  const pension_trabajador = e.tipo_contrato === 'Empleado' ? Math.round(s * 0.04) : 0
  const total_deducciones = salud_trabajador + pension_trabajador
  const neto_pagar = s + aux + horasExtra - total_deducciones

  return {
    salud_emp, pension_emp, arl_val, sena_val, icbf_val, caja_val,
    cesantias_val, intereses_val, prima_val, vacaciones_val,
    total_seguridad, total_parafiscal, total_prestacional, total_carga,
    salud_trabajador, pension_trabajador, total_deducciones, neto_pagar, aux, horasExtra
  }
}

function calcEdad(fecha: string): number {
  const hoy = new Date()
  const nac = new Date(fecha)
  let edad = hoy.getFullYear() - nac.getFullYear()
  if (hoy < new Date(hoy.getFullYear(), nac.getMonth(), nac.getDate())) edad--
  return edad
}

function fmt(n: number) { return `$${Math.round(n).toLocaleString('es-CO')}` }

// ============ COMPONENTE ============
export default function NominaPage() {
  const [empleados, setEmpleados] = useState<Empleado[]>(EMPLEADOS_INICIALES)
  const [novedades, setNovedades] = useState<Novedad[]>(NOVEDADES_INICIALES)
  const [tab, setTab] = useState<'liquidacion'|'empleados'|'nuevo_emp'|'novedades'|'tasas'>('liquidacion')
  const [empSel, setEmpSel] = useState<string|null>(null)
  const [filtroEquipo, setFiltroEquipo] = useState('Todos')
  const [editando, setEditando] = useState<Empleado|null>(null)
  const [tasas, setTasas] = useState({ ...TASAS })
  const [nuevaNov, setNuevaNov] = useState<Partial<Novedad>>({ tipo:'Vacaciones', dias:1, fecha:'' })

  const emp = empSel ? empleados.find(e => e.id === empSel) : null
  const empCalc = emp ? calcNomina(emp, novedades) : null

  const equipos = ['Todos', 'Producto', 'Comercial', 'Marketing', 'Logística', 'Admin Colombia', 'Admin Internacional']
  const empFiltrados = empleados.filter(e => filtroEquipo === 'Todos' || e.equipo === filtroEquipo)

  // Totales nómina
  const totalNomina = empleados.filter(e=>e.estado==='Activo').reduce((sum, e) => sum + calcNomina(e, novedades).total_carga, 0)
  const totalNeto = empleados.filter(e=>e.estado==='Activo').reduce((sum, e) => sum + calcNomina(e, novedades).neto_pagar, 0)
  const totalPrestacional = empleados.filter(e=>e.estado==='Activo').reduce((sum, e) => sum + calcNomina(e, novedades).total_prestacional, 0)

  const EQUIPO_COLORES: Record<string, string> = {
    'Producto':'#3D8EF0', 'Comercial':'#2DD4A0', 'Marketing':'#9B6BFF',
    'Logística':'#F5A623', 'Admin Colombia':'#F05C5C', 'Admin Internacional':'#8B96A8'
  }

  const s = { background:'#111520', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'12px' }
  const inp = { background:'#0A0D14', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'7px', color:'#E8EDF5', padding:'6px 10px', fontSize:'12px', outline:'none', width:'100%', boxSizing:'border-box' as const }
  const sel = { ...inp, cursor:'pointer' }

  function nuevaFila(): Empleado {
    const id = `E${String(empleados.length + 1).padStart(3,'0')}`
    return { id, nombres:'', apellidos:'', tipo_doc:'CC', num_doc:'', fecha_nacimiento:'', genero:'M', estado_civil:'Soltero', nacionalidad:'Colombiana', pais:'Colombia', departamento:'Antioquia', ciudad:'Medellín', direccion:'', telefono:'', email:'', cargo:'', equipo:'Comercial', tipo_contrato:'Empleado', fecha_ingreso: new Date().toISOString().slice(0,10), estado:'Activo', jefe:'', sede:'Medellín', salario_base: TASAS.salario_minimo, aux_transporte: TASAS.aux_transporte, tipo_salario:'Fijo', eps:'Sura', pension:'Protección', arl:'Sura', caja:'Comfama', cesantias:'Protección', nivel_riesgo:1, banco:'', tipo_cuenta:'Ahorros', num_cuenta:'' }
  }

  function guardarEmpleado(e: Empleado) {
    setEmpleados(prev => prev.find(x => x.id === e.id) ? prev.map(x => x.id === e.id ? e : x) : [...prev, e])
    setEditando(null)
    setTab('empleados')
  }

  return (
    <div style={{ color:'#E8EDF5', fontFamily:'system-ui,sans-serif' }}>

      <div style={{ marginBottom:'20px' }}>
        <h1 style={{ fontSize:'22px', fontWeight:'700', marginBottom:'4px' }}>👥 Gestión de Nómina</h1>
        <p style={{ fontSize:'13px', color:'#8B96A8' }}>Empleados · Contratistas · Liquidación · Conectado con Costos Fijos · PLANEAR</p>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'8px', marginBottom:'16px' }}>
        {[
          { label:'Total empleados', value: empleados.filter(e=>e.estado==='Activo').length, color:'#3D8EF0', icon:'👥' },
          { label:'Empleados', value: empleados.filter(e=>e.tipo_contrato==='Empleado'&&e.estado==='Activo').length, color:'#2DD4A0', icon:'💼' },
          { label:'Contratistas', value: empleados.filter(e=>e.tipo_contrato!=='Empleado'&&e.estado==='Activo').length, color:'#9B6BFF', icon:'📋' },
          { label:'Carga total/mes', value: `$${Math.round(totalNomina/1000)}K`, color:'#F05C5C', icon:'💸' },
          { label:'Neto a pagar', value: `$${Math.round(totalNeto/1000)}K`, color:'#F5A623', icon:'💰' },
          { label:'Prov. prestacional', value: `$${Math.round(totalPrestacional/1000)}K`, color:'#8B96A8', icon:'📊' },
        ].map((k,i) => (
          <div key={i} style={{ ...s, padding:'12px', borderTop:`2px solid ${k.color}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
              <span style={{ fontSize:'10px', color:'#8B96A8' }}>{k.label}</span>
              <span>{k.icon}</span>
            </div>
            <div style={{ fontSize:'18px', fontWeight:'800', color:k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Aviso integración CF */}
      <div style={{ marginBottom:'14px', padding:'10px 16px', background:'rgba(61,142,240,0.06)', borderRadius:'10px', border:'1px solid rgba(61,142,240,0.2)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontSize:'12px', color:'#8B96A8' }}>
          🔗 <strong style={{ color:'#3D8EF0' }}>Conectado con Costos Fijos:</strong> La carga total de nómina <strong style={{ color:'#E8EDF5' }}>{fmt(totalNomina)}/mes</strong> alimenta automáticamente el módulo de Costos Fijos como CF de Personal.
        </div>
        <a href="/dashboard/costos" style={{ padding:'5px 12px', background:'rgba(61,142,240,0.1)', borderRadius:'7px', color:'#3D8EF0', textDecoration:'none', fontSize:'11px', fontWeight:'700', flexShrink:0 }}>
          Ver CF →
        </a>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'6px', marginBottom:'16px', flexWrap:'wrap' }}>
        {[
          { key:'liquidacion', label:'💵 Liquidación' },
          { key:'empleados', label:'👥 Empleados' },
          { key:'nuevo_emp', label:'➕ Nuevo' },
          { key:'novedades', label:'📋 Novedades' },
          { key:'tasas', label:'⚙️ Tasas' },
        ].map(t => (
          <button key={t.key} onClick={() => { setTab(t.key as any); setEmpSel(null); setEditando(null) }}
            style={{ padding:'8px 14px', borderRadius:'9px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:'600',
              background: tab === t.key ? '#F5A623' : 'rgba(255,255,255,0.05)',
              color: tab === t.key ? '#0A0D14' : '#8B96A8' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB LIQUIDACIÓN */}
      {tab === 'liquidacion' && (
        <div>
          {/* Filtros equipo */}
          <div style={{ display:'flex', gap:'6px', marginBottom:'12px', flexWrap:'wrap' }}>
            {equipos.map(eq => (
              <button key={eq} onClick={() => setFiltroEquipo(eq)}
                style={{ padding:'5px 12px', borderRadius:'7px', border:'none', cursor:'pointer', fontSize:'11px', fontWeight:'600',
                  background: filtroEquipo === eq ? (EQUIPO_COLORES[eq] || '#F5A623') : 'rgba(255,255,255,0.05)',
                  color: filtroEquipo === eq ? '#0A0D14' : '#8B96A8' }}>
                {eq}
              </button>
            ))}
          </div>

          <div style={{ display:'grid', gridTemplateColumns: empSel ? '1fr 400px' : '1fr', gap:'16px' }}>
            {/* Tabla liquidación */}
            <div style={{ ...s, overflow:'hidden' }}>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'11px' }}>
                  <thead>
                    <tr style={{ background:'#0A0D14', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                      {['Empleado','Cargo','Equipo','Contrato','Salario Base','Aux T.','Salud E.','Pensión E.','ARL','SENA/ICBF/Caja','Cesantías+Prima+Vac','TOTAL CARGA','Neto Empleado','Acciones'].map(h => (
                        <th key={h} style={{ padding:'8px 8px', textAlign:'left', fontSize:'9px', color:'#5A6478', fontWeight:'700', whiteSpace:'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {empFiltrados.filter(e => e.estado === 'Activo').map(e => {
                      const c = calcNomina(e, novedades)
                      const eqColor = EQUIPO_COLORES[e.equipo] || '#8B96A8'
                      return (
                        <tr key={e.id} onClick={() => setEmpSel(empSel === e.id ? null : e.id)}
                          style={{ borderBottom:'1px solid rgba(255,255,255,0.03)', cursor:'pointer', background: empSel === e.id ? 'rgba(245,166,35,0.04)' : 'transparent' }}>
                          <td style={{ padding:'8px 8px', fontWeight:'600' }}>
                            <div>{e.nombres} {e.apellidos}</div>
                            <div style={{ fontSize:'9px', color:'#5A6478' }}>{e.id}</div>
                          </td>
                          <td style={{ padding:'8px 8px', fontSize:'11px', color:'#8B96A8' }}>{e.cargo}</td>
                          <td style={{ padding:'8px 8px' }}>
                            <span style={{ fontSize:'9px', padding:'1px 5px', borderRadius:'4px', background:`${eqColor}15`, color:eqColor, fontWeight:'700' }}>{e.equipo}</span>
                          </td>
                          <td style={{ padding:'8px 8px', fontSize:'10px', color: e.tipo_contrato === 'Empleado' ? '#2DD4A0' : '#9B6BFF' }}>{e.tipo_contrato}</td>
                          <td style={{ padding:'8px 8px', fontWeight:'600' }}>{fmt(e.salario_base)}</td>
                          <td style={{ padding:'8px 8px', color:'#5A6478' }}>{c.aux > 0 ? fmt(c.aux) : '—'}</td>
                          <td style={{ padding:'8px 8px', color:'#F05C5C' }}>{fmt(c.salud_emp)}</td>
                          <td style={{ padding:'8px 8px', color:'#F05C5C' }}>{fmt(c.pension_emp)}</td>
                          <td style={{ padding:'8px 8px', color:'#F05C5C' }}>{fmt(c.arl_val)}</td>
                          <td style={{ padding:'8px 8px', color:'#9B6BFF' }}>{fmt(c.sena_val + c.icbf_val + c.caja_val)}</td>
                          <td style={{ padding:'8px 8px', color:'#3D8EF0' }}>{fmt(c.cesantias_val + c.prima_val + c.vacaciones_val)}</td>
                          <td style={{ padding:'8px 8px', fontWeight:'800', color:'#F05C5C' }}>{fmt(c.total_carga)}</td>
                          <td style={{ padding:'8px 8px', fontWeight:'700', color:'#2DD4A0' }}>{fmt(c.neto_pagar)}</td>
                          <td style={{ padding:'8px 8px' }} onClick={e2 => e2.stopPropagation()}>
                            <button onClick={() => { setEditando(e); setTab('nuevo_emp') }}
                              style={{ padding:'3px 7px', background:'rgba(61,142,240,0.1)', border:'none', borderRadius:'5px', color:'#3D8EF0', cursor:'pointer', fontSize:'10px' }}>
                              Editar
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{ background:'rgba(245,166,35,0.04)', borderTop:'2px solid rgba(245,166,35,0.2)' }}>
                      <td colSpan={4} style={{ padding:'8px 8px', fontWeight:'800', color:'#F5A623', fontSize:'12px' }}>TOTALES</td>
                      <td style={{ padding:'8px 8px', fontWeight:'700', color:'#F5A623' }}>{fmt(empFiltrados.filter(e=>e.estado==='Activo').reduce((s,e)=>s+e.salario_base,0))}</td>
                      <td colSpan={6} />
                      <td style={{ padding:'8px 8px', fontWeight:'900', color:'#F05C5C', fontSize:'13px' }}>
                        {fmt(empFiltrados.filter(e=>e.estado==='Activo').reduce((s,e)=>s+calcNomina(e,novedades).total_carga,0))}
                      </td>
                      <td style={{ padding:'8px 8px', fontWeight:'800', color:'#2DD4A0' }}>
                        {fmt(empFiltrados.filter(e=>e.estado==='Activo').reduce((s,e)=>s+calcNomina(e,novedades).neto_pagar,0))}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Detalle empleado */}
            {emp && empCalc && (
              <div style={{ ...s, padding:'18px', position:'sticky', top:'20px', maxHeight:'85vh', overflowY:'auto' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'14px' }}>
                  <div>
                    <div style={{ fontSize:'15px', fontWeight:'800' }}>{emp.nombres} {emp.apellidos}</div>
                    <div style={{ fontSize:'11px', color:'#5A6478' }}>{emp.cargo} · {emp.equipo}</div>
                  </div>
                  <button onClick={() => setEmpSel(null)} style={{ background:'none', border:'none', color:'#8B96A8', cursor:'pointer', fontSize:'18px' }}>×</button>
                </div>

                <div style={{ fontSize:'11px', fontWeight:'700', color:'#F5A623', marginBottom:'8px' }}>LIQUIDACIÓN DEL MES</div>
                {[
                  { sec:'DEVENGOS', items:[
                    { l:'Salario base', v:emp.salario_base, c:'#E8EDF5' },
                    { l:'Auxilio transporte', v:empCalc.aux, c:'#8B96A8' },
                    { l:'Horas extra', v:empCalc.horasExtra, c:'#8B96A8' },
                  ]},
                  { sec:'APORTES EMPLEADOR — Seguridad Social', items:[
                    { l:`Salud (${(TASAS.salud*100).toFixed(1)}%)`, v:empCalc.salud_emp, c:'#F05C5C' },
                    { l:`Pensión (${(TASAS.pension*100).toFixed(1)}%)`, v:empCalc.pension_emp, c:'#F05C5C' },
                    { l:`ARL Nivel ${emp.nivel_riesgo}`, v:empCalc.arl_val, c:'#F05C5C' },
                  ]},
                  { sec:'PARAFISCALES', items:[
                    { l:`SENA (${(TASAS.sena*100).toFixed(0)}%)`, v:empCalc.sena_val, c:'#9B6BFF' },
                    { l:`ICBF (${(TASAS.icbf*100).toFixed(0)}%)`, v:empCalc.icbf_val, c:'#9B6BFF' },
                    { l:`Caja (${(TASAS.caja*100).toFixed(0)}%)`, v:empCalc.caja_val, c:'#9B6BFF' },
                  ]},
                  { sec:'PROVISIONES PRESTACIONALES', items:[
                    { l:`Cesantías (${(TASAS.cesantias*100).toFixed(1)}%)`, v:empCalc.cesantias_val, c:'#3D8EF0' },
                    { l:'Intereses cesantías (1%)', v:empCalc.intereses_val, c:'#3D8EF0' },
                    { l:`Prima (${(TASAS.prima*100).toFixed(1)}%)`, v:empCalc.prima_val, c:'#3D8EF0' },
                    { l:`Vacaciones (${(TASAS.vacaciones*100).toFixed(1)}%)`, v:empCalc.vacaciones_val, c:'#3D8EF0' },
                  ]},
                ].map((sec, i) => (
                  <div key={i} style={{ marginBottom:'12px' }}>
                    <div style={{ fontSize:'9px', fontWeight:'800', color:'#5A6478', letterSpacing:'1px', marginBottom:'4px', paddingBottom:'3px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>{sec.sec}</div>
                    {sec.items.map((item, j) => item.v > 0 && (
                      <div key={j} style={{ display:'flex', justifyContent:'space-between', padding:'4px 0', fontSize:'11px' }}>
                        <span style={{ color:'#8B96A8' }}>{item.l}</span>
                        <span style={{ color:item.c, fontWeight:'600' }}>{fmt(item.v)}</span>
                      </div>
                    ))}
                  </div>
                ))}

                <div style={{ padding:'10px 12px', background:'rgba(240,92,92,0.06)', borderRadius:'8px', marginBottom:'8px', display:'flex', justifyContent:'space-between', borderTop:'2px solid #F05C5C' }}>
                  <span style={{ fontSize:'12px', fontWeight:'700' }}>COSTO TOTAL EMPLEADOR</span>
                  <span style={{ fontSize:'16px', fontWeight:'900', color:'#F05C5C' }}>{fmt(empCalc.total_carga)}</span>
                </div>

                <div style={{ fontSize:'9px', fontWeight:'800', color:'#5A6478', letterSpacing:'1px', marginBottom:'4px' }}>DEDUCCIONES TRABAJADOR</div>
                {[
                  { l:'Salud trabajador (4%)', v:empCalc.salud_trabajador },
                  { l:'Pensión trabajador (4%)', v:empCalc.pension_trabajador },
                ].map((d, i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'4px 0', fontSize:'11px' }}>
                    <span style={{ color:'#8B96A8' }}>{d.l}</span>
                    <span style={{ color:'#F05C5C' }}>-{fmt(d.v)}</span>
                  </div>
                ))}
                <div style={{ padding:'10px 12px', background:'rgba(45,212,160,0.06)', borderRadius:'8px', marginTop:'6px', display:'flex', justifyContent:'space-between', borderTop:'2px solid #2DD4A0' }}>
                  <span style={{ fontSize:'12px', fontWeight:'700' }}>NETO A PAGAR EMPLEADO</span>
                  <span style={{ fontSize:'16px', fontWeight:'900', color:'#2DD4A0' }}>{fmt(empCalc.neto_pagar)}</span>
                </div>

                <div style={{ marginTop:'10px', padding:'8px 10px', background:'rgba(61,142,240,0.06)', borderRadius:'7px', fontSize:'11px', color:'#8B96A8' }}>
                  <div style={{ color:'#3D8EF0', fontWeight:'700', marginBottom:'3px' }}>📊 Info del colaborador</div>
                  <div>EPS: {emp.eps} · Pensión: {emp.pension}</div>
                  <div>Banco: {emp.banco} · {emp.tipo_cuenta} {emp.num_cuenta}</div>
                  <div>Ingreso: {emp.fecha_ingreso} · Sede: {emp.sede}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB EMPLEADOS */}
      {tab === 'empleados' && (
        <div style={{ ...s, overflow:'hidden' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'11px' }}>
              <thead>
                <tr style={{ background:'#0A0D14', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                  {['ID','Nombre completo','Doc.','Cargo','Equipo','Contrato','Ciudad','Edad','Tel.','Email','EPS','Pensión','Estado','Acciones'].map(h => (
                    <th key={h} style={{ padding:'8px 8px', textAlign:'left', fontSize:'9px', color:'#5A6478', fontWeight:'700', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {empleados.map(e => {
                  const eqColor = EQUIPO_COLORES[e.equipo] || '#8B96A8'
                  const edad = e.fecha_nacimiento ? calcEdad(e.fecha_nacimiento) : '—'
                  return (
                    <tr key={e.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding:'8px 8px', fontFamily:'monospace', fontSize:'10px', color:'#5A6478' }}>{e.id}</td>
                      <td style={{ padding:'8px 8px', fontWeight:'600' }}>{e.nombres} {e.apellidos}</td>
                      <td style={{ padding:'8px 8px', fontSize:'10px', color:'#5A6478' }}>{e.tipo_doc} {e.num_doc}</td>
                      <td style={{ padding:'8px 8px', color:'#8B96A8', fontSize:'11px' }}>{e.cargo}</td>
                      <td style={{ padding:'8px 8px' }}>
                        <span style={{ fontSize:'9px', padding:'1px 5px', borderRadius:'4px', background:`${eqColor}15`, color:eqColor, fontWeight:'700' }}>{e.equipo}</span>
                      </td>
                      <td style={{ padding:'8px 8px', fontSize:'10px', color: e.tipo_contrato === 'Empleado' ? '#2DD4A0' : '#9B6BFF' }}>{e.tipo_contrato}</td>
                      <td style={{ padding:'8px 8px', fontSize:'10px', color:'#5A6478' }}>{e.ciudad}</td>
                      <td style={{ padding:'8px 8px', color:'#8B96A8' }}>{edad}</td>
                      <td style={{ padding:'8px 8px', fontSize:'10px', color:'#5A6478' }}>{e.telefono}</td>
                      <td style={{ padding:'8px 8px', fontSize:'10px', color:'#5A6478' }}>{e.email}</td>
                      <td style={{ padding:'8px 8px', fontSize:'10px', color:'#8B96A8' }}>{e.eps}</td>
                      <td style={{ padding:'8px 8px', fontSize:'10px', color:'#8B96A8' }}>{e.pension}</td>
                      <td style={{ padding:'8px 8px' }}>
                        <span style={{ fontSize:'10px', fontWeight:'700', color: e.estado === 'Activo' ? '#2DD4A0' : '#F05C5C' }}>● {e.estado}</span>
                      </td>
                      <td style={{ padding:'8px 8px' }}>
                        <button onClick={() => { setEditando({...e}); setTab('nuevo_emp') }}
                          style={{ padding:'3px 7px', background:'rgba(61,142,240,0.1)', border:'none', borderRadius:'5px', color:'#3D8EF0', cursor:'pointer', fontSize:'10px' }}>
                          Editar
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB NUEVO / EDITAR EMPLEADO */}
      {tab === 'nuevo_emp' && (() => {
        const form = editando || nuevaFila()
        if (!editando) setEditando(form)
        const upd = (field: keyof Empleado, val: any) => setEditando(prev => prev ? { ...prev, [field]: val } : null)
        if (!editando) return null
        return (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
            {/* Info básica */}
            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#3D8EF0', marginBottom:'12px' }}>👤 INFORMACIÓN BÁSICA</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                {[
                  { l:'Nombres *', f:'nombres' as keyof Empleado },
                  { l:'Apellidos *', f:'apellidos' as keyof Empleado },
                  { l:'Tipo documento', f:'tipo_doc' as keyof Empleado, opts:['CC','CE','Pasaporte','NIT'] },
                  { l:'Número documento *', f:'num_doc' as keyof Empleado },
                  { l:'Fecha nacimiento', f:'fecha_nacimiento' as keyof Empleado, type:'date' },
                  { l:'Género', f:'genero' as keyof Empleado, opts:['M','F','Otro'] },
                  { l:'Estado civil', f:'estado_civil' as keyof Empleado, opts:['Soltero','Casado','Unión libre','Otro'] },
                  { l:'Nacionalidad', f:'nacionalidad' as keyof Empleado },
                  { l:'País', f:'pais' as keyof Empleado },
                  { l:'Departamento', f:'departamento' as keyof Empleado },
                  { l:'Ciudad *', f:'ciudad' as keyof Empleado },
                  { l:'Dirección', f:'direccion' as keyof Empleado },
                  { l:'Teléfono *', f:'telefono' as keyof Empleado },
                  { l:'Email *', f:'email' as keyof Empleado },
                ].map((item, i) => (
                  <div key={i} style={{ gridColumn: ['nombres','apellidos','direccion','email'].includes(item.f) ? '1/-1' : 'auto' }}>
                    <label style={{ display:'block', fontSize:'10px', color:'#5A6478', marginBottom:'3px' }}>{item.l}</label>
                    {item.opts
                      ? <select value={String(editando[item.f] || '')} onChange={e => upd(item.f, e.target.value)} style={sel}>{item.opts.map(o => <option key={o}>{o}</option>)}</select>
                      : <input type={item.type || 'text'} value={String(editando[item.f] || '')} onChange={e => upd(item.f, e.target.value)} style={inp} />
                    }
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {/* Info laboral */}
              <div style={{ ...s, padding:'16px' }}>
                <div style={{ fontSize:'12px', fontWeight:'700', color:'#2DD4A0', marginBottom:'10px' }}>💼 INFORMACIÓN LABORAL</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                  {[
                    { l:'Cargo *', f:'cargo' as keyof Empleado },
                    { l:'Equipo', f:'equipo' as keyof Empleado, opts:['Producto','Comercial','Marketing','Logística','Admin Colombia','Admin Internacional'] },
                    { l:'Tipo contrato', f:'tipo_contrato' as keyof Empleado, opts:['Empleado','Contratista','Honorarios'] },
                    { l:'Estado', f:'estado' as keyof Empleado, opts:['Activo','Inactivo','Vacaciones','Incapacidad'] },
                    { l:'Fecha ingreso', f:'fecha_ingreso' as keyof Empleado, type:'date' },
                    { l:'Sede', f:'sede' as keyof Empleado },
                    { l:'Jefe inmediato', f:'jefe' as keyof Empleado },
                    { l:'Salario base *', f:'salario_base' as keyof Empleado, type:'number' },
                    { l:'Tipo salario', f:'tipo_salario' as keyof Empleado, opts:['Fijo','Variable','Integral'] },
                    { l:'Nivel ARL', f:'nivel_riesgo' as keyof Empleado, opts:['1','2','3','4','5'] },
                  ].map((item, i) => (
                    <div key={i} style={{ gridColumn: ['cargo','jefe'].includes(item.f) ? '1/-1' : 'auto' }}>
                      <label style={{ display:'block', fontSize:'10px', color:'#5A6478', marginBottom:'3px' }}>{item.l}</label>
                      {item.opts
                        ? <select value={String(editando[item.f] || '')} onChange={e => upd(item.f, item.type === 'number' ? Number(e.target.value) : e.target.value)} style={sel}>{item.opts.map(o => <option key={o}>{o}</option>)}</select>
                        : <input type={item.type || 'text'} value={String(editando[item.f] || '')} onChange={e => upd(item.f, item.type === 'number' ? Number(e.target.value) : e.target.value)} style={inp} />
                      }
                    </div>
                  ))}
                </div>
              </div>

              {/* Seguridad social */}
              <div style={{ ...s, padding:'16px' }}>
                <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'10px' }}>🏥 SEGURIDAD SOCIAL & BANCO</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                  {[
                    { l:'EPS', f:'eps' as keyof Empleado },
                    { l:'Pensión', f:'pension' as keyof Empleado },
                    { l:'ARL', f:'arl' as keyof Empleado },
                    { l:'Caja Compensación', f:'caja' as keyof Empleado },
                    { l:'Fondo Cesantías', f:'cesantias' as keyof Empleado },
                    { l:'Banco', f:'banco' as keyof Empleado },
                    { l:'Tipo cuenta', f:'tipo_cuenta' as keyof Empleado, opts:['Ahorros','Corriente'] },
                    { l:'Número cuenta', f:'num_cuenta' as keyof Empleado },
                  ].map((item, i) => (
                    <div key={i}>
                      <label style={{ display:'block', fontSize:'10px', color:'#5A6478', marginBottom:'3px' }}>{item.l}</label>
                      {item.opts
                        ? <select value={String(editando[item.f] || '')} onChange={e => upd(item.f, e.target.value)} style={sel}>{item.opts.map(o => <option key={o}>{o}</option>)}</select>
                        : <input value={String(editando[item.f] || '')} onChange={e => upd(item.f, e.target.value)} style={inp} />
                      }
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview nómina */}
              {editando.salario_base > 0 && (() => {
                const c = calcNomina(editando, novedades)
                return (
                  <div style={{ ...s, padding:'14px', background:'rgba(245,166,35,0.04)', border:'1px solid rgba(245,166,35,0.2)' }}>
                    <div style={{ fontSize:'11px', fontWeight:'700', color:'#F5A623', marginBottom:'8px' }}>⚡ PREVIEW COSTO MENSUAL</div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px', fontSize:'11px' }}>
                      <div><span style={{ color:'#5A6478' }}>Carga total:</span> <span style={{ color:'#F05C5C', fontWeight:'800' }}>{fmt(c.total_carga)}</span></div>
                      <div><span style={{ color:'#5A6478' }}>Neto empleado:</span> <span style={{ color:'#2DD4A0', fontWeight:'700' }}>{fmt(c.neto_pagar)}</span></div>
                      <div><span style={{ color:'#5A6478' }}>Prestacional:</span> <span style={{ color:'#3D8EF0' }}>{fmt(c.total_prestacional)}</span></div>
                      <div><span style={{ color:'#5A6478' }}>Parafiscal:</span> <span style={{ color:'#9B6BFF' }}>{fmt(c.total_parafiscal)}</span></div>
                    </div>
                  </div>
                )
              })()}

              <div style={{ display:'flex', gap:'8px' }}>
                <button onClick={() => { setEditando(null); setTab('empleados') }}
                  style={{ flex:1, padding:'10px', background:'rgba(255,255,255,0.05)', border:'none', borderRadius:'8px', color:'#8B96A8', cursor:'pointer', fontSize:'13px' }}>
                  Cancelar
                </button>
                <button onClick={() => editando && guardarEmpleado(editando)}
                  style={{ flex:2, padding:'10px', background:'#F5A623', border:'none', borderRadius:'8px', color:'#0A0D14', cursor:'pointer', fontWeight:'700', fontSize:'13px' }}>
                  💾 Guardar empleado
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* TAB NOVEDADES */}
      {tab === 'novedades' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div style={{ ...s, overflow:'hidden' }}>
            <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', fontWeight:'700' }}>📋 Novedades del mes</div>
            {novedades.length === 0 ? (
              <div style={{ padding:'32px', textAlign:'center', color:'#5A6478' }}>Sin novedades registradas</div>
            ) : novedades.map((n, i) => {
              const emp = empleados.find(e => e.id === n.empleado_id)
              return (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                  <div>
                    <div style={{ fontSize:'12px', fontWeight:'600' }}>{emp?.nombres} {emp?.apellidos}</div>
                    <div style={{ fontSize:'11px', color:'#5A6478' }}>{n.tipo} · {n.fecha}</div>
                    <div style={{ fontSize:'11px', color:'#8B96A8' }}>{n.descripcion}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623' }}>
                      {n.dias > 0 ? `${n.dias} días` : n.valor ? fmt(n.valor) : ''}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ ...s, padding:'18px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'12px' }}>➕ REGISTRAR NOVEDAD</div>
            {[
              { l:'Empleado', f:'empleado_id', comp: <select value={nuevaNov.empleado_id || ''} onChange={e => setNuevaNov(p=>({...p,empleado_id:e.target.value}))} style={sel}><option value=''>Seleccionar...</option>{empleados.map(e => <option key={e.id} value={e.id}>{e.nombres} {e.apellidos}</option>)}</select> },
              { l:'Tipo', f:'tipo', comp: <select value={nuevaNov.tipo} onChange={e => setNuevaNov(p=>({...p,tipo:e.target.value as any}))} style={sel}>{['Incapacidad','Vacaciones','Permiso','Ausencia','HoraExtra'].map(t => <option key={t}>{t}</option>)}</select> },
              { l:'Días', f:'dias', comp: <input type='number' value={nuevaNov.dias||''} onChange={e => setNuevaNov(p=>({...p,dias:Number(e.target.value)}))} style={inp} /> },
              { l:'Valor ($) si aplica', f:'valor', comp: <input type='number' value={nuevaNov.valor||''} onChange={e => setNuevaNov(p=>({...p,valor:Number(e.target.value)}))} style={inp} /> },
              { l:'Fecha', f:'fecha', comp: <input type='date' value={nuevaNov.fecha||''} onChange={e => setNuevaNov(p=>({...p,fecha:e.target.value}))} style={inp} /> },
              { l:'Descripción', f:'descripcion', comp: <input value={nuevaNov.descripcion||''} onChange={e => setNuevaNov(p=>({...p,descripcion:e.target.value}))} placeholder='Detalle de la novedad' style={inp} /> },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom:'8px' }}>
                <label style={{ display:'block', fontSize:'11px', color:'#5A6478', marginBottom:'3px' }}>{item.l}</label>
                {item.comp}
              </div>
            ))}
            <button onClick={() => {
              if (!nuevaNov.empleado_id || !nuevaNov.fecha) return
              setNovedades(prev => [...prev, nuevaNov as Novedad])
              setNuevaNov({ tipo:'Vacaciones', dias:1, fecha:'' })
            }}
              style={{ width:'100%', padding:'10px', background:'#F5A623', border:'none', borderRadius:'8px', color:'#0A0D14', cursor:'pointer', fontWeight:'700', fontSize:'13px', marginTop:'6px' }}>
              Registrar novedad
            </button>
          </div>
        </div>
      )}

      {/* TAB TASAS */}
      {tab === 'tasas' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          <div style={{ ...s, padding:'20px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#F05C5C', marginBottom:'6px' }}>⚙️ TASAS LEGALES COLOMBIA 2025</div>
            <div style={{ fontSize:'11px', color:'#8B96A8', marginBottom:'14px' }}>Modifica las tasas según cambios legales. Se recalcula toda la nómina automáticamente.</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
              {[
                { l:'Salud empleador (%)', f:'salud', mul:100 },
                { l:'Pensión empleador (%)', f:'pension', mul:100 },
                { l:'ARL Nivel 1 (%)', f:'arl', mul:100 },
                { l:'SENA (%)', f:'sena', mul:100 },
                { l:'ICBF (%)', f:'icbf', mul:100 },
                { l:'Caja Compensación (%)', f:'caja', mul:100 },
                { l:'Cesantías (%)', f:'cesantias', mul:100 },
                { l:'Intereses Cesantías (%)', f:'intereses_ces', mul:100 },
                { l:'Prima (%)', f:'prima', mul:100 },
                { l:'Vacaciones (%)', f:'vacaciones', mul:100 },
              ].map((item, i) => (
                <div key={i}>
                  <label style={{ display:'block', fontSize:'11px', color:'#5A6478', marginBottom:'3px' }}>{item.l}</label>
                  <input type='number' step='0.01'
                    value={Number(((tasas as any)[item.f] * item.mul).toFixed(4))}
                    onChange={e => setTasas(prev => ({ ...prev, [item.f]: Number(e.target.value) / item.mul }))}
                    style={inp} />
                </div>
              ))}
            </div>
            <div style={{ marginTop:'14px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
              {[
                { l:'Salario mínimo 2025 ($)', f:'salario_minimo', mul:1 },
                { l:'Aux. Transporte 2025 ($)', f:'aux_transporte', mul:1 },
              ].map((item, i) => (
                <div key={i}>
                  <label style={{ display:'block', fontSize:'11px', color:'#5A6478', marginBottom:'3px' }}>{item.l}</label>
                  <input type='number'
                    value={(tasas as any)[item.f]}
                    onChange={e => setTasas(prev => ({ ...prev, [item.f]: Number(e.target.value) }))}
                    style={inp} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...s, padding:'20px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#3D8EF0', marginBottom:'12px' }}>📊 RESUMEN DE TASAS ACTUALES</div>
            {[
              { grupo:'Seguridad Social (empleador)', tasas:[
                { l:'Salud', v:tasas.salud },
                { l:'Pensión', v:tasas.pension },
                { l:'ARL', v:tasas.arl },
              ], color:'#F05C5C' },
              { grupo:'Parafiscales', tasas:[
                { l:'SENA', v:tasas.sena },
                { l:'ICBF', v:tasas.icbf },
                { l:'Caja', v:tasas.caja },
              ], color:'#9B6BFF' },
              { grupo:'Prestaciones sociales', tasas:[
                { l:'Cesantías', v:tasas.cesantias },
                { l:'Int. Cesantías', v:tasas.intereses_ces },
                { l:'Prima', v:tasas.prima },
                { l:'Vacaciones', v:tasas.vacaciones },
              ], color:'#3D8EF0' },
            ].map((g, i) => (
              <div key={i} style={{ marginBottom:'14px' }}>
                <div style={{ fontSize:'11px', fontWeight:'700', color:g.color, marginBottom:'6px' }}>{g.grupo}</div>
                {g.tasas.map((t, j) => (
                  <div key={j} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:'12px' }}>
                    <span style={{ color:'#8B96A8' }}>{t.l}</span>
                    <span style={{ color:g.color, fontWeight:'700' }}>{(t.v * 100).toFixed(2)}%</span>
                  </div>
                ))}
                <div style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', fontSize:'12px', fontWeight:'700' }}>
                  <span style={{ color:'#5A6478' }}>Subtotal</span>
                  <span style={{ color:g.color }}>{(g.tasas.reduce((s,t)=>s+t.v,0)*100).toFixed(2)}%</span>
                </div>
              </div>
            ))}
            <div style={{ padding:'10px 12px', background:'rgba(240,92,92,0.06)', borderRadius:'8px', border:'1px solid rgba(240,92,92,0.15)', display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontSize:'12px', fontWeight:'700' }}>CARGA TOTAL SOBRE SALARIO</span>
              <span style={{ fontSize:'16px', fontWeight:'900', color:'#F05C5C' }}>
                {((tasas.salud+tasas.pension+tasas.arl+tasas.sena+tasas.icbf+tasas.caja+tasas.cesantias+tasas.intereses_ces+tasas.prima+tasas.vacaciones)*100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
