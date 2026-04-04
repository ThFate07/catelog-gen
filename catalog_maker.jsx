import { useState, useRef, useCallback } from "react";

const DEMO_PRODUCTS = [
  {
    id: 1,
    image: null,
    capacity: "260 ML",
    price: "125",
    qty: "6 pcs",
    inStock: true,
    description: "AB-9DD2 GR KIVVI 6 PCS 250 ML JUICE GLASS IN COL BOX 12 SET CTN",
    sku: "AB-9DD2",
  },
  {
    id: 2,
    image: null,
    capacity: "260 ML",
    price: "125",
    qty: "6 pcs",
    inStock: true,
    description: "AB-9J GR KIVVI 6 PCS 250 ML JUICE GLASS IN COL BOX 12 SET CTN",
    sku: "AB-9J",
  },
  {
    id: 3,
    image: null,
    capacity: "250 ML",
    price: "125",
    qty: "6 pcs",
    inStock: true,
    description: "AB-9FD GR KIVVI 6 PCS 250 ML JUICE GLASS IN COL BOX 12 SET CTN",
    sku: "AB-9FD",
  },
  {
    id: 4,
    image: null,
    capacity: "250 ML",
    price: "125",
    qty: "6 pcs",
    inStock: true,
    description: "AB-9WJ GR KIVVI 6 PCS 250 ML JUICE GLASS IN COL BOX 12 SET CTN",
    sku: "AB-9WJ",
  },
  {
    id: 5,
    image: null,
    capacity: "260 ML",
    price: "125",
    qty: "6 pcs",
    inStock: true,
    description: "AB-9BHX GR KIVVI 6 PCS 250 ML JUICE GLASS IN COL BOX 12 SET CTN",
    sku: "AB-9BHX",
  },
  {
    id: 6,
    image: null,
    capacity: "250 ML",
    price: "125",
    qty: "6 pcs",
    inStock: true,
    description: "AB-9VW GR KIVVI 6 PCS 250 ML JUICE GLASS IN COL BOX 12 SET CTN",
    sku: "AB-9VW",
  },
];

const EMPTY_PRODUCT = {
  id: null,
  image: null,
  capacity: "",
  price: "",
  qty: "6 pcs",
  inStock: true,
  description: "",
  sku: "",
};

function ProductCard({ product, onEdit, onDelete }) {
  return (
    <div style={{
      border: "1px solid #ccc",
      backgroundColor: "#fff",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      fontFamily: "'Arial', sans-serif",
      fontSize: "12px",
    }}>
      {/* Capacity Header */}
      <div style={{
        textAlign: "center",
        fontWeight: "900",
        fontSize: "22px",
        padding: "6px 4px 2px",
        letterSpacing: "1px",
        color: "#000",
      }}>
        {product.capacity || "— ML"}
      </div>

      {/* Image */}
      <div style={{
        height: "130px",
        backgroundColor: "#f0f0f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        margin: "0 4px",
        border: "1px solid #e0e0e0",
      }}>
        {product.image ? (
          <img src={product.image} alt={product.sku} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ color: "#aaa", fontSize: "11px", textAlign: "center", padding: "8px" }}>
            <div style={{ fontSize: "28px", marginBottom: "4px" }}>🥃</div>
            No Image
          </div>
        )}
      </div>

      {/* Price Line */}
      <div style={{ padding: "4px 6px 2px", display: "flex", alignItems: "baseline", gap: "4px", flexWrap: "wrap" }}>
        <span style={{ color: "#cc0000", fontWeight: "bold", fontSize: "13px" }}>Rs</span>
        <span style={{ color: "#cc0000", fontWeight: "900", fontSize: "16px" }}>{product.price || "—"}</span>
        <span style={{ color: "#000", fontWeight: "bold", fontSize: "11px" }}>for {product.qty}</span>
        {product.inStock && (
          <span style={{ color: "#cc0000", fontWeight: "900", fontSize: "11px", marginLeft: "2px" }}>IN STOCK</span>
        )}
      </div>

      {/* Description */}
      <div style={{
        padding: "2px 6px 4px",
        color: "#0000cc",
        fontWeight: "bold",
        fontSize: "10px",
        textAlign: "center",
        lineHeight: "1.3",
        minHeight: "36px",
      }}>
        {product.description || "Product description here"}
      </div>

      {/* SKU */}
      <div style={{
        padding: "2px 6px 4px",
        fontWeight: "bold",
        fontSize: "11px",
        color: "#000",
        borderTop: "1px solid #ddd",
      }}>
        {product.sku || "SKU"}
      </div>

      {/* Action buttons (hidden in print) */}
      <div className="no-print" style={{
        position: "absolute", top: "4px", right: "4px",
        display: "flex", gap: "4px",
      }}>
        <button onClick={() => onEdit(product)} style={{
          background: "#1a73e8", color: "#fff", border: "none",
          borderRadius: "3px", padding: "2px 6px", cursor: "pointer", fontSize: "10px",
        }}>Edit</button>
        <button onClick={() => onDelete(product.id)} style={{
          background: "#d93025", color: "#fff", border: "none",
          borderRadius: "3px", padding: "2px 6px", cursor: "pointer", fontSize: "10px",
        }}>✕</button>
      </div>
    </div>
  );
}

