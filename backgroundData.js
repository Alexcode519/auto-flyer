// Background treatments for the flyer's base surface (behind the hero text
// area and any other section that doesn't set its own opaque background).
// Each `css` value is a full CSS `background` shorthand applied to
// #pamphlet, built from the existing --gold/--bg-dark/--bg-darker vars so it
// always matches the flyer's fixed colour scheme.
const BACKGROUND_LIBRARY = [
  {
    name: "Solid",
    css: "var(--bg-dark)"
  },
  {
    name: "Deep Gradient",
    css: "linear-gradient(160deg, var(--bg-dark) 0%, #000000 100%)"
  },
  {
    name: "Gold Glow",
    css: "radial-gradient(circle at 50% -10%, rgba(203,178,122,0.18), transparent 55%), var(--bg-dark)"
  },
  {
    name: "Diagonal Weave",
    css: "repeating-linear-gradient(135deg, var(--bg-dark) 0px, var(--bg-dark) 18px, #202023 18px, #202023 36px)"
  },
  {
    name: "Dot Grid",
    css: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1.5px) 0 0/16px 16px, var(--bg-dark)"
  },
  {
    name: "Grid Lines",
    css: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px) 0 0/100% 24px, linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px) 0 0/24px 100%, var(--bg-dark)"
  }
];
