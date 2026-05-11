import { useEffect, useRef, useState } from "react";
import "./App.css";
import hogaza from "./assets/hogaza.jpg";
import logo from "./assets/logo.png";
import { productosService } from './services/api';
 
const WHATSAPP_NUMBER = "5217226492310";
const WHATSAPP_MESSAGE =
  "Hola 👋 Me gustaría hacer un pedido en Madre Mía. ¿Qué hogazas tienen disponibles hoy?";
 
const FORM_INICIAL = {
  nombre: "",
  descripcion: "",
  precio: "",
  disponible: true,
};
 
const ADMIN_PASSWORD = "madremia2026";
 
function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(FORM_INICIAL);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [esAdmin, setEsAdmin] = useState(false);
 
  const heroRef = useRef(null);
  const productosRef = useRef(null);
  const nosotrosRef = useRef(null);
  const contactoRef = useRef(null);
  const adminRef = useRef(null);
 
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
 
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
 
  useEffect(() => {
    productosService.getAll()
      .then(setProductos)
      .finally(() => setLoading(false));
  }, []);
 
  const scrollTo = (ref) => {
    setMenuOpen(false);
    ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
 
  const openWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };
 
  useEffect(() => {
    const els = document.querySelectorAll(".reveal-anim");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("show");
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
 
  const handleLogin = () => {
    const pass = prompt("Contraseña de administrador:");
    if (pass === ADMIN_PASSWORD) {
      setEsAdmin(true);
      setTimeout(() => scrollTo(adminRef), 300);
    } else if (pass !== null) {
      alert("Contraseña incorrecta.");
    }
  };
 
  const handleLogout = () => {
    setEsAdmin(false);
    setForm(FORM_INICIAL);
    setMensaje(null);
  };
 
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (!form.nombre || !form.descripcion || !form.precio) {
      setMensaje({ tipo: "error", texto: "Por favor llena todos los campos." });
      return;
    }
 
    setEnviando(true);
    setMensaje(null);
 
    try {
      const nuevo = await productosService.create({
        ...form,
        precio: Number(form.precio),
      });
      setProductos((prev) => [...prev, nuevo]);
      setForm(FORM_INICIAL);
      setMensaje({ tipo: "ok", texto: "¡Producto creado correctamente!" });
    } catch {
      setMensaje({ tipo: "error", texto: "Error al crear el producto. Intenta de nuevo." });
    } finally {
      setEnviando(false);
    }
  };
 
  // Eliminar producto
  const handleEliminar = async (id) => {
    const confirmar = window.confirm("¿Seguro que quieres eliminar este producto?");
    if (!confirmar) return;
 
    try {
      await productosService.delete(id);
      setProductos((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("Error al eliminar el producto. Intenta de nuevo.");
    }
  };
 
  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        <button className="logoBtn" onClick={() => scrollTo(heroRef)} aria-label="Ir al inicio">
          <img
            src={logo}
            alt="Madre Mía"
            className={`logoImgLarge ${scrolled ? "logoDark" : "logoWhite"}`}
          />
        </button>
 
        <ul className="navLinks">
          <li><button className="navBtn" onClick={() => scrollTo(heroRef)}>Inicio</button></li>
          <li><button className="navBtn" onClick={() => scrollTo(productosRef)}>Productos</button></li>
          <li><button className="navBtn" onClick={() => scrollTo(nosotrosRef)}>Nosotros</button></li>
          <li><button className="navBtn" onClick={() => scrollTo(contactoRef)}>Contacto</button></li>
          <li>
            {esAdmin ? (
              <button className="navBtn adminActive" onClick={handleLogout}>
                Cerrar sesión
              </button>
            ) : (
              <button className="navBtn" onClick={handleLogin}>
                Admin
              </button>
            )}
          </li>
        </ul>
 
        <button
          className={`burger ${menuOpen ? "burger-open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </nav>
 
      {/* Menú móvil */}
      <div className={`mobileMenu ${menuOpen ? "mobileMenu-open" : ""}`}>
        <button className="mobileLink" onClick={() => scrollTo(heroRef)}>Inicio</button>
        <button className="mobileLink" onClick={() => scrollTo(productosRef)}>Productos</button>
        <button className="mobileLink" onClick={() => scrollTo(nosotrosRef)}>Nosotros</button>
        <button className="mobileLink" onClick={() => scrollTo(contactoRef)}>Contacto</button>
        <button className="mobileLink" onClick={esAdmin ? handleLogout : handleLogin}>
          {esAdmin ? "Cerrar sesión" : "Admin"}
        </button>
      </div>
 
      {/* HERO */}
      <header
        ref={heroRef}
        className="hero"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.30), rgba(0,0,0,0.30)),
            url(${hogaza})
          `,
        }}
      >
        <div className="heroInner">
          <div className="heroContent reveal-anim show">
            <p className="kicker">Masa madre • Fermentación lenta • Hecho a mano</p>
            <h2>Pan de masa madre, bien hecho.</h2>
            <p className="heroLead">
              Corteza crujiente, miga suave y sabor profundo. Horneamos en lotes pequeños con procesos artesanales.
            </p>
            <div className="heroCtas">
              <button className="btnPrimary" onClick={() => scrollTo(productosRef)}>Ver productos</button>
              <button className="btnGhost" onClick={openWhatsApp}>WhatsApp</button>
            </div>
            <div className="heroMeta">
              <div className="metaItem">
                <span className="metaTop">24–48h</span>
                <span className="metaBottom">Fermentación</span>
              </div>
              <div className="metaItem">
                <span className="metaTop">Lotes</span>
                <span className="metaBottom">Pequeños</span>
              </div>
              <div className="metaItem">
                <span className="metaTop">Sabor</span>
                <span className="metaBottom">Auténtico</span>
              </div>
            </div>
          </div>
        </div>
      </header>
 
      {/* NOSOTROS */}
      <section ref={nosotrosRef} className="section reveal-anim">
        <div className="sectionGrid">
          <div className="sectionText">
            <h3>Nuestra masa madre</h3>
            <p>
              La masa madre es un cultivo vivo. Con paciencia y cuidado, logramos un pan con mejor textura,
              aroma y digestibilidad. No aceleramos el proceso: lo respetamos.
            </p>
            <div className="bullets">
              <div className="bullet"><span className="dot" /><span>Fermentación natural (sin atajos).</span></div>
              <div className="bullet"><span className="dot" /><span>Horneado diario en lotes pequeños.</span></div>
              <div className="bullet"><span className="dot" /><span>Ingredientes simples, resultados grandes.</span></div>
            </div>
          </div>
          <div className="sectionCard">
            <h4>Proceso artesanal</h4>
            <div className="steps">
              <div className="step"><span className="stepNum">01</span><span>Alimentamos la masa madre</span></div>
              <div className="step"><span className="stepNum">02</span><span>Amasado + reposo lento</span></div>
              <div className="step"><span className="stepNum">03</span><span>Formado y horneado</span></div>
            </div>
            <button className="btnSmall" onClick={openWhatsApp}>Pedir por WhatsApp</button>
          </div>
        </div>
      </section>
 
      {/* PRODUCTOS */}
      <section ref={productosRef} className="section sectionAlt reveal-anim">
        <div className="sectionHeader">
          <h3>Nuestras hogazas</h3>
          <p>Clásicos de masa madre pensados para todos los días.</p>
        </div>
        <div className="cards">
          {loading ? (
            <p style={{ color: "var(--rojo)" }}>Cargando productos...</p>
          ) : productos.length === 0 ? (
            <p style={{ color: "var(--rojo)" }}>No hay productos disponibles por el momento.</p>
          ) : (
            productos.map((p) => (
              <article key={p._id} className="card">
                <div className="cardTop">
                  <span className="badge">{p.disponible ? "Disponible" : "Agotado"}</span>
                </div>
                <h4>{p.nombre}</h4>
                <p>{p.descripcion}</p>
                <p><strong>${p.precio}</strong></p>
                <div className="cardActions">
                  <button className="cardBtn" onClick={openWhatsApp}>Pedir</button>
                  {esAdmin && (
                    <button
                      className="cardBtnEliminar"
                      onClick={() => handleEliminar(p._id)}
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </section>
 
      {/* CONTACTO */}
      <section ref={contactoRef} className="section reveal-anim">
        <div className="cta">
          <div>
            <h3>¿List@ para tu próxima hogaza?</h3>
            <p>Escríbenos y te decimos disponibilidad y tiempos de entrega.</p>
          </div>
          <div className="ctaActions">
            <button className="btnPrimary" onClick={openWhatsApp}>WhatsApp</button>
            <button className="btnGhost" onClick={openWhatsApp}>Hacer pedido</button>
          </div>
        </div>
      </section>
 
      {/* ADMIN — solo visible si esAdmin es true */}
      {esAdmin && (
        <section ref={adminRef} className="section sectionAlt reveal-anim show">
          <div className="sectionHeader">
            <h3>Agregar producto</h3>
            <p>Llena el formulario para añadir una nueva hogaza al catálogo.</p>
          </div>
 
          <div className="formWrapper">
            <form className="productoForm" onSubmit={handleSubmit}>
 
              <div className="formGroup">
                <label htmlFor="nombre">Nombre</label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  placeholder="Ej: Hogaza de centeno"
                  value={form.nombre}
                  onChange={handleChange}
                />
              </div>
 
              <div className="formGroup">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  placeholder="Ej: Corteza crujiente con semillas de amapola..."
                  value={form.descripcion}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
 
              <div className="formGroup">
                <label htmlFor="precio">Precio ($)</label>
                <input
                  id="precio"
                  name="precio"
                  type="number"
                  placeholder="Ej: 120"
                  value={form.precio}
                  onChange={handleChange}
                  min="0"
                />
              </div>
 
              <div className="formGroupCheck">
                <input
                  id="disponible"
                  name="disponible"
                  type="checkbox"
                  checked={form.disponible}
                  onChange={handleChange}
                />
                <label htmlFor="disponible">Disponible</label>
              </div>
 
              {mensaje && (
                <p className={mensaje.tipo === "ok" ? "formMsgOk" : "formMsgError"}>
                  {mensaje.texto}
                </p>
              )}
 
              <button className="btnPrimary" type="submit" disabled={enviando}>
                {enviando ? "Guardando..." : "Agregar producto"}
              </button>
 
            </form>
          </div>
        </section>
      )}
 
      {/* Botón flotante WhatsApp */}
      <button className="waFloat" onClick={openWhatsApp} aria-label="WhatsApp">
        WhatsApp
      </button>
 
      <footer className="footer">
        <p>© 2026 Madre Mía Panadería</p>
      </footer>
    </div>
  );
}
 
export default App;
 