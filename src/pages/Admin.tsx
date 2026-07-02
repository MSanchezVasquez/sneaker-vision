import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shoe } from "../lib/data";
import { productService } from "../services/productService";
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  RefreshCw,
  UploadCloud,
  Sliders,
  CheckCircle,
  Tag,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "../store/useStore";
import { db, storage } from "../lib/firebase";
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Catalog additions from the PDF files uploaded by user (converted to USD/Soles)
const PDF_CATALOG_SNEAKERS: Shoe[] = [
  // NIKE 2024
  {
    id: "nike-dn-2024-black-pink",
    name: 'Nike Air Max Dn "Real Pink"',
    brand: "Nike",
    type: "Lifestyle",
    price: 95, // S/ 360
    imageUrl:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800&auto=format&fit=crop",
    description:
      "La próxima generación de tecnología Air. Las Air Max Dn cuentan con nuestro sistema de tubos Dynamic Air de doble presión, creando una sensación reactiva en cada paso. Colorway negro con cápsulas rosa brillante.",
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    colors: [
      { name: "Rosa Real", hex: "#ec4899" },
      { name: "Negro", hex: "#000000" },
    ],
    isNew: true,
  },
  {
    id: "nike-shox-tl-black",
    name: 'Nike Shox TL "Triple Black"',
    brand: "Nike",
    type: "Lifestyle",
    price: 98, // S/ 370
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    description:
      "La amortiguación mecánica llevada a su máximo nivel. Las Nike Shox TL traen de vuelta el icono de 2003 con columnas de amortiguación flexibles en toda la suela y un acabado triple negro premium.",
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    colors: [{ name: "Negro", hex: "#000000" }],
  },
  {
    id: "nike-pulse-roam-beige",
    name: 'Nike Air Max Pulse Roam "Beige Yellow"',
    brand: "Nike",
    type: "Running",
    price: 92, // S/ 349
    imageUrl:
      "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop",
    description:
      "Inspiradas en el ritmo de la ciudad, las Pulse Roam combinan una estética urbana con durabilidad deportiva. Amortiguación Air de alta respuesta y detalles en amarillo neón.",
    sizes: ["40", "41", "42", "43", "44"],
    colors: [
      { name: "Beige", hex: "#f5f5dc" },
      { name: "Amarillo", hex: "#eab308" },
    ],
  },
  {
    id: "nike-dunk-low-panda",
    name: 'Nike Dunk Low "Panda"',
    brand: "Nike",
    type: "Skate",
    price: 100, // S/ 379
    imageUrl:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    description:
      "El clásico atemporal del streetwear. El bloque de color blanco y negro retro es versátil, cómodo y perfecto para el skateboarding o el estilo casual diario.",
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
    colors: [
      { name: "Blanco", hex: "#ffffff" },
      { name: "Negro", hex: "#000000" },
    ],
  },
  {
    id: "nike-uptempo-cobalt",
    name: 'Nike Air More Uptempo "Cobalt"',
    brand: "Nike",
    type: "Basketball",
    price: 105, // S/ 399
    imageUrl:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop",
    description:
      "Con el inconfundible grafiti de AIR en los costados, estas Uptempo rinden homenaje al baloncesto de los 90. Máxima amortiguación Air-Sole visible en colorway blanco y azul cobalto.",
    sizes: ["40", "41", "42", "43", "44", "45", "46"],
    colors: [
      { name: "Blanco", hex: "#ffffff" },
      { name: "Cobalto", hex: "#1d4ed8" },
    ],
  },

  // ADIDAS / PUMA / REEBOK 2024
  {
    id: "puma-mb03-toxic",
    name: 'Puma LaMelo Ball MB.03 "Toxic"',
    brand: "Puma",
    type: "Basketball",
    price: 112, // S/ 429
    imageUrl:
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=800&auto=format&fit=crop",
    description:
      "La silueta de LaMelo Ball en un diseño psicodélico y fluorescente. Tecnología de espuma NITRO para máxima respuesta en la cancha y un agarre antideslizante sin igual.",
    sizes: ["41", "42", "43", "44", "45"],
    colors: [
      { name: "Púrpura", hex: "#a855f7" },
      { name: "Rosa", hex: "#ec4899" },
      { name: "Verde", hex: "#22c55e" },
    ],
    isNew: true,
  },
  {
    id: "adidas-forum-mid-blue",
    name: 'Adidas Forum Mid "University Blue"',
    brand: "Adidas",
    type: "Lifestyle",
    price: 98, // S/ 369
    imageUrl:
      "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?q=80&w=800&auto=format&fit=crop",
    description:
      "El clásico de baloncesto de 1984 regresa con su emblemática correa ajustable de tobillo y cuero blanco premium con detalles en azul universitario.",
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: [
      { name: "Blanco", hex: "#ffffff" },
      { name: "Azul", hex: "#3b82f6" },
    ],
  },
  {
    id: "adidas-duramo-sl-neon",
    name: 'Adidas Duramo SL "Safety Neon"',
    brand: "Adidas",
    type: "Running",
    price: 52, // S/ 199
    imageUrl:
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop",
    description:
      "Zapatilla de running ligera para entrenamientos diarios. Amortiguación Lightmotion extremadamente suave y un diseño superior de malla transpirable de color verde neón.",
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    colors: [
      { name: "Neón", hex: "#84cc16" },
      { name: "Negro", hex: "#000000" },
    ],
  },
  {
    id: "nb-9060-sea-salt",
    name: 'New Balance 9060 "Sea Salt Brown"',
    brand: "New Balance",
    type: "Lifestyle",
    price: 110, // S/ 420
    imageUrl:
      "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop",
    description:
      "La silueta retro-futurista más codiciada. Las New Balance 9060 combinan elementos de los modelos clásicos de la serie 990 con una suela ondulada exagerada y amortiguación ABZORB.",
    sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
    colors: [
      { name: "Hueso", hex: "#f3f4f6" },
      { name: "Marrón", hex: "#78350f" },
    ],
    isNew: true,
  },

  // JORDAN 2024
  {
    id: "jordan-retro-4-pine-green",
    name: 'Jordan Retro 4 SB "Pine Green"',
    brand: "Jordan",
    type: "Basketball",
    price: 98, // S/ 369
    imageUrl:
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=800&auto=format&fit=crop",
    description:
      "La aclamada colaboración de Nike SB y Jordan Brand. Reestructurada para el skate con plástico más suave, una lengüeta más acolchada y la increíble amortiguación de talón con el colorway Pine Green.",
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: [
      { name: "Blanco", hex: "#ffffff" },
      { name: "Verde Pino", hex: "#15803d" },
    ],
    isNew: true,
  },
  {
    id: "jordan-retro-3-jbalvin",
    name: 'Air Jordan Retro 3 x J Balvin "Sunset"',
    brand: "Jordan",
    type: "Basketball",
    price: 98, // S/ 369
    imageUrl:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop",
    description:
      "Diseñadas en colaboración con el icono colombiano J Balvin. Cuenta con un cuero premium color sail y una entresuela trasera que muestra un hermoso degradado de puesta de sol de Medellín.",
    sizes: ["40", "41", "42", "43", "44", "45", "46"],
    colors: [
      { name: "Hueso", hex: "#fafaf9" },
      { name: "Sunset Gradient", hex: "#f43f5e" },
    ],
  },
  {
    id: "jordan-luka2-volt",
    name: 'Jordan Luka 2 "Black Volt"',
    brand: "Jordan",
    type: "Basketball",
    price: 102, // S/ 390
    imageUrl:
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=800&auto=format&fit=crop",
    description:
      "Diseñadas para el estilo dinámico de juego de Luka Dončić. Soporte lateral optimizado, amortiguación reactiva Formula 23 y una estética negra y verde volt vibrante.",
    sizes: ["41", "42", "43", "44", "45"],
    colors: [
      { name: "Negro", hex: "#000000" },
      { name: "Volt", hex: "#a3e635" },
    ],
  },
];

