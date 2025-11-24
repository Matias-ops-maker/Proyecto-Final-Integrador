import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/catalogo.css';
import UserNavbar from '../../components/UserNavbar.jsx';

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    }
  }, []);

  const modificarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad === 0) {
      eliminarDelCarrito(productoId);
      return;
    }

    const nuevoCarrito = carrito.map(item =>
      item.id === productoId
        ? { ...item, cantidad: nuevaCantidad }
        : item
    );

    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));

    window.dispatchEvent(new Event('storage'));
  };

  const eliminarDelCarrito = (productoId) => {
    const nuevoCarrito = carrito.filter(item => item.id !== productoId);
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));

    window.dispatchEvent(new Event('storage'));
  };

  const vaciarCarrito = () => {
    const confirmar = window.confirm('¿Estás seguro de que quieres vaciar todo el carrito?');
    if (confirmar) {
      setCarrito([]);
      localStorage.removeItem('carrito');

      window.dispatchEvent(new Event('storage'));
    }
  };

  const calcularSubtotal = () => {
    return carrito.reduce((total, item) => {
      const precio = item.precio || item.price || 0;
      const cantidad = item.cantidad || 0;
      return total + (precio * cantidad);
    }, 0);
  };

  const calcularEnvio = () => {
    const subtotal = calcularSubtotal();
    return subtotal > 100000 ? 0 : 5000;
  };

  const calcularImpuestos = () => {
    return calcularSubtotal() * 0.21;
  };

  const calcularTotal = () => {
    return calcularSubtotal() + calcularEnvio() + calcularImpuestos();
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(precio);
  };

  const cantidadItems = carrito.reduce((total, item) => total + (item.cantidad || 0), 0);

  return (
    <div className="page">
      <UserNavbar />

      <div className="carrito-page-container">
        <div className="carrito-header">
          <h1>Mi Carrito de Compras</h1>
          <button 
            className="btn-volver"
            onClick={() => navigate('/catalogo')}
            style={{
              background: '#6B7280',
              color: 'white',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            >
            ← Seguir Comprando
          </button>
        </div>

        {carrito.length === 0 ? (
          <div className="carrito-vacio">
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <h2>Tu carrito está vacío</h2>
              <p>¡Agrega algunos productos increíbles!</p>
              <Link to="/catalogo" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
                Ir al Catálogo
              </Link>
            </div>
          </div>
        ) : (
          <div className="carrito-content">
            <div className="carrito-items-section">
              <div className="carrito-controls">
                <h3>Productos en tu carrito ({cantidadItems} items)</h3>
                <button 
                  className="btn-vaciar-carrito"
                  onClick={vaciarCarrito}
                  style={{
                    background: '#EF4444',
                    color: 'white',
                    border: 'none',
                    padding: '8px 15px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Vaciar Carrito
                </button>
              </div>

              <div className="carrito-items-list">
                {carrito.map(item => (
                  <div key={item.id} className="carrito-item-detalle">
                    <div className="item-imagen">
                      <img
                        src={item.imagen_url || item.image}
                        alt={item.nombre || item.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/150?text=Sin+imagen';
                        }}
                      />
                    </div>
                    
                    <div className="item-info-detalle">
                      <h4>{item.nombre || item.name}</h4>
                      <p className="item-marca">{item.brand || item.Brand?.nombre}</p>
                      <p className="item-categoria">{item.category || item.Category?.nombre}</p>
                      <p className="item-precio-unitario">
                        Precio unitario: {formatearPrecio(item.precio || item.price)}
                      </p>
                    </div>
                    
                    <div className="item-cantidad-control">
                      <label>Cantidad:</label>
                      <div className="cantidad-buttons">
                        <button 
                          onClick={() => modificarCantidad(item.id, item.cantidad - 1)}
                          disabled={item.cantidad <= 1}
                        >
                          -
                        </button>
                        <span className="cantidad-display">{item.cantidad}</span>
                        <button onClick={() => modificarCantidad(item.id, item.cantidad + 1)}>
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="item-precio-total">
                      <strong>{formatearPrecio((item.precio || item.price) * item.cantidad)}</strong>
                    </div>
                    
                    <button 
                      className="btn-eliminar-item"
                      onClick={() => eliminarDelCarrito(item.id)}
                      style={{
                        background: '#EF4444',
                        color: 'white',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="carrito-resumen">
              <div className="resumen-card">
                <h3>Resumen del Pedido</h3>
                
                <div className="resumen-linea">
                  <span>Subtotal ({cantidadItems} items):</span>
                  <span>{formatearPrecio(calcularSubtotal())}</span>
                </div>
                
                <div className="resumen-linea">
                  <span>Envío:</span>
                  <span>
                    {calcularEnvio() === 0 ? (
                      <span style={{ color: '#10B981' }}>¡GRATIS!</span>
                    ) : (
                      formatearPrecio(calcularEnvio())
                    )}
                  </span>
                </div>
                
                <div className="resumen-linea">
                  <span>IVA (21%):</span>
                  <span>{formatearPrecio(calcularImpuestos())}</span>
                </div>
                
                <hr />
                
                <div className="resumen-total">
                  <strong>
                    <span>Total:</span>
                    <span>{formatearPrecio(calcularTotal())}</span>
                  </strong>
                </div>

                <div className="envio-info">
                  {calcularSubtotal() < 100000 && (
                    <p style={{ fontSize: '0.9em', color: '#F59E0B', marginTop: '10px' }}>
                      ¡Agrega {formatearPrecio(100000 - calcularSubtotal())} más para envío gratis
                    </p>
                  )}
                </div>
                
                <Link 
                  to="/checkout-mercadopago" 
                  className="btn-checkout-principal"
                  style={{
                    background: '#10B981',
                    color: 'white',
                    padding: '15px 20px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    display: 'block',
                    textAlign: 'center',
                    marginTop: '20px',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  Proceder al Checkout con MercadoPago
                </Link>
                
                <Link 
                  to="/catalogo" 
                  className="btn-seguir-comprando"
                  style={{
                    background: '#3B82F6',
                    color: 'white',
                    padding: '10px 15px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    display: 'block',
                    textAlign: 'center',
                    marginTop: '10px',
                    fontSize: '14px'
                  }}
                >
                  Seguir Comprando
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    
  

      <style jsx>{`
        .carrito-page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .carrito-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #E5E7EB;
        }
        
        .carrito-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
        }
        
        .carrito-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .carrito-item-detalle {
          display: grid;
          grid-template-columns: 100px 1fr auto auto auto;
          gap: 20px;
          align-items: center;
          padding: 20px;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          margin-bottom: 15px;
          background: white;
        }
        
        .item-imagen img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 6px;
        }
        
        .item-info-detalle h4 {
          margin: 0 0 8px 0;
          color: #1F2937;
        }
        
        .item-info-detalle p {
          margin: 4px 0;
          font-size: 0.9em;
          color: #6B7280;
        }
        
        .cantidad-buttons {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .cantidad-buttons button {
          width: 30px;
          height: 30px;
          border: 1px solid #D1D5DB;
          background: #F9FAFB;
          cursor: pointer;
          border-radius: 4px;
        }
        
        .cantidad-buttons button:hover {
          background: #E5E7EB;
        }
        
        .cantidad-buttons button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .cantidad-display {
          font-weight: bold;
          min-width: 30px;
          text-align: center;
        }
        
        .resumen-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          border: 1px solid #E5E7EB;
          height: fit-content;
        }
        
        .resumen-linea {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          color: #4B5563;
        }
        
        .resumen-total {
          font-size: 1.2em;
          color: #1F2937;
        }
        
        .resumen-total span {
          display: flex;
          justify-content: space-between;
        }
        
        @media (max-width: 768px) {
          .carrito-content {
            grid-template-columns: 1fr;
          }
          
          .carrito-item-detalle {
            grid-template-columns: 80px 1fr;
            gap: 15px;
          }
          
          .item-cantidad-control,
          .item-precio-total,
          .btn-eliminar-item {
            grid-column: 1 / -1;
            margin-top: 10px;
          }
        }
      `}</style>
    </div>
  );
}


