"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Zap, 
  Plus, 
  Search, 
  Play, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  History,
  BarChart3,
  Settings,
  Lock,
  Cloud,
  Database,
  Server,
  Code,
  Users,
  Shield,
  Bot,
  Github,
  Slack,
  ChevronDown,
  ChevronUp,
  Globe,
  Key,
  Webhook,
  Terminal,
  Upload,
  Sparkles,
  Wrench,
  ArrowRight,
  ArrowLeft,
  TestTube,
  Save,
  Code2
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface FormField {
  name: string
  label: string
  type: "text" | "password" | "select" | "textarea" | "number" | "label" | "title" | "divider"
  required: boolean
  placeholder?: string
  options?: string[]
  defaultValue?: string
  content?: string // For label, title, divider types
}

interface ActionForm {
  // Basic Details
  title: string
  identifier: string
  description: string
  icon: string
  operation: string
  actionCardButtonText: string
  executeButtonText: string
  
  // User Form
  formFields: FormField[]
  
  // Backend
  backendIntegration: string
  webhookUrl: string
  headers: { key: string; value: string }[]
  timeout: number
  
  // Permissions
  approvalRequired: boolean
  approvers: string[]
  allowedRoles: string[]
  rateLimit: number
  ttl: number
}

const initialForm: ActionForm = {
  title: "",
  identifier: "",
  description: "",
  icon: "Zap",
  operation: "Create",
  actionCardButtonText: "",
  executeButtonText: "",
  formFields: [],
  backendIntegration: "Webhook",
  webhookUrl: "",
  headers: [],
  timeout: 30,
  approvalRequired: false,
  approvers: [],
  allowedRoles: ["Developer", "Admin"],
  rateLimit: 10,
  ttl: 24
}

const availableIcons = [
  "Zap", "Server", "Database", "Cloud", "Lock", "Settings", "Users", "Shield", 
  "Bot", "Github", "Slack", "Code", "BarChart3", "History", "Play"
]

const operations = ["Create", "Update", "Delete", "Execute", "Deploy", "Scale", "Lock", "Unlock"]

const backendIntegrations = [
  "Webhook", "GitHub Workflow", "Azure Pipeline", "Terraform", "ArgoCD", 
  "AWS CLI", "Slack API", "Custom Script", "Kubernetes API"
]

const roles = ["Developer", "Admin", "SRE", "DevOps", "Platform Engineer", "ReadOnly"]

interface IntegrationField {
  name: string
  label: string
  type: "text" | "password" | "select" | "textarea" | "number"
  required: boolean
  options?: string[]
}

interface IntegrationSetting {
  title: string
  icon: any
  fields: IntegrationField[]
}

// Backend integration settings
const integrationSettings: { [key: string]: IntegrationSetting } = {
  "Webhook": {
    title: "Webhook Configuration",
    icon: Webhook,
    fields: [
      { name: "url", label: "Webhook URL", type: "text", required: true },
      { name: "method", label: "HTTP Method", type: "select", required: true, options: ["GET", "POST", "PUT", "DELETE"] },
      { name: "timeout", label: "Timeout (seconds)", type: "number", required: false },
      { name: "headers", label: "Custom Headers", type: "textarea", required: false }
    ]
  },
  "GitHub Workflow": {
    title: "GitHub Workflow Configuration",
    icon: Github,
    fields: [
      { name: "repository", label: "Repository", type: "text", required: true },
      { name: "workflow", label: "Workflow File", type: "text", required: true },
      { name: "branch", label: "Branch", type: "text", required: false },
      { name: "token", label: "GitHub Token", type: "password", required: true }
    ]
  },
  "AWS CLI": {
    title: "AWS CLI Configuration",
    icon: Cloud,
    fields: [
      { name: "region", label: "AWS Region", type: "text", required: true },
      { name: "profile", label: "AWS Profile", type: "text", required: false },
      { name: "accessKey", label: "Access Key", type: "password", required: true },
      { name: "secretKey", label: "Secret Key", type: "password", required: true }
    ]
  },
  "Slack API": {
    title: "Slack API Configuration",
    icon: Slack,
    fields: [
      { name: "token", label: "Bot Token", type: "password", required: true },
      { name: "channel", label: "Default Channel", type: "text", required: false },
      { name: "webhook", label: "Webhook URL", type: "text", required: false }
    ]
  },
  "ArgoCD": {
    title: "ArgoCD Configuration",
    icon: Server,
    fields: [
      { name: "server", label: "ArgoCD Server", type: "text", required: true },
      { name: "token", label: "API Token", type: "password", required: true },
      { name: "namespace", label: "Namespace", type: "text", required: false }
    ]
  }
}

