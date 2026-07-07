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
const HERO_ASPECT = "700 / 260";
const GALLERY_ASPECT = "1 / 1";
const imagePosition = {
  hero: { x: 50, y: 50, scale: 1 }, g1: { x: 50, y: 50, scale: 1 }, g2: { x: 50, y: 50, scale: 1 },
  g3: { x: 50, y: 50, scale: 1 }, g4: { x: 50, y: 50, scale: 1 }
};
let cropModalSlot = null;

// Only the flyer image and the modal's own preview reflect crop adjustments;
// the small sidebar thumbnail under "2. Photos" intentionally stays as the
// plain uploaded photo so it remains a stable reference thumbnail.
function applyImagePosition(slot) {
  const pos = imagePosition[slot];
  const objectPosition = `${pos.x}% ${pos.y}%`;
  const transform = `scale(${pos.scale})`;
  const pImg = $(SLOT_TO_PREVIEW[slot].img);
  if (pImg) {
    pImg.style.objectPosition = objectPosition;
    pImg.style.transform = transform;
  }
  if (cropModalSlot === slot) {
    const modalImg = $("crop-modal-img");
    modalImg.style.objectPosition = objectPosition;
    modalImg.style.transform = transform;
  }
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
  cropModalImg.src = state.images[slot] || "";
  cropModalFrame.style.aspectRatio = slot === "hero" ? HERO_ASPECT : GALLERY_ASPECT;
  cropZoomSlider.value = imagePosition[slot].scale;
  applyImagePosition(slot);
  cropModal.hidden = false;
}

function closeCropModal() {
  cropModal.hidden = true;
  cropModalSlot = null;
}

document.querySelectorAll(".crop-btn").forEach((btn) => {
  btn.addEventListener("click", () => openCropModal(btn.dataset.target));
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
      pImg.src = dataUrl;
      pImg.hidden = false;
      if (target.empty) $(target.empty).hidden = true;

      // reset and reveal this slot's crop control for the new image
      imagePosition[slot] = { x: 50, y: 50, scale: 1 };
      applyImagePosition(slot);
      const cropBtn = document.querySelector(`.crop-btn[data-target="${slot}"]`);
      if (cropBtn) cropBtn.hidden = false;

      if (slot === "hero") {
        const tmpImg = new Image();
        tmpImg.onload = () => {
          detectColorFromImage(tmpImg, (colorName) => {
            $("color-select").value = colorName;
            syncPreview();
          });
        };
        tmpImg.src = dataUrl;
      }
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
  html2canvas(node, {
    scale: 2,
    backgroundColor: "#1c1c1e",
    useCORS: true,
    ignoreElements: (el) => el.classList.contains("crop-btn")
  }).then((canvas) => {
    const link = document.createElement("a");
    const brand = (state.brand || "vehicle").replace(/\s+/g, "-");
    const model = (state.model || "pamphlet").replace(/\s+/g, "-");
    link.download = `${brand}-${model}-pamphlet.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
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
applyBranch(0);
syncPreview();
