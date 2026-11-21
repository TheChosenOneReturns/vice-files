# DESIGN.md — VICE FILES: Archivo Editorial de Polémicas de GTA VI

> **Versión:** 2.0 (Production Spec)  
> **Enfoque:** Editorial Web Experience • Mobile-First Tactile Motion • 60fps Strict  
> **Estética Base:** *Neo-Vice Printed Zine* — Folleto turístico vintage doblado de Leonida mezclado con dossier confidencial contemporáneo y arte impreso en risografía duotono.

---

## 1. Dirección de Arte y Filosofía Visual

### 1.1 El Concepto: "Papel Cálido, Noche de Neón"
A diferencia de las típicas webs gaming saturadas de fondos `#000000` y brillos neón genéricos, **VICE FILES** invierte la fórmula tomando directamente el ADN del póster de referencia:

- **Base Táctil Editorial (Light Paper):** Toda la experiencia vive sobre un lienzo de papel impreso crema envejecido (`#F2EAE1`) con grano fino de imprenta, pliegues sutiles en cruz y tinta negra cerrada (`#171416`).
- **Ventanas Nocturnas:** La atmósfera nocturna de Vice City vive *enmarcada* dentro de las fotografías (cielo púrpura, agua reflejando rascacielos) y se escapa únicamente a través de **elementos recortados en duotono** (hidroavión, palmera, skyline, siluetas) que rompen los márgenes del layout creando profundidad **2.5D**.
- **Narrativa Tabloide & Dossier:** Cada polémica de GTA VI (mega-filtración de 2022, demanda del "Florida Joker", filtración anticipada del Tráiler 1, debates de precio, políticas de regreso a oficina, retrasos de lanzamiento, etc.) se trata como un **expediente coleccionable** con sello postal, número de caso y calificación de **1 a 6 Estrellas de Búsqueda (*Wanted Level*)**.

### 1.2 Reglas de Oro (Do's & Don'ts)

