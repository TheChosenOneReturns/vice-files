import { assetUrl } from "../lib/assetUrl";

export type ControversyGroup = "Comunidad" | "Diseño" | "Recepción" | "Historia";

export type StampStatus =
  | "CONFIRMADO"
  | "VIRAL"
  | "DISEÑO"
  | "DATO"
  | "ARCHIVO"
  | "REGULACIÓN";

export interface CaseSource {
  outlet: string;
  label: string;
  url: string;
}

export interface CaseEvidence {
  warningSummary: string;
  imageSrc: string;
  imageAlt: string;
  caption: string;
}

export interface ControversyCase {
  id: string;
  caseNumber: string;
  group: ControversyGroup;
  kicker: string;
  displayDate: string;
  title: string;
  summary: string;
  stampStatus: StampStatus;
  wantedLevel: 1 | 2 | 3 | 4 | 5 | 6;
  featured?: boolean;
  media: {
    src: string;
    alt: string;
    objectPosition?: string;
  };
  whatHappened: string;
  evidenceLimit: string;
  evidence?: CaseEvidence;
  quote: string;
  sources: CaseSource[];
}

export const CONTROVERSY_GROUPS: Array<ControversyGroup | "Todas"> = [
  "Todas",
  "Comunidad",
  "Diseño",
  "Recepción",
  "Historia",
];

