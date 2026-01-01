# AI Agent Context - Bougie Babies Project

## Project Mission
Build a mobile-first baby name discovery app using vanilla JavaScript. This is a proof-of-concept web application that will inform the development of a future Android native app. Focus is on simplicity and user experience, not authentication or complex features.

## Application Architecture

### Single-Class SPA Pattern
The entire app is managed by one class: `BabyNameSwiper` in `app.js`. This is NOT a framework-based SPA - it's direct DOM manipulation with manual state management.

**Core State Properties:**
```javascript
this.allNames = [...babyNames];          // Immutable source (110 names)
this.currentNames = [];                  // Filtered/shuffled working set
this.likedNames = [];                    // Accumulator for swipe-right
this.currentIndex = 0;                   // Pointer into currentNames
this.currentFilter = 'all';              // 'all' | 'boy' | 'girl'
this.currentView = 'splash';             // View state tracker
this.isReviewing = false;                // Differentiates review mode
```

**Critical State Flow:**
1. User selects gender → `filterNames()` → `shuffleNames()` → reset `currentIndex` to 0 → `renderCards()`
2. Never shuffle without resetting index (causes off-by-one errors)
3. After filter change, currentIndex MUST be 0

### View Management System
Three main views controlled by CSS `display: none/block`:

**View 1: Onboarding**
- `splashView` - Branding screen with 5-second timer and double-tap skip
- `welcomeView` - Gender selection (Boy/Girl/Whatever)

**View 2: Swipe**
- `swipeView` - Card interface, stats, action buttons, done button

**View 3: Results**
- `resultsView` - List of liked names, review/email/text buttons

**Navigation Methods:**
- `showSplash()` - Displays splash, starts 5-second timer
- `showWelcome()` - Displays gender selection
- `showSwipe()` - Renders cards, updates stats
- `showResults()` - Displays liked names list
- `hideAllViews()` - Helper to hide all views before showing one

### Card Rendering: Z-Index Stack Pattern

Cards are absolutely positioned DOM elements, NOT virtual scroll.

```javascript
// From renderCards() - ALWAYS render 3 cards minimum
const cardsToRender = Math.min(3, this.currentNames.length - this.currentIndex);
for (let i = cardsToRender - 1; i >= 0; i--) {
    card.style.transform = `scale(${1 - i * 0.05}) translateY(${i * -10}px)`;
    card.style.zIndex = cardsToRender - i;
    card.style.opacity = 1 - i * 0.2;
}
```

**Only the top card** (`.top-card` class) receives event listeners. Backend cards have `pointer-events: none`.

### Touch/Mouse Unified Event System

Both touch and mouse events use the same handlers.

```javascript
// Pattern used throughout handleDragStart/Move/End
const touch = e.type.includes('touch') ? e.touches[0] : e;
this.startX = touch.clientX;
```

**Critical:** Touch events require `e.preventDefault()` to prevent scroll conflicts.

**Swipe Threshold:** 100px horizontal movement triggers swipe, else card returns to center.

### Animation Timing
All swipe animations complete in 500ms (see `setTimeout` in `animateSwipe()`). After animation:
- Increment `currentIndex`
- Check if at end of list → show empty state or results (if reviewing)
- Otherwise → `renderCards()` for next card

## File Dependencies

**Non-negotiable loading order in index.html:**
```html
<script src="names-data.js"></script>  <!-- MUST load first -->
<script src="app.js"></script>         <!-- Depends on babyNames global -->
```

`app.js` expects `babyNames` array in global scope. No module bundler, no imports.

## Data Schema

Names in `names-data.js` follow strict structure:
```javascript
{ name: "String", gender: "boy" | "girl" }
// No other genders, no optional fields, no additional properties
```

Total: 110 names (50 boys, 60 girls). Update README if this changes.

Gender filter buttons map to exact string matches:
`dataset.filter === "boy"` matches `name.gender === "boy"`

## Mobile-Specific Implementation

**Viewport Configuration:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
```
- `maximum-scale=1.0` prevents zoom conflicts with swipe
- `viewport-fit=cover` extends to screen edges on notched phones

**CSS Touch Handling:**
```css
.card {
    touch-action: none;  /* Required for drag on mobile */
}
```

**PWA Features:**
- Web app manifest for Add to Home Screen
- Theme colors for browser chrome: `#667eea` (purple)
- Standalone display mode for full-screen
- Works offline once loaded (static files only)

**Android Navigation Bar Clearance:**
- Action buttons overlaid at card corners (out of nav bar zone)
- Done button has `margin-bottom: 20px`
- Adjust if still colliding with nav bars

## Azure Static Web Apps Deployment

