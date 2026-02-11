"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import VersionTimeline from "../tools/version-timeline"
import {
  Bot,
  Search,
  Plus,
  ArrowLeft,
  Save,
  User,
  Settings,
  X,
  Play,
  Zap,
  Code,
  ChevronDown,
  ChevronUp,
  Trash2,
  GripVertical,
  Wand2,
  HelpCircle,
  Image,
  Maximize2,
  FileText,
  FileJson,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from '@/components/ui/use-toast'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface PromptCreationWizardProps {
  onBack: () => void
  onComplete: (promptData: any) => void
  isEditMode?: boolean
  editData?: any
}

const messageRoles = [
  { id: "system", name: "System", icon: Settings, description: "System instructions and context" },
  { id: "developer", name: "Developer", icon: Code, description: "Developer instructions and code context" },
  { id: "user", name: "User", icon: User, description: "User input or question" },
  { id: "assistant", name: "Assistant", icon: Bot, description: "AI assistant response" },
]

const availableModels = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI" },
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic" },
  { id: "claude-3-haiku", name: "Claude 3 Haiku", provider: "Anthropic" },
]

interface PromptMessageContent {
  type: "text" | "image_url"
  text?: string
  image_url?: {
    url: string
  }
}

interface PromptMessage {
  id: string
  role: string
  content: string | PromptMessageContent[]
}

interface FunctionParameter {
  id: string
  name: string
  type: string
  description: string
  required: boolean
}

interface FunctionSchema {
  name: string
  description: string
  parameters: FunctionParameter[]
}

interface StructuredOutput {
  enabled: boolean
  schema: string
}

