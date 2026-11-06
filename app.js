/* ==========================================================
   Arma la página a partir de contenido.js.
   No necesitas editar este archivo para cambiar textos o fotos.
   ========================================================== */
(function () {
  "use strict";

  const C = window.CONTENIDO;
  if (!C) { mostrarError(); return; }

  const $ = (sel, raiz) => (raiz || document).querySelector(sel);
  const reducirMovimiento = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pantallaTactil = !matchMedia("(hover: hover)").matches;
  const audio = $("#audio");
  const contenido = $("#contenido");

  // ============================================================ utilidades
  function el(tag, attrs, ...hijos) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else if (k.startsWith("on") && typeof v === "function") n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? "" : v);
    }
    for (const h of hijos.flat(Infinity)) if (h != null && h !== false && h !== "") n.append(h);
    return n;
  }

  // Convierte un texto en párrafos (separados por una línea en blanco)
  function parrafos(texto) {
    return String(texto || "")
      .trim()
      .split(/\n\s*\n/)
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => el("p", { text: t }));
  }

  // Crea una foto; si el archivo no existe, muestra un recuadro con el nombre que falta
  function foto(src, alt, inmediata) {
    const falta = () =>
      el("div", { class: "foto-falta" },
        el("span", { class: "icono", text: "📷", "aria-hidden": "true" }),
        el("span", { text: src ? "Falta esta foto:" : "Aquí va una foto" }),
        src ? el("code", { text: src }) : null);
    if (!src) return falta();
    const img = el("img", { src, alt: alt || "", loading: inmediata ? "eager" : "lazy", decoding: "async", draggable: "false" });
    img.addEventListener("error", () => { if (img.parentNode) img.replaceWith(falta()); }, { once: true });
    return img;
  }

  function encabezado(d, tituloPorDefecto) {
    return el("header", { class: "encabezado revelar" },
      el("h2", { text: d.titulo || tituloPorDefecto }),
      d.subtitulo ? el("p", { text: d.subtitulo }) : null);
  }

  const giros = [-3, 2.5, -1.5, 4, -2.5, 1.5, -4, 3];
  const giro = (i) => giros[i % giros.length];

  function crearDestellos(cantidad) {
    const caja = el("div", { class: "destellos", "aria-hidden": "true" });
    for (let i = 0; i < cantidad; i++) {
      const s = el("span", { text: Math.random() < 0.7 ? "✦" : "✧" });
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.fontSize = 8 + Math.random() * 14 + "px";
      s.style.animationDelay = Math.random() * 4 + "s";
      s.style.animationDuration = 3 + Math.random() * 3 + "s";
      caja.append(s);
    }
    return caja;
  }

  function leerFecha(s) {
    const m = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{2}))?/.exec(String(s || "").trim());
    return m ? new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0)) : null;
  }

  function centroDe(nodo) {
    const r = nodo.getBoundingClientRect();
    return { x: (r.left + r.width / 2) / innerWidth, y: (r.top + r.height / 2) / innerHeight };
  }

  // Salta a un elemento sin animación (se usa detrás de la animación del sobre)
  function saltarA(nodo) {
    const html = document.documentElement;
    html.style.scrollBehavior = "auto";
    nodo.scrollIntoView({ block: "start" });
    html.style.scrollBehavior = "";
  }

  // ============================================================ confeti
  function confeti(opciones) {
    if (typeof window.confetti !== "function") return;
    const c = C.colores || {};
    window.confetti(Object.assign({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.6 },
      colors: [c.acento || "#d4a64a", c.suave || "#f7c6d0", "#ffffff", "#fff6d8", c.principal || "#1e2a5a"],
      disableForReducedMotion: true,
      zIndex: 200,
    }, opciones));
  }

  function lluviaConfeti() {
    const fin = Date.now() + 1500;
    (function cuadro() {
      confeti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.8 } });
      confeti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.8 } });
      if (Date.now() < fin) requestAnimationFrame(cuadro);
    })();
  }

  // ============================================================ colores y título
  const colores = C.colores || {};
  ["principal", "acento", "suave"].forEach((k) => {
    if (colores[k]) document.documentElement.style.setProperty("--" + k, colores[k]);
  });
  if (colores.principal) $('meta[name="theme-color"]').setAttribute("content", colores.principal);
  if (C.nombre) document.title = `¡Felicidades, ${C.nombre}! 🎓`;

  // ============================================================ 1. PORTADA
  let botonCarta;

  function armarPortada() {
    const p = C.portada || {};
    const portada = $("#portada");
    if (p.encuadre) portada.style.setProperty("--encuadre", p.encuadre);

    const gorro = el("button", { class: "gorro", type: "button", "aria-label": "Gorro de graduación", text: "🎓" });
    const preTitulo = [C.generacion, C.colegio].filter(Boolean).join(" · ");
    const contador = textoContador();
    botonCarta = el("button", { class: "boton boton-carta", type: "button", text: p.boton || "💌 Toca aquí, te escribí una carta" });
    botonCarta.addEventListener("click", abrirCarta);

    portada.append(
      el("figure", { class: "portada-foto" }, foto(p.foto, C.nombre, true)),
      crearDestellos(18),
      el("div", { class: "portada-texto" },
        el("p", { class: "pre-titulo" }, gorro, preTitulo ? el("span", { text: preTitulo }) : null),
        el("h1", {}, (p.saludo || "¡Felicidades,") + " ", el("span", { class: "nombre-dorado", text: (C.nombre || "") + "!" })),
        p.frase ? el("p", { class: "frase", text: p.frase }) : null,
        contador ? el("div", { class: "contador", text: contador }) : null,
        botonCarta));

    // Mensaje secreto: tocar el gorro 5 veces seguidas
    let toques = 0;
    let reinicio;
    gorro.addEventListener("animationend", (e) => { if (e.animationName === "saltar") gorro.classList.remove("salto"); });
    gorro.addEventListener("click", () => {
      gorro.classList.remove("salto");
      void gorro.offsetWidth; // reinicia la animación
      gorro.classList.add("salto");
      confeti({ particleCount: 25, spread: 50, startVelocity: 22, origin: centroDe(gorro) });
      toques++;
      clearTimeout(reinicio);
      reinicio = setTimeout(() => { toques = 0; }, 1500);
      if (toques >= 5 && C.mensajeSecreto) {
        toques = 0;
        abrirModal(C.mensajeSecreto);
        lluviaConfeti();
      }
    });
  }

  function textoContador() {
    const fecha = leerFecha(C.fechaGraduacion);
    if (!fecha) return "";
    const ahora = new Date();
    const inicioDia = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dias = Math.round((inicioDia(fecha) - inicioDia(ahora)) / 86400000);
    if (dias > 1) return `⏳ Faltan ${dias} días para tu graduación`;
    if (dias === 1) return "⏳ ¡Mañana es tu graduación!";
    if (dias === 0) return fecha > ahora ? "🎓 ¡Hoy es tu graduación!" : "🎉 ¡Hoy te graduaste!";
    return `🎓 Egresada hace ${-dias} ${dias === -1 ? "día" : "días"}`;
  }

  // ============================================================ abrir la carta
  let cartaAbierta = false;

  function abrirCarta() {
    const seccionCarta = $("#carta");
    if (cartaAbierta) { seccionCarta.scrollIntoView({ behavior: "smooth" }); return; }
    cartaAbierta = true;
    if (C.musica && audio.paused) audio.play().catch(() => {}); // la canción empieza aquí

    const mostrar = () => {
      contenido.hidden = false;
      document.body.classList.add("abierta");
      botonCarta.textContent = "💌 Volver a leer la carta";
      saltarA(seccionCarta);
    };

    if (reducirMovimiento) { mostrar(); return; }

    const apertura = $("#apertura");
    const sobre = $(".sobre", apertura);
    apertura.hidden = false;
    setTimeout(() => sobre.classList.add("abierta"), 600);   // se abre la solapa
    setTimeout(() => sobre.classList.add("afuera"), 1150);   // sale el papel
    setTimeout(() => { mostrar(); apertura.classList.add("saliendo"); lluviaConfeti(); }, 2000);
    setTimeout(() => {
      apertura.hidden = true;
      apertura.classList.remove("saliendo");
      sobre.classList.remove("abierta", "afuera");
    }, 2500);
  }

  function prepararSobre() {
    $("#apertura .sello").textContent = (C.nombre || "♥").trim().charAt(0).toUpperCase();
    $("#apertura .sobre-para").textContent = C.nombre ? "Para: " + C.nombre : "";
  }

  // ============================================================ 2. CARTA
  function armarCarta() {
    const d = C.carta || {};
    const seccion = el("section", { id: "carta", class: "bloque" });
    const botonSeguir = el("button", { class: "boton", type: "button" },
      d.boton || "Ahora mira esto 📸", el("span", { text: "↓", "aria-hidden": "true" }));
    botonSeguir.addEventListener("click", () => {
      const siguiente = seccion.nextElementSibling;
      if (siguiente) siguiente.scrollIntoView({ behavior: "smooth" });
    });

    seccion.append(el("div", { class: "contenedor" },
      d.titulo ? encabezado(d) : null,
      el("article", { class: "carta" },
        d.saludo ? el("p", { class: "saludo", text: d.saludo }) : null,
        parrafos(d.texto),
        d.despedida ? el("p", { class: "despedida", text: d.despedida }) : null,
        d.firma ? el("p", { class: "firma", text: d.firma }) : null),
      el("div", { class: "seguir" }, botonSeguir)));
    return seccion;
  }

  // ============================================================ 3. FOTOS (montón)
  function armarFotos() {
    const d = C.fotos || {};
    const lista = (d.lista || []).filter((f) => f && f.foto);
    if (d.mostrar === false || !lista.length) return null;

    const monton = el("div", { class: "monton", role: "group", "aria-label": "Fotos" });
    const tarjetas = lista.map((f, i) =>
      el("figure", { class: "polaroid", "data-i": String(i), style: `--rot:${giro(i)}deg` },
        el("div", { class: "marco" }, foto(f.foto, f.texto || `Foto ${i + 1}`, i < 3)),
        el("figcaption", { text: f.texto || "" })));
    monton.append(...tarjetas);

    let orden = tarjetas.slice(); // orden[0] es la foto de arriba
    let ocupado = false;
    const contador = el("span", { class: "monton-contador", "aria-live": "polite" });

    function acomodar() {
      orden.forEach((t, k) => {
        t.style.zIndex = String(orden.length - k);
        t.setAttribute("aria-hidden", k === 0 ? "false" : "true");
      });
      contador.textContent = `${+orden[0].dataset.i + 1} / ${orden.length}`;
    }

    function siguiente(dir) {
      if (ocupado || orden.length < 2) return;
      ocupado = true;
      const t = orden[0];
      t.style.transform = `translate(${dir * 125}%, -6%) rotate(${dir * 26}deg)`;
      setTimeout(() => {
        orden.push(orden.shift());
        acomodar();
        t.classList.add("sin-transicion");
        t.style.transform = "";
        void t.offsetWidth;
        t.classList.remove("sin-transicion");
        ocupado = false;
      }, 320);
    }

    function anterior() {
      if (ocupado || orden.length < 2) return;
      ocupado = true;
      const t = orden.pop();
      orden.unshift(t);
      t.classList.add("sin-transicion");
      t.style.transform = "translate(-125%, -6%) rotate(-26deg)";
      acomodar();
      void t.offsetWidth;
      t.classList.remove("sin-transicion");
      t.style.transform = "";
      setTimeout(() => { ocupado = false; }, 320);
    }

    // Arrastrar con el dedo (o el mouse); un toque simple pasa a la siguiente
    let gesto = null;
    monton.addEventListener("pointerdown", (e) => {
      if (ocupado || e.button > 0) return;
      gesto = { x: e.clientX, y: e.clientY, id: e.pointerId, movido: false };
      monton.setPointerCapture(e.pointerId);
      orden[0].classList.add("sin-transicion");
    });
    monton.addEventListener("pointermove", (e) => {
      if (!gesto || e.pointerId !== gesto.id) return;
      const dx = e.clientX - gesto.x;
      const dy = e.clientY - gesto.y;
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) gesto.movido = true;
      const t = orden[0];
      const rot = giro(+t.dataset.i);
      t.style.transform = `translate(${dx}px, ${dy * 0.15}px) rotate(${rot + dx / 14}deg)`;
    });
    function soltar(e) {
      if (!gesto || e.pointerId !== gesto.id) return;
      const dx = e.clientX - gesto.x;
      const fueToque = !gesto.movido;
      gesto = null;
      const t = orden[0];
      t.classList.remove("sin-transicion");
      if (e.type === "pointercancel") { t.style.transform = ""; return; }
      if (Math.abs(dx) > 70) siguiente(dx > 0 ? 1 : -1);
      else if (fueToque) siguiente(1);
      else t.style.transform = "";
    }
    monton.addEventListener("pointerup", soltar);
    monton.addEventListener("pointercancel", soltar);

    acomodar();

    const controles = orden.length > 1
      ? el("div", { class: "monton-controles" },
          el("button", { class: "monton-btn", type: "button", "aria-label": "Foto anterior", text: "‹", onclick: () => anterior() }),
          contador,
          el("button", { class: "monton-btn", type: "button", "aria-label": "Foto siguiente", text: "›", onclick: () => siguiente(1) }))
      : null;

    return el("section", { id: "fotos", class: "bloque alterno" },
      el("div", { class: "contenedor" },
        encabezado(d, "Algunos recuerdos"),
        el("div", { class: "revelar" }, monton),
        controles));
  }

  // ============================================================ EXTRAS opcionales
  const extras = {
    antesYAhora(d) {
      const rango = el("input", { type: "range", min: "0", max: "100", value: "50", "aria-label": "Comparar antes y ahora" });
      const comp = el("div", { class: "comparador revelar" },
        el("div", { class: "capa capa-ahora" }, foto(d.fotoAhora, d.textoAhora)),
        el("div", { class: "capa capa-antes" }, foto(d.fotoAntes, d.textoAntes)),
        el("div", { class: "divisor" }, el("span", { text: "⇆", "aria-hidden": "true" })),
        d.textoAntes ? el("span", { class: "etiqueta izq", text: d.textoAntes }) : null,
        d.textoAhora ? el("span", { class: "etiqueta der", text: d.textoAhora }) : null,
        rango);

      const poner = (v) => {
        v = Math.max(0, Math.min(100, v));
        comp.style.setProperty("--pos", v + "%");
        rango.value = v;
      };
      let arrastrando = false;
      let tocado = false;
      const mover = (e) => {
        const r = comp.getBoundingClientRect();
        poner(((e.clientX - r.left) / r.width) * 100);
      };
      comp.addEventListener("pointerdown", (e) => {
        arrastrando = tocado = true;
        comp.setPointerCapture(e.pointerId);
        mover(e);
      });
      comp.addEventListener("pointermove", (e) => { if (arrastrando) mover(e); });
      comp.addEventListener("pointerup", () => { arrastrando = false; });
      comp.addEventListener("pointercancel", () => { arrastrando = false; });
      rango.addEventListener("input", () => { tocado = true; poner(+rango.value); });

      // Pequeño movimiento de muestra la primera vez que aparece en pantalla
      if (!reducirMovimiento && "IntersectionObserver" in window) {
        const io = new IntersectionObserver((entradas) => {
          if (!entradas[0].isIntersecting) return;
          io.disconnect();
          let t0;
          const paso = (t) => {
            if (tocado) return;
            t0 = t0 || t;
            const p = Math.min(1, (t - t0) / 1800);
            poner(50 + Math.sin(p * Math.PI * 2) * 18 * (1 - p));
            if (p < 1) requestAnimationFrame(paso);
          };
          setTimeout(() => requestAnimationFrame(paso), 600);
        }, { threshold: 0.6 });
        io.observe(comp);
      }
      return [encabezado(d, "Mira cuánto has crecido"), comp];
    },

    lineaDeTiempo(d) {
      const linea = el("div", { class: "tl" });
      (d.momentos || []).forEach((m) => {
        linea.append(el("div", { class: "tl-item revelar" },
          el("article", { class: "tl-tarjeta" },
            m.foto ? el("div", { class: "tl-foto" }, foto(m.foto, m.titulo)) : null,
            el("div", { class: "tl-texto" },
              m.fecha ? el("span", { class: "tl-fecha", text: m.fecha }) : null,
              m.titulo ? el("h3", { text: m.titulo }) : null,
              m.texto ? el("p", { text: m.texto }) : null))));
      });
      return [encabezado(d, "Tu camino hasta aquí"), linea];
    },

    razones(d) {
      const grilla = el("div", { class: "razones" });
      (d.lista || []).forEach((r, i) => {
        const tarjeta = el("button", { class: "razon revelar", type: "button", style: `transition-delay:${(i % 4) * 80}ms` },
          el("span", { class: "razon-interior" },
            el("span", { class: "cara frente" },
              el("span", { class: "emoji", text: r.emoji || "⭐", "aria-hidden": "true" }),
              el("span", { class: "titulo", text: r.titulo }),
              pantallaTactil ? el("small", { text: "toca para ver" }) : null),
            el("span", { class: "cara reverso", text: r.texto })));
        if (pantallaTactil) tarjeta.addEventListener("click", () => tarjeta.classList.toggle("volteada"));
        grilla.append(tarjeta);
      });
      return [encabezado(d, "Por qué estoy tan orgulloso/a"), grilla];
    },

    mensajes(d) {
      const tonos = ["#fff3b0", "#ffd6e0", "#d7efff", "#e2f7d5", "#ece0ff"];
      const grilla = el("div", { class: "mensajes" });
      (d.lista || []).forEach((m, i) => {
        grilla.append(el("div", { class: "nota revelar", style: `--rot:${giro(i + 3) / 2}deg;--color-nota:${tonos[i % tonos.length]}` },
          parrafos(m.texto),
          m.de ? el("span", { class: "de", text: "— " + m.de }) : null));
      });
      return [encabezado(d, "Mensajes de quienes te quieren"), grilla];
    },

    deseos(d) {
      const lista = el("ul", { class: "deseos" });
      (d.lista || []).forEach((texto, i) => {
        lista.append(el("li", { class: "deseo revelar", style: `transition-delay:${i * 90}ms` },
          el("span", { class: "estrella", text: "★", "aria-hidden": "true" }),
          el("span", { text: texto })));
      });
      return [encabezado(d, "Lo que te deseo"), lista];
    },
  };
  const EXTRAS_OSCUROS = ["deseos"];

  function armarExtras() {
    const secciones = [];
    let n = 0; // para alternar el color de fondo
    Object.keys(extras).forEach((clave) => {
      const datos = C[clave];
      if (!datos || datos.mostrar !== true) return;
      try {
        const oscura = EXTRAS_OSCUROS.includes(clave);
        const clase = "bloque" + (oscura ? " oscuro" : n % 2 ? " alterno" : "");
        secciones.push(el("section", { id: clave, class: clase },
          oscura ? crearDestellos(24) : null,
          el("div", { class: "contenedor" }, extras[clave](datos))));
        if (!oscura) n++;
      } catch (err) {
        console.error(`No se pudo armar la sección "${clave}". Revisa esa parte de contenido.js.`, err);
      }
    });
    return secciones;
  }

  // ============================================================ 4. FINAL
  function armarFinal() {
    const f = C.final || {};
    if (f.mostrar === false) return null;
    return el("footer", { id: "final", class: "bloque oscuro final" },
      crearDestellos(20),
      el("div", { class: "contenedor" },
        el("h2", { class: "revelar", text: f.titulo || "¡Lo lograste!" }),
        f.texto ? el("p", { class: "texto-final revelar", text: f.texto }) : null,
        el("button", { class: "boton", type: "button", text: f.boton || "🎉 ¡Más confeti!", onclick: () => lluviaConfeti() }),
        f.firma ? el("p", { class: "firma", text: f.firma }) : null,
        el("p", { class: "pie" },
          `Hecho con 💛 para ${C.nombre || "ti"}`,
          C.mensajeSecreto ? [el("br"), "Pssst… hay un secreto escondido en esta página 👀"] : null)));
  }

  // ============================================================ mensaje secreto
  const modal = $("#modal");
  function abrirModal(texto) {
    $("p", modal).textContent = texto;
    modal.hidden = false;
    $("button", modal).focus();
  }
  const cerrarModal = () => { modal.hidden = true; };
  $("button", modal).addEventListener("click", cerrarModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) cerrarModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) cerrarModal(); });

  // ============================================================ música
  function armarMusica() {
    if (!C.musica) return;
    const boton = $("#btn-musica");
    audio.src = C.musica;
    boton.hidden = false;
    boton.addEventListener("click", () => (audio.paused ? audio.play().catch(() => {}) : audio.pause()));
    audio.addEventListener("play", () => { boton.classList.add("sonando"); boton.textContent = "🎶"; });
    audio.addEventListener("pause", () => { boton.classList.remove("sonando"); boton.textContent = "🎵"; });
  }

  // ============================================================ aparecer al hacer scroll
  function activarRevelado() {
    const nodos = document.querySelectorAll(".revelar");
    if (!("IntersectionObserver" in window)) { nodos.forEach((n) => n.classList.add("visible")); return; }
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    nodos.forEach((n) => io.observe(n));
  }

  // ============================================================ ¡a armar!
  armarPortada();
  prepararSobre();
  contenido.append(...[armarCarta(), armarFotos(), ...armarExtras(), armarFinal()].filter(Boolean));
  armarMusica();
  activarRevelado();

  // ============================================================ error en contenido.js
  function mostrarError() {
    const errores = window.__errores || [];
    const e = errores.find((x) => x && /contenido\.js/.test(x.filename || "")) || errores[0];
    document.body.innerHTML = "";
    const caja = document.createElement("div");
    caja.className = "aviso-error";
    caja.innerHTML =
      "<h2>😅 Hay un error en <code>contenido.js</code></h2>" +
      "<p>Casi siempre es una <b>coma</b> que falta al final de una línea, o unas <b>comillas</b> que se abrieron y no se cerraron.</p>" +
      "<p>Revisa lo último que cambiaste. Si un texto lleva comillas adentro, usa acentos graves por fuera: <code>`así`</code>.</p>";
    if (e && e.lineno) {
      const p = document.createElement("p");
      const code = document.createElement("code");
      code.textContent = `Línea ${e.lineno}: ${e.message}`;
      p.append("Pista del navegador: ", code);
      caja.append(p);
    }
    document.body.append(caja);
  }
})();
