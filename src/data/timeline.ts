export interface RouteMilestone {
  id: string;
  date: string;
  title: string;
  description: string;
  caseId: string;
}

export const ROUTE_MILESTONES: RouteMilestone[] = [
  {
    id: "m-2014",
    date: "2014",
    title: "GTA V sale de dos cadenas australianas",
    description: "Una petición pone el foco en la violencia contra mujeres.",
    caseId: "exp-08",
  },
  {
    id: "m-2022",
    date: "2022",
    title: "¿De quién se ríe GTA?",
    description: "La futura protagonista y el humor entran en discusión.",
    caseId: "exp-08",
  },
  {
    id: "m-18nov",
    date: "18 NOV",
    title: "La decisión del estudio",
    description: "Shacknews recoge la explicación de Rockstar.",
    caseId: "exp-03",
  },
  {
    id: "m-19nov-mandy",
    date: "19 NOV",
    title: "La captura sobre Mandy",
    description: "Fecha que figura en la imagen aportada.",
    caseId: "exp-01",
  },
  {
    id: "m-19nov-wired",
    date: "19 NOV",
    title: "El debate llega a la prensa",
    description: "WIRED documenta la discusión en redes.",
    caseId: "exp-02",
  },
  {
    id: "m-20nov-meta",
    date: "20 NOV",
    title: "99 en prensa vs. 5,2 en Metacritic",
    description: "La brecha entre crítica, consolas y portales abiertos.",
    caseId: "exp-07",
  },
];

export interface PulseCategory {
  id: number;
  percent: number;
  label: string;
  color: string;
  interpretation: string;
}

export const PULSE_CATEGORIES: PulseCategory[] = [
  {
    id: 0,
    percent: 55,
    label: "Celebración",
    color: "#75549d",
    interpretation:
      "El grupo más grande celebró el lanzamiento. Entre sus motivos aparecen el aspecto de Leonida y el detalle de la ciudad.",
  },
  {
    id: 1,
    percent: 24,
    label: "Nostalgia",
    color: "#c56882",
    interpretation:
      "Casi uno de cada cuatro mensajes evocaba recuerdos de la saga. Alguien puede extrañar su primera visita a Vice City y todavía no haber jugado GTA VI.",
  },
  {
    id: 2,
    percent: 21,
    label: "Críticas",
    color: "#bc784b",
    interpretation:
      "Las críticas incluyen precio, rendimiento y falta de disco. El estudio no especifica cuántas usaban «woke». Atribuir todo ese 21 % a la polémica cambiaría el sentido del dato.",
  },
];

export interface ThermometerMetric {
  id: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  footnote: string;
}

export const THERMOMETER_METRICS: ThermometerMetric[] = [
  {
    id: "impressions",
    value: 355.8,
    suffix: "M",
    decimals: 1,
    label: "Impresiones en 72 horas",
    footnote: "Estudio DINAMIC (17–19 nov. 2026) · 97,3 % orgánico",
  },
  {
    id: "units",
    value: 32.5,
    suffix: "M",
    decimals: 1,
    label: "Unidades estimadas",
    footnote: "Reservas digitales y físicas · US$3.790 M iniciales",
  },
  {
    id: "animations",
    value: 600,
    suffix: "K",
    decimals: 0,
    label: "Animaciones de NPC",
    footnote: "Equipo de población de Los Ángeles · Leónida",
  },
  {
    id: "gap",
    value: 99,
    suffix: "/100",
    decimals: 0,
    label: "Metascore de prensa",
    footnote: "Frente a 5,2–5,5/10 en votos abiertos de Metacritic",
  },
];

export interface RealismTab {
  id: string;
  tabLabel: string;
  title: string;
  body: string;
  linkLabel: string;
  linkUrl: string;
}

