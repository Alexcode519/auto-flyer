// Layout variants for the flyer. Each entry's `html` becomes #pamphlet's
// innerHTML when selected. Every layout MUST keep the same set of data-bound
// ids/classes (see rehydratePamphlet() in app.js) -- only their arrangement,
// wrapper classes, and CSS may differ. No slot is ever omitted (all 4
// features, all 4 gallery cells, full checklist, etc. always present) so
// rehydration never needs to null-guard a missing element.
const LAYOUT_LIBRARY = [
  {
    id: "classic",
    name: "Classic",
    preview: '<rect x="4" y="4" width="40" height="6" rx="1" fill="currentColor" opacity="0.5"/><rect x="4" y="13" width="40" height="20" rx="1" fill="currentColor"/><rect x="4" y="36" width="8" height="8" rx="1" fill="currentColor" opacity="0.7"/><rect x="14" y="36" width="8" height="8" rx="1" fill="currentColor" opacity="0.7"/><rect x="24" y="36" width="8" height="8" rx="1" fill="currentColor" opacity="0.7"/><rect x="34" y="36" width="8" height="8" rx="1" fill="currentColor" opacity="0.7"/>',
    html: `
      <header class="p-header">
        <div class="p-logo">
          <img id="p-logo-img" class="p-logo-img" hidden />
          <span class="logo-main" id="p-dealer-name-main">AVURA</span>
          <span class="logo-sub" id="p-dealer-name-sub">Executive Auto</span>
        </div>
      </header>

      <section class="p-hero">
        <div class="p-hero-text">
          <h2 class="p-tagline1" id="p-tagline1">BUILT TO WORK.</h2>
          <h2 class="p-tagline2" id="p-tagline2">MADE TO LAST.</h2>
          <p class="p-description" id="p-description">Legendary reliability. Unmatched capability.</p>
        </div>
        <div class="p-badge">
          <span class="badge-brand" id="p-badge-brand">TOYOTA</span>
          <span class="badge-model" id="p-badge-model">LAND CRUISER</span>
          <span class="badge-variant" id="p-badge-variant">79 SERIES</span>
        </div>
        <div class="p-hero-photo">
          <div id="p-hero-img" class="photo-bg" hidden></div>
          <span class="photo-empty" id="p-hero-empty">Hero photo</span>
          <button type="button" class="crop-btn" data-target="hero" aria-label="Crop photo" hidden>
            <svg viewBox="0 0 24 24"><path d="M6 2v14a2 2 0 0 0 2 2h14" stroke="currentColor" stroke-width="2" fill="none"/><path d="M18 22V8a2 2 0 0 0-2-2H2" stroke="currentColor" stroke-width="2" fill="none"/></svg>
          </button>
        </div>
      </section>

      <section class="p-features">
        <div class="feature">
          <svg viewBox="0 0 48 48" id="p-feature-0-icon"><path d="M6 30h6v-8h8v-4h4l4-4h8v4h4l4 4v8h2M14 22V14h10v4M22 30h6" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="14" cy="34" r="3" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="34" cy="34" r="3" stroke="var(--gold)" stroke-width="2" fill="none"/></svg>
          <span class="f-title" id="p-feature-0-title">4.5L V8 TURBO DIESEL</span>
          <span class="f-sub" id="p-feature-0-sub">Powerful. Proven.</span>
        </div>
        <div class="feature">
          <svg viewBox="0 0 48 48" id="p-feature-1-icon"><circle cx="12" cy="14" r="4" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="36" cy="14" r="4" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="12" cy="34" r="4" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="36" cy="34" r="4" stroke="var(--gold)" stroke-width="2" fill="none"/><path d="M16 14h16M12 18v12M36 18v12M16 34h16" stroke="var(--gold)" stroke-width="2" fill="none"/></svg>
          <span class="f-title" id="p-feature-1-title">4X4 CAPABILITY</span>
          <span class="f-sub" id="p-feature-1-sub">Go anywhere.</span>
        </div>
        <div class="feature">
          <svg viewBox="0 0 48 48" id="p-feature-2-icon"><path d="M24 6l16 6v10c0 10-7 17-16 20-9-3-16-10-16-20V12z" stroke="var(--gold)" stroke-width="2" fill="none"/><path d="M17 24l5 5 9-10" stroke="var(--gold)" stroke-width="2" fill="none"/></svg>
          <span class="f-title" id="p-feature-2-title">TOYOTA RELIABILITY</span>
          <span class="f-sub" id="p-feature-2-sub">Built to go the distance.</span>
        </div>
        <div class="feature">
          <svg viewBox="0 0 48 48" id="p-feature-3-icon"><rect x="4" y="16" width="24" height="12" stroke="var(--gold)" stroke-width="2" fill="none"/><path d="M28 20h8l6 6v2h-14z" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="12" cy="30" r="3" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="34" cy="30" r="3" stroke="var(--gold)" stroke-width="2" fill="none"/></svg>
          <span class="f-title" id="p-feature-3-title">HEAVY DUTY PAYLOAD</span>
          <span class="f-sub" id="p-feature-3-sub">Work smarter. Work harder.</span>
        </div>
      </section>

      <section class="p-gallery">
        <div class="gallery-cell">
          <div id="p-g1-img" class="photo-bg" hidden></div><span class="photo-empty" id="p-g1-empty">Interior</span>
          <button type="button" class="crop-btn" data-target="g1" aria-label="Crop photo" hidden>
            <svg viewBox="0 0 24 24"><path d="M6 2v14a2 2 0 0 0 2 2h14" stroke="currentColor" stroke-width="2" fill="none"/><path d="M18 22V8a2 2 0 0 0-2-2H2" stroke="currentColor" stroke-width="2" fill="none"/></svg>
          </button>
        </div>
        <div class="gallery-cell">
          <div id="p-g2-img" class="photo-bg" hidden></div><span class="photo-empty" id="p-g2-empty">Rear 3/4</span>
          <button type="button" class="crop-btn" data-target="g2" aria-label="Crop photo" hidden>
            <svg viewBox="0 0 24 24"><path d="M6 2v14a2 2 0 0 0 2 2h14" stroke="currentColor" stroke-width="2" fill="none"/><path d="M18 22V8a2 2 0 0 0-2-2H2" stroke="currentColor" stroke-width="2" fill="none"/></svg>
          </button>
        </div>
        <div class="gallery-cell">
          <div id="p-g3-img" class="photo-bg" hidden></div><span class="photo-empty" id="p-g3-empty">Front</span>
          <button type="button" class="crop-btn" data-target="g3" aria-label="Crop photo" hidden>
            <svg viewBox="0 0 24 24"><path d="M6 2v14a2 2 0 0 0 2 2h14" stroke="currentColor" stroke-width="2" fill="none"/><path d="M18 22V8a2 2 0 0 0-2-2H2" stroke="currentColor" stroke-width="2" fill="none"/></svg>
          </button>
        </div>
        <div class="gallery-cell">
          <div id="p-g4-img" class="photo-bg" hidden></div><span class="photo-empty" id="p-g4-empty">Load bed</span>
          <button type="button" class="crop-btn" data-target="g4" aria-label="Crop photo" hidden>
            <svg viewBox="0 0 24 24"><path d="M6 2v14a2 2 0 0 0 2 2h14" stroke="currentColor" stroke-width="2" fill="none"/><path d="M18 22V8a2 2 0 0 0-2-2H2" stroke="currentColor" stroke-width="2" fill="none"/></svg>
          </button>
        </div>
      </section>

      <section class="p-details">
        <div class="p-details-left">
          <span class="p-brand-line" id="p-details-brand">TOYOTA LAND CRUISER</span>
          <span class="p-variant-line" id="p-details-variant">4.5D LX V8 P/U S/C</span>
          <div class="p-meta-row">
            <span class="meta-item"><span id="p-year">2021</span></span>
            <span class="meta-divider">&bull;</span>
            <span class="meta-item"><span id="p-km">175 000 Km</span></span>
            <span class="meta-divider">&bull;</span>
            <span class="meta-item"><span class="color-swatch" id="p-color-swatch"></span><span id="p-color">Beige</span></span>
          </div>
          <span class="p-price-label">PRICE:</span>
          <span class="p-price" id="p-price">R729 900</span>
        </div>
        <div class="p-details-right">
          <div class="check-item"><span class="check-mark">&check;</span><span id="p-check-0">Full Service History</span></div>
          <div class="check-item"><span class="check-mark">&check;</span><span id="p-check-1">Well Maintained</span></div>
          <div class="check-item"><span class="check-mark">&check;</span><span id="p-check-2">Ready for Work or Adventure</span></div>
          <div class="check-item"><span class="check-mark">&check;</span><span id="p-check-3">Finance Available</span></div>
        </div>
      </section>

      <footer class="p-footer">
        <span>&#128205; VISIT US<br /><b id="p-dealer-address">36 Kock Street, Rustenburg, 0299</b></span>
        <span>&#128222; CONTACT US<br /><b id="p-dealer-phone">014 592 0334</b></span>
        <span>&#127760; VIEW MORE<br /><b id="p-dealer-web">www.avuramotors.co.za</b></span>
        <span class="footer-logo-wrap">
          <img id="p-footer-logo-img" class="p-footer-logo-img" hidden />
          <span class="footer-logo" id="p-footer-dealer">AVURA</span>
        </span>
      </footer>
    `
  },

  {
    id: "fullbleed",
    name: "Full Bleed",
    preview: '<rect x="4" y="4" width="40" height="30" rx="1" fill="currentColor"/><rect x="6" y="6" width="16" height="4" rx="1" fill="var(--bg-dark)" opacity="0.8"/><rect x="6" y="26" width="26" height="5" rx="1" fill="var(--bg-dark)" opacity="0.8"/><rect x="4" y="36" width="8" height="8" rx="1" fill="currentColor" opacity="0.7"/><rect x="14" y="36" width="8" height="8" rx="1" fill="currentColor" opacity="0.7"/><rect x="24" y="36" width="8" height="8" rx="1" fill="currentColor" opacity="0.7"/><rect x="34" y="36" width="8" height="8" rx="1" fill="currentColor" opacity="0.7"/>',
    html: `
      <div class="p-hero-photo p-hero-photo-fb">
        <div id="p-hero-img" class="photo-bg" hidden></div>
        <span class="photo-empty" id="p-hero-empty">Hero photo</span>
        <div class="hero-scrim"></div>
        <button type="button" class="crop-btn crop-btn-fb" data-target="hero" aria-label="Crop photo" hidden>
          <svg viewBox="0 0 24 24"><path d="M6 2v14a2 2 0 0 0 2 2h14" stroke="currentColor" stroke-width="2" fill="none"/><path d="M18 22V8a2 2 0 0 0-2-2H2" stroke="currentColor" stroke-width="2" fill="none"/></svg>
        </button>

        <header class="p-header p-header-fb">
          <div class="p-logo p-logo-fb">
            <img id="p-logo-img" class="p-logo-img" hidden />
            <span class="logo-main" id="p-dealer-name-main">AVURA</span>
            <span class="logo-sub" id="p-dealer-name-sub">Executive Auto</span>
          </div>
        </header>

        <div class="p-badge p-badge-fb">
          <span class="badge-brand" id="p-badge-brand">TOYOTA</span>
          <span class="badge-model" id="p-badge-model">LAND CRUISER</span>
          <span class="badge-variant" id="p-badge-variant">79 SERIES</span>
        </div>

        <div class="p-hero-text p-hero-text-fb">
          <h2 class="p-tagline1" id="p-tagline1">BUILT TO WORK.</h2>
          <h2 class="p-tagline2" id="p-tagline2">MADE TO LAST.</h2>
          <p class="p-description" id="p-description">Legendary reliability. Unmatched capability.</p>
        </div>
      </div>

      <section class="p-features">
        <div class="feature">
          <svg viewBox="0 0 48 48" id="p-feature-0-icon"><path d="M6 30h6v-8h8v-4h4l4-4h8v4h4l4 4v8h2M14 22V14h10v4M22 30h6" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="14" cy="34" r="3" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="34" cy="34" r="3" stroke="var(--gold)" stroke-width="2" fill="none"/></svg>
          <span class="f-title" id="p-feature-0-title">4.5L V8 TURBO DIESEL</span>
          <span class="f-sub" id="p-feature-0-sub">Powerful. Proven.</span>
        </div>
        <div class="feature">
          <svg viewBox="0 0 48 48" id="p-feature-1-icon"><circle cx="12" cy="14" r="4" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="36" cy="14" r="4" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="12" cy="34" r="4" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="36" cy="34" r="4" stroke="var(--gold)" stroke-width="2" fill="none"/><path d="M16 14h16M12 18v12M36 18v12M16 34h16" stroke="var(--gold)" stroke-width="2" fill="none"/></svg>
          <span class="f-title" id="p-feature-1-title">4X4 CAPABILITY</span>
          <span class="f-sub" id="p-feature-1-sub">Go anywhere.</span>
        </div>
        <div class="feature">
          <svg viewBox="0 0 48 48" id="p-feature-2-icon"><path d="M24 6l16 6v10c0 10-7 17-16 20-9-3-16-10-16-20V12z" stroke="var(--gold)" stroke-width="2" fill="none"/><path d="M17 24l5 5 9-10" stroke="var(--gold)" stroke-width="2" fill="none"/></svg>
          <span class="f-title" id="p-feature-2-title">TOYOTA RELIABILITY</span>
          <span class="f-sub" id="p-feature-2-sub">Built to go the distance.</span>
        </div>
        <div class="feature">
          <svg viewBox="0 0 48 48" id="p-feature-3-icon"><rect x="4" y="16" width="24" height="12" stroke="var(--gold)" stroke-width="2" fill="none"/><path d="M28 20h8l6 6v2h-14z" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="12" cy="30" r="3" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="34" cy="30" r="3" stroke="var(--gold)" stroke-width="2" fill="none"/></svg>
          <span class="f-title" id="p-feature-3-title">HEAVY DUTY PAYLOAD</span>
          <span class="f-sub" id="p-feature-3-sub">Work smarter. Work harder.</span>
        </div>
      </section>

      <section class="p-gallery">
        <div class="gallery-cell">
          <div id="p-g1-img" class="photo-bg" hidden></div><span class="photo-empty" id="p-g1-empty">Interior</span>
          <button type="button" class="crop-btn" data-target="g1" aria-label="Crop photo" hidden>
            <svg viewBox="0 0 24 24"><path d="M6 2v14a2 2 0 0 0 2 2h14" stroke="currentColor" stroke-width="2" fill="none"/><path d="M18 22V8a2 2 0 0 0-2-2H2" stroke="currentColor" stroke-width="2" fill="none"/></svg>
          </button>
        </div>
        <div class="gallery-cell">
          <div id="p-g2-img" class="photo-bg" hidden></div><span class="photo-empty" id="p-g2-empty">Rear 3/4</span>
          <button type="button" class="crop-btn" data-target="g2" aria-label="Crop photo" hidden>
            <svg viewBox="0 0 24 24"><path d="M6 2v14a2 2 0 0 0 2 2h14" stroke="currentColor" stroke-width="2" fill="none"/><path d="M18 22V8a2 2 0 0 0-2-2H2" stroke="currentColor" stroke-width="2" fill="none"/></svg>
          </button>
        </div>
        <div class="gallery-cell">
          <div id="p-g3-img" class="photo-bg" hidden></div><span class="photo-empty" id="p-g3-empty">Front</span>
          <button type="button" class="crop-btn" data-target="g3" aria-label="Crop photo" hidden>
            <svg viewBox="0 0 24 24"><path d="M6 2v14a2 2 0 0 0 2 2h14" stroke="currentColor" stroke-width="2" fill="none"/><path d="M18 22V8a2 2 0 0 0-2-2H2" stroke="currentColor" stroke-width="2" fill="none"/></svg>
          </button>
        </div>
        <div class="gallery-cell">
          <div id="p-g4-img" class="photo-bg" hidden></div><span class="photo-empty" id="p-g4-empty">Load bed</span>
          <button type="button" class="crop-btn" data-target="g4" aria-label="Crop photo" hidden>
            <svg viewBox="0 0 24 24"><path d="M6 2v14a2 2 0 0 0 2 2h14" stroke="currentColor" stroke-width="2" fill="none"/><path d="M18 22V8a2 2 0 0 0-2-2H2" stroke="currentColor" stroke-width="2" fill="none"/></svg>
          </button>
        </div>
      </section>

      <section class="p-details">
        <div class="p-details-left">
          <span class="p-brand-line" id="p-details-brand">TOYOTA LAND CRUISER</span>
          <span class="p-variant-line" id="p-details-variant">4.5D LX V8 P/U S/C</span>
          <div class="p-meta-row">
            <span class="meta-item"><span id="p-year">2021</span></span>
            <span class="meta-divider">&bull;</span>
            <span class="meta-item"><span id="p-km">175 000 Km</span></span>
            <span class="meta-divider">&bull;</span>
            <span class="meta-item"><span class="color-swatch" id="p-color-swatch"></span><span id="p-color">Beige</span></span>
          </div>
          <span class="p-price-label">PRICE:</span>
          <span class="p-price" id="p-price">R729 900</span>
        </div>
        <div class="p-details-right">
          <div class="check-item"><span class="check-mark">&check;</span><span id="p-check-0">Full Service History</span></div>
          <div class="check-item"><span class="check-mark">&check;</span><span id="p-check-1">Well Maintained</span></div>
          <div class="check-item"><span class="check-mark">&check;</span><span id="p-check-2">Ready for Work or Adventure</span></div>
          <div class="check-item"><span class="check-mark">&check;</span><span id="p-check-3">Finance Available</span></div>
        </div>
      </section>

      <footer class="p-footer">
        <span>&#128205; VISIT US<br /><b id="p-dealer-address">36 Kock Street, Rustenburg, 0299</b></span>
        <span>&#128222; CONTACT US<br /><b id="p-dealer-phone">014 592 0334</b></span>
        <span>&#127760; VIEW MORE<br /><b id="p-dealer-web">www.avuramotors.co.za</b></span>
        <span class="footer-logo-wrap">
          <img id="p-footer-logo-img" class="p-footer-logo-img" hidden />
          <span class="footer-logo" id="p-footer-dealer">AVURA</span>
        </span>
      </footer>
    `
  },

  {
    id: "split",
    name: "Split Grid",
    preview: '<rect x="4" y="4" width="40" height="5" rx="1" fill="currentColor" opacity="0.5"/><rect x="4" y="12" width="18" height="14" rx="1" fill="currentColor"/><rect x="4" y="28" width="8" height="8" rx="1" fill="currentColor" opacity="0.7"/><rect x="14" y="28" width="8" height="8" rx="1" fill="currentColor" opacity="0.7"/><rect x="25" y="12" width="19" height="4" rx="1" fill="currentColor" opacity="0.8"/><rect x="25" y="19" width="19" height="4" rx="1" fill="currentColor" opacity="0.6"/><rect x="25" y="26" width="19" height="4" rx="1" fill="currentColor" opacity="0.6"/><rect x="25" y="33" width="19" height="4" rx="1" fill="currentColor" opacity="0.6"/>',
    html: `
      <header class="p-header">
        <div class="p-logo">
          <img id="p-logo-img" class="p-logo-img" hidden />
          <span class="logo-main" id="p-dealer-name-main">AVURA</span>
          <span class="logo-sub" id="p-dealer-name-sub">Executive Auto</span>
        </div>
      </header>

      <div class="p-split">
        <div class="p-split-photos">
          <div class="p-hero-photo p-hero-photo-split">
            <div id="p-hero-img" class="photo-bg" hidden></div>
            <span class="photo-empty" id="p-hero-empty">Hero photo</span>
            <button type="button" class="crop-btn" data-target="hero" aria-label="Crop photo" hidden>
              <svg viewBox="0 0 24 24"><path d="M6 2v14a2 2 0 0 0 2 2h14" stroke="currentColor" stroke-width="2" fill="none"/><path d="M18 22V8a2 2 0 0 0-2-2H2" stroke="currentColor" stroke-width="2" fill="none"/></svg>
            </button>
          </div>
          <div class="p-split-gallery">
            <div class="gallery-cell">
              <div id="p-g1-img" class="photo-bg" hidden></div><span class="photo-empty" id="p-g1-empty">Interior</span>
              <button type="button" class="crop-btn" data-target="g1" aria-label="Crop photo" hidden>
                <svg viewBox="0 0 24 24"><path d="M6 2v14a2 2 0 0 0 2 2h14" stroke="currentColor" stroke-width="2" fill="none"/><path d="M18 22V8a2 2 0 0 0-2-2H2" stroke="currentColor" stroke-width="2" fill="none"/></svg>
              </button>
            </div>
            <div class="gallery-cell">
              <div id="p-g2-img" class="photo-bg" hidden></div><span class="photo-empty" id="p-g2-empty">Rear 3/4</span>
              <button type="button" class="crop-btn" data-target="g2" aria-label="Crop photo" hidden>
                <svg viewBox="0 0 24 24"><path d="M6 2v14a2 2 0 0 0 2 2h14" stroke="currentColor" stroke-width="2" fill="none"/><path d="M18 22V8a2 2 0 0 0-2-2H2" stroke="currentColor" stroke-width="2" fill="none"/></svg>
              </button>
            </div>
            <div class="gallery-cell">
              <div id="p-g3-img" class="photo-bg" hidden></div><span class="photo-empty" id="p-g3-empty">Front</span>
              <button type="button" class="crop-btn" data-target="g3" aria-label="Crop photo" hidden>
                <svg viewBox="0 0 24 24"><path d="M6 2v14a2 2 0 0 0 2 2h14" stroke="currentColor" stroke-width="2" fill="none"/><path d="M18 22V8a2 2 0 0 0-2-2H2" stroke="currentColor" stroke-width="2" fill="none"/></svg>
              </button>
            </div>
            <div class="gallery-cell">
              <div id="p-g4-img" class="photo-bg" hidden></div><span class="photo-empty" id="p-g4-empty">Load bed</span>
              <button type="button" class="crop-btn" data-target="g4" aria-label="Crop photo" hidden>
                <svg viewBox="0 0 24 24"><path d="M6 2v14a2 2 0 0 0 2 2h14" stroke="currentColor" stroke-width="2" fill="none"/><path d="M18 22V8a2 2 0 0 0-2-2H2" stroke="currentColor" stroke-width="2" fill="none"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div class="p-split-info">
          <div class="p-badge p-badge-split">
            <span class="badge-brand" id="p-badge-brand">TOYOTA</span>
            <span class="badge-model" id="p-badge-model">LAND CRUISER</span>
            <span class="badge-variant" id="p-badge-variant">79 SERIES</span>
          </div>
          <div class="p-hero-text p-hero-text-split">
            <h2 class="p-tagline1" id="p-tagline1">BUILT TO WORK.</h2>
            <h2 class="p-tagline2" id="p-tagline2">MADE TO LAST.</h2>
            <p class="p-description" id="p-description">Legendary reliability. Unmatched capability.</p>
          </div>
          <section class="p-features p-features-vertical">
            <div class="feature">
              <svg viewBox="0 0 48 48" id="p-feature-0-icon"><path d="M6 30h6v-8h8v-4h4l4-4h8v4h4l4 4v8h2M14 22V14h10v4M22 30h6" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="14" cy="34" r="3" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="34" cy="34" r="3" stroke="var(--gold)" stroke-width="2" fill="none"/></svg>
              <span class="f-text"><span class="f-title" id="p-feature-0-title">4.5L V8 TURBO DIESEL</span><span class="f-sub" id="p-feature-0-sub">Powerful. Proven.</span></span>
            </div>
            <div class="feature">
              <svg viewBox="0 0 48 48" id="p-feature-1-icon"><circle cx="12" cy="14" r="4" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="36" cy="14" r="4" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="12" cy="34" r="4" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="36" cy="34" r="4" stroke="var(--gold)" stroke-width="2" fill="none"/><path d="M16 14h16M12 18v12M36 18v12M16 34h16" stroke="var(--gold)" stroke-width="2" fill="none"/></svg>
              <span class="f-text"><span class="f-title" id="p-feature-1-title">4X4 CAPABILITY</span><span class="f-sub" id="p-feature-1-sub">Go anywhere.</span></span>
            </div>
            <div class="feature">
              <svg viewBox="0 0 48 48" id="p-feature-2-icon"><path d="M24 6l16 6v10c0 10-7 17-16 20-9-3-16-10-16-20V12z" stroke="var(--gold)" stroke-width="2" fill="none"/><path d="M17 24l5 5 9-10" stroke="var(--gold)" stroke-width="2" fill="none"/></svg>
              <span class="f-text"><span class="f-title" id="p-feature-2-title">TOYOTA RELIABILITY</span><span class="f-sub" id="p-feature-2-sub">Built to go the distance.</span></span>
            </div>
            <div class="feature">
              <svg viewBox="0 0 48 48" id="p-feature-3-icon"><rect x="4" y="16" width="24" height="12" stroke="var(--gold)" stroke-width="2" fill="none"/><path d="M28 20h8l6 6v2h-14z" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="12" cy="30" r="3" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="34" cy="30" r="3" stroke="var(--gold)" stroke-width="2" fill="none"/></svg>
              <span class="f-text"><span class="f-title" id="p-feature-3-title">HEAVY DUTY PAYLOAD</span><span class="f-sub" id="p-feature-3-sub">Work smarter. Work harder.</span></span>
            </div>
          </section>
          <section class="p-details p-details-split">
            <div class="p-details-left">
              <span class="p-brand-line" id="p-details-brand">TOYOTA LAND CRUISER</span>
              <span class="p-variant-line" id="p-details-variant">4.5D LX V8 P/U S/C</span>
              <div class="p-meta-row">
                <span class="meta-item"><span id="p-year">2021</span></span>
                <span class="meta-divider">&bull;</span>
                <span class="meta-item"><span id="p-km">175 000 Km</span></span>
                <span class="meta-divider">&bull;</span>
                <span class="meta-item"><span class="color-swatch" id="p-color-swatch"></span><span id="p-color">Beige</span></span>
              </div>
              <span class="p-price-label">PRICE:</span>
              <span class="p-price" id="p-price">R729 900</span>
            </div>
            <div class="p-details-right">
              <div class="check-item"><span class="check-mark">&check;</span><span id="p-check-0">Full Service History</span></div>
              <div class="check-item"><span class="check-mark">&check;</span><span id="p-check-1">Well Maintained</span></div>
              <div class="check-item"><span class="check-mark">&check;</span><span id="p-check-2">Ready for Work or Adventure</span></div>
              <div class="check-item"><span class="check-mark">&check;</span><span id="p-check-3">Finance Available</span></div>
            </div>
          </section>
        </div>
      </div>

      <footer class="p-footer">
        <span>&#128205; VISIT US<br /><b id="p-dealer-address">36 Kock Street, Rustenburg, 0299</b></span>
        <span>&#128222; CONTACT US<br /><b id="p-dealer-phone">014 592 0334</b></span>
        <span>&#127760; VIEW MORE<br /><b id="p-dealer-web">www.avuramotors.co.za</b></span>
        <span class="footer-logo-wrap">
          <img id="p-footer-logo-img" class="p-footer-logo-img" hidden />
          <span class="footer-logo" id="p-footer-dealer">AVURA</span>
        </span>
      </footer>
    `
  },

  {
    id: "minimal",
    name: "Minimal",
    preview: '<rect x="4" y="4" width="18" height="4" rx="1" fill="currentColor" opacity="0.5"/><rect x="4" y="12" width="18" height="16" rx="1" fill="currentColor"/><rect x="25" y="12" width="19" height="4" rx="1" fill="currentColor" opacity="0.8"/><rect x="25" y="19" width="14" height="4" rx="1" fill="currentColor" opacity="0.6"/><rect x="4" y="32" width="9" height="7" rx="1" fill="currentColor" opacity="0.6"/><rect x="15" y="32" width="9" height="7" rx="1" fill="currentColor" opacity="0.6"/><rect x="26" y="32" width="9" height="7" rx="1" fill="currentColor" opacity="0.6"/><rect x="37" y="32" width="7" height="7" rx="1" fill="currentColor" opacity="0.6"/>',
    html: `
      <header class="p-header p-header-min">
        <div class="p-logo p-logo-min">
          <img id="p-logo-img" class="p-logo-img" hidden />
          <span class="logo-main" id="p-dealer-name-main">AVURA</span>
          <span class="logo-sub" id="p-dealer-name-sub">Executive Auto</span>
        </div>
      </header>

      <section class="p-hero p-hero-min">
        <div class="p-hero-photo p-hero-photo-min">
          <div id="p-hero-img" class="photo-bg" hidden></div>
          <span class="photo-empty" id="p-hero-empty">Hero photo</span>
          <button type="button" class="crop-btn" data-target="hero" aria-label="Crop photo" hidden>
            <svg viewBox="0 0 24 24"><path d="M6 2v14a2 2 0 0 0 2 2h14" stroke="currentColor" stroke-width="2" fill="none"/><path d="M18 22V8a2 2 0 0 0-2-2H2" stroke="currentColor" stroke-width="2" fill="none"/></svg>
          </button>
        </div>
        <div class="p-hero-text p-hero-text-min">
          <h2 class="p-tagline1" id="p-tagline1">BUILT TO WORK.</h2>
          <h2 class="p-tagline2" id="p-tagline2">MADE TO LAST.</h2>
          <p class="p-description" id="p-description">Legendary reliability. Unmatched capability.</p>
          <div class="p-badge p-badge-min">
            <span class="badge-brand" id="p-badge-brand">TOYOTA</span>
            <span class="badge-model" id="p-badge-model">LAND CRUISER</span>
            <span class="badge-variant" id="p-badge-variant">79 SERIES</span>
          </div>
        </div>
      </section>

      <section class="p-features p-features-min">
        <div class="feature">
          <svg viewBox="0 0 48 48" id="p-feature-0-icon"><path d="M6 30h6v-8h8v-4h4l4-4h8v4h4l4 4v8h2M14 22V14h10v4M22 30h6" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="14" cy="34" r="3" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="34" cy="34" r="3" stroke="var(--gold)" stroke-width="2" fill="none"/></svg>
          <span class="f-title" id="p-feature-0-title">4.5L V8 TURBO DIESEL</span>
          <span class="f-sub" id="p-feature-0-sub">Powerful. Proven.</span>
        </div>
        <div class="feature">
          <svg viewBox="0 0 48 48" id="p-feature-1-icon"><circle cx="12" cy="14" r="4" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="36" cy="14" r="4" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="12" cy="34" r="4" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="36" cy="34" r="4" stroke="var(--gold)" stroke-width="2" fill="none"/><path d="M16 14h16M12 18v12M36 18v12M16 34h16" stroke="var(--gold)" stroke-width="2" fill="none"/></svg>
          <span class="f-title" id="p-feature-1-title">4X4 CAPABILITY</span>
          <span class="f-sub" id="p-feature-1-sub">Go anywhere.</span>
        </div>
        <div class="feature">
          <svg viewBox="0 0 48 48" id="p-feature-2-icon"><path d="M24 6l16 6v10c0 10-7 17-16 20-9-3-16-10-16-20V12z" stroke="var(--gold)" stroke-width="2" fill="none"/><path d="M17 24l5 5 9-10" stroke="var(--gold)" stroke-width="2" fill="none"/></svg>
          <span class="f-title" id="p-feature-2-title">TOYOTA RELIABILITY</span>
          <span class="f-sub" id="p-feature-2-sub">Built to go the distance.</span>
        </div>
        <div class="feature">
          <svg viewBox="0 0 48 48" id="p-feature-3-icon"><rect x="4" y="16" width="24" height="12" stroke="var(--gold)" stroke-width="2" fill="none"/><path d="M28 20h8l6 6v2h-14z" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="12" cy="30" r="3" stroke="var(--gold)" stroke-width="2" fill="none"/><circle cx="34" cy="30" r="3" stroke="var(--gold)" stroke-width="2" fill="none"/></svg>
          <span class="f-title" id="p-feature-3-title">HEAVY DUTY PAYLOAD</span>
          <span class="f-sub" id="p-feature-3-sub">Work smarter. Work harder.</span>
        </div>
      </section>

      <section class="p-gallery">
        <div class="gallery-cell">
          <div id="p-g1-img" class="photo-bg" hidden></div><span class="photo-empty" id="p-g1-empty">Interior</span>
          <button type="button" class="crop-btn" data-target="g1" aria-label="Crop photo" hidden>
            <svg viewBox="0 0 24 24"><path d="M6 2v14a2 2 0 0 0 2 2h14" stroke="currentColor" stroke-width="2" fill="none"/><path d="M18 22V8a2 2 0 0 0-2-2H2" stroke="currentColor" stroke-width="2" fill="none"/></svg>
          </button>
        </div>
        <div class="gallery-cell">
          <div id="p-g2-img" class="photo-bg" hidden></div><span class="photo-empty" id="p-g2-empty">Rear 3/4</span>
          <button type="button" class="crop-btn" data-target="g2" aria-label="Crop photo" hidden>
            <svg viewBox="0 0 24 24"><path d="M6 2v14a2 2 0 0 0 2 2h14" stroke="currentColor" stroke-width="2" fill="none"/><path d="M18 22V8a2 2 0 0 0-2-2H2" stroke="currentColor" stroke-width="2" fill="none"/></svg>
          </button>
        </div>
        <div class="gallery-cell">
          <div id="p-g3-img" class="photo-bg" hidden></div><span class="photo-empty" id="p-g3-empty">Front</span>
          <button type="button" class="crop-btn" data-target="g3" aria-label="Crop photo" hidden>
            <svg viewBox="0 0 24 24"><path d="M6 2v14a2 2 0 0 0 2 2h14" stroke="currentColor" stroke-width="2" fill="none"/><path d="M18 22V8a2 2 0 0 0-2-2H2" stroke="currentColor" stroke-width="2" fill="none"/></svg>
          </button>
        </div>
        <div class="gallery-cell">
          <div id="p-g4-img" class="photo-bg" hidden></div><span class="photo-empty" id="p-g4-empty">Load bed</span>
          <button type="button" class="crop-btn" data-target="g4" aria-label="Crop photo" hidden>
            <svg viewBox="0 0 24 24"><path d="M6 2v14a2 2 0 0 0 2 2h14" stroke="currentColor" stroke-width="2" fill="none"/><path d="M18 22V8a2 2 0 0 0-2-2H2" stroke="currentColor" stroke-width="2" fill="none"/></svg>
          </button>
        </div>
      </section>

      <section class="p-details p-details-min">
        <span class="p-brand-line" id="p-details-brand">TOYOTA LAND CRUISER</span>
        <span class="p-variant-line" id="p-details-variant">4.5D LX V8 P/U S/C</span>
        <div class="p-meta-row">
          <span class="meta-item"><span id="p-year">2021</span></span>
          <span class="meta-divider">&bull;</span>
          <span class="meta-item"><span id="p-km">175 000 Km</span></span>
          <span class="meta-divider">&bull;</span>
          <span class="meta-item"><span class="color-swatch" id="p-color-swatch"></span><span id="p-color">Beige</span></span>
        </div>
        <div class="p-details-min-row">
          <span class="p-price" id="p-price">R729 900</span>
          <div class="p-details-right p-details-right-min">
            <div class="check-item"><span class="check-mark">&check;</span><span id="p-check-0">Full Service History</span></div>
            <div class="check-item"><span class="check-mark">&check;</span><span id="p-check-1">Well Maintained</span></div>
            <div class="check-item"><span class="check-mark">&check;</span><span id="p-check-2">Ready for Work or Adventure</span></div>
            <div class="check-item"><span class="check-mark">&check;</span><span id="p-check-3">Finance Available</span></div>
          </div>
        </div>
      </section>

      <footer class="p-footer">
        <span>&#128205; VISIT US<br /><b id="p-dealer-address">36 Kock Street, Rustenburg, 0299</b></span>
        <span>&#128222; CONTACT US<br /><b id="p-dealer-phone">014 592 0334</b></span>
        <span>&#127760; VIEW MORE<br /><b id="p-dealer-web">www.avuramotors.co.za</b></span>
        <span class="footer-logo-wrap">
          <img id="p-footer-logo-img" class="p-footer-logo-img" hidden />
          <span class="footer-logo" id="p-footer-dealer">AVURA</span>
        </span>
      </footer>
    `
  }
];
