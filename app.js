// ---------- Named colour palette for nearest-match detection ----------
const COLOR_PALETTE = [
  { name: "White", rgb: [245, 245, 245] },
  { name: "Black", rgb: [20, 20, 20] },
  { name: "Silver", rgb: [190, 190, 192] },
  { name: "Grey", rgb: [120, 120, 122] },
  { name: "Beige", rgb: [222, 202, 158] },
  { name: "Red", rgb: [178, 34, 34] },
  { name: "Blue", rgb: [40, 70, 140] },
  { name: "Green", rgb: [45, 90, 60] },
  { name: "Brown", rgb: [92, 64, 42] },
  { name: "Gold", rgb: [190, 160, 80] },
  { name: "Orange", rgb: [205, 105, 30] },
  { name: "Yellow", rgb: [210, 180, 40] }
];

function nearestColorName(r, g, b) {
  let best = null, bestDist = Infinity;
  for (const c of COLOR_PALETTE) {
    const d = (r - c.rgb[0]) ** 2 + (g - c.rgb[1]) ** 2 + (b - c.rgb[2]) ** 2;
    if (d < bestDist) { bestDist = d; best = c.name; }
  }
  return best;
}

// Classifies every sampled pixel to its nearest palette bucket and returns the
// mode bucket, rather than averaging RGB first. A plain average gets dragged
// toward whatever fills the most background area (sky, gravel, rock); voting
// per-pixel is robust to that since the vehicle body still wins the vote as
// long as it's a sizeable chunk of the frame, wherever it's positioned.
// Always best-effort -- the colour dropdown stays user-overridable.
function detectColorFromImage(imgEl, callback) {
  const canvas = document.createElement("canvas");
  const w = (canvas.width = 120);
  const h = (canvas.height = 120);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(imgEl, 0, 0, w, h);
  let data;
  try {
    data = ctx.getImageData(0, 0, w, h).data;
  } catch (e) {
    return; // CORS-tainted canvas, skip silently
  }
  const votes = {};
  // skip the top 15% (usually sky/ceiling) and bottom 10% (usually ground/shadow)
  const y0 = h * 0.15, y1 = h * 0.9;
  for (let y = y0; y < y1; y++) {
    for (let x = 0; x < w; x++) {
      const i = (Math.floor(y) * w + Math.floor(x)) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      const lightness = (max + min) / 2;
      if (lightness < 15 || lightness > 250) continue; // skip pure shadow/blown highlight
      if (b - r > 15 && b - g > 8) continue; // skip sky's characteristic blue cast
      const name = nearestColorName(r, g, b);
      votes[name] = (votes[name] || 0) + 1;
    }
  }
  const names = Object.keys(votes);
  if (!names.length) return;
  const winner = names.reduce((a, b) => (votes[a] >= votes[b] ? a : b));
  callback(winner);
}

// ---------- Element refs ----------
const $ = (id) => document.getElementById(id);

// ---------- Branch selector ----------
const branchSelect = $("branch-select");
let currentBranchIndex = 0;
const RENAME_OPTION = "__rename__";

BRANCH_DATA.forEach((branch, i) => {
  const opt = document.createElement("option");
  opt.value = i;
  opt.textContent = branch.name;
  branchSelect.appendChild(opt);
});
const renameSeparator = document.createElement("option");
renameSeparator.disabled = true;
renameSeparator.textContent = "──────────";
branchSelect.appendChild(renameSeparator);
const renameOption = document.createElement("option");
renameOption.value = RENAME_OPTION;
renameOption.textContent = "✎ Rename current branch…";
branchSelect.appendChild(renameOption);

function applyBranch(index) {
  const branch = BRANCH_DATA[index];
  if (!branch) return;
  $("dealer-name-input").value = branch.name;
  $("dealer-address-input").value = branch.address;
  $("dealer-phone-input").value = branch.phone;
  $("dealer-web-input").value = branch.website;
  applyBranchFont(index);
  applyBranchBackground(index);
  applyBranchLogo(index);
}

