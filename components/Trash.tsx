import React from 'react';
import { useProjects } from '../context/ProjectContext';
import { Button } from './ui/Button';
import { Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from './ui/Card';

const Trash: React.FC = () => {
  const { projects, restoreProject, permanentlyDeleteProject } = useProjects();
  const deletedProjects = projects.filter(p => p.isDeleted);

  return (
    <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4 border-b border-border pb-6">
                <div className="p-3 bg-destructive/10 rounded-xl">
                    <Trash2 className="w-8 h-8 text-destructive" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Trash</h1>
                    <p className="text-muted-foreground">Restore deleted projects or remove them permanently.</p>
                </div>
            </div>

            {deletedProjects.length === 0 ? (
                <div className="text-center py-20 bg-card/50 rounded-2xl border border-dashed border-border">
                    <Trash2 className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-medium text-white">Trash is empty</h3>
                    <p className="text-muted-foreground">No deleted projects found.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {deletedProjects.map((project) => (
                        <Card key={project.id} className="flex flex-col md:flex-row items-center justify-between p-4 bg-card/50 border-border/50">
                            <div className="mb-4 md:mb-0 w-full">
                                <h4 className="text-lg font-medium text-white">{project.title}</h4>
                                <p className="text-sm text-muted-foreground">Deleted {new Date(project.updatedAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => restoreProject(project.id)}
                                    className="flex-1 md:flex-none gap-2"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Restore
                                </Button>
                                <Button 
                                    variant="default" 
                                    size="sm" 
                                    className="flex-1 md:flex-none gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    onClick={() => permanentlyDeleteProject(project.id)}
                                >
                                    <AlertTriangle className="w-4 h-4" />
                                    Delete Forever
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};

export default Trash;