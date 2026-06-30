# Design Guidelines (Design) - Roadmappers

## 1. Aesthetic Direction: Sleek Dark-First & Glassmorphism
Roadmappers is styled with a premium dark theme combined with glassmorphism to create a modern, high-tech, and immersive learning environment. 
- **Dark Mode First:** Default styles are dark-theme. Light highlights are used exclusively for accents and borders.
- **Glassmorphic Elements:** Cards and menus utilize semi-transparent backgrounds with background blur (`backdrop-blur-md`) and thin borders to look like "frosted glass" floating in space.

---

## 2. Color Palette (Midnight Slate & Neon Violet/Cyan)

### Primary Backgrounds & Surfaces
- **Midnight Black:** `#09090b` (Deepest canvas layer).
- **Midnight Slate:** `#0f172a` (Surface cards, header, and player backdrops).
- **Glass Border:** `rgba(255, 255, 255, 0.08)` (Thin overlay borders).

### Accents & Highlights
- **Neon Violet:** `#8b5cf6` (Primary action buttons, active links, and brand logo glows).
- **Neon Cyan:** `#06b6d4` (Step completion badges, progress meters, success messages).
- **Muted Lavender:** `#94a3b8` (Secondary text and icons).

---

## 3. Typography & Spacing
- **Headers Font:** `Outfit` (or system-default sans-serif, fallback to `system-ui`). Bold, wide spacing, modern tech feel.
- **Body Font:** `Inter`. Optimized for highly readable text screens.
- **Spacing Density:** Spacious & Fluid.
  - Generous margins and large padding bounds (`p-6` or `p-8` on larger screens).
  - Tappable nodes must be separated by at least `16px` margin gaps.
  - Bottom navigation bar: floating pill shape with padding (`p-4`).

---

## 4. Key UI Component Visual Styles

### 4.1. Glassmorphic Card (`.glass-card`)
- **CSS Styles:**
  ```css
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  ```

### 4.2. Roadmap Node (Tappable Checklist Step)
- **Inactive Node:** Muted slate circle, thin white-transparent border. Gray icon, dark gray background.
- **Active / Next Node:** Violet border with a subtle shadow glow (`box-shadow: 0 0 15px rgba(139, 92, 246, 0.3)`).
- **Completed Node:** Filled Neon Cyan checkmark, green/cyan glow, connection line connecting to the next node turns Neon Cyan.

### 4.3. Whop Sign-In Button (`.btn-whop`)
- **Visuals:** An elegant branded capsule button.
  ```css
  background: #ff5a1f; /* Whop Signature Orange */
  color: #ffffff;
  border-radius: 9999px;
  padding: 12px 24px;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(255, 90, 31, 0.25);
  transition: all 0.2s ease;
  ```
- **Hover:** Slight scale up and glowing backdrop shadow.

### 4.4. Touch Targets (Mobile & iPad)
- **Interactive Sizing:** Buttons and inputs are sized `h-12` (48px height) or greater.
- **Navigation Controls:** A bottom floating navigation bar (`fixed bottom-4 left-4 right-4`) designed as a glassmorphic capsule for easy thumb reach on mobile/iPad.
