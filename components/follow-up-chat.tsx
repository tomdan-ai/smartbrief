"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Send, Loader2, User, Bot } from "lucide-react"
import { askFollowUp } from "@/app/actions/summarize"

interface FollowUpChatProps {
  originalContent: string
  summary: string
}

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
}

export function FollowUpChat({ originalContent, summary }: FollowUpChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [question, setQuestion] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const quickQuestions = [
    "Explain this like I'm 5",
    "Give me real-world examples",
    "What are the key takeaways?",
    "How can I apply this?",
    "What are the potential challenges?",
  ]

  const handleSubmit = async (questionText: string) => {
    if (!questionText.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: questionText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setQuestion("")
    setIsLoading(true)

    try {
      const result = await askFollowUp(questionText, originalContent, summary)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: result.success ? result.answer! : result.error || "Sorry, I couldn't process your question.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: "Sorry, there was an error processing your question.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickQuestion = (questionText: string) => {
    handleSubmit(questionText)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <MessageCircle className="w-5 h-5 mr-2" />
          Ask Follow-up Questions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Questions */}
        {messages.length === 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-3">Try these quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickQuestion(q)}
                  className="text-xs"
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.type === "bot" && (
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3 h-3 text-blue-600" />
                  </div>
                )}
                <div
                  className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg text-sm ${
                    message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {message.content}
                </div>
                {message.type === "user" && (
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3 h-3 text-blue-600" />
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded-lg">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input */}
        <div className="flex space-x-2">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a follow-up question..."
            onKeyPress={(e) => e.key === "Enter" && handleSubmit(question)}
            disabled={isLoading}
          />
          <Button onClick={() => handleSubmit(question)} disabled={!question.trim() || isLoading} size="sm">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