// Custom fonts a user has saved to the list, persisted across reloads.
// Each entry is { id, label, dataUrl, family } -- family is a unique
// CSS font-family name per saved font (several can coexist in the list).
const CUSTOM_FONTS_KEY = "autoflyer-custom-fonts";
let CUSTOM_FONTS = [];
try {
  CUSTOM_FONTS = JSON.parse(localStorage.getItem(CUSTOM_FONTS_KEY) || "[]");
} catch (e) {
  CUSTOM_FONTS = [];
}
function saveCustomFontsToStorage() {
  try {
    localStorage.setItem(CUSTOM_FONTS_KEY, JSON.stringify(CUSTOM_FONTS));
  } catch (e) {
    alert("Couldn't save this font permanently (storage full), but it'll keep working for this session.");
  }
}
const loadedCustomFontFamilies = new Set(); // avoid re-registering the same font with the FontFace API repeatedly
function ensureCustomFontLoaded(entry) {
  if (loadedCustomFontFamilies.has(entry.family)) return Promise.resolve();
  const face = new FontFace(entry.family, `url(${entry.dataUrl})`);
  return face.load().then((loaded) => {
    document.fonts.add(loaded);
    loadedCustomFontFamilies.add(entry.family);
  });
}

// Each branch remembers its own font choice; switching branches swaps the
// flyer's font to match instead of leaving whatever was last picked.
// fontRef is either a FONT_LIBRARY index (as a string) or a saved custom
// font's id -- see the fontRef comment in branchData.js.
function applyBranchFont(index) {
  discardPendingFontPreview();
  const branch = BRANCH_DATA[index];
  const fontRef = (branch && branch.fontRef) || "0";
  const custom = CUSTOM_FONTS.find((f) => f.id === fontRef);

  if (custom) {
    ensureCustomFontLoaded(custom).then(() => {
      $("pamphlet").style.fontFamily = `"${custom.family}", Arial, sans-serif`;
    });
  } else {
    const fontIndex = Number(fontRef) || 0;
    $("pamphlet").style.fontFamily = FONT_LIBRARY[fontIndex].stack;
  }
  $("font-select").value = fontRef;
}

// Same per-branch pattern as font: background is set directly on #pamphlet
// (built from the fixed --gold/--bg-dark/--bg-darker vars), so it re-skins
// only the flyer's surface, not the app's own chrome.
function applyBranchBackground(index) {
  const branch = BRANCH_DATA[index];
  const backgroundIndex = (branch && branch.backgroundIndex) || 0;
  $("pamphlet").style.background = BACKGROUND_LIBRARY[backgroundIndex].css;
  document.querySelectorAll(".background-swatch").forEach((el, i) => {
    el.classList.toggle("active", i === backgroundIndex);
  });
}

// Same per-branch pattern again: a branch with a logo image shows it (top
// header + footer) instead of the generated text logo; a branch with no
// logo falls back to the text lockup driven by its dealer name.
const LOGO_BASE_HEIGHT = 70; // px, matches .p-logo-img's base max-height

function applyBranchLogo(index) {
  const branch = BRANCH_DATA[index];
  const logo = branch && branch.logo;
  const scale = (branch && branch.logoScale) || 1;
  const spacing = (branch && branch.logoSpacing) || 0;
  const headerImg = $("p-logo-img");
  const footerImg = $("p-footer-logo-img");
  const previewImg = $("logo-preview-img");
  const previewEmpty = document.querySelector(".logo-preview-empty");
  const logoWrap = document.querySelector(".p-logo");
  const adjustRow = $("logo-adjust-row");

  if (logo) {
    headerImg.src = logo;
    headerImg.hidden = false;
    // Must be an explicit height, not max-height: max-* properties only ever
    // shrink an image down to fit, they never force it to grow past its
    // natural pixel size -- which is exactly why the slider looked broken
    // for a logo whose natural size was already below the "scaled" target.
    headerImg.style.height = `${LOGO_BASE_HEIGHT * scale}px`;
    // max-width must scale with the slider too, not stay fixed -- otherwise
    // a wide/horizontal logo hits the width cap almost immediately and the
    // slider looks like it does nothing past that point.
    headerImg.style.maxWidth = `${Math.min(96, 70 * scale)}%`;
    logoWrap.style.padding = `${spacing}px 0`;
    $("p-dealer-name-main").hidden = true;
    $("p-dealer-name-sub").hidden = true;
    footerImg.src = logo;
    footerImg.hidden = false;
    $("p-footer-dealer").hidden = true;
    previewImg.src = logo;
    previewImg.hidden = false;
    previewEmpty.hidden = true;
    adjustRow.hidden = false;
    $("logo-size-slider").value = scale;
    $("logo-spacing-slider").value = spacing;
  } else {
    headerImg.hidden = true;
    logoWrap.style.padding = "";
    $("p-dealer-name-main").hidden = false;
    $("p-dealer-name-sub").hidden = false;
    footerImg.hidden = true;
    $("p-footer-dealer").hidden = false;
    previewImg.hidden = true;
    previewEmpty.hidden = false;
    adjustRow.hidden = true;
  }
}

