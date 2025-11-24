import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../api';

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const paymentId = searchParams.get('payment_id');
        const status = searchParams.get('status');

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

  const handleRetryPayment = () => {
    navigate('/usuario/carrito');
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
    <div className="payment-result-container failure">
      <div className="payment-result-card">
        <div className="failure-icon">
          <svg 
            width="64" 
            height="64" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="11" fill="#ef4444"/>
            <path d="M8 8l8 8M16 8l-8 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        <h1>Pago no procesado</h1>
        <p className="failure-message">
          Hubo un problema al procesar tu pago. No te preocupes, no se realizó ningún cargo.
        </p>

        {paymentInfo && (
          <div className="payment-details">
            <h3>Detalles del intento</h3>
            <div className="detail-row">
              <span>ID de pago:</span>
              <span>{paymentInfo.payment_id}</span>
            </div>
            <div className="detail-row">
              <span>Estado:</span>
              <span className="status-rejected">{paymentInfo.status}</span>
            </div>
            <div className="detail-row">
              <span>Motivo:</span>
              <span>{paymentInfo.status_detail || 'No especificado'}</span>
            </div>
          </div>
        )}

        <div className="failure-reasons">
          <h3>Posibles causas:</h3>
          <ul>
            <li>Datos de la tarjeta incorrectos</li>
            <li>Fondos insuficientes</li>
            <li>Tarjeta vencida o bloqueada</li>
            <li>Límites de compra excedidos</li>
          </ul>
        </div>

        <div className="action-buttons">
          <button 
            onClick={handleRetryPayment}
            className="btn-primary"
          >
            Intentar nuevamente
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

export default PaymentFailure;
