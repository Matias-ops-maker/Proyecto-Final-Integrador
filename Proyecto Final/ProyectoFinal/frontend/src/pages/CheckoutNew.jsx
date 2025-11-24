import React, { useState, useEffect } from 'react';
import api from '../api';
import '../styles/checkout.css';

const CheckoutNew = () => {
  
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkoutData, setCheckoutData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    documento: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    observaciones: ''
  });

  useEffect(() => {
    loadCartFromLocalStorage();
  }, []);

  const loadCartFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem('carrito');
      if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        setCart(cartItems);
        const calculatedTotal = cartItems.reduce((sum, item) => {
          const precio = item.precio || item.price || 0;
          const cantidad = item.cantidad || 0;
          return sum + (precio * cantidad);
        }, 0);
        setTotal(calculatedTotal);
      }
    } catch (error) {
      setError('Error al cargar el carrito');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckoutData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const required = ['nombre', 'apellido', 'email', 'telefono', 'documento', 'direccion', 'ciudad'];
    for (let field of required) {
      if (!checkoutData[field].trim()) {
        setError(`El campo ${field} es obligatorio`);
        return false;
      }
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(checkoutData.email)) {
      setError('El email no es válido');
      return false;
    }
    
    return true;
  };

  const handleCheckout = async () => {
    setError('');
    
    if (!validateForm()) {
      return;
    }

    if (cart.length === 0) {
      setError('El carrito está vacío');
      return;
    }

    setLoading(true);

    try {
      const paymentData = {
        items: cart.map(item => ({
          id: String(item.id),
          title: item.nombre,
          category_id: 'repuestos',
          quantity: parseInt(item.cantidad),
          unit_price: parseFloat(item.precio),
          currency_id: 'ARS'
        })),
        payer: {
          name: checkoutData.nombre,
          surname: checkoutData.apellido,
          email: checkoutData.email,
          phone: {
            area_code: '11',
            number: checkoutData.telefono
          },
          identification: {
            type: 'DNI',
            number: checkoutData.documento
          },
          address: {
            street_name: checkoutData.direccion,
            zip_code: checkoutData.codigoPostal || '1000'
          }
        },
        back_urls: {
          success: `${window.location.origin}/payment-success`,
          failure: `${window.location.origin}/payment-failure`, 
          pending: `${window.location.origin}/payment-pending`
        },
        auto_return: 'approved',
        external_reference: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        notification_url: `${window.location.origin.replace(':5173', ':4000')}/api/payments/webhook`,
        statement_descriptor: 'RepuestosAuto',
        metadata: {
          customer_notes: checkoutData.observaciones
        }
      };

      const response = await api.post('/payments/create', paymentData);
      
      if (response.data.success) {
        const initPoint = response.data.sandbox_init_point || response.data.init_point;
        
        if (initPoint) {
          window.location.href = initPoint;
        } else {
          throw new Error('No se recibió la URL de pago');
        }
      } else {
        throw new Error(response.data.message || 'Error al crear la preferencia de pago');
      }
    } catch (error) {
      setError(
        error.response?.data?.message || 
        error.message || 
        'Error al procesar el pago. Por favor, intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-container">
        <div className="checkout-content">
          <h2>Cargando...</h2>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-container">
        <div className="checkout-content">
          <h2>Checkout</h2>
          <div className="empty-cart">
            <p>Tu carrito está vacío</p>
            <button 
              onClick={() => window.location.href = '/productos'}
              className="btn btn-primary"
            >
              Ver Productos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <h2>Finalizar Compra</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="checkout-sections">

          <div className="order-summary">
            <h3>Resumen del Pedido</h3>
            <div className="cart-items">
              {cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <div className="item-details">
                    <span className="item-name">{item.nombre}</span>
                    <span className="item-quantity">Cantidad: {item.cantidad}</span>
                  </div>
                  <div className="item-price">
                    ${(parseFloat(item.precio) * item.cantidad).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="total-section">
              <div className="total-line">
                <strong>Total: ${total.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          <div className="buyer-data">
            <h3>Datos del Comprador</h3>
            <form className="checkout-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre *</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={checkoutData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="apellido">Apellido *</label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={checkoutData.apellido}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={checkoutData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="telefono">Teléfono *</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={checkoutData.telefono}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="documento">DNI/Documento *</label>
                  <input
                    type="text"
                    id="documento"
                    name="documento"
                    value={checkoutData.documento}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="codigoPostal">Código Postal</label>
                  <input
                    type="text"
                    id="codigoPostal"
                    name="codigoPostal"
                    value={checkoutData.codigoPostal}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="direccion">Dirección *</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={checkoutData.direccion}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="ciudad">Ciudad *</label>
                <input
                  type="text"
                  id="ciudad"
                  name="ciudad"
                  value={checkoutData.ciudad}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="observaciones">Observaciones</label>
                <textarea
                  id="observaciones"
                  name="observaciones"
                  value={checkoutData.observaciones}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Comentarios adicionales sobre tu pedido (opcional)"
                />
              </div>
            </form>
          </div>
        </div>

        <div className="payment-section">
          <button
            onClick={handleCheckout}
            disabled={loading || cart.length === 0}
            className="btn btn-checkout"
          >
            {loading ? 'Procesando...' : `Pagar con MercadoPago - $${total.toFixed(2)}`}
          </button>
          
          <div className="payment-info">
            <p>✔ Pago seguro con MercadoPago</p>
            <p>✔ Aceptamos todas las tarjetas</p>
            <p>✔ Pago en efectivo en Rapipago y Pago Fácil</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutNew;
