'use client'
import { useState } from 'react'

type Leccion = {
  id: string; titulo: string; duracion: string
  completada: boolean; tipo: 'video'|'lectura'|'practica'|'quiz'
  resumen: string; kpi_relacionado?: string
}

type Modulo = {
  id: string; codigo: string; titulo: string; subtitulo: string
  fase: 'PLANEAR'|'HACER'|'VERIFICAR'|'ACTUAR'
  color: string; emoji: string; completado: number; total: number
  descripcion: string; lecciones: Leccion[]
}

type Estrategia = {
  titulo: string; categoria: string; descripcion: string
  impacto: string; dificultad: 'Fácil'|'Media'|'Difícil'
  color: string; pasos: string[]
}

const MODULOS: Modulo[] = [
  {
    id:'M1', codigo:'M-01', titulo:'Fundamentos del E-commerce', subtitulo:'Mentoría Premium · Joan Torres',
    fase:'PLANEAR', color:'#3D8EF0', emoji:'🏪', completado:8, total:12,
    descripcion:'Todo lo que necesitas saber antes de vender tu primer producto. Modelo de negocio, selección de nicho, plataformas y estructura base.',
    lecciones:[
      { id:'m1l1', titulo:'¿Qué es el dropshipping real?', duracion:'12 min', completada:true, tipo:'video', resumen:'Definición real vs mitos. Diferencias con inventario propio. Por qué Colombia es un mercado ideal.' },
      { id:'m1l2', titulo:'Selección de nicho estratégico', duracion:'18 min', completada:true, tipo:'lectura', resumen:'Cómo elegir un nicho rentable. Análisis de competencia. Validación antes de invertir.' },
      { id:'m1l3', titulo:'Plataformas: Dropi vs Shopify vs otras', duracion:'15 min', completada:true, tipo:'video', resumen:'Comparativo real de plataformas para Colombia. Ventajas y costos reales de cada una.' },
      { id:'m1l4', titulo:'Estructura legal y tributaria básica', duracion:'10 min', completada:true, tipo:'lectura', resumen:'Obligaciones básicas como vendedor. Cuándo registrarse. IVA en e-commerce Colombia.', kpi_relacionado:'Costos Fijos' },
      { id:'m1l5', titulo:'Caso práctico: Mi primera tienda', duracion:'25 min', completada:true, tipo:'practica', resumen:'Configuración paso a paso de una tienda en Dropi desde cero con datos reales.' },
      { id:'m1l6', titulo:'Quiz: Fundamentos', duracion:'8 min', completada:true, tipo:'quiz', resumen:'Evaluación de conocimientos básicos del módulo 1.' },
      { id:'m1l7', titulo:'Psicología del consumidor colombiano', duracion:'20 min', completada:true, tipo:'video', resumen:'Cómo piensa y decide el comprador online en Colombia. Gatillos de compra. Objeciones frecuentes.' },
      { id:'m1l8', titulo:'Selección de productos ganadores', duracion:'22 min', completada:true, tipo:'lectura', resumen:'Criterios para elegir productos. Saturación de mercado. Tendencias actuales LATAM.' },
      { id:'m1l9', titulo:'Fotografía y contenido para productos', duracion:'15 min', completada:false, tipo:'video', resumen:'Cómo hacer buenas fotos sin equipo profesional. Edición básica. Errores comunes.' },
      { id:'m1l10', titulo:'Descripción de productos que venden', duracion:'12 min', completada:false, tipo:'lectura', resumen:'Copywriting básico. Beneficios vs características. CTAs que convierten.' },
      { id:'m1l11', titulo:'Gestión de inventario con Dropi', duracion:'10 min', completada:false, tipo:'practica', resumen:'Cómo manejar stock, variantes y actualizaciones de productos en la plataforma.' },
      { id:'m1l12', titulo:'Quiz final Módulo 1', duracion:'12 min', completada:false, tipo:'quiz', resumen:'Evaluación completa del módulo con casos reales.' },
    ]
  },
  {
    id:'M2', codigo:'M-02', titulo:'Optimización de Procesos PHVA', subtitulo:'Mejora continua en dropshipping',
    fase:'HACER', color:'#2DD4A0', emoji:'🔄', completado:6, total:10,
    descripcion:'Aplica la metodología PHVA (Planear-Hacer-Verificar-Actuar) a tu tienda para mejorar continuamente y tomar decisiones basadas en datos.',
    lecciones:[
      { id:'m2l1', titulo:'PHVA aplicado al dropshipping', duracion:'15 min', completada:true, tipo:'video', resumen:'Qué es PHVA y por qué es la metodología más efectiva para e-commerce. Casos reales.', kpi_relacionado:'Dashboard' },
      { id:'m2l2', titulo:'PLANEAR: Metas SMART para tu tienda', duracion:'18 min', completada:true, tipo:'lectura', resumen:'Cómo definir metas realistas. Indicadores clave. Diferencia entre deseos y metas medibles.', kpi_relacionado:'Metas' },
      { id:'m2l3', titulo:'HACER: Confirmación de pedidos efectiva', duracion:'20 min', completada:true, tipo:'video', resumen:'Script de confirmación ganador. Horarios óptimos. Manejo de objeciones. Tasas reales.' },
      { id:'m2l4', titulo:'HACER: WhatsApp como canal de ventas', duracion:'22 min', completada:true, tipo:'practica', resumen:'Plantillas que convierten. Seguimiento automatizado. Recuperación de abandonados.', kpi_relacionado:'WhatsApp' },
      { id:'m2l5', titulo:'VERIFICAR: Indicadores que importan', duracion:'16 min', completada:true, tipo:'lectura', resumen:'Los 7 KPIs que debes revisar cada día. Cómo interpretarlos. Cuándo actuar.', kpi_relacionado:'Dashboard P&G' },
      { id:'m2l6', titulo:'VERIFICAR: Lectura de reportes Dropi', duracion:'14 min', completada:true, tipo:'video', resumen:'Cómo leer el dashboard de Dropi. Qué significa cada número. Filtros útiles.' },
      { id:'m2l7', titulo:'ACTUAR: Toma de decisiones por datos', duracion:'18 min', completada:false, tipo:'lectura', resumen:'Cuándo subir o bajar pauta. Cuándo pausar un producto. Cuándo cambiar transportadora.', kpi_relacionado:'Alertas' },
      { id:'m2l8', titulo:'Caso PHVA real: Tienda agosto 2023', duracion:'30 min', completada:false, tipo:'practica', resumen:'Análisis completo de una tienda real: qué funcionó, qué falló y qué se cambió.' },
      { id:'m2l9', titulo:'Automatización básica sin código', duracion:'20 min', completada:false, tipo:'video', resumen:'Herramientas para automatizar confirmaciones, seguimiento y reportes sin programar.' },
      { id:'m2l10', titulo:'Quiz: PHVA en práctica', duracion:'10 min', completada:false, tipo:'quiz', resumen:'Evaluación con casos reales de aplicación PHVA.' },
    ]
  },
  {
    id:'M3', codigo:'M-03', titulo:'Costeo Estratégico ABC + PEF', subtitulo:'Encuentra el dinero que no sabías que perdías',
    fase:'PLANEAR', color:'#F5A623', emoji:'💰', completado:4, total:9,
    descripcion:'El módulo más importante. Aprende a calcular el costo real de cada producto incluyendo costos ocultos. Nunca más pierdas dinero sin saberlo.',
    lecciones:[
      { id:'m3l1', titulo:'¿Por qué el 70% de los dropshippers pierde dinero?', duracion:'12 min', completada:true, tipo:'video', resumen:'Los errores más comunes en costeo. El mito de "lo compré a $X lo vendo a $Y". Costos que no ves.' },
      { id:'m3l2', titulo:'Método ABC: Activity-Based Costing', duracion:'25 min', completada:true, tipo:'lectura', resumen:'Cómo asignar costos por actividad real. Qué incluir en cada capa del costeo.', kpi_relacionado:'Precio & Costeo' },
      { id:'m3l3', titulo:'Diagnóstico PEF: Prevención-Evaluación-Fallas', duracion:'20 min', completada:true, tipo:'video', resumen:'Los costos ocultos del PEF. Cómo detectarlos. Casos reales de tiendas colombianas.', kpi_relacionado:'Alertas PEF' },
      { id:'m3l4', titulo:'Cascada de costos real por producto', duracion:'22 min', completada:true, tipo:'practica', resumen:'Construye tu cascada: PVP → proveedor → flete → fulfillment → pauta → CF → ganancia real.', kpi_relacionado:'P&G Resultados' },
      { id:'m3l5', titulo:'Fijación de precios: Costeo inverso', duracion:'18 min', completada:false, tipo:'lectura', resumen:'Dado el margen que quieres, ¿cuál es el PVP mínimo? La fórmula correcta.', kpi_relacionado:'Precio & Costeo' },
      { id:'m3l6', titulo:'CPA máximo: cuánto puedes pagar por venta', duracion:'15 min', completada:false, tipo:'video', resumen:'La fórmula del CPA máximo. Cómo usarla para configurar tus campañas.', kpi_relacionado:'Pauta' },
      { id:'m3l7', titulo:'Punto de equilibrio real (con mezcla)', duracion:'20 min', completada:false, tipo:'practica', resumen:'PE con un solo producto vs PE con mezcla de productos. Cuál usar y por qué.', kpi_relacionado:'Punto Equilibrio' },
      { id:'m3l8', titulo:'Sensibilidad: ¿qué pasa si sube el flete?', duracion:'12 min', completada:false, tipo:'lectura', resumen:'Análisis de sensibilidad en costos. Escenarios y cómo prepararse.' },
      { id:'m3l9', titulo:'Quiz: Costeo completo', duracion:'15 min', completada:false, tipo:'quiz', resumen:'Caso práctico completo: calcular el margen real de un producto dado.' },
    ]
  },
  {
    id:'M4', codigo:'M-04', titulo:'Publicidad Meta & TikTok Ads', subtitulo:'Tráfico rentable para tu tienda',
    fase:'HACER', color:'#9B6BFF', emoji:'📢', completado:2, total:8,
    descripcion:'Domina la publicidad en Meta y TikTok. Desde la estructura de campañas hasta la interpretación de métricas y escalamiento rentable.',
    lecciones:[
      { id:'m4l1', titulo:'Estructura de campañas para dropshipping', duracion:'20 min', completada:true, tipo:'video', resumen:'CBO vs ABO. Estructura de campaña ganadora. Cómo organizar tus conjuntos de anuncios.', kpi_relacionado:'Pauta' },
      { id:'m4l2', titulo:'Creativos que convierten: UGC y hooks', duracion:'25 min', completada:true, tipo:'video', resumen:'El hook de los primeros 3 segundos. Tipos de creativos que funcionan. Estructura de un anuncio ganador.' },
      { id:'m4l3', titulo:'Segmentación de audiencias Colombia', duracion:'18 min', completada:false, tipo:'lectura', resumen:'Audiencias por interés vs Lookalike. Cómo encontrar tu cliente ideal en Meta.' },
      { id:'m4l4', titulo:'Interpretación de métricas Meta', duracion:'15 min', completada:false, tipo:'practica', resumen:'CTR, CPM, ROAS, CPA — qué significa cada uno y cuándo actuar.', kpi_relacionado:'Pauta' },
      { id:'m4l5', titulo:'Escalar campañas sin matar el ROAS', duracion:'22 min', completada:false, tipo:'video', resumen:'Reglas de escalamiento. Cuánto subir y cuándo. Duplicar vs aumentar presupuesto.' },
      { id:'m4l6', titulo:'TikTok Ads para dropshipping LATAM', duracion:'20 min', completada:false, tipo:'video', resumen:'Diferencias clave con Meta. Formatos que funcionan. Cómo configurar tu primera campaña.' },
      { id:'m4l7', titulo:'Test A/B de creativos sistemático', duracion:'15 min', completada:false, tipo:'practica', resumen:'Cómo testear creativos de forma sistemática. Variables a cambiar. Cómo interpretar resultados.' },
      { id:'m4l8', titulo:'Quiz: Publicidad digital', duracion:'12 min', completada:false, tipo:'quiz', resumen:'Casos reales: diagnóstica este anuncio y recomienda acciones.' },
    ]
  },
  {
    id:'M5', codigo:'M-05', titulo:'Logística & Transportadoras', subtitulo:'Optimiza tu cadena de entrega',
    fase:'HACER', color:'#F05C5C', emoji:'🚚', completado:1, total:6,
    descripcion:'Todo sobre la logística en dropshipping colombiano. Cómo elegir transportadoras, gestionar novedades y reducir devoluciones.',
    lecciones:[
      { id:'m5l1', titulo:'El embudo logístico: de pedido a entrega', duracion:'15 min', completada:true, tipo:'video', resumen:'Las etapas del pedido. Dónde se pierden los pedidos. Tasas reales de entrega por región.', kpi_relacionado:'Logística' },
      { id:'m5l2', titulo:'ENVIA vs COORDINADORA vs SERVIENTREGA', duracion:'12 min', completada:false, tipo:'lectura', resumen:'Comparativo real. Cobertura, precios, tiempos y tasas de entrega por zona.' },
      { id:'m5l3', titulo:'Gestión de novedades: guión y proceso', duracion:'18 min', completada:false, tipo:'practica', resumen:'Cómo manejar cada tipo de novedad. Script de llamada. Tiempos máximos de respuesta.' },
      { id:'m5l4', titulo:'Reducción de devoluciones: causas y soluciones', duracion:'15 min', completada:false, tipo:'video', resumen:'Por qué se devuelven los pedidos. Cómo prevenirlo. Protocolo de recuperación.' },
      { id:'m5l5', titulo:'Confirmación previa al despacho', duracion:'10 min', completada:false, tipo:'lectura', resumen:'El proceso que más impacta en la tasa de entrega. Cómo implementarlo sin perder velocidad.' },
      { id:'m5l6', titulo:'Quiz: Logística avanzada', duracion:'8 min', completada:false, tipo:'quiz', resumen:'Casos de novedades reales: ¿qué harías en cada situación?' },
    ]
  },
]

