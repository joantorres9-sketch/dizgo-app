export default function WalletPage() {
  return (
    <div style={{ color: '#E8EDF5', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>💳 Wallet Dropi</h1>
      <p style={{ color: '#8B96A8', marginBottom: '24px' }}>
        Carga tu historial de cartera exportado desde Dropi
      </p>
      <div style={{ 
        background: '#111520', borderRadius: '12px', padding: '48px',
        border: '1px dashed rgba(245,166,35,0.3)', textAlign: 'center'
      }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>📂</div>
        <h3 style={{ marginBottom: '8px' }}>Módulo Wallet</h3>
        <p style={{ color: '#8B96A8', fontSize: '14px' }}>
          Disponible después de configurar la base de datos en Supabase
        </p>
      </div>
    </div>
  )
}
