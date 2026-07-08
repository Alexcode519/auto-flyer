// Colour templates for the flyer. Each swaps the 4 CSS custom properties
// (--gold, --red, --bg-dark, --bg-darker) that the whole pamphlet is built
// on, so a template change re-skins every element without touching layout.
const TEMPLATE_LIBRARY = [
  { name: "Classic Gold", gold: "#cbb27a", red: "#c81f2c", bgDark: "#1c1c1e", bgDarker: "#141416" },
  { name: "Midnight Blue", gold: "#7fa8d9", red: "#2e5fa3", bgDark: "#111722", bgDarker: "#0a0e16" },
  { name: "Racing Red", gold: "#e6a23c", red: "#d62828", bgDark: "#1a1414", bgDarker: "#120d0d" },
  { name: "Emerald", gold: "#8fd3a0", red: "#1f7a4d", bgDark: "#0f1a15", bgDarker: "#0a120e" },
  { name: "Silver Steel", gold: "#c9ccd1", red: "#4a5568", bgDark: "#1b1d21", bgDarker: "#131417" },
  { name: "Sunset Orange", gold: "#f2a65a", red: "#e0562b", bgDark: "#1d1712", bgDarker: "#14100c" },
  { name: "Royal Purple", gold: "#b79ce0", red: "#6a3fb5", bgDark: "#181321", bgDarker: "#110d18" },
  { name: "Ocean Teal", gold: "#7fd8cf", red: "#1f8a7d", bgDark: "#0f1a1a", bgDarker: "#0a1212" },
  { name: "Charcoal Mono", gold: "#d9d9d9", red: "#8a8a8a", bgDark: "#1a1a1a", bgDarker: "#101010" },
  { name: "Bronze Copper", gold: "#d99a5b", red: "#a85a2e", bgDark: "#1c1512", bgDarker: "#130d0b" }
];