// The "Rename current branch" entry is folded into the dropdown itself
// (rather than a separate field) to save space; picking it prompts for a
// new name, updates that branch's label and dealer-name default in place,
// then restores the dropdown to the branch that was just renamed.
branchSelect.addEventListener("change", () => {
  if (branchSelect.value === RENAME_OPTION) {
    const newName = prompt("Rename this branch:", BRANCH_DATA[currentBranchIndex].name);
    branchSelect.value = String(currentBranchIndex);
    if (newName && newName.trim()) {
      BRANCH_DATA[currentBranchIndex].name = newName.trim();
      branchSelect.options[currentBranchIndex].textContent = newName.trim();
      $("dealer-name-input").value = newName.trim();
      syncPreview();
    }
    return;
  }
  currentBranchIndex = Number(branchSelect.value);
  applyBranch(currentBranchIndex);
  syncPreview();
});

const state = {
  brand: "", model: "", variant: "",
  images: {}
};

// ---------- Brand autocomplete ----------
const brandInput = $("brand-input");
const brandSuggestions = $("brand-suggestions");
const modelSelect = $("model-select");
const modelCustom = $("model-custom");
const variantSelect = $("variant-select");
const variantCustom = $("variant-custom");

const brandNames = Object.keys(VEHICLE_DATA);

brandInput.addEventListener("input", () => {
  const q = brandInput.value.trim().toLowerCase();
  state.brand = brandInput.value.trim();
  resetSelect(modelSelect, "Select a brand first", true);
  resetSelect(variantSelect, "Select a model first", true);
  modelCustom.hidden = true;
  variantCustom.hidden = true;

  if (!q) { brandSuggestions.hidden = true; syncPreview(); return; }
  const matches = brandNames.filter((b) => b.toLowerCase().includes(q));
  if (!matches.length) { brandSuggestions.hidden = true; syncPreview(); return; }
  brandSuggestions.innerHTML = "";
  matches.forEach((b) => {
    const div = document.createElement("div");
    div.textContent = b;
    div.addEventListener("click", () => {
      brandInput.value = b;
      state.brand = b;
      brandSuggestions.hidden = true;
      populateModels(b);
      syncPreview();
    });
    brandSuggestions.appendChild(div);
  });
  brandSuggestions.hidden = false;
  syncPreview();
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".autocomplete")) brandSuggestions.hidden = true;
});

function resetSelect(select, placeholder, disabled) {
  select.innerHTML = `<option value="">${placeholder}</option>`;
  select.disabled = disabled;
}

function populateModels(brand) {
  const models = VEHICLE_DATA[brand];
  resetSelect(modelSelect, "Select model", false);
  if (models) {
    Object.keys(models).forEach((m) => {
      const opt = document.createElement("option");
      opt.value = m; opt.textContent = m;
      modelSelect.appendChild(opt);
    });
  }
  const otherOpt = document.createElement("option");
  otherOpt.value = "__other__"; otherOpt.textContent = "Other (type manually)";
  modelSelect.appendChild(otherOpt);
}

modelSelect.addEventListener("change", () => {
  modelCustom.hidden = modelSelect.value !== "__other__";
  if (modelSelect.value === "__other__") {
    state.model = "";
    modelCustom.value = "";
    modelCustom.focus();
    resetSelect(variantSelect, "Select a model first", true);
  } else {
    state.model = modelSelect.value;
    populateVariants(state.brand, state.model);
  }
  syncPreview();
});

modelCustom.addEventListener("input", () => {
  state.model = modelCustom.value.trim();
  syncPreview();
});

function populateVariants(brand, model) {
  const variants = (VEHICLE_DATA[brand] && VEHICLE_DATA[brand][model]) || [];
  resetSelect(variantSelect, "Select variant", false);
  variants.forEach((v) => {
    const opt = document.createElement("option");
    opt.value = v; opt.textContent = v;
    variantSelect.appendChild(opt);
  });
  const otherOpt = document.createElement("option");
  otherOpt.value = "__other__"; otherOpt.textContent = "Other (type manually)";
  variantSelect.appendChild(otherOpt);
}

variantSelect.addEventListener("change", () => {
  variantCustom.hidden = variantSelect.value !== "__other__";
  if (variantSelect.value === "__other__") {
    state.variant = "";
    variantCustom.value = "";
    variantCustom.focus();
  } else {
    state.variant = variantSelect.value;
  }
  syncPreview();
});

variantCustom.addEventListener("input", () => {
  state.variant = variantCustom.value.trim();
  syncPreview();
});

