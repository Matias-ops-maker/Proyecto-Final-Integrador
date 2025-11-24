import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/usuario.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Por favor ingresa tu email");
      return;
    }
    setError("");
    setMessage(`Se envió un enlace de recuperación a ${email}`);
    setEmail(""); 
  };

  return (
    <div className=" ">
      <div className="auth-card">
        <h1 className="auth-title">Recuperar Contraseña</h1>
        {error && <p className="auth-error">{error}</p>}
        {message && <p className=" ">{message}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Tu email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="auth-button">Enviar enlace</button>
        </form>

        <div className="auth-footer">
          <p>
            ¿Recordaste tu contraseña? <Link to="/auth/login" className="auth-link">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
