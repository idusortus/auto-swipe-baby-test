# Baby Name Swiper - AI Coding Agent Instructions

## Project Overview
A vanilla JavaScript Tinder-style swipe interface for browsing baby names. Zero dependencies, mobile-first, deployed to Azure Static Web Apps.

## Architecture Pattern: Single-Class SPA

The entire app is managed by one class: `BabyNameSwiper` in [app.js](../app.js). This isn't a framework-based SPA - it's a direct DOM manipulation pattern with manual state management.

**Key State Management:**
- `currentNames[]` - filtered/shuffled working set (mutated on filter/reset)
- `allNames[]` - immutable source from [names-data.js](../names-data.js)
- `likedNames[]` - accumulator for swipe-right actions
- `currentIndex` - pointer into `currentNames[]` (never reset except on filter change)

**Critical Flow:** Filter change → `filterNames()` → `shuffleNames()` → reset `currentIndex` to 0 → `renderCards()`. Never shuffle without resetting index.

## UI Rendering Pattern: Z-Index Card Stack

Cards are rendered as absolutely positioned DOM elements, not a virtual scroll.

```javascript
// From renderCards() - ALWAYS render 3 cards for depth perception
const cardsToRender = Math.min(3, this.currentNames.length - this.currentIndex);
for (let i = cardsToRender - 1; i >= 0; i--) {
    // Scale decreases: 1.0, 0.95, 0.90
    card.style.transform = `scale(${1 - i * 0.05}) translateY(${i * -10}px)`;
}
```

**Only the top card** (`.top-card`) receives event listeners. Backend cards are `pointer-events: none`.

## Touch/Mouse Unified Event System

Both touch and mouse events use the same handlers. **Critical:** Touch events require `e.preventDefault()` to avoid scroll conflicts.

```javascript
// Pattern used throughout handleDragStart/Move/End
const touch = e.type.includes('touch') ? e.touches[0] : e;
this.startX = touch.clientX;
```

**Swipe threshold:** 100px horizontal movement triggers swipe, else card returns to center.

## File Loading Order (Non-Negotiable)

In [index.html](../index.html):
```html
<script src="names-data.js"></script>  <!-- MUST load first -->
<script src="app.js"></script>         <!-- Depends on babyNames global -->
```

`app.js` expects `babyNames` array in global scope. No module bundler, no imports.

## Azure Static Web Apps Deployment

### Critical Configuration
- [staticwebapp.config.json](../staticwebapp.config.json) - CSP headers prevent inline scripts. Keep `unsafe-inline` only for styles.
- Workflow secret name: `AZURE_STATIC_WEB_APPS_API_TOKEN_AGREEABLE_FIELD_0ABABE210` (instance-specific)
- Build preset: "Custom" with empty `app_location`, `api_location`, `output_location`

### Secret Management Workflow (per [DEPLOYMENT-FIX.md](../DEPLOYMENT-FIX.md))
If deployment token is exposed:
1. Azure Portal → Static Web App → Reset deployment token
2. Update GitHub secret with new value
3. Never commit tokens to repo

## Data Structure Conventions

Names in [names-data.js](../names-data.js) follow strict schema:
```javascript
{ name: "String", gender: "boy" | "girl" }  // No other genders, no optional fields
```

Gender-specific filter buttons map to exact string matches: `dataset.filter === "boy"` matches `name.gender === "boy"`.

## Mobile-Specific Patterns

```css
/* From styles.css - touch-action prevents browser gestures */
.card {
    touch-action: none;  /* Required for drag on mobile */
}
```

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<!-- maximum-scale prevents zoom conflicts with swipe -->
```

## No Backend, No Persistence

This is a proof-of-concept. `likedNames[]` resets on page refresh. If adding localStorage:
- Key pattern: `baby-swiper-liked-${filter}` to maintain gender separation
- Parse/stringify in `init()` and after each swipe in `animateSwipe()`

## Testing Locally

```bash
python3 -m http.server 8080
# File:// protocol won't work due to CORS-like restrictions with modules/fetch
```

## Common Pitfalls

1. **Adding names without updating stats:** `babyNames` array is 110 items (50 boys, 60 girls). Update README if changing counts.
2. **Modifying `currentNames` without resetting index:** Will cause off-by-one errors in card rendering.
3. **Adding CSS transitions to `.dragging` class:** Will create laggy swipe feel. Use `transition: none` during active drag.
4. **Async operations in swipe handlers:** All DOM updates must complete in 500ms (see `setTimeout` in `animateSwipe`).

## Code Style

- No semicolons in CSS
- Constructor initializes all properties before calling `init()`
- Event listeners use arrow functions to maintain `this` binding
- Fisher-Yates shuffle in `shuffleNames()` is canonical - don't replace with `sort(Math.random())`
