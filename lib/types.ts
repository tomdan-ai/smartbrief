export interface Summary {
  id: string
  title: string
  content: string
  mode: SummaryMode
  source: string
  sourceType: "url" | "file" | "text"
  createdAt: Date
  tone: string
  depth: string
  format: string
}

export type SummaryMode = "tldr" | "study" | "pitch" | "rewrite" | "insight"

export interface ExportOptions {
  format: "notion" | "googledocs" | "word" | "pdf" | "markdown"
  title: string
  content: string
}
