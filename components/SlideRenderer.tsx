import React from 'react';
import { SlideElement } from '../types/presentation-schema';
import { SlideText, SlideImage, SlideChart, SlideShape, SlideTable } from './elements';
import { motion } from 'framer-motion';

const ElementWrapper: React.FC<{ element: SlideElement; children: React.ReactNode }> = ({ element, children }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: element.animation?.duration ? element.animation.duration / 1000 : 0.5,
        delay: element.animation?.delay ? element.animation.delay / 1000 : 0,
        ease: element.animation?.ease || 'easeOut'
      }}
      style={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        zIndex: element.zIndex,
        rotate: element.rotation,
      }}
    >
      {children}
    </motion.div>
);

const ElementFactory: React.FC<{ element: SlideElement }> = ({ element }) => {
  switch (element.type) {
    case 'text':
      return <ElementWrapper element={element}><SlideText config={element} /></ElementWrapper>;
    case 'image':
      return <ElementWrapper element={element}><SlideImage config={element} /></ElementWrapper>;
    case 'chart':
      return <ElementWrapper element={element}><SlideChart config={element} /></ElementWrapper>;
    case 'shape':
      return <ElementWrapper element={element}><SlideShape config={element} /></ElementWrapper>;
    case 'table':
        return <ElementWrapper element={element}><SlideTable config={element} /></ElementWrapper>;
    default:
      return null;
  }
};

export const SlideRenderer = ({ elements }: { elements: SlideElement[] }) => {
  return (
    <div className="w-full h-full relative overflow-hidden bg-transparent">
      {elements.map((el) => (
        <ElementFactory key={el.id} element={el} />
      ))}
    </div>
  );
};