export const CONTROVERSIES: ControversyCase[] = [
  {
    id: "exp-01",
    caseNumber: "EXP-01",
    group: "Comunidad",
    kicker: "Captura aportada",
    displayDate: "19 NOV 2026",
    title: "El caso Mandy",
    summary:
      "Un comentario exige poder agredir sexualmente a Mandy. ¿Qué idea de libertad hay detrás de ese reclamo?",
    stampStatus: "VIRAL",
    wantedLevel: 6,
    featured: true,
    media: {
      src: assetUrl("media/exp-01-mandy.webp"),
      alt: "Escena nocturna de Vice City asociada al expediente sobre el caso Mandy",
      objectPosition: "50% 59%",
    },
    whatHappened:
      "La captura muestra a una cuenta que cita dos imágenes de Mandy publicadas por Complex. Quien escribe pide devolver el juego por no poder violarla y termina con un insulto al cuerpo y al origen latino de Lucia. La palabra «woke» no aparece en ese mensaje.",
    evidence: {
      warningSummary: "Ver la captura aportada · lenguaje sexual violento",
      imageSrc: assetUrl("media/exp-01-evidence.webp"),
      imageAlt:
        "Captura aportada del comentario sobre Mandy. El contenido se describe en el primer párrafo del expediente.",
      caption:
        "La fecha y las interacciones se muestran tal como aparecen en la captura.",
    },
    evidenceLimit:
      "El original y las cifras de interacción siguen sin verificación directa. Las imágenes de Complex permiten rastrear el contexto visual. La opinión de esa cuenta, por sí sola, no mide lo que piensa la comunidad.",
    quote:
      "¿En qué momento hablar de libertad para el jugador se convierte en hablar del cuerpo de un personaje como si le perteneciera?",
    sources: [
      {
        outlet: "X · copias indexadas",
        label: "Contexto de la publicación sobre Mandy",
        url: "https://www.teapaw.org/splashminion",
      },
      {
        outlet: "X · Complex",
        label: "Las imágenes de Mandy citadas en el post",
        url: "https://x.com/Complex/status/2123130037582921831",
      },
    ],
  },
  {
    id: "exp-02",
    caseNumber: "EXP-02",
    group: "Comunidad",
    kicker: "Opiniones en redes",
    displayDate: "19 NOV 2026",
    title: "¿Qué llaman «woke»?",
    summary:
      "Comprar flores para Lucia y el cambio en el sexo pago provocaron críticas distintas bajo la misma etiqueta.",
    stampStatus: "VIRAL",
    wantedLevel: 5,
    media: {
      src: assetUrl("media/exp-02-woke.webp"),
      alt: "Arte promocional de Vice City vinculado al debate sobre la etiqueta woke",
    },
    whatHappened:
      "En X, ExoGhost recurrió a «woke» al comentar la posibilidad de regalarle flores a Lucia. En r/KotakuInAction, el disparador fue la ausencia de sexo pago. Agrupar ambos ejemplos permite escuchar cómo se usa la palabra y preguntar qué objeción concreta expresa cada persona.",
    evidenceLimit:
      "Son publicaciones elegidas para comparar argumentos. Su presencia en la recopilación no permite calcular cuántos jugadores los comparten.",
    quote:
      "Si sacamos la palabra «woke» de cada publicación, ¿qué objeción queda en pie?",
    sources: [
      {
        outlet: "X · ExoGhost",
        label: "Las flores para Lucia y la etiqueta «woke»",
        url: "https://x.com/ExoGhost/status/2123042449006182538",
      },
      {
        outlet: "Reddit · r/KotakuInAction",
        label: "Reacciones a la retirada del sexo pago",
        url: "https://www.reddit.com/r/KotakuInAction/comments/1xzj65n/confirmed_no_prostitutes_in_gta_6_to_emphasize/",
      },
      {
        outlet: "WIRED · cobertura",
        label: "Reacciones en X y el rumor sobre la discoteca",
        url: "https://www.wired.com/story/dudes-online-are-so-mad-that-gta-vi-makes-them-respect-women/",
      },
    ],
  },
  {
    id: "exp-03",
    caseNumber: "EXP-03",
    group: "Diseño",
    kicker: "Declaración del estudio",
    displayDate: "18 NOV 2026",
    title: "La decisión de Rockstar",
    summary:
      "La relación entre Jason y Lucia cambió una mecánica que algunos jugadores esperaban encontrar en Vice City.",
    stampStatus: "CONFIRMADO",
    wantedLevel: 5,
    media: {
      src: assetUrl("media/exp-03-rockstar.webp"),
      alt: "Identidad visual de Rockstar Games en tonos atardecer de Leonida",
    },
    whatHappened:
      "GTA V permitía pagar por servicios sexuales. Según la explicación de Rockstar recogida por Shacknews, el estudio dejó esa opción fuera de GTA VI para sostener la historia de la pareja. En Reddit, un jugador argumentó que la posibilidad de elegir formaba parte de su experiencia de mundo abierto.",
    evidenceLimit:
      "La decisión documentada se refiere al sexo pago. La captura sobre Mandy reclama una agresión sexual. Atribuir ambas cosas a un mismo cambio de diseño alteraría lo que dicen las fuentes.",
    quote:
      "¿Qué decisiones debería poder tomar el jugador y cuáles le corresponden a quien escribe al personaje?",
    sources: [
      {
        outlet: "Shacknews · Rockstar",
        label: "La explicación del estudio sobre el cambio",
        url: "https://www.shacknews.com/article/151386/prostitutes-gta6",
      },
      {
        outlet: "Reddit · r/GTA6unmoderated",
        label: "Qué libertad esperaba un jugador de GTA V",
        url: "https://www.reddit.com/r/GTA6unmoderated/comments/1xzsnx9/removing_prostitutes_from_the_game_makes_no_sense/",
      },
      {
        outlet: "ESRB · clasificación",
        label: "Contenido sexual y sistema de afecto en GTA VI",
        url: "https://www.esrb.org/ratings/41627/grand-theft-auto-vi/",
      },
    ],
  },
  {
    id: "exp-04",
    caseNumber: "EXP-04",
    group: "Comunidad",
    kicker: "Debate en Reddit",
    displayDate: "20 NOV 2026",
    title: "Lucia bajo la lupa",
    summary:
      "¿Qué cambia en la conversación cuando una mujer pasa a compartir el protagonismo de GTA?",
    stampStatus: "VIRAL",
    wantedLevel: 4,
    media: {
      src: assetUrl("media/exp-04-lucia.webp"),
      alt: "Ilustración de Lucia Caminos en Vice City",
      objectPosition: "50% 13%",
    },
    whatHappened:
      "En r/PornIsMisogyny, participantes cuestionan cómo se mira a las mujeres del juego y cómo circulan ciertos clips. Su lectura permite volver al insulto contra Lucia en la captura y preguntar por qué su cuerpo acaba en una discusión sobre las reglas del juego.",
    evidenceLimit:
      "El hilo recoge una mirada situada. Para el video conviene citar un argumento concreto y atribuirlo al hilo, sin hablar en nombre de todas las jugadoras.",
    quote:
      "¿Con qué palabras se describe a Lucia cuando se habla de ella como protagonista y cuando se habla de su aspecto?",
    sources: [
      {
        outlet: "Reddit · r/PornIsMisogyny",
        label: "Representación y sexualización de las mujeres",
        url: "https://www.reddit.com/r/PornIsMisogyny/comments/1y0rxop/gta_6_and_the_lack_of_respect_for_women_as_people/",
      },
      {
        outlet: "WIRED · cobertura",
        label: "Reacciones en X y el rumor sobre la discoteca",
        url: "https://www.wired.com/story/dudes-online-are-so-mad-that-gta-vi-makes-them-respect-women/",
      },
    ],
  },
  {
    id: "exp-05",
    caseNumber: "EXP-05",
    group: "Diseño",
    kicker: "Testimonios y desarrollo",
    displayDate: "20 NOV 2026",
    title: "¿Una segunda vida?",
    summary:
      "Para unos la rutina vuelve creíble a Vice City. Para otros interrumpe el ritmo que los llevaba a jugar.",
    stampStatus: "DISEÑO",
    wantedLevel: 6,
    featured: true,
    media: {
      src: assetUrl("media/exp-05-secondlife.webp"),
      alt: "Avenida art déco de Vice City al atardecer con palmeras",
    },
    whatHappened:
      "Una reseña en Reddit valora las pequeñas tareas cotidianas porque hacen que la ciudad se sienta habitada. En X, otro jugador elogia el mapa, pero cuestiona cómo el ritmo y las reacciones de los personajes modifican la experiencia. En r/LifeSimulators surge una tercera pregunta: ¿alcanza con que un peatón reaccione de manera convincente para decir que tiene una vida propia?",
    evidenceLimit:
      "Un NPC es un personaje controlado por el juego. Hindustan Times recoge una estimación de unas 600.000 animaciones. David Hynd, de Rockstar, explicó a VICE que ampliaron los diálogos y las reacciones de los grupos. Esos detalles ayudan a entender la sensación de vida. Saber si un personaje sigue una rutina cuando te alejás requiere otra clase de prueba.",
    quote:
      "¿Qué trámite seguirías haciendo por gusto después de diez horas y cuál empezarías a saltear?",
    sources: [
      {
        outlet: "Reddit · Testimonio",
        label: "Leer su experiencia en Reddit",
        url: "https://www.reddit.com/r/GTA6unmoderated/comments/1y0tu4w/thoughts_after_15_hours_of_gameplay/",
      },
      {
        outlet: "X · Testimonio",
        label: "Leer su experiencia en X",
        url: "https://x.com/wstgoat7/status/2123454992975544558",
      },
      {
        outlet: "The Verge · entrevista",
        label: "Cómo Rockstar equilibró detalle y ritmo",
        url: "https://www.theverge.com/entertainment/1035806/grand-theft-auto-6-rob-nelson-interview",
      },
      {
        outlet: "Reddit · r/LifeSimulators",
        label: "Qué espera de un peatón alguien que juega a simuladores",
        url: "https://www.reddit.com/r/LifeSimulators/comments/1y12rdx/is_gta_6_becoming_a_life_sim/",
      },
      {
        outlet: "VICE · reseña",
        label: "Diálogos y encuentros que dan vida a la calle",
        url: "https://www.vice.com/en/article/gta-6-review/",
      },
      {
        outlet: "Hindustan Times · desarrollo",
        label: "El trabajo de animación detrás de los peatones",
        url: "https://www.hindustantimes.com/sports/us-sports/gta-6-features-600-000-animations-as-rockstar-takes-npc-realism-to-another-level-report-grand-theft-auto-101793482770395.html",
      },
    ],
  },
  {
    id: "exp-06",
    caseNumber: "EXP-06",
    group: "Recepción",
    kicker: "Estudio de redes",
    displayDate: "17–19 NOV 2026",
    title: "¿Cuánta gente pensaba así?",
    summary:
      "Una captura puede llegar muy lejos. DINAMIC midió qué otros mensajes circularon durante los tres días del estreno.",
    stampStatus: "DATO",
    wantedLevel: 4,
    media: {
      src: assetUrl("media/exp-06-dinamic.webp"),
      alt: "Gráfico editorial sobre la medición de conversación en redes",
    },
    whatHappened:
      "Del 17 al 19 de noviembre, DINAMIC registró 355,8 millones de impresiones. En su clasificación de mensajes, el 55 % expresaba celebración, el 24 % nostalgia y el 21 % críticas. X concentró el 44 % de la conversación medida. Entre los reproches también aparecían el precio, el disco físico, el doblaje y el rendimiento.",
    evidenceLimit:
      "Una impresión se cuenta cada vez que se muestra un contenido. La misma persona puede generar varias. Los porcentajes describen lo que el método de DINAMIC detectó en redes durante esos días. El estudio tampoco desglosa cuántas críticas utilizaban la palabra «woke».",
    quote:
      "Lu, si una publicación nos apareció diez veces, ¿qué tendríamos que saber para decir que diez personas están de acuerdo?",
    sources: [
      {
        outlet: "Vandal · DINAMIC",
        label: "Cómo se repartió la conversación del 17 al 19 de noviembre",
        url: "https://vandal.elespanol.com/noticia/2026324035/que-dicen-las-redes-sobre-gta-6-un-estudio-desvela-la-celebracion-y-las-criticas-del-evento-cultural/",
      },
    ],
  },
  {
    id: "exp-07",
    caseNumber: "EXP-07",
    group: "Recepción",
    kicker: "Notas del estreno",
    displayDate: "20–21 NOV 2026",
    title: "¿Quién le puso esa nota?",
    summary:
      "La crítica, los votantes de Metacritic y quienes puntuaron en consola ofrecieron retratos muy diferentes del mismo juego.",
    stampStatus: "DATO",
    wantedLevel: 5,
    media: {
      src: assetUrl("media/exp-07-metacritic.webp"),
      alt: "Contraste de reseñas de GTA VI entre prensa y portales abiertos",
    },
    whatHappened:
      "El 20 de noviembre, Notebookcheck registró un 99/100 de la crítica y un 5,2/10 de usuarios en Metacritic, tras 13.192 puntuaciones. ComicBook observó 4,85/5 en PlayStation Store y 5/5 en Xbox Store. La llegada de numerosos ceros alimentó sospechas de una campaña de reseñas negativas, conocida como review bombing.",
    evidenceLimit:
      "Cada página recoge votos de un grupo distinto, en momentos y escalas diferentes. El promedio por sí solo no revela quién jugó, cómo se organizó ni por qué votó. Quien se queja de los 30 FPS o espera una edición para PC puede tener motivos muy distintos de quien rechaza a Lucía.",
    quote:
      "¿Qué diríamos de una crítica de una estrella si pudiéramos leer su argumento antes de ver la nota?",
    sources: [
      {
        outlet: "Notebookcheck · 20 nov.",
        label: "Las primeras 13.192 notas de usuarios",
        url: "https://www.notebookcheck.net/GTA-6-Metacritic-user-score-opens-at-5-2-10-prompting-review-bombing-accusations.1455598.0.html",
      },
      {
        outlet: "ComicBook · tiendas de consolas",
        label: "Las puntuaciones de PlayStation y Xbox durante el estreno",
        url: "https://comicbook.com/gaming/news/gta-6-grand-theft-auto-vi-user-review-score-metacritic/",
      },
      {
        outlet: "Vandal · rendimiento",
        label: "El límite de 30 fotogramas por segundo",
        url: "https://vandal.elespanol.com/noticia/2026323022/rockstar-confirma-que-gta-6-no-tendra-nunca-modo-rendimiento-en-ps5-pro-no-es-lo-suficientemente-potente/",
      },
      {
        outlet: "Vandal · plataformas",
        label: "La espera de quienes juegan en PC",
        url: "https://as.com/meristation/noticias/cuando-sale-gta-6-para-pc-todo-lo-que-se-sabe-de-su-lanzamiento-en-ordenadores-f202611-n/",
      },
    ],
  },
  {
    id: "exp-08",
    caseNumber: "EXP-08",
    group: "Historia",
    kicker: "Archivo 2014–2026",
    displayDate: "2014 – 2026",
    title: "La pelea empezó antes",
    summary:
      "Las preguntas sobre la violencia contra las mujeres y los blancos de la sátira ya acompañaban a la saga.",
    stampStatus: "ARCHIVO",
    wantedLevel: 4,
    media: {
      src: assetUrl("media/exp-08-history.webp"),
      alt: "Archivo histórico de polémicas de Grand Theft Auto",
    },
    whatHappened:
      "En 2014, una petición australiana cuestionó que en GTA V se pudiera agredir a una trabajadora sexual después de pagarle. Target y Kmart retiraron el título de sus tiendas. En 2022, la cobertura de los cambios internos de Rockstar y de una coprotagonista latina abrió otra discusión sobre el humor de la saga. En el estreno de GTA VI esas dos historias volvieron a cruzarse.",
    evidenceLimit:
      "La retirada australiana fue una decisión de dos comercios. En Reddit también hay desacuerdos dentro de los mismos espacios críticos. En el informe encontrás ejemplos de r/KotakuInAction y del foro hispanohablante r/VideojuegosMX para comparar tonos antes de atribuir una postura a toda una comunidad.",
    quote:
      "¿Qué diferencia hay entre criticar el blanco de un chiste y pedir que GTA abandone la sátira?",
    sources: [
      {
        outlet: "ABC Australia · 2014",
        label: "Por qué Target y Kmart retiraron GTA V de sus tiendas",
        url: "https://www.abc.net.au/news/2014-12-03/target-kmart-pull-grand-theft-auto-5-game-sexual-violence/5939184",
      },
      {
        outlet: "Game World Observer · 2022",
        label: "Cambios en Rockstar y el debate sobre a quién apunta la sátira",
        url: "https://gameworldobserver.com/2022/07/27/rockstar-workplace-issues-boys-club-gta-6-report",
      },
      {
        outlet: "Reddit · r/KotakuInAction",
        label: "Desacuerdos dentro de un mismo foro crítico",
        url: "https://www.reddit.com/r/KotakuInAction/comments/1xykck6/gta6s_success_will_create_an_illusion_that_going/",
      },
      {
        outlet: "Reddit · r/VideojuegosMX",
        label: "La pregunta sobre «woke» en una comunidad hispanohablante",
        url: "https://www.reddit.com/r/VideojuegosMX/comments/1y0tng6/es_gta_6_woke/",
      },
      {
        outlet: "CBC · protagonistas",
        label: "Cómo se escribe la intimidad entre Jason y Lucía",
        url: "https://www.cbc.ca/news/entertainment/grand-theft-auto-6-sex-workers-relationship-9.7428220",
      },
    ],
  },
  {
    id: "exp-09",
    caseNumber: "EXP-09",
    group: "Historia",
    kicker: "Clasificación y distribución",
    displayDate: "2005 – 2026",
    title: "Quién decide los límites",
    summary:
      "Escribir una pareja, clasificar por edades y decidir qué vender son tres decisiones con responsables distintos.",
    stampStatus: "REGULACIÓN",
    wantedLevel: 3,
    media: {
      src: assetUrl("media/exp-09-limits.webp"),
      alt: "Emblema VI vinculado a clasificación por edades y distribución global",
    },
    whatHappened:
      "En 2005, la ESRB cambió la clasificación de San Andreas al descubrir contenido sexual oculto en los discos. En 2025, la distribución de títulos para adultos en tiendas de PC abrió otra disputa por el papel de los procesadores de pagos. En GTA VI también hay diferencias entre ediciones regionales, documentadas en Japón.",
    evidenceLimit:
      "Estos precedentes explican quién interviene en la distribución. La razón que Rockstar sí dio para su decisión sobre el sexo pago en GTA VI fue narrativa. La ficha de la ESRB permite consultar directamente qué contenido adulto conserva el juego.",
    quote:
      "Si decimos en cámara «lo censuraron», ¿a quién estamos atribuyendo la decisión y qué documento la respalda?",
    sources: [
      {
        outlet: "ESRB · 2005",
        label: "Resolución sobre el contenido oculto de San Andreas",
        url: "https://www.esrb.org/blog/esrb-concludes-investigation-into-grand-theft-auto-san-andreas-revokes-m-mature-rating/",
      },
      {
        outlet: "The Guardian · 2025",
        label: "Procesadores de pago y catálogos de juegos adultos en PC",
        url: "https://www.theguardian.com/games/2025/jul/29/why-did-adult-titles-disappear-from-steam-itch-pc-gaming-payment-processors",
      },
      {
        outlet: "Vandal · edición japonesa",
        label: "Cambios de contenido entre ediciones regionales",
        url: "https://vandal.elespanol.com/noticia/2026323011/jason-se-ducha-en-tanga-en-la-version-japonesa-de-gta-6-pero-los-desnudos-no-son-el-unico-cambio/",
      },
      {
        outlet: "ESRB · clasificación",
        label: "Contenido sexual y sistema de afecto en GTA VI",
        url: "https://www.esrb.org/ratings/41627/grand-theft-auto-vi/",
      },
      {
        outlet: "Shacknews · Rockstar",
        label: "La explicación del estudio sobre el cambio",
        url: "https://www.shacknews.com/article/151386/prostitutes-gta6",
      },
    ],
  },
  {
    id: "exp-10",
    caseNumber: "EXP-10",
    group: "Recepción",
    kicker: "Ventas y descargas",
    displayDate: "19–21 NOV 2026",
    title: "El tamaño del estreno",
    summary:
      "Unidades, tráfico de internet y opiniones cuentan tres historias distintas sobre el mismo lanzamiento.",
    stampStatus: "CONFIRMADO",
    wantedLevel: 5,
    media: {
      src: assetUrl("media/exp-10-launch.webp"),
      alt: "Visualización del impacto comercial del estreno de GTA VI",
    },
    whatHappened:
      "Vandal recogió la estimación de Rockstar de 32,5 millones de unidades al contabilizar reservas digitales y físicas. Un operador estadounidense también observó un aumento de tráfico en consolas Xbox durante el lanzamiento. Las dos cifras hablan de la escala del evento, cada una desde un lugar distinto.",
    evidenceLimit:
      "Comprar, descargar y publicar una opinión son acciones distintas. Las ventas incluyen reservas anteriores a que el público pudiera jugar. Los datos de un operador describen su red. Ninguna de esas medidas nos dice qué sintió una persona al conocer a Mandy.",
    quote:
      "¿Qué podemos afirmar con una cifra de ventas y qué tendríamos que preguntarle directamente a quien jugó?",
    sources: [
      {
        outlet: "Vandal · comunicado de Rockstar",
        label: "La estimación inicial de ventas y reservas",
        url: "https://vandal.elespanol.com/noticia/2026324039/rockstar-anuncia-las-ventas-de-gta-6-es-el-mayor-estreno-de-la-historia-del-entretenimiento/",
      },
      {
        outlet: "Vandal · tráfico de red",
        label: "Qué observó un operador de internet durante el estreno",
        url: "https://vandal.elespanol.com/noticia/2026323020/gta-6-cuadruplica-el-trafico-de-internet-durante-su-lanzamiento-en-consolas-xbox/",
      },
      {
        outlet: "Vandal · DINAMIC",
        label: "Cómo se repartió la conversación del 17 al 19 de noviembre",
        url: "https://vandal.elespanol.com/noticia/2026324035/que-dicen-las-redes-sobre-gta-6-un-estudio-desvela-la-celebracion-y-las-criticas-del-evento-cultural/",
      },
    ],
  },
];
