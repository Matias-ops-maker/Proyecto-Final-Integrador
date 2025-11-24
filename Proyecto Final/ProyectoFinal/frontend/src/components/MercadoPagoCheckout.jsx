import React, { useState, useEffect } from 'react';
import { Wallet } from '@mercadopago/sdk-react';
import api from '../api';

const MercadoPagoCheckout = ({ items, total, onSuccess, onError }) => {
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const createPayment = async () => {
      try {
        setLoading(true);
        setError(null);

        const paymentData = {
          items: items.map(item => ({
            id: item.id,
            title: item.nombre,
            quantity: item.cantidad,
            unit_price: parseFloat(item.precio),
            currency_id: 'ARS'
          })),
          back_urls: {
            success: `${window.location.origin}/payment-success`,
            failure: `${window.location.origin}/payment-failure`,
            pending: `${window.location.origin}/payment-pending`
          },
          auto_return: 'approved',
          external_reference: `order_${Date.now()}`,
          notification_url: `${import.meta.env.VITE_API_URL?.replace('/api', '') || window.location.origin}/api/payments/notifications`
        };

        const response = await api.post('/payments/create', paymentData);
        
        if (response.data.success) {
          setPreferenceId(response.data.preferenceId);
        } else {
          throw new Error(response.data.message || 'Error al crear la preferencia de pago');
        }
      } catch (err) {
        setError(err.message || 'Error al procesar el pago');
        if (onError) onError(err);
      } finally {
        setLoading(false);
      }
    };

    if (items && items.length > 0) {
      createPayment();
    }
  }, [items, onError]);

  const initialization = {
    preferenceId: preferenceId,
    redirectMode: 'self'
  };

  const customization = {
    texts: {
      valueProp: 'smart_option',
    },
    visual: {
      buttonBackground: 'default',
      borderRadius: '6px'
    }
  };

  if (loading) {
    return (
      <div className="mercadopago-loading">
        <div className="loading-spinner"></div>
        <p>Preparando método de pago...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mercadopago-error">
        <p>Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="btn-retry"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!preferenceId) {
    return (
      <div className="mercadopago-error">
        <p>No se pudo generar la preferencia de pago</p>
      </div>
    );
  }

  return (
    <div className="mercadopago-checkout">
      <div className="payment-summary">
        <h3>Resumen del pedido</h3>
        <div className="items-list">
          {items.map((item, index) => (
            <div key={index} className="item-summary">
              <span className="item-name">{item.nombre}</span>
              <span className="item-quantity">x{item.cantidad}</span>
              <span className="item-price">${item.precio}</span>
            </div>
          ))}
        </div>
        <div className="total-summary">
          <strong>Total: ${total}</strong>
        </div>
      </div>

      <div className="payment-methods">
        <h3>Método de pago</h3>
        <Wallet 
          initialization={initialization} 
          customization={customization}
          onSubmit={onSuccess}
          onError={onError}
        />
      </div>
    </div>
  );
};

export default MercadoPagoCheckout;