const ESTRATEGIAS: Estrategia[] = [
  {
    titulo: 'Combo x2 para aumentar ticket promedio',
    categoria: 'Ventas', color: '#2DD4A0', dificultad: 'Fácil',
    descripcion: 'Ofrecer 2 unidades con un pequeño descuento puede aumentar el ticket promedio entre 40-60% sin aumentar el CPA proporcionalmente.',
    impacto: '+40% ticket promedio · Mismo CPA · Más ganancia por pedido',
    pasos: ['Identifica productos con margen neto >15%','Crea el combo en Dropi (x2 y x3)','Pon precio combo con 10-15% descuento vs precio unitario','Testea en un conjunto de anuncios separado','Si ROAS combo > ROAS unitario, escala el combo']
  },
  {
    titulo: 'WhatsApp inmediato post-pedido',
    categoria: 'Confirmación', color: '#25D366', dificultad: 'Fácil',
    descripcion: 'Enviar un WhatsApp en los primeros 30 minutos después del pedido puede subir la tasa de confirmación del 60% al 80%.',
    impacto: '+15-20% tasa confirmación · Menos pedidos perdidos',
    pasos: ['Configura alerta de nuevo pedido en Dropi','En los primeros 30 minutos envía el mensaje de confirmación','Usa el nombre real del cliente y el producto exacto','Pregunta específicamente por la dirección completa','Si no responde en 2h, llama al número registrado']
  },
  {
    titulo: 'Gestión de novedades en primeras 24h',
    categoria: 'Logística', color: '#F5A623', dificultad: 'Media',
    descripcion: 'El 80% de las novedades se resuelven si se atienden en las primeras 24 horas. Después, la probabilidad de entrega cae drásticamente.',
    impacto: '+8-12% tasa entrega · Menos devoluciones',
    pasos: ['Revisa novedades cada mañana antes de las 9am','Llama al cliente inmediatamente','Confirma dirección exacta (barrio + referencia)','Coordina con la transportadora el nuevo intento','Si el cliente no responde en 48h, inicia devolución controlada']
  },
  {
    titulo: 'Escalar campaña ganadora gradualmente',
    categoria: 'Pauta', color: '#9B6BFF', dificultad: 'Media',
    descripcion: 'Las campañas con ROAS >3x y CPA por debajo del máximo son candidatas a escalar. La regla: nunca más del 20-30% de aumento cada 72h.',
    impacto: '+ROAS sostenido · Más ventas sin romper el algoritmo',
    pasos: ['Identifica campaña con ROAS >3x por mínimo 7 días','Aumenta el presupuesto máximo 20-30%','Espera 72h antes del próximo aumento','Si ROAS cae >15%, pausa y analiza','Considera duplicar el conjunto de anuncios en paralelo']
  },
  {
    titulo: 'Diagnóstico PEF mensual',
    categoria: 'Costos', color: '#F05C5C', dificultad: 'Media',
    descripcion: 'Reservar 2 horas al mes para revisar los costos ocultos (PEF) puede liberar $500K-$1M en utilidad sin vender un solo producto más.',
    impacto: '+$500K-$1M/mes en utilidad real detectada',
    pasos: ['Primer lunes del mes: revisión PEF','Lista todos los procesos manuales que haces','Estima tiempo en horas y multiplica por tu valor/hora','Suma los costos de fallas (devoluciones, reprocesos)','Propón automatización o cambio de proceso para los top 3']
  },
  {
    titulo: 'Reactivación de clientes con WA',
    categoria: 'Fidelización', color: '#3D8EF0', dificultad: 'Fácil',
    descripcion: 'Los clientes que ya compraron tienen 5x más probabilidad de volver a comprar. Un mensaje de reactivación bien enviado puede generar ventas sin pauta.',
    impacto: '+15-25% ventas recurrentes · Sin inversión en pauta',
    pasos: ['Exporta clientes con estado "ENTREGADO" de los últimos 30-60 días','Segmenta por producto comprado','Envía mensaje personalizado mencionando el producto que compraron','Ofrece novedad o complemento relacionado','Mide la tasa de respuesta y ajusta el mensaje']
  },
]