function ProductModal({ product, onSave, onClose }) {
  const [form, setForm] = useState({ ...product });
  const fileRef = useRef();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((f) => ({ ...f, image: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: field === "inStock" ? e.target.checked : e.target.value }));

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
    }}>
      <div style={{
        background: "#fff", borderRadius: "10px", padding: "28px",
        width: "420px", maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      }}>
        <h2 style={{ margin: "0 0 20px", fontFamily: "Georgia, serif", fontSize: "20px", color: "#111" }}>
          {form.id ? "Edit Product" : "Add New Product"}
        </h2>

        {[
          ["Capacity (e.g. 260 ML)", "capacity"],
          ["Price (Rs.)", "price"],
          ["Quantity (e.g. 6 pcs)", "qty"],
          ["Product Description", "description"],
          ["SKU / Product Code", "sku"],
        ].map(([label, field]) => (
          <div key={field} style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "4px", fontWeight: "600" }}>
              {label}
            </label>
            {field === "description" ? (
              <textarea
                value={form[field]}
                onChange={set(field)}
                rows={3}
                style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "13px", resize: "vertical", boxSizing: "border-box" }}
              />
            ) : (
              <input
                type="text"
                value={form[field]}
                onChange={set(field)}
                style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" }}
              />
            )}
          </div>
        ))}

        <div style={{ marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
          <input type="checkbox" id="instock" checked={form.inStock} onChange={set("inStock")} />
          <label htmlFor="instock" style={{ fontSize: "13px", fontWeight: "600", color: "#333" }}>In Stock</label>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px", fontWeight: "600" }}>
            Product Image
          </label>
          {form.image && (
            <img src={form.image} alt="preview" style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "6px", marginBottom: "8px", border: "1px solid #eee" }} />
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
          <button onClick={() => fileRef.current.click()} style={{
            padding: "8px 16px", background: "#f1f3f4", border: "1px solid #ddd",
            borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "600",
          }}>
            📷 {form.image ? "Change Image" : "Upload Image"}
          </button>
        </div>

        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "9px 20px", background: "#f1f3f4", border: "none",
            borderRadius: "6px", cursor: "pointer", fontSize: "14px",
          }}>Cancel</button>
          <button onClick={() => onSave(form)} style={{
            padding: "9px 20px", background: "#1a73e8", color: "#fff", border: "none",
            borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "600",
          }}>Save Product</button>
        </div>
      </div>
    </div>
  );
}

