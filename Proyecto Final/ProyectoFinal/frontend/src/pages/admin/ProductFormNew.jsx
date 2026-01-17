import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api.js";
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=600&q=80';

export default function ProductFormNew() {
  const [formData, setFormData] = useState({
    sku: "",
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    category_id: "",
    brand_id: "",
    imagen_url: "",
    estado: "activo"
  });
  
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const normalizeList = (payload) => {
    const collection = payload?.data ?? payload;
    return Array.isArray(collection) ? collection : [];
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const catResponse = await api.get("/categories");
        setCategories(normalizeList(catResponse.data));
      } catch {
        setCategories([
          { id: 1, nombre: "Filtros" },
          { id: 2, nombre: "Frenos" },
          { id: 3, nombre: "Aceites" }
        ]);
      }

      try {
        const brandResponse = await api.get("/brands");
        setBrands(normalizeList(brandResponse.data));
      } catch {
        setBrands([
          { id: 1, nombre: "Bosch" },
          { id: 2, nombre: "Mann Filter" },
          { id: 3, nombre: "Castrol" }
        ]);
      }

      if (isEdit && id) {
        try {
          setLoading(true);
          const response = await api.get(`/products/${id}`);
          if (response.data) {
            setFormData({
              sku: response.data.sku || "",
              nombre: response.data.nombre || "",
              descripcion: response.data.descripcion || "",
              precio: response.data.precio ? response.data.precio.toString() : "",
              stock: response.data.stock ? response.data.stock.toString() : "",
              category_id: response.data.category_id ? response.data.category_id.toString() : "",
              brand_id: response.data.brand_id ? response.data.brand_id.toString() : "",
              imagen_url: response.data.imagen_url || "",
              estado: response.data.estado || "activo"
            });
          }
        } catch (err) {
          console.error('Error loading product:', err);
          setError("Error al cargar el producto");
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [id, isEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const productData = {
        ...formData,
        sku: formData.sku || `SKU-${Date.now()}`,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        category_id: parseInt(formData.category_id),
        brand_id: parseInt(formData.brand_id)
      };

      if (isEdit) {
        await api.put(`/products/${id}`, productData);
      } else {
        await api.post("/products", productData);
      }

      navigate("/admin/products");
    } catch (err) {
      console.error('Error saving product:', err);
      setError("Error al guardar el producto");
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return <div style={{ padding: "40px", textAlign: "center" }}><h2>Cargando...</h2></div>;
  }

  return (
    <div style={{ padding: "20px", backgroundColor: "white", minHeight: "100vh" }}>
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>{isEdit ? "Editar Producto" : "Nuevo Producto"}</h1>
        <button onClick={() => navigate("/admin/products")} style={{ padding: "8px 16px", backgroundColor: "#6b7280", color: "white", border: "none", borderRadius: "4px" }}>
          Volver
        </button>
      </div>

      {error && (
        <div style={{ padding: "12px", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "4px", marginBottom: "20px" }}>
          <span style={{ color: "#dc2626" }}>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: "800px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>SKU</label>
            <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} placeholder="SKU del producto" style={{ width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "4px" }} />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Nombre *</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Nombre del producto" required style={{ width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "4px" }} />
          </div>

          <div style={{ gridColumn: "span 2" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Descripción</label>
            <textarea name="descripcion" value={formData.descripcion} onChange={handleInputChange} placeholder="Descripción del producto" rows="3" style={{ width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "4px" }} />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Precio *</label>
            <input type="number" name="precio" value={formData.precio} onChange={handleInputChange} placeholder="0.00" step="0.01" required style={{ width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "4px" }} />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Stock *</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="0" required style={{ width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "4px" }} />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Categoría *</label>
            <select name="category_id" value={formData.category_id} onChange={handleInputChange} required style={{ width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "4px" }}>
              <option value="">Seleccionar categoría</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Marca *</label>
            <select name="brand_id" value={formData.brand_id} onChange={handleInputChange} required style={{ width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "4px" }}>
              <option value="">Seleccionar marca</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>URL de Imagen</label>
            <input type="url" name="imagen_url" value={formData.imagen_url} onChange={handleInputChange} placeholder="https://ejemplo.com/imagen.jpg" style={{ width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "4px" }} />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Estado</label>
            <select name="estado" value={formData.estado} onChange={handleInputChange} style={{ width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "4px" }}>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "30px" }}>
          <button type="button" onClick={() => navigate("/admin/products")} style={{ padding: "10px 20px", backgroundColor: "#6b7280", color: "white", border: "none", borderRadius: "4px" }}>
            Cancelar
          </button>
          <button type="submit" disabled={loading} style={{ padding: "10px 20px", backgroundColor: loading ? "#9ca3af" : "#3b82f6", color: "white", border: "none", borderRadius: "4px", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Guardando..." : (isEdit ? "Actualizar" : "Crear")} Producto
          </button>
        </div>
      </form>

      {(formData.imagen_url || DEFAULT_IMAGE) && (
        <div style={{ marginTop: "30px", maxWidth: "400px" }}>
          <h3>Vista previa de imagen</h3>
          <img src={formData.imagen_url || DEFAULT_IMAGE} alt="Vista previa" onError={(e) => { e.target.src = DEFAULT_IMAGE; }} style={{ maxWidth: "100%", height: "auto", border: "1px solid #d1d5db", borderRadius: "4px" }} />
        </div>
      )}
    </div>
  );
}

