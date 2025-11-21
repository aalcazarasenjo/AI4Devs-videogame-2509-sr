Prompt 1

Quiero que diseñes una **base sólida pero sencilla**, sobre la que luego pueda ir añadiendo funcionalidades más avanzadas.

---

## 🎮 Objetivo del juego (versión inicial)

- Juego 2D visto desde arriba (top-down) de un coche de Fórmula 1.
- El jugador controla **un solo coche** con el teclado (flechas o WASD).
- El coche se mueve sobre un **circuito sencillo** (puede ser un rectángulo con curvas básicas dibujado en el canvas).
- Debe haber:
  - Contador de vueltas (aunque inicialmente solo se complete 1 vuelta).
  - Cronómetro / tiempo de vuelta simple.
  - Indicador de velocidad aproximada.

No necesito todavía rivales ni IA avanzada, pero quiero que el código esté preparado para poder añadirlos más adelante.

---

## 🧩 Requisitos técnicos generales

- Usa **HTML5 Canvas** para la parte visual del juego.
- No utilices librerías externas (solo **JavaScript vanilla**).
- Estructura el código de forma **modular y legible**, usando:
  - Clases ES6 cuando tenga sentido (por ejemplo: `Car`, `Track`, `Game`, `InputHandler`).
  - Constantes para parámetros importantes (`MAX_SPEED`, `ACCELERATION`, fricción, etc.).
- Añade **comentarios claros** y algunos **TODO:** explícitos donde veas puntos naturales de ampliación.

---

## 1️⃣ Archivo `index.html`

Diseña un HTML limpio que incluya:

- Estructura básica HTML5.
- Título relacionado con el juego (por ejemplo, “F1 Racing Prototype”).
- Un **contenedor principal** para el juego:
  - Un `<canvas>` donde se dibuja el circuito y el coche.
  - Una zona de HUD / interfaz con:
    - Tiempo de vuelta actual.
    - Mejor tiempo (aunque se inicialice a `--:--`).
    - Velocidad aproximada del coche.
    - Vuelta actual (aunque sea solo la 1 al principio).
- Un pequeño bloque de texto o instrucciones:
  - Controles básicos (flechas o WASD).
- Enlaza correctamente:
  - `styles.css` en el `<head>`.
  - `game.js` antes de cerrar `<body>`.

No incluyas estilos inline, todo debe ir a `styles.css`.

---

## 2️⃣ Archivo `styles.css`

Aplica un diseño sencillo pero con un toque **“tecnológico / racing”**:

- Define una **paleta de colores** básica (por ejemplo, fondo oscuro, detalles en rojo/blanco, etc.).
- Estilos para:
  - El `body`: fuente legible, centrado del contenido, fondo.
  - El contenedor del juego: que el canvas y el HUD estén alineados y bien organizados.
  - El canvas: borde sutil, sombra ligera o apariencia de “pantalla”.
  - HUD: texto claro, alineado, con etiquetas (Velocidad, Vuelta, Tiempo, etc.).
- Asegura que el diseño sea **responsivo básico**:
  - Que al menos en pantallas pequeñas (tipo portátil) siga viéndose correctamente.
- Separa las secciones con comentarios:
  - `/* Layout general */`
  - `/* Canvas */`
  - `/* HUD */`
  - etc.

---

## 3️⃣ Archivo `game.js`

Quiero una **base clara de motor de juego simple**, con:

### a) Inicialización

- Lógica para:
  - Obtener el elemento `<canvas>` y su contexto 2D.
  - Ajustar dimensiones iniciales (puede ser un tamaño fijo razonable, p.e. 800x600).
- Crear las instancias principales:
  - `const game = new Game(canvas);`

### b) Clases recomendadas

Crea al menos estas clases con propiedades y métodos básicos:

1. **`Game`**
   - Propiedades:
     - Referencia al canvas y contexto.
     - Instancia del coche del jugador.
     - Instancia del circuito / pista.
     - Último timestamp para el bucle de animación.
     - Variables para el tiempo de vuelta, mejor vuelta, etc.
   - Métodos:
     - `start()` o inicialización.
     - `update(deltaTime)`.
     - `draw(context)`.
     - `gameLoop(timestamp)` usando `requestAnimationFrame`.
   - Comentarios sobre dónde añadir en el futuro:
     - IA de otros coches.
     - Gestión de colisiones avanzadas.
     - Sistema de vueltas múltiples.

2. **`Car`**
   - Propiedades:
     - `x`, `y`, `angle`.
     - `speed`, `maxSpeed`, `acceleration`, `friction`.
     - Ancho y alto del coche.
   - Métodos:
     - `update(input, deltaTime)`: actualiza posición y velocidad.
     - `draw(context)`: dibuja el coche (puede ser un rectángulo o forma simple inicialmente).
   - Lógica básica de física:
     - Aceleración adelante/atrás.
     - Giro a la izquierda/derecha en función de si el coche está en movimiento.
     - Algo de fricción para que el coche no se deslice indefinidamente.

3. **`Track`**
   - Representación simple del circuito.
   - Métodos:
     - `draw(context)`: dibuja el trazado.
   - Puede ser inicialmente un óvalo o un único trazado sencillo.
   - Deja en comentarios ideas para:
     - Mapa de colisiones.
     - Detección de si el coche se sale de pista.

4. **`InputHandler`**
   - Gestiona teclas pulsadas.
   - Propiedades:
     - Teclas activas.
   - Métodos:
     - Listeners para `keydown` y `keyup`.
     - Métodos para consultar si se está pulsando adelante, atrás, izquierda, derecha.

### c) HUD y métricas

- Actualiza en cada frame los valores:
  - Velocidad (puede ser proporcional a `speed`).
  - Tiempo de vuelta (`lapTime`).
- Define una forma sencilla de:
  - Detectar que el coche ha cruzado la “línea de meta” (puede ser una línea fija en el canvas).
  - Reiniciar el tiempo de vuelta.
  - Actualizar mejor tiempo si el nuevo es menor.
- No hace falta una detección perfecta, solo una lógica simple bien comentada.

### d) Bucle de juego

- Implementa un bucle con `requestAnimationFrame`.
- En cada iteración:
  - Calcula `deltaTime`.
  - Llama a `game.update(deltaTime)`.
  - Llama a `game.draw(context)`.

---

## 🧱 Extensibilidad futura (muy importante)

A lo largo del código, añade **comentarios tipo senior**, por ejemplo:

- `// TODO: Añadir coches controlados por IA con diferentes niveles de dificultad`
- `// TODO: Implementar sistema de colisiones con los límites de la pista`
- `// TODO: Cargar sprites reales de coches de F1 en vez de rectángulos`
- `// TODO: Añadir menú de inicio y selección de circuito`
- `// TODO: Guardar mejores tiempos en localStorage`

La idea es que el juego ya funcione de forma básica (el coche se mueva, haya pista, haya HUD), pero el código esté claramente preparado para crecer.

---

## 📦 Formato de la respuesta

Devuélveme la respuesta en este formato:

1. Un breve resumen de la arquitectura del juego (1–2 párrafos).
2. Tres bloques de código **separados** y etiquetados así:

```html
<!-- index.html -->
...código...


