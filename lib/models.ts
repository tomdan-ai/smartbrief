import { createOpenAI } from "@ai-sdk/openai"

// Create OpenRouter client
export const openRouter = createOpenAI({
  name: "openrouter",
  apiKey: process.env.OPENROUTER_API_KEY || process.env.DEEPSEEK_API_KEY, // Use existing key
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    'HTTP-Referer': 'https://smartbrief.yoursite.com', // Replace with your actual site
    'X-Title': 'SmartBrief', 
  }
})

// Define available models grouped by category
export const models = {
  // Premium models
  premium: {
    "gpt4o": "openai/gpt-4o",
    "claude": "anthropic/claude-3.7-sonnet",
    "gpt4": "openai/gpt-4-turbo",
    "gemini-2.5-pro": "google/gemini-2.5-pro-preview", // Added Gemini 2.5 Pro Preview
  },
  
  // Mid-tier models
  standard: {
    "gpt4o-mini": "openai/gpt-4o-mini",
    "mistral": "mistralai/mistral-medium",
    "gemini": "google/gemini-2.0-flash-001",
    "gemini-1.5-pro": "google/gemini-pro-1.5", // Added Gemini 1.5 Pro
    "gpt4.1-mini": "openai/gpt-4.1-mini", // Added GPT-4.1 Mini
  },
  
  // Free models
  free: {
    "gpt35": "openai/gpt-3.5-turbo",
    "gemini-free": "google/gemini-2.0-flash-lite-001:free",
    "auto": "openrouter/auto", // Auto-router
    "gemma2-9b-free": "google/gemma-2-9b-it:free", // Added Google Gemma 2 9B (free)
    "qwen3-8b-free": "qwen/qwen3-8b:free", // Added Qwen3 8B (free)
    "gpt4.1-nano": "openai/gpt-4.1-nano", // Added GPT-4.1 Nano
  },
  
  // Specialized models
  specialized: {
    "coding": "qwen/qwen-2.5-coder-32b-instruct",
    "reasoning": "anthropic/claude-3.5-sonnet",
    "creative": "anthropic/claude-3-opus",
  }
}

// Get default model path
export const getModelPath = (category: keyof typeof models = "standard", type: string = "default") => {
  const categoryModels = models[category];
  if (!categoryModels) return models.standard.mistral;
  return type in categoryModels ? categoryModels[type] : Object.values(categoryModels)[0];
}