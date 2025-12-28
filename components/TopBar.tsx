import React, { useState } from 'react';
import { Search, Upload, Plus, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import NewProjectDialog from './NewProjectDialog';
import { useProjects } from '../context/ProjectContext';

const TopBar: React.FC = () => {
  const { searchQuery, setSearchQuery, navigate } = useProjects();
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  return (
    <>
        <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-background/50 backdrop-blur-sm z-10 sticky top-0">
            <div className="flex items-center gap-4 w-96">
                <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                    type="text" 
                    placeholder="Search projects..." 
                    className="pl-9 bg-secondary/50 border-transparent focus:border-ring"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="gap-2 hidden sm:flex">
                    <Upload className="w-4 h-4" />
                    Import
                </Button>
                
                {/* Dedicated Magic AI Button */}
                <Button 
                    variant="accent" 
                    size="sm" 
                    className="gap-2 hidden sm:flex" 
                    onClick={() => navigate('create')}
                >
                    <Sparkles className="w-4 h-4" />
                    Magic AI
                </Button>

                <Button variant="default" size="sm" className="gap-2" onClick={() => setIsNewProjectOpen(true)}>
                    <Plus className="w-4 h-4" />
                    New Project
                </Button>
            </div>
        </header>

        <NewProjectDialog 
            open={isNewProjectOpen} 
            onOpenChange={setIsNewProjectOpen}
        />
    </>
  );
};

export default TopBar;