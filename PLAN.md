# AI Presentation Builder - Production App Plan

## Vision

Build a real-time AI-powered presentation generator where users write a prompt, navigate to a generation page, and watch slides appear one by one as they're "generated" by the LLM, with full editing capabilities afterward.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              User Flow                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   [Home] → [Enter Prompt] → [Generation Studio] → [Editor]              │
│                                    │                                     │
│                         Slides appear live                               │
│                         one by one with                                  │
│                         animations                                       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Implementation Steps

### Step 1: Create AI Generation Stream Service

**File:** `services/AiStreamService.ts`

**Purpose:** Mock streaming service that simulates LLM response, yielding slides one at a time with realistic delays.

**Key Features:**
- Async generator function `generatePresentationStream(prompt: string)`
- Yields `Slide` objects one at a time
- Configurable delays between slides (1-3 seconds)
- Returns metadata (title, theme) first, then slides
- Supports cancellation via AbortController

**Interface:**
```typescript
interface GenerationEvent {
  type: 'metadata' | 'slide' | 'complete' | 'error';
  data: PresentationMetadata | Slide | Error;
  progress: number; // 0-100
}

async function* generatePresentationStream(
  prompt: string,
  options?: { signal?: AbortSignal }
): AsyncGenerator<GenerationEvent>
```

---

### Step 2: Build Real-time Generation Page

**File:** `components/GenerationStudio.tsx`

**Purpose:** Full-screen immersive experience showing slides appearing live.

**UI Components:**
```
┌─────────────────────────────────────────────────────────────────┐
│  [Back]                                          [Cancel]        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│     "Creating your presentation..."                              │
│     ════════════════════░░░░░░░░░░  60%                         │
│                                                                  │
│     ┌─────────────────────────────────────────┐                 │
│     │                                         │                 │
│     │         Currently generating            │                 │
│     │         slide preview with              │                 │
│     │         fade-in animation               │                 │
│     │                                         │                 │
│     └─────────────────────────────────────────┘                 │
│                                                                  │
│     Slide 3 of 5                                                │
│                                                                  │
│     ┌───┐ ┌───┐ ┌───┐ ┌ ─ ┐ ┌ ─ ┐                              │
│     │ ✓ │ │ ✓ │ │ ● │ │   │ │   │  Thumbnail rail              │
│     └───┘ └───┘ └───┘ └ ─ ┘ └ ─ ┘                              │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  Your prompt: "Create a pitch deck for a SaaS startup..."       │
└─────────────────────────────────────────────────────────────────┘
```

**States:**
1. `generating` - Slides appearing one by one
2. `complete` - All slides ready, show "Edit Presentation" CTA
3. `error` - Show retry option

---

### Step 3: Create Slide Stream Orchestrator

**File:** `hooks/useSlideGeneration.ts`

**Purpose:** Manage generation state machine and slide accumulation.

**State Machine:**
```
idle → generating → complete
           ↓
         error → idle (retry)
```

**Hook Interface:**
```typescript
interface UseSlideGenerationReturn {
  // State
  status: 'idle' | 'generating' | 'complete' | 'error';
  slides: Slide[];
  metadata: PresentationMetadata | null;
  progress: number;
  currentSlideIndex: number;
  error: Error | null;
  
  // Actions
  startGeneration: (prompt: string) => void;
  cancelGeneration: () => void;
  retry: () => void;
  reset: () => void;
}
```

---

### Step 4: Integrate with Project System

**File:** `context/ProjectContext.tsx` (update)

**Changes:**
1. Add `createProjectFromGeneration(metadata, slides)` method
2. Sync generated slides with `useSlideStore`
3. Add `generationInProgress` state to prevent navigation conflicts

**New Methods:**
```typescript
interface ProjectContextType {
  // ... existing methods
  
  // New methods for AI generation
  createProjectFromGeneration: (
    metadata: PresentationMetadata,
    slides: Slide[]
  ) => string; // Returns new project ID
  
  generationInProgress: boolean;
  setGenerationInProgress: (value: boolean) => void;
}
```

---

### Step 5: Build Transition to Editor Flow

**Purpose:** Smooth transition from generation view to editor.

**Flow:**
```
[Generation Complete]
        ↓
[User clicks "Edit Presentation"]
        ↓
[createProjectFromGeneration() called]
        ↓
[useSlideStore.setSlides() initialized]
        ↓
[navigate to EditorLayout]
        ↓
[Slides pre-loaded and ready to edit]
```

**Animations:**
- Slide canvas zooms out during transition
- Editor UI fades in from sides
- Toolbar slides down from top

---

### Step 6: Enhance Editor for AI-generated Content

**Files to Update:**
- `components/editor/SlideCanvas.tsx`
- `components/editor/PropertiesPanel.tsx`
- `store/useSlideStore.ts`

**New Element Support:**

