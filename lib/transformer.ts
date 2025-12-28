import { Project, Slide, SlideElement } from '../types';
import { PresentationConfig, SlideElement as SchemaElement } from '../types/presentation-schema';

export const convertPresentationToProject = (config: PresentationConfig): Project => {
  return {
    id: Math.random().toString(36).substr(2, 9),
    title: config.title,
    description: `Generated from AI`,
    type: 'AI',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDeleted: false,
    slides: config.slides.map(convertSlide)
  };
};

const convertSlide = (slideConfig: any): Slide => {
  return {
    id: slideConfig.id,
    background: slideConfig.background?.startsWith('theme.') ? '#ffffff' : (slideConfig.background || '#ffffff'), // Simplified for now, editor handles theme tokens differently or needs conversion
    notes: slideConfig.notes,
    elements: slideConfig.elements.map(convertElement)
  };
};

const convertElement = (el: SchemaElement): SlideElement => {
  const base = {
    id: el.id,
    x: el.x,
    y: el.y,
    width: el.width,
    height: el.height,
    rotation: el.rotation || 0,
    zIndex: el.zIndex || 1,
    opacity: 1,
  };

  if (el.type === 'text') {
    return {
      ...base,
      type: 'text',
      styleToken: el.style as any,
      content: {
        html: el.content,
        json: null // Editor will parse HTML on load
      },
      style: {
        color: el.color?.startsWith('theme.') ? undefined : el.color
      }
    };
  }

  if (el.type === 'image') {
    return {
      ...base,
      type: 'image',
      content: {
        src: el.src,
        alt: el.alt
      },
      style: {
        borderRadius: el.borderRadius
      }
    };
  }

  if (el.type === 'shape') {
    return {
      ...base,
      type: 'shape',
      content: {},
      style: {
        backgroundColor: el.fill?.startsWith('theme.') ? '#3b82f6' : el.fill, // Fallback for tokens in raw style
        borderColor: el.stroke?.startsWith('theme.') ? '#000000' : el.stroke,
        borderWidth: el.strokeWidth
      }
    };
  }
  
  if (el.type === 'chart') {
      // Temporary fallback for chart in editor as it is not fully supported in editor types yet
      return {
          ...base,
          type: 'shape', 
          content: {},
          style: {
              backgroundColor: '#1e293b'
          }
      }
  }

  // Fallback
  return {
      ...base,
      type: 'shape',
      content: {},
      style: { backgroundColor: '#ccc' }
  };
};