import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api.js";
import "../../styles/usuario.css";

export default function Categories() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: ''
    });

    const fetchCategories = async () => {
        try {
            setLoading(true);

            const staticCategories = [
                { id: 1, nombre: 'Filtros', descripcion: 'Filtros de aceite, aire y combustible', productos: 8 },
                { id: 2, nombre: 'Frenos', descripcion: 'Pastillas, discos y líquidos de freno', productos: 6 },
                { id: 3, nombre: 'Aceites', descripcion: 'Aceites de motor y transmisión', productos: 5 },
                { id: 4, nombre: 'Sistema Eléctrico', descripcion: 'Baterías, alternadores y componentes', productos: 7 },
                { id: 5, nombre: 'Suspensión', descripcion: 'Amortiguadores y componentes de suspensión', productos: 4 },
                { id: 6, nombre: 'Transmisión', descripcion: 'Embragues y componentes de transmisión', productos: 10 }
            ];
            setCategories(staticCategories);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {

            } else {

            }
            
            setShowForm(false);
            setEditingCategory(null);
            setFormData({ nombre: '', descripcion: '' });
            fetchCategories();
        } catch (error) {
        }
    };

    const deleteCategory = async (id) => {
        if (!confirm("¿Estás seguro de que quieres eliminar esta categoría?")) {
            return;
        }
        
        try {
            fetchCategories();
        } catch (error) {
        }
    };

    const editCategory = (category) => {
        setEditingCategory(category);
        setFormData({
            nombre: category.nombre,
            descripcion: category.descripcion
        });
        setShowForm(true);
    };

    if (loading) {
        return (
            <div className="admin-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando categorías...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>🏷️ Gestión de Categorías</h1>
                <div className="header-buttons">
                    <button 
                        className="btn-primary"
                        onClick={() => {
                            setEditingCategory(null);
                            setFormData({ nombre: '', descripcion: '' });
                            setShowForm(!showForm);
                        }}
                    >
                        {showForm ? '❌ Cancelar' : '➕ Nueva Categoría'}
                    </button>
                    <button 
                        className="btn-secondary"
                        onClick={() => navigate('/admin/dashboard')}
                    >
                        ← Volver al Dashboard
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="form-container">
                    <form onSubmit={handleSubmit} className="category-form">
                        <h3>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
                        
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre de la Categoría *</label>
                            <input
                                type="text"
                                id="nombre"
                                value={formData.nombre}
                                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                required
                                placeholder="Ej: Filtros"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="descripcion">Descripción</label>
                            <textarea
                                id="descripcion"
                                value={formData.descripcion}
                                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                                rows="3"
                                placeholder="Descripción de la categoría..."
                            />
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn-primary">
                                {editingCategory ? 'Actualizar' : 'Crear'} Categoría
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Productos</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(category => (
                            <tr key={category.id} className="product-row">
                                <td>#{category.id}</td>
                                <td className="name-cell">
                                    <div className="product-name">{category.nombre}</div>
                                </td>
                                <td className="description-cell">
                                    {category.descripcion}
                                </td>
                                <td>
                                    <span className="product-count">{category.productos} productos</span>
                                </td>
                                <td className="actions-cell">
                                    <div className="action-buttons">
                                        <button 
                                            className="btn-action edit"
                                            onClick={() => editCategory(category)}
                                            title="Editar categoría"
                                        >
                                            ✏️
                                        </button>
                                        <button 
                                            className="btn-action delete"
                                            onClick={() => deleteCategory(category.id)}
                                            title="Eliminar categoría"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="admin-stats-footer">
                <div className="stat-card">
                    <span className="stat-number">{categories.length}</span>
                    <span className="stat-label">Total categorías</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">
                        {categories.reduce((sum, cat) => sum + cat.productos, 0)}
                    </span>
                    <span className="stat-label">Total productos</span>
                </div>
            </div>
        </div>
    );
}
