import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../api';

const PaymentPending = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const paymentId = searchParams.get('payment_id');

        if (paymentId) {
          const response = await api.get(`/payments/status/${paymentId}`);
          setPaymentInfo(response.data);
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  const handleCheckStatus = async () => {
    if (paymentInfo?.payment_id) {
      try {
        const response = await api.get(`/payments/status/${paymentInfo.payment_id}`);
        setPaymentInfo(response.data);

        if (response.data.status === 'approved') {
          navigate('/payment-success');
        }
      } catch (error) {}
    }
  };

  const handleContinueShopping = () => {
    navigate('/usuario/catalogo');
  };

  if (loading) {
    return (
      <div className="payment-result-container">
        <div className="loading-spinner"></div>
        <p>Verificando pago...</p>
      </div>
    );
  }

  return (
    <div className="payment-result-container pending">
      <div className="payment-result-card">
        <div className="pending-icon">
          <svg 
            width="64" 
            height="64" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="11" fill="#f59e0b"/>
            <circle cx="12" cy="12" r="3" fill="white"/>
          </svg>
        </div>

        <h1>Pago en proceso</h1>
        <p className="pending-message">
          Tu pago está siendo procesado. Te notificaremos por email cuando se confirme.
        </p>

        {paymentInfo && (
          <div className="payment-details">
            <h3>Detalles del pago</h3>
            <div className="detail-row">
              <span>ID de pago:</span>
              <span>{paymentInfo.payment_id}</span>
            </div>
            <div className="detail-row">
              <span>Estado:</span>
              <span className="status-pending">{paymentInfo.status}</span>
            </div>
            <div className="detail-row">
              <span>Método de pago:</span>
              <span>{paymentInfo.payment_method || 'MercadoPago'}</span>
            </div>
            <div className="detail-row">
              <span>Monto:</span>
              <span>${paymentInfo.amount}</span>
            </div>
          </div>
        )}

        <div className="pending-info">
          <h3>¿Qué significa esto?</h3>
          <ul>
            <li>El pago puede demorar hasta 24 horas en procesarse</li>
            <li>Recibirás un email cuando se confirme</li>
            <li>Puedes verificar el estado en "Mis pedidos"</li>
            <li>Si usaste transferencia bancaria, puede demorar más</li>
          </ul>
        </div>

        <div className="action-buttons">
          <button 
            onClick={handleCheckStatus}
            className="btn-primary"
          >
            Verificar estado
          </button>
          <button 
            onClick={handleContinueShopping}
            className="btn-secondary"
          >
            Seguir comprando
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPending;
