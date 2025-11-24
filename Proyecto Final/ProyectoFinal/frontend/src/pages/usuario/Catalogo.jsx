import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/catalogo-new.css';
import UserNavbar from '../../components/UserNavbar.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const API_KEY = import.meta.env.VITE_API_KEY || 'mi_api_key_super_secreta';

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtros, setFiltros] = useState({
    categoria: '',
    marca: '',
    precioMin: '',
    precioMax: '',
    busqueda: ''
  });
  const [carrito, setCarrito] = useState([]);
  const [ordenar, setOrdenar] = useState('nombre');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    const categoryQuery = searchParams.get('categoria');
    const brandQuery = searchParams.get('marca');
    
    if (searchQuery || categoryQuery || brandQuery) {
      setFiltros(prev => ({
        ...prev,
        busqueda: searchQuery || '',
        categoria: categoryQuery || '',
        marca: brandQuery || ''
      }));
    }
  }, [location]);

  useEffect(() => {
    fetchProductos();
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    }
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch(`${API_URL}/products?limit=100`, {
        headers: {
          'x-api-key': API_KEY
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar productos');
      }
      
      const data = await response.json();

      const productosFormateados = data.data.map(producto => ({
        id: producto.id,
        name: producto.nombre,
        brand: producto.Brand?.nombre || 'Sin marca',
        price: producto.precio,
        stock: producto.stock,
        category: producto.Category?.nombre || 'Sin categoría',
        image: producto.imagen_url || 'https://via.placeholder.com/200x150/9ca3af?text=Sin+Imagen',
        description: producto.descripcion || 'Sin descripción'
      }));
      
      setProductos(productosFormateados);

      const categoriasUnicas = [...new Set(productosFormateados.map(p => p.category))];
      setCategorias(categoriasUnicas);
      
    } catch (error) {
      setProductos([]);
      setCategorias([]);
    }
  };

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
  };

  const eliminarDelCarrito = (productoId) => {
    const nuevoCarrito = carrito.filter(item => item.id !== productoId);
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
  };

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
  };

  const productosFiltrados = productos
    .filter(producto => {
      const searchTerm = filtros.busqueda.toLowerCase();
      const cumpleBusqueda = !filtros.busqueda || 
        producto.name.toLowerCase().includes(searchTerm) ||
        producto.brand.toLowerCase().includes(searchTerm) ||
        producto.category.toLowerCase().includes(searchTerm) ||
        (producto.description && producto.description.toLowerCase().includes(searchTerm));
      
      const cumpleCategoria = !filtros.categoria || producto.category === filtros.categoria;
      const cumpleMarca = !filtros.marca || producto.brand === filtros.marca;
      const cumplePrecioMin = !filtros.precioMin || producto.price >= parseFloat(filtros.precioMin);
      const cumplePrecioMax = !filtros.precioMax || producto.price <= parseFloat(filtros.precioMax);

      return cumpleBusqueda && cumpleCategoria && cumpleMarca && cumplePrecioMin && cumplePrecioMax;
    })
    .sort((a, b) => {
      switch (ordenar) {
        case 'precio-asc':
          return a.price - b.price;
        case 'precio-desc':
          return b.price - a.price;
        case 'stock':
          return b.stock - a.stock;
        case 'relevancia':
          if (filtros.busqueda) {
            const searchTerm = filtros.busqueda.toLowerCase();
            const aRelevance = (
              (a.name.toLowerCase().includes(searchTerm) ? 10 : 0) +
              (a.brand.toLowerCase().includes(searchTerm) ? 5 : 0) +
              (a.category.toLowerCase().includes(searchTerm) ? 3 : 0)
            );
            const bRelevance = (
              (b.name.toLowerCase().includes(searchTerm) ? 10 : 0) +
              (b.brand.toLowerCase().includes(searchTerm) ? 5 : 0) +
              (b.category.toLowerCase().includes(searchTerm) ? 3 : 0)
            );
            return bRelevance - aRelevance;
          }
          return a.name.localeCompare(b.name);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const totalCarrito = carrito.reduce((total, item) => total + (item.price * item.cantidad), 0);
  const cantidadItems = carrito.reduce((total, item) => total + item.cantidad, 0);

  return (
    <div className="catalogo-container">
      <UserNavbar />
      
      <div className="catalogo-content">

        {/* Buscador */}
        <div className="search-section">
          <input
            type="text"
            placeholder="🔍 Buscar repuestos, marcas, modelos..."
            value={filtros.busqueda}
            onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
            className="search-input"
          />
          <button className="search-button">
            🔍 Buscar
          </button>
        </div>

        <div className="main-layout">

          {/* FILTROS */}
          <aside className="filtros-sidebar">
            <div className="filtros-header">
              <h3>🔎 Filtros</h3>
              <button 
                className="limpiar-filtros"
                onClick={() => setFiltros({categoria: '', marca: '', precioMin: '', precioMax: '', busqueda: ''})}
              >
                🧹 Limpiar
              </button>
            </div>
            
            <div className="filtro-grupo">
              <label>Categoría</label>
              <select 
                value={filtros.categoria} 
                onChange={(e) => setFiltros({...filtros, categoria: e.target.value})}
              >
                <option value="">Todas las categorías</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="filtro-grupo">
              <label>Marca</label>
              <select 
                value={filtros.marca} 
                onChange={(e) => setFiltros({...filtros, marca: e.target.value})}
              >
                <option value="">Todas las marcas</option>
                {[...new Set(productos.map(p => p.brand))].map(marca => (
                  <option key={marca} value={marca}>{marca}</option>
                ))}
              </select>
            </div>

            <div className="filtro-grupo">
              <label>Precio</label>
              <div className="precio-inputs">
                <input
                  type="number"
                  placeholder="Mín"
                  value={filtros.precioMin}
                  onChange={(e) => setFiltros({...filtros, precioMin: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="Máx"
                  value={filtros.precioMax}
                  onChange={(e) => setFiltros({...filtros, precioMax: e.target.value})}
                />
              </div>
            </div>

            {/* CARRITO MINI */}
            {carrito.length > 0 && (
              <div className="carrito-sidebar">
                <h4>🛒 Tu Carrito ({cantidadItems})</h4>
                <div className="carrito-items">
                  {carrito.slice(0, 3).map(item => (
                    <div key={item.id} className="carrito-item">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/50x50/9ca3af?text=Error';
                        }}
                      />
                      <div className="item-info">
                        <p>{item.name.substring(0, 25)}...</p>
                        <div className="item-controls">
                          <button onClick={() => modificarCantidad(item.id, item.cantidad - 1)}>-</button>
                          <span>{item.cantidad}</span>
                          <button onClick={() => modificarCantidad(item.id, item.cantidad + 1)}>+</button>
                        </div>
                        <p className="item-precio">${(item.price * item.cantidad).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  {carrito.length > 3 && (
                    <p className="mas-items">+{carrito.length - 3} productos más</p>
                  )}
                </div>
                <div className="carrito-total">
                  <strong>Total: ${totalCarrito.toFixed(2)}</strong>
                </div>
                <Link to="/usuario/carrito" className="btn-ver-carrito">
                  🛒 Ver Carrito Completo
                </Link>
              </div>
            )}
          </aside>

          {/* LISTA DE PRODUCTOS */}
          <main className="productos-main">
            <div className="productos-header">
              <div className="header-info">
                <h2>📦 Catálogo de Repuestos</h2>
                <span className="productos-count">({productosFiltrados.length} productos)</span>
              </div>
              <div className="ordenar">
                <label>Ordenar por:</label>
                <select value={ordenar} onChange={(e) => setOrdenar(e.target.value)}>
                  {filtros.busqueda && <option value="relevancia">Relevancia</option>}
                  <option value="nombre">Nombre A-Z</option>
                  <option value="precio-asc">Precio: Menor a Mayor</option>
                  <option value="precio-desc">Precio: Mayor a Menor</option>
                  <option value="stock">Stock Disponible</option>
                </select>
              </div>
            </div>

            <div className="productos-grid">
              {productosFiltrados.map(producto => (
                <div key={producto.id} className="producto-card">
                  <div 
                    className="producto-imagen"
                    onClick={() => navigate(`/producto/${producto.id}`)}
                  >
                    <img 
                      src={producto.image} 
                      alt={producto.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200x150/9ca3af?text=Error';
                      }}
                    />
                    {producto.stock < 50 && (
                      <span className="stock-bajo">¡Pocas unidades!</span>
                    )}
                  </div>
                  <div className="producto-info">
                    <span className="producto-categoria">{producto.category}</span>
                    <h3 
                      onClick={() => navigate(`/producto/${producto.id}`)}
                      className="producto-nombre"
                    >
                      {producto.name}
                    </h3>
                    <p className="producto-marca">🏭 {producto.brand}</p>
                    <p className="producto-descripcion">{producto.description}</p>
                    <div className="producto-footer">
                      <div className="precio-stock">
                        <span className="precio">${producto.price.toLocaleString()}</span>
                        <span className="stock">Stock: {producto.stock}</span>
                      </div>
                      <button 
                        className="btn-agregar"
                        onClick={() => agregarAlCarrito(producto)}
                        disabled={producto.stock === 0}
                      >
                        {producto.stock === 0 ? '❌ Agotado' : '🛒 Agregar'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {productosFiltrados.length === 0 && (
              <div className="no-productos">
                <div className="no-productos-icon">😢</div>
                <h3>No se encontraron productos</h3>
                <p>Intenta modificar los filtros de búsqueda</p>
                <button 
                  className="reset-filtros"
                  onClick={() => setFiltros({categoria: '', marca: '', precioMin: '', precioMax: '', busqueda: ''})}
                >
                  🔄 Reiniciar filtros
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
