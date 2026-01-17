import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/usuario.css";
import { API_URL } from "../../api";

export default function Reports() {
    const navigate = useNavigate();

    const downloadFile = async (type) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Debes iniciar sesión como administrador');
                return;
            }

            const endpoint = type === 'pdf'
                ? `${API_URL}/reports/sales/pdf`
                : `${API_URL}/reports/sales/xlsx`;

            const res = await fetch(endpoint, {
                headers: { 
                    "x-api-key": "mi_api_key_super_secreta",
                    "Authorization": `Bearer ${token}`
                },
            });

            if (!res.ok) {
                alert("Error al descargar archivo");
                return;
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `ventas.${type === "pdf" ? "pdf" : "xlsx"}`;
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert("No se pudo descargar el archivo");
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>📊 Reportes de Ventas</h1>
                <button 
                    className="btn-secondary"
                    onClick={() => navigate('/admin/dashboard')}
                >
                    ← Volver al Dashboard
                </button>
            </div>

            <div className="admin-welcome">
                <p>Aquí puedes descargar los reportes de ventas en diferentes formatos.</p>
            </div>

            <div className="admin-sections">
                <div className="admin-section">
                    <h4>📄 Reportes Disponibles</h4>
                    <div className="admin-buttons">
                        <button 
                            className="admin-action-btn primary"
                            onClick={() => downloadFile("pdf")}
                        >
                            📄 Descargar PDF
                        </button>
                        <button 
                            className="admin-action-btn success"
                            onClick={() => downloadFile("xlsx")}
                        >
                            📊 Descargar Excel
                        </button>
                    </div>
                </div>

                <div className="admin-section">
                    <h4>📈 Información de Reportes</h4>
                    <div className="admin-stats">
                        <span className="stat-item">🗓️ Datos actualizados al día de hoy</span>
                        <span className="stat-item">💾 Formatos disponibles: PDF y Excel</span>
                        <span className="stat-item">📊 Incluye ventas, productos y estadísticas</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
