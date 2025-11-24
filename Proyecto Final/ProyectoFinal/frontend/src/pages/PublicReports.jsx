import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api.js';

export default function PublicReports() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const downloadReport = async (type, format) => {
    try {
      setLoading(true);
      setError('');
      
      let url = '';
      
      if (type === 'sales' && format === 'pdf') {
        url = 'http://localhost:4000/api/public-reports/sales-summary.pdf';
      } else if (type === 'sales' && format === 'xlsx') {
        url = 'http://localhost:4000/api/public-reports/sales-summary.xlsx';
      } else if (type === 'inventory' && format === 'pdf') {
        url = 'http://localhost:4000/api/public-reports/inventory-summary.pdf';
      } else if (type === 'inventory' && format === 'xlsx') {
        url = 'http://localhost:4000/api/public-reports/inventory-summary.xlsx';
      }
      
      if (url) {
        window.open(url, '_blank');
      }
      
    } catch (error) {
      setError('Error al descargar el reporte. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      {/* NAV */}
      <nav className="nav-bar">
        <div className="nav-brand">
          <Link to="/"> RepuestosAuto</Link>
        </div>
        <div className="nav-links">
          <Link to="/">Inicio</Link>
          <Link to="/catalogo">Catálogo</Link>
          <Link to="/auth/login">Iniciar Sesión</Link>
        </div>
      </nav>

      <div className="container" style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        <h1>Reportes y Estadísticas</h1>
        <p>Descarga reportes de ventas e inventario en diferentes formatos.</p>

        {error && (
          <div style={{ 
            background: '#fee', 
            border: '1px solid #fcc', 
            padding: '1rem', 
            borderRadius: '8px',
            marginBottom: '1rem',
            color: '#c00'
          }}>
            {error}
          </div>
        )}

        {/* REPORTES */}
        <div className="reports-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          marginTop: '2rem'
        }}>
          
          {/* Reporte de Ventas */}
          <div className="report-card" style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1.5rem',
            backgroundColor: '#fff'
          }}>
            <h3>Reporte de Ventas</h3>
            <p>Estadísticas generales de ventas y productos más vendidos.</p>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                onClick={() => downloadReport('sales', 'pdf')}
                disabled={loading}
                style={{
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                PDF
              </button>
              <button
                onClick={() => downloadReport('sales', 'xlsx')}
                disabled={loading}
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                Excel
              </button>
            </div>
          </div>

          {/* Reporte de Inventario */}
          <div className="report-card" style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1.5rem',
            backgroundColor: '#fff'
          }}>
            <h3>Reporte de Inventario</h3>
            <p>Estado actual del inventario y productos con bajo stock.</p>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                onClick={() => downloadReport('inventory', 'pdf')}
                disabled={loading}
                style={{
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                📄 PDF
              </button>
              <button
                onClick={() => downloadReport('inventory', 'xlsx')}
                disabled={loading}
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                Excel
              </button>
            </div>
          </div>

        </div>

        {/* INFO EXTRA */}
        <div style={{ 
          marginTop: '3rem', 
          padding: '1.5rem', 
          background: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h3>Información</h3>
          <ul>
            <li>Los informes se generan con datos actualizados.</li>
            <li>Los archivos PDF son ideales para presentaciones.</li>
            <li>Los archivos Excel permiten análisis adicional.</li>
            <li>Para reportes detallados, <Link to="/auth/login">inicia sesión como administrador</Link></li>
          </ul>
        </div>

        {loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            fontSize: '1.2rem'
          }}>
            Generando reporte...
          </div>
        )}
      </div>
    </div>
  );
}