// ---------- Photo uploads ----------
const SLOT_TO_PREVIEW = {
  hero: { img: "p-hero-img", empty: "p-hero-empty" },
  g1: { img: "p-g1-img", empty: "p-g1-empty" },
  g2: { img: "p-g2-img", empty: "p-g2-empty" },
  g3: { img: "p-g3-img", empty: "p-g3-empty" },
  g4: { img: "p-g4-img", empty: "p-g4-empty" }
};

// ---------- Image repositioning + zoom (crop editor modal) ----------
const IMAGE_STEP = 8; // percent nudged per click
const GALLERY_ASPECT = "1 / 1"; // fallback only, if the real box can't be measured yet
const imagePosition = {
  hero: { x: 50, y: 50, scale: 1 }, g1: { x: 50, y: 50, scale: 1 }, g2: { x: 50, y: 50, scale: 1 },
  g3: { x: 50, y: 50, scale: 1 }, g4: { x: 50, y: 50, scale: 1 }
};
const naturalSize = {}; // slot -> { w, h } of the uploaded photo's real pixel dimensions
let cropModalSlot = null;

// Sets background-size in real pixels (cover-fit size * zoom), so
// background-position's 0-100% range is always recomputed against the
// *current* zoomed size -- unlike object-position combined with a separate
// transform:scale, which freezes the pannable range at the pre-zoom size and
// silently caps travel in whichever axis had no slack at zoom 1.
function fitBackground(el, natural, pos) {
  const rect = el.getBoundingClientRect();
  if (!rect.width || !rect.height || !natural) return;
  const coverScale = Math.max(rect.width / natural.w, rect.height / natural.h);
  const finalScale = coverScale * pos.scale;
  el.style.backgroundSize = `${natural.w * finalScale}px ${natural.h * finalScale}px`;
  el.style.backgroundPosition = `${pos.x}% ${pos.y}%`;
}

// Only the flyer image and the modal's own preview reflect crop adjustments;
// the small sidebar thumbnail under "2. Photos" intentionally stays as the
// plain uploaded photo so it remains a stable reference thumbnail.
function applyImagePosition(slot) {
  const pos = imagePosition[slot];
  const natural = naturalSize[slot];
  const pImg = $(SLOT_TO_PREVIEW[slot].img);
  if (pImg && !pImg.hidden) fitBackground(pImg, natural, pos);
  if (cropModalSlot === slot) fitBackground(cropModalImg, natural, pos);
}

function nudge(slot, dir) {
  const pos = imagePosition[slot];
  // Arrows nudge the photo itself (drag-the-image metaphor), not the crop
  // viewport -- clicking up moves the image up, revealing more of what's
  // below it, same convention as Facebook/LinkedIn cover photo repositioning.
  if (dir === "up") pos.y = Math.min(100, pos.y + IMAGE_STEP);
  if (dir === "down") pos.y = Math.max(0, pos.y - IMAGE_STEP);
  if (dir === "left") pos.x = Math.min(100, pos.x + IMAGE_STEP);
  if (dir === "right") pos.x = Math.max(0, pos.x - IMAGE_STEP);
  applyImagePosition(slot);
}

// ---------- Crop modal ----------
const cropModal = $("crop-modal");
const cropModalImg = $("crop-modal-img");
const cropModalFrame = $("crop-modal-frame");
const cropZoomSlider = $("crop-zoom-slider");

function openCropModal(slot) {
  cropModalSlot = slot;
  cropModalImg.style.backgroundImage = `url("${state.images[slot] || ""}")`;
  // Aspect ratio is read from the actual photo box being cropped, not a
  // fixed constant -- different layouts render the hero/gallery boxes at
  // different proportions, so the crop preview must match whichever one
  // is actually being edited or the crop won't line up with the real flyer.
  const pImg = $(SLOT_TO_PREVIEW[slot].img);
  const rect = pImg.getBoundingClientRect();
  cropModalFrame.style.aspectRatio = rect.width && rect.height ? `${rect.width} / ${rect.height}` : GALLERY_ASPECT;
  cropZoomSlider.value = imagePosition[slot].scale;
  // Must unhide before measuring -- getBoundingClientRect on a display:none
  // element (still hidden at this point) would return a 0x0 rect.
  cropModal.hidden = false;
  applyImagePosition(slot);
}

function closeCropModal() {
  cropModal.hidden = true;
  cropModalSlot = null;
}

