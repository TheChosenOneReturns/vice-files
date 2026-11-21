export const MOTION = {
  // Easing de precisión editorial (rápido al salir, asentamiento sedoso)
  viceGlide: [0.22, 1, 0.36, 1] as const,
  // Apertura de papel doblado / cortinas de imagen
  paperUnfold: [0.16, 1, 0.3, 1] as const,
  // Salida limpia de modales y overlays
  crispExit: [0.4, 0, 1, 1] as const,

  // Resortes físicos (Motion)
  stampSlam: {
    type: "spring" as const,
    stiffness: 460,
    damping: 26,
    mass: 0.85,
  },
  sheetDrawer: {
    type: "spring" as const,
    stiffness: 360,
    damping: 34,
    mass: 0.9,
  },
  radioPill: {
    type: "spring" as const,
    stiffness: 380,
    damping: 28,
    mass: 0.88,
  },
  tactilePress: {
    type: "spring" as const,
    stiffness: 600,
    damping: 30,
  },
} as const;