| Element Type | Rendering | Editing Method |
|--------------|-----------|----------------|
| `text` | TextElement | TipTap editor |
| `image` | ImageElement | Property panel (src, alt, fit) |
| `shape` | ShapeElement | Property panel (fill, stroke) |
| `chart` | ChartElement | Property panel (data, type) |
| `table` | TableElement | Inline cell editing |
| `list` | ListElement | TipTap with list extension |
| `metric` | MetricElement | Property panel (value, label) |
| `progress` | ProgressElement | Property panel (value, variant) |
| `callout` | CalloutElement | TipTap for content |
| `code` | CodeElement | Monaco/CodeMirror editor |
| `divider` | DividerElement | Property panel |
| `icon` | IconElement | Icon picker dialog |

---

## File Structure (New Files)

```
vivid---ai-presentation-builder/
├── services/
│   ├── AiService.ts          (existing)
│   └── AiStreamService.ts    (NEW - streaming mock)
│
├── hooks/
│   ├── useThemeStyles.ts     (existing)
│   └── useSlideGeneration.ts (NEW - generation orchestrator)
│
├── components/
│   ├── GenerationStudio.tsx  (NEW - live generation page)
│   ├── GenerationProgress.tsx(NEW - progress UI component)
│   └── slides/               (existing - element renderers)
│
├── data/
│   ├── mockPresentation.ts   (existing)
│   ├── samplePresentation.ts (existing)
│   └── mockPromptResponses.ts(NEW - mock LLM responses)
│
└── types/
    ├── slide-schema.ts       (existing)
    └── generation.ts         (NEW - generation types)
```

---

## Mock Data Strategy

Since we don't have an API key, create realistic mock responses:

**File:** `data/mockPromptResponses.ts`

```typescript
const MOCK_RESPONSES: Record<string, Presentation> = {
  'pitch deck': pitchDeckPresentation,
  'quarterly report': quarterlyReportPresentation,
  'product launch': productLaunchPresentation,
  'educational': educationalPresentation,
  // ... more templates
};

// Fuzzy match user prompt to closest template
function matchPromptToMock(prompt: string): Presentation
```

---

## Technical Decisions

### 1. Streaming Architecture
**Decision:** Use async generators (not WebSockets)

**Reasoning:**
- Simpler implementation for mock data
- Easy to replace with real API later (fetch + ReadableStream)
- No server infrastructure needed

### 2. State Persistence
**Decision:** Persist generation progress to localStorage

**Reasoning:**
- Users can refresh without losing progress
- Resume interrupted generations
- Key: `vivid_generation_progress`

### 3. Element Editing Strategy

| Element Type | Editor Component |
|--------------|------------------|
| Rich text (text, list, callout) | TipTap with extensions |
| Data (chart, table) | Custom property panel |
| Visual (shape, icon, divider) | Property panel + presets |
| Media (image, video) | Upload dialog + property panel |
| Code | Monaco Editor (lightweight) |

---

## UI/UX Guidelines

### Generation Page
- **Dark, immersive background** - Focus on content
- **Ambient animations** - Subtle glows, particles
- **Progress feels fast** - Even with delays, show activity
- **Preview is interactive** - Users can click generated slides

### Transitions
- **Generation → Editor:** 500ms with slide scale animation
- **Slide appearing:** 300ms fade-in with slight scale
- **Error state:** Shake animation + red accent

### Accessibility
- Announce slide completion via aria-live
- Keyboard navigation in thumbnail rail
- High contrast mode support

---

## Future Enhancements (Post-MVP)

1. **Real LLM Integration**
   - OpenAI GPT-4 / Anthropic Claude
   - Streaming responses via SSE
   - Prompt templates and refinement

2. **Collaboration**
   - Real-time editing with Yjs
   - Comments and suggestions
   - Version history

3. **Export Options**
   - PDF export
   - PowerPoint (.pptx) export
   - HTML embed code
   - Video export (slides + transitions)

4. **Advanced Editing**
   - Drag-and-drop element reordering
   - Undo/redo stack
   - Copy/paste elements
   - Snap-to-grid alignment

5. **AI Enhancements**
   - "Improve this slide" suggestions
   - Auto-layout optimization
   - Image generation for placeholders
   - Speaker notes generation

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Generation time (5 slides) | < 10 seconds (mock) |
| Time to first slide | < 2 seconds |
| Editor load time | < 500ms |
| Smooth animations | 60fps |
| Accessibility score | WCAG AA |

---

## Next Steps

1. ✅ Define plan (this document)
2. ⬜ Implement `AiStreamService.ts`
3. ⬜ Implement `useSlideGeneration.ts`
4. ⬜ Build `GenerationStudio.tsx`
5. ⬜ Update `ProjectContext.tsx`
6. ⬜ Connect editor to new schema
7. ⬜ Test full flow
8. ⬜ Polish animations and UX
