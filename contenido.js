/* ===================================================================
   ✏️  ESTE ES EL ÚNICO ARCHIVO QUE NECESITAS EDITAR
   -------------------------------------------------------------------
   Cómo se recorre la página:
     1. PORTADA  → una foto de ella + un texto. Al tocar el botón...
     2. CARTA    → ...se abre un sobre y aparece tu carta.
     3. FOTOS    → debajo de la carta, un montón de fotos para ir pasando.
     4. FINAL    → mensaje de cierre con confeti.
   (Más abajo hay EXTRAS opcionales que puedes activar.)

   Reglas básicas:
   • Cambia los textos entre comillas "..." o entre acentos graves `...`
     (los textos entre `...` pueden tener varias líneas; deja una
      línea en blanco para empezar un párrafo nuevo).
   • Pon las fotos en la carpeta  fotos/  y escribe aquí su nombre
     exacto (fíjate en mayúsculas y en si es .jpg o .jpeg).
     Si una foto no existe, la página muestra un recuadro que dice
     qué archivo falta.
   • ¡Ojo con las comas! Cada elemento de una lista termina en coma.
     Si la página sale con un aviso de error, casi siempre es una
     coma o unas comillas que faltan.
   =================================================================== */

window.CONTENIDO = {

  // ---------------- DATOS BÁSICOS ----------------
  nombre: "Vale",
  colegio: "Colegio Nombre del Colegio",
  generacion: "Generación 2026",

  // Fecha de la graduación: "AÑO-MES-DÍA HORA:MIN"
  // Antes de esa fecha la portada dice "Faltan X días"; después, "Egresada hace X días".
  // Si no quieres el contador, déjalo vacío: ""
  fechaGraduacion: "2026-12-05 19:00",

  // Colores de la página (busca "color picker" en Google para elegir otros)
  colores: {
    principal: "#1e2a5a", // azul marino
    acento: "#d4a64a",    // dorado
    suave: "#f7c6d0",     // rosado
  },

  // Canción opcional: empieza a sonar al abrir la carta y aparece un botón 🎵
  // Ejemplo: "musica/cancion.mp3"
  musica: "",

  // Se muestra al tocar 5 veces seguidas el gorro 🎓 de la portada 🤫
  mensajeSecreto: "Si encontraste esto: te debo un helado 🍦. Es oficial, quedó por escrito.",


  // ================= 1. PORTADA =================
  portada: {
    foto: "fotos/portada.jpg",
    // Qué parte de la foto se ve en el celular. Si se le corta la cara,
    // prueba con "center top", "center 20%", "center 50%"...
    encuadre: "center 25%",
    saludo: "¡Felicidades,",
    frase: "Lo lograste. Y no podría estar más orgulloso/a de ti.",
    boton: "💌 Toca aquí, te escribí una carta",
  },


  // ================= 2. CARTA =================
  carta: {
    saludo: "Querida Vale:",
    texto: `
Todavía me acuerdo de tu primer día de colegio: la mochila era más grande que tú y no querías soltarle la mano a mamá. Y mírate ahora.

Escribe aquí todo lo que le quieras decir. Puedes contarle un recuerdo que tengas con ella, lo que más admiras de ella, cómo la has visto crecer estos años...

Deja una línea en blanco, como aquí arriba, cada vez que quieras empezar un párrafo nuevo.
    `,
    despedida: "Te quiero infinito,",
    firma: "Tu hermano/a",
    boton: "Ahora mira esto 📸",
  },


  // ================= 3. FOTOS =================
  // Se ven como un montón de fotos: se pasan tocando o deslizando con el dedo.
  // Puedes poner las que quieras: copia una línea y cambia el nombre.
  fotos: {
    titulo: "Algunos recuerdos",
    subtitulo: "Toca o desliza la foto para ver la siguiente",
    lista: [
      { foto: "fotos/foto-1.jpg", texto: "Escribe aquí algo sobre esta foto" },
      { foto: "fotos/foto-2.jpg", texto: "Vacaciones en la playa" },
      { foto: "fotos/foto-3.jpg", texto: "Ese cumpleaños inolvidable" },
      { foto: "fotos/foto-4.jpg", texto: "Con sus mejores amigas" },
      { foto: "fotos/foto-5.jpg", texto: "Último día de clases" },
    ],
  },


  // ================= 4. FINAL =================
  final: {
    titulo: "¡Lo lograste!",
    texto: "Hoy celebramos todo lo que eres y todo lo que vas a ser.",
    boton: "🎉 ¡Más confeti!",
    firma: "Con todo mi cariño, tu hermano/a",
  },



  /* =================================================================
     ✨ EXTRAS OPCIONALES
     Aparecen entre las fotos y el final, en este mismo orden.
     Para activar uno, cambia  mostrar: false  por  mostrar: true
     ================================================================= */

  // Fotos de antes y ahora: se comparan arrastrando una barra con el dedo
  antesYAhora: {
    mostrar: false,
    titulo: "Mira cuánto has crecido",
    subtitulo: "Desliza para comparar",
    fotoAntes: "fotos/antes.jpg",
    textoAntes: "Kinder",
    fotoAhora: "fotos/ahora.jpg",
    textoAhora: "Cuarto medio",
  },

  // Línea de tiempo con momentos importantes (la foto es opcional)
  lineaDeTiempo: {
    mostrar: false,
    titulo: "Tu camino hasta aquí",
    subtitulo: "",
    momentos: [
      { fecha: "2008", titulo: "Llegaste al mundo", texto: "Y la familia ya no volvió a ser la misma.", foto: "fotos/momento-1.jpg" },
      { fecha: "2012", titulo: "Primer día de colegio", texto: "Mochila gigante y cero ganas de soltar la mano.", foto: "fotos/momento-2.jpg" },
      { fecha: "2023", titulo: "Primero medio", texto: "Nuevos amigos y muchas tareas a última hora.", foto: "" },
      { fecha: "2026", titulo: "¡Egresada!", texto: "El final de una etapa y el comienzo de todo lo que viene.", foto: "" },
    ],
  },

  // Tarjetas que se dan vuelta al tocarlas (textos cortos, 2 o 3 líneas)
  razones: {
    mostrar: false,
    titulo: "Por qué estoy tan orgulloso/a",
    subtitulo: "Toca cada tarjeta",
    lista: [
      { emoji: "💪", titulo: "Tu esfuerzo", texto: "Las noches estudiando valieron la pena. Nadie te regaló nada." },
      { emoji: "😂", titulo: "Tu humor", texto: "Nadie nos hace reír como tú, ni siquiera en los días malos." },
      { emoji: "💖", titulo: "Tu corazón", texto: "Siempre te preocupas por los demás antes que por ti." },
      { emoji: "🦁", titulo: "Tu valentía", texto: "Te atreves aunque te dé miedo. Eso es ser valiente." },
    ],
  },

  // Notitas de la familia y amigos (pídeles 2 o 3 líneas por WhatsApp)
  mensajes: {
    mostrar: false,
    titulo: "Mensajes de quienes te quieren",
    subtitulo: "",
    lista: [
      { de: "Mamá", texto: "Mi niña, verte llegar hasta aquí es el regalo más lindo. Te amo." },
      { de: "Papá", texto: "Estoy orgulloso de ti hoy y siempre." },
      { de: "Tu mejor amiga", texto: "¡Ahora nos toca conquistar el mundo!" },
    ],
  },

  // Deseos para el futuro
  deseos: {
    mostrar: false,
    titulo: "Lo que te deseo",
    subtitulo: "Para todo lo que viene después de hoy",
    lista: [
      "Que encuentres un camino que te haga feliz, aunque no sea el que todos esperan.",
      "Que nunca dejes de reírte como te ríes ahora.",
      "Que sepas que siempre vas a tener una casa a la que volver.",
    ],
  },
};
