export default function TestComponent() {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f0f8ff',
      border: '2px solid #007bff',
      margin: '20px',
      borderRadius: '10px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{color: '#007bff'}}>🛠 PRUEBA DE FUNCIONAMIENTO</h1>
      <div style={{backgroundColor: '#d4edda', padding: '15px', borderRadius: '5px', marginBottom: '15px'}}>
        <h3>Estado del Sistema:</h3>
        <ul>
          <li>React funcionando</li>
          <li>Componente renderizando</li>
          <li>Estilos CSS aplicándose</li>
          <li>JavaScript ejecutándose</li>
        </ul>
      </div>
      
      <div style={{backgroundColor: '#fff3cd', padding: '15px', borderRadius: '5px', marginBottom: '15px'}}>
        <h3>Si ves este mensaje:</h3>
        <p>El problema <strong>NO</strong> está en React ni en Vite</p>
        <p>El problema está en el componente Home específico</p>
      </div>
      
      <div style={{backgroundColor: '#f8d7da', padding: '15px', borderRadius: '5px'}}>
        <h3>Si no ves este mensaje:</h3>
        <p>Hay un problema con la configuración básica de React</p>
      </div>
      
      <button 
        onClick={() => alert('¡React está funcionando!')}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '15px'
        }}
      >
        Probar JavaScript
      </button>
    </div>
  );
}