export default function CreateAction() {
  const [creationMode, setCreationMode] = useState<"manual" | "api" | "ai">("manual")
  const [form, setForm] = useState<ActionForm>(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [apiSpec, setApiSpec] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showIntegrationModal, setShowIntegrationModal] = useState(false)
  const [integrationConfig, setIntegrationConfig] = useState<{ [key: string]: string }>({})
  
  // API Spec parsing states
  const [parsedApiSpec, setParsedApiSpec] = useState<any>(null)
  const [selectedPath, setSelectedPath] = useState<string>("")
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  const [showPathSelector, setShowPathSelector] = useState(false)
  
  // Form preview states
  const [previewFormData, setPreviewFormData] = useState<{ [key: string]: any }>({})
  const [isTesting, setIsTesting] = useState(false)

  // Step management
  const [currentStep, setCurrentStep] = useState(1)
  const [formMakerMode, setFormMakerMode] = useState<"manual" | "ai" | "api">("manual")

  const steps = [
    { id: 1, title: "TITLE_AND_DESCRIPTION", icon: "📝", description: "Define action basics" },
    { id: 2, title: "FORM_MAKER", icon: "🔧", description: "Create form fields" },
    { id: 3, title: "BACKEND_INTEGRATION", icon: "🔗", description: "Configure backend" },
    { id: 4, title: "PERMISSIONS_AND_APPROVAL", icon: "🔒", description: "Set permissions" }
  ]



  const updateForm = (field: keyof ActionForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
    
    // Auto-generate identifier from title
    if (field === "title" && value) {
      const identifier = value
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
      updateForm("identifier", identifier)
    }
  }

  const addFormField = () => {
    const newField: FormField = {
      name: `field_${form.formFields.length + 1}`,
      label: "",
      type: "text",
      required: false,
      placeholder: ""
    }
    setForm(prev => ({ ...prev, formFields: [...prev.formFields, newField] }))
  }

  const updateFormField = (index: number, field: Partial<FormField>) => {
    setForm(prev => ({
      ...prev,
      formFields: prev.formFields.map((f, i) => i === index ? { ...f, ...field } : f)
    }))
  }

  const removeFormField = (index: number) => {
    setForm(prev => ({
      ...prev,
      formFields: prev.formFields.filter((_, i) => i !== index)
    }))
  }

  const getFieldTypeOptions = () => [
    { value: "text", label: "Text", icon: "T" },
    { value: "password", label: "Password", icon: "🔒" },
    { value: "select", label: "Select", icon: "📋" },
    { value: "textarea", label: "Text Area", icon: "📝" },
    { value: "number", label: "Number", icon: "#" },
    { value: "title", label: "Title", icon: "📌" },
    { value: "label", label: "Label", icon: "🏷️" },
    { value: "divider", label: "Divider", icon: "➖" }
  ]

  const handleApiSpecParse = () => {
    if (!apiSpec.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide an API specification",
        variant: "destructive"
      })
      return
    }

    try {
      // Simulate API spec parsing
      setIsGenerating(true)
      setTimeout(() => {
        // Mock parsed API spec with paths and properties
        const mockParsedSpec = {
          info: {
            title: "Sample API",
            version: "1.0.0"
          },
          paths: {
            "/users": {
              get: {
                summary: "Get users",
                parameters: [
                  { name: "limit", in: "query", type: "integer", required: false },
                  { name: "offset", in: "query", type: "integer", required: false }
                ]
              },
              post: {
                summary: "Create user",
                parameters: [
                  { name: "name", in: "body", type: "string", required: true },
                  { name: "email", in: "body", type: "string", required: true },
                  { name: "role", in: "body", type: "string", required: false }
                ]
              }
            },
            "/users/{id}": {
              get: {
                summary: "Get user by ID",
                parameters: [
                  { name: "id", in: "path", type: "string", required: true }
                ]
              },
              put: {
                summary: "Update user",
                parameters: [
                  { name: "id", in: "path", type: "string", required: true },
                  { name: "name", in: "body", type: "string", required: false },
                  { name: "email", in: "body", type: "string", required: false },
                  { name: "status", in: "body", type: "string", required: false }
                ]
              },
              delete: {
                summary: "Delete user",
                parameters: [
                  { name: "id", in: "path", type: "string", required: true }
                ]
              }
            },
            "/services": {
              post: {
                summary: "Create service",
                parameters: [
                  { name: "serviceName", in: "body", type: "string", required: true },
                  { name: "description", in: "body", type: "string", required: false },
                  { name: "environment", in: "body", type: "string", required: true },
                  { name: "config", in: "body", type: "object", required: false }
                ]
              }
            }
          }
        }

        setParsedApiSpec(mockParsedSpec)
        setShowPathSelector(true)
        setIsGenerating(false)
        toast({
          title: "API Spec Parsed",
          description: "Select an API path to generate form fields",
        })
      }, 2000)
    } catch (error) {
      setIsGenerating(false)
      toast({
        title: "Parse Error",
        description: "Failed to parse API specification",
        variant: "destructive"
      })
    }
  }

  const handlePathSelection = (path: string, method: string) => {
    setSelectedPath(`${method.toUpperCase()} ${path}`)
    
    // Get parameters for the selected path/method
    const pathData = parsedApiSpec.paths[path]
    const methodData = pathData[method]
    
    if (methodData && methodData.parameters) {
      const availableProperties = methodData.parameters.map((param: any) => ({
        name: param.name,
        type: param.type || "string",
        required: param.required || false,
        in: param.in
      }))
      
      setSelectedProperties(availableProperties.map((p: any) => p.name))
    }
  }

  const handlePropertySelection = (propertyName: string, selected: boolean) => {
    if (selected) {
      setSelectedProperties(prev => [...prev, propertyName])
    } else {
      setSelectedProperties(prev => prev.filter(p => p !== propertyName))
    }
  }

  const generateFormFromSelection = () => {
    if (!selectedPath || selectedProperties.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select a path and at least one property",
        variant: "destructive"
      })
      return
    }

    const [method, path] = selectedPath.split(" ")
    const pathData = parsedApiSpec.paths[path]
    const methodData = pathData[method.toLowerCase()]
    
    const formFields: FormField[] = methodData.parameters
      .filter((param: any) => selectedProperties.includes(param.name))
      .map((param: any) => {
        let fieldType: "text" | "password" | "select" | "textarea" | "number" = "text"
        
        if (param.type === "integer" || param.type === "number") {
          fieldType = "number"
        } else if (param.type === "object") {
          fieldType = "textarea"
        }
        
        return {
          name: param.name,
          label: param.name.charAt(0).toUpperCase() + param.name.slice(1),
          type: fieldType,
          required: param.required || false,
          placeholder: `Enter ${param.name}`,
          options: param.enum || undefined
        }
      })

    setForm(prev => ({
      ...prev,
      title: `${methodData.summary || "API Action"}`,
      identifier: `${method.toLowerCase()}-${path.replace(/[^a-zA-Z0-9]/g, "-")}`,
      description: `Execute ${methodData.summary || "API call"} with dynamic parameters`,
      formFields: formFields,
      backendIntegration: "Webhook"
    }))

    setShowPathSelector(false)
    setSelectedPath("")
    setSelectedProperties([])
    
    toast({
      title: "Form Generated",
      description: "Form fields generated from selected API properties",
    })
  }

  const handleAiGeneration = () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a description of the action you want to create",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)
    
    // Simulate AI generation
    setTimeout(() => {
      const mockFields: FormField[] = [
        { name: "serviceName", label: "Service Name", type: "text", required: true, placeholder: "Enter service name" },
        { name: "environment", label: "Environment", type: "select", required: true, options: ["dev", "staging", "prod"], defaultValue: "dev" },
        { name: "description", label: "Description", type: "textarea", required: false, placeholder: "Service description" }
      ]

      setForm(prev => ({
        ...prev,
        title: "Deploy Service",
        identifier: "deploy-service",
        description: "Deploy a service to the specified environment",
        formFields: mockFields,
        backendIntegration: "GitHub Workflow"
      }))

      setIsGenerating(false)
      toast({
        title: "Action Generated",
        description: "AI has generated an action based on your description",
      })
    }, 3000)
  }

  const handleSubmit = async () => {
    if (!form.title || !form.identifier) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Action Created",
        description: "Your self-service action has been created successfully",
      })
      // Reset form
      setForm(initialForm)
      setCreationMode("manual")
    }, 2000)
  }

  const handleTestAction = async () => {
    if (!form.title || form.formFields.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in action details and add form fields",
        variant: "destructive"
      })
      return
    }

    setIsTesting(true)
    
    // Simulate test execution
    setTimeout(() => {
      setIsTesting(false)
      toast({
        title: "Test Successful",
        description: "Action test completed successfully",
      })
    }, 2000)
  }

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Zap, Server, Database, Cloud, Lock, Settings, Users, Shield, 
      Bot, Github, Slack, Code, BarChart3, History, Play
    }
    return iconMap[iconName] || Zap
  }

  const creationModes = [
    {
      id: "manual",
      title: "MANUAL_CREATION",
      description: "Build action step by step",
      icon: Wrench,
      color: "bg-blue-500"
    },
    {
      id: "api",
      title: "API_SPEC",
      description: "Import from OpenAPI/Postman",
      icon: Upload,
      color: "bg-green-500"
    },
    {
      id: "ai",
      title: "AI_GENERATION",
      description: "Generate with AI prompt",
      icon: Sparkles,
      color: "bg-purple-500"
    }
  ]

  const currentIntegration = integrationSettings[form.backendIntegration as keyof typeof integrationSettings]

  const renderFormPreview = () => {
    if (form.formFields.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground font-mono">
          <div className="text-center">
            <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No form fields defined yet</p>
            <p className="text-xs mt-1">Add form fields to see the preview</p>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          {(() => {
            const IconComponent = getIconComponent(form.icon)
            return <IconComponent className="h-5 w-5" />
          })()}
          <h3 className="font-semibold font-mono">{form.title || "Action Preview"}</h3>
        </div>
        
        <div className="space-y-4">
          {form.formFields.map((field, index) => {
            // Handle special field types
            if (field.type === "title") {
              return (
                <div key={index} className="pt-4 pb-2">
                  <h3 className="text-lg font-semibold font-mono text-primary">
                    {field.content || field.label}
                  </h3>
                </div>
              )
            }
            
            if (field.type === "label") {
              return (
                <div key={index} className="pt-2 pb-1">
                  <p className="text-sm font-medium font-mono text-muted-foreground">
                    {field.content || field.label}
                  </p>
                </div>
              )
            }
            
            if (field.type === "divider") {
              return (
                <div key={index} className="py-2">
                  <div className="border-t border-border"></div>
                </div>
              )
            }

            // Handle regular form fields
            return (
              <div key={index} className="space-y-2">
                <Label className="font-mono text-sm">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </Label>
                {field.type === "select" ? (
                  <Select 
                    value={previewFormData[field.name] || ""} 
                    onValueChange={(value) => setPreviewFormData(prev => ({ ...prev, [field.name]: value }))}
                  >
                    <SelectTrigger className="font-mono text-sm">
                      <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option} value={option} className="font-mono text-sm">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === "textarea" ? (
                  <Textarea
                    placeholder={field.placeholder}
                    value={previewFormData[field.name] || ""}
                    onChange={(e) => setPreviewFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                    className="font-mono text-sm"
                    rows={3}
                  />
                ) : (
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={previewFormData[field.name] || ""}
                    onChange={(e) => setPreviewFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                    className="font-mono text-sm"
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderTimelineView = () => (
    <div className="flex gap-6">
      {/* Left Column - Timeline Steps */}
      <div className="flex-1">
        <div className="space-y-6">
          {/* Step 1: Title and Description */}
          <Card className={currentStep === 1 ? "ring-2 ring-primary" : ""}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono ${
                  currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {currentStep > 1 ? "✓" : "1"}
                </div>
                <div>
                  <CardTitle className="font-mono text-sm">TITLE_AND_DESCRIPTION</CardTitle>
                  <p className="text-xs text-muted-foreground font-mono">Define action basics</p>
                </div>
              </div>
            </CardHeader>
            {currentStep === 1 && (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-mono text-xs">ACTION_TITLE *</Label>
                  <Input
                    placeholder="Enter action title"
                    value={form.title}
                    onChange={(e) => updateForm("title", e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-xs">DESCRIPTION *</Label>
                  <Textarea
                    placeholder="Describe what this action does"
                    value={form.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                    className="font-mono text-sm"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-xs">ICON</Label>
                  <Select value={form.icon} onValueChange={(value) => updateForm("icon", value)}>
                    <SelectTrigger className="font-mono text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableIcons.map((icon) => {
                        const IconComponent = getIconComponent(icon)
                        return (
                          <SelectItem key={icon} value={icon} className="font-mono text-sm">
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              {icon}
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Step 2: Form Maker */}
          <Card className={currentStep === 2 ? "ring-2 ring-primary" : ""}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono ${
                  currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {currentStep > 2 ? "✓" : "2"}
                </div>
                <div>
                  <CardTitle className="font-mono text-sm">FORM_MAKER</CardTitle>
                  <p className="text-xs text-muted-foreground font-mono">Create form fields</p>
                </div>
              </div>
            </CardHeader>
            {currentStep === 2 && (
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-4 pr-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={addFormField} className="font-mono text-xs">
                          <Plus className="h-4 w-4 mr-2" />
                          ADD_FORM_FIELD
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            const newField: FormField = {
                              name: `title_${form.formFields.length + 1}`,
                              label: "Section Title",
                              type: "title",
                              required: false,
                              content: "Section Title"
                            }
                            setForm(prev => ({ ...prev, formFields: [...prev.formFields, newField] }))
                          }}
                          className="font-mono text-xs"
                        >
                          <span className="mr-2">📌</span>
                          ADD_TITLE
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            const newField: FormField = {
                              name: `label_${form.formFields.length + 1}`,
                              label: "Description Label",
                              type: "label",
                              required: false,
                              content: "Description text here"
                            }
                            setForm(prev => ({ ...prev, formFields: [...prev.formFields, newField] }))
                          }}
                          className="font-mono text-xs"
                        >
                          <span className="mr-2">🏷️</span>
                          ADD_LABEL
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            const newField: FormField = {
                              name: `divider_${form.formFields.length + 1}`,
                              label: "Divider",
                              type: "divider",
                              required: false
                            }
                            setForm(prev => ({ ...prev, formFields: [...prev.formFields, newField] }))
                          }}
                          className="font-mono text-xs"
                        >
                          <span className="mr-2">➖</span>
                          ADD_DIVIDER
                        </Button>
                      </div>
                    </div>

                    {/* Form Fields Management */}
                    {form.formFields.length > 0 && (
                      <div className="space-y-3">
                        {form.formFields.map((field, index) => (
                          <div key={index} className="border rounded-lg p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label className="font-mono text-xs">FIELD_LABEL</Label>
                                <Input
                                  placeholder="Enter field label"
                                  value={field.label}
                                  onChange={(e) => updateFormField(index, { label: e.target.value })}
                                  className="font-mono text-sm"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="font-mono text-xs">FIELD_TYPE</Label>
                                <Select 
                                  value={field.type} 
                                  onValueChange={(value) => updateFormField(index, { type: value as any })}
                                >
                                  <SelectTrigger className="font-mono text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getFieldTypeOptions().map((option) => (
                                      <SelectItem key={option.value} value={option.value} className="font-mono text-sm">
                                        <div className="flex items-center gap-2">
                                          <span className="text-lg">{option.icon}</span>
                                          <span>{option.label}</span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            {/* Content field for title, label, divider */}
                            {(field.type === "title" || field.type === "label") && (
                              <div className="space-y-2">
                                <Label className="font-mono text-xs">CONTENT</Label>
                                <Input
                                  placeholder={`Enter ${field.type} content`}
                                  value={field.content || ""}
                                  onChange={(e) => updateFormField(index, { content: e.target.value })}
                                  className="font-mono text-sm"
                                />
                              </div>
                            )}
                            
                            {/* Only show placeholder and required for input fields */}
                            {!["title", "label", "divider"].includes(field.type) && (
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                  <Label className="font-mono text-xs">PLACEHOLDER</Label>
                                  <Input
                                    placeholder="Enter placeholder text"
                                    value={field.placeholder || ""}
                                    onChange={(e) => updateFormField(index, { placeholder: e.target.value })}
                                    className="font-mono text-sm"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="font-mono text-xs">REQUIRED</Label>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      id={`required-${index}`}
                                      checked={field.required}
                                      onChange={(e) => updateFormField(index, { required: e.target.checked })}
                                      className="rounded"
                                    />
                                    <Label htmlFor={`required-${index}`} className="font-mono text-sm">
                                      Required field
                                    </Label>
                                  </div>
                                </div>
                              </div>
                            )}

                            {field.type === "select" && (
                              <div className="space-y-2">
                                <Label className="font-mono text-xs">OPTIONS</Label>
                                <Textarea
                                  placeholder="Enter options separated by commas (e.g., Option 1, Option 2, Option 3)"
                                  value={field.options?.join(", ") || ""}
                                  onChange={(e) => {
                                    const options = e.target.value.split(",").map(opt => opt.trim()).filter(opt => opt)
                                    updateFormField(index, { options })
                                  }}
                                  className="font-mono text-sm"
                                  rows={2}
                                />
                              </div>
                            )}

                            <div className="flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeFormField(index)}
                                className="font-mono text-xs"
                              >
                                Remove Field
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            )}
          </Card>

          {/* Step 3: Backend Integration */}
          <Card className={currentStep === 3 ? "ring-2 ring-primary" : ""}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono ${
                  currentStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {currentStep > 3 ? "✓" : "3"}
                </div>
                <div>
                  <CardTitle className="font-mono text-sm">BACKEND_INTEGRATION</CardTitle>
                  <p className="text-xs text-muted-foreground font-mono">Configure backend</p>
                </div>
              </div>
            </CardHeader>
            {currentStep === 3 && (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-mono text-xs">BACKEND_INTEGRATION</Label>
                  <div className="flex items-center gap-2">
                    <Select value={form.backendIntegration} onValueChange={(value) => updateForm("backendIntegration", value)}>
                      <SelectTrigger className="font-mono text-sm flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {backendIntegrations.map((integration) => (
                          <SelectItem key={integration} value={integration} className="font-mono text-sm">{integration}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowIntegrationModal(true)}
                      className="font-mono text-xs"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-xs">TIMEOUT_SECONDS</Label>
                  <Input
                    type="number"
                    placeholder="30"
                    value={form.timeout}
                    onChange={(e) => updateForm("timeout", parseInt(e.target.value) || 30)}
                    className="font-mono text-sm"
                  />
                </div>
              </CardContent>
            )}
          </Card>

          {/* Step 4: Permissions and Approval */}
          <Card className={currentStep === 4 ? "ring-2 ring-primary" : ""}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono ${
                  currentStep >= 4 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  4
                </div>
                <div>
                  <CardTitle className="font-mono text-sm">PERMISSIONS_AND_APPROVAL</CardTitle>
                  <p className="text-xs text-muted-foreground font-mono">Set permissions</p>
                </div>
              </div>
            </CardHeader>
            {currentStep === 4 && (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-mono text-xs">APPROVAL_REQUIRED</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="approval-required"
                      checked={form.approvalRequired}
                      onChange={(e) => updateForm("approvalRequired", e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="approval-required" className="font-mono text-sm">
                      Require approval before execution
                    </Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-xs">ALLOWED_ROLES</Label>
                  <Select value={form.allowedRoles[0] || ""} onValueChange={(value) => updateForm("allowedRoles", [value])}>
                    <SelectTrigger className="font-mono text-sm">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role} className="font-mono text-sm">{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="font-mono text-xs">RATE_LIMIT</Label>
                    <Input
                      type="number"
                      placeholder="10"
                      value={form.rateLimit}
                      onChange={(e) => updateForm("rateLimit", parseInt(e.target.value) || 10)}
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-mono text-xs">TTL_HOURS</Label>
                    <Input
                      type="number"
                      placeholder="24"
                      value={form.ttl}
                      onChange={(e) => updateForm("ttl", parseInt(e.target.value) || 24)}
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {/* Right Column - Form Preview */}
      <div className="w-96">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-mono">
              <Eye className="h-5 w-5" />
              FORM_PREVIEW
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-300px)]">
              {renderFormPreview()}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )

    return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 font-mono">
            <Plus className="h-6 w-6" />
            CREATE_NEW_ACTION
          </h1>
          <p className="text-muted-foreground font-mono">Step-by-step action creation</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex gap-6">
          {/* Left Column - Tabs */}
          <div className="flex-1">
              <Tabs value={currentStep.toString()} onValueChange={(value) => setCurrentStep(parseInt(value))}>
                <TabsList className="grid w-full grid-cols-4">
                  {steps.map((step) => (
                    <TabsTrigger key={step.id} value={step.id.toString()} className="font-mono text-xs">
                      {step.icon} {step.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <TabsContent value="1" className="mt-6">
                  <Card>
                    <CardContent className="space-y-4 pt-6">
                      <div className="space-y-2">
                        <Label className="font-mono text-xs">ACTION_TITLE *</Label>
                        <Input
                          placeholder="Enter action title"
                          value={form.title}
                          onChange={(e) => updateForm("title", e.target.value)}
                          className="font-mono text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-mono text-xs">DESCRIPTION *</Label>
                        <Textarea
                          placeholder="Describe what this action does"
                          value={form.description}
                          onChange={(e) => updateForm("description", e.target.value)}
                          className="font-mono text-sm"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-mono text-xs">ICON</Label>
                        <Select value={form.icon} onValueChange={(value) => updateForm("icon", value)}>
                          <SelectTrigger className="font-mono text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {availableIcons.map((icon) => {
                              const IconComponent = getIconComponent(icon)
                              return (
                                <SelectItem key={icon} value={icon} className="font-mono text-sm">
                                  <div className="flex items-center gap-2">
                                    <IconComponent className="h-4 w-4" />
                                    {icon}
                                  </div>
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Navigation */}
                      <div className="flex justify-end pt-4">
                        <Button 
                          onClick={() => setCurrentStep(2)}
                          disabled={!form.title.trim() || !form.description.trim()}
                          className="font-mono text-xs"
                        >
                          Next: Form Maker
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="2" className="mt-6">
                  <Card>
                    <CardContent className="pt-6">
                      {/* Form Maker Mode Selection */}
                      <div className="mb-6">
                        <Label className="font-mono text-sm mb-3 block">SELECT_FORM_CREATION_MODE</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card 
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              formMakerMode === "manual" ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => setFormMakerMode("manual")}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-blue-500 text-white">
                                  <Wrench className="h-5 w-5" />
                                </div>
                                <div>
                                  <h3 className="font-semibold font-mono text-sm">MANUAL</h3>
                                  <p className="text-xs text-muted-foreground font-mono">Build form step by step</p>
                                </div>
                              </div>
                              {formMakerMode === "manual" && (
                                <div className="flex items-center gap-1 text-primary">
                                  <CheckCircle className="h-4 w-4" />
                                  <span className="text-xs font-mono">SELECTED</span>
                                </div>
                              )}
                            </CardContent>
                          </Card>

                          <Card 
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              formMakerMode === "ai" ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => setFormMakerMode("ai")}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-purple-500 text-white">
                                  <Sparkles className="h-5 w-5" />
                                </div>
                                <div>
                                  <h3 className="font-semibold font-mono text-sm">USE_AI</h3>
                                  <p className="text-xs text-muted-foreground font-mono">Generate with AI prompt</p>
                                </div>
                              </div>
                              {formMakerMode === "ai" && (
                                <div className="flex items-center gap-1 text-primary">
                                  <CheckCircle className="h-4 w-4" />
                                  <span className="text-xs font-mono">SELECTED</span>
                                </div>
                              )}
                            </CardContent>
                          </Card>

                          <Card 
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              formMakerMode === "api" ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => setFormMakerMode("api")}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-green-500 text-white">
                                  <Upload className="h-5 w-5" />
                                </div>
                                <div>
                                  <h3 className="font-semibold font-mono text-sm">USE_API_SPECS</h3>
                                  <p className="text-xs text-muted-foreground font-mono">Import from OpenAPI/Postman</p>
                                </div>
                              </div>
                              {formMakerMode === "api" && (
                                <div className="flex items-center gap-1 text-primary">
                                  <CheckCircle className="h-4 w-4" />
                                  <span className="text-xs font-mono">SELECTED</span>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Mode-Specific Content */}
                      {formMakerMode === "manual" && (
                        <ScrollArea className="h-80">
                          <div className="space-y-4 pr-4">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={addFormField} className="font-mono text-xs">
                                  <Plus className="h-4 w-4 mr-2" />
                                  ADD_FORM_FIELD
                                </Button>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => {
                                    const newField: FormField = {
                                      name: `title_${form.formFields.length + 1}`,
                                      label: "Section Title",
                                      type: "title",
                                      required: false,
                                      content: "Section Title"
                                    }
                                    setForm(prev => ({ ...prev, formFields: [...prev.formFields, newField] }))
                                  }}
                                  className="font-mono text-xs"
                                >
                                  <span className="mr-2">📌</span>
                                  ADD_TITLE
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => {
                                    const newField: FormField = {
                                      name: `label_${form.formFields.length + 1}`,
                                      label: "Description Label",
                                      type: "label",
                                      required: false,
                                      content: "Description text here"
                                    }
                                    setForm(prev => ({ ...prev, formFields: [...prev.formFields, newField] }))
                                  }}
                                  className="font-mono text-xs"
                                >
                                  <span className="mr-2">🏷️</span>
                                  ADD_LABEL
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => {
                                    const newField: FormField = {
                                      name: `divider_${form.formFields.length + 1}`,
                                      label: "Divider",
                                      type: "divider",
                                      required: false
                                    }
                                    setForm(prev => ({ ...prev, formFields: [...prev.formFields, newField] }))
                                  }}
                                  className="font-mono text-xs"
                                >
                                  <span className="mr-2">➖</span>
                                  ADD_DIVIDER
                                </Button>
                              </div>
                            </div>

                            {/* Form Fields Management */}
                            {form.formFields.length > 0 && (
                              <div className="space-y-3">
                                {form.formFields.map((field, index) => (
                                  <div key={index} className="border rounded-lg p-4 space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="space-y-2">
                                        <Label className="font-mono text-xs">FIELD_LABEL</Label>
                                        <Input
                                          placeholder="Enter field label"
                                          value={field.label}
                                          onChange={(e) => updateFormField(index, { label: e.target.value })}
                                          className="font-mono text-sm"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="font-mono text-xs">FIELD_TYPE</Label>
                                        <Select 
                                          value={field.type} 
                                          onValueChange={(value) => updateFormField(index, { type: value as any })}
                                        >
                                          <SelectTrigger className="font-mono text-sm">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {getFieldTypeOptions().map((option) => (
                                              <SelectItem key={option.value} value={option.value} className="font-mono text-sm">
                                                <div className="flex items-center gap-2">
                                                  <span className="text-lg">{option.icon}</span>
                                                  <span>{option.label}</span>
                                                </div>
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    
                                    {/* Content field for title, label, divider */}
                                    {(field.type === "title" || field.type === "label") && (
                                      <div className="space-y-2">
                                        <Label className="font-mono text-xs">CONTENT</Label>
                                        <Input
                                          placeholder={`Enter ${field.type} content`}
                                          value={field.content || ""}
                                          onChange={(e) => updateFormField(index, { content: e.target.value })}
                                          className="font-mono text-sm"
                                        />
                                      </div>
                                    )}
                                    
                                    {/* Only show placeholder and required for input fields */}
                                    {!["title", "label", "divider"].includes(field.type) && (
                                      <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                          <Label className="font-mono text-xs">PLACEHOLDER</Label>
                                          <Input
                                            placeholder="Enter placeholder text"
                                            value={field.placeholder || ""}
                                            onChange={(e) => updateFormField(index, { placeholder: e.target.value })}
                                            className="font-mono text-sm"
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label className="font-mono text-xs">REQUIRED</Label>
                                          <div className="flex items-center space-x-2">
                                            <input
                                              type="checkbox"
                                              id={`required-${index}`}
                                              checked={field.required}
                                              onChange={(e) => updateFormField(index, { required: e.target.checked })}
                                              className="rounded"
                                            />
                                            <Label htmlFor={`required-${index}`} className="font-mono text-sm">
                                              Required field
                                            </Label>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {field.type === "select" && (
                                      <div className="space-y-2">
                                        <Label className="font-mono text-xs">OPTIONS</Label>
                                        <Textarea
                                          placeholder="Enter options separated by commas (e.g., Option 1, Option 2, Option 3)"
                                          value={field.options?.join(", ") || ""}
                                          onChange={(e) => {
                                            const options = e.target.value.split(",").map(opt => opt.trim()).filter(opt => opt)
                                            updateFormField(index, { options })
                                          }}
                                          className="font-mono text-sm"
                                          rows={2}
                                        />
                                      </div>
                                    )}

                                    <div className="flex justify-end">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeFormField(index)}
                                        className="font-mono text-xs"
                                      >
                                        Remove Field
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      )}

                      {formMakerMode === "ai" && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="font-mono text-xs">DESCRIBE_YOUR_FORM</Label>
                            <Textarea
                              placeholder="Describe the form you want to create. For example: 'Create a user registration form with name, email, password, and terms checkbox' or 'Build a service deployment form with service name, environment, and configuration options'"
                              value={aiPrompt}
                              onChange={(e) => setAiPrompt(e.target.value)}
                              className="font-mono text-sm"
                              rows={6}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground font-mono">
                              AI will generate form fields based on your description
                            </div>
                            <Button 
                              onClick={handleAiGeneration} 
                              disabled={isGenerating || !aiPrompt.trim()}
                              className="font-mono text-xs"
                            >
                              {isGenerating ? (
                                <>
                                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                  GENERATING...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="h-4 w-4 mr-2" />
                                  GENERATE_FORM
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}

                      {formMakerMode === "api" && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="font-mono text-xs">API_SPECIFICATION</Label>
                            <Textarea
                              placeholder="Paste your OpenAPI spec, Postman collection, or API endpoint details..."
                              value={apiSpec}
                              onChange={(e) => setApiSpec(e.target.value)}
                              className="font-mono text-sm"
                              rows={8}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground font-mono">
                              Supports OpenAPI 3.0, Postman Collections, and raw API endpoints
                            </div>
                            <Button 
                              onClick={handleApiSpecParse} 
                              disabled={isGenerating || !apiSpec.trim()}
                              className="font-mono text-xs"
                            >
                              {isGenerating ? (
                                <>
                                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                  PARSING...
                                </>
                              ) : (
                                <>
                                  <ArrowRight className="h-4 w-4 mr-2" />
                                  PARSE_SPEC
                                </>
                              )}
                            </Button>
                          </div>

                          {/* Path Selection */}
                          {showPathSelector && (
                            <div className="space-y-4">
                              <div>
                                <Label className="font-mono text-xs mb-2 block">SELECT_API_PATH</Label>
                                <div className="grid grid-cols-1 gap-2">
                                  {parsedApiSpec && Object.entries(parsedApiSpec.paths).map(([path, pathData]: [string, any]) => (
                                    <div key={path} className="border rounded-lg p-3">
                                      <div className="font-mono text-sm font-medium mb-2">{path}</div>
                                      <div className="space-y-2">
                                        {Object.entries(pathData).map(([method, methodData]: [string, any]) => (
                                          <div 
                                            key={`${path}-${method}`}
                                            className={`p-2 rounded border cursor-pointer transition-colors ${
                                              selectedPath === `${method.toUpperCase()} ${path}` 
                                                ? 'bg-primary text-primary-foreground' 
                                                : 'hover:bg-muted'
                                            }`}
                                            onClick={() => handlePathSelection(path, method)}
                                          >
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="font-mono text-xs">
                                                  {method.toUpperCase()}
                                                </Badge>
                                                <span className="font-mono text-sm">{methodData.summary}</span>
                                              </div>
                                              <div className="text-xs text-muted-foreground font-mono">
                                                {methodData.parameters?.length || 0} params
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Property Selection */}
                              {selectedPath && (
                                <div className="space-y-4">
                                  <div>
                                    <Label className="font-mono text-xs mb-2 block">SELECT_PROPERTIES</Label>
                                    <div className="text-sm text-muted-foreground font-mono mb-3">
                                      Selected: {selectedPath}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                      {(() => {
                                        const [method, path] = selectedPath.split(" ")
                                        const pathData = parsedApiSpec.paths[path]
                                        const methodData = pathData[method.toLowerCase()]
                                        
                                        return methodData?.parameters?.map((param: any) => (
                                          <div key={param.name} className="flex items-center space-x-2 p-2 border rounded">
                                            <input
                                              type="checkbox"
                                              id={param.name}
                                              checked={selectedProperties.includes(param.name)}
                                              onChange={(e) => handlePropertySelection(param.name, e.target.checked)}
                                              className="rounded"
                                            />
                                            <Label htmlFor={param.name} className="font-mono text-sm cursor-pointer">
                                              <div className="flex items-center gap-2">
                                                <span>{param.name}</span>
                                                <Badge variant={param.required ? "destructive" : "secondary"} className="text-xs">
                                                  {param.required ? "Required" : "Optional"}
                                                </Badge>
                                                <Badge variant={param.type} className="text-xs">
                                                  {param.type}
                                                </Badge>
                                              </div>
                                            </Label>
                                          </div>
                                        ))
                                      })()}
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between pt-4">
                                    <Button 
                                      variant="outline" 
                                      onClick={() => {
                                        setShowPathSelector(false)
                                        setSelectedPath("")
                                        setSelectedProperties([])
                                      }}
                                      className="font-mono text-xs"
                                    >
                                      Back to Spec
                                    </Button>
                                    <Button 
                                      onClick={generateFormFromSelection}
                                      disabled={selectedProperties.length === 0}
                                      className="font-mono text-xs"
                                    >
                                      Generate Form
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                                                     )}
                         </div>
                       )}
                       
                       {/* Navigation */}
                       <div className="flex items-center justify-between pt-6 border-t">
                         <Button 
                           variant="outline"
                           onClick={() => setCurrentStep(1)}
                           className="font-mono text-xs"
                         >
                           <ArrowLeft className="h-4 w-4 mr-2" />
                           Previous: Basic Details
                         </Button>
                         <Button 
                           onClick={() => setCurrentStep(3)}
                           disabled={form.formFields.length === 0}
                           className="font-mono text-xs"
                         >
                           Next: Backend Integration
                           <ArrowRight className="h-4 w-4 ml-2" />
                         </Button>
                       </div>
                     </CardContent>
                   </Card>
                 </TabsContent>

                <TabsContent value="3" className="mt-6">
                  <Card>
                    <CardContent className="space-y-4 pt-6">
                      <div className="space-y-2">
                        <Label className="font-mono text-xs">BACKEND_INTEGRATION</Label>
                        <div className="flex items-center gap-2">
                          <Select value={form.backendIntegration} onValueChange={(value) => updateForm("backendIntegration", value)}>
                            <SelectTrigger className="font-mono text-sm flex-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {backendIntegrations.map((integration) => (
                                <SelectItem key={integration} value={integration} className="font-mono text-sm">{integration}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setShowIntegrationModal(true)}
                            className="font-mono text-xs"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-mono text-xs">TIMEOUT_SECONDS</Label>
                        <Input
                          type="number"
                          placeholder="30"
                          value={form.timeout}
                          onChange={(e) => updateForm("timeout", parseInt(e.target.value) || 30)}
                          className="font-mono text-sm"
                        />
                      </div>
                      
                      {/* Navigation */}
                      <div className="flex items-center justify-between pt-6 border-t">
                         <Button 
                           variant="outline"
                           onClick={() => setCurrentStep(2)}
                           className="font-mono text-xs"
                         >
                           <ArrowLeft className="h-4 w-4 mr-2" />
                           Previous: Form Maker
                         </Button>
                         <Button 
                           onClick={() => setCurrentStep(4)}
                           disabled={!form.backendIntegration}
                           className="font-mono text-xs"
                         >
                           Next: Permissions
                           <ArrowRight className="h-4 w-4 ml-2" />
                         </Button>
                       </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="4" className="mt-6">
                  <Card>
                    <CardContent className="space-y-4 pt-6">
                      <div className="space-y-2">
                        <Label className="font-mono text-xs">APPROVAL_REQUIRED</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="approval-required"
                            checked={form.approvalRequired}
                            onChange={(e) => updateForm("approvalRequired", e.target.checked)}
                            className="rounded"
                          />
                          <Label htmlFor="approval-required" className="font-mono text-sm">
                            Require approval before execution
                          </Label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-mono text-xs">ALLOWED_ROLES</Label>
                        <Select value={form.allowedRoles[0] || ""} onValueChange={(value) => updateForm("allowedRoles", [value])}>
                          <SelectTrigger className="font-mono text-sm">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role} value={role} className="font-mono text-sm">{role}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="font-mono text-xs">RATE_LIMIT</Label>
                          <Input
                            type="number"
                            placeholder="10"
                            value={form.rateLimit}
                            onChange={(e) => updateForm("rateLimit", parseInt(e.target.value) || 10)}
                            className="font-mono text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="font-mono text-xs">TTL_HOURS</Label>
                          <Input
                            type="number"
                            placeholder="24"
                            value={form.ttl}
                            onChange={(e) => updateForm("ttl", parseInt(e.target.value) || 24)}
                            className="font-mono text-sm"
                          />
                        </div>
                      </div>
                      
                      {/* Navigation */}
                      <div className="flex items-center justify-between pt-6 border-t">
                         <Button 
                           variant="outline"
                           onClick={() => setCurrentStep(3)}
                           className="font-mono text-xs"
                         >
                           <ArrowLeft className="h-4 w-4 mr-2" />
                           Previous: Backend Integration
                         </Button>
                         <Button 
                           onClick={() => setCurrentStep(1)}
                           className="font-mono text-xs"
                         >
                           <CheckCircle className="h-4 w-4 mr-2" />
                           Complete Setup
                         </Button>
                       </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Form Preview */}
            <div className="w-96">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-mono">
                    <Eye className="h-5 w-5" />
                    FORM_PREVIEW
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    {renderFormPreview()}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground font-mono">
            Step {currentStep} of {steps.length}
          </div>
          <div className="text-sm text-muted-foreground font-mono">
            {form.formFields.length} form fields defined
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handleTestAction}
            disabled={isTesting || !form.title || form.formFields.length === 0}
            className="font-mono text-xs"
          >
            {isTesting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                TESTING...
              </>
            ) : (
              <>
                <TestTube className="h-4 w-4 mr-2" />
                TEST_ACTION
              </>
            )}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !form.title || form.formFields.length === 0}
            className="font-mono text-xs"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                CREATING...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                CREATE_ACTION
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Backend Integration Settings Modal */}
      <Dialog open={showIntegrationModal} onOpenChange={setShowIntegrationModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-mono">
              {currentIntegration && (() => {
                const IconComponent = currentIntegration.icon
                return <IconComponent className="h-5 w-5" />
              })()}
              {currentIntegration?.title || "INTEGRATION_SETTINGS"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {currentIntegration ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground font-mono">
                  Configure settings for {form.backendIntegration} integration
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentIntegration.fields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <Label className="font-mono text-xs">{field.label}</Label>
                      {field.type === "select" ? (
                        <Select 
                          value={integrationConfig[field.name] || ""} 
                          onValueChange={(value) => setIntegrationConfig(prev => ({ ...prev, [field.name]: value }))}
                        >
                          <SelectTrigger className="font-mono text-sm">
                            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option} value={option} className="font-mono text-sm">
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : field.type === "textarea" ? (
                        <Textarea
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          value={integrationConfig[field.name] || ""}
                          onChange={(e) => setIntegrationConfig(prev => ({ ...prev, [field.name]: e.target.value }))}
                          className="font-mono text-sm"
                          rows={3}
                        />
                      ) : (
                        <Input
                          type={field.type}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          value={integrationConfig[field.name] || ""}
                          onChange={(e) => setIntegrationConfig(prev => ({ ...prev, [field.name]: e.target.value }))}
                          className="font-mono text-sm"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground font-mono">
                No configuration required for this integration type
              </div>
            )}
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowIntegrationModal(false)}
                className="font-mono text-xs"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  setShowIntegrationModal(false)
                  toast({
                    title: "Settings Saved",
                    description: "Integration settings have been configured",
                  })
                }}
                className="font-mono text-xs"
              >
                Save Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 