export default function CatalogMaker() {
  const [products, setProducts] = useState(DEMO_PRODUCTS.map((p, i) => ({ ...p, id: i + 1 })));
  const [editing, setEditing] = useState(null);
  const [catalogTitle, setCatalogTitle] = useState("Glassware Stock Catalog");
  const [showTitle, setShowTitle] = useState(false);
  const nextId = useRef(DEMO_PRODUCTS.length + 1);

  const handleAdd = () => {
    setEditing({ ...EMPTY_PRODUCT, id: null });
  };

  const handleSave = (form) => {
    if (form.id) {
      setProducts((ps) => ps.map((p) => (p.id === form.id ? form : p)));
    } else {
      const newProduct = { ...form, id: nextId.current++ };
      setProducts((ps) => [...ps, newProduct]);
    }
    setEditing(null);
  };

  const handleDelete = (id) => {
    setProducts((ps) => ps.filter((p) => p.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCSVImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = ev.target.result.split("\n").filter(Boolean);
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const newProducts = lines.slice(1).map((line) => {
        const vals = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
        const obj = {};
        headers.forEach((h, i) => (obj[h] = vals[i] || ""));
        return {
          id: nextId.current++,
          image: null,
          capacity: obj.capacity || obj.size || obj.ml || "",
          price: obj.price || obj.rs || "",
          qty: obj.qty || obj.quantity || "6 pcs",
          inStock: obj.instock !== "false" && obj.instock !== "0",
          description: obj.description || obj.desc || "",
          sku: obj.sku || obj.code || obj.id || "",
        };
      });
      setProducts((ps) => [...ps, ...newProducts]);
    };
    reader.readAsText(file);
  };

  const csvRef = useRef();

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; }
          .catalog-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .page-container { padding: 0 !important; background: white !important; }
        }
        body { margin: 0; }
        * { box-sizing: border-box; }
      `}</style>

      {/* Toolbar */}
      <div className="no-print" style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ color: "#fff", fontWeight: "900", fontSize: "18px", fontFamily: "Georgia, serif", letterSpacing: "-0.5px" }}>
            📋 Catalog Maker
          </span>
          {!showTitle ? (
            <span
              onClick={() => setShowTitle(true)}
              style={{ color: "#aac4ff", fontSize: "14px", cursor: "pointer", textDecoration: "underline dotted" }}
            >
              {catalogTitle}
            </span>
          ) : (
            <input
              autoFocus
              value={catalogTitle}
              onChange={(e) => setCatalogTitle(e.target.value)}
              onBlur={() => setShowTitle(false)}
              onKeyDown={(e) => e.key === "Enter" && setShowTitle(false)}
              style={{ padding: "4px 10px", borderRadius: "6px", border: "2px solid #4a9eff", fontSize: "14px", background: "#fff" }}
            />
          )}
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={handleAdd} style={{
            padding: "8px 18px", background: "#4CAF50", color: "#fff",
            border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "13px",
          }}>+ Add Product</button>
          <button onClick={() => csvRef.current.click()} style={{
            padding: "8px 18px", background: "#ff9800", color: "#fff",
            border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "13px",
          }}>📊 Import CSV</button>
          <input ref={csvRef} type="file" accept=".csv" onChange={handleCSVImport} style={{ display: "none" }} />
          <button onClick={handlePrint} style={{
            padding: "8px 18px", background: "#e53935", color: "#fff",
            border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "13px",
          }}>🖨️ Print / Save PDF</button>
        </div>
      </div>

      {/* Hint bar */}
      <div className="no-print" style={{
        background: "#fff3cd",
        borderBottom: "1px solid #ffc107",
        padding: "8px 24px",
        fontSize: "12px",
        color: "#856404",
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
      }}>
        <span>💡 <strong>Tip:</strong> Click <em>Edit</em> on any card to upload a product image and fill in details.</span>
        <span>📊 <strong>CSV columns:</strong> capacity, price, qty, description, sku, inStock</span>
        <span>🖨️ Use <em>Print / Save PDF</em> to export your catalog — set paper to A4 or Letter in print dialog.</span>
      </div>

      {/* Catalog Page */}
      <div className="page-container" style={{ padding: "20px", background: "#e8eaf6", minHeight: "100vh" }}>
        {/* Catalog Header (shows in print) */}
        <div style={{
          background: "#fff",
          padding: "12px 20px",
          marginBottom: "4px",
          textAlign: "center",
          borderBottom: "3px solid #000",
        }}>
          <h1 style={{
            margin: 0,
            fontFamily: "'Arial Black', sans-serif",
            fontSize: "24px",
            letterSpacing: "2px",
            color: "#000",
          }}>
            {catalogTitle}
          </h1>
        </div>

        {products.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "60px", color: "#888",
            background: "#fff", borderRadius: "10px", marginTop: "20px",
          }}>
            <div style={{ fontSize: "48px" }}>📦</div>
            <p style={{ fontSize: "18px", marginTop: "12px" }}>No products yet. Click <strong>+ Add Product</strong> to get started!</p>
          </div>
        ) : (
          <div className="catalog-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0",
            background: "#fff",
            border: "1px solid #bbb",
          }}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onEdit={setEditing} onDelete={handleDelete} />
            ))}
          </div>
        )}

        <div className="no-print" style={{ textAlign: "center", marginTop: "16px", color: "#777", fontSize: "12px" }}>
          {products.length} product{products.length !== 1 ? "s" : ""} · 3-column grid layout (matches your PDF format)
        </div>
      </div>

      {/* Modal */}
      {editing && (
        <ProductModal product={editing} onSave={handleSave} onClose={() => setEditing(null)} />
      )}
    </>
  );
}