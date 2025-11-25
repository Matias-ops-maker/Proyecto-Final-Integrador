import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserNavbar from '../../components/UserNavbar.jsx';
import '../../styles/catalogo.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const API_KEY = import.meta.env.VITE_API_KEY || 'mi_api_key_super_secreta';

export default function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    }
  }, []);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}/products/${id}`, {
          headers: {
            'X-API-Key': 'mi_api_key_super_secreta'
          }
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError('Producto no encontrado');
            return;
          }
          throw new Error('Error al cargar el producto');
        }

        const data = await response.json();
        setProducto(data);
      } catch (err) {
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  const agregarAlCarrito = () => {
    if (!producto) return;

    const productoExistente = carrito.find(item => item.id === producto.id);
    let nuevoCarrito;

    if (productoExistente) {
      nuevoCarrito = carrito.map(item =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item
      );
    } else {
      nuevoCarrito = [...carrito, { ...producto, cantidad }];
    }

    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));

    window.dispatchEvent(new Event('storage'));

    alert(`${cantidad} ${producto.nombre} agregado(s) al carrito!`);
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(precio);
  };

  if (loading) {
    return (
      <div className="page">
        <UserNavbar />
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Cargando producto...</h2>
        </div>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="page">
        <UserNavbar />
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>{error || 'Producto no encontrado'}</h2>
          <button onClick={() => navigate('/catalogo')} className="btn-primary">
            Volver al Catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <UserNavbar />

      <div className="producto-detalle-container">
        <button
          onClick={() => navigate(-1)}
          className="btn-volver"
          style={{
            background: '#6B7280',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            marginBottom: '20px'
          }}
        >
          ← Volver
        </button>

        <div className="producto-detalle-content">
          <div className="producto-imagen-detalle">
            <img
              src={producto.imagen_url || 'https://via.placeholder.com/400x300/9ca3af?text=Sin+Imagen'}
              alt={producto.nombre}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300/9ca3af?text=Error+Imagen';
              }}
              style={{
                maxWidth: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
            {producto.stock < 50 && (
              <div className="stock-warning">¡Pocas unidades disponibles!</div>
            )}
          </div>

          <div className="producto-info-detalle">
            <div className="producto-header">
              <span className="producto-categoria">{producto.Category?.nombre || 'Sin categoría'}</span>
              <h1>{producto.nombre}</h1>
              <p className="producto-marca">{producto.Brand?.nombre || 'Sin marca'}</p>
            </div>

            <div className="producto-precio-seccion">
              <div className="precio-principal">
                {formatearPrecio(producto.precio)}
              </div>
              <div className="stock-info">
                <span className={`stock-badge ${producto.stock > 100 ? 'high' : producto.stock > 50 ? 'medium' : 'low'}`}>
                  Stock: {producto.stock} unidades
                </span>
              </div>
            </div>

            <div className="producto-descripcion">
              <h3>Descripción</h3>
              <p>{producto.descripcion}</p>
            </div>

            {Array.isArray(producto.especificaciones) && producto.especificaciones.length > 0 && (
              <div className="producto-especificaciones">
                <h3>Especificaciones</h3>
                <ul>
                  {producto.especificaciones.map((spec, index) => (
                    <li key={index}>{spec}</li>
                  ))}
                </ul>
              </div>
            )}

            {producto.garantia ? (
              <div className="producto-garantia">
                <h3>Garantía</h3>
                <p>{producto.garantia}</p>
              </div>
            ) : null}

            <div className="producto-compra">
              <div className="cantidad-selector">
                <label>Cantidad:</label>
                <div className="cantidad-controls">
                  <button
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    disabled={cantidad <= 1}
                  >
                    -
                  </button>
                  <span>{cantidad}</span>
                  <button
                    onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                    disabled={cantidad >= producto.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="total-precio">
                <strong>Total: {formatearPrecio(producto.precio * cantidad)}</strong>
              </div>

              <button
                onClick={agregarAlCarrito}
                className="btn-agregar-carrito"
                disabled={producto.stock === 0}
                style={{
                  background: producto.stock === 0 ? '#9CA3AF' : '#10B981',
                  color: 'white',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '8px',
                  cursor: producto.stock === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  width: '100%',
                  marginTop: '20px'
                }}
              >
                {producto.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .producto-detalle-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .producto-detalle-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .producto-imagen-detalle {
          position: relative;
          width: 100%;
          max-width: 500px;
          margin-bottom: 20px;
        }

        .producto-imagen-detalle img {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .stock-warning {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #EF4444;
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 0.9em;
        }

        .producto-categoria {
          background: #3B82F6;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8em;
          text-transform: uppercase;
        }

        .producto-info-detalle h1 {
          margin: 15px 0 10px 0;
          color: #1F2937;
        }

        .producto-marca {
          color: #6B7280;
          font-size: 1.1em;
          margin-bottom: 20px;
        }

        .precio-principal {
          font-size: 2em;
          color: #10B981;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .stock-badge {
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.9em;
        }

        .stock-badge.high {
          background: #D1FAE5;
          color: #065F46;
        }

        .stock-badge.medium {
          background: #FEF3C7;
          color: #92400E;
        }

        .stock-badge.low {
          background: #FEE2E2;
          color: #991B1B;
        }

        .producto-descripcion,
        .producto-especificaciones,
        .producto-garantia {
          margin: 25px 0;
        }

        .producto-especificaciones ul {
          list-style: none;
          padding: 0;
        }

        .producto-especificaciones li {
          padding: 8px 0;
          border-bottom: 1px solid #E5E7EB;
        }

        .producto-especificaciones li:before {
          content: "✓ ";
          color: #10B981;
          font-weight: bold;
        }

        .cantidad-controls {
          display: flex;
          align-items: center;
          gap: 15px;
          margin: 10px 0;
        }

        .cantidad-controls button {
          width: 40px;
          height: 40px;
          border: 1px solid #D1D5DB;
          background: #F9FAFB;
          cursor: pointer;
          border-radius: 6px;
          font-size: 18px;
        }

        .cantidad-controls button:hover:not(:disabled) {
          background: #E5E7EB;
        }

        .cantidad-controls button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .cantidad-controls span {
          font-size: 1.2em;
          font-weight: bold;
          min-width: 30px;
          text-align: center;
        }

        .total-precio {
          font-size: 1.3em;
          color: #1F2937;
          margin: 15px 0;
        }

        @media (max-width: 768px) {
          .producto-detalle-content {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 20px;
          }

          .producto-imagen-detalle img {
            height: 250px;
          }
        }
      `}</style>
    </div>
  );
}
