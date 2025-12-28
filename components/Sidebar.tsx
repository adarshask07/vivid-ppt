import React from 'react';
import { 
  Home, 
  LayoutTemplate, 
  Trash2, 
  Settings, 
  Sparkles,
  ChevronDown,
  User,
} from 'lucide-react';
import { NavItem } from '../types';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';
import { useProjects } from '../context/ProjectContext';

const Sidebar: React.FC<{ className?: string }> = ({ className }) => {
  const { projects, activeView, navigate } = useProjects();
  
  // Get 4 most recent active projects
  const recentItems = projects
    .filter(p => !p.isDeleted)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'templates', icon: LayoutTemplate, label: 'Templates' },
    { id: 'trash', icon: Trash2, label: 'Trash' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className={cn("w-64 border-r border-border flex flex-col h-full bg-card", className)}>
      {/* Header / Logo */}
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-4 h-4 text-white" fill="currentColor" />
        </div>
        <span className="text-xl font-bold tracking-tight">Vivid</span>
      </div>

      {/* Primary CTA */}
      <div className="px-4 mb-2">
        <Button 
            className="w-full gap-2 bg-gradient-to-r from-pink-500 to-violet-600 hover:opacity-90 transition-opacity text-white border-0 shadow-lg shadow-purple-500/20"
            onClick={() => navigate('create')}
        >
            <Sparkles className="w-4 h-4" />
            Create with AI
        </Button>
      </div>

      {/* Main Navigation */}
      <nav className="px-3 space-y-1">
        {navItems.map((item) => (
            <Button
                key={item.id}
                variant="ghost"
                className={cn(
                    "w-full justify-start gap-3", 
                    activeView === item.id ? "bg-accent text-white" : "text-muted-foreground"
                )}
                onClick={() => navigate(item.id as NavItem)}
            >
                <item.icon className="w-4 h-4" />
                {item.label}
            </Button>
        ))}
      </nav>

      {/* Recently Opened */}
      <div className="mt-8 px-4 flex-1 overflow-y-auto">
        <h3 className="text-xs font-semibold text-muted-foreground mb-3 px-2 uppercase tracking-wider">Recently Opened</h3>
        {recentItems.length === 0 ? (
            <p className="px-2 text-xs text-muted-foreground italic">No recent projects</p>
        ) : (
            <ul className="space-y-1">
            {recentItems.map((item) => (
                <li key={item.id}>
                    <Button variant="ghost" className="w-full justify-start text-xs h-8 text-muted-foreground truncate font-normal">
                    <span className="truncate">{item.title}</span>
                    </Button>
                </li>
            ))}
            </ul>
        )}
      </div>

      {/* Promo Box */}
      <div className="mx-4 mb-4 p-4 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-white/10 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Sparkles className="w-12 h-12" />
         </div>
         <h4 className="font-semibold text-sm mb-1 text-white">Get Creative AI</h4>
         <p className="text-xs text-muted-foreground mb-3">Unlock unlimited generations</p>
         <Button variant="secondary" size="sm" className="w-full h-8 text-xs bg-white/10 hover:bg-white/20 border border-white/10">
            Upgrade Plan
         </Button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
         <Button variant="ghost" className="w-full justify-start gap-3 h-auto py-2 px-2 hover:bg-accent/50">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
               <User className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="flex-1 text-left overflow-hidden">
               <div className="text-sm font-medium text-white truncate">Web User</div>
               <div className="text-xs text-muted-foreground truncate">prodigy@vivid.app</div>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
         </Button>
      </div>
    </aside>
  );
};

export default Sidebar;