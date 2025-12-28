import React, { useState } from 'react';
import { 
  Layout, 
  Sparkles, 
  PenTool, 
  Clock, 
  Edit2,
  ArrowRight,
  Trash2
} from 'lucide-react';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { useProjects } from '../context/ProjectContext';
import NewProjectDialog from './NewProjectDialog';
import { ProjectType } from '../types';

// Simple time ago formatter
function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

const Dashboard: React.FC = () => {
  const { projects, searchQuery, deleteProject, openProject, navigate } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<ProjectType>('AI');

  const filteredProjects = projects
    .filter(p => !p.isDeleted)
    .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleStart = (type: ProjectType) => {
    if (type === 'AI') {
        navigate('create');
    } else {
        setSelectedType(type);
        setIsModalOpen(true);
    }
  };

  return (
    <>
      <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
        <div className="max-w-6xl mx-auto space-y-12">
            
            {/* Hero Section */}
            <div className="space-y-8 mt-4">
                {!searchQuery && (
                    <div className="text-center space-y-3">
                        <h1 className="text-4xl font-bold tracking-tight text-white">How would you like to get started?</h1>
                        <p className="text-muted-foreground text-lg">Choose your preferred method to begin your presentation</p>
                    </div>
                )}

                {!searchQuery && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Template Card */}
                    <Card 
                        className="group hover:bg-secondary/40 transition-all cursor-pointer flex flex-col justify-between h-72 border-border/50 hover:border-border"
                        onClick={() => handleStart('Template')}
                    >
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                                <Layout className="w-6 h-6 text-blue-500" />
                            </div>
                            <CardTitle>Use a Template</CardTitle>
                            <CardDescription className="mt-2">Choose from our gallery of professional designs</CardDescription>
                        </CardHeader>
                        <CardFooter className="justify-end">
                            <Button variant="outline" size="sm" className="group-hover:bg-white group-hover:text-black transition-colors rounded-full px-6">
                                Continue
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Creative AI Card - Highlighted */}
                    <div 
                        className="group relative p-[2px] rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer"
                        onClick={() => handleStart('AI')}
                    >
                        <div className="bg-card rounded-[10px] h-full flex flex-col justify-between relative overflow-hidden">
                             {/* Background Glow */}
                             <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 blur-[60px] rounded-full pointer-events-none" />
                             
                             <div className="p-6">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500/20 to-violet-600/20 flex items-center justify-center mb-4">
                                    <Sparkles className="w-6 h-6 text-pink-500" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2 text-white">Generate with <br/><span className="text-gradient">Creative AI</span></h3>
                                <p className="text-sm text-muted-foreground">Describe your topic and let AI build the entire deck</p>
                            </div>
                            <div className="p-6 pt-0 flex justify-end">
                                 <Button 
                                    variant="accent" 
                                    className="rounded-full px-6 shadow-lg shadow-purple-500/25"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleStart('AI');
                                    }}
                                 >
                                    Generate
                                 </Button>
                            </div>
                        </div>
                    </div>

                    {/* Scratch Card */}
                    <Card 
                        className="group hover:bg-secondary/40 transition-all cursor-pointer flex flex-col justify-between h-72 border-border/50 hover:border-border"
                        onClick={() => handleStart('Manual')}
                    >
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                                <PenTool className="w-6 h-6 text-green-500" />
                            </div>
                            <CardTitle>Start from Scratch</CardTitle>
                            <CardDescription className="mt-2">Build your presentation slide by slide manually</CardDescription>
                        </CardHeader>
                        <CardFooter className="justify-end">
                             <Button variant="outline" size="sm" className="group-hover:bg-white group-hover:text-black transition-colors rounded-full px-6">
                                Continue
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
                )}
            </div>

            {/* Recent Prompts Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">
                        {searchQuery ? `Search Results (${filteredProjects.length})` : 'Your Projects'}
                    </h2>
                </div>
                
                {filteredProjects.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <div className="mb-4">
                            <Sparkles className="w-12 h-12 mx-auto opacity-20" />
                        </div>
                        <p>No projects found. Create one to get started!</p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {filteredProjects.map((project) => (
                            <div key={project.id} className="group flex items-center justify-between p-4 rounded-xl border border-border/40 bg-card/30 hover:bg-card hover:border-border transition-all cursor-pointer" onClick={() => openProject(project.id)}>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-secondary/50 text-muted-foreground group-hover:bg-secondary group-hover:text-white transition-colors">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-white group-hover:text-pink-200 transition-colors">{project.title}</h4>
                                        <span className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                                            Edited {timeAgo(project.updatedAt)} • <span className={`w-1.5 h-1.5 rounded-full ${project.type === 'AI' ? 'bg-pink-500' : 'bg-blue-500'}`}></span> {project.type}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10" onClick={(e) => { e.stopPropagation(); openProject(project.id); }}>
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive" onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10">
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
      </main>

      <NewProjectDialog 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        defaultType={selectedType}
      />
    </>
  );
};

export default Dashboard;