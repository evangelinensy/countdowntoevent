# Design System Rules for Countdown to Event

## Project Overview
This is a countdown-to-event application. Since this is a new project, these rules establish the foundation for integrating Figma designs using the Model Context Protocol.

---

## 1. Design Token Definitions

### Location
- Tokens will be defined in: `src/styles/tokens/`
  - `colors.ts` - Color palette
  - `typography.ts` - Font families, sizes, weights, line heights
  - `spacing.ts` - Spacing scale (margins, padding, gaps)
  - `shadows.ts` - Box shadow definitions
  - `borders.ts` - Border radius, widths

### Format
```typescript
// src/styles/tokens/colors.ts
export const colors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    // ... rest of scale
    900: '#0c4a6e',
  },
  neutral: {
    // grayscale
  },
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  }
} as const;
```

### Token Transformation
- Use CSS Custom Properties for runtime theming
- Export tokens as TypeScript constants for type safety
- Generate CSS variables automatically from token definitions

---

## 2. Component Library

### Location
- Components: `src/components/`
  - `ui/` - Base UI components (Button, Input, Card, etc.)
  - `features/` - Feature-specific components (CountdownTimer, EventCard, etc.)
  - `layout/` - Layout components (Header, Footer, Container, etc.)

### Component Architecture
```typescript
// Component structure example
// src/components/ui/Button/Button.tsx
import { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({ variant = 'primary', size = 'md', children, ...props }: ButtonProps) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

### Documentation
- Component props documented with TypeScript interfaces
- Usage examples in README.md within each component folder
- Consider Storybook for component playground (optional)

---

## 3. Frameworks & Libraries

### UI Framework
- **React 18+** with TypeScript
- Functional components with hooks

### Styling
- **CSS Modules** for component-scoped styles
- PostCSS for CSS processing
- CSS Custom Properties for theming

### Build System
- **Vite** - Fast build tool with HMR
- TypeScript compiler for type checking
- ESLint + Prettier for code quality

### Package Manager
- **npm** or **pnpm**

---

## 4. Asset Management

### Storage
- Static assets: `public/assets/`
  - `images/` - Static images
  - `videos/` - Video files
  - `fonts/` - Custom font files

### Optimization
- Use WebP format for images with fallbacks
- Lazy load images with native loading="lazy"
- Compress assets during build with Vite plugins

### Asset References
```typescript
// Import assets in components
import eventImage from '@/assets/images/event-hero.webp';

<img src={eventImage} alt="Event" loading="lazy" />
```

### CDN (Optional)
- For production, consider hosting assets on Cloudflare or similar CDN

---

## 5. Icon System

### Location
- Icons: `src/components/icons/` or use icon library

### Approach
Option 1 - SVG Components:
```typescript
// src/components/icons/ClockIcon.tsx
export const ClockIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="..." stroke={color} strokeWidth="2" />
  </svg>
);
```

Option 2 - Icon Library:
- Use **lucide-react** or **heroicons** for consistent icon set
- Import: `import { Clock, Calendar } from 'lucide-react';`

### Naming Convention
- PascalCase with "Icon" suffix: `ClockIcon`, `CalendarIcon`
- Match Figma layer names when possible

---

## 6. Styling Approach

### CSS Methodology
- **CSS Modules** for component styles
- BEM-like naming within modules for clarity
- Utility classes for common patterns

### File Structure
```
src/components/ui/Button/
├── Button.tsx
├── Button.module.css
├── Button.test.tsx
└── index.ts
```

### CSS Module Example
```css
/* Button.module.css */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  transition: all 0.2s ease;
}

.primary {
  background-color: var(--color-primary-600);
  color: var(--color-white);
}

.primary:hover {
  background-color: var(--color-primary-700);
}
```

### Global Styles
- Location: `src/styles/globals.css`
- Includes: CSS reset, CSS custom properties, base typography

### Responsive Design
- Mobile-first approach
- Breakpoints defined in `src/styles/tokens/breakpoints.ts`:
```typescript
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;
```

- Use CSS custom media queries or container queries where appropriate

---

## 7. Project Structure

```
countdowntoevent/
├── public/
│   └── assets/
│       ├── images/
│       ├── videos/
│       └── fonts/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── features/        # Feature-specific components
│   │   ├── layout/          # Layout components
│   │   └── icons/           # Icon components
│   ├── styles/
│   │   ├── tokens/          # Design tokens
│   │   ├── globals.css      # Global styles
│   │   └── utils.css        # Utility classes
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript type definitions
│   ├── pages/               # Page components
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .eslintrc.json
└── CLAUDE.md               # This file
```

---

## Figma Integration Guidelines

### When Importing from Figma:

1. **Extract Design Tokens First**
   - Colors, typography, spacing from Figma variables
   - Map to token files in `src/styles/tokens/`

2. **Component Mapping**
   - Figma component name → React component
   - Maintain consistent naming: `Button/Primary` in Figma → `Button variant="primary"` in React

3. **Assets**
   - Export images as WebP (with PNG fallback)
   - Export SVG icons with clean paths
   - Place in appropriate `public/assets/` subdirectory

4. **Spacing & Layout**
   - Use Figma auto-layout properties to inform flexbox/grid
   - Extract padding, gap, and margin values to spacing tokens

5. **Typography**
   - Map Figma text styles to CSS classes
   - Create corresponding TypeScript types for variants

6. **Colors**
   - Export color styles from Figma
   - Maintain semantic naming (primary, secondary, success, etc.)
   - Create both light and dark mode variants if applicable

---

## Best Practices

1. **Type Safety**: All components, tokens, and props should be fully typed
2. **Accessibility**: Use semantic HTML, ARIA labels, keyboard navigation
3. **Performance**: Code-split routes, lazy load components, optimize images
4. **Consistency**: Match Figma design tokens exactly - no magic numbers
5. **Scalability**: Design components for reuse and composition
6. **Documentation**: Document complex logic and component APIs

---

## Notes for Claude Code

When implementing designs from Figma:
- Always create/update design tokens first
- Build UI components in isolation before integrating
- Maintain component/Figma layer name parity
- Extract and reuse common patterns
- Ask for clarification on interactive states if not specified in Figma
- Preserve accessibility features in implementation