const KPI_GLOSSARY = [
  { kpi:'ROAS', nombre:'Return on Ad Spend', formula:'Ventas generadas / Inversión en pauta', ejemplo:'ROAS 3x = por cada $1 de pauta generas $3 en ventas', bueno:'≥ 2.5x', critico:'< 1.5x', color:'#9B6BFF' },
  { kpi:'CPA', nombre:'Costo por Adquisición', formula:'Inversión pauta / Número de compras', ejemplo:'Inviertes $5M, logras 500 compras → CPA $10.000', bueno:'≤ CPA máximo calculado', critico:'> PVP × margen mínimo', color:'#F5A623' },
  { kpi:'CTR', nombre:'Click Through Rate', formula:'(Clics / Impresiones) × 100', ejemplo:'1.000 clics en 100.000 impresiones = CTR 1%', bueno:'≥ 1.5%', critico:'< 0.8%', color:'#3D8EF0' },
  { kpi:'CPM', nombre:'Costo por Mil Impresiones', formula:'(Inversión / Impresiones) × 1.000', ejemplo:'$100.000 por 10.000 impresiones = CPM $10.000', bueno:'≤ $9.000', critico:'> $15.000', color:'#F05C5C' },
  { kpi:'Tasa Conf.', nombre:'Tasa de Confirmación', formula:'Pedidos confirmados / Pedidos generados', ejemplo:'620 confirmados de 1.000 generados = 62%', bueno:'≥ 65%', critico:'< 50%', color:'#2DD4A0' },
  { kpi:'Margen Neto', nombre:'Margen Neto de Utilidad', formula:'(Utilidad neta / Ventas) × 100', ejemplo:'Ventas $10M, costos $8.5M → Margen 15%', bueno:'≥ 15%', critico:'< 8%', color:'#2DD4A0' },
  { kpi:'PE', nombre:'Punto de Equilibrio', formula:'CF totales / Ganancia ponderada por pedido', ejemplo:'CF $2.5M / $9.000 por pedido = 278 pedidos mínimos', bueno:'Cubrir en primera semana del mes', critico:'No cubrirlo en el mes', color:'#F5A623' },
  { kpi:'T.Entrega', nombre:'Tasa de Entrega Efectiva', formula:'Pedidos entregados / Pedidos despachados', ejemplo:'390 entregados de 500 despachados = 78%', bueno:'≥ 80%', critico:'< 65%', color:'#3D8EF0' },
]

