export type SourceKind = "x" | "reddit" | "prensa";

export interface EditorialSource {
  id?: string;
  kind: SourceKind;
  outlet: string;
  label: string;
  url: string;
}

export const EDITORIAL_SOURCES: EditorialSource[] = [
  {
    id: "caso-captura",
    kind: "x",
    outlet: "X · copias indexadas",
    label: "Contexto de la publicación sobre Mandy",
    url: "https://www.teapaw.org/splashminion",
  },
  {
    kind: "x",
    outlet: "X · Complex",
    label: "Las imágenes de Mandy citadas en el post",
    url: "https://x.com/Complex/status/2123130037582921831",
  },
  {
    kind: "x",
    outlet: "X · ExoGhost",
    label: "Las flores para Lucia y la etiqueta «woke»",
    url: "https://x.com/ExoGhost/status/2123042449006182538",
  },
  {
    kind: "x",
    outlet: "X · Steven Crowder",
    label: "Acusación de censura selectiva",
    url: "https://x.com/scrowder/status/2123474615737741360",
  },
  {
    kind: "reddit",
    outlet: "Reddit · r/KotakuInAction",
    label: "Reacciones a la retirada del sexo pago",
    url: "https://www.reddit.com/r/KotakuInAction/comments/1xzj65n/confirmed_no_prostitutes_in_gta_6_to_emphasize/",
  },
  {
    kind: "reddit",
    outlet: "Reddit · r/GTA6unmoderated",
    label: "Qué libertad esperaba un jugador de GTA V",
    url: "https://www.reddit.com/r/GTA6unmoderated/comments/1xzsnx9/removing_prostitutes_from_the_game_makes_no_sense/",
  },
  {
    kind: "reddit",
    outlet: "Reddit · r/PornIsMisogyny",
    label: "Representación y sexualización de las mujeres",
    url: "https://www.reddit.com/r/PornIsMisogyny/comments/1y0rxop/gta_6_and_the_lack_of_respect_for_women_as_people/",
  },
  {
    kind: "prensa",
    outlet: "Shacknews · Rockstar",
    label: "La explicación del estudio sobre el cambio",
    url: "https://www.shacknews.com/article/151386/prostitutes-gta6",
  },
  {
    kind: "prensa",
    outlet: "ESRB · clasificación",
    label: "Contenido sexual y sistema de afecto en GTA VI",
    url: "https://www.esrb.org/ratings/41627/grand-theft-auto-vi/",
  },
  {
    kind: "prensa",
    outlet: "WIRED · cobertura",
    label: "Reacciones en X y el rumor sobre la discoteca",
    url: "https://www.wired.com/story/dudes-online-are-so-mad-that-gta-vi-makes-them-respect-women/",
  },
  {
    kind: "prensa",
    outlet: "Radio Times · reseña",
    label: "La idea de Vice City como segunda vida",
    url: "https://www.radiotimes.com/technology/gaming/gta-6-review",
  },
  {
    kind: "prensa",
    outlet: "The Verge · entrevista",
    label: "Cómo Rockstar equilibró detalle y ritmo",
    url: "https://www.theverge.com/entertainment/1035806/grand-theft-auto-6-rob-nelson-interview",
  },
  {
    kind: "reddit",
    outlet: "Reddit · Testimonio",
    label: "Leer su experiencia en Reddit",
    url: "https://www.reddit.com/r/GTA6unmoderated/comments/1y0tu4w/thoughts_after_15_hours_of_gameplay/",
  },
  {
    kind: "x",
    outlet: "X · Testimonio",
    label: "Leer su experiencia en X",
    url: "https://x.com/wstgoat7/status/2123454992975544558",
  },
  {
    kind: "prensa",
    outlet: "Vandal · DINAMIC",
    label: "Cómo se repartió la conversación del 17 al 19 de noviembre",
    url: "https://vandal.elespanol.com/noticia/2026324035/que-dicen-las-redes-sobre-gta-6-un-estudio-desvela-la-celebracion-y-las-criticas-del-evento-cultural/",
  },
  {
    kind: "prensa",
    outlet: "Notebookcheck · 20 nov.",
    label: "Las primeras 13.192 notas de usuarios",
    url: "https://www.notebookcheck.net/GTA-6-Metacritic-user-score-opens-at-5-2-10-prompting-review-bombing-accusations.1455598.0.html",
  },
  {
    kind: "prensa",
    outlet: "ComicBook · tiendas de consolas",
    label: "Las puntuaciones de PlayStation y Xbox durante el estreno",
    url: "https://comicbook.com/gaming/news/gta-6-grand-theft-auto-vi-user-review-score-metacritic/",
  },
  {
    kind: "reddit",
    outlet: "Reddit · r/LifeSimulators",
    label: "Qué espera de un peatón alguien que juega a simuladores",
    url: "https://www.reddit.com/r/LifeSimulators/comments/1y12rdx/is_gta_6_becoming_a_life_sim/",
  },
  {
    kind: "prensa",
    outlet: "VICE · reseña",
    label: "Diálogos y encuentros que dan vida a la calle",
    url: "https://www.vice.com/en/article/gta-6-review/",
  },
  {
    kind: "prensa",
    outlet: "Game World Observer · 2022",
    label: "Cambios en Rockstar y el debate sobre a quién apunta la sátira",
    url: "https://gameworldobserver.com/2022/07/27/rockstar-workplace-issues-boys-club-gta-6-report",
  },
  {
    kind: "reddit",
    outlet: "Reddit · r/KotakuInAction",
    label: "Desacuerdos dentro de un mismo foro crítico",
    url: "https://www.reddit.com/r/KotakuInAction/comments/1xykck6/gta6s_success_will_create_an_illusion_that_going/",
  },
  {
    kind: "reddit",
    outlet: "Reddit · r/VideojuegosMX",
    label: "La pregunta sobre «woke» en una comunidad hispanohablante",
    url: "https://www.reddit.com/r/VideojuegosMX/comments/1y0tng6/es_gta_6_woke/",
  },
  {
    kind: "prensa",
    outlet: "ABC Australia · 2014",
    label: "Por qué Target y Kmart retiraron GTA V de sus tiendas",
    url: "https://www.abc.net.au/news/2014-12-03/target-kmart-pull-grand-theft-auto-5-game-sexual-violence/5939184",
  },
  {
    kind: "prensa",
    outlet: "ESRB · 2005",
    label: "Resolución sobre el contenido oculto de San Andreas",
    url: "https://www.esrb.org/blog/esrb-concludes-investigation-into-grand-theft-auto-san-andreas-revokes-m-mature-rating/",
  },
  {
    kind: "prensa",
    outlet: "The Guardian · 2025",
    label: "Procesadores de pago y catálogos de juegos adultos en PC",
    url: "https://www.theguardian.com/games/2025/jul/29/why-did-adult-titles-disappear-from-steam-itch-pc-gaming-payment-processors",
  },
  {
    kind: "prensa",
    outlet: "Vandal · comunicado de Rockstar",
    label: "La estimación inicial de ventas y reservas",
    url: "https://vandal.elespanol.com/noticia/2026324039/rockstar-anuncia-las-ventas-de-gta-6-es-el-mayor-estreno-de-la-historia-del-entretenimiento/",
  },
  {
    kind: "prensa",
    outlet: "Vandal · rendimiento",
    label: "El límite de 30 fotogramas por segundo",
    url: "https://vandal.elespanol.com/noticia/2026323022/rockstar-confirma-que-gta-6-no-tendra-nunca-modo-rendimiento-en-ps5-pro-no-es-lo-suficientemente-potente/",
  },
  {
    kind: "prensa",
    outlet: "Vandal · plataformas",
    label: "La espera de quienes juegan en PC",
    url: "https://as.com/meristation/noticias/cuando-sale-gta-6-para-pc-todo-lo-que-se-sabe-de-su-lanzamiento-en-ordenadores-f202611-n/",
  },
  {
    kind: "prensa",
    outlet: "Vandal · edición japonesa",
    label: "Cambios de contenido entre ediciones regionales",
    url: "https://vandal.elespanol.com/noticia/2026323011/jason-se-ducha-en-tanga-en-la-version-japonesa-de-gta-6-pero-los-desnudos-no-son-el-unico-cambio/",
  },
  {
    kind: "prensa",
    outlet: "Vandal · tráfico de red",
    label: "Qué observó un operador de internet durante el estreno",
    url: "https://vandal.elespanol.com/noticia/2026323020/gta-6-cuadruplica-el-trafico-de-internet-durante-su-lanzamiento-en-consolas-xbox/",
  },
  {
    kind: "prensa",
    outlet: "CBC · protagonistas",
    label: "Cómo se escribe la intimidad entre Jason y Lucía",
    url: "https://www.cbc.ca/news/entertainment/grand-theft-auto-6-sex-workers-relationship-9.7428220",
  },
  {
    kind: "prensa",
    outlet: "Hindustan Times · desarrollo",
    label: "El trabajo de animación detrás de los peatones",
    url: "https://www.hindustantimes.com/sports/us-sports/gta-6-features-600-000-animations-as-rockstar-takes-npc-realism-to-another-level-report-grand-theft-auto-101793482770395.html",
  },
];
