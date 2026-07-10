// Dealership branches. First entry is the real, confirmed branch; the rest
// are placeholders to be filled in with real details per-branch.
// fontRef is either a FONT_LIBRARY array index as a string ("0", "1", ...)
// or a saved custom font's id ("custom-<timestamp>") -- see fontData.js and
// the CUSTOM_FONTS list (persisted to localStorage) in app.js. backgroundIndex
// refers to BACKGROUND_LIBRARY (see backgroundData.js). Each branch remembers
// its own font, background, and logo (a data URL, or null to use the text
// logo), since different branches may want a different flyer style.
const BRANCH_DATA = [
  {
    name: "AVURA Executive Auto",
    address: "36 Kock Street, Rustenburg, 0299",
    phone: "014 592 0334",
    website: "www.avuramotors.co.za",
    fontRef: "0",
    backgroundIndex: 0,
    logo: null,
    logoScale: 1,
    logoSpacing: 0
  },
  {
    name: "AVURA Branch 2 (edit me)",
    address: "",
    phone: "",
    website: "",
    fontRef: "0",
    backgroundIndex: 0,
    logo: null,
    logoScale: 1,
    logoSpacing: 0
  },
  {
    name: "AVURA Branch 3 (edit me)",
    address: "",
    phone: "",
    website: "",
    fontRef: "0",
    backgroundIndex: 0,
    logo: null,
    logoScale: 1,
    logoSpacing: 0
  },
  {
    name: "AVURA Branch 4 (edit me)",
    address: "",
    phone: "",
    website: "",
    fontRef: "0",
    backgroundIndex: 0,
    logo: null,
    logoScale: 1,
    logoSpacing: 0
  },
  {
    name: "AVURA Branch 5 (edit me)",
    address: "",
    phone: "",
    website: "",
    fontRef: "0",
    backgroundIndex: 0,
    logo: null,
    logoScale: 1,
    logoSpacing: 0
  }
];