export default function Admin() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Shoe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    type: "Lifestyle" as Shoe["type"],
    price: 0,
    imageUrl: "",
    description: "",
    sizes: "39, 40, 41, 42, 43, 44",
    colors: "Blanco:#ffffff, Negro:#000000",
    isNew: false,
  });

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditClick = (shoe: Shoe) => {
    setIsEditing(true);
    setCurrentId(shoe.id);

    // Parse colors back to string format for the form
    const colorStr = shoe.colors
      ? shoe.colors
          .map(
            (c) =>
              `${window.btoa(encodeURIComponent(c.name)) ? c.name : c.name}:${c.hex}`,
          )
          .join(", ")
      : "";

    setFormData({
      name: shoe.name || "",
      brand: shoe.brand || "",
      type: shoe.type || "Lifestyle",
      price: shoe.price || 0,
      imageUrl: shoe.imageUrl || "",
      description: shoe.description || "",
      sizes: shoe.sizes ? shoe.sizes.join(", ") : "39, 40, 41, 42, 43, 44",
      colors: colorStr || "",
      isNew: !!shoe.isNew,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: "",
      brand: "",
      type: "Lifestyle",
      price: 0,
      imageUrl: "",
      description: "",
      sizes: "39, 40, 41, 42, 43, 44",
      colors: "Blanco:#ffffff, Negro:#000000",
      isNew: false,
    });
  };

  const handleDeleteClick = async (id: string) => {
    if (
      !window.confirm(
        "¿Estás seguro de que deseas eliminar este sneaker del catálogo?",
      )
    )
      return;
    try {
      await deleteDoc(doc(db, "products", id));
      showToast("Producto eliminado correctamente", "success");
      fetchProducts();
    } catch (error: any) {
      console.error(error);
      const errMsg =
        error?.message ||
        (typeof error === "string" ? error : "Error desconocido");
      showToast(`Error al eliminar producto: ${errMsg}`, "error");
    }
  };

  const showToast = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Process input formats
    const sizeArray = formData.sizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const colorArray = formData.colors
      .split(",")
      .map((c) => {
        const [name, hex] = c.split(":").map((part) => part.trim());
        return name && hex ? { name, hex } : null;
      })
      .filter(Boolean) as { name: string; hex: string }[];

    const finalId = currentId || "shoe_" + Date.now();

    const shoePayload: Shoe = {
      id: finalId,
      name: formData.name,
      brand: formData.brand,
      type: formData.type,
      price: Number(formData.price),
      imageUrl:
        formData.imageUrl ||
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
      gallery: [
        formData.imageUrl ||
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
      ],
      description: formData.description,
      sizes: sizeArray,
      colors: colorArray,
      isNew: formData.isNew,
    };

    try {
      const docRef = doc(db, "products", finalId);
      await setDoc(
        docRef,
        {
          ...shoePayload,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      showToast(
        isEditing
          ? "Sneaker actualizado correctamente"
          : "Nuevo sneaker añadido al catálogo",
        "success",
      );
      handleResetForm();
      fetchProducts();
    } catch (error: any) {
      console.error(error);
      const errMsg =
        error?.message ||
        (typeof error === "string" ? error : "Error desconocido");
      showToast(`Error al guardar: ${errMsg}`, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validaciones básicas antes de subir
    if (!file.type.startsWith("image/")) {
      showToast("El archivo debe ser una imagen (JPG, PNG, WEBP...).", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("La imagen no debe superar los 5MB.", "error");
      return;
    }

    setIsUploadingImage(true);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const storagePath = `products/${Date.now()}-${safeName}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      setFormData((prev) => ({ ...prev, imageUrl: downloadUrl }));
      showToast("Imagen subida con éxito.", "success");
    } catch (error: any) {
      console.error("Error subiendo imagen a Firebase Storage:", error);
      const errMsg = error?.message || "Error desconocido";
      showToast(`No se pudo subir la imagen: ${errMsg}`, "error");
    } finally {
      setIsUploadingImage(false);
      // Permite volver a seleccionar el mismo archivo si el usuario lo desea
      e.target.value = "";
    }
  };

  const handleSeedCatalog = async () => {
    if (
      !window.confirm(
        "¿Deseas agregar todos los modelos destacados de los nuevos catálogos de Nike, Adidas, Jordan y Puma a tu base de datos?",
      )
    )
      return;
    setIsSaving(true);
    try {
      let count = 0;
      for (const shoe of PDF_CATALOG_SNEAKERS) {
        const docRef = doc(db, "products", shoe.id);
        await setDoc(
          docRef,
          {
            ...shoe,
            createdAt: serverTimestamp(),
          },
          { merge: true },
        );
        count++;
      }
      showToast(
        `¡Se han importado ${count} sneakers icónicos de los catálogos en PDF con éxito!`,
        "success",
      );
      fetchProducts();
    } catch (error: any) {
      console.error(error);
      const errMsg =
        error?.message ||
        (typeof error === "string" ? error : "Error desconocido");
      showToast(`Error en importación masiva: ${errMsg}`, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-slate-950 py-12 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-[0.2em] mb-2 block">
              Base de Datos Firestore
            </span>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">
              PANEL DE ADMINISTRACIÓN
            </h1>
            <p className="text-gray-500 dark:text-slate-400 text-sm max-w-xl mt-1">
              Agrega, edita y gestiona el catálogo de zapatillas de tu tienda
              directamente en la nube.
            </p>
          </div>

          <button
            onClick={handleSeedCatalog}
            disabled={isSaving}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all disabled:opacity-50"
          >
            <UploadCloud size={16} />
            Importar Catálogos PDF
          </button>
        </header>

        {/* Message Toast */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl mb-8 flex items-center gap-3 font-bold text-sm shadow-md border ${
              message.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30"
                : "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30"
            }`}
          >
            <CheckCircle size={18} />
            {message.text}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add / Edit Form */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[32px] p-6 shadow-sm h-fit">
            <h2 className="text-xl font-black tracking-tight mb-6 flex items-center gap-2">
              <Sliders className="text-blue-600 w-5 h-5" />
              {isEditing ? "EDITAR SNEAKER" : "AGREGAR NUEVO SNEAKER"}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-1.5">
                  Nombre del Sneaker
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Nike Air Max Dn 2024"
                  className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-1.5">
                    Marca
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Nike, Adidas, Puma"
                    className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
                    value={formData.brand || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-1.5">
                    Categoría
                  </label>
                  <select
                    className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
                    value={formData.type || "Lifestyle"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as Shoe["type"],
                      })
                    }
                  >
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Running">Running</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Skate">Skate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-1.5">
                    Precio (USD)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Ej. 120"
                    className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
                    value={formData.price || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="flex items-end pb-3 pl-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4"
                      checked={!!formData.isNew}
                      onChange={(e) =>
                        setFormData({ ...formData, isNew: e.target.checked })
                      }
                    />
                    <span className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-slate-500">
                      ¿Es Novedad?
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-1.5">
                  Imagen del producto
                </label>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 flex items-center justify-center border border-gray-100 dark:border-slate-800">
                    {formData.imageUrl ? (
                      <img
                        src={formData.imageUrl}
                        alt="Vista previa"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UploadCloud
                        size={20}
                        className="text-gray-300 dark:text-slate-600"
                      />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label
                      className={`flex items-center justify-center gap-2 w-full border-2 border-dashed rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                        isUploadingImage
                          ? "border-blue-300 text-blue-400 cursor-wait"
                          : "border-gray-300 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-blue-500 hover:text-blue-600"
                      }`}
                    >
                      {isUploadingImage ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          Subiendo imagen...
                        </>
                      ) : (
                        <>
                          <UploadCloud size={14} />
                          Subir foto desde tu computadora
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageFileUpload}
                        disabled={isUploadingImage}
                      />
                    </label>
                    <input
                      type="url"
                      placeholder="O pega una URL de imagen: https://..."
                      className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
                      value={formData.imageUrl || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-1.5">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  placeholder="Explica detalles clave, tecnología, confort..."
                  className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100 resize-none"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-1.5">
                  Tallas disponibles (Separadas por comas)
                </label>
                <input
                  type="text"
                  placeholder="38, 39, 40, 41, 42, 43"
                  className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
                  value={formData.sizes || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, sizes: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-1.5">
                  Colores (Nombre:Hex, separados por comas)
                </label>
                <input
                  type="text"
                  placeholder="Rojo:#ef4444, Negro:#000000"
                  className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
                  value={formData.colors || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, colors: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-3 pt-2">
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSaving || isUploadingImage}
                  className="flex-2 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  {isSaving ? (
                    <RefreshCw className="animate-spin w-4 h-4" />
                  ) : (
                    <Check size={16} />
                  )}
                  {isEditing ? "GUARDAR CAMBIOS" : "AÑADIR PRODUCTO"}
                </button>
              </div>
            </form>
          </div>

          {/* Catalog Sneaker List */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[32px] p-6 shadow-sm overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                <ShoppingBag className="text-blue-600 w-5 h-5" />
                SNEAKERS EN EL CATÁLOGO ({products.length})
              </h2>
              <button
                onClick={fetchProducts}
                className="p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-full text-gray-400 hover:text-blue-600 transition-all"
                title="Sincronizar"
              >
                <RefreshCw size={18} />
              </button>
            </div>

            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-24 text-gray-400">
                <RefreshCw className="animate-spin text-blue-600 w-8 h-8 mb-2" />
                <p className="text-sm font-bold">Cargando base de datos...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-24 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-gray-300">
                  <ShoppingBag size={28} />
                </div>
                <div>
                  <p className="font-bold text-lg text-slate-800 dark:text-slate-100">
                    Catálogo vacío
                  </p>
                  <p className="text-sm text-gray-400 dark:text-slate-500 max-w-sm mt-1">
                    No hay ningún producto registrado en Firestore. Pulsa
                    "Importar Catálogos PDF" o añade uno manualmente.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-y-auto max-h-[650px] pr-1 space-y-4">
                {products.map((shoe) => (
                  <div
                    key={shoe.id}
                    className="flex gap-4 p-4 bg-gray-50 dark:bg-slate-800/40 rounded-2xl border border-gray-100/50 dark:border-slate-800/40 hover:border-blue-500/20 dark:hover:border-blue-500/20 transition-all group"
                  >
                    <img
                      src={shoe.imageUrl}
                      alt={shoe.name}
                      className="w-20 h-20 object-cover rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full">
                          {shoe.brand}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                          {shoe.type}
                        </span>
                        {shoe.isNew && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded-full">
                            Nuevo
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">
                        {shoe.name}
                      </h3>
                      <p className="text-xs text-gray-400 dark:text-slate-500 line-clamp-1 mt-0.5 mb-2">
                        {shoe.description || "Sin descripción"}
                      </p>

                      <div className="flex items-center justify-between">
                        <p className="font-black text-sm text-blue-600 dark:text-blue-400">
                          ${shoe.price}
                        </p>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(shoe)}
                            className="p-2 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 border border-gray-100 dark:border-slate-700 text-gray-400 hover:text-blue-600 rounded-xl transition-all shadow-sm"
                            title="Editar"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(shoe.id)}
                            className="p-2 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-gray-100 dark:border-slate-700 text-gray-400 hover:text-rose-600 rounded-xl transition-all shadow-sm"
                            title="Eliminar"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Instruction block */}
            <div className="mt-6 p-4 bg-blue-50/50 dark:bg-blue-950/10 rounded-2xl border border-blue-100/30 dark:border-blue-900/10 text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <p className="font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1">
                <Tag size={12} />
                ¿CÓMO FUNCIONA ESTE PANEL DE DATOS?
              </p>
              <p>
                Este panel conecta directamente con la base de datos{" "}
                <strong>Cloud Firestore</strong> provista por Firebase. Cada
                zapatilla agregada o editada aquí se sincronizará
                automáticamente para todos los usuarios que visiten la tienda,
                incluyendo el catálogo, las secciones de Hombre/Mujer y la
                búsqueda por imágenes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