// Delegated on #pamphlet (a node that's never itself replaced, only its
// innerHTML) rather than attached to each .crop-btn directly -- layout
// swaps destroy and recreate every .crop-btn, which would silently drop
// direct listeners. Delegation survives any number of innerHTML swaps.
$("pamphlet").addEventListener("click", (e) => {
  const btn = e.target.closest(".crop-btn");
  if (btn) openCropModal(btn.dataset.target);
});

$("crop-done-btn").addEventListener("click", closeCropModal);
cropModal.addEventListener("click", (e) => {
  if (e.target === cropModal) closeCropModal();
});

$("crop-reset-btn").addEventListener("click", () => {
  if (!cropModalSlot) return;
  imagePosition[cropModalSlot] = { x: 50, y: 50, scale: 1 };
  cropZoomSlider.value = 1;
  applyImagePosition(cropModalSlot);
});

document.querySelectorAll(".crop-pad button").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (cropModalSlot) nudge(cropModalSlot, btn.dataset.dir);
  });
});

function setZoom(value) {
  if (!cropModalSlot) return;
  imagePosition[cropModalSlot].scale = Math.min(3, Math.max(1, value));
  cropZoomSlider.value = imagePosition[cropModalSlot].scale;
  applyImagePosition(cropModalSlot);
}

cropZoomSlider.addEventListener("input", () => setZoom(Number(cropZoomSlider.value)));
$("crop-zoom-in").addEventListener("click", () => setZoom(Number(cropZoomSlider.value) + 0.2));
$("crop-zoom-out").addEventListener("click", () => setZoom(Number(cropZoomSlider.value) - 0.2));

Object.keys(SLOT_TO_PREVIEW).forEach((slot) => {
  const input = $(`upload-${slot}`);
  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      state.images[slot] = dataUrl;

      // update form thumbnail
      const slotEl = input.closest(".photo-slot");
      const placeholder = slotEl.querySelector(".slot-placeholder");
      const preview = slotEl.querySelector(".slot-preview");
      preview.src = dataUrl;
      preview.hidden = false;
      placeholder.hidden = true;

      // update pamphlet preview
      const target = SLOT_TO_PREVIEW[slot];
      const pImg = $(target.img);
      pImg.style.backgroundImage = `url("${dataUrl}")`;
      pImg.hidden = false;
      if (target.empty) $(target.empty).hidden = true;

      // reset this slot's crop state, then measure the real photo dimensions
      // (needed to compute cover-fit + zoom sizing) before positioning it
      imagePosition[slot] = { x: 50, y: 50, scale: 1 };
      const tmpImg = new Image();
      tmpImg.onload = () => {
        naturalSize[slot] = { w: tmpImg.naturalWidth, h: tmpImg.naturalHeight };
        applyImagePosition(slot);
        if (slot === "hero") {
          detectColorFromImage(tmpImg, (colorName) => {
            $("color-select").value = colorName;
            syncPreview();
          });
        }
      };
      tmpImg.src = dataUrl;

      const cropBtn = document.querySelector(`.crop-btn[data-target="${slot}"]`);
      if (cropBtn) cropBtn.hidden = false;
    };
    reader.readAsDataURL(file);
  });
});

// ---------- Number / text formatting ----------
function formatThousands(n) {
  return Number(n || 0).toLocaleString("en-ZA");
}

// ---------- Live preview sync ----------
function syncPreview() {
  const brand = state.brand || "TOYOTA";
  const model = state.model || "LAND CRUISER";
  const variant = state.variant || "";

  $("p-badge-brand").textContent = brand.toUpperCase();
  $("p-badge-model").textContent = model.toUpperCase();
  $("p-badge-variant").textContent = variant ? variant.split(" ").slice(0, 2).join(" ").toUpperCase() : "";

  $("p-details-brand").textContent = `${brand} ${model}`.toUpperCase();
  $("p-details-variant").textContent = variant;

  $("p-year").textContent = $("year-input").value || "—";

  const km = $("km-input").value;
  $("p-km").textContent = km ? `${formatThousands(km)} Km` : "—";

  const color = $("color-select").value;
  $("p-color").textContent = color;
  const swatchColor = COLOR_PALETTE.find((c) => c.name === color);
  if (swatchColor) $("p-color-swatch").style.background = `rgb(${swatchColor.rgb.join(",")})`;

  const price = $("price-input").value;
  $("p-price").textContent = price ? `R${formatThousands(price)}` : "R—";

  $("p-tagline1").textContent = $("tagline1-input").value;
  $("p-tagline2").textContent = $("tagline2-input").value;
  $("p-description").textContent = $("description-input").value;

  document.querySelectorAll("[data-check]").forEach((input) => {
    $(`p-check-${input.dataset.check}`).textContent = input.value;
  });

  document.querySelectorAll("[data-feature-title]").forEach((input) => {
    $(`p-feature-${input.dataset.featureTitle}-title`).textContent = input.value;
  });
  document.querySelectorAll("[data-feature-sub]").forEach((input) => {
    $(`p-feature-${input.dataset.featureSub}-sub`).textContent = input.value;
  });

  $("p-dealer-name-main").textContent = ($("dealer-name-input").value.split(" ")[0] || "AVURA").toUpperCase();
  $("p-dealer-name-sub").textContent = $("dealer-name-input").value.split(" ").slice(1).join(" ") || "Executive Auto";
  $("p-footer-dealer").textContent = $("p-dealer-name-main").textContent;
  $("p-dealer-address").textContent = $("dealer-address-input").value;
  $("p-dealer-phone").textContent = $("dealer-phone-input").value;
  $("p-dealer-web").textContent = $("dealer-web-input").value;
}

