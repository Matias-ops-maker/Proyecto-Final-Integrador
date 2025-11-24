import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api.js";
import "../../styles/usuario.css";

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('perfil');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    confirmEmail: '',
    currentPassword: ''
  });
  const [editForm, setEditForm] = useState({
    nombre: '',
    telefono: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth/login');
      return;
    }

    cargarDatos();
  }, [navigate]);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setEditForm({
          nombre: parsedUser.nombre || '',
          telefono: parsedUser.telefono || ''
        });
      }

      try {
        const response = await api.get('/orders');
        if (response.data && response.data.orders) {

          const ordersFormatted = response.data.orders.map(order => ({
            id: order.id,
            fecha: new Date(order.creado_en).toLocaleDateString('es-AR'),
            total: parseFloat(order.total) * 100,
            estado: order.estado === 'pendiente' ? 'Pendiente' :
                   order.estado === 'procesando' ? 'En proceso' :
                   order.estado === 'enviado' ? 'En proceso' :
                   order.estado === 'entregado' ? 'Entregado' :
                   order.estado === 'cancelado' ? 'Cancelado' : 'Pendiente',
            productos: order.OrderItems ? order.OrderItems.map(item => ({
              nombre: item.Product?.nombre || 'Producto',
              cantidad: item.cantidad,
              precio: parseFloat(item.precio_unitario)
            })) : []
          }));
          setPedidos(ordersFormatted);
        } else {
          setPedidos([]);
        }
      } catch {
        const pedidosSimulados = [
          {
            id: 1,
            fecha: '2024-10-15',
            total: 45000.00,
            estado: 'Entregado',
            productos: [
              { nombre: 'Filtro de Aceite', cantidad: 2, precio: 8500.00 },
              { nombre: 'Aceite Motor 5W-30', cantidad: 1, precio: 18000.00 }
            ]
          },
          {
            id: 2,
            fecha: '2024-10-20',
            total: 28000.00,
            estado: 'En proceso',
            productos: [
              { nombre: 'Pastillas de Freno', cantidad: 1, precio: 28000.00 }
            ]
          },
          {
            id: 3,
            fecha: '2024-10-25',
            total: 35000.00,
            estado: 'Pendiente',
            productos: [
              { nombre: 'Amortiguador Monroe', cantidad: 1, precio: 35000.00 }
            ]
          }
        ];
        setPedidos(pedidosSimulados);
      }
      
    } catch (error) {
      } finally {
      setLoading(false);
    }
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(precio);
  };

  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage('Las contraseñas no coinciden', 'error');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showMessage('La nueva contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      showMessage('Contraseña actualizada exitosamente', 'success');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowChangePassword(false);
    } catch (error) {
      showMessage(
        error.response?.data?.error || 'Error al cambiar la contraseña',
        'error'
      );
    }
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    
    if (emailForm.newEmail !== emailForm.confirmEmail) {
      showMessage('Los emails no coinciden', 'error');
      return;
    }

    if (!emailForm.newEmail.includes('@')) {
      showMessage('Por favor ingresa un email válido', 'error');
      return;
    }

    try {
      await api.put('/auth/profile', {
        email: emailForm.newEmail
      });

      const updatedUser = { ...user, email: emailForm.newEmail };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      showMessage('Email actualizado exitosamente', 'success');
      setEmailForm({ newEmail: '', confirmEmail: '', currentPassword: '' });
      setShowChangeEmail(false);
    } catch (error) {
      showMessage(
        error.response?.data?.error || 'Error al cambiar el email',
        'error'
      );
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    
    if (!editForm.nombre.trim()) {
      showMessage('El nombre es requerido', 'error');
      return;
    }

    try {
      await api.put('/auth/profile', {
        nombre: editForm.nombre,
        telefono: editForm.telefono
      });

      const updatedUser = { ...user, nombre: editForm.nombre, telefono: editForm.telefono };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      showMessage('Perfil actualizado exitosamente', 'success');
      setShowEditProfile(false);
    } catch (error) {
      showMessage(
        error.response?.data?.error || 'Error al actualizar el perfil',
        'error'
      );
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.'
    );
    
    if (!confirmDelete) return;

    const password = prompt('Por favor, ingresa tu contraseña para confirmar:');
    if (!password) return;

    try {
      await api.delete('/auth/account', {
        data: { password }
      });

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('carrito');

      showMessage('Cuenta eliminada exitosamente', 'success');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      showMessage(
        error.response?.data?.error || 'Error al eliminar la cuenta',
        'error'
      );
    }
  };

  const getEstadoColor = (estado) => {
    const colores = {
      'Entregado': '#10B981',
      'En proceso': '#F59E0B', 
      'Pendiente': '#EF4444',
      'Cancelado': '#6B7280'
    };
    return colores[estado] || '#6B7280';
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page">
        <div className="error-container">
          <p>Error: No se pudo cargar la información del usuario.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="perfil-container">
        <div className="perfil-header">
          <button 
            className="btn-volver"
            onClick={() => navigate('/')}
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              background: '#3B82F6',
              color: 'white',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            ← Volver al Inicio
          </button>
          <div className="perfil-avatar">
            <span className="avatar-icon">👤</span>
          </div>
          <div className="perfil-info">
            <h1>Mi Perfil</h1>
            <p className="perfil-email">{user.email}</p>
            <span className={`perfil-role ${user.rol}`}>
              {user.rol === 'admin' ? '🔐 Administrador' : '👤 Usuario'}
            </span>
          </div>
        </div>

        <div className="perfil-tabs">
          <button 
            className={`tab-button ${activeTab === 'perfil' ? 'active' : ''}`}
            onClick={() => setActiveTab('perfil')}
          >
            📋 Información Personal
          </button>
          <button 
            className={`tab-button ${activeTab === 'pedidos' ? 'active' : ''}`}
            onClick={() => setActiveTab('pedidos')}
          >
            🛒 Mis Pedidos ({pedidos.length})
          </button>
          {user.rol === 'admin' && (
            <button 
              className={`tab-button ${activeTab === 'administracion' ? 'active' : ''}`}
              onClick={() => setActiveTab('administracion')}
            >
              🔐 Panel de Administración
            </button>
          )}
          <button 
            className={`tab-button ${activeTab === 'configuracion' ? 'active' : ''}`}
            onClick={() => setActiveTab('configuracion')}
          >
            ⚙️ Configuración
          </button>
        </div>

        <div className="perfil-content">
          {activeTab === 'perfil' && (
            <div className="tab-content">
              <div className="perfil-card">
                <h3>📝 Información Personal</h3>
                <div className="perfil-data">
                  <div className="data-item">
                    <span className="data-label">Nombre:</span>
                    <span className="data-value">{user.nombre}</span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Email:</span>
                    <span className="data-value">{user.email}</span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Teléfono:</span>
                    <span className="data-value">{user.telefono || 'No especificado'}</span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Rol:</span>
                    <span className="data-value">{user.rol}</span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Miembro desde:</span>
                    <span className="data-value">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-AR') : 'No disponible'}
                    </span>
                  </div>
                </div>
                <button 
                  className="btn-edit-profile"
                  onClick={() => setShowEditProfile(!showEditProfile)}
                >
                  ✏️ Editar Perfil
                </button>
                
                {showEditProfile && (
                  <div className="config-form" style={{ marginTop: '20px' }}>
                    <form onSubmit={handleEditProfile}>
                      <div className="form-group">
                        <label>Nombre:</label>
                        <input
                          type="text"
                          value={editForm.nombre}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            nombre: e.target.value
                          })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Teléfono:</label>
                        <input
                          type="tel"
                          value={editForm.telefono}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            telefono: e.target.value
                          })}
                          placeholder="Ej: +54 11 1234-5678"
                        />
                      </div>
                      <div className="form-buttons">
                        <button type="submit" className="save-btn">Guardar</button>
                        <button 
                          type="button" 
                          className="cancel-btn"
                          onClick={() => {
                            setShowEditProfile(false);
                            setEditForm({ nombre: user.nombre || '', telefono: user.telefono || '' });
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'pedidos' && (
            <div className="tab-content">
              <div className="pedidos-container">
                <h3>🛒 Historial de Pedidos</h3>
                {pedidos.length === 0 ? (
                  <div className="no-pedidos">
                    <p>📦 No tienes pedidos aún.</p>
                    <button 
                      className="btn-primary"
                      onClick={() => navigate('/catalogo')}
                    >
                      Ir al Catálogo
                    </button>
                  </div>
                ) : (
                  <div className="pedidos-list">
                    {pedidos.map(pedido => (
                      <div key={pedido.id} className="pedido-card">
                        <div className="pedido-header">
                          <div className="pedido-info">
                            <h4>Pedido #{pedido.id}</h4>
                            <p className="pedido-fecha">📅 {new Date(pedido.fecha).toLocaleDateString('es-AR')}</p>
                          </div>
                          <div className="pedido-estado">
                            <span 
                              className="estado-badge"
                              style={{ backgroundColor: getEstadoColor(pedido.estado) }}
                            >
                              {pedido.estado}
                            </span>
                          </div>
                        </div>
                        
                        <div className="pedido-productos">
                          {pedido.productos.map((producto, index) => (
                            <div key={index} className="producto-item">
                              <span className="producto-nombre">{producto.nombre}</span>
                              <span className="producto-cantidad">x{producto.cantidad}</span>
                              <span className="producto-precio">{formatearPrecio(producto.precio)}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="pedido-total">
                          <strong>Total: {formatearPrecio(pedido.total)}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'administracion' && user.rol === 'admin' && (
            <div className="tab-content">
              <div className="admin-panel-container">
                <h3>🔐 Panel de Administración</h3>
                <p className="admin-welcome">Bienvenido al panel de control administrativo. Desde aquí puedes gestionar todos los aspectos de la tienda.</p>
                
                <div className="admin-sections">
                  <div className="admin-section">
                    <h4>📦 Gestión de Productos</h4>
                    <div className="admin-buttons">
                      <button 
                        className="admin-action-btn primary"
                        onClick={() => navigate('/admin/products')}
                      >
                        📋 Ver Todos los Productos
                      </button>
                      <button 
                        className="admin-action-btn success"
                        onClick={() => navigate('/admin/products/new')}
                      >
                        ➕ Agregar Nuevo Producto
                      </button>
                    </div>
                    <div className="admin-stats">
                      <span className="stat-item">📊 Productos en stock</span>
                      <span className="stat-item">⚠️ Productos con bajo stock</span>
                    </div>
                  </div>

                  <div className="admin-section">
                    <h4>🛒 Gestión de Pedidos</h4>
                    <div className="admin-buttons">
                      <button 
                        className="admin-action-btn primary"
                        onClick={() => navigate('/admin/orders')}
                      >
                        📋 Ver Todos los Pedidos
                      </button>
                      <button 
                        className="admin-action-btn warning"
                        onClick={() => navigate('/admin/orders?status=pending')}
                      >
                        ⏳ Pedidos Pendientes
                      </button>
                    </div>
                  </div>

                  <div className="admin-section">
                    <h4>📊 Reportes y Análisis</h4>
                    <div className="admin-buttons">
                      <button 
                        className="admin-action-btn primary"
                        onClick={() => navigate('/admin/reports')}
                      >
                        📈 Ver Reportes
                      </button>
                      <button 
                        className="admin-action-btn info"
                        onClick={() => navigate('/admin/dashboard')}
                      >
                        🧭 Dashboard General
                      </button>
                    </div>
                  </div>

                  <div className="admin-section">
                    <h4>🏪 Gestión de Categorías</h4>
                    <div className="admin-buttons">
                      <button 
                        className="admin-action-btn primary"
                        onClick={() => navigate('/admin/categories')}
                      >
                        🗂️ Gestionar Categorías
                      </button>
                      <button 
                        className="admin-action-btn primary"
                        onClick={() => navigate('/admin/brands')}
                      >
                        🏷️ Gestionar Marcas
                      </button>
                    </div>
                  </div>

                  <div className="admin-section quick-actions">
                    <h4>⚡ Acciones Rápidas</h4>
                    <div className="quick-actions-grid">
                      <div className="quick-action-card" onClick={() => navigate('/admin/products')}>
                        <span className="quick-icon">📦</span>
                        <span className="quick-text">Productos</span>
                      </div>
                      <div className="quick-action-card" onClick={() => navigate('/admin/orders')}>
                        <span className="quick-icon">🛒</span>
                        <span className="quick-text">Pedidos</span>
                      </div>
                      <div className="quick-action-card" onClick={() => navigate('/admin/reports')}>
                        <span className="quick-icon">📊</span>
                        <span className="quick-text">Reportes</span>
                      </div>
                      <div className="quick-action-card" onClick={() => navigate('/admin/dashboard')}>
                        <span className="quick-icon">🧭</span>
                        <span className="quick-text">Dashboard</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'configuracion' && (
            <div className="tab-content">
              <div className="configuracion-container">
                <h3>⚙️ Configuración de Cuenta</h3>
                
                {message && (
                  <div className={`message ${messageType}`}>
                    {message}
                  </div>
                )}
                
                <div className="config-section">
                  <h4>🔒 Seguridad</h4>
                  <button 
                    className="config-button"
                    onClick={() => setShowChangePassword(!showChangePassword)}
                  >
                    🔑 Cambiar Contraseña
                  </button>
                  
                  {showChangePassword && (
                    <div className="config-form">
                      <form onSubmit={handleChangePassword}>
                        <div className="form-group">
                          <label>Contraseña actual:</label>
                          <input
                            type="password"
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({
                              ...passwordForm,
                              currentPassword: e.target.value
                            })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Nueva contraseña:</label>
                          <input
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({
                              ...passwordForm,
                              newPassword: e.target.value
                            })}
                            required
                            minLength="6"
                          />
                        </div>
                        <div className="form-group">
                          <label>Confirmar nueva contraseña:</label>
                          <input
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({
                              ...passwordForm,
                              confirmPassword: e.target.value
                            })}
                            required
                          />
                        </div>
                        <div className="form-buttons">
                          <button type="submit" className="save-btn">Guardar</button>
                          <button 
                            type="button" 
                            className="cancel-btn"
                            onClick={() => {
                              setShowChangePassword(false);
                              setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                            }}
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                  
                  <button 
                    className="config-button"
                    onClick={() => setShowChangeEmail(!showChangeEmail)}
                  >
                    📧 Cambiar Email
                  </button>
                  
                  {showChangeEmail && (
                    <div className="config-form">
                      <form onSubmit={handleChangeEmail}>
                        <div className="form-group">
                          <label>Email actual:</label>
                          <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="disabled-input"
                          />
                        </div>
                        <div className="form-group">
                          <label>Nuevo email:</label>
                          <input
                            type="email"
                            value={emailForm.newEmail}
                            onChange={(e) => setEmailForm({
                              ...emailForm,
                              newEmail: e.target.value
                            })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Confirmar nuevo email:</label>
                          <input
                            type="email"
                            value={emailForm.confirmEmail}
                            onChange={(e) => setEmailForm({
                              ...emailForm,
                              confirmEmail: e.target.value
                            })}
                            required
                          />
                        </div>
                        <div className="form-buttons">
                          <button type="submit" className="save-btn">Guardar</button>
                          <button 
                            type="button" 
                            className="cancel-btn"
                            onClick={() => {
                              setShowChangeEmail(false);
                              setEmailForm({ newEmail: '', confirmEmail: '', currentPassword: '' });
                            }}
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>

                <div className="config-section">
                  <h4>🔔 Notificaciones</h4>
                  <div className="config-toggle">
                    <label>
                      <input type="checkbox" defaultChecked />
                      Notificaciones de pedidos
                    </label>
                  </div>
                  <div className="config-toggle">
                    <label>
                      <input type="checkbox" defaultChecked />
                      Ofertas y promociones
                    </label>
                  </div>
                </div>

                <div className="config-section danger-zone">
                  <h4>⚠️ Zona Peligrosa</h4>
                  <button 
                    className="config-button danger"
                    onClick={handleDeleteAccount}
                  >
                    🗑️ Eliminar Cuenta
                  </button>
                  <p style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>
                    Esta acción no se puede deshacer. Se eliminarán todos tus datos permanentemente.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
