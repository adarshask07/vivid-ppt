# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2024-12-28

### Added

- 🎉 Initial release
- **Core Components**
  - `VividProvider` - Root context provider for state management
  - `SlideViewer` - Main slide rendering component with navigation
  - `SlideRail` - Thumbnail navigation sidebar
  - `ExportButton` - Export dropdown with multiple format options
  - `StreamingIndicator` - Shows streaming generation progress
  - `SlideRenderer` - Low-level slide rendering component

- **Element Components**
  - `TextElement` - Rich text with formatting
  - `ImageElement` - Images with fit modes
  - `ShapeElement` - Rectangles, circles, lines
  - `ChartElement` - Bar, line, pie, donut charts
  - `TableElement` - Data tables with headers
  - `ListElement` - Bulleted and numbered lists
  - `MetricElement` - KPI/metric displays
  - `ProgressElement` - Progress bars
  - `CalloutElement` - Callout/info boxes
  - `DividerElement` - Horizontal/vertical dividers
  - `IconElement` - Icon displays
  - `CodeElement` - Syntax-highlighted code blocks

- **Hooks**
  - `useVividContext()` - Access main context
  - `useSlideStream()` - Handle streaming generation
  - `useKeyboardNavigation()` - Keyboard controls

- **Export Capabilities**
  - PPTX export via pptxgenjs
  - PDF export via jspdf + modern-screenshot
  - PNG export via modern-screenshot
  - JSON export for data backup

- **Theming**
  - CSS custom properties for styling
  - Works with any design system
  - Light and dark theme support
  - Tailwind CSS integration

- **Streaming Support**
  - Real-time slide generation from AI/LLM
  - Progress tracking
  - Error handling

### Technical Details

- Built with React 18+ and TypeScript
- Tree-shakeable ESM and CJS bundles
- Full TypeScript definitions
- Zero runtime CSS (uses CSS variables with inline fallbacks)
