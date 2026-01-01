# Bougie Babies - Development Summary

## Project Overview
A mobile-first web application that provides a Tinder-style swipe interface for browsing baby names. Built with vanilla JavaScript, HTML, and CSS with zero dependencies.

## What We Built

### Multi-View Application Flow
Transformed a single-page swiper into a complete 3-view user experience:

**View 1: Onboarding**
- **Splash Screen (1.1)**: Displays "Bougie Babies" branding
  - Auto-advances after 5 seconds
  - Or skip immediately with double-tap
- **Welcome Screen (1.2)**: Explains the app and presents gender filter options
  - Boy Names / Girl Names / Whatever (all)
  - User choice determines which names appear in swipe view

**View 2: Swipe Interface**
- Card-based swipe interface with touch and mouse support
- Swipe right to like, left to pass
- Action buttons overlaid on card corners (❌ bottom-left, ❤️ bottom-right)
- Real-time stats: Liked count and Remaining count
- "Done Choosing" button to proceed when finished

**View 3: Results**
- Displays list of all liked names
- Three action buttons:
  - **Review Names**: Swipe through liked names again (or restart if none liked)
  - **Email**: Opens default mail client with name list
  - **Text**: Opens SMS with name list

### Key Features Implemented

**Mobile-First Design**
- Responsive layout optimized for mobile devices
- PWA-ready with web app manifest
- Full-screen mode on iOS/Android when added to home screen
- Theme colors for mobile browser chrome
- Safe area handling for notched devices
- Bottom margin spacing to avoid Android navigation bars

**Interaction Design**
- Unified touch/mouse event handling
- 100px swipe threshold for gesture recognition
- Visual swipe indicators during drag
- Smooth card animations (500ms transitions)
- Card stacking effect (renders 3 cards with depth)
- Only top card is interactive (`.top-card`)

**Data Management**
- 110 baby names total (50 boys, 60 girls)
- Fisher-Yates shuffle algorithm for randomization
- State preserved through view transitions
- Gender filter locks when entering swipe view
- Liked names accumulate across session (resets on page refresh)

**Smart Navigation**
- View state management with `currentView` tracking
- Review mode differentiates from initial swipe mode
- Empty state handling when all names are swiped
- Returns to results after reviewing liked names

## Technical Architecture

**Single-Class Pattern**
- `BabyNameSwiper` class manages entire application
- Direct DOM manipulation (no framework)
- Manual state management with class properties

**Critical State Variables**
- `allNames[]` - Immutable source from names-data.js
- `currentNames[]` - Filtered/shuffled working set (mutated on filter change)
- `likedNames[]` - Accumulator for right-swipe actions
- `currentIndex` - Pointer into currentNames (resets on filter change)
- `currentView` - Tracks which view is displayed
- `isReviewing` - Boolean flag to differentiate review mode from initial swipe

**File Loading Requirements**
```html
<script src="names-data.js"></script>  <!-- MUST load first -->
<script src="app.js"></script>         <!-- Expects babyNames global -->
```

**Rendering Pattern**
- Z-index card stacking with absolute positioning
- Always renders 3 cards for depth perception
- Scale decreases: 1.0, 0.95, 0.90
- Transform applied for stacking effect

**Event Handling**
- Touch and mouse events use same handlers
- Touch events require `e.preventDefault()` to avoid scroll conflicts
- Pattern: `const touch = e.type.includes('touch') ? e.touches[0] : e;`

## Design System

**Color Palette**
- Primary gradient: `#667eea` to `#764ba2` (purple)
- Accent color: `#667eea` (purple)
- Pass button: Red gradient (`#ff6b6b` to `#ee5a52`)
- Like button: Green gradient (`#51cf66` to `#37b24d`)
- Theme color for mobile browsers: `#667eea`

**Typography**
- System font stack for native feel
- Splash title: 4rem bold
- Card name: 3rem bold
- Headers: 2.5rem

**Spacing & Layout**
- Container max-width: 500px
- Card container height: 400px
- Action buttons: 60px × 60px circles
- Done button bottom margin: 20px (accommodates Android nav bars)

## Development Workflow

**Local Testing**
```bash
python -m http.server 8080
# Access at http://localhost:8080
# File:// protocol won't work due to CORS restrictions
```

**Deployment**
- Azure Static Web Apps via GitHub Actions
- Workflow file: `.github/workflows/azure-static-web-apps-agreeable-field-0ababe210.yml`
- Secret: `AZURE_STATIC_WEB_APPS_API_TOKEN_AGREEABLE_FIELD_0ABABE210`
- Build preset: Custom (static HTML, no build step)

## Current Limitations

**No Persistence**
- Liked names reset on page refresh
- No localStorage or backend database
- Proof-of-concept only

**Share Functionality**
- Email/text use `mailto:` and `sms:` URL schemes
- Requires default apps configured on device
- No server-side sharing or clipboard fallback

**Browser Requirements**
- Chrome address bar theming only works over HTTPS (not localhost)
- Full-screen mode requires "Add to Home Screen"
- Modern browser with ES6, CSS Grid, Flexbox, and Touch Events

## Files Structure

```
.
├── index.html              # Main HTML with all 3 views
├── styles.css              # Complete styling including mobile
├── app.js                  # BabyNameSwiper class
├── names-data.js           # 110 baby names data
├── manifest.json           # PWA manifest
├── staticwebapp.config.json # Azure config with CSP headers
└── .github/
    ├── copilot-instructions.md  # AI agent guidance
    └── workflows/
        └── azure-static-web-apps-*.yml
```

## Code Conventions

- No semicolons in CSS
- Constructor initializes all properties before calling `init()`
- Event listeners use arrow functions for `this` binding
- Fisher-Yates is canonical - don't replace with `Math.random()` sort
- All swipe animations complete in 500ms
- Never shuffle without resetting `currentIndex`
- No CSS transitions on `.dragging` class (causes lag)

## Recent Changes

1. ✅ Added 3-view navigation system
2. ✅ Implemented splash screen with auto-advance and double-tap
3. ✅ Created welcome screen with gender selection
4. ✅ Added results view with review/email/text options
5. ✅ Moved action buttons to overlay on card corners
6. ✅ Added PWA support with manifest and mobile meta tags
7. ✅ Optimized spacing for Android navigation bars
8. ✅ Implemented review mode for liked names
9. ✅ Added user feedback for empty share actions

## Known Issues

- Theme color in Chrome mobile only works over HTTPS
- Done button may still overlap on some Android devices
- No visual feedback when sharing (relies on OS handling)

---

**Status**: Functional POC ready for user testing and feedback
**Next Steps**: Consider localStorage persistence, improved share options, or transition to native mobile app
