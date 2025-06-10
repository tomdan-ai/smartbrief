"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, File, BookOpen, Globe, Share2, Check, Loader2 } from "lucide-react"
import { exportSummary } from "@/app/actions/export"

interface ExportOptionsProps {
  title: string
  content: string
}

const exportFormats = [
  { id: "markdown", name: "Markdown", icon: FileText, description: "Download as .md file" },
  { id: "pdf", name: "PDF", icon: File, description: "Generate PDF document" },
  { id: "word", name: "Word", icon: FileText, description: "Export to Microsoft Word" },
  { id: "notion", name: "Notion", icon: BookOpen, description: "Save to Notion workspace" },
  { id: "googledocs", name: "Google Docs", icon: Globe, description: "Create Google Doc" },
]

export function ExportOptions({ title, content }: ExportOptionsProps) {
  const [exporting, setExporting] = useState<string | null>(null)
  const [exported, setExported] = useState<string[]>([])

  const handleExport = async (format: string) => {
    setExporting(format)

    try {
      const formData = new FormData()
      formData.append("format", format)
      formData.append("title", title)
      formData.append("content", content)

      const result = await exportSummary(formData)

      if (result.success) {
        if (format === "markdown" && result.content) {
          // Download markdown file
          const blob = new Blob([result.content], { type: "text/markdown" })
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = result.filename || "summary.md"
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }

        setExported((prev) => [...prev, format])

        // Show success message
        if (result.message) {
          alert(result.message)
        }
      } else {
        alert(result.error || "Export failed")
      }
    } catch (error) {
      alert("Export failed")
    } finally {
      setExporting(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Share2 className="w-5 h-5 mr-2" />
          Export Options
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {exportFormats.map((format) => (
            <Button
              key={format.id}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 relative"
              onClick={() => handleExport(format.id)}
              disabled={exporting === format.id}
            >
              {exporting === format.id ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : exported.includes(format.id) ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <format.icon className="w-5 h-5" />
              )}
              <div className="text-center">
                <div className="font-medium text-sm">{format.name}</div>
                <div className="text-xs text-gray-500">{format.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