export const REALISM_TABS: RealismTab[] = [
  {
    id: "inmersion",
    tabLabel: "Me mete en el mundo",
    title: "La ciudad se siente habitable",
    body: "Un jugador de Reddit encontró que los pequeños trámites y el cuidado del personaje hacían que Vice City se sintiera familiar y viva.",
    linkLabel: "Leer su experiencia en Reddit",
    linkUrl:
      "https://www.reddit.com/r/GTA6unmoderated/comments/1y0tu4w/thoughts_after_15_hours_of_gameplay/",
  },
  {
    id: "ritmo",
    tabLabel: "Me corta el ritmo",
    title: "El detalle también puede frenar la acción",
    body: "En X, otro jugador elogió el mapa. Las reacciones de los personajes, el sistema policial y el ritmo le hicieron sentir que estaba jugando a algo distinto de GTA.",
    linkLabel: "Leer su experiencia en X",
    linkUrl: "https://x.com/wstgoat7/status/2123454992975544558",
  },
  {
    id: "simulacion",
    tabLabel: "¿Tiene vida propia?",
    title: "¿Qué hace el peatón cuando te vas?",
    body: "Alguien que juega a simuladores puede valorar otra cosa: que un vecino tenga horarios, relaciones y planes que continúen fuera de cámara. Una reacción muy bien animada basta para que una calle parezca viva. Seguir a un peatón plantea una pregunta distinta.",
    linkLabel: "Leer la conversación en r/LifeSimulators",
    linkUrl:
      "https://www.reddit.com/r/LifeSimulators/comments/1y12rdx/is_gta_6_becoming_a_life_sim/",
  },
];

export interface EscaletaStep {
  timecode: string;
  title: string;
  description: string;
}

export const VIDEO_ESCALETA: EscaletaStep[] = [
  {
    timecode: "0:00–0:35",
    title: "El post sobre Mandy",
    description:
      "Ariel presenta la captura. Lu pregunta qué dice literalmente y de dónde salió la etiqueta «woke».",
  },
  {
    timecode: "0:35–1:35",
    title: "Qué cambió en GTA VI",
    description:
      "Contar qué ocurrió con el sexo pago, la historia de Jason y Lucia y las actividades opcionales.",
  },
  {
    timecode: "1:35–2:55",
    title: "Distintas reacciones",
    description:
      "Lu lee el gráfico de DINAMIC. Ariel compara un comentario de X con otro de Reddit. ¿Qué se pierde si tratamos la captura como una encuesta?",
  },
  {
    timecode: "2:55–4:25",
    title: "Una segunda vida",
    description:
      "Cada uno elige una rutina. Lu cuenta cuál disfrutaría y Ariel trae el contrapunto de r/LifeSimulators sobre los peatones.",
  },
  {
    timecode: "4:25–5:20",
    title: "Cerrar con las dos miradas",
    description: "Cada voz responde qué libertades espera de Vice City.",
  },
];

export interface LuStop {
  number: string;
  title: string;
  body: string;
  links: Array<{
    label: string;
    href: string;
    caseId?: string;
  }>;
}

export const LU_STOPS: LuStop[] = [
  {
    number: "01",
    title: "¿Qué dijo esa cuenta?",
    body: "En la captura, una cuenta pide poder agredir a Mandy. La palabra «woke» aparece en otras publicaciones. En el video podemos mostrar de dónde sale cada argumento.",
    links: [
      {
        label: "Leer la captura en contexto ↗",
        href: "#exp-01",
        caseId: "exp-01",
      },
    ],
  },
  {
    number: "02",
    title: "¿Era una opinión común?",
    body: "Imaginá que tres personas te reenvían la misma captura. Conocés su recorrido, pero todavía no sabés si alguna está de acuerdo con ella. Más abajo podés ver qué contó el estudio de redes.",
    links: [{ label: "Leer el gráfico de redes ↓", href: "#pulso" }],
  },
  {
    number: "03",
    title: "¿Qué dirías vos en cámara?",
    body: "Elegí una rutina, como comprar flores o cargar nafta. ¿Te acerca a los personajes o te saca del juego? Podemos abrir con tu respuesta y después escuchar a alguien que lo vivió distinto.",
    links: [
      { label: "Comparar las miradas ↓", href: "#realismo" },
      { label: "Ir al guion ↓", href: "#video" },
    ],
  },
];
