import { create } from 'zustand';
import { Slide, SlideElement } from '../types';

interface SlideState {
  slides: Slide[];
  currentSlideIndex: number;
  selectedElementIds: string[];
  
  // Canvas Viewport
  scale: number;
  pan: { x: number; y: number };
  
  // Editing State
  editingElementId: string | null; // The ID of the text box currently being edited (Active Mode)

  // Actions
  setSlides: (slides: Slide[]) => void;
  setCurrentSlideIndex: (index: number) => void;
  
  addSlide: () => void;
  removeSlide: (id: string) => void;

  addElement: (type: 'text' | 'image' | 'shape') => void;
  updateElement: (id: string, updates: Partial<SlideElement>) => void;
  removeElement: (id: string) => void;
  
  setSelectedElementIds: (ids: string[]) => void;
  setEditingElementId: (id: string | null) => void;
  
  setScale: (scale: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  
  // Z-Index helpers
  bringToFront: () => void;
  sendToBack: () => void;
}

const DEFAULT_SLIDE: Slide = {
  id: 'slide-1',
  background: '#ffffff',
  elements: []
};

export const useSlideStore = create<SlideState>((set, get) => ({
  slides: [DEFAULT_SLIDE],
  currentSlideIndex: 0,
  selectedElementIds: [],
  scale: 1,
  pan: { x: 0, y: 0 },
  editingElementId: null,

  setSlides: (slides) => set({ slides }),
  setCurrentSlideIndex: (index) => set({ currentSlideIndex: index, selectedElementIds: [] }),

  setSelectedElementIds: (ids) => set({ selectedElementIds: ids }),
  setEditingElementId: (id) => set({ editingElementId: id }),
  
  setScale: (scale) => set({ scale }),
  setPan: (pan) => set({ pan }),

  addSlide: () => {
    set((state) => {
      const newSlide: Slide = {
        id: `slide-${Date.now()}`,
        background: '#ffffff',
        elements: []
      };
      return { 
        slides: [...state.slides, newSlide],
        currentSlideIndex: state.slides.length // Select the new slide
      };
    });
  },

  removeSlide: (id) => {
    set((state) => {
      // Prevent deleting the last slide if you want to enforce at least one slide
      if (state.slides.length <= 1) return {};
      
      const newSlides = state.slides.filter(s => s.id !== id);
      // Adjust index if we deleted the current slide or a slide before it
      // Simple logic: if current index is out of bounds, clap it.
      let newIndex = state.currentSlideIndex;
      if (newIndex >= newSlides.length) {
        newIndex = newSlides.length - 1;
      }
      
      return { 
        slides: newSlides, 
        currentSlideIndex: newIndex,
        selectedElementIds: [] 
      };
    });
  },

  addElement: (type) => {
    set((state) => {
      const currentSlide = state.slides[state.currentSlideIndex];
      const newElement: SlideElement = {
        id: `el-${Date.now()}`,
        type,
        x: 100,
        y: 100,
        width: type === 'text' ? 400 : 200,
        height: type === 'text' ? 100 : 200,
        rotation: 0,
        zIndex: currentSlide.elements.length + 1,
        opacity: 1,
        content: type === 'text' 
          ? { html: '<p>Double click to edit</p>', json: null } 
          : { src: '', alt: '' },
        style: type === 'shape' ? { backgroundColor: '#3b82f6' } : {}
      };

      const updatedSlides = [...state.slides];
      updatedSlides[state.currentSlideIndex] = {
        ...currentSlide,
        elements: [...currentSlide.elements, newElement]
      };

      return { 
        slides: updatedSlides,
        selectedElementIds: [newElement.id]
      };
    });
  },

  updateElement: (id, updates) => {
    set((state) => {
      const updatedSlides = [...state.slides];
      const currentSlide = updatedSlides[state.currentSlideIndex];
      
      currentSlide.elements = currentSlide.elements.map(el => 
        el.id === id ? { ...el, ...updates } : el
      );

      return { slides: updatedSlides };
    });
  },

  removeElement: (id) => {
    set((state) => {
        const updatedSlides = [...state.slides];
        const currentSlide = updatedSlides[state.currentSlideIndex];
        currentSlide.elements = currentSlide.elements.filter(el => el.id !== id);
        return { slides: updatedSlides, selectedElementIds: [] };
    });
  },

  bringToFront: () => {
    set((state) => {
      const ids = state.selectedElementIds;
      if (ids.length === 0) return {};
      
      const updatedSlides = [...state.slides];
      const currentSlide = updatedSlides[state.currentSlideIndex];
      let elements = [...currentSlide.elements];
      
      // Separate selected and unselected
      const selected = elements.filter(el => ids.includes(el.id));
      const unselected = elements.filter(el => !ids.includes(el.id));
      
      // Re-assign z-indices based on new order
      const reordered = [...unselected, ...selected];
      const final = reordered.map((el, index) => ({ ...el, zIndex: index + 1 }));
      
      updatedSlides[state.currentSlideIndex] = { ...currentSlide, elements: final };
      return { slides: updatedSlides };
    });
  },

  sendToBack: () => {
    set((state) => {
      const ids = state.selectedElementIds;
      if (ids.length === 0) return {};
      
      const updatedSlides = [...state.slides];
      const currentSlide = updatedSlides[state.currentSlideIndex];
      let elements = [...currentSlide.elements];
      
      const selected = elements.filter(el => ids.includes(el.id));
      const unselected = elements.filter(el => !ids.includes(el.id));
      
      const reordered = [...selected, ...unselected];
      const final = reordered.map((el, index) => ({ ...el, zIndex: index + 1 }));
      
      updatedSlides[state.currentSlideIndex] = { ...currentSlide, elements: final };
      return { slides: updatedSlides };
    });
  }
}));