"use server"

import { generateText } from "ai"
import { openRouter } from "@/lib/deepseek" // Keep the import name for now
import { extractContentFromUrl, extractTextFromFile } from "@/lib/utils/content-extractor"

export async function summarizeContent(formData: FormData) {
  try {
    const mode = formData.get("mode") as string
    const tone = formData.get("tone") as string
    const depth = formData.get("depth") as string
    const format = formData.get("format") as string
    const sourceType = formData.get("sourceType") as string

    let content = ""
    let source = ""

    if (sourceType === "url") {
      const url = formData.get("url") as string
      content = await extractContentFromUrl(url)
      source = url
    } else if (sourceType === "file") {
      const file = formData.get("file") as File
      content = await extractTextFromFile(file)
      source = file.name
    } else {
      content = formData.get("content") as string
      source = "Direct input"
    }

    const modePrompts = {
      tldr: "Provide a concise TL;DR summary of the main points",
      study: "Create study notes with key concepts, definitions, and important points for learning",
      pitch: "Extract talking points and key arguments suitable for presentations",
      rewrite: "Rewrite the content in a different format while preserving key information",
      insight: "Extract key insights, takeaways, and actionable points",
    }

    const toneAdjustments = {
      professional: "Use professional, formal language",
      casual: "Use casual, conversational language",
      academic: "Use academic, scholarly language",
      simple: "Use simple, easy-to-understand language",
    }

    const depthAdjustments = {
      brief: "Keep it very brief and to the point",
      detailed: "Provide detailed analysis and explanation",
      comprehensive: "Provide comprehensive coverage of all aspects",
    }

    const formatAdjustments = {
      bullets: "Format as bullet points",
      paragraphs: "Format as flowing paragraphs",
      numbered: "Format as numbered list",
      outline: "Format as an outline structure",
    }

    const prompt = `
${modePrompts[mode as keyof typeof modePrompts] || modePrompts.tldr}

Content to summarize:
${content}

Instructions:
- ${toneAdjustments[tone as keyof typeof toneAdjustments] || toneAdjustments.professional}
- ${depthAdjustments[depth as keyof typeof depthAdjustments] || depthAdjustments.brief}
- ${formatAdjustments[format as keyof typeof formatAdjustments] || formatAdjustments.paragraphs}

Please provide a high-quality summary following these guidelines.
`

    const { text } = await generateText({
      model: openRouter("deepseek/deepseek-chat"), // DeepSeek V3 - general purpose model
      // Alternative options:
      // model: openRouter("deepseek/deepseek-r1"), // Better for reasoning tasks
      // model: openRouter("qwen/qwen-2.5-coder-32b-instruct"), // Specialized for coding
      prompt,
      maxTokens: 2000,
    })

    return {
      success: true,
      summary: text,
      source,
      sourceType,
      mode,
      tone,
      depth,
      format,
    }
  } catch (error) {
    console.error("Summarization error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to summarize content",
    }
  }
}

export async function askFollowUp(question: string, originalContent: string, previousSummary: string) {
  try {
    const prompt = `
Based on this content and previous summary, please answer the following question:

Original Content: ${originalContent}
Previous Summary: ${previousSummary}
Question: ${question}

Please provide a helpful and accurate answer based on the content.
`

    const { text } = await generateText({
      model: openRouter("deepseek/deepseek-chat"), // Use the same model as above
      prompt,
      maxTokens: 1000,
    })

    return {
      success: true,
      answer: text,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process follow-up question",
    }
  }
}
