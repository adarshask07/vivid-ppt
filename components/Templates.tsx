import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import NewProjectDialog from './NewProjectDialog';
import { Badge } from 'lucide-react';

const Templates: React.FC = () => {
  const { templates } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleUseTemplate = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
              <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-white">Templates Gallery</h1>
                  <p className="text-muted-foreground">Jump start your presentation with professionally designed templates.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map(template => (
                      <Card key={template.id} className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
                          <div className={`h-40 w-full ${template.thumbnail} relative`}>
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                          </div>
                          <CardHeader>
                              <CardTitle className="text-lg">{template.title}</CardTitle>
                              <CardDescription>{template.description}</CardDescription>
                              <div className="flex gap-2 mt-2">
                                {template.tags.map(tag => (
                                    <span key={tag} className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground bg-secondary px-2 py-1 rounded">
                                        {tag}
                                    </span>
                                ))}
                              </div>
                          </CardHeader>
                          <CardFooter>
                              <Button className="w-full" onClick={handleUseTemplate}>Use Template</Button>
                          </CardFooter>
                      </Card>
                  ))}
              </div>
          </div>
      </div>
      
      <NewProjectDialog 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        defaultType="Template"
      />
    </>
  );
};

export default Templates;