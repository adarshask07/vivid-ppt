# @vivid/slides-react

Production-grade React components for rendering AI-generated presentations with streaming support.

## Features

- 🎨 **Beautiful Rendering** - High-fidelity slide rendering with animations
- 🌊 **Streaming Support** - Real-time slide generation from AI
- 📤 **Export Ready** - PPTX and PDF export out of the box
- 🎯 **Fully Typed** - Complete TypeScript support
- 🧩 **Modular** - Use only what you need
- 🎭 **Themeable** - Customize colors, fonts, and styles

## Installation

```bash
npm install @vivid/slides-react
# or
pnpm add @vivid/slides-react
# or
yarn add @vivid/slides-react
```

## Quick Start

```tsx
import { VividProvider, SlideViewer, SlideRail } from '@vivid/slides-react';

function App() {
  const presentation = {
    metadata: { title: 'My Presentation' },
    theme: { /* ... */ },
    slides: [ /* ... */ ]
  };

  return (
    <VividProvider presentation={presentation}>
      <div className="flex h-screen">
        <SlideRail className="w-48" />
        <SlideViewer className="flex-1" />
      </div>
    </VividProvider>
  );
}
```

## Theming

The package uses **CSS custom properties (variables)** for styling, with sensible fallbacks. This means components will work out of the box and automatically adapt to your application's theme.

### CSS Variables

Define these CSS variables in your app to customize the look:

```css
:root {
  /* Primary colors */
  --vivid-primary: #3b82f6;
  --vivid-primary-hover: #2563eb;
  
  /* Surfaces */
  --vivid-background: #0f172a;
  --vivid-surface: #1e293b;
  --vivid-surface-hover: #334155;
  --vivid-border: #334155;
  
  /* Text */
  --vivid-text-primary: #f8fafc;
  --vivid-text-secondary: #94a3b8;
  --vivid-text-muted: #64748b;
  
  /* Typography */
  --vivid-font-body: system-ui, -apple-system, sans-serif;
  --vivid-font-heading: system-ui, -apple-system, sans-serif;
  
  /* Spacing & Radius */
  --vivid-radius-sm: 4px;
  --vivid-radius-md: 8px;
  --vivid-radius-lg: 12px;
}
```

### Light Theme Example

```css
:root {
  --vivid-primary: #3b82f6;
  --vivid-background: #ffffff;
  --vivid-surface: #f1f5f9;
  --vivid-surface-hover: #e2e8f0;
  --vivid-border: #e2e8f0;
  --vivid-text-primary: #0f172a;
  --vivid-text-secondary: #475569;
  --vivid-text-muted: #94a3b8;
}
```

### Using with Tailwind CSS

If you're using Tailwind, you can map your theme colors:

```css
:root {
  --vivid-primary: theme('colors.blue.500');
  --vivid-background: theme('colors.slate.900');
  --vivid-surface: theme('colors.slate.800');
  --vivid-text-primary: theme('colors.slate.50');
}
```
```

## Streaming from AI

```tsx
import { VividProvider, SlideViewer, useSlideStream } from '@vivid/slides-react';

function AIPresentation({ prompt }) {
  const { startStream, status, progress } = useSlideStream();

  useEffect(() => {
    const generator = myAiService.generatePresentation(prompt);
    startStream(generator);
  }, [prompt]);

  return (
    <VividProvider>
      <SlideViewer />
    </VividProvider>
  );
}
```

## Components

| Component | Description |
|-----------|-------------|
| `<VividProvider>` | Root context provider |
| `<SlideViewer>` | Main slide renderer |
| `<SlideRail>` | Thumbnail navigation |
| `<SlideControls>` | Navigation buttons |
| `<ExportButton>` | Export to PPTX/PDF |
| `<StreamingIndicator>` | Generation progress |

## Hooks

| Hook | Description |
|------|-------------|
| `useVivid()` | Main context access |
| `useSlideStream()` | Streaming generation |
| `useExport()` | Export functionality |
| `useSlideNavigation()` | Navigation controls |
| `useTheme()` | Theme access |

## Documentation

For full documentation, visit [docs link].

## License

MIT
