import { useEffect, useRef, useState } from "react";
import "./App.css";
import hogaza from "./assets/hogaza.jpg";
import logo from "./assets/logo.png";

const PRODUCTOS = [
  {
    nombre: "Hogaza Clásica",
    desc: "Crujiente por fuera, suave por dentro. Sabor profundo.",
    badge: "Más vendida",
  },
  {
    nombre: "Integral",
    desc: "Harina integral y fermentación lenta para mejor textura.",
    badge: "Nutritiva",
  },
  {
    nombre: "Multigrano",
    desc: "Semillas tostadas y aroma intenso en cada rebanada.",
    badge: "Especial",
  },
];

const WHATSAPP_NUMBER = "5217226492310";
const WHATSAPP_MESSAGE =
  "Hola 👋 Me gustaría hacer un pedido en Madre Mía. ¿Qué hogazas tienen disponibles hoy?";

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const heroRef = useRef(null);
  const productosRef = useRef(null);
  const nosotrosRef = useRef(null);
  const contactoRef = useRef(null);

  // Navbar style on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar menú móvil al cambiar tamaño
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scrollTo = (ref) => {
    setMenuOpen(false);
    ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      WHATSAPP_MESSAGE
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Reveal animation (segura: si algo falla, no se queda invisible)
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
          <li>
            <button className="navBtn" onClick={() => scrollTo(heroRef)}>
              Inicio
            </button>
          </li>
          <li>
            <button className="navBtn" onClick={() => scrollTo(productosRef)}>
              Productos
            </button>
          </li>
          <li>
            <button className="navBtn" onClick={() => scrollTo(nosotrosRef)}>
              Nosotros
            </button>
          </li>
          <li>
            <button className="navBtn" onClick={() => scrollTo(contactoRef)}>
              Contacto
            </button>
          </li>
        </ul>

        {/* Hamburguesa */}
        <button
          className={`burger ${menuOpen ? "burger-open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Menú móvil */}
      <div className={`mobileMenu ${menuOpen ? "mobileMenu-open" : ""}`}>
        <button className="mobileLink" onClick={() => scrollTo(heroRef)}>
          Inicio
        </button>
        <button className="mobileLink" onClick={() => scrollTo(productosRef)}>
          Productos
        </button>
        <button className="mobileLink" onClick={() => scrollTo(nosotrosRef)}>
          Nosotros
        </button>
        <button className="mobileLink" onClick={() => scrollTo(contactoRef)}>
          Contacto
        </button>
      </div>

      {/* HERO */}
      <header
        ref={heroRef}
        className="hero"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(0, 0, 0, 0.30),
              rgba(0, 0, 0, 0.30)
            ),
            url(${hogaza})
          `,
        }}
      >
        <div className="heroInner">
          <div className="heroContent reveal-anim show">
            <p className="kicker">Masa madre • Fermentación lenta • Hecho a mano</p>
            <h2>Pan de masa madre, bien hecho.</h2>
            <p className="heroLead">
              Corteza crujiente, miga suave y sabor profundo. Horneamos en lotes pequeños con procesos
              artesanales.
            </p>

            <div className="heroCtas">
              <button className="btnPrimary" onClick={() => scrollTo(productosRef)}>
                Ver productos
              </button>
              <button className="btnGhost" onClick={openWhatsApp}>
                WhatsApp
              </button>
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
              <div className="bullet">
                <span className="dot" />
                <span>Fermentación natural (sin atajos).</span>
              </div>
              <div className="bullet">
                <span className="dot" />
                <span>Horneado diario en lotes pequeños.</span>
              </div>
              <div className="bullet">
                <span className="dot" />
                <span>Ingredientes simples, resultados grandes.</span>
              </div>
            </div>
          </div>

          <div className="sectionCard">
            <h4>Proceso artesanal</h4>
            <div className="steps">
              <div className="step">
                <span className="stepNum">01</span>
                <span>Alimentamos la masa madre</span>
              </div>
              <div className="step">
                <span className="stepNum">02</span>
                <span>Amasado + reposo lento</span>
              </div>
              <div className="step">
                <span className="stepNum">03</span>
                <span>Formado y horneado</span>
              </div>
            </div>
            <button className="btnSmall" onClick={openWhatsApp}>
              Pedir por WhatsApp
            </button>
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
          {PRODUCTOS.map((p) => (
            <article key={p.nombre} className="card">
              <div className="cardTop">
                <span className="badge">{p.badge}</span>
              </div>
              <h4>{p.nombre}</h4>
              <p>{p.desc}</p>
              <button className="cardBtn" onClick={openWhatsApp}>
                Pedir
              </button>
            </article>
          ))}
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
            <button className="btnPrimary" onClick={openWhatsApp}>
              WhatsApp
            </button>
            <button className="btnGhost" onClick={openWhatsApp}>
              Hacer pedido
            </button>
          </div>
        </div>
      </section>

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