import { useEffect, useRef, useState } from "react";

const DEMO_PRODUCTS = [
  {
    id: 1,
    image: null,
    price: "125",
    qty: "1 pcs",
    inStock: true,
    description: "AB-9DD2 GR KIVVI 1 PCS 250 ML JUICE GLASS IN COL BOX 12 SET CTN",
    sku: "AB-9DD2",
  },
  {
    id: 2,
    image: null,
    price: "125",
    qty: "1 pcs",
    inStock: true,
    description: "AB-9J GR KIVVI 1 PCS 250 ML JUICE GLASS IN COL BOX 12 SET CTN",
    sku: "AB-9J",
  },
  {
    id: 3,
    image: null,
    price: "125",
    qty: "1 pcs",
    inStock: true,
    description: "AB-9FD GR KIVVI 1 PCS 250 ML JUICE GLASS IN COL BOX 12 SET CTN",
    sku: "AB-9FD",
  },
  {
    id: 4,
    image: null,
    price: "125",
    qty: "1 pcs",
    inStock: true,
    description: "AB-9WJ GR KIVVI 1 PCS 250 ML JUICE GLASS IN COL BOX 12 SET CTN",
    sku: "AB-9WJ",
  },
  {
    id: 5,
    image: null,
    price: "125",
    qty: "1 pcs",
    inStock: true,
    description: "AB-9BHX GR KIVVI 1 PCS 250 ML JUICE GLASS IN COL BOX 12 SET CTN",
    sku: "AB-9BHX",
  },
  {
    id: 6,
    image: null,
    price: "125",
    qty: "1 pcs",
    inStock: true,
    description: "AB-9VW GR KIVVI 1 PCS 250 ML JUICE GLASS IN COL BOX 12 SET CTN",
    sku: "AB-9VW",
  },
];

const EMPTY_PRODUCT = {
  id: null,
  image: null,
  price: "",
  qty: "1 pcs",
  inStock: true,
  description: "",
  details: "",
  sku: "",
};

const STORAGE_KEY = "catalogMakerWorks.v1";

