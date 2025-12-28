import React, { useState } from "react";
import {
  Sparkles,
  Briefcase,
  GraduationCap,
  Rocket,
  ArrowLeft,
  Zap,
  Palette,
  MonitorPlay,
  ArrowRight,
} from "lucide-react";
import { useProjects } from "../context/ProjectContext";
import { Button } from "./ui/Button";
import { Textarea } from "./ui/Textarea";
import { cn } from "../lib/utils";

interface CreatePresentationPageProps {
  onCancel: () => void;
}

const PRESETS = [
  {
    icon: Briefcase,
    title: "Quarterly Business Review",
    prompt:
      "Create a professional Q3 Business Review presentation covering key metrics, financial highlights, and strategic outlook for Q4.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "group-hover:border-blue-500/50",
  },
  {
    icon: Rocket,
    title: "Startup Pitch Deck",
    prompt:
      "Generate a compelling pitch deck for a Series A fintech startup. Include problem, solution, market size, business model, and team slides.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "group-hover:border-purple-500/50",
  },
  {
    icon: GraduationCap,
    title: "Educational Lecture",
    prompt:
      "Create an engaging lecture on the history of Modern Art, focusing on Impressionism, Cubism, and Surrealism with visual examples.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "group-hover:border-emerald-500/50",
  },
  {
    icon: MonitorPlay,
    title: "Product Launch",
    prompt:
      "Design a high-energy product launch deck for a new AI wearable device. Focus on features, benefits, and user lifestyle.",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "group-hover:border-orange-500/50",
  },
  {
    icon: Palette,
    title: "Design Portfolio",
    prompt:
      "Build a minimalist portfolio showcase for a UI/UX designer. Include case studies, process, and contact information.",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    border: "group-hover:border-pink-500/50",
  },
  {
    icon: Zap,
    title: "Marketing Strategy",
    prompt:
      "Outline a comprehensive digital marketing strategy for 2024, covering SEO, Social Media, Content, and Paid Advertising channels.",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "group-hover:border-cyan-500/50",
  },
];

const CreatePresentationPage: React.FC<CreatePresentationPageProps> = ({
  onCancel,
}) => {
  const { startGeneration } = useProjects();
  const [prompt, setPrompt] = useState("");

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    // Start the streaming generation - this will switch to GenerationStudio
    startGeneration(prompt.trim());
  };

  const handlePresetClick = (presetPrompt: string) => {
    setPrompt(presetPrompt);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-fuchsia-900/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between relative z-10">
        <Button
          variant="ghost"
          className="text-slate-400 hover:text-white gap-2"
          onClick={onCancel}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Powered by Gemini 2.5</span>
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full px-6 relative z-10 pb-20">
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/5 mb-4 shadow-xl shadow-indigo-500/10">
            <Sparkles className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
            What would you like to create?
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Describe your topic, audience, or goals, and our AI will build a
            professional presentation in seconds.
          </p>
        </div>

        {/* Prompt Input Area */}
        <div className="w-full max-w-3xl relative group mb-16">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-70 blur group-focus-within:opacity-100 group-focus-within:blur-md transition-all duration-500" />
          <div className="relative bg-slate-900 rounded-xl p-2 border border-white/10 shadow-2xl">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A pitch deck for a fintech startup raising Series A..."
              className="w-full bg-transparent border-none text-lg text-white placeholder:text-slate-600 focus-visible:ring-0 min-h-[120px] resize-none p-4"
            />
            <div className="flex justify-between items-center px-4 pb-2 pt-2 border-t border-white/5">
              <span className="text-xs text-slate-500">
                Pro tip: Be specific about the number of slides
              </span>
              <Button
                className="rounded-full px-6 py-6 bg-white text-black hover:bg-slate-200 transition-all font-semibold text-base shadow-lg hover:shadow-white/20"
                onClick={handleGenerate}
                disabled={!prompt.trim()}
              >
                <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                Generate
              </Button>
            </div>
          </div>
        </div>

        {/* Presets Grid */}
        <div className="w-full max-w-6xl">
          <h3 className="text-center text-sm font-medium text-slate-500 mb-6 uppercase tracking-widest">
            Or start with a preset
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handlePresetClick(preset.prompt)}
                className={cn(
                  "group text-left p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 relative overflow-hidden",
                  "flex flex-col gap-3"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={cn("p-2 rounded-lg", preset.bg)}>
                    <preset.icon className={cn("w-5 h-5", preset.color)} />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 mb-1">
                    {preset.title}
                  </h4>
                  <p className="text-sm text-slate-500 line-clamp-2">
                    {preset.prompt}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatePresentationPage;
