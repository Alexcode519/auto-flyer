// Selectable icons for the feature strip. Each value is the inner markup of a
// 0 0 48 48 viewBox SVG, using the flyer's gold line-icon style.
const ICON_LIBRARY = {
  engine: {
    label: "Engine",
    svg: '<path d="M6 30h6v-8h8v-4h4l4-4h8v4h4l4 4v8h2M14 22V14h10v4M22 30h6" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="14" cy="34" r="3" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="34" cy="34" r="3" stroke="var(--gold)" stroke-width="2" fill="none"/>'
  },
  "4x4": {
    label: "4x4 / Drivetrain",
    svg: '<circle cx="12" cy="14" r="4" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="36" cy="14" r="4" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="12" cy="34" r="4" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="36" cy="34" r="4" stroke="var(--gold)" stroke-width="2" fill="none"/><path d="M16 14h16M12 18v12M36 18v12M16 34h16" stroke="var(--gold)" stroke-width="2" fill="none"/>'
  },
  shield: {
    label: "Shield / Reliability",
    svg: '<path d="M24 6l16 6v10c0 10-7 17-16 20-9-3-16-10-16-20V12z" stroke="var(--gold)" stroke-width="2" fill="none"/><path d="M17 24l5 5 9-10" stroke="var(--gold)" stroke-width="2" fill="none"/>'
  },
  payload: {
    label: "Payload / Load bed",
    svg: '<rect x="4" y="16" width="24" height="12" stroke="var(--gold)" stroke-width="2" fill="none"/><path d="M28 20h8l6 6v2h-14z" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="12" cy="30" r="3" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="34" cy="30" r="3" stroke="var(--gold)" stroke-width="2" fill="none"/>'
  },
  fuel: {
    label: "Fuel",
    svg: '<rect x="10" y="14" width="18" height="26" rx="2" stroke="var(--gold)" stroke-width="2" fill="none"/><rect x="14" y="8" width="6" height="6" stroke="var(--gold)" stroke-width="2" fill="none"/><path d="M28 20h4a4 4 0 0 1 4 4v10a3 3 0 0 0 6 0V16" stroke="var(--gold)" stroke-width="2" fill="none"/>'
  },
  speedo: {
    label: "Performance",
    svg: '<path d="M8 32a16 16 0 1 1 32 0" stroke="var(--gold)" stroke-width="2" fill="none"/><path d="M24 32l8-10" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="24" cy="32" r="2" fill="var(--gold)"/>'
  },
  seats: {
    label: "Seating / Comfort",
    svg: '<path d="M14 10v18h14a4 4 0 0 1 4 4v6" stroke="var(--gold)" stroke-width="2" fill="none"/><path d="M14 28H10a4 4 0 0 0-4 4v6" stroke="var(--gold)" stroke-width="2" fill="none"/>'
  },
  safety: {
    label: "Safety",
    svg: '<circle cx="24" cy="24" r="16" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="24" cy="24" r="4" stroke="var(--gold)" stroke-width="2" fill="none"/><path d="M24 8v12M11 32l10-6M37 32l-10-6" stroke="var(--gold)" stroke-width="2" fill="none"/>'
  },
  warranty: {
    label: "Warranty",
    svg: '<circle cx="24" cy="24" r="16" stroke="var(--gold)" stroke-width="2" fill="none"/><path d="M24 14v10l7 4" stroke="var(--gold)" stroke-width="2" fill="none"/>'
  },
  navigation: {
    label: "Navigation",
    svg: '<path d="M24 6c-7 0-12 5-12 12 0 9 12 24 12 24s12-15 12-24c0-7-5-12-12-12z" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="24" cy="18" r="4" stroke="var(--gold)" stroke-width="2" fill="none"/>'
  },
  tech: {
    label: "Connectivity",
    svg: '<circle cx="14" cy="24" r="2" fill="var(--gold)"/><circle cx="24" cy="24" r="2" fill="var(--gold)"/><circle cx="34" cy="24" r="2" fill="var(--gold)"/><path d="M14 24a10 10 0 0 1 20 0M8 24a16 16 0 0 1 32 0" stroke="var(--gold)" stroke-width="2" fill="none"/>'
  },
  climate: {
    label: "Climate control",
    svg: '<path d="M24 8v32M12 14l24 20M36 14L12 34M8 24h32" stroke="var(--gold)" stroke-width="2" fill="none"/>'
  },
  tow: {
    label: "Towing",
    svg: '<path d="M18 10v10a6 6 0 0 0 12 0V10" stroke="var(--gold)" stroke-width="2" fill="none"/><rect x="14" y="30" width="20" height="8" rx="2" stroke="var(--gold)" stroke-width="2" fill="none"/>'
  },
  offroad: {
    label: "Off-road",
    svg: '<path d="M6 36l10-16 8 10 6-8 12 14z" stroke="var(--gold)" stroke-width="2" fill="none"/>'
  },
  eco: {
    label: "Fuel economy",
    svg: '<path d="M14 34C10 22 18 10 34 8c2 16-8 26-20 26z" stroke="var(--gold)" stroke-width="2" fill="none"/><path d="M14 34c4-10 10-16 18-20" stroke="var(--gold)" stroke-width="2" fill="none"/>'
  },
  gearbox: {
    label: "Gearbox",
    svg: '<circle cx="24" cy="24" r="6" stroke="var(--gold)" stroke-width="2" fill="none"/><path d="M24 12v4M24 32v4M12 24h4M32 24h4M16 16l3 3M32 32l-3-3M16 32l3-3M32 16l-3 3" stroke="var(--gold)" stroke-width="2" fill="none"/>'
  }
};
