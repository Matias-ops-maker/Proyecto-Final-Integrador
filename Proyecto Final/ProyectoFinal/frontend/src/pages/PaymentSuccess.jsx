import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles/payment-status.css';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  
  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');
    const externalReference = searchParams.get('external_reference');
    
    if (paymentId) {
      processPaymentSuccess(paymentId, status, externalReference);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const processPaymentSuccess = async (paymentId, status, externalReference) => {
    try {
      await api.delete('/cart');
      
      setPaymentData({
        paymentId,
        status,
        externalReference
      });
    } catch (error) {
      // Manejo opcional de errores
    } finally {
      setLoading(false);
    }
  };

  const handleContinueShopping = () => {
    navigate('/productos');
  };

  const handleViewOrders = () => {
    navigate('/mis-pedidos');
  };

  if (loading) {
    return (
      <div className="payment-status-container">
        <div className="payment-status-content">
          <div className="loading-spinner"></div>
          <p>Procesando pago...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-status-container">
      <div className="payment-status-content success">
        <div className="status-icon success-icon">
          ✓
        </div>
        
        <h1>¡Pago Exitoso!</h1>
        
        <div className="status-message">
          <p>Tu pago ha sido procesado correctamente.</p>
          <p>Recibirás un email de confirmación en breve.</p>
        </div>
        
        {paymentData && (
          <div className="payment-details">
            <h3>Detalles del Pago</h3>
            <div className="detail-item">
              <span className="label">ID de Pago:</span>
              <span className="value">{paymentData.paymentId}</span>
            </div>
            <div className="detail-item">
              <span className="label">Estado:</span>
              <span className="value">{paymentData.status}</span>
            </div>
            {paymentData.externalReference && (
              <div className="detail-item">
                <span className="label">Referencia:</span>
                <span className="value">{paymentData.externalReference}</span>
              </div>
            )}
          </div>
        )}
        
        <div className="action-buttons">
          <button 
            onClick={handleViewOrders}
            className="btn btn-primary"
          >
            Ver Mis Pedidos
          </button>
          <button 
            onClick={handleContinueShopping}
            className="btn btn-secondary"
          >
            Seguir Comprando
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
