import React, { useState, useEffect } from 'react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/Dialog';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Textarea } from './ui/Textarea';
import { useProjects } from '../context/ProjectContext';
import { ProjectType } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: ProjectType;
}

const NewProjectDialog: React.FC<NewProjectDialogProps> = ({ open, onOpenChange, defaultType = 'AI' }) => {
  const { addProject, navigate } = useProjects();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ProjectType>(defaultType);

  useEffect(() => {
    if (open) {
      setType(defaultType);
      setTitle('');
      setDescription('');
    }
  }, [open, defaultType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If AI is selected, we redirect to the specialized Creation Studio page
    // We can pass the title/description later if needed, but for now we just navigate
    if (type === 'AI') {
        onOpenChange(false);
        navigate('create');
        return;
    }

    if (!title.trim()) return;
    addProject(title, description, type);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogDescription>
          Start a new presentation. Select the mode that suits your workflow.
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4 py-4">
        {type !== 'AI' && (
            <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input 
                id="title" 
                placeholder="e.g., Q4 Marketing Plan" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                required
            />
            </div>
        )}

        <div className="space-y-2">
            <Label htmlFor="type">Method</Label>
            <select 
                id="type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={type}
                onChange={(e) => setType(e.target.value as ProjectType)}
            >
                <option value="AI">Creative AI (Generative)</option>
                <option value="Template">Use a Template</option>
                <option value="Manual">Start from Scratch</option>
            </select>
        </div>

        {type === 'AI' ? (
            <div className="p-4 rounded-lg bg-gradient-to-r from-pink-500/10 to-violet-500/10 border border-pink-500/20 text-sm text-pink-200 space-y-2">
                <div className="flex items-center gap-2 font-medium text-pink-400">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Creation Studio</span>
                </div>
                <p className="text-muted-foreground">
                    Head over to our full-screen studio to describe your presentation and watch it come to life.
                </p>
            </div>
        ) : (
            <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea 
                id="description" 
                placeholder="Briefly describe what this presentation is about..." 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
            />
            </div>
        )}

        <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button 
                type="submit" 
                variant={type === 'AI' ? 'accent' : 'default'}
                className={type === 'AI' ? "gap-2" : ""}
            >
                {type === 'AI' ? (
                    <>
                        Open Studio <ArrowRight className="w-4 h-4" />
                    </>
                ) : (
                    'Create Project'
                )}
            </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default NewProjectDialog;