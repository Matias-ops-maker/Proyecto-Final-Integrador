import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../styles/payment-status.css';

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);
  
  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');
    const externalReference = searchParams.get('external_reference');
    
    setPaymentData({
      paymentId,
      status,
      externalReference
    });
  }, [searchParams]);

  const handleRetryPayment = () => {
    navigate('/checkout');
  };

  const handleBackToCart = () => {
    navigate('/carrito');
  };

  return (
    <div className="payment-status-container">
      <div className="payment-status-content failure">
        <div className="status-icon failure-icon">
          ✖
        </div>
        
        <h1>Pago Fallido</h1>
        
        <div className="status-message">
          <p>Hubo un problema al procesar tu pago.</p>
          <p>No se realizó ningún cargo a tu tarjeta.</p>
        </div>
        
        {paymentData && paymentData.paymentId && (
          <div className="payment-details">
            <h3>Detalles del Intento</h3>
            <div className="detail-item">
              <span className="label">ID de Pago:</span>
              <span className="value">{paymentData.paymentId}</span>
            </div>
            <div className="detail-item">
              <span className="label">Estado:</span>
              <span className="value">{paymentData.status}</span>
            </div>
          </div>
        )}
        
        <div className="failure-reasons">
          <h3>Posibles causas:</h3>
          <ul>
            <li>Datos incorrectos de la tarjeta</li>
            <li>Fondos insuficientes</li>
            <li>Problemas de conexión</li>
            <li>Tarjeta vencida o bloqueada</li>
          </ul>
        </div>
        
        <div className="action-buttons">
          <button 
            onClick={handleRetryPayment}
            className="btn btn-primary"
          >
            Intentar Nuevamente
          </button>
          <button 
            onClick={handleBackToCart}
            className="btn btn-secondary"
          >
            Volver al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
