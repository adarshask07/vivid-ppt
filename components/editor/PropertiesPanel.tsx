import React from 'react';
import { useSlideStore } from '../../store/useSlideStore';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { 
  BringToFront, SendToBack, Type, Trash2
} from 'lucide-react';

const PropertiesPanel: React.FC = () => {
  const { 
      slides, 
      currentSlideIndex, 
      selectedElementIds, 
      updateElement, 
      removeElement,
      bringToFront, 
      sendToBack 
  } = useSlideStore();

  const currentSlide = slides[currentSlideIndex];
  const selectedElement = currentSlide?.elements.find(el => el.id === selectedElementIds[0]);

  if (!selectedElement) {
      return (
          <div className="w-64 bg-card border-l border-border p-4">
              <div className="text-sm text-muted-foreground text-center mt-10">
                  Select an element to edit properties
              </div>
          </div>
      );
  }

  return (
    <div className="w-72 bg-card border-l border-border flex flex-col h-full overflow-y-auto custom-scrollbar">
        <div className="p-3 border-b border-border">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Properties</span>
        </div>
        
        <div className="p-4 space-y-6">
            
            {/* Layout / Z-Index */}
            <div className="space-y-3">
                 <h4 className="text-xs font-medium text-muted-foreground">Arrangement</h4>
                 <div className="grid grid-cols-2 gap-2">
                     <Button variant="outline" size="sm" className="h-8 text-xs font-normal" onClick={bringToFront}>
                        <BringToFront className="w-3 h-3 mr-2" /> Front
                     </Button>
                     <Button variant="outline" size="sm" className="h-8 text-xs font-normal" onClick={sendToBack}>
                        <SendToBack className="w-3 h-3 mr-2" /> Back
                     </Button>
                 </div>
            </div>

            {/* Transform */}
            <div className="space-y-4 pt-4 border-t border-border">
                <h4 className="text-sm font-medium">Transform</h4>
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">X</Label>
                        <Input 
                            type="number" 
                            className="h-7 text-xs px-2 bg-secondary/20" 
                            value={Math.round(selectedElement.x)} 
                            onChange={(e) => updateElement(selectedElement.id, { x: parseInt(e.target.value) })}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Y</Label>
                        <Input 
                            type="number" 
                            className="h-7 text-xs px-2 bg-secondary/20" 
                            value={Math.round(selectedElement.y)}
                            onChange={(e) => updateElement(selectedElement.id, { y: parseInt(e.target.value) })}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">W</Label>
                        <Input 
                            type="number" 
                            className="h-7 text-xs px-2 bg-secondary/20" 
                            value={Math.round(selectedElement.width)}
                            onChange={(e) => updateElement(selectedElement.id, { width: parseInt(e.target.value) })}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">H</Label>
                        <Input 
                            type="number" 
                            className="h-7 text-xs px-2 bg-secondary/20" 
                            value={Math.round(selectedElement.height)}
                            onChange={(e) => updateElement(selectedElement.id, { height: parseInt(e.target.value) })}
                        />
                    </div>
                    <div className="space-y-1 col-span-2">
                        <Label className="text-[10px] text-muted-foreground">Rotation (°)</Label>
                        <Input 
                            type="number" 
                            className="h-7 text-xs px-2 bg-secondary/20" 
                            value={Math.round(selectedElement.rotation)}
                            onChange={(e) => updateElement(selectedElement.id, { rotation: parseInt(e.target.value) })}
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-border">
                <Button variant="destructive" className="w-full gap-2" size="sm" onClick={() => removeElement(selectedElement.id)}>
                    <Trash2 className="w-4 h-4" /> Delete Element
                </Button>
            </div>
        </div>
    </div>
  );
};

export default PropertiesPanel;