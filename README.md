# 🎓 Página de felicitación para Vale

Página web pensada para verse desde el **celular**:

1. **Portada**: una foto de ella a pantalla completa, su nombre y un botón.
2. **Carta**: al tocar el botón se abre un sobre animado y aparece tu carta (con confeti).
3. **Fotos**: debajo de la carta hay un montón de fotos tipo polaroid que se pasan tocándolas o deslizándolas con el dedo.
4. **Final**: un mensaje de cierre con un botón de confeti.

Además trae **extras** que vienen apagados y puedes activar (ver más abajo).

---

## 📁 Qué hay en cada archivo

| Archivo | Para qué sirve | ¿Lo editas? |
|---|---|---|
| `contenido.js` | **Todos los textos, nombres de fotos, colores y fechas** | ✅ Sí, este es el importante |
| `fotos/` | Aquí van las fotos | ✅ Sí |
| `index.html` | Estructura de la página | Solo para la vista previa de WhatsApp (ver abajo) |
| `estilos.css` | Diseño (tamaños, animaciones) | No hace falta |
| `app.js` | Lo que arma la página y las animaciones | No hace falta |
| `render.yaml` | Configuración para Render | No |

---

## 👀 Verla en tu computador mientras la editas

Desde la terminal (WSL), en esta carpeta:

```bash
python3 -m http.server 8000
```

Después abre **http://localhost:8000** en el navegador. Cada vez que cambies algo, guarda y recarga la página (F5).

**Para verla como en un celular:** en Chrome aprieta `F12` y luego el ícono de celular/tablet (o `Ctrl+Shift+M`).

**Para verla en tu celular de verdad**, sin publicarla todavía: lo más fácil es publicarla en Render (es gratis y puedes actualizarla todas las veces que quieras).

---

## ✏️ Cómo editar

### Textos
Abre `contenido.js` y cambia lo que está entre comillas. La carta va entre acentos graves (`` ` ``), así que puedes escribir varios párrafos: deja **una línea en blanco** entre párrafo y párrafo.

> Si después de un cambio la página muestra un aviso rojo de error, casi siempre es una **coma** que falta al final de una línea o unas **comillas** sin cerrar. El aviso te dice el número de línea.

### Fotos
1. Copia las fotos a la carpeta `fotos/`.
2. En `contenido.js`, escribe el nombre exacto de cada una (por ejemplo `"fotos/foto-1.jpg"`).
3. Si un nombre está mal o la foto no está, la página muestra un recuadro rayado que dice **qué archivo falta**. Antes de mandarle el link, revisa que no quede ninguno.

**Consejos importantes:**
- Usa **.jpg**. Las fotos `.HEIC` del iPhone no se ven en Android ni en Chrome.
- Nombres **sin espacios, sin tildes y en minúsculas**. En Render importan las mayúsculas: `Foto-1.JPG` y `foto-1.jpg` son archivos distintos.
- **Achica las fotos** (1600 px de ancho y menos de 500 KB) en [squoosh.app](https://squoosh.app). Una foto de celular pesa 3–5 MB y la página cargaría lento.
- Si en la portada se le corta la cara, cambia `encuadre` en `contenido.js` (por ejemplo `"center top"` o `"center 40%"`).

### Música (opcional)
Crea una carpeta `musica/`, pon un `.mp3` y escribe su ruta en `musica: "musica/cancion.mp3"`. Empieza a sonar justo cuando ella abre la carta.

### Extras (vienen apagados)
En la parte de abajo de `contenido.js`, cambia `mostrar: false` por `mostrar: true`:

- **antesYAhora**: dos fotos (de chica y de ahora) que se comparan arrastrando una barra con el dedo.
- **lineaDeTiempo**: momentos importantes con año, texto y foto.
- **razones**: tarjetas que se dan vuelta al tocarlas ("por qué estoy orgulloso/a de ti").
- **mensajes**: notitas de colores con mensajes de la familia y amigos.
- **deseos**: lista de deseos para lo que viene.

### 🤫 Secreto
Si ella toca **5 veces seguidas el gorro 🎓** de la portada, aparece el `mensajeSecreto`. Al final de la página hay una pista.

---

## 🚀 Publicarla gratis en Render

En Render, los **sitios estáticos** son gratis, no se "duermen" y no borran archivos (a diferencia de los servicios con Rails o PHP del plan gratis, que pierden las fotos subidas cada vez que se reinician).

### 1. Subir la carpeta a GitHub
Crea un repositorio **privado** en [github.com/new](https://github.com/new) (por ejemplo `felicidades-vale`). Después, en esta carpeta:

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "Primera versión de la página"
```

```bash
git branch -M main
```

```bash
git remote add origin https://github.com/TU-USUARIO/felicidades-vale.git
```

```bash
git push -u origin main
```

> El repositorio puede ser privado: Render igual puede leerlo, y así las fotos no quedan visibles en GitHub.

### 2. Crear el sitio en Render
1. Entra a [dashboard.render.com](https://dashboard.render.com) y crea una cuenta (puedes entrar con GitHub).
2. **New → Static Site** y elige el repositorio `felicidades-vale`.
3. Completa:
   - **Branch:** `main`
   - **Build Command:** déjalo vacío (si te obliga a poner algo, escribe `echo listo`)
   - **Publish Directory:** `.`
4. **Create Static Site**. En uno o dos minutos te da un link del tipo `https://felicidades-vale.onrender.com`.

*(Otra opción: **New → Blueprint** y elegir el repositorio; Render lee la configuración de `render.yaml`.)*

### 3. Actualizarla
Cada vez que cambies algo:

```bash
git add .
```

```bash
git commit -m "Agrego fotos y termino la carta"
```

```bash
git push
```

Render la vuelve a publicar sola en un minuto aprox. Si en el celular no ves el cambio, recarga la página.

### 4. Vista previa en WhatsApp
Cuando tengas el link, abre `index.html` y en la línea de `og:image` cambia `TU-SITIO` por tu dirección real. Así, cuando le mandes el link por WhatsApp, aparece la foto de portada. Esa foto debería pesar **menos de 300 KB**.

---

## 💡 Más ideas

- **Código QR**: imprime un QR con el link (en cualquier generador de QR gratis) y pégalo dentro de una tarjeta de papel o junto a un regalo. Ella lo escanea y llega a la portada.
- **Mensajes de la familia**: pídeles por WhatsApp 2 o 3 líneas a cada uno y activa la sección `mensajes`.
- **Video**: si juntas videos cortos de la familia, súbelos a YouTube como "no listado" y te ayudo a ponerlo en la página.
- **Página privada**: tiene `noindex` para que Google no la muestre en búsquedas, pero cualquiera con el link puede verla. No pongas datos sensibles (dirección, número de documento, teléfono).