| HACER (Do) | EVITAR (Don't) |
| :--- | :--- |
| Usar papel crema mate (`#F2EAE1`) como lienzo principal y tinta oscura (`#171416`) para máxima legibilidad editorial. | Usar modo oscuro genérico con sombras `box-shadow: 0 0 25px magenta` estilo plantilla cyberpunk barata. |
| Integrar ilustraciones SVG duotono con `mix-blend-mode: multiply` para que la textura del papel traspase la tinta. | Colocar PNGs pesados con bordes duros o fondos falsos sin integración táctil. |
| Usar tipografía brutalmente condensada en titulares gigantes y *leading* apretado (`0.98 - 1.05`) en bloques de texto de margen. | Usar tipografías genéricas con interlineados flojos o tarjetas con esquinas excesivamente redondeadas tipo SaaS corporativo. |
| Tratar las animaciones como física real de papel, tinta de sello y parallax atmosférico. | Usar rebotes caricaturescos, partículas 3D innecesarias o *scroll hijacking* en teléfonos móviles. |

---

## 2. Sistema de Design Tokens

### 2.1 Paleta de Colores (CSS Custom Properties)

```css
:root {
  /* === SUPERFICIES (Papel impreso & Marcos) === */
  --surface-paper: #F2EAE1;           /* Lienzo principal: papel cálido mate */
  --surface-paper-elevated: #F7F1E9;  /* Tarjetas destacadas / hojas de dossier */
  --surface-paper-recessed: #E7DDD1;  /* Fondos de filtros inactivos / divisores */
  --surface-photo-night: #1D1530;     /* Base oscura detrás de fotografías */
  --surface-dock-glass: rgba(242, 234, 225, 0.86); /* Dock móvil translúcido */

  /* === TINTAS & TEXTOS === */
  --ink-primary: #171416;             /* Tinta negra de imprenta (contraste AAA sobre papel) */
  --ink-secondary: #4D454A;           /* Metadatos, subtítulos, citas secundarias */
  --ink-muted: #7C7276;               /* Placeholders, etiquetas de archivo */
  --ink-inverse: #F7F2EC;             /* Texto sobre placas viales y fotografías */
  --ink-hairline: rgba(23, 20, 22, 0.14);
  --ink-border-strong: rgba(23, 20, 22, 0.85);

  /* === GRADIENTE SUNSET LEONIDA (Identidad Hero & Duotonos) === */
  --vice-indigo: #5A48B8;             /* Cielo alto / sombras duotono */
  --vice-violet: #8D51B5;             /* Transición púrpura */
  --vice-magenta: #E65A9D;            /* Acento principal / palmera / foco */
  --vice-coral: #F28578;              /* Horizonte cálido */
  --vice-gold: #F7C378;               /* Base solar del degradado masthead */

  /* === SEÑALÉTICA, SELLOS & ESTADOS === */
  --stamp-crimson: #C46367;           /* Sello postal, placa BAYSHORE AVE, escudo 95 */
  --stamp-crimson-dark: #9F494D;      /* Hover / estado presionado de señalética */
  --wanted-active: #D94854;           /* Estrella de búsqueda encendida */
  --wanted-idle: rgba(196, 99, 103, 0.24); /* Estrella vacía */
  --status-confirmed: #C46367;        /* Polémica verificada */
  --status-legal: #5A48B8;            /* Litigio / Demanda */
  --status-rumor: #D48C46;            /* Rumor / Filtración sin confirmar */

  /* === GRADIENTES SEMÁNTICOS === */
  --grad-vice-masthead: linear-gradient(
    180deg,
    var(--vice-indigo) 0%,
    var(--vice-violet) 32%,
    var(--vice-magenta) 66%,
    var(--vice-coral) 84%,
    var(--vice-gold) 100%
  );

  --grad-vice-duotone: linear-gradient(
    135deg,
    var(--vice-indigo) 0%,
    var(--vice-magenta) 65%,
    var(--vice-coral) 100%
  );

  --grad-neon-sign: linear-gradient(
    180deg,
    #8878DF 0%,
    #E66DA9 50%,
    #F3B978 100%
  );

  /* === SOMBRAS EDITORIALES (Tinta y papel, no blur sucio) === */
  --shadow-paper-card: 0 1px 0 rgba(23, 20, 22, 0.08), 0 12px 30px -16px rgba(29, 21, 48, 0.16);
  --shadow-dossier-sheet: 0 -10px 40px -12px rgba(23, 20, 22, 0.22);
  --shadow-stamp-press: inset 0 0 0 1.5px var(--stamp-crimson);
}
```

### 2.2 Sistema Tipográfico Fluido

Cargar fuentes en formato `.woff2` (`font-display: swap`) con *preload* únicamente para el Masthead y el cuerpo principal.

| Token / Rol | Familia | Peso & Estilo | Tracking / Leading | Escala Fluida (`clamp`) | Uso Específico |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `--font-masthead` | `Archivo Black` (fallback: `Anton`, `Impact`) | `900` Normal, Uppercase | `-0.055em` / `0.82` | `clamp(3.75rem, 15.5vw, 14rem)` | Título monumental `VICE FILES` con degradado vertical en el Hero. |
| `--font-overline` | `Cinzel` o `Oswald` | `700` Normal, Uppercase | `0.26em` / `1.0` | `clamp(0.8rem, 2.1vw, 1.95rem)` | Cabecera expandida de borde a borde (`GRAND THEFT AUTO VI`). |
| `--font-editorial` | `Inter Tight` | `500 / 700` Normal | `-0.03em` / `1.02` | `clamp(1rem, 1.4vw, 1.35rem)` | Bloques de texto compactos en columnas laterales y resúmenes de tarjetas. |
| `--font-editorial-italic` | `Inter Tight` | `700` Italic | `-0.025em` / `1.05` | `clamp(1.15rem, 1.8vw, 1.6rem)` | Subtítulos de sección (`"Only in Leonida"`, `"Another day in paradise, right?"`). |
| `--font-signage` | `Barlow Condensed` | `800` Uppercase | `0.04em` / `1.0` | `clamp(0.85rem, 1.15vw, 1.1rem)` | Placas viales (`BAYSHORE AVE`), filtros, botones CTA y badges de ruta. |
| `--font-mono` | `JetBrains Mono` | `500` Normal | `0.03em` / `1.3` | `clamp(0.72rem, 0.85vw, 0.85rem)` | Fechas, IDs de caso (`CASE-04`), fuentes, `font-variant-numeric: tabular-nums`. |

### 2.3 Grilla, Espaciado y Geometría

- **Contenedor Editorial Máximo:** `max-width: 1440px`, padding lateral `clamp(1rem, 3.2vw, 3rem)`.
- **Grilla Desktop (`>= 1024px`):** 12 columnas con `gap: 24px`. En el Hero, proporciones asimétricas de póster: `[2.2fr | 7.6fr | 2.2fr]` (márgenes editoriales vivos flanqueando la ventana fotográfica central).
- **Grilla Tablet (`768px - 1023px`):** 8 columnas con `gap: 20px`.
- **Grilla Mobile (`< 768px`):** 4 columnas con `gap: 14px` y margen exterior mínimo de `16px`.
- **Radios de Borde (*Border Radius*):**
  - Tarjetas y fotos editoriales: `2px` (corte casi recto de imprenta física).
  - Placas de calle (`StreetSignButton`): `3px` con filete interno opcional.
  - Sellos postales (`PostalStampBadge`): `9999px` (círculo perfecto).
  - Bottom Sheet móvil: `22px 22px 0 0`.

### 2.4 Receta de Texturas Físicas (Zero-Bloat CSS + SVG)

#### A. Grano de Papel Global (1 solo nodo fijo, < 1 KB)
```css
.paper-grain-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 90;
  opacity: 0.055;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

#### B. Pliegues de Póster Doblado (Cruz Editorial en Hero)
Dos pseudo-elementos lineales de `2px` (1px sombra `rgba(23,20,22,0.06)` + 1px luz `rgba(255,255,255,0.48)`) cruzando horizontalmente al `50%` y verticalmente al `50%` del contenedor Hero. En mobile se mantiene únicamente el pliegue horizontal para no interferir con la lectura estrecha.

#### C. Filtro SVG Risograph Duotone (Para Evidencias Fotográficas)
Incluir una única vez en el DOM raíz (`<svg class="sr-only" aria-hidden="true">`):
```xml
<filter id="vice-risograph" color-interpolation-filters="sRGB">
  <feColorMatrix type="matrix" values="
    0.33 0.33 0.33 0 0
    0.33 0.33 0.33 0 0
    0.33 0.33 0.33 0 0
    0    0    0    1 0" result="gray" />
  <feComponentTransfer in="gray" result="duotone">
    <!-- Mapeo de sombras (#44329E) a luces (#F7A5B8) -->
    <feFuncR type="table" tableValues="0.27 0.90 0.97" />
    <feFuncG type="table" tableValues="0.20 0.35 0.65" />
    <feFuncB type="table" tableValues="0.62 0.62 0.72" />
  </feComponentTransfer>
</filter>
```
> **Truco Senior de 60fps:** Nunca animar la propiedad `filter` directamente durante hover o scroll. Renderizar la imagen en dos capas apiladas (capa inferior: imagen original a color; capa superior: misma imagen con `filter: url(#vice-risograph)`) y animar únicamente `opacity` o `clip-path` en la capa superior.

---

## 3. Stack Tecnológico y Librerías de Animación

### 3.1 Instalación Recomendada (React 19 + TypeScript + Tailwind CSS v4)

```bash
# Core de animaciones, scroll coreografiado y micro-interacciones físicas
npm install gsap @gsap/react lenis motion lucide-react

# Estado global ligero (filtros, dossier activo, audio SFX opcional)
npm install zustand

# Capa Atmosférica WebGL opcional (solo Desktop Tier >= 2)
npm install three @types/three @react-three/fiber @react-three/drei detect-gpu
```

### 3.2 Matriz de Responsabilidades por Librería

| Librería | Responsabilidad Exacta | Configuración Obligatoria | Comportamiento Mobile |
| :--- | :--- | :--- | :--- |
| **`gsap` + `@gsap/react`** | Motor de coreografía de scroll (`ScrollTrigger`), parallax 2.5D de capas recortadas, reordenamiento fluido de grilla (`Flip`) y timeline horizontal en desktop. | Envolver todo en `useGSAP()` con `scope` para limpieza automática en React Strict Mode. | Usar `gsap.matchMedia()` para reducir amplitudes de parallax al 35-40% y desactivar pines horizontales complejos. |
| **`lenis`** | Scroll inercial cinematográfico en escritorio sincronizado al mismo reloj que GSAP. | Sincronizar con `gsap.ticker.add((time) => lenis.raf(time * 1000))` y `gsap.ticker.lagSmoothing(0)`. | **`syncTouch: false` obligatorio.** En iOS/Android se respeta la física nativa del sistema para cero sensación de pesadez. |
| **`motion`** | Física de resortes (*spring physics*), gestos táctiles, transiciones de montaje/desmontaje (`AnimatePresence`), *Bottom Sheet* arrastrable y sellos postales. | Configurar `<MotionConfig reducedMotion="user">` en la raíz de la aplicación. | Responsable de `drag="y"` en el dossier, swipe horizontal entre casos y feedback táctil en botones (`whileTap`). |
| **`three` + `detect-gpu`** | Shader GLSL sutil sobre la fotografía central del Hero (ondulación microscópica de reflejos en el agua + desplazamiento de paralaje por puntero). | Carga diferida (`React.lazy`) exclusivamente tras detectar `tier >= 2 && !isMobile`. | **Desactivado completamente en mobile.** Se renderiza la imagen `.avif` optimizada + luz atmosférica CSS. |
| **`zustand`** | Control sin re-renders innecesarios de filtros activos (`category`, `minStars`, `searchQuery`), `activeCaseId` y preferencia de efectos de sonido. | Selectores atómicos (`useStore(s => s.activeCaseId)`). | Sincroniza instantáneamente el `BayshoreMobileDock` con la grilla sin lag. |

---

## 4. Lenguaje de Movimiento (Motion Spec)

### 4.1 Constantes de Física y Curvas

```ts
export const MOTION = {
  // Easing de precisión editorial (rápido al salir, asentamiento sedoso)
  viceGlide: [0.22, 1, 0.36, 1] as const,
  // Apertura de papel doblado / cortinas de imagen
  paperUnfold: [0.16, 1, 0.3, 1] as const,
  // Salida limpia de modales y overlays
  crispExit: [0.4, 0, 1, 1] as const,

  // Resortes físicos (Framer Motion)
  stampSlam: { type: "spring", stiffness: 460, damping: 26, mass: 0.85 },
  sheetDrawer: { type: "spring", stiffness: 360, damping: 34, mass: 0.9 },
  tactilePress: { type: "spring", stiffness: 600, damping: 30 },
} as const;
```

### 4.2 Secuencia de Entrada Inicial (*Poster Unfold — 0.0s a 1.1s*)
No usar pantallas de carga bloqueantes con porcentajes falsos que arruinan el LCP. La intro ocurre sobre el propio contenido ya pintado:

1. **`0.00s - 0.55s` (Marco Fotográfico):** La fotografía central del atardecer se revela con `clip-path: inset(8% 0% 8% 0%) -> inset(0% 0% 0% 0%)` y `scale(1.06 -> 1)` (`paperUnfold`).
2. **`0.12s - 0.75s` (Masthead `VICE FILES`):** Los caracteres o palabras suben desde `translateY(105%)` dentro de su máscara (`stagger: 0.045s`, `viceGlide`).
3. **`0.30s - 0.85s` (Capas 2.5D Recortadas):** El hidroavión entra suavemente desde la diagonal superior izquierda (`x: -36px, y: -18px -> 0`) y la palmera se desliza desde la derecha (`x: 28px -> 0`).
4. **`0.45s - 0.95s` (Micro-detalles y Estrellas):** El overline superior hace fade con ligero cierre de tracking, las gaviotas aparecen y las 6 estrellas del footer del Hero se encienden en cascada (`stagger: 0.06s`, `stampSlam`).

### 4.3 Tabla Maestra de Coreografías Interactivas

| Componente / Sección | Disparador (*Trigger*) | Propiedades GPU Animadas | Timing / Scrub | Adaptación Mobile |
| :--- | :--- | :--- | :--- | :--- |
| **Capas 2.5D Hero** (Avión, Palmera, Foto) | `ScrollTrigger` sobre el Hero | Avión: `translate3d(90px, -65px, 0) rotate(-4deg)`. Palmera: `translateY(-75px)`. Foto: `scale(1.08)`. | `scrub: 0.65` | Desplazamientos reducidos a max `±26px`; el avión no cruza sobre el título principal. |
| **Gaviotas SVG** | Idle + Scroll | Flotación sutil `y: ±4px` (loop `3.2s`) + deriva horizontal con scroll. | `scrub: 1.1` | Se mantienen solo 2 gaviotas en extremos para evitar ruido visual. |
| **Ticker "Última Hora"** | Loop infinito + Velocidad de scroll | `translateX` continuo; `skewX` reactivo (`clamp(-5deg, vel * 0.002, 5deg)`) y cambio de sentido al subir/bajar. | `60fps` ticker | Sin `skewX` agresivo; velocidad reducida 25% para lectura cómoda en pantalla angosta. |
| **Sello Postal en Tarjeta** | Entrada al viewport (`amount: 0.5`) | `scale(1.5 -> 1)`, `rotate(-20deg -> -8deg)`, `opacity(0 -> 1)`. | `stampSlam` | Se dispara una sola vez (`once: true`) al cruzar el 65% de la altura del viewport. |
| **Duotono -> Color Real** | Hover (Desk) / Banda central (Mob) | Capa Risograph `opacity(1 -> 0)` o barrido `clip-path`, imagen interna `scale(1 -> 1.04)`. | `0.45s viceGlide` | `ScrollTrigger` activa la tarjeta en la franja central (`start: "top 58%"`, `end: "bottom 42%"`). |
| **Reordenamiento de Filtros** | Click / Tap en placa vial | `GSAP Flip.from()` o `motion` `layout` con transición de opacidad para tarjetas entrantes/salientes. | `0.42s viceGlide` | Auto-scroll suave a la cabecera de la grilla si el usuario filtra desde mitad de página. |
| **Estrellas "Wanted Level"** | Viewport Enter | Secuencia `scale(1.85 -> 1)` + micro-pulso de color `--wanted-active`. | `stagger: 0.065s` | Idéntico; refuerza el impacto visual en cada expediente al scrollear. |
| **Despegue "Volver Arriba"** | Click en CTA del Footer | El SVG del hidroavión rota `-12deg` y acelera hacia arriba-derecha mientras Lenis/Scroll vuelve al `y: 0`. | `0.85s paperUnfold` | Igual, con scroll nativo `behavior: 'smooth'`. |

---

## 5. Arquitectura de Secciones (Landing de Polémicas GTA VI)

### Sección 01: Hero — "Leonida Postcard Cover" (`min-h-[100svh]`)
Traduce directamente la composición del póster en una portada interactiva viva:

- **Bloque Superior (Masthead):**
  - Barra superior justificada de extremo a extremo (`justify-between`) en `--font-overline`: `GRAND` `THEFT` `AUTO` `VI` (o `ARCHIVO` `EXTRAOFICIAL` `GTA` `VI`) con relleno `--grad-vice-masthead`.
  - Debajo, el titular colosal `VICE FILES` a todo ancho (`w-full`, ajustado con SVG `<text viewBox>` o tipografía fluida calibrada para no generar nunca desbordamiento horizontal).
- **Cuerpo Central (Composición 2.5D en 3 Z-Layers):**
  - **Z-10 (Centro):** Marco rectangular con la vista nocturna al atardecer de la bahía de Vice City (ratio `4:5` en desktop, `3:4` en mobile).
  - **Z-20 (Márgenes Editoriales — Desktop):**
    - *Columna Izquierda:* Cartel vertical neón estilo motel (`VICE`), bloque compacto `"Leonida, el estado donde todo se filtra."`, iconos duotono sutiles, subtítulo `"Otro día en el paraíso, ¿no?"` y sello postal rotatorio.
    - *Columna Derecha:* Encabezado en cursiva `"Solo en Leonida"`, micro-copy editorial + silueta de flamenco duotono, y bloque inferior `"Cuando cae el sol y el neón se enciende, cada rumor vale millones."`
  - **Z-30 (Recortes sobre el marco):** Hidroavión duotono rompiendo la esquina superior izquierda de la foto y palmera gigante duotono invadiendo el margen derecho, ambos con `pointer-events: none` y `mix-blend-mode: multiply`.
- **Barra Base del Póster (Action Footer del Hero):**
  - Izquierda: Sello circular `VICE CITY • LEONIDA` + botón placa roja `BAYSHORE AVE` transformado en CTA principal: **`ABRIR ARCHIVOS ↓`**.
  - Centro: Separador ondulado SVG (`~~~~~~`) + bajada `"El lado más oscuro del lanzamiento más esperado de la historia."`
  - Derecha: Medidor interactivo de **6 Estrellas** + escudo vial **`95`** indicando el total de polémicas documentadas (`18 CASOS`).

### Sección 02: Ticker — "Última Hora en Leonida"
- Delimitado por dos filetes de tinta `1px solid var(--ink-hairline)` y fondo `--surface-paper-recessed`.
- Muestra expedientes icónicos separados por estrellas pequeñas y ondas:
  `★ [EXP-01] MEGA-FILTRACIÓN DE 90 VIDEOS (2022) ~~~ ★ [EXP-02] EL "FLORIDA JOKER" EXIGE $10 MILLONES ~~~ ★ [EXP-03] FILTRACIÓN DEL TRÁILER 1 EN X ~~~ ★ [EXP-04] DEBATE DEL PRECIO DE $100 USD ~~~`
- Clickear cualquier ítem del ticker abre directamente su `CaseDossier`.

### Sección 03: El Archivo "Most Wanted" (Filtros + Grilla de Polémicas)
El núcleo de contenido de la Landing Page.

- **Cabecera de Sección:** Título editorial en cursiva + contador en vivo (`Mostrando 12 de 18 expedientes`).
- **Barra de Filtros Estilo Señalética Vial:**
  - Categorías tipo placa de calle: `TODAS`, `LEAKS`, `DEMANDAS`, `ROCKSTAR`, `COMUNIDAD`, `PRECIO & LANZAMIENTO`.
  - Filtro secundario de **Nivel de Caos** (selector interactivo de estrellas `3★+`, `5★+`, `6★`).
  - En Desktop es `position: sticky; top: 16px;` dentro de un contenedor crema translúcido. En Mobile, los filtros principales se sincronizan con el **`BayshoreMobileDock`**.
- **Grilla Editorial Asimétrica:**
  - Desktop: Grilla de 12 columnas donde los expedientes de **6 Estrellas** (ej. *Mega-Leak de 2022* o *Polémica de Retrasos*) ocupan **8 columnas** con formato portada destacada, acompañados por expedientes de **4 columnas** en formato vertical.
  - Mobile: Columna única (`grid-cols-1 gap-6`) con respiro editorial y divisores tipo imprenta.

#### Anatomía Detallada de `ControversyCard`
1. **Top Bar (`--font-mono`):** `#EXP-01 • SEP 2022` a la izquierda | `WantedStarsMeter` (1 a 6★) a la derecha.
2. **Ventana Visual (`RisographMediaFrame`):** Ratio `16:10` (destacada) o `4:3` (estándar). Duotono violeta-magenta en reposo -> revelación a color real al enfocar. Esquina superior derecha coronada por el **`PostalStampBadge`** rotado (ej. `CONFIRMADO`, `DEMANDA`, `VIRAL`).
3. **Cuerpo Editorial:**
   - Tag de categoría tipo placa pequeña (`LEAKS`).
   - Titular contundente en `Inter Tight Bold` (`clamp(1.35rem, 2vw, 2rem)`, `leading: 1.0`).
   - Bajada concisa de máximo 2-3 líneas (`--ink-secondary`).
4. **Footer de Tarjeta:** Línea divisoria fina + metadata de impacto (`Impacto: Histórico`) + acción **`LEER EXPEDIENTE →`** con flecha que se desplaza `4px` en hover.

### Sección 04: "Ruta 95" — Cronología Interactiva del Caos
Recorrido lineal de todos los hitos y escándalos desde 2022 hasta la actualidad:

- **Experiencia Desktop (`>= 1024px`):**
  - Contenedor *pinned* con `ScrollTrigger` que traduce el scroll vertical en desplazamiento horizontal suave a lo largo de una línea de autopista estilizada.
  - Hitos marcados por escudos viales **`95`**, silueta wireframe de auto clásico moviéndose proporcionalmente al progreso (`0% -> 100%`) y tarjetas compactas alternadas arriba y abajo de la ruta.
- **Experiencia Mobile (`< 1024px`):**
  - Transformación estructural completa vía `gsap.matchMedia()`: **Timeline vertical** con una línea fija en el margen izquierdo (`left: 20px`) que se rellena dinámicamente con `--grad-vice-masthead` al scrollear, con nodos tipo escudo `95` y tarjetas desplazándose suavemente desde la derecha.

### Sección 05: "Termómetro de Leonida" (Infografía Editorial)
Un respiro visual entre tarjetas pesadas que refuerza la estética de revista impresa:
- 3 o 4 bloques tipográficos monumentales separados por filetes de tinta y ondas SVG:
  - Total de polémicas documentadas.
  - Mayor cifra exigida en demandas mediáticas (ej. `$10M` Florida Joker).
  - Récord de visualizaciones del Tráiler 1 tras la filtración.
  - Contador de días/hitos clave.
- Los números utilizan `tabular-nums` y una animación de conteo limpia disparada al entrar en pantalla.

### Sección 06: Visor de Expediente (`CaseDossier`)
Al abrir cualquier polémica:

- **Desktop:** Modal editorial de `max-w-5xl` centrado sobre backdrop `--surface-photo-night/70` con `backdrop-blur-sm`. Diseño de carpeta abierta a 2 columnas:
  - *Columna Izquierda (Fija):* Foto a color en alta calidad, nivel de búsqueda, sello postal oficial, fecha, protagonistas y bloque "Veredicto / Estado actual".
  - *Columna Derecha (Scrolleable):* Crónica detallada, línea de tiempo interna del incidente ("Qué pasó", "Reacción de Rockstar / Take-Two", "Consecuencia"), citas destacadas estilo revista y fuentes verificadas.
- **Mobile:** **Bottom Sheet nativo (`h-[88dvh]`)** con fondo `--surface-paper-elevated`:
  - Tirador superior (*grab handle*) con gesto `drag="y"` para cerrar deslizando hacia abajo (umbral: `offset > 120px` o `velocity > 500px/s`).
  - Barra inferior pegada en la zona del pulgar con botones `← Anterior`, `Compartir`, `Siguiente →` respetando `env(safe-area-inset-bottom)`.

### Sección 07: Footer — "Reverso de Postal de Leonida"
Estética literal del dorso de una tarjeta postal vintage:
- En Desktop, dividido en dos mitades por una línea vertical central de tinta.
- **Mitad Izquierda:** Disclaimer claro de archivo periodístico/comunitario no afiliado a Rockstar Games, créditos de diseño y enlaces rápidos a categorías.
- **Mitad Derecha:** Gran sello postal circular de `VICE CITY • LEONIDA`, líneas horizontales de dirección con texto humorístico de Leonida y botón interactivo **`VOLVER ARRIBA`** acompañado del hidroavión SVG que despega al activarse.

---

## 6. Catálogo de Componentes Clave (Micro-interacciones)

### 6.1 `StreetSignButton` (Inspirado en `BAYSHORE AVE`)
- **Visual:** Fondo `--stamp-crimson`, texto `--ink-inverse` en `Barlow Condensed 800`, borde fino interior de `1px solid rgba(247,242,236,0.35)` con `outline-offset: -3px` simulando una señal metálica de calle real.
- **Estados:**
  - *Hover:* Transición de fondo a `--stamp-crimson-dark` y micro-desplazamiento `translateY(-1px)`.
  - *Active / Tap:* `scale(0.97)` con resorte `tactilePress`.
  - *Focus Visible:* Ring doble de alto contraste (`2px solid var(--vice-indigo)` con `offset: 2px`).

### 6.2 `PostalStampBadge`
- **Visual:** Sello circular SVG con doble anillo, texto curvo superior (`VICE FILES`), icono central (palmera, balanza legal o alerta) y estado en la base (`CONFIRMADO`, `RUMOR`, `LITIGIO`).
- **Acabado:** `mix-blend-mode: multiply` y ligera máscara de erosión de tinta SVG para que parezca estampado a mano sobre el papel.

### 6.3 `NeonMotelSign` (Decorativo Interactivo)
- **Visual:** Letrero vertical cápsula con estrellas arriba y abajo y letras apiladas `V I C E` con trazo degradado `--grad-neon-sign` (referencia directa al lateral izquierdo del póster).
- **Interacción:** En reposo tiene un brillo sutil casi imperceptible; al hacer hover o tap, ejecuta un micro-parpadeo eléctrico realista de `180ms` (desactivado con `prefers-reduced-motion`).

### 6.4 `BayshoreMobileDock` (Exclusivo `< 768px`)
- **Ubicación:** Flotante en la parte inferior (`bottom: calc(14px + env(safe-area-inset-bottom))`), centrado horizontalmente.
- **Estilo:** Píldora editorial de papel translúcido (`--surface-dock-glass` + `backdrop-blur-md`) con borde `1px solid var(--ink-border-strong)`.
- **Contenido:** 3 accesos directos grandes (`min-h-[44px]`): **Archivo** (scroll a grilla), **Filtros** (abre sheet compacto de categorías y estrellas con badge numérico si hay filtros activos) y **Ruta 95** (salta a la cronología).
- **Comportamiento inteligente:** Se oculta suavemente hacia abajo (`translateY(120%)`) cuando el usuario hace scroll rápido descendente leyendo tarjetas, y reaparece de inmediato al menor gesto hacia arriba.

---

## 7. Estrategia Mobile-First & Ergonomía Táctil

Más del 75% de las visitas a contenido de cultura gaming llegan desde navegadores embebidos de redes sociales (X/Twitter, Instagram, TikTok, YouTube). La experiencia móvil es prioridad de arquitectura, no una reducción posterior:

1. **Estabilidad de Viewport (`svh` y `dvh`):**
   - El Hero usa `min-h-[100svh]` para impedir saltos bruscos cuando las barras de Safari iOS o Chrome Android se expanden o contraen.
   - Los Bottom Sheets usan `max-h-[88dvh]` y `overscroll-behavior: contain` para evitar el rebote elástico del `body` detrás del modal.
2. **Prohibido `overflow-x: hidden` en `html/body`:**
   - Usar siempre `overflow-x: clip` en contenedores con ilustraciones recortadas (avión y palmera) para evitar scroll horizontal fantasma **sin romper `position: sticky`**.
3. **Adaptación del Hero Vertical:**
   - En `< 768px`, las columnas laterales del póster no se comprimen a los costados de la foto (lo cual haría el texto ilegible). En su lugar:
     - El Masthead `VICE FILES` domina el tope.
     - La foto central ocupa el `88%` del ancho con la palmera y el hidroavión asomando de forma contenida en sus esquinas opuestas.
     - La frase editorial `"Only in Leonida"` y el CTA placa `BAYSHORE AVE` viven inmediatamente debajo, manteniendo todo el *hook* principal **above the fold**.
4. **Cero Dependencia de Hover:**
   - Toda información relevante (título, fecha, categoría, estrellas) es visible por defecto.
   - La magia visual (cambio de Risograph Duotone a color real) se activa automáticamente por **banda de enfoque central al scrollear**.
5. **Ergonomía y Targets Táctiles:**
   - Ningún elemento interactivo (filtros, estrellas clickeables, cierre de modal, flechas del dossier) puede medir menos de `44px × 44px`.
   - Swipe horizontal opcional dentro del `CaseDossier` móvil para pasar al siguiente expediente sin levantar el pulgar.

---

## 8. Contrato de Datos (TypeScript Schema)

Estructura limpia para desacoplar el diseño editorial de la base de datos o archivos MDX/JSON de polémicas:

```ts
export type ControversyCategory =
  | "leaks"
  | "demandas"
  | "rockstar"
  | "comunidad"
  | "lanzamiento";

export type StampStatus =
  | "CONFIRMADO"
  | "DEMANDA"
  | "RUMOR"
  | "RESUELTO"
  | "EN CURSO";

export interface ControversyCase {
  id: string;                      // ej: "exp-01-mega-leak-2022"
  caseNumber: string;              // ej: "EXP-01"
  slug: string;
  title: string;                   // Titular editorial corto y potente
  subtitle: string;                // Bajada de 2 líneas para tarjeta
  dateISO: string;                 // "2022-09-18"
  displayDate: string;             // "SEP 2022"
  category: ControversyCategory;
  stampStatus: StampStatus;
  wantedLevel: 1 | 2 | 3 | 4 | 5 | 6;
  featured?: boolean;              // true = tarjeta doble (8 cols en desktop)
  media: {
    src: string;
    alt: string;
    aspectRatio: "16/10" | "4/3" | "4/5";
    credit?: string;
  };
  summaryPoints: {
    whatHappened: string;
    rockstarResponse: string;
    outcome: string;
  };
  quote?: {
    text: string;
    author: string;
  };
  sources: Array<{ label: string; url: string }>;
}
```

---

## 9. Presupuesto de Rendimiento, Ingeniería y Accesibilidad

### 9.1 Performance Budget (Objetivos Estrictos)

| Métrica | Objetivo Mobile (4G Rápido) | Objetivo Desktop | Regla de Ingeniería |
| :--- | :--- | :--- | :--- |
| **LCP** | `< 2.1s` | `< 1.3s` | Imagen central del Hero en `.avif` con `fetchPriority="high"` y `loading="eager"`. |
| **CLS** | `< 0.03` | `< 0.02` | `aspect-ratio` obligatorio en todas las fotos y dimensiones explícitas en SVGs. |
| **INP** | `< 120ms` | `< 60ms` | Cero cálculos pesados en eventos de click; filtros memorizados con `useMemo`. |
| **FPS en Scroll** | `60fps` constantes | `60-120fps` | Animar únicamente `transform`, `opacity` y `clip-path`. Prohibido animar `top/left/width/height/blur`. |
| **Peso SVGs Decorativos** | `< 35 KB` gzip total | `< 35 KB` gzip total | Optimizar con SVGO (hidroavión, palmera, gaviotas, flamenco, sellos, escudo 95). |

### 9.2 Accesibilidad (WCAG 2.1 AA)
- **Contraste:** Tinta `#171416` sobre papel `#F2EAE1` entrega un ratio superior a **14.8:1** (AAA). El texto blanco `#F7F2EC` sobre placa `--stamp-crimson` (`#C46367`) debe oscurecerse a `#A94B50` en textos menores a `18px` para garantizar un contraste mínimo de **4.6:1 (AA)**.
- **Movimiento Reducido (`prefers-reduced-motion: reduce`):**
  - Desactivar parallax 2.5D, ticker automático, parpadeo del cartel neón y shader WebGL.
  - Sustituir revelaciones desplazadas por transiciones de opacidad limpias de `180ms`.
- **Semántica y Teclado:**
  - Todas las ilustraciones decorativas (avión, palmera, ondas, gaviotas, grano) llevan `aria-hidden="true"`.
  - El `CaseDossier` implementa *focus trap* completo, cierre con tecla `Escape` y restauración automática del foco al botón que lo abrió.

---

## 10. Estructura de Proyecto Sugerida

```text
src/
├── assets/
│   ├── svg/                     # Ilustraciones duotono optimizadas (Seaplane, Palm, Stamp, Route95)
│   └── images/                  # Fotos .avif / .webp responsivas
├── data/
│   └── controversies.ts         # Dataset tipado con ControversyCase[]
├── store/
│   └── useViceStore.ts          # Estado global Zustand (filtros, caso activo)
├── styles/
│   ├── tokens.css               # Variables CSS, gradientes y tipografía fluida
│   └── textures.css             # Grano de papel, pliegues y helpers de blend-mode
├── components/
│   ├── core/
│   │   ├── SmoothScrollProvider.tsx   # Setup Lenis + sincronización GSAP ticker
│   │   ├── PaperTexturesLayer.tsx     # Overlay de grano + SVG Filters globales
│   │   └── StreetSignButton.tsx       # Placa BAYSHORE AVE reutilizable
│   ├── editorial/
│   │   ├── RisographMediaFrame.tsx    # Doble capa 60fps Duotono -> Color
│   │   ├── PostalStampBadge.tsx       # Sello circular con animación stampSlam
│   │   ├── WantedStarsMeter.tsx       # Medidor 1-6 estrellas interactivo/animado
│   │   └── NeonMotelSign.tsx          # Cartel vertical VICE
│   ├── sections/
│   │   ├── HeroPostcard.tsx           # Portada 2.5D con parallax GSAP
│   │   ├── LeonidaTicker.tsx          # Marquee reactivo a velocidad de scroll
│   │   ├── ControversyArchive.tsx     # Filtros + Grilla editorial asimétrica
│   │   ├── Route95Timeline.tsx        # Horizontal Pinned (Desk) / Vertical (Mob)
│   │   ├── ChaosThermometer.tsx       # Métricas tipográficas
│   │   └── PostcardFooter.tsx         # Reverso de postal + despegue de avión
│   └── overlays/
│       ├── CaseDossier.tsx            # Modal editorial (Desk) / Bottom Sheet (Mob)
│       └── BayshoreMobileDock.tsx     # Barra flotante ergonómica en Thumb Zone
└── App.tsx
```