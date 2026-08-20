# Architectural and UX Decisions

## 1. Performance Optimizations
- **Code Splitting:** Implemented manual chunking in `vite.config.ts` to separate vendor code (`recharts`, `@supabase`, and common node_modules) from the main application bundle. This dramatically improves caching, reduces initial load times, and optimizes performance under mobile network conditions.
- **PWA Asset Caching:** Configured a localized service worker to pre-cache all core layout assets (`js`, `css`, `html`, icons) so the shell remains fully functional and accessible offline.

## 2. Accessibility & Usability (a11y)
- **Keyboard Navigation:** Ensured all reusable interactive components (like `Button` and `Input`) use semantic HTML elements and standard focus rings (`focus:ring-1 focus:ring-primary-500`).
- **Form Safety:** Implemented native HTML form validation constraints backed by client-side schema checks, keeping empty and error states consistently styled and highly readable.
- **Contrast Integrity:** Selected a high-contrast theme (Slate grey text `#213547` on a pure white background `#ffffff`, paired with deep Sky Blue accents `#0ea5e9`) to maintain readability across diverse screens.
