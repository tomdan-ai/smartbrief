"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Brain, Link, Upload, Type, Loader2, CheckCircle, AlertCircle, Clock, FileText } from "lucide-react"

import { FileUpload } from "@/components/ui/file-upload"
import { SummaryModes } from "@/components/summary-modes"
import { ExportOptions } from "@/components/export-options"
import { FollowUpChat } from "@/components/follow-up-chat"
import { summarizeContent } from "@/app/actions/summarize"

export default function Dashboard() {
  const [inputType, setInputType] = useState<"url" | "file" | "text">("url")
  const [url, setUrl] = useState("")
  const [textContent, setTextContent] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [summaryMode, setSummaryMode] = useState("tldr")
  const [tone, setTone] = useState("professional")
  const [depth, setDepth] = useState("brief")
  const [format, setFormat] = useState("paragraphs")
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [originalContent, setOriginalContent] = useState("")

  const handleSubmit = async () => {
    if (!url && !selectedFile && !textContent) {
      alert("Please provide content to summarize")
      return
    }

    setIsProcessing(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("mode", summaryMode)
      formData.append("tone", tone)
      formData.append("depth", depth)
      formData.append("format", format)
      formData.append("sourceType", inputType)

      if (inputType === "url") {
        formData.append("url", url)
      } else if (inputType === "file" && selectedFile) {
        formData.append("file", selectedFile)
      } else if (inputType === "text") {
        formData.append("content", textContent)
        setOriginalContent(textContent)
      }

      const response = await summarizeContent(formData)
      setResult(response)

      if (response.success && inputType !== "text") {
        // Store original content for follow-up questions
        setOriginalContent(textContent || url || selectedFile?.name || "")
      }
    } catch (error) {
      setResult({
        success: false,
        error: "An unexpected error occurred",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const resetForm = () => {
    setUrl("")
    setTextContent("")
    setSelectedFile(null)
    setResult(null)
    setOriginalContent("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SmartBrief</span>
              <Badge variant="secondary">Dashboard</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800">Pro Plan</Badge>
              <Button variant="outline" size="sm">
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Brain className="w-6 h-6 mr-2" />
                  Create New Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Input Type Selection */}
                <Tabs value={inputType} onValueChange={(value) => setInputType(value as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="url" className="flex items-center space-x-2">
                      <Link className="w-4 h-4" />
                      <span>URL</span>
                    </TabsTrigger>
                    <TabsTrigger value="file" className="flex items-center space-x-2">
                      <Upload className="w-4 h-4" />
                      <span>File</span>
                    </TabsTrigger>
                    <TabsTrigger value="text" className="flex items-center space-x-2">
                      <Type className="w-4 h-4" />
                      <span>Text</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="url" className="space-y-4">
                    <div>
                      <Label htmlFor="url">Website URL</Label>
                      <Input
                        id="url"
                        placeholder="https://example.com/article"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Supports articles, YouTube videos, Reddit posts, X/Twitter threads, and more
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="file" className="space-y-4">
                    <div>
                      <Label>Upload File</Label>
                      <FileUpload onFileSelect={setSelectedFile} />
                    </div>
                  </TabsContent>

                  <TabsContent value="text" className="space-y-4">
                    <div>
                      <Label htmlFor="text">Text Content</Label>
                      <Textarea
                        id="text"
                        placeholder="Paste your text content here..."
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        rows={6}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Summary Mode Selection */}
                <div>
                  <Label className="text-base font-medium mb-4 block">Summary Mode</Label>
                  <SummaryModes selectedMode={summaryMode} onModeSelect={setSummaryMode} />
                </div>

                {/* AI Settings */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="tone">Tone</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="simple">Simple</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="depth">Depth</Label>
                    <Select value={depth} onValueChange={setDepth}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brief">Brief</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                        <SelectItem value="comprehensive">Comprehensive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="format">Format</Label>
                    <Select value={format} onValueChange={setFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paragraphs">Paragraphs</SelectItem>
                        <SelectItem value="bullets">Bullet Points</SelectItem>
                        <SelectItem value="numbered">Numbered List</SelectItem>
                        <SelectItem value="outline">Outline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Generate Summary
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {result.success ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        Summary Generated
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                        Error
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result.success ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <Badge variant="secondary">{result.mode.toUpperCase()}</Badge>
                        <span>Source: {result.source}</span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          Just now
                        </span>
                      </div>

                      <div className="prose max-w-none">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{result.summary}</pre>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-red-600">
                      <p>{result.error}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Export Options */}
            {result?.success && (
              <ExportOptions
                title={`${result.mode.toUpperCase()} Summary - ${result.source}`}
                content={result.summary}
              />
            )}

            {/* Follow-up Chat */}
            {result?.success && originalContent && (
              <FollowUpChat originalContent={originalContent} summary={result.summary} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Usage Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Usage This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Summaries</span>
                    <span className="font-semibold">47 / ∞</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Exports</span>
                    <span className="font-semibold">23 / ∞</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Follow-ups</span>
                    <span className="font-semibold">156 / ∞</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Summaries */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Summaries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { title: "AI in Healthcare Research", mode: "Study", time: "2 hours ago" },
                    { title: "Market Analysis Q4 2024", mode: "Insight", time: "1 day ago" },
                    { title: "Product Launch Strategy", mode: "Pitch", time: "2 days ago" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-gray-400 mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {item.mode}
                          </Badge>
                          <span className="text-xs text-gray-500">{item.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💡 Quick Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <p>• Use Study mode for learning new concepts</p>
                  <p>• Try Pitch mode for presentation prep</p>
                  <p>• Ask follow-up questions for deeper insights</p>
                  <p>• Export to your favorite tools instantly</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