export default function FormacionPage() {
  const [tab, setTab] = useState<'modulos'|'kpis'|'estrategias'|'mentoria'>('modulos')
  const [moduloSel, setModuloSel] = useState<string | null>(null)
  const [estrategiaSel, setEstrategiaSel] = useState<number | null>(null)
  const [kpiSel, setKpiSel] = useState<string | null>(null)

  const totalLecciones = MODULOS.reduce((s,m) => s+m.total, 0)
  const completadas = MODULOS.reduce((s,m) => s+m.completado, 0)
  const pctTotal = Math.round(completadas/totalLecciones*100)

  const modulo = moduloSel ? MODULOS.find(m => m.id === moduloSel) : null

  const TIPO_ICON: Record<string, string> = {
    video:'🎬', lectura:'📖', practica:'⚡', quiz:'📝'
  }

  const s = { background:'#111520', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'12px' }
  const inp = { background:'#0A0D14', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'7px', color:'#E8EDF5', padding:'7px 10px', fontSize:'13px', outline:'none', width:'100%', boxSizing:'border-box' as const }

  return (
    <div style={{ color:'#E8EDF5', fontFamily:'system-ui,sans-serif' }}>

      <div style={{ marginBottom:'20px' }}>
        <h1 style={{ fontSize:'22px', fontWeight:'700', marginBottom:'4px' }}>🎓 Centro de Formación</h1>
        <p style={{ fontSize:'13px', color:'#8B96A8' }}>Mentoría Premium · Joan Torres · 5 módulos · Casos reales PHVA · ACTUAR</p>
      </div>

      {/* Progreso general */}
      <div style={{ ...s, padding:'16px 20px', marginBottom:'16px', display:'flex', gap:'20px', alignItems:'center' }}>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
            <span style={{ fontSize:'13px', color:'#8B96A8' }}>Tu progreso de formación</span>
            <span style={{ fontSize:'13px', fontWeight:'800', color:'#F5A623' }}>{completadas}/{totalLecciones} lecciones · {pctTotal}%</span>
          </div>
          <div style={{ height:'10px', background:'rgba(255,255,255,0.05)', borderRadius:'5px' }}>
            <div style={{ height:'10px', width:`${pctTotal}%`, background:'linear-gradient(90deg, #F5A623, #2DD4A0)', borderRadius:'5px', transition:'width .5s' }} />
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px', flexShrink:0 }}>
          {[
            { label:'Módulos', value:`${MODULOS.filter(m=>m.completado===m.total).length}/${MODULOS.length}`, color:'#3D8EF0' },
            { label:'Lecciones', value:`${completadas}/${totalLecciones}`, color:'#2DD4A0' },
            { label:'Progreso', value:`${pctTotal}%`, color:'#F5A623' },
          ].map((k,i) => (
            <div key={i} style={{ textAlign:'center' }}>
              <div style={{ fontSize:'18px', fontWeight:'800', color:k.color }}>{k.value}</div>
              <div style={{ fontSize:'10px', color:'#5A6478' }}>{k.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'6px', marginBottom:'16px' }}>
        {[
          { key:'modulos', label:'📚 Módulos' },
          { key:'kpis', label:'📊 Glosario KPIs' },
          { key:'estrategias', label:'🎯 Estrategias' },
          { key:'mentoria', label:'👨‍🏫 Mentoría Joan' },
        ].map(t => (
          <button key={t.key} onClick={() => { setTab(t.key as any); setModuloSel(null) }}
            style={{ padding:'8px 16px', borderRadius:'9px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'600',
              background: tab === t.key ? '#F5A623' : 'rgba(255,255,255,0.05)',
              color: tab === t.key ? '#0A0D14' : '#8B96A8' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB MÓDULOS */}
      {tab === 'modulos' && !modulo && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
          {MODULOS.map(m => {
            const pct = Math.round(m.completado/m.total*100)
            return (
              <div key={m.id} onClick={() => setModuloSel(m.id)}
                style={{ ...s, padding:'18px', cursor:'pointer', transition:'all .15s', borderTop:`3px solid ${m.color}` }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#161C2E'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#111520'}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'10px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <span style={{ fontSize:'24px' }}>{m.emoji}</span>
                    <div>
                      <div style={{ fontSize:'10px', color:m.color, fontWeight:'700', marginBottom:'2px' }}>{m.codigo} · {m.fase}</div>
                      <div style={{ fontSize:'14px', fontWeight:'800', color:'#E8EDF5' }}>{m.titulo}</div>
                      <div style={{ fontSize:'11px', color:'#5A6478' }}>{m.subtitulo}</div>
                    </div>
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div style={{ fontSize:'18px', fontWeight:'900', color:m.color }}>{pct}%</div>
                    <div style={{ fontSize:'10px', color:'#5A6478' }}>{m.completado}/{m.total}</div>
                  </div>
                </div>
                <div style={{ fontSize:'12px', color:'#8B96A8', marginBottom:'12px', lineHeight:'1.5' }}>{m.descripcion}</div>
                <div style={{ height:'6px', background:'rgba(255,255,255,0.05)', borderRadius:'3px', marginBottom:'8px' }}>
                  <div style={{ height:'6px', width:`${pct}%`, background:m.color, borderRadius:'3px' }} />
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ display:'flex', gap:'6px' }}>
                    {['video','lectura','practica','quiz'].map(tipo => {
                      const count = m.lecciones.filter(l => l.tipo === tipo).length
                      return count > 0 ? (
                        <span key={tipo} style={{ fontSize:'10px', color:'#5A6478' }}>{TIPO_ICON[tipo]}{count}</span>
                      ) : null
                    })}
                  </div>
                  <span style={{ fontSize:'12px', color:m.color, fontWeight:'600' }}>Ver lecciones →</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Vista lecciones de un módulo */}
      {tab === 'modulos' && modulo && (
        <div>
          <button onClick={() => setModuloSel(null)}
            style={{ padding:'7px 14px', background:'rgba(255,255,255,0.05)', border:'none', borderRadius:'8px', color:'#8B96A8', cursor:'pointer', fontSize:'13px', marginBottom:'16px' }}>
            ← Volver a módulos
          </button>

          <div style={{ ...s, padding:'20px', marginBottom:'16px', borderTop:`3px solid ${modulo.color}` }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'8px' }}>
              <span style={{ fontSize:'28px' }}>{modulo.emoji}</span>
              <div>
                <div style={{ fontSize:'10px', color:modulo.color, fontWeight:'700' }}>{modulo.codigo} · {modulo.fase}</div>
                <div style={{ fontSize:'18px', fontWeight:'800' }}>{modulo.titulo}</div>
                <div style={{ fontSize:'12px', color:'#5A6478' }}>{modulo.subtitulo}</div>
              </div>
              <div style={{ marginLeft:'auto', textAlign:'right' }}>
                <div style={{ fontSize:'22px', fontWeight:'900', color:modulo.color }}>{Math.round(modulo.completado/modulo.total*100)}%</div>
                <div style={{ fontSize:'11px', color:'#5A6478' }}>{modulo.completado}/{modulo.total} lecciones</div>
              </div>
            </div>
            <div style={{ fontSize:'13px', color:'#8B96A8' }}>{modulo.descripcion}</div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            {modulo.lecciones.map((l, i) => (
              <div key={l.id} style={{ ...s, padding:'14px 16px',
                background: l.completada ? 'rgba(45,212,160,0.04)' : '#111520',
                border: l.completada ? '1px solid rgba(45,212,160,0.12)' : '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                  <div style={{ width:'28px', height:'28px', borderRadius:'8px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center',
                    background: l.completada ? 'rgba(45,212,160,0.15)' : 'rgba(255,255,255,0.05)',
                    fontSize:'14px' }}>
                    {l.completada ? '✅' : TIPO_ICON[l.tipo]}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'3px' }}>
                      <span style={{ fontSize:'13px', fontWeight:'600', color: l.completada ? '#8B96A8' : '#E8EDF5' }}>{i+1}. {l.titulo}</span>
                      {l.kpi_relacionado && (
                        <span style={{ fontSize:'10px', padding:'1px 7px', borderRadius:'5px', background:`${modulo.color}15`, color:modulo.color, fontWeight:'600', flexShrink:0 }}>
                          → {l.kpi_relacionado}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize:'12px', color:'#5A6478' }}>{l.resumen}</div>
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div style={{ fontSize:'11px', color:'#5A6478' }}>{l.duracion}</div>
                    <div style={{ fontSize:'10px', color: l.tipo === 'video' ? '#F05C5C' : l.tipo === 'practica' ? '#F5A623' : l.tipo === 'quiz' ? '#9B6BFF' : '#3D8EF0', marginTop:'2px', fontWeight:'600' }}>
                      {l.tipo.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB KPIs */}
      {tab === 'kpis' && (
        <div style={{ display:'grid', gridTemplateColumns: kpiSel ? '1fr 380px' : 'repeat(2,1fr)', gap:'14px' }}>
          {!kpiSel && KPI_GLOSSARY.map((k, i) => (
            <div key={i} onClick={() => setKpiSel(k.kpi)}
              style={{ ...s, padding:'16px', cursor:'pointer', borderTop:`2px solid ${k.color}`, transition:'all .12s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#161C2E'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#111520'}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'8px' }}>
                <div>
                  <div style={{ fontSize:'16px', fontWeight:'900', color:k.color, marginBottom:'2px' }}>{k.kpi}</div>
                  <div style={{ fontSize:'12px', color:'#8B96A8' }}>{k.nombre}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:'10px', color:'#2DD4A0', fontWeight:'700' }}>✓ {k.bueno}</div>
                  <div style={{ fontSize:'10px', color:'#F05C5C', fontWeight:'700' }}>✗ {k.critico}</div>
                </div>
              </div>
              <div style={{ fontSize:'11px', color:'#5A6478', background:'rgba(255,255,255,0.02)', padding:'8px 10px', borderRadius:'6px', marginBottom:'6px', fontFamily:'monospace' }}>
                {k.formula}
              </div>
              <div style={{ fontSize:'12px', color:'#8B96A8' }}>💡 {k.ejemplo}</div>
            </div>
          ))}

          {kpiSel && (() => {
            const k = KPI_GLOSSARY.find(kk => kk.kpi === kpiSel)!
            return (
              <>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                  {KPI_GLOSSARY.map((kk, i) => (
                    <div key={i} onClick={() => setKpiSel(kk.kpi)}
                      style={{ ...s, padding:'12px', cursor:'pointer',
                        border:`1px solid ${kpiSel === kk.kpi ? kk.color + '44' : 'rgba(255,255,255,0.07)'}`,
                        background: kpiSel === kk.kpi ? `${kk.color}08` : '#111520' }}>
                      <div style={{ fontSize:'14px', fontWeight:'800', color:kk.color }}>{kk.kpi}</div>
                      <div style={{ fontSize:'11px', color:'#5A6478' }}>{kk.nombre}</div>
                    </div>
                  ))}
                </div>
                <div style={{ ...s, padding:'20px', position:'sticky', top:'20px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'14px' }}>
                    <div>
                      <div style={{ fontSize:'22px', fontWeight:'900', color:k.color }}>{k.kpi}</div>
                      <div style={{ fontSize:'13px', color:'#8B96A8' }}>{k.nombre}</div>
                    </div>
                    <button onClick={() => setKpiSel(null)} style={{ background:'none', border:'none', color:'#8B96A8', cursor:'pointer', fontSize:'20px' }}>×</button>
                  </div>
                  <div style={{ marginBottom:'12px' }}>
                    <div style={{ fontSize:'11px', color:'#5A6478', fontWeight:'700', marginBottom:'5px' }}>FÓRMULA</div>
                    <div style={{ background:'#0A0D14', padding:'10px 12px', borderRadius:'8px', fontFamily:'monospace', fontSize:'13px', color:k.color }}>{k.formula}</div>
                  </div>
                  <div style={{ marginBottom:'12px', padding:'12px', background:'rgba(255,255,255,0.02)', borderRadius:'8px' }}>
                    <div style={{ fontSize:'11px', color:'#5A6478', fontWeight:'700', marginBottom:'5px' }}>EJEMPLO REAL</div>
                    <div style={{ fontSize:'13px', color:'#8B96A8', lineHeight:'1.6' }}>{k.ejemplo}</div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'12px' }}>
                    <div style={{ padding:'10px', background:'rgba(45,212,160,0.06)', borderRadius:'8px', border:'1px solid rgba(45,212,160,0.15)' }}>
                      <div style={{ fontSize:'10px', color:'#2DD4A0', fontWeight:'700', marginBottom:'3px' }}>✓ BUENO</div>
                      <div style={{ fontSize:'13px', fontWeight:'700', color:'#2DD4A0' }}>{k.bueno}</div>
                    </div>
                    <div style={{ padding:'10px', background:'rgba(240,92,92,0.06)', borderRadius:'8px', border:'1px solid rgba(240,92,92,0.15)' }}>
                      <div style={{ fontSize:'10px', color:'#F05C5C', fontWeight:'700', marginBottom:'3px' }}>✗ CRÍTICO</div>
                      <div style={{ fontSize:'13px', fontWeight:'700', color:'#F05C5C' }}>{k.critico}</div>
                    </div>
                  </div>
                  <div style={{ padding:'10px 12px', background:`${k.color}08`, borderRadius:'8px', border:`1px solid ${k.color}22`, fontSize:'12px', color:'#8B96A8', lineHeight:'1.6' }}>
                    💡 Encuentra este KPI en tiempo real en <strong style={{ color:k.color }}>DIZGO → {k.kpi === 'ROAS' || k.kpi === 'CPA' || k.kpi === 'CTR' || k.kpi === 'CPM' ? 'Pauta Meta/TikTok' : k.kpi === 'Tasa Conf.' ? 'Pedidos' : k.kpi === 'PE' ? 'Punto Equilibrio' : k.kpi === 'T.Entrega' ? 'Logística' : 'Dashboard P&G'}</strong>
                  </div>
                </div>
              </>
            )
          })()}
        </div>
      )}

      {/* TAB ESTRATEGIAS */}
      {tab === 'estrategias' && (
        <div style={{ display:'grid', gridTemplateColumns: estrategiaSel !== null ? '1fr 400px' : 'repeat(2,1fr)', gap:'14px' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {ESTRATEGIAS.map((e, i) => (
              <div key={i} onClick={() => setEstrategiaSel(i === estrategiaSel ? null : i)}
                style={{ ...s, padding:'16px', cursor:'pointer', transition:'all .12s',
                  border:`1px solid ${estrategiaSel === i ? e.color + '44' : 'rgba(255,255,255,0.07)'}`,
                  background: estrategiaSel === i ? `${e.color}06` : '#111520' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'8px' }}>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'3px' }}>
                      <span style={{ fontSize:'10px', padding:'1px 7px', borderRadius:'5px', background:`${e.color}15`, color:e.color, fontWeight:'700' }}>{e.categoria}</span>
                      <span style={{ fontSize:'10px', color:'#5A6478' }}>
                        {e.dificultad === 'Fácil' ? '🟢' : e.dificultad === 'Media' ? '🟡' : '🔴'} {e.dificultad}
                      </span>
                    </div>
                    <div style={{ fontSize:'14px', fontWeight:'700', color:'#E8EDF5' }}>{e.titulo}</div>
                  </div>
                </div>
                <div style={{ fontSize:'12px', color:'#8B96A8', marginBottom:'8px', lineHeight:'1.5' }}>{e.descripcion}</div>
                <div style={{ fontSize:'12px', fontWeight:'700', color:e.color }}>💰 {e.impacto}</div>
              </div>
            ))}
          </div>

          {estrategiaSel !== null && (() => {
            const e = ESTRATEGIAS[estrategiaSel]
            return (
              <div style={{ ...s, padding:'20px', position:'sticky', top:'20px', maxHeight:'80vh', overflowY:'auto' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px' }}>
                  <div>
                    <span style={{ fontSize:'10px', padding:'2px 8px', borderRadius:'5px', background:`${e.color}15`, color:e.color, fontWeight:'700' }}>{e.categoria}</span>
                    <div style={{ fontSize:'16px', fontWeight:'800', marginTop:'6px', color:'#E8EDF5' }}>{e.titulo}</div>
                  </div>
                  <button onClick={() => setEstrategiaSel(null)} style={{ background:'none', border:'none', color:'#8B96A8', cursor:'pointer', fontSize:'20px' }}>×</button>
                </div>
                <div style={{ fontSize:'13px', color:'#8B96A8', marginBottom:'14px', lineHeight:'1.6' }}>{e.descripcion}</div>
                <div style={{ padding:'10px 14px', background:`${e.color}08`, borderRadius:'10px', border:`1px solid ${e.color}22`, marginBottom:'16px' }}>
                  <div style={{ fontSize:'11px', color:e.color, fontWeight:'700', marginBottom:'4px' }}>💰 IMPACTO ESPERADO</div>
                  <div style={{ fontSize:'13px', color:'#E8EDF5', fontWeight:'600' }}>{e.impacto}</div>
                </div>
                <div style={{ fontSize:'12px', fontWeight:'700', color:'#5A6478', marginBottom:'10px' }}>📋 PASOS DE IMPLEMENTACIÓN</div>
                {e.pasos.map((paso, i) => (
                  <div key={i} style={{ display:'flex', gap:'10px', padding:'9px 12px', borderRadius:'8px', marginBottom:'6px', background:'rgba(255,255,255,0.02)' }}>
                    <div style={{ width:'22px', height:'22px', borderRadius:'6px', background:`${e.color}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'900', color:e.color, flexShrink:0 }}>
                      {i+1}
                    </div>
                    <span style={{ fontSize:'12px', color:'#8B96A8', lineHeight:'1.5' }}>{paso}</span>
                  </div>
                ))}
              </div>
            )
          })()}
        </div>
      )}

      {/* TAB MENTORÍA */}
      {tab === 'mentoria' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          {/* Perfil mentor */}
          <div style={{ ...s, padding:'24px', borderTop:'3px solid #F5A623' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'16px' }}>
              <div style={{ width:'56px', height:'56px', borderRadius:'14px', background:'linear-gradient(135deg, #F5A623, #FF6B35)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', fontWeight:'900', color:'#0A0D14' }}>
                JT
              </div>
              <div>
                <div style={{ fontSize:'18px', fontWeight:'800' }}>Joan Torres</div>
                <div style={{ fontSize:'12px', color:'#F5A623', fontWeight:'600' }}>Mentor · Fundador DIZGO</div>
                <div style={{ fontSize:'11px', color:'#5A6478', marginTop:'2px' }}>4+ años en e-commerce · MBA Internacional</div>
              </div>
            </div>

            <div style={{ fontSize:'13px', color:'#8B96A8', lineHeight:'1.8', marginBottom:'16px' }}>
              "Un e-commerce rentable no nace del impulso de vender, sino de la decisión de construir una empresa con propósito, estructura y visión a largo plazo."
            </div>

            <div style={{ fontSize:'12px', fontWeight:'700', color:'#5A6478', marginBottom:'10px' }}>EXPERIENCIA</div>
            {[
              { icon:'🎓', texto:'Tecnólogo en Gestión de Calidad · Administrador de Empresas' },
              { icon:'📚', texto:'Maestría en Administración Internacional — Politécnico Grancolombiano' },
              { icon:'🛒', texto:'4+ años en dropshipping — Colombia, Ecuador, México' },
              { icon:'⚙️', texto:'10+ años en optimización de procesos y costos' },
              { icon:'🌱', texto:'Academia Agroecológica La de Palmitas con AMOR' },
            ].map((e, i) => (
              <div key={i} style={{ display:'flex', gap:'10px', padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:'12px', color:'#8B96A8' }}>
                <span style={{ flexShrink:0 }}>{e.icon}</span>
                <span>{e.texto}</span>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {/* Filosofía */}
            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#3D8EF0', marginBottom:'12px' }}>💡 FILOSOFÍA DE MENTORÍA</div>
              {[
                { titulo:'Datos sobre intuición', desc:'Cada decisión en tu tienda debe estar respaldada por números reales. No por corazonadas.' },
                { titulo:'Costos primero', desc:'Antes de escalar, entiende el costo real de cada venta. DIZGO existe para esto.' },
                { titulo:'PHVA como sistema', desc:'No es una metodología — es la forma de pensar en el negocio todos los días.' },
                { titulo:'Impacto real', desc:'Un negocio rentable puede cambiar tu vida y la de tu comunidad. Ese es el objetivo.' },
              ].map((f, i) => (
                <div key={i} style={{ padding:'10px 12px', borderRadius:'8px', marginBottom:'7px', background:'rgba(61,142,240,0.05)', borderLeft:'3px solid #3D8EF044' }}>
                  <div style={{ fontSize:'12px', fontWeight:'700', color:'#3D8EF0', marginBottom:'3px' }}>→ {f.titulo}</div>
                  <div style={{ fontSize:'11px', color:'#8B96A8' }}>{f.desc}</div>
                </div>
              ))}
            </div>

            {/* Casos reales PHVA */}
            <div style={{ ...s, padding:'18px' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#2DD4A0', marginBottom:'12px' }}>📊 CASOS PRÁCTICOS PHVA REALES</div>
              {[
                { fase:'P', titulo:'Planeación agosto 2023', desc:'Meta: 500 pedidos/mes, $35M ventas. Costeo ABC por producto. CF: $1.159.000.', color:'#3D8EF0' },
                { fase:'H', titulo:'Ejecución: 3.000 pedidos generados', desc:'9 campañas activas Meta. $41.4M invertidos. ENVIA como transportadora principal.', color:'#2DD4A0' },
                { fase:'V', titulo:'Verificación: 503 entregados', desc:'CPA $10.338, ROAS 3.27x, CTR 1.45%. Tasa entrega 78%. 100 novedades activas.', color:'#F5A623' },
                { fase:'A', titulo:'Decisión: Escalar AIR FRYER', desc:'ROAS 5.45x detectado. Decisión: aumentar presupuesto y crear combo x2.', color:'#9B6BFF' },
              ].map((c, i) => (
                <div key={i} style={{ display:'flex', gap:'10px', padding:'9px 12px', borderRadius:'8px', marginBottom:'6px', background:`${c.color}06` }}>
                  <div style={{ width:'24px', height:'24px', borderRadius:'7px', background:`${c.color}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'900', color:c.color, flexShrink:0 }}>
                    {c.fase}
                  </div>
                  <div>
                    <div style={{ fontSize:'12px', fontWeight:'700', color:'#E8EDF5', marginBottom:'2px' }}>{c.titulo}</div>
                    <div style={{ fontSize:'11px', color:'#8B96A8' }}>{c.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contacto */}
            <div style={{ ...s, padding:'16px', background:'rgba(245,166,35,0.04)', border:'1px solid rgba(245,166,35,0.2)' }}>
              <div style={{ fontSize:'12px', fontWeight:'700', color:'#F5A623', marginBottom:'10px' }}>📬 CONTACTO DIRECTO</div>
              {[
                { icon:'📧', label:'Email', value:'joantorres9@gmail.com' },
                { icon:'📱', label:'WhatsApp', value:'(57) 320 634 8574' },
                { icon:'🌐', label:'Web', value:'www.joantorres.com' },
                { icon:'📸', label:'Instagram', value:'@joan.tores.m' },
              ].map((c, i) => (
                <div key={i} style={{ display:'flex', gap:'10px', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:'12px' }}>
                  <span>{c.icon}</span>
                  <span style={{ color:'#5A6478', width:'60px' }}>{c.label}</span>
                  <span style={{ color:'#F5A623', fontWeight:'600' }}>{c.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