[
  "year-input", "km-input", "price-input", "color-select",
  "tagline1-input", "tagline2-input", "description-input",
  "dealer-name-input", "dealer-address-input", "dealer-phone-input", "dealer-web-input"
].forEach((id) => $(id).addEventListener("input", syncPreview));

document.querySelectorAll("[data-check]").forEach((input) => {
  input.addEventListener("input", syncPreview);
});

document.querySelectorAll("[data-feature-title], [data-feature-sub]").forEach((input) => {
  input.addEventListener("input", syncPreview);
});

// ---------- Feature icon picker ----------
const DEFAULT_FEATURE_ICONS = ["engine", "4x4", "shield", "payload"];
document.querySelectorAll(".icon-select").forEach((select) => {
  const idx = select.dataset.featureIcon;
  Object.keys(ICON_LIBRARY).forEach((key) => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = ICON_LIBRARY[key].label;
    select.appendChild(opt);
  });
  select.value = DEFAULT_FEATURE_ICONS[idx];
  select.addEventListener("change", () => {
    $(`p-feature-${idx}-icon`).innerHTML = ICON_LIBRARY[select.value].svg;
  });
});

// ---------- Export to PNG ----------
$("export-btn").addEventListener("click", () => {
  const node = $("pamphlet");
  // document.fonts.ready matters most right after uploading a custom font --
  // Google Fonts are already loaded well before anyone reaches Export.
  document.fonts.ready.then(() => html2canvas(node, {
    scale: 2,
    backgroundColor: "#1c1c1e",
    useCORS: true,
    ignoreElements: (el) => el.classList.contains("crop-btn")
  })).then((canvas) => {
    const link = document.createElement("a");
    const brand = (state.brand || "vehicle").replace(/\s+/g, "-");
    const model = (state.model || "pamphlet").replace(/\s+/g, "-");
    link.download = `${brand}-${model}-pamphlet.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});

// ---------- Font picker ----------
// Applying font-family to the .pamphlet root cascades to every text element
// inside it, so the main Font dropdown sets a flyer-wide baseline. Individual
// .line-font-select dropdowns (one per Copy field) can override that
// baseline for just their own element via a direct inline style, which wins
// on specificity. Every font-picking <select> on the page (the main one plus
// all per-line ones) shares the same FONT_LIBRARY + CUSTOM_FONTS option list,
// tracked in fontSelectOptgroups so a newly saved custom font shows up in
// all of them at once, not just wherever it was uploaded from.
const fontSelect = $("font-select");
const fontSelectOptgroups = [];

function populateFontSelect(select, includeDefaultOption) {
  if (includeDefaultOption) {
    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.textContent = "Default";
    select.appendChild(defaultOpt);
  }
  FONT_LIBRARY.forEach((font, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = font.label;
    select.appendChild(opt);
  });
  const optgroup = document.createElement("optgroup");
  optgroup.label = "My Fonts";
  CUSTOM_FONTS.forEach((entry) => addCustomFontOption(optgroup, entry));
  select.appendChild(optgroup);
  fontSelectOptgroups.push(optgroup);
}

function addCustomFontOption(optgroup, entry) {
  const opt = document.createElement("option");
  opt.value = entry.id;
  opt.textContent = entry.label;
  optgroup.appendChild(opt);
}

populateFontSelect(fontSelect, false);
document.querySelectorAll(".line-font-select").forEach((select) => populateFontSelect(select, true));

fontSelect.addEventListener("change", () => {
  discardPendingFontPreview();
  BRANCH_DATA[currentBranchIndex].fontRef = fontSelect.value;
  applyBranchFont(currentBranchIndex);
});

// Uploading only previews a font live (never touches BRANCH_DATA or
// localStorage) until "Save to list" is clicked -- that's the point where it
// becomes a real, reusable, persisted option in the dropdown.
let pendingCustomFont = null; // { name, dataUrl }

function discardPendingFontPreview() {
  pendingCustomFont = null;
  $("font-save-row").hidden = true;
  $("font-preview-hint").hidden = true;
  $("upload-font").value = "";
}

$("upload-font").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const name = file.name.replace(/\.[^.]+$/, "");
    pendingCustomFont = { name, dataUrl: ev.target.result };
    $("font-name-input").value = name;
    $("font-save-row").hidden = false;
    $("font-preview-hint").hidden = false;
    $("font-preview-name").textContent = name;

    const previewFace = new FontFace("AutoFlyerFontPreview", `url(${pendingCustomFont.dataUrl})`);
    previewFace.load().then((loaded) => {
      document.fonts.add(loaded);
      $("pamphlet").style.fontFamily = `"AutoFlyerFontPreview", Arial, sans-serif`;
    });
  };
  reader.readAsDataURL(file);
});

$("font-save-btn").addEventListener("click", () => {
  if (!pendingCustomFont) return;
  const label = $("font-name-input").value.trim() || pendingCustomFont.name;
  const id = `custom-${Date.now()}`;
  const entry = { id, label, dataUrl: pendingCustomFont.dataUrl, family: `AutoFlyerFont-${id}` };

  CUSTOM_FONTS.push(entry);
  saveCustomFontsToStorage();
  fontSelectOptgroups.forEach((optgroup) => addCustomFontOption(optgroup, entry));

  pendingCustomFont = null;
  $("font-save-row").hidden = true;
  $("font-preview-hint").hidden = true;
  $("upload-font").value = "";

  BRANCH_DATA[currentBranchIndex].fontRef = id;
  applyBranchFont(currentBranchIndex);
});

// ---------- Per-line font overrides ----------
// Maps each .line-font-select's data-line value to the pamphlet element it
// should style. Unlike the main Font dropdown (per-branch, in BRANCH_DATA),
// these live alongside the copy text itself in the sidebar inputs -- neither
// is persisted, both are just re-read from the DOM on every sync, same as
// the text content they sit next to.
const LINE_FONT_TARGETS = {
  tagline1: "p-tagline1",
  tagline2: "p-tagline2",
  description: "p-description",
  "feature-0-title": "p-feature-0-title", "feature-0-sub": "p-feature-0-sub",
  "feature-1-title": "p-feature-1-title", "feature-1-sub": "p-feature-1-sub",
  "feature-2-title": "p-feature-2-title", "feature-2-sub": "p-feature-2-sub",
  "feature-3-title": "p-feature-3-title", "feature-3-sub": "p-feature-3-sub",
  "check-0": "p-check-0", "check-1": "p-check-1", "check-2": "p-check-2", "check-3": "p-check-3"
};

function applyLineFont(lineId) {
  const select = document.querySelector(`.line-font-select[data-line="${lineId}"]`);
  const targetEl = $(LINE_FONT_TARGETS[lineId]);
  if (!select || !targetEl) return;

  const ref = select.value;
  if (!ref) {
    targetEl.style.fontFamily = ""; // inherit the flyer-wide font
    return;
  }
  const custom = CUSTOM_FONTS.find((f) => f.id === ref);
  if (custom) {
    ensureCustomFontLoaded(custom).then(() => {
      targetEl.style.fontFamily = `"${custom.family}", Arial, sans-serif`;
    });
  } else {
    targetEl.style.fontFamily = FONT_LIBRARY[Number(ref) || 0].stack;
  }
}

function applyAllLineFonts() {
  Object.keys(LINE_FONT_TARGETS).forEach(applyLineFont);
}

document.querySelectorAll(".line-font-select").forEach((select) => {
  select.addEventListener("change", () => applyLineFont(select.dataset.line));
});

// ---------- Layout picker ----------
// Layout is a global choice (not per-branch like font/colour/logo) -- it's
// "which flyer structure am I building" rather than a per-dealership trait.
let currentLayoutIndex = 0;

function applyLayout(index) {
  currentLayoutIndex = index;
  $("pamphlet").innerHTML = LAYOUT_LIBRARY[index].html;
  $("pamphlet").className = `pamphlet layout-${LAYOUT_LIBRARY[index].id}`;
  rehydratePamphlet();
  document.querySelectorAll(".layout-swatch").forEach((el, i) => {
    el.classList.toggle("active", i === index);
  });
}

// Re-applies every piece of live state onto a freshly swapped-in layout's
// markup, since #pamphlet.innerHTML replacement destroys and recreates every
// element inside it (branch-driven font/colour/logo, feature icons, all text
// fields, and each photo's upload + crop position).
function rehydratePamphlet() {
  applyBranchFont(currentBranchIndex);
  applyBranchBackground(currentBranchIndex);
  applyBranchLogo(currentBranchIndex);

  document.querySelectorAll(".icon-select").forEach((select) => {
    const idx = select.dataset.featureIcon;
    const iconEl = $(`p-feature-${idx}-icon`);
    if (iconEl) iconEl.innerHTML = ICON_LIBRARY[select.value].svg;
  });

  syncPreview();
  applyAllLineFonts();

  Object.keys(SLOT_TO_PREVIEW).forEach((slot) => {
    const target = SLOT_TO_PREVIEW[slot];
    const pImg = $(target.img);
    if (!state.images[slot]) return; // stays at the fresh markup's default empty state
    pImg.style.backgroundImage = `url("${state.images[slot]}")`;
    pImg.hidden = false;
    if (target.empty) $(target.empty).hidden = true;
    applyImagePosition(slot);
    const cropBtn = document.querySelector(`.crop-btn[data-target="${slot}"]`);
    if (cropBtn) cropBtn.hidden = false;
  });
}

const layoutGrid = $("layout-grid");
LAYOUT_LIBRARY.forEach((layout, i) => {
  const swatch = document.createElement("button");
  swatch.type = "button";
  swatch.className = "layout-swatch";
  swatch.innerHTML = `<svg viewBox="0 0 48 48">${layout.preview}</svg><span>${layout.name}</span>`;
  swatch.addEventListener("click", () => applyLayout(i));
  layoutGrid.appendChild(swatch);
});

// ---------- Background picker ----------
const backgroundGrid = $("background-grid");
BACKGROUND_LIBRARY.forEach((bg, i) => {
  const swatch = document.createElement("button");
  swatch.type = "button";
  swatch.className = "background-swatch";
  swatch.innerHTML = `<span class="background-swatch-preview" style="background:${bg.css}"></span><span>${bg.name}</span>`;
  swatch.addEventListener("click", () => {
    BRANCH_DATA[currentBranchIndex].backgroundIndex = i;
    applyBranchBackground(currentBranchIndex);
  });
  backgroundGrid.appendChild(swatch);
});

// ---------- Logo upload ----------
$("upload-logo").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const branch = BRANCH_DATA[currentBranchIndex];
    branch.logo = ev.target.result;
    branch.logoScale = 1;
    branch.logoSpacing = 0;
    applyBranchLogo(currentBranchIndex);
  };
  reader.readAsDataURL(file);
});

$("logo-remove-btn").addEventListener("click", () => {
  BRANCH_DATA[currentBranchIndex].logo = null;
  $("upload-logo").value = "";
  applyBranchLogo(currentBranchIndex);
});

$("logo-size-slider").addEventListener("input", (e) => {
  BRANCH_DATA[currentBranchIndex].logoScale = Number(e.target.value);
  applyBranchLogo(currentBranchIndex);
});

$("logo-spacing-slider").addEventListener("input", (e) => {
  BRANCH_DATA[currentBranchIndex].logoSpacing = Number(e.target.value);
  applyBranchLogo(currentBranchIndex);
});

// ---------- Settings modal ----------
// Houses flyer-wide options (currently just Font) behind a single top-right
// icon, kept separate from the per-vehicle form fields so it's a natural
// place to add more global options later without crowding the sidebar.
const settingsModal = $("settings-modal");
$("settings-btn").addEventListener("click", () => {
  settingsModal.hidden = false;
});
$("settings-done-btn").addEventListener("click", () => {
  settingsModal.hidden = true;
});
settingsModal.addEventListener("click", (e) => {
  if (e.target === settingsModal) settingsModal.hidden = true;
});

// ---------- Year dropdown ----------
(function populateYears() {
  const select = $("year-input");
  const currentYear = new Date().getFullYear();
  for (let y = currentYear + 1; y >= 1990; y--) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    select.appendChild(opt);
  }
})();

// initial defaults
$("year-input").value = "2021";
// applyLayout populates #pamphlet (which starts empty in index.html) and
// rehydrates it -- this covers font/colour/logo application and syncPreview,
// so a separate applyBranch(0)/syncPreview() call isn't needed here (the
// sidebar's dealer-name/address/phone/web inputs already carry branch 0's
// values as their HTML defaults).
applyLayout(0);
