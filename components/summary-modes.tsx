"use client"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Zap, Presentation, Edit3, Lightbulb } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { models } from "@/lib/models"; // Assuming models.ts is accessible

interface SummaryModesProps {
  selectedMode: string;
  onModeSelect: (mode: string) => void;
  selectedModel: string; // Add new prop for selected model
  onModelSelect: (model: string) => void; // Add new prop for model selection handler
}

const modes = [
  {
    id: "tldr",
    name: "TL;DR",
    icon: Zap,
    description: "Quick, concise summary of main points",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "study",
    name: "Study",
    icon: BookOpen,
    description: "Detailed notes with key concepts and definitions",
    color: "bg-green-100 text-green-700",
  },
  {
    id: "pitch",
    name: "Pitch",
    icon: Presentation,
    description: "Talking points and key arguments for presentations",
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "rewrite",
    name: "Rewrite",
    icon: Edit3,
    description: "Transform into different format or style",
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: "insight",
    name: "Insight",
    icon: Lightbulb,
    description: "Extract key insights and actionable takeaways",
    color: "bg-yellow-100 text-yellow-700",
  },
]

export function SummaryModes({ selectedMode, onModeSelect, selectedModel, onModelSelect }: SummaryModesProps) {
  const allModels = {
    ...models.premium,
    ...models.standard,
    ...models.free,
    // Potentially add specialized models if appropriate for summarization
  };
  const modelOptions = Object.entries(allModels).map(([key, value]) => ({ id: value, name: key }));


  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {modes.map((mode) => (
          <Card
            key={mode.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedMode === mode.id ? "ring-2 ring-blue-500 shadow-md" : ""
            }`}
            onClick={() => onModeSelect(mode.id)}
          >
            <CardContent className="p-4 text-center">
              <div className={`w-12 h-12 rounded-lg ${mode.color} flex items-center justify-center mx-auto mb-3`}>
                <mode.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{mode.name}</h3>
              <p className="text-xs text-gray-600 leading-tight">{mode.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 mb-1">
          Select AI Model
        </label>
        <Select value={selectedModel} onValueChange={onModelSelect}>
          <SelectTrigger id="model-select" className="w-full">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {modelOptions.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name} ({model.id.startsWith("openai/") ? "OpenAI" : model.id.startsWith("google/") ? "Gemini" : model.id.split('/')[0]})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
