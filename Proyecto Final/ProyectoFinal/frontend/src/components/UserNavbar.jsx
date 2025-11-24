import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function UserNavbar() {
    const [user, setUser] = useState(null);
    const [carrito, setCarrito] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');
            if (token && userData) {
                setUser(JSON.parse(userData));
            } else {
                setUser(null);
            }
        };

        checkAuth();

        const handleStorageChange = () => {
            checkAuth();
        };

        window.addEventListener('storage', handleStorageChange);

        const interval = setInterval(checkAuth, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {

        const carritoGuardado = localStorage.getItem('carrito');
        if (carritoGuardado) {
            setCarrito(JSON.parse(carritoGuardado));
        }

        const handleCarritoChange = () => {
            const carritoActualizado = localStorage.getItem('carrito');
            if (carritoActualizado) {
                setCarrito(JSON.parse(carritoActualizado));
            } else {
                setCarrito([]);
            }
        };

        window.addEventListener('storage', handleCarritoChange);
        const interval = setInterval(handleCarritoChange, 500);

        return () => {
            window.removeEventListener('storage', handleCarritoChange);
            clearInterval(interval);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    const cantidadItems = carrito.reduce((total, item) => total + item.cantidad, 0);

    return (
        <nav style={{
            background: '#1F2937',
            color: 'white',
            padding: '15px 0',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 20px'
            }}>
                <div>
                    <Link 
                        to="/" 
                        style={{
                            color: 'white',
                            textDecoration: 'none',
                            fontSize: '1.5rem',
                            fontWeight: 'bold'
                        }}
                    >
                        🛺 RepuestosAuto
                    </Link>
                </div>
                
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    <Link 
                        to="/catalogo"
                        style={{
                            color: 'white',
                            textDecoration: 'none',
                            padding: '8px 15px',
                            borderRadius: '6px',
                            transition: 'background 0.3s'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#374151'}
                        onMouseOut={(e) => e.target.style.background = 'transparent'}
                    >
                        🛍️ Catálogo
                    </Link>
                    
                    <Link 
                        to="/carrito"
                        style={{
                            color: 'white',
                            textDecoration: 'none',
                            padding: '8px 15px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: cantidadItems > 0 ? '#10B981' : 'transparent',
                            transition: 'background 0.3s'
                        }}
                    >
                        🛒 Carrito ({cantidadItems})
                    </Link>
                    
                    {user ? (
                        <>
                            <span style={{ color: '#D1D5DB' }}>
                                Hola, {user.nombre}!
                            </span>
                            <Link 
                                to="/perfil"
                                style={{
                                    color: 'white',
                                    textDecoration: 'none',
                                    padding: '8px 15px',
                                    borderRadius: '6px',
                                    background: '#3B82F6'
                                }}
                            >
                                🙍 Mi Perfil
                            </Link>
                            {user.rol === 'admin' && (
                                <Link 
                                    to="/admin/dashboard"
                                    style={{
                                        color: 'white',
                                        textDecoration: 'none',
                                        padding: '8px 15px',
                                        borderRadius: '6px',
                                        background: '#8B5CF6'
                                    }}
                                >
                                    🧑‍💼 Admin
                                </Link>
                            )}
                            <button 
                                onClick={handleLogout}
                                style={{
                                    background: '#EF4444',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 15px',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                            >
                                🔒 Salir
                            </button>
                        </>
                    ) : (
                        <>
                            <Link 
                                to="/auth/login"
                                style={{
                                    color: 'white',
                                    textDecoration: 'none',
                                    padding: '8px 15px',
                                    borderRadius: '6px',
                                    background: '#3B82F6'
                                }}
                            >
                                🔑 Iniciar Sesión
                            </Link>
                            <Link 
                                to="/auth/register"
                                style={{
                                    color: 'white',
                                    textDecoration: 'none',
                                    padding: '8px 15px',
                                    borderRadius: '6px',
                                    background: '#10B981'
                                }}
                            >
                                📝 Registrarse
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