export default function PromptCreationWizard({ onBack, onComplete, isEditMode = false, editData = null }: PromptCreationWizardProps) {
  const [title, setTitle] = useState(isEditMode && editData ? editData.title : "Untitled Prompt")
  const [description, setDescription] = useState(isEditMode && editData ? editData.description : "")
  const [messages, setMessages] = useState<PromptMessage[]>(
    isEditMode && editData && editData.messages
      ? editData.messages.map((msg: any, index: number) => ({
          id: msg.id || (index + 1).toString(),
          role: msg.role,
          content: msg.content
        }))
      : [
          { id: "1", role: "system", content: "You are a helpful assistant. Answer the user's question clearly and concisely." },
          { id: "2", role: "user", content: "What is the weather in {{city}}?" }
        ]
  )
  const [variables, setVariables] = useState<string[]>(isEditMode && editData ? editData.variables || [] : [])
  const [tags, setTags] = useState<string[]>(isEditMode && editData ? editData.tags || [] : [])
  const [newTag, setNewTag] = useState("")
  const [currentVersion, setCurrentVersion] = useState(isEditMode && editData ? editData.version || "1.0" : "1.0")
  const [selectedModel, setSelectedModel] = useState(isEditMode && editData ? editData.model || "gpt-4o" : "gpt-4o")
  const [testQuery, setTestQuery] = useState("")
  const [testResult, setTestResult] = useState("")
  const [isTestingPrompt, setIsTestingPrompt] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showVersionTimeline, setShowVersionTimeline] = useState(false)

  // Advanced settings
  const [functionCalling, setFunctionCalling] = useState(false)
  const [functionSchema, setFunctionSchema] = useState<FunctionSchema>({
    name: "",
    description: "",
    parameters: [],
  })
  const [structuredOutput, setStructuredOutput] = useState<StructuredOutput>({
    enabled: false,
    schema: `{
  "type": "object",
  "properties": {},
  "required": [],
  "additionalProperties": false
}`,
  })

  // Add state for change log/comments
  const [changeLog, setChangeLog] = useState<string[]>(
    isEditMode && editData && Array.isArray(editData.changeLog)
      ? editData.changeLog
      : [""]
  )
  const [newChange, setNewChange] = useState("")

  // Add state for expanded message editing
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null)
  const [expandedMessageContent, setExpandedMessageContent] = useState("")
  const [newImageUrl, setNewImageUrl] = useState("")
  const [showDescriptionTags, setShowDescriptionTags] = useState(
    isEditMode && editData && (editData.description || (editData.tags && editData.tags.length > 0))
  )
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})

  // Helper function to get text content from message
  const getMessageTextContent = (content: string | PromptMessageContent[]): string => {
    if (typeof content === 'string') {
      return content
    }
    return content
      .filter(item => item.type === 'text')
      .map(item => item.text)
      .filter(Boolean)
      .join(' ')
  }

  // Helper function to add image to message content
  const addImageToMessage = (messageId: string, imageUrl: string) => {
    setMessages(messages.map(m => {
      if (m.id === messageId) {
        const newImageContent: PromptMessageContent = {
          type: "image_url",
          image_url: { url: imageUrl }
        }
        
        if (typeof m.content === 'string') {
          // Convert string content to array with text and image
          return {
            ...m,
            content: [
              { type: "text", text: m.content },
              newImageContent
            ]
          }
        } else {
          // Add image to existing array content
          return {
            ...m,
            content: [...m.content, newImageContent]
          }
        }
      }
      return m
    }))
  }

  // Helper function to remove image from message content
  const removeImageFromMessage = (messageId: string, imageIndex: number) => {
    setMessages(messages.map(m => {
      if (m.id === messageId && typeof m.content !== 'string') {
        const contentArray = m.content as PromptMessageContent[]
        const filteredContent = contentArray.filter((item, index) => {
          if (item.type === 'image_url') {
            // Count image items to find the right one to remove
            const imageItems = contentArray.filter((contentItem: PromptMessageContent, contentIndex: number) => 
              contentIndex < index && contentItem.type === 'image_url'
            )
            return imageItems.length !== imageIndex
          }
          return true
        })
        
        // If only text remains and it's the only item, convert back to string
        if (filteredContent.length === 1 && filteredContent[0].type === 'text') {
          return {
            ...m,
            content: filteredContent[0].text || ''
          }
        }
        
        return {
          ...m,
          content: filteredContent
        }
      }
      return m
    }))
  }

  // In PromptCreationWizard, enforce at least one User message
  // 1. Add a helper to count User messages
  const userMessageCount = messages.filter(m => m.role === "user").length
  
  // 2. Ensure there's always at least one user message (both creation and edit modes)
  const ensureMinimumUserMessage = () => {
    if (userMessageCount === 0) {
      const newMessage: PromptMessage = {
        id: Date.now().toString(),
        role: "user",
        content: "",
      }
      setMessages([...messages, newMessage])
    }
  }
  
  // 3. Use effect to ensure minimum user message on mount and when messages change
  useEffect(() => {
    if (userMessageCount === 0) {
      ensureMinimumUserMessage()
    }
  }, [userMessageCount])

  const addChangeLogEntry = () => {
    if (newChange.trim()) {
      setChangeLog([...changeLog, newChange.trim()])
      setNewChange("")
    }
  }
  const removeChangeLogEntry = (idx: number) => {
    setChangeLog(changeLog.filter((_, i) => i !== idx))
  }

  const generateTitle = () => {
    const systemMessage = messages.find((m) => m.role === "system")
    if (systemMessage) {
      const systemText = getMessageTextContent(systemMessage.content)
      if (systemText.length > 0) {
        // Simple title generation based on content
        const words = systemText.split(" ").slice(0, 4)
        const generatedTitle = words.join(" ").replace(/[^\w\s]/gi, "") + " Assistant"
        setTitle(generatedTitle)
      }
    }
  }

  const addMessage = () => {
    // If there are no user messages, ensure we add one
    if (userMessageCount === 0) {
      ensureMinimumUserMessage()
      return
    }
    
    const newMessage: PromptMessage = {
      id: Date.now().toString(),
      role: "user",
      content: "",
    }
    setMessages([...messages, newMessage])
  }

  // 2. In the removeMessage function, prevent removing the last User message
  const removeMessage = (messageId: string) => {
    const messageToRemove = messages.find((m) => m.id === messageId)
    const isUser = messageToRemove?.role === "user"
    
    // Prevent removing if it's the only message
    if (messages.length <= 1) return
    
    // Prevent removing the last user message
    if (isUser && userMessageCount <= 1) {
      // Show a warning or notification that at least one user message is required
      return
    }
    
    const updatedMessages = messages.filter((m) => m.id !== messageId)
    setMessages(updatedMessages)
    
    // Ensure there's still at least one user message after removal
    const remainingUserMessages = updatedMessages.filter(m => m.role === "user").length
    if (remainingUserMessages === 0) {
      ensureMinimumUserMessage()
    }
  }

  const updateMessage = (messageId: string, field: keyof PromptMessage, value: string | PromptMessageContent[]) => {
    setMessages(messages.map((m) => (m.id === messageId ? { ...m, [field]: value } : m)))
  }

  const extractVariables = () => {
    const allContent = messages.map((m) => getMessageTextContent(m.content)).join(" ")
    const variableMatches = allContent.match(/\{\{([^}]+)\}\}/g)
    const extractedVars = variableMatches ? [...new Set(variableMatches.map((v) => v.slice(2, -2)))] : []
    setVariables(extractedVars)
    
    // Clear variable values for variables that no longer exist
    const currentVariableValues = { ...variableValues }
    Object.keys(currentVariableValues).forEach(key => {
      if (!extractedVars.includes(key)) {
        delete currentVariableValues[key]
      }
    })
    setVariableValues(currentVariableValues)
  }

  const appendVariable = (messageId: string, variableName: string) => {
    const message = messages.find((m) => m.id === messageId)
    if (message) {
      if (typeof message.content === 'string') {
        const updatedContent = message.content + ` {{${variableName}}}`
        updateMessage(messageId, "content", updatedContent)
      } else {
        // Add variable to text content in multimodal array
        const updatedContent = message.content.map(item => 
          item.type === 'text' ? { ...item, text: (item.text || '') + ` {{${variableName}}}` } : item
        )
        updateMessage(messageId, "content", updatedContent)
      }
      extractVariables()
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag()
    }
  }

  const generateNextVersion = () => {
    if (isEditMode && editData && editData.version) {
      const versionParts = editData.version.split('.')
      const major = parseInt(versionParts[0]) || 1
      const minor = parseInt(versionParts[1]) || 0
      const patch = parseInt(versionParts[2]) || 0
      setCurrentVersion(`${major}.${minor}.${patch + 1}`)
    }
  }

  // Mock version history data
  const getVersionHistory = () => {
    if (!isEditMode || !editData) return []
    
    const baseVersion = editData.version || "1.0"
    const versionParts = baseVersion.split('.').map(Number)
    const major = versionParts[0] || 1
    const minor = versionParts[1] || 0
    const patch = versionParts[2] || 0
    
    return [
      {
        version: `${major}.${minor}.${patch}`,
        date: editData.lastUpdated || "2 days ago",
        author: editData.author || "platform-team",
        changes: [
          "Updated prompt template for better performance",
          "Added new variables for enhanced functionality",
          "Improved error handling in responses"
        ],
        type: "patch" as const,
        description: "Performance improvements and bug fixes",
        commitHash: "a1b2c3d4",
        branch: "main"
      },
      {
        version: `${major}.${minor}.${Math.max(0, patch - 1)}`,
        date: "1 week ago",
        author: editData.author || "platform-team",
        changes: [
          "Added support for structured output",
          "Enhanced variable extraction",
          "Updated documentation"
        ],
        type: "minor" as const,
        description: "Added structured output support and enhanced features",
        commitHash: "e5f6g7h8",
        branch: "feature/structured-output"
      },
      {
        version: `${major}.${Math.max(0, minor - 1)}.0`,
        date: "2 weeks ago",
        author: editData.author || "platform-team",
        changes: [
          "Initial prompt creation",
          "Basic template structure",
          "Core functionality implementation"
        ],
        type: "major" as const,
        description: "Initial version of the prompt",
        commitHash: "i9j0k1l2",
        branch: "main"
      }
    ]
  }

  const testPrompt = async () => {
    setIsTestingPrompt(true)
    setTestResult("")

    try {
      // Prepare test data based on whether we have variables or not
      let testData
      if (variables.length > 0) {
        // Use variable values for testing
        testData = {
          messages: messages.map(msg => ({
            ...msg,
            content: typeof msg.content === 'string' 
              ? variables.reduce((content, variable) => 
                  content.replace(new RegExp(`\\{\\{${variable}\\}\\}`, 'g'), variableValues[variable] || `{{${variable}}}`), 
                msg.content)
              : msg.content.map(item => 
                  item.type === 'text' 
                    ? { ...item, text: variables.reduce((text, variable) => 
                        text?.replace(new RegExp(`\\{\\{${variable}\\}\\}`, 'g'), variableValues[variable] || `{{${variable}}}`) || '', 
                      item.text || '') }
                    : item
                )
          }))
        }
      } else {
        // Use test query for simple prompts
        if (!testQuery.trim()) {
          setTestResult("Please enter a test query or add variables to test the prompt.")
          setIsTestingPrompt(false)
          return
        }
        testData = {
          messages: messages.map(msg => 
            msg.role === 'user' 
              ? { ...msg, content: testQuery }
              : msg
          )
        }
      }

      // Simulate API call
      setTimeout(() => {
        const mockResponse = `Test response from ${availableModels.find((m) => m.id === selectedModel)?.name}:

${variables.length > 0 ? 'Variable Values:' : 'Query:'}
${variables.length > 0 
  ? variables.map(v => `  ${v}: ${variableValues[v] || `{{${v}}}`}`).join('\n')
  : testQuery
}

This is a simulated response based on your prompt template. The actual response would be generated using the selected model and your defined messages.

Variables detected: ${variables.join(", ") || "None"}
Function calling: ${functionCalling ? "Enabled" : "Disabled"}
Structured output: ${structuredOutput.enabled ? "Enabled" : "Disabled"}`

        setTestResult(mockResponse)
        setIsTestingPrompt(false)
      }, 2000)
    } catch (error) {
      setTestResult("Error testing prompt: " + error)
      setIsTestingPrompt(false)
    }
  }

  const addFunctionParameter = () => {
    const newParam: FunctionParameter = {
      id: Date.now().toString(),
      name: "",
      type: "string",
      description: "",
      required: false,
    }
    setFunctionSchema({
      ...functionSchema,
      parameters: [...functionSchema.parameters, newParam],
    })
  }

  const updateFunctionParameter = (paramId: string, field: keyof FunctionParameter, value: any) => {
    setFunctionSchema({
      ...functionSchema,
      parameters: functionSchema.parameters.map((p) => (p.id === paramId ? { ...p, [field]: value } : p)),
    })
  }

  const removeFunctionParameter = (paramId: string) => {
    setFunctionSchema({
      ...functionSchema,
      parameters: functionSchema.parameters.filter((p) => p.id !== paramId),
    })
  }

  // 4. Optionally, show a warning if user tries to save without a User message
  const [showUserMsgWarning, setShowUserMsgWarning] = useState(false)
  const { toast } = useToast()
  const handleSave = () => {
    extractVariables()
    if (userMessageCount === 0) {
      setShowUserMsgWarning(true)
      return
    }
    setShowUserMsgWarning(false)
    const promptData = {
      title,
      description,
      tags,
      version: currentVersion,
      messages,
      variables,
      model: selectedModel,
      functionCalling,
      functionSchema: functionCalling ? functionSchema : null,
      structuredOutput: structuredOutput.enabled ? structuredOutput : null,
      changeLog: isEditMode ? changeLog.filter(Boolean) : undefined,
    }
    onComplete(promptData)
  }

  const openExpandMessage = (messageId: string, content: string | PromptMessageContent[]) => {
    setExpandedMessageId(messageId)
    setExpandedMessageContent(getMessageTextContent(content))
  }
  const closeExpandMessage = () => {
    setExpandedMessageId(null)
    setExpandedMessageContent("")
  }
  const saveExpandedMessage = () => {
    if (expandedMessageId) {
      const message = messages.find(m => m.id === expandedMessageId)
      if (message) {
        if (typeof message.content === 'string') {
          updateMessage(expandedMessageId, "content", expandedMessageContent)
        } else {
          // Update text content in multimodal array while preserving images
          const updatedContent = message.content.map(item => 
            item.type === 'text' ? { ...item, text: expandedMessageContent } : item
          )
          updateMessage(expandedMessageId, "content", updatedContent)
        }
      }
      closeExpandMessage()
    }
  }

  const [showRequestQuery, setShowRequestQuery] = useState(false)

  // Helper to generate OpenAI-compatible messages array
  const getOpenAIMessages = (): { role: string, content: string | PromptMessageContent[] }[] => {
    return messages.map((msg: PromptMessage) => {
      let content: any = msg.content
      if (typeof msg.content === 'string') {
        // Substitute variables for string content
        content = variables.reduce((c, variable) =>
          c.replace(new RegExp(`\\{\\{${variable}\\}\\}`, 'g'), variableValues[variable] || `{{${variable}}}`),
          msg.content)
      } else if (Array.isArray(msg.content)) {
        // Substitute variables for multimodal content
        content = msg.content.map((item: PromptMessageContent) => {
          if (item.type === 'text') {
            return {
              type: 'text',
              text: variables.reduce((t, variable) =>
                t?.replace(new RegExp(`\\{\\{${variable}\\}\\}`, 'g'), variableValues[variable] || `{{${variable}}}`) || '',
                item.text || '')
            }
          } else if (item.type === 'image_url') {
            return {
              type: 'image_url',
              image_url: { url: item.image_url?.url || '' }
            }
          }
          return item
        })
      }
      return {
        role: msg.role,
        content
      }
    })
  }

  // Helper to compute the request payload (same as in testPrompt, but without simulated response)
  const getRequestPayload = () => ({ messages: getOpenAIMessages() })

  const [helpTooltipOpen, setHelpTooltipOpen] = useState(false)

  return (
    <div className="h-full flex-1 flex-col bg-muted">
      {/* Header */}
      <div className="bg-background border-b border-border px-2 py-2 md:px-4 md:py-4 lg:px-6 lg:py-6 flex-shrink-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-bold font-mono text-foreground">
                {isEditMode ? "EDIT_PROMPT" : "CREATE_PROMPT"}
              </h1>
              <p className="text-sm font-mono text-muted-foreground">
                {isEditMode ? "Update your AI prompt template" : "Build and test your AI prompt template"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isEditMode && editData && (
              <div className="flex items-center gap-2 border border-border rounded px-3 py-1 bg-muted">
                <span className="font-mono text-xs text-foreground">Version:</span>
                <Badge
                  className="font-mono text-xs bg-muted-foreground text-background cursor-pointer hover:bg-muted-foreground/80 transition-colors"
                  onClick={() => setShowVersionTimeline(true)}
                >
                  {editData.version}
                </Badge>
                <span className="text-xs font-mono text-muted-foreground ml-2">Last updated: {editData.lastUpdated || "Unknown"}</span>
              </div>
            )}
            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs"
              disabled={userMessageCount === 0}
            >
              <Save className="h-4 w-4 mr-2" />
              {isEditMode ? "UPDATE_PROMPT" : "SAVE_PROMPT"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-[65vh] overflow-auto px-2 py-2 md:px-4 md:py-4 lg:px-6 lg:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
            {/* Left Column - Prompt Editor */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {/* Basic Info */}
              <Card className="border-border bg-card">
                <CardHeader className="px-2 py-2 md:px-4 md:py-4 lg:px-6 lg:py-6">
                  <CardTitle className="font-mono text-foreground flex items-center gap-2 text-base md:text-lg lg:text-xl">
                    <Settings className="h-5 w-5" />
                    PROMPT_DETAILS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 md:space-y-4 px-2 py-2 md:px-4 md:py-4 lg:px-6 lg:py-6">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label className="font-mono text-xs text-foreground">TITLE</Label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="font-mono text-sm border-primary mt-1"
                        placeholder="Enter prompt title..."
                      />
                    </div>
                    <Button
                      onClick={generateTitle}
                      size="sm"
                      variant="outline"
                      className="mt-6 font-mono text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                    >
                      <Wand2 className="h-3 w-3 mr-1" />
                      AUTO
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label className="font-mono text-xs text-foreground">DESCRIPTION & TAGS</Label>
                        <Badge className="font-mono text-xs bg-muted-foreground text-background">
                          OPTIONAL
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDescriptionTags(!showDescriptionTags)}
                        className="font-mono text-xs text-muted-foreground hover:text-foreground"
                      >
                        {showDescriptionTags ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>
                    
                    {showDescriptionTags && (
                      <div className="space-y-4 p-4 border border-border rounded-lg bg-muted">
                        <div>
                          <Label className="font-mono text-xs text-foreground">DESCRIPTION</Label>
                          <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="font-mono text-sm border-primary mt-1 bg-background"
                            placeholder="Describe what this prompt does..."
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label className="font-mono text-xs text-foreground">TAGS</Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              onKeyDown={handleTagKeyDown}
                              className="font-mono text-sm border-primary flex-1 bg-background"
                              placeholder="Add tags (press Enter or comma to add)..."
                            />
                            <Button
                              onClick={addTag}
                              size="sm"
                              variant="outline"
                              disabled={!newTag.trim() || tags.includes(newTag.trim())}
                              className="font-mono text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  className="font-mono text-xs bg-primary text-primary-foreground flex items-center gap-1"
                                >
                                  {tag}
                                  <button
                                    onClick={() => removeTag(tag)}
                                    className="ml-1 hover:text-red-200"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Messages */}
              <Card className="border-border bg-card">
                <CardHeader className="px-2 py-2 md:px-4 md:py-4 lg:px-6 lg:py-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-mono text-foreground flex items-center gap-2 text-base md:text-lg lg:text-xl">
                      <Bot className="h-5 w-5" />
                      TEMPLATE_MESSAGES
                      <TooltipProvider>
                        <Tooltip open={helpTooltipOpen} onOpenChange={setHelpTooltipOpen}>
                          <TooltipTrigger asChild>
                            <span
                              className="text-muted-foreground cursor-help"
                              tabIndex={0}
                              role="button"
                              aria-label="Help"
                              onClick={e => {
                                e.preventDefault();
                                setHelpTooltipOpen(open => !open)
                              }}
                              onMouseEnter={() => setHelpTooltipOpen(true)}
                              onMouseLeave={() => setHelpTooltipOpen(false)}
                              onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  setHelpTooltipOpen(open => !open)
                                }
                              }}
                            >
                              <HelpCircle className="h-4 w-4 inline-block" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <span className="font-mono text-xs">Every prompt template must include at least one <b>User</b> message. This ensures your prompt can accept user input and be tested in the playground. The last user message cannot be removed until you add another one. A user message will be automatically added if none exists.</span>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {/* Copy as Text & JSON Buttons */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                              onClick={() => {
                                // Copy as Text
                                const text = getOpenAIMessages().map((msg, idx) => {
                                  const role = msg.role.charAt(0).toUpperCase() + msg.role.slice(1)
                                  let content = ''
                                  if (typeof msg.content === 'string') {
                                    content = msg.content
                                  } else {
                                    content = msg.content.map(item =>
                                      item.type === 'text' ? item.text : `[Image: ${item.image_url?.url}]`
                                    ).join(' ')
                                  }
                                  return `${role}: ${content}`
                                }).join('\n\n')
                                navigator.clipboard.writeText(text)
                                toast({ description: 'Copied as text!' })
                              }}
                              aria-label="Copy as Text"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy as Text</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                              onClick={() => {
                                // Copy as JSON
                                const json = JSON.stringify(getOpenAIMessages(), null, 2)
                                navigator.clipboard.writeText(json)
                                toast({ description: 'Copied as JSON!' })
                              }}
                              aria-label="Copy as JSON"
                            >
                              <FileJson className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy as JSON</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {/* Existing Add Message Button */}
                      <Button
                        onClick={addMessage}
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        ADD_MESSAGE
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {messages.map((message, index) => (
                    <div key={message.id} className="border border-border rounded-lg p-4 bg-muted">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <Badge className="bg-primary text-primary-foreground font-mono text-xs">MESSAGE_{index + 1}</Badge>
                          {message.role === "user" && userMessageCount <= 1 && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge className="bg-muted-foreground text-background font-mono text-xs cursor-help">
                                    REQUIRED
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <span className="font-mono text-xs">This is the last user message. At least one user message is required for the prompt to accept input. Add another user message before removing this one.</span>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          <Select
                            value={message.role}
                            onValueChange={(value) => updateMessage(message.id, "role", value)}
                          >
                            <SelectTrigger className="w-32 h-8 font-mono text-xs border-primary bg-background">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {messageRoles.map((role) => (
                                <SelectItem key={role.id} value={role.id} className="font-mono text-xs">
                                  <div className="flex items-center gap-2">
                                    <role.icon className="h-3 w-3" />
                                    <span>{role.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center gap-2">
                          <Dialog open={expandedMessageId === message.id} onOpenChange={open => { if (!open) closeExpandMessage() }}>
                        
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="font-mono text-foreground flex items-center gap-2">
                                  Edit Message {index + 1}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <Textarea
                                  value={expandedMessageContent}
                                  onChange={e => setExpandedMessageContent(e.target.value)}
                                  className="font-mono text-sm border-primary min-h-[200px]"
                                  placeholder={`Edit message content...`}
                                  rows={10}
                                  autoFocus
                                />
                                <div className="text-xs font-mono text-muted-foreground">
                                  Note: Images cannot be edited in expanded view. Use the main message editor to manage images.
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={closeExpandMessage}
                                    className="font-mono text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={saveExpandedMessage}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs"
                                  >
                                    Save
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 font-mono text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                VAR
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle className="font-mono text-foreground">ADD_VARIABLE</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label className="font-mono text-xs text-foreground">VARIABLE_NAME</Label>
                                  <Input
                                    placeholder="Enter variable name..."
                                    className="font-mono text-sm border-primary mt-1"
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        const input = e.target as HTMLInputElement
                                        if (input.value.trim()) {
                                          appendVariable(message.id, input.value.trim())
                                          input.value = ""
                                        }
                                      }
                                    }}
                                  />
                                </div>
                                <div className="text-xs font-mono text-muted-foreground">
                                  Press Enter to add variable to message
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeMessage(message.id)}
                                  disabled={messages.length <= 1 || (message.role === "user" && userMessageCount <= 1)}
                                  className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {messages.length <= 1 
                                  ? "Cannot remove the only message" 
                                  : message.role === "user" && userMessageCount <= 1
                                  ? "Add another user message before removing this one"
                                  : "Remove message"
                                }
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                      {/* Message Content */}
                      <div className="space-y-3">
                        {/* Text Content */}
                        <div>
                          <Label className="font-mono text-xs text-foreground mb-2 block">MESSAGE_CONTENT</Label>
                          <div className="relative">
                            <Textarea
                              value={typeof message.content === 'string' ? message.content : getMessageTextContent(message.content)}
                              onChange={(e) => {
                                const newContent = e.target.value
                                if (typeof message.content === 'string') {
                                  updateMessage(message.id, "content", newContent)
                                } else {
                                  // Update text content in multimodal array
                                  const updatedContent = message.content.map(item => 
                                    item.type === 'text' ? { ...item, text: newContent } : item
                                  )
                                  updateMessage(message.id, "content", updatedContent)
                                }
                              }}
                              className="font-mono text-sm border-primary bg-background pr-10"
                              placeholder={`Enter ${message.role} message content... Use {{variable}} for variables.`}
                              rows={4}
                            />
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    type="button"
                                    className="absolute top-2 right-2 p-1 rounded hover:bg-muted transition-colors"
                                    onClick={() => openExpandMessage(message.id, message.content)}
                                    aria-label="Expand message editor"
                                  >
                                    <Maximize2 className="h-4 w-4 text-muted-foreground" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>Expand message editor</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>

                        {/* Image Content - Only for user messages */}
                        {message.role === 'user' && (
                          <div>
                            <Label className="font-mono text-xs text-foreground mb-2 block">IMAGES (OPTIONAL)</Label>
                            <div className="space-y-2">
                              {/* Add Image Input */}
                              <div className="flex gap-2">
                                <Input
                                  value={newImageUrl}
                                  onChange={(e) => setNewImageUrl(e.target.value)}
                                  placeholder="Enter image URL..."
                                  className="font-mono text-xs border-primary flex-1"
                                />
                                <Button
                                  onClick={() => {
                                    if (newImageUrl.trim()) {
                                      addImageToMessage(message.id, newImageUrl.trim())
                                      setNewImageUrl('')
                                    }
                                  }}
                                  size="sm"
                                  variant="outline"
                                  disabled={!newImageUrl.trim()}
                                  className="font-mono text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>

                              {/* Display Images */}
                              {Array.isArray(message.content) && message.content.some(item => item.type === 'image_url') && (
                                <div className="space-y-2">
                                  {message.content
                                    .filter(item => item.type === 'image_url')
                                    .map((item, imageIndex) => (
                                      <div key={imageIndex} className="flex items-center gap-2 p-2 border border-border rounded bg-background">
                                        <img 
                                          src={item.image_url?.url} 
                                          alt={`Image ${imageIndex + 1}`}
                                          className="w-12 h-12 object-cover rounded border"
                                          onError={(e) => {
                                            e.currentTarget.src = '/placeholder.jpg'
                                          }}
                                        />
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs font-mono text-foreground truncate">
                                            {item.image_url?.url}
                                          </p>
                                        </div>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => removeImageFromMessage(message.id, imageIndex)}
                                          className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500"
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    ))}
                                </div>
                              )}

                              {/* Image Badge Indicator */}
                              {Array.isArray(message.content) && message.content.some(item => item.type === 'image_url') && (
                                <div className="flex items-center gap-2">
                                  <Badge className="font-mono text-xs bg-primary text-primary-foreground">
                                    <Image className="h-3 w-3 mr-1" />
                                    {message.content.filter(item => item.type === 'image_url').length} IMAGE(S)
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Advanced Settings */}
              <Card className="border-border bg-card">
                <CardHeader className="px-2 py-2 md:px-4 md:py-4 lg:px-6 lg:py-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-mono text-foreground flex items-center gap-2 text-base md:text-lg lg:text-xl">
                      <Code className="h-5 w-5" />
                      ADVANCED_SETTINGS
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="font-mono text-xs text-muted-foreground hover:text-foreground"
                    >
                      {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardHeader>
                {showAdvanced && (
                  <CardContent className="space-y-6">
                    {/* Function Calling */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-mono text-sm text-foreground">FUNCTION_CALLING</Label>
                          <p className="text-xs font-mono text-muted-foreground">Enable function calling capabilities</p>
                        </div>
                        <Switch checked={functionCalling} onCheckedChange={setFunctionCalling} />
                      </div>

                      {functionCalling && (
                        <div className="space-y-4 p-4 border border-border rounded-lg bg-muted">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="font-mono text-xs text-foreground">FUNCTION_NAME</Label>
                              <Input
                                value={functionSchema.name}
                                onChange={(e) => setFunctionSchema({ ...functionSchema, name: e.target.value })}
                                className="font-mono text-sm border-primary mt-1"
                                placeholder="function_name"
                              />
                            </div>
                            <div>
                              <Label className="font-mono text-xs text-foreground">DESCRIPTION</Label>
                              <Input
                                value={functionSchema.description}
                                onChange={(e) => setFunctionSchema({ ...functionSchema, description: e.target.value })}
                                className="font-mono text-sm border-primary mt-1"
                                placeholder="What this function does"
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="font-mono text-xs text-foreground">PARAMETERS</Label>
                              <Button
                                onClick={addFunctionParameter}
                                size="sm"
                                variant="outline"
                                className="font-mono text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                ADD
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {functionSchema.parameters.map((param) => (
                                <div key={param.id} className="grid grid-cols-12 gap-2 items-center">
                                  <div className="col-span-3">
                                    <Input
                                      value={param.name}
                                      onChange={(e) => updateFunctionParameter(param.id, "name", e.target.value)}
                                      className="font-mono text-xs border-primary"
                                      placeholder="param_name"
                                    />
                                  </div>
                                  <div className="col-span-2">
                                    <Select
                                      value={param.type}
                                      onValueChange={(value) => updateFunctionParameter(param.id, "type", value)}
                                    >
                                      <SelectTrigger className="font-mono text-xs border-primary">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="string">string</SelectItem>
                                        <SelectItem value="number">number</SelectItem>
                                        <SelectItem value="boolean">boolean</SelectItem>
                                        <SelectItem value="array">array</SelectItem>
                                        <SelectItem value="object">object</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="col-span-5">
                                    <Input
                                      value={param.description}
                                      onChange={(e) => updateFunctionParameter(param.id, "description", e.target.value)}
                                      className="font-mono text-xs border-primary"
                                      placeholder="Parameter description"
                                    />
                                  </div>
                                  <div className="col-span-1 flex items-center justify-center">
                                    <Switch
                                      checked={param.required}
                                      onCheckedChange={(checked) =>
                                        updateFunctionParameter(param.id, "required", checked)
                                      }
                                    />
                                  </div>
                                  <div className="col-span-1">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => removeFunctionParameter(param.id)}
                                      className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Structured Output */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-mono text-sm text-foreground">STRUCTURED_OUTPUT</Label>
                          <p className="text-xs font-mono text-muted-foreground">Define JSON schema for response format</p>
                        </div>
                        <Switch
                          checked={structuredOutput.enabled}
                          onCheckedChange={(checked) => setStructuredOutput({ ...structuredOutput, enabled: checked })}
                        />
                      </div>

                      {structuredOutput.enabled && (
                        <div className="p-4 border border-border rounded-lg bg-muted">
                          <Label className="font-mono text-xs text-foreground">JSON_SCHEMA</Label>
                          <Textarea
                            value={structuredOutput.schema}
                            onChange={(e) => setStructuredOutput({ ...structuredOutput, schema: e.target.value })}
                            className="font-mono text-xs border-primary mt-1 bg-background"
                            rows={8}
                            placeholder="Enter JSON schema..."
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>

            {/* Right Column - Test & Variables */}
            <div className="space-y-4 md:space-y-6">
              {/* Model Selection & Test */}
              <Card className="border-border bg-card">
                <CardHeader className="px-2 py-2 md:px-4 md:py-4 lg:px-6 lg:py-6">
                  <CardTitle className="font-mono text-foreground flex items-center gap-2 text-base md:text-lg lg:text-xl">
                    <Zap className="h-5 w-5" />
                    QUICK_TEST
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="font-mono text-xs text-foreground">MODEL</Label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger className="font-mono text-sm border-primary mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableModels.map((model) => (
                          <SelectItem key={model.id} value={model.id} className="font-mono text-sm">
                            <div>
                              <div className="font-medium">{model.name}</div>
                              <div className="text-xs text-muted-foreground">{model.provider}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Variable Values Section - always shown */}
                  <div>
                    <Label className="font-mono text-xs text-foreground">VARIABLE_VALUES</Label>
                    <div className="space-y-2 mt-1">
                      {variables.length > 0 ? (
                        variables.map((variable) => (
                          <div key={variable} className="flex items-center gap-2">
                            <Label className="font-mono text-xs text-foreground min-w-0 flex-1">
                              {`{{${variable}}}`}
                            </Label>
                            <Input
                              value={variableValues[variable] || ''}
                              onChange={(e) => setVariableValues({
                                ...variableValues,
                                [variable]: e.target.value
                              })}
                              className={`font-mono text-xs border-primary flex-1 ${
                                !variableValues[variable] ? 'border-red-300' : ''
                              }`}
                              placeholder={`Enter value for {{${variable}}}...`}
                            />
                          </div>
                        ))
                      ) : (
                        <div className="text-xs font-mono text-muted-foreground py-2">
                          No variables detected. Add variables to test your prompt.
                        </div>
                      )}
                      {variables.length > 0 && (
                        <div className="text-xs font-mono text-muted-foreground">
                          Fill in all variable values to test your prompt
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Test/Run Button */}
                  <Button
                    onClick={testPrompt}
                    disabled={
                      isTestingPrompt ||
                      (variables.length > 0 && variables.some(v => !variableValues[v]))
                    }
                    variant="outline"
                    className="font-mono text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                  >
                    {isTestingPrompt ? (
                      <>
                        <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin mr-2" />
                        TESTING...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        RUN
                      </>
                    )}
                  </Button>

                  {/* Request Query Section */}
                  <Collapsible open={showRequestQuery} onOpenChange={setShowRequestQuery}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="font-mono text-xs text-muted-foreground hover:text-foreground w-full flex justify-between items-center">
                        <span>Request Query</span>
                        <span>{showRequestQuery ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</span>
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="mt-2 p-2 border border-border rounded bg-muted overflow-x-auto">
                        <pre className="text-xs md:text-sm font-mono text-foreground whitespace-pre-wrap overflow-x-auto">
                          {JSON.stringify(getRequestPayload(), null, 2)}
                        </pre>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Result Section */}
                  {testResult && (
                    <div>
                      <Label className="font-mono text-xs text-foreground">RESULT</Label>
                      <div className="mt-1 p-3 border border-border rounded-md bg-muted">
                        <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">{testResult}</pre>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Variables */}
              <Card className="border-border bg-card">
                <CardHeader className="px-2 py-2 md:px-4 md:py-4 lg:px-6 lg:py-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-mono text-foreground flex items-center gap-2 text-base md:text-lg lg:text-xl">
                      <Search className="h-5 w-5" />
                      VARIABLES
                    </CardTitle>
                    <Button
                      onClick={extractVariables}
                      size="sm"
                      variant="outline"
                      className="font-mono text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                    >
                      <Search className="h-3 w-3 mr-1" />
                      EXTRACT
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-2 py-2 md:px-4 md:py-4 lg:px-6 lg:py-6">
                  <div className="min-h-[100px] p-4 border border-border rounded-md bg-muted">
                    {variables.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-xs font-mono text-foreground font-medium mb-3">
                          FOUND {variables.length} VARIABLES:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {variables.map((variable) => (
                            <Badge key={variable} className="font-mono text-xs bg-primary text-primary-foreground">
                              {`{{${variable}}}`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-xs font-mono text-muted-foreground">
                          NO_VARIABLES_DETECTED
                          <br />
                          Use {'{{variable_name}}'} in messages
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              {isEditMode && editData && (
                <Card className="border-border bg-card">
                  <CardHeader className="px-2 py-2 md:px-4 md:py-4 lg:px-6 lg:py-6">
                    <CardTitle className="font-mono text-foreground flex items-center gap-2 text-base md:text-lg lg:text-xl">
                      <Plus className="h-5 w-5" />
                      COMMENTS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-2 py-2 md:px-4 md:py-4 lg:px-6 lg:py-6">
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={newChange}
                        onChange={e => setNewChange(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') addChangeLogEntry() }}
                        className="font-mono text-sm border-primary flex-1"
                        placeholder="Describe a change (press Enter or click +)"
                      />
                      <Button
                        onClick={addChangeLogEntry}
                        size="sm"
                        variant="outline"
                        disabled={!newChange.trim()}
                        className="font-mono text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    {changeLog.length > 0 && (
                      <div className="flex flex-col gap-2 mt-2">
                        {changeLog.map((entry, idx) => (
                          entry && entry.trim() !== '' ? (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="text-brand-orange font-mono text-xs">•</span>
                              <span className="font-mono text-xs text-foreground flex-1">{entry}</span>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => removeChangeLogEntry(idx)}
                                className="h-5 w-5 p-0 text-muted-foreground hover:text-red-500"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : null
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              {showUserMsgWarning && (
                <div className="text-xs text-red-600 font-mono mt-2">At least one User message is required in the template.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Version Timeline */}
      {isEditMode && editData && (
        <VersionTimeline
          isOpen={showVersionTimeline}
          onClose={() => setShowVersionTimeline(false)}
          promptTitle={title}
          versions={getVersionHistory()}
          currentVersion={editData.version || "1.0"}
        />
      )}
    </div>
  )
}