const createWorkId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `work-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const getSafeNextId = (products, fallback = 1) => {
  const maxId = products.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
  return Math.max(maxId + 1, fallback);
};

const formatWorkDate = (value) => {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleString();
};

const loadPersistedWorks = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.works) || parsed.works.length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
};

const persistWorks = (works, currentWorkId) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        currentWorkId,
        works,
      })
    );
  } catch {
    // Ignore quota/storage errors and keep the editor usable.
  }
};

const IMAGE_EXPORT_SETTINGS = {
  maxWidth: 900,
  maxHeight: 900,
  quality: 0.8,
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read the selected image."));
    reader.readAsDataURL(file);
  });

const optimizeImageForCatalog = (dataUrl) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, IMAGE_EXPORT_SETTINGS.maxWidth / image.naturalWidth, IMAGE_EXPORT_SETTINGS.maxHeight / image.naturalHeight);
      const width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = Math.max(1, Math.round(image.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("Canvas is not available for image compression."));
        return;
      }

      canvas.width = width;
      canvas.height = height;
      context.fillStyle = "#fff";
      context.fillRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", IMAGE_EXPORT_SETTINGS.quality));
    };
    image.onerror = () => reject(new Error("Unable to load the selected image."));
    image.src = dataUrl;
  });

function ProductCard({ product, onEdit, onDelete }) {
  const descriptionText = [product.description, product.details].filter(Boolean).join(" ");

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
      {/* Image */}
      <div style={{
        height: "130px",
        backgroundColor: "#f0f0f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: "6px",
        margin: "0 4px",
        border: "1px solid #e0e0e0",
      }}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.sku}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
              display: "block",
              background: "#fff",
            }}
          />
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
        <span style={{ color: "#000", fontWeight: "bold", fontSize: "11px" }}>for 1 pcs</span>
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
        {descriptionText || "Product description here"}
      </div>

      {/* SKU */}
      <div style={{
        padding: "2px 6px 4px",
        fontWeight: "bold",
        fontSize: "11px",
        color: "#000",
        borderTop: "1px solid #ddd",
      }}>
        {product.sku || "Item No."}
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    let rawImage = null;
    try {
      rawImage = await readFileAsDataUrl(file);
      const optimizedImage = await optimizeImageForCatalog(rawImage);
      setForm((f) => ({ ...f, image: optimizedImage }));
    } catch (error) {
      console.error(error);
      if (rawImage) {
        setForm((f) => ({ ...f, image: rawImage }));
      }
    } finally {
      e.target.value = "";
    }
  };

  const set = (field) => (e) =>
    setForm((f) => ({
      ...f,
      [field]: field === "inStock" ? e.target.checked : e.target.value,
    }));

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
          ["Price (Rs.)", "price"],
          ["Product Description", "description"],
          ["Details", "details"],
          ["Item No. / Product Code", "sku"],
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
            <img
              src={form.image}
              alt="preview"
              style={{
                width: "100%",
                height: "120px",
                objectFit: "contain",
                objectPosition: "center",
                borderRadius: "6px",
                marginBottom: "8px",
                border: "1px solid #eee",
                background: "#fafafa",
                padding: "6px",
                display: "block",
              }}
            />
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
  const [workName, setWorkName] = useState("Glassware Stock Catalog");
  const [showTitle, setShowTitle] = useState(false);
  const [works, setWorks] = useState([]);
  const [currentWorkId, setCurrentWorkId] = useState("");
  const nextId = useRef(DEMO_PRODUCTS.length + 1);
  const isHydrating = useRef(true);

  useEffect(() => {
    const persisted = loadPersistedWorks();

    if (!persisted) {
      const initialProducts = DEMO_PRODUCTS.map((p, i) => ({ ...p, id: i + 1 }));
      const initialWorkId = createWorkId();
      const initialWork = {
        id: initialWorkId,
        name: "Glassware Stock Catalog",
        updatedAt: new Date().toISOString(),
        data: {
          products: initialProducts,
          catalogTitle: "Glassware Stock Catalog",
          nextId: getSafeNextId(initialProducts, DEMO_PRODUCTS.length + 1),
        },
      };

      setProducts(initialProducts);
      setCatalogTitle(initialWork.name);
      setWorkName(initialWork.name);
      nextId.current = initialWork.data.nextId;
      setWorks([initialWork]);
      setCurrentWorkId(initialWorkId);
      persistWorks([initialWork], initialWorkId);
      isHydrating.current = false;
      return;
    }

    const normalizedWorks = persisted.works.map((work) => {
      const safeProducts = Array.isArray(work?.data?.products) ? work.data.products : [];
      const safeTitle = work?.data?.catalogTitle || work?.name || "Untitled Catalog";
      return {
        id: work.id || createWorkId(),
        name: safeTitle,
        updatedAt: work.updatedAt || new Date().toISOString(),
        data: {
          products: safeProducts,
          catalogTitle: safeTitle,
          nextId: getSafeNextId(safeProducts, Number(work?.data?.nextId) || 1),
        },
      };
    });

    const preferredWork = normalizedWorks.find((w) => w.id === persisted.currentWorkId) || normalizedWorks[0];

    setWorks(normalizedWorks);
    setCurrentWorkId(preferredWork.id);
    setProducts(preferredWork.data.products);
    setCatalogTitle(preferredWork.data.catalogTitle);
    setWorkName(preferredWork.name || preferredWork.data.catalogTitle || "Untitled Catalog");
    nextId.current = preferredWork.data.nextId;
    persistWorks(normalizedWorks, preferredWork.id);
    isHydrating.current = false;
  }, []);

  useEffect(() => {
    if (isHydrating.current || !currentWorkId) return;

    setWorks((prev) => {
      const now = new Date().toISOString();
      const updated = prev.some((work) => work.id === currentWorkId)
        ? prev.map((work) =>
            work.id === currentWorkId
              ? {
                  ...work,
                  name: workName || catalogTitle || "Untitled Catalog",
                  updatedAt: now,
                  data: {
                    products,
                    catalogTitle,
                    nextId: getSafeNextId(products, nextId.current),
                  },
                }
              : work
          )
        : [
            {
              id: currentWorkId,
              name: workName || catalogTitle || "Untitled Catalog",
              updatedAt: now,
              data: {
                products,
                catalogTitle,
                nextId: getSafeNextId(products, nextId.current),
              },
            },
            ...prev,
          ];

      persistWorks(updated, currentWorkId);
      return updated;
    });
  }, [products, catalogTitle, currentWorkId, workName]);

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

  const handleResumeWork = (id) => {
    if (!id) return;
    const target = works.find((work) => work.id === id);
    if (!target) return;
    setCurrentWorkId(target.id);
    setProducts(target.data.products || []);
    setCatalogTitle(target.data.catalogTitle || "Untitled Catalog");
    setWorkName(target.name || target.data.catalogTitle || "Untitled Catalog");
    nextId.current = getSafeNextId(target.data.products || [], Number(target.data.nextId) || 1);
    setEditing(null);
    setShowTitle(false);
  };

  const handleCreateWork = () => {
    const id = createWorkId();
    const now = new Date().toISOString();
    const name = `New Catalog ${works.length + 1}`;
    const freshWork = {
      id,
      name,
      updatedAt: now,
      data: {
        products: [],
        catalogTitle: name,
        nextId: 1,
      },
    };

    setWorks((prev) => {
      const updated = [freshWork, ...prev];
      persistWorks(updated, id);
      return updated;
    });

    setCurrentWorkId(id);
    setProducts([]);
    setCatalogTitle(name);
    setWorkName(name);
    nextId.current = 1;
    setEditing(null);
    setShowTitle(false);
  };

  const handleDeleteCurrentWork = () => {
    if (!currentWorkId) return;
    const remaining = works.filter((work) => work.id !== currentWorkId);

    if (remaining.length === 0) {
      handleCreateWork();
      return;
    }

    const fallback = remaining[0];
    setWorks(remaining);
    setCurrentWorkId(fallback.id);
    setProducts(fallback.data.products || []);
    setCatalogTitle(fallback.data.catalogTitle || "Untitled Catalog");
    setWorkName(fallback.name || fallback.data.catalogTitle || "Untitled Catalog");
    nextId.current = getSafeNextId(fallback.data.products || [], Number(fallback.data.nextId) || 1);
    setEditing(null);
    setShowTitle(false);
    persistWorks(remaining, fallback.id);
  };

  const handleRenameCurrentWork = () => {
    if (!currentWorkId) return;
    const entered = window.prompt("Enter a name for this work:", workName);
    if (entered === null) return;
    const cleaned = entered.trim();
    if (!cleaned) return;
    setWorkName(cleaned);
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
      const pickFromNormalized = (normalizedObj, aliases) => {
        for (const alias of aliases) {
          const value = normalizedObj[alias];
          if (value) return value;
        }
        return "";
      };
      const newProducts = lines.slice(1).map((line) => {
        const vals = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
        const obj = {};
        const normalizedObj = {};
        const normalizeKey = (k) => String(k || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        headers.forEach((h, i) => (obj[h] = vals[i] || ""));
        headers.forEach((h, i) => (normalizedObj[normalizeKey(h)] = vals[i] || ""));
        return {
          id: nextId.current++,
          image: null,
          price: obj.price || obj.rs || "",
          qty: "1 pcs",
          inStock: obj.instock !== "false" && obj.instock !== "0",
          description: obj.description || obj.desc || "",
          details: obj.details || obj.detail || "",
          sku: pickFromNormalized(normalizedObj, [
            "itemno",
            "itemnumber",
            "itemnum",
            "itemcode",
            "productcode",
            "productsku",
            "skucode",
            "stockkeepingunit",
            "sku",
            "item",
            "code",
            "id",
          ]),
        };
      });
      setProducts(newProducts);
      nextId.current = newProducts.length + 1;
    };
    reader.readAsText(file);
  };

  const csvRef = useRef();

  return (
    <>
      <style>{`
        @page {
          margin: 8mm;
          size: auto;
        }
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; }
          .catalog-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .page-container { padding: 0 !important; background: white !important; }
          .page-container, .page-container * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
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
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ color: "#dbe9ff", fontSize: "12px", fontWeight: "700" }}>My Works</span>
          <select
            value={currentWorkId}
            onChange={(e) => handleResumeWork(e.target.value)}
            style={{
              padding: "7px 10px",
              borderRadius: "8px",
              border: "1px solid #5f7aa5",
              background: "#f8fbff",
              color: "#0f2742",
              fontWeight: "600",
              minWidth: "220px",
            }}
          >
            {works.map((work) => (
              <option key={work.id} value={work.id}>
                {work.name} · {formatWorkDate(work.updatedAt)}
              </option>
            ))}
          </select>
          <button onClick={handleCreateWork} style={{
            padding: "8px 12px", background: "#0ea5a4", color: "#fff",
            border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "12px",
          }}>+ New Work</button>
          <button onClick={handleRenameCurrentWork} style={{
            padding: "8px 12px", background: "#1d4ed8", color: "#fff",
            border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "12px",
          }}>Rename Work</button>
          <button onClick={handleDeleteCurrentWork} style={{
            padding: "8px 12px", background: "#7f1d1d", color: "#fff",
            border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "12px",
          }}>Delete Work</button>
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
        <span>✅ <strong>Auto-save:</strong> Every change is saved in your browser instantly.</span>
        <span>💡 <strong>Tip:</strong> Click <em>Edit</em> on any card to upload a product image and fill in details.</span>
        <span>📊 <strong>CSV columns:</strong> price, description, details, item no, inStock</span>
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
