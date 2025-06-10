"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  FileText,
  Zap,
  Settings,
  History,
  BookOpen,
  Presentation,
  Edit3,
  Lightbulb,
  Copy,
  Download,
  Share,
  Star,
  Clock,
  User,
} from "lucide-react"

export default function ExtensionPopup() {
  const [currentUrl, setCurrentUrl] = useState("https://example.com/article")
  const [isProcessing, setIsProcessing] = useState(false)
  const [summary, setSummary] = useState("")
  const [selectedMode, setSelectedMode] = useState("tldr")

  const summaryModes = [
    { id: "tldr", name: "TL;DR", icon: Zap, description: "Quick summary" },
    { id: "study", name: "Study", icon: BookOpen, description: "Flashcards & notes" },
    { id: "pitch", name: "Pitch", icon: Presentation, description: "Talking points" },
    { id: "rewrite", name: "Rewrite", icon: Edit3, description: "Blog posts & threads" },
    { id: "insight", name: "Insight", icon: Lightbulb, description: "Key takeaways" },
  ]

  const handleSummarize = async () => {
    setIsProcessing(true)
    // Simulate API call
    setTimeout(() => {
      setSummary(
        "This article discusses the latest developments in AI technology, focusing on large language models and their applications in various industries. Key points include improved efficiency, ethical considerations, and future implications for the workforce.",
      )
      setIsProcessing(false)
    }, 2000)
  }

  return (
    <div className="w-96 h-[600px] bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6" />
            <span className="font-bold text-lg">SmartBrief</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              <User className="w-3 h-3 mr-1" />
              Pro
            </Badge>
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="summarize" className="h-full">
          <TabsList className="grid w-full grid-cols-2 m-4 mb-2">
            <TabsTrigger value="summarize">Summarize</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="summarize" className="px-4 pb-4 space-y-4">
            {/* Current Page Detection */}
            <Card className="border-dashed border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Current Page Detected</span>
                </div>
                <p className="text-xs text-blue-600 truncate">{currentUrl}</p>
              </CardContent>
            </Card>

            {/* Summary Modes */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Summary Mode</label>
              <div className="grid grid-cols-2 gap-2">
                {summaryModes.slice(0, 4).map((mode) => (
                  <Button
                    key={mode.id}
                    variant={selectedMode === mode.id ? "default" : "outline"}
                    size="sm"
                    className="h-auto p-2 flex flex-col items-center space-y-1"
                    onClick={() => setSelectedMode(mode.id)}
                  >
                    <mode.icon className="w-4 h-4" />
                    <span className="text-xs">{mode.name}</span>
                  </Button>
                ))}
              </div>
              <Button
                variant={selectedMode === "insight" ? "default" : "outline"}
                size="sm"
                className="w-full mt-2 h-auto p-2 flex items-center justify-center space-x-2"
                onClick={() => setSelectedMode("insight")}
              >
                <Lightbulb className="w-4 h-4" />
                <span className="text-xs">Insight Mode</span>
              </Button>
            </div>

            {/* Custom Input */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Or paste URL/text</label>
              <Input placeholder="Paste URL or enter text..." className="text-sm" />
            </div>

            {/* Summarize Button */}
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={handleSummarize}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Summarize
                </>
              )}
            </Button>

            {/* Summary Result */}
            {summary && (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center">
                      <Zap className="w-4 h-4 mr-1" />
                      TL;DR Summary
                    </CardTitle>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Share className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />2 min read
                      </Badge>
                    </div>
                    <Button size="sm" variant="ghost" className="text-xs">
                      Ask follow-up
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                <Edit3 className="w-3 h-3 mr-1" />
                Rewrite
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <BookOpen className="w-3 h-3 mr-1" />
                Study Notes
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="history" className="px-4 pb-4 space-y-3">
            <div className="space-y-3">
              {[
                { title: "AI in Healthcare", time: "2 hours ago", mode: "TL;DR" },
                { title: "Market Research Report", time: "1 day ago", mode: "Insight" },
                { title: "Product Launch Strategy", time: "2 days ago", mode: "Pitch" },
              ].map((item, index) => (
                <Card key={index} className="cursor-pointer hover:bg-gray-50">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{item.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {item.mode}
                          </Badge>
                          <span className="text-xs text-gray-500">{item.time}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Star className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button variant="outline" size="sm" className="w-full text-xs">
              <History className="w-3 h-3 mr-1" />
              View All History
            </Button>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="border-t bg-gray-50 p-3">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>15/∞ summaries used</span>
          <Button variant="link" size="sm" className="text-xs p-0 h-auto">
            Upgrade to Pro
          </Button>
        </div>
      </div>
    </div>
  )
}
