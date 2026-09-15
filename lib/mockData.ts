export interface CollaboratorBadge {
  id: string;
  name: string;
  role: string;
  plant: string;
  word: string;
  photoUrl?: string;
  badgeId: string;
  createdAt: string;
}

export const INITIAL_BADGES: CollaboratorBadge[] = [
  {
    id: "1",
    name: "Ing. Carlos Mendoza",
    role: "Director de Operaciones",
    plant: "Planta Toluca",
    word: "INNOVACIÓN",
    badgeId: "TRITECH-52-9841",
    createdAt: "2026-09-14",
  },
  {
    id: "2",
    name: "Mariana Ríos",
    role: "Líder de Calidad",
    plant: "Sede Corporativa CDMX",
    word: "EXCELENCIA",
    badgeId: "TRITECH-52-7312",
    createdAt: "2026-09-14",
  },
  {
    id: "3",
    name: "Alejandro Gómez",
    role: "Supervisora de Producción",
    plant: "Planta Querétaro",
    word: "TRANSFORMACIÓN",
    badgeId: "TRITECH-52-4029",
    createdAt: "2026-09-14",
  },
  {
    id: "4",
    name: "Sofía Torres",
    role: "Especialista I+D",
    plant: "Centro de Desarrollo Monterrey",
    word: "FUTURO",
    badgeId: "TRITECH-52-8815",
    createdAt: "2026-09-14",
  },
  {
    id: "5",
    name: "Roberto Silva",
    role: "Jefe de Automatización",
    plant: "Planta Silao",
    word: "COMPROMISO",
    badgeId: "TRITECH-52-6194",
    createdAt: "2026-09-14",
  },
  {
    id: "6",
    name: "Valeria Morales",
    role: "Coordinadora de Talento",
    plant: "Sede Corporativa CDMX",
    word: "FAMILIA",
    badgeId: "TRITECH-52-3320",
    createdAt: "2026-09-14",
  },
];
