import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api.js";
import "../../styles/usuario.css";
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=600&q=80';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
       const [filterCategory, setFilterCategory] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const navigate = useNavigate();

    const categories = [
        { id: 1, name: 'Filtros' },
        { id: 2, name: 'Frenos' },
        { id: 3, name: 'Aceites' },
        { id: 4, name: 'Sistema Eléctrico' },
        { id: 5, name: 'Suspensión' },
        { id: 6, name: 'Transmisión' }
    ];

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get("/products");

            const productData = response.data.data || response.data || [];
            setProducts(Array.isArray(productData) ? productData : []);
        } catch (error) {
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const deleteProduct = async (id) => {
        if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) {
            return;
        }
        
        try {
            await api.delete(`/products/${id}`);
            fetchProducts();
        } catch (error) {
            alert("Error al eliminar el producto");
        }
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Sin categoría';
    };

    const getFilteredProducts = () => {
        let filtered = [...products];

        if (searchTerm) {
            filtered = filtered.filter(product =>
                (product.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.sku || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.Brand?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterCategory) {
            filtered = filtered.filter(product => 
                product.category_id === parseInt(filterCategory)
            );
        }

        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return (a.nombre || '').localeCompare(b.nombre || '');
                case 'price':
                    return (a.precio || 0) - (b.precio || 0);
                case 'stock':
                    return (a.stock || 0) - (b.stock || 0);
                default:
                    return 0;
            }
        });

        return filtered;
    };

    const filteredProducts = getFilteredProducts();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(price);
    };

    if (loading) {
        return (
            <div className="admin-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando productos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>📦 Gestión de Productos</h1>
                <button 
                    className="btn-primary"
                    onClick={() => navigate('/admin/products/new')}
                >
                    ➕ Nuevo Producto
                </button>
            </div>

            <div className="admin-controls">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="🔍 Buscar productos por nombre, SKU o marca..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                
                <div className="filter-container">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Todas las categorías</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                    >
                        <option value="name">Ordenar por nombre</option>
                        <option value="price">Ordenar por precio</option>
                        <option value="stock">Ordenar por stock</option>
                    </select>
                </div>
                
                <div className="results-count">
                    {filteredProducts.length} de {products.length} productos
                </div>
            </div>

            <div className="table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="no-data">
                                    📦 No se encontraron productos
                                    {searchTerm && (
                                        <div>
                                            <button 
                                                className="btn-link"
                                                onClick={() => setSearchTerm('')}
                                            >
                                                Limpiar búsqueda
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ) : (
                            filteredProducts.map(product => (
                                <tr key={product.id} className="product-row">
                                    <td className="image-cell">
                                        <img 
                                            src={product.imagen_url || DEFAULT_IMAGE}
                                            alt={product.nombre}
                                            className="product-image"
                                            onError={(e) => {
                                                e.target.src = DEFAULT_IMAGE;
                                            }}
                                        />
                                    </td>
                                    <td className="name-cell">
                                        <div className="product-name">{product.nombre}</div>
                                        <div className="product-description">
                                            {product.descripcion && product.descripcion.length > 50 
                                                ? product.descripcion.substring(0, 50) + '...' 
                                                : product.descripcion}
                                        </div>
                                    </td>
                                    <td>{product.Category?.nombre || getCategoryName(product.category_id)}</td>
                                    <td className="price-cell">
                                        <div className="price">{formatPrice(product.precio)}</div>
                                    </td>
                                    <td className="stock-cell">
                                        <span className={`stock-badge ${
                                            product.stock < 10 ? 'low' : 
                                            product.stock < 25 ? 'medium' : 'high'
                                        }`}>
                                            {product.stock} unid.
                                        </span>
                                    </td>
                                    <td className="status-cell">
                                        <span className={`status-badge ${product.stock > 0 ? 'active' : 'inactive'}`}>
                                            {product.stock > 0 ? '✅ Disponible' : '❌ Agotado'}
                                        </span>
                                    </td>
                                    <td className="actions-cell">
                                        <div className="action-buttons">
                                            <button 
                                                className="btn-action edit"
                                                onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                                                title="Editar producto"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                className="btn-action delete"
                                                onClick={() => deleteProduct(product.id)}
                                                title="Eliminar producto"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="admin-stats-footer">
                <div className="stat-card">
                    <span className="stat-number">{products.length}</span>
                    <span className="stat-label">Total productos</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">
                        {products.filter(p => p.stock < 10).length}
                    </span>
                    <span className="stat-label">Stock bajo</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">
                        {products.filter(p => p.stock === 0).length}
                    </span>
                    <span className="stat-label">Agotados</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">
                        {products.filter(p => p.destacado || p.featured).length}
                    </span>
                    <span className="stat-label">Destacados</span>
                </div>
            </div>
        </div>
    );
}
