export default function LoginPage() {
  return (
    <div style={{ 
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0A0D14', fontFamily: 'system-ui, sans-serif', color: '#E8EDF5'
    }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '56px', height: '56px', background: '#F5A623', borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', fontWeight: '800', color: '#0A0D14', margin: '0 auto 16px'
          }}>DZ</div>
          <div style={{ fontSize: '36px', fontWeight: '800' }}>
            DI<span style={{ color: '#F5A623' }}>Z</span>GO
          </div>
          <div style={{ fontSize: '13px', color: '#5A6478', marginTop: '4px' }}>
            Hallazgo de dinero
          </div>
        </div>

        <div style={{ 
          background: '#111520', borderRadius: '16px', padding: '32px',
          border: '1px solid rgba(255,255,255,0.07)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '6px' }}>Iniciar sesión</h2>
          <p style={{ fontSize: '13px', color: '#8B96A8', marginBottom: '24px' }}>
            Accede a tu tienda DIZGO
          </p>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#8B96A8', marginBottom: '6px' }}>
              Correo electrónico
            </label>
            <input 
              type="email" 
              placeholder="tu@tienda.com"
              style={{ 
                width: '100%', padding: '12px 14px', borderRadius: '10px',
                background: '#161C2E', border: '1px solid rgba(255,255,255,0.08)',
                color: '#E8EDF5', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#8B96A8', marginBottom: '6px' }}>
              Contraseña
            </label>
            <input 
              type="password" 
              placeholder="••••••••"
              style={{ 
                width: '100%', padding: '12px 14px', borderRadius: '10px',
                background: '#161C2E', border: '1px solid rgba(255,255,255,0.08)',
                color: '#E8EDF5', fontSize: '14px', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          <a href="/dashboard" style={{ 
            display: 'block', width: '100%', padding: '12px',
            background: '#F5A623', color: '#0A0D14', borderRadius: '10px',
            textAlign: 'center', fontWeight: '700', fontSize: '14px',
            textDecoration: 'none', boxSizing: 'border-box'
          }}>
            Ingresar a DIZGO
          </a>

          <div style={{ 
            marginTop: '20px', paddingTop: '16px', textAlign: 'center',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            fontSize: '12px', color: '#5A6478'
          }}>
            ¿Problemas? Contacta al administrador de tu tienda.
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#5A6478', marginTop: '20px' }}>
          DIZGO v1.0 · Colombia · Ecuador · México
        </p>
      </div>
    </div>
  )
}
