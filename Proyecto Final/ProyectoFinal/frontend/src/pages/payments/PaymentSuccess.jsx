import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../api';

const PaymentSuccess = () => {
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

        localStorage.removeItem('carrito');
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  const handleContinueShopping = () => {
    navigate('/usuario/catalogo');
  };

  const handleViewOrders = () => {
    navigate('/usuario/mis-pedidos');
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
    <div className="payment-result-container success">
      <div className="payment-result-card">
        <div className="success-icon">
          <svg 
            width="64" 
            height="64" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="11" fill="#10b981"/>
            <path d="m9 12 2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1>¡Pago exitoso!</h1>
        <p className="success-message">
          Tu pago se procesó correctamente. Recibirás un email de confirmación con los detalles de tu pedido.
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
              <span className="status-approved">{paymentInfo.status}</span>
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

        <div className="action-buttons">
          <button 
            onClick={handleViewOrders}
            className="btn-primary"
          >
            Ver mis pedidos
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

export default PaymentSuccess;
