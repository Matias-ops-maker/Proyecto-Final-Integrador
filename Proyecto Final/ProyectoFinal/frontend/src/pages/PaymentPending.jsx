import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../styles/payment-status.css';

const PaymentPending = () => {
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

  const handleViewOrders = () => {
    navigate('/mis-pedidos');
  };

  const handleContinueShopping = () => {
    navigate('/productos');
  };

  return (
    <div className="payment-status-container">
      <div className="payment-status-content pending">
        <div className="status-icon pending-icon">
          ⏳
        </div>
        
        <h1>Pago Pendiente</h1>
        
        <div className="status-message">
          <p>Tu pago está siendo procesado.</p>
          <p>Te notificaremos cuando se confirme el pago.</p>
        </div>
        
        {paymentData && paymentData.paymentId && (
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
        
        <div className="pending-info">
          <h3>¿Qué significa pago pendiente?</h3>
          <ul>
            <li>Pago en efectivo: Debes completar el pago en el punto autorizado</li>
            <li>Transferencia bancaria: Puede tardar hasta 3 días hábiles</li>
            <li>Pago con tarjeta: Se está verificando la transacción</li>
          </ul>
        </div>
        
        <div className="action-buttons">
          <button 
            onClick={handleViewOrders}
            className="btn btn-primary"
          >
            Ver Estado del Pedido
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

export default PaymentPending;