**Critical Configuration:**
- `staticwebapp.config.json` - CSP headers prevent inline scripts
- Keep `unsafe-inline` only for styles
- Workflow secret: `AZURE_STATIC_WEB_APPS_API_TOKEN_AGREEABLE_FIELD_0ABABE210` (instance-specific)
- Build preset: "Custom" with empty app_location, api_location, output_location
- `skip_app_build: true` flag set (static HTML/CSS/JS only)

**Security Note:** If deployment token is exposed:
1. Azure Portal → Static Web App → Reset deployment token
2. Update GitHub secret with new value
3. Never commit tokens to repo

**Theme Color Limitation:** Chrome on Android only applies `theme-color` over HTTPS, not localhost.

## Current Feature Set

**Implemented:**
- ✅ Splash screen with auto-advance (5s) and double-tap skip
- ✅ Welcome screen with gender selection
- ✅ Card swipe interface (touch and mouse)
- ✅ Action buttons overlaid on card corners
- ✅ Stats tracking (Liked count, Remaining count)
- ✅ Done Choosing button
- ✅ Results view with liked names list
- ✅ Review mode (re-swipe through liked names)
- ✅ Email sharing (mailto: URL)
- ✅ Text sharing (sms: URL)
- ✅ Empty state handling
- ✅ PWA support (manifest, meta tags)

**Not Implemented (Intentional):**
- ❌ Persistence (no localStorage, no backend)
- ❌ Authentication/user accounts
- ❌ Backend API
- ❌ Testing framework
- ❌ Analytics

This is a proof-of-concept. Complexity will be added in native mobile app version.

## Code Style Conventions

- No semicolons in CSS
- Constructor initializes all properties before calling `init()`
- Event listeners use arrow functions to maintain `this` binding
- Fisher-Yates shuffle in `shuffleNames()` is canonical - don't replace with `sort(Math.random())`
- No CSS transitions on `.dragging` class (causes laggy feel)
- All DOM updates in swipe handlers must complete in 500ms

## Common Pitfalls to Avoid

1. **Adding names without updating stats:** babyNames array is 110 items. Update README.md and DEVELOPMENT-SUMMARY.md if count changes.
2. **Modifying currentNames without resetting index:** Will cause off-by-one errors in card rendering.
3. **Adding CSS transitions to .dragging class:** Will create laggy swipe feel. Use `transition: none` during active drag.
4. **Async operations in swipe handlers:** All DOM updates must complete in 500ms.
5. **Shuffling without resetting index:** Always reset `currentIndex` to 0 after shuffle.
6. **Using file:// protocol:** Won't work due to CORS restrictions. Use HTTP server.

## Testing & Development

**Local Server:**
```bash
python -m http.server 8080
# Access at http://localhost:8080
```

**Mobile Testing:**
- Use ngrok or similar to test on real devices
- Or deploy to Azure to test HTTPS-only features (theme colors)
- Test "Add to Home Screen" flow on both iOS and Android

## Design System Reference

**Colors:**
- Background gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Primary accent: `#667eea` (purple)
- Pass button: `linear-gradient(135deg, #ff6b6b, #ee5a52)` (red)
- Like button: `linear-gradient(135deg, #51cf66, #37b24d)` (green)
- Boy badge: `#e3f2fd` background, `#1976d2` text
- Girl badge: `#fce4ec` background, `#c2185b` text

**Branding:**
- App name: "Bougie Babies"
- Emoji: 👶
- Tone: Friendly, modern, playful

## Areas for Future Work

**Persistence:**
- Add localStorage for liked names
- Key pattern: `baby-swiper-liked-${filter}` to maintain gender separation
- Parse/stringify in `init()` and after each swipe in `animateSwipe()`

**Enhanced Sharing:**
- Copy to clipboard fallback if no email/SMS app
- Visual confirmation when sharing

**Additional Features:**
- Name meanings/origins
- Favorites management (remove names from liked list)
- Partner mode (both users must like a name)
- Name categories beyond gender

**Native Mobile App:**
- Use this web app as design reference
- Consider React Native or Flutter
- Add offline-first architecture
- Implement proper user accounts

## Key Implementation Files

- `index.html` - All 3 views, action buttons now inside card-container
- `app.js` - BabyNameSwiper class with view navigation methods
- `styles.css` - Mobile-first responsive design
- `names-data.js` - Data source (110 names)
- `manifest.json` - PWA configuration
- `.github/copilot-instructions.md` - More technical patterns and architecture details

## Questions to Ask When Making Changes

1. Does this require updating the currentIndex?
2. Will this work on touch devices?
3. Does this maintain the 500ms animation timing?
4. Do I need to update both README.md and this file?
5. Does this preserve the existing state management pattern?
6. Will this work offline (static files only)?

---

**Current Status:** Functional MVP with 3-view flow, mobile optimization, and basic sharing features. Ready for user testing and feedback iteration.
