import { useNavigate } from "react-router-dom";
import "../../styles/usuario.css";

export default function Orders() {
    const navigate = useNavigate();

    const pedidos = [
        {
            id: 1,
            fecha: '2024-10-15',
            cliente: 'Juan Pérez',
            total: 45000.00,
            estado: 'Entregado',
            productos: 3
        },
        {
            id: 2,
            fecha: '2024-10-20',
            cliente: 'María García',
            total: 28000.00,
            estado: 'En proceso',
            productos: 1
        },
        {
            id: 3,
            fecha: '2024-10-25',
            cliente: 'Carlos López',
            total: 12500.00,
            estado: 'Pendiente',
            productos: 2
        }
    ];

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(price);
    };

    const getEstadoColor = (estado) => {
        switch(estado) {
            case 'Entregado': return 'success';
            case 'En proceso': return 'warning';
            case 'Pendiente': return 'danger';
            default: return 'secondary';
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>🛒 Gestión de Pedidos</h1>
                <button 
                    className="btn-secondary"
                    onClick={() => navigate('/admin/dashboard')}
                >
                    ← Volver al Dashboard
                </button>
            </div>

            <div className="admin-controls">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="🔍 Buscar pedidos por cliente o ID..."
                        className="search-input"
                    />
                </div>
                
                <div className="filter-container">
                    <select className="filter-select">
                        <option value="">Todos los estados</option>
                        <option value="pendiente">Pendientes</option>
                        <option value="proceso">En proceso</option>
                        <option value="entregado">Entregados</option>
                    </select>
                </div>
                
                <div className="results-count">
                    {pedidos.length} pedidos encontrados
                </div>
            </div>

            <div className="table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Productos</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.map(pedido => (
                            <tr key={pedido.id} className="product-row">
                                <td>#{pedido.id}</td>
                                <td>{new Date(pedido.fecha).toLocaleDateString('es-AR')}</td>
                                <td className="name-cell">
                                    <div className="product-name">{pedido.cliente}</div>
                                </td>
                                <td>{pedido.productos} items</td>
                                <td className="price-cell">
                                    <div className="price">{formatPrice(pedido.total)}</div>
                                </td>
                                <td className="status-cell">
                                    <span className={`status-badge ${getEstadoColor(pedido.estado)}`}>
                                        {pedido.estado}
                                    </span>
                                </td>
                                <td className="actions-cell">
                                    <div className="action-buttons">
                                        <button 
                                            className="btn-action edit"
                                            title="Ver detalles"
                                        >
                                            👁️
                                        </button>
                                        <button 
                                            className="btn-action edit"
                                            title="Editar pedido"
                                        >
                                            ✏️
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
                    <span className="stat-number">{pedidos.length}</span>
                    <span className="stat-label">Total pedidos</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">
                        {pedidos.filter(p => p.estado === 'Pendiente').length}
                    </span>
                    <span className="stat-label">Pendientes</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">
                        {pedidos.filter(p => p.estado === 'En proceso').length}
                    </span>
                    <span className="stat-label">En proceso</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">
                        {pedidos.filter(p => p.estado === 'Entregado').length}
                    </span>
                    <span className="stat-label">Entregados</span>
                </div>
            </div>
        </div>
    );
}
