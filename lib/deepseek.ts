import { createOpenAI } from "@ai-sdk/openai"

export const openRouter = createOpenAI({
  name: "openrouter",
  apiKey: process.env.OPENROUTER_API_KEY || process.env.DEEPSEEK_API_KEY, // Use whichever env var you've set
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    'HTTP-Referer': 'https://smartbrief.yoursite.com', // Replace with your actual site URL
    'X-Title': 'SmartBrief', // Your app name
  }
})
