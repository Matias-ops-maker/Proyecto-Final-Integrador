import "../../styles/usuario.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api.js";
import UserNavbar from "../../components/UserNavbar.jsx";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const API_KEY = import.meta.env.VITE_API_KEY || 'mi_api_key_super_secreta';

export default function HomeFinal() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}/products?limit=8`, {
          headers: {
            'x-api-key': API_KEY
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar productos');
        }

        const data = await response.json();
        const productosData = data.data || [];

        const productosFormateados = productosData.map(producto => ({
          id: producto.id,
          name: producto.nombre,
          brand: producto.Brand?.nombre || 'Sin marca',
          price: parseFloat(producto.precio),
          stock: producto.stock,
          category: producto.Category?.nombre || 'Sin categoría',
          image: producto.imagen_url || 'https://via.placeholder.com/200x150/9ca3af?text=Sin+Imagen',
        }));

        setProductos(productosFormateados);

        try {
          const resCategorias = await api.get('/categories');
          const categoriasData = Array.isArray(resCategorias.data) ? resCategorias.data : [];
          const categoriasFormatted = categoriasData.slice(0, 6).map(cat => ({
            name: cat.nombre,
            icon: getCategoryIcon(cat.nombre),
            color: getCategoryColor(cat.nombre)
          }));

          setCategorias(categoriasFormatted);
        } catch (err) {
          setCategorias([
            { name: "Filtros", icon: "🔍", color: "#10B981" },
            { name: "Frenos", icon: "🛑", color: "#EF4444" },
            { name: "Motor", icon: "🔧", color: "#3B82F6" },
            { name: "Eléctrica", icon: "⚡", color: "#8B5CF6" }
          ]);
        }

      } catch (error) {
        setError('Error cargando datos');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    }
  }, []);

  const agregarAlCarrito = (producto) => {
    const productoExistente = carrito.find(item => item.id === producto.id);
    let nuevoCarrito;

    if (productoExistente) {
      nuevoCarrito = carrito.map(item =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
    } else {
      nuevoCarrito = [...carrito, { ...producto, cantidad: 1 }];
    }

    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));

    window.dispatchEvent(new Event('storage'));

    alert(`${producto.name} agregado al carrito!`);
  };

  const getCategoryIcon = (nombre) => {
    const iconos = {
      'Motor': '🔧',
      'Filtros': '🔍',
      'Frenos': '🛑',
      'Lubricantes': '🛢️',
      'Eléctrica': '⚡',
      'Suspensión': '🏎️',
      'Transmisión': '⚙️',
      'Encendido': '🔥',
      'Neumáticos': '🛞',
      'Escape': '💨',
      'Climatización': '❄️'
    };
    return iconos[nombre] || '🔧';
  };

  const getCategoryColor = (nombre) => {
    const colores = {
      'Motor': '#3B82F6',
      'Filtros': '#10B981',
      'Frenos': '#EF4444',
      'Lubricantes': '#F59E0B',
      'Eléctrica': '#8B5CF6',
      'Suspensión': '#06B6D4',
      'Transmisión': '#84CC16',
      'Encendido': '#F97316',
      'Neumáticos': '#6B7280',
      'Escape': '#64748B',
      'Climatización': '#14B8A6'
    };
    return colores[nombre] || '#3B82F6';
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 2) {
      const suggestions = productos.filter(producto =>
        producto.name.toLowerCase().includes(term.toLowerCase()) ||
        producto.brand.toLowerCase().includes(term.toLowerCase()) ||
        producto.category.toLowerCase().includes(term.toLowerCase())
      ).slice(0, 5);

      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/catalogo?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const selectSuggestion = (producto) => {
    setSearchTerm(producto.name);
    setShowSuggestions(false);
    navigate(`/catalogo?search=${encodeURIComponent(producto.name)}`);
  };

  const handleSearchBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  if (loading) {
    return (
      <div className="page">
        <UserNavbar />
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <div className="loading-spinner"></div>
          <h2>🔧 Cargando RepuestosAuto...</h2>
          <p>Conectando con la base de datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <UserNavbar />

      <div className="hero">
        <h1 className="hero-title">🚗 Encuentra los mejores repuestos automotrices</h1>
        <p className="hero-subtitle">Todo lo que necesitas para tu auto en un solo lugar. Repuestos nuevos y usados de calidad.</p>
        <div className="hero-search-container">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="🔍 Buscar repuestos (ej: filtro aceite, pastillas freno...)"
              className="hero-search"
              value={searchTerm}
              onChange={handleSearchChange}
              onBlur={handleSearchBlur}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="search-suggestions">
                {searchSuggestions.map((producto) => (
                  <div
                    key={producto.id}
                    className="suggestion-item"
                    onClick={() => selectSuggestion(producto)}
                  >
                    <span className="suggestion-name">{producto.name}</span>
                    <span className="suggestion-brand">{producto.brand}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="hero-search-btn" onClick={handleSearch}>Buscar</button>
        </div>
      </div>

      <section className="section">
        <h2 className="section-title">🧩 Categorías populares</h2>
        <div className="grid grid-cols-4 gap-4">
          {categorias.map((cat) => (
            <Link key={cat.name} to={`/catalogo?categoria=${cat.name}`} className="category-card">
              <div className="category-icon" style={{ backgroundColor: cat.color }}>
                <span className="icon">{cat.icon}</span>
              </div>
              <h3>{cat.name}</h3>
              <p>Ver productos</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">⭐ Productos destacados</h2>
        <div className="grid grid-cols-4 gap-4">
          {productos.map((producto) => (
            <div key={producto.id} className="product-card">
              <div
                className="product-image"
                onClick={() => navigate(`/producto/${producto.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={producto.image}
                  alt={producto.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x150/9ca3af?text=Error';
                  }}
                />
                {producto.stock < 100 && (
                  <span className="stock-badge">¡Últimas unidades!</span>
                )}
              </div>
              <div className="product-info">
                <h3
                  className="product-name"
                  onClick={() => navigate(`/producto/${producto.id}`)}
                  style={{ cursor: 'pointer', color: '#3B82F6' }}
                >
                  {producto.name}
                </h3>
                <p className="product-brand">{producto.brand}</p>
                <div className="product-footer">
                  <span className="product-price">${producto.price}</span>
                  <button
                    className="add-cart-btn"
                    onClick={() => agregarAlCarrito(producto)}
                  >
                    🛒 Agregar
                  </button>
                </div>
                <p className="product-stock">Stock: {producto.stock} unidades</p>
              </div>
            </div>
          ))}
        </div>
        <div className="view-more">
          <Link to="/catalogo" className="btn-primary">Ver todos los productos →</Link>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">🏁 Marcas que trabajamos</h2>
        <div className="brands-grid">
          {["Bosch", "Brembo", "Mobil", "Castrol", "NGK", "Monroe", "Sachs", "Mahle"].map((marca) => (
            <Link
              key={marca}
              to={`/catalogo?marca=${marca}`}
              className="brand-card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="brand-logo">{marca}</div>
            </Link>
          ))}
        </div>
      </section>

      <div style={{
        padding: '20px',
        backgroundColor: error ? '#fee2e2' : '#dcfce7',
        margin: '20px',
        borderRadius: '10px',
        borderLeft: `4px solid ${error ? '#ef4444' : '#10b981'}`
      }}>
        <h3>🧰 Estado del Sistema</h3>
        {error ? (
          <div>
            <p>❌ Error: {error}</p>
            <p>🔧 Usando datos de fallback</p>
          </div>
        ) : (
          <div>
            <p>✅ API funcionando correctamente</p>
            <p>✅ {productos.length} productos cargados</p>
            <p>✅ {categorias.length} categorías cargadas</p>
            <p>✅ Navegación operativa</p>
          </div>
        )}
      </div>
    </div>
  );
}
