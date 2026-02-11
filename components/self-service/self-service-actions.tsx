"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  Trash2,
  Package,
  FileText,
  Grid3X3,
  List,
  Table,
  Edit,
  Pencil,
  Save
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

type ActionStatus = "idle" | "running" | "completed" | "failed" | "success" | "error"

interface Action {
  id: string
  title: string
  description: string
  icon: string
  category: "create" | "day2"
  status: ActionStatus
  lastExecuted?: Date
  executionCount: number
  formFields: FormField[]
  backendIntegration: string
  approvalRequired: boolean
  ttl?: number // Time to live in hours
}

interface FormField {
  name: string
  label: string
  type: "text" | "password" | "select" | "textarea" | "number"
  required: boolean
  placeholder?: string
  options?: string[]
  defaultValue?: string
}

interface ExecutionLog {
  id: string
  actionId: string
  timestamp: Date
  status: "running" | "completed" | "failed"
  duration?: number
  output?: string
  error?: string
}

import { initialActions, getActionsByCategory, getActionById, getActionsByEntityType } from "@/lib/actions-data"

const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    Server,
    Github,
    Slack,
    Lock,
    Settings,
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
    Cloud,
    Database,
    Code,
    Users,
    Shield,
    Bot
  }
  return iconMap[iconName] || Zap
}

export default function SelfServiceActions() {
  const [actions, setActions] = useState<Action[]>(initialActions)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<"all" | "create" | "day2">("all")
  const [viewMode, setViewMode] = useState<"card" | "list" | "table">("table")
  const [executingAction, setExecutingAction] = useState<string | null>(null)
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([])
  const [formData, setFormData] = useState<{ [key: string]: string }>({})
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({})
  const [editingAction, setEditingAction] = useState<Action | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const filteredActions = actions.filter(action => {
    const matchesSearch = action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         action.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || action.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const createActions = filteredActions.filter(action => action.category === "create")
  const day2Actions = filteredActions.filter(action => action.category === "day2")

  const handleExecuteAction = async (actionId: string) => {
    const action = actions.find(a => a.id === actionId)
    if (!action) return

    setExecutingAction(actionId)
    
    // Simulate execution
    setTimeout(() => {
      const success = Math.random() > 0.2 // 80% success rate
      const newStatus: ActionStatus = success ? "completed" : "failed"
      
      setActions(prev => prev.map(a => 
        a.id === actionId 
          ? { ...a, status: newStatus, executionCount: a.executionCount + 1, lastExecuted: new Date() }
          : a
      ))

      // Add execution log
      const log: ExecutionLog = {
        id: Date.now().toString(),
        actionId,
        timestamp: new Date(),
        status: success ? "completed" : "failed",
        duration: Math.floor(Math.random() * 30) + 5, // 5-35 seconds
        output: success ? "Action executed successfully" : "Action failed due to configuration error",
        error: success ? undefined : "Backend service unavailable"
      }
      setExecutionLogs(prev => [log, ...prev])

      setExecutingAction(null)
      setFormData({})
      
      toast({
        title: success ? "Action Executed" : "Action Failed",
        description: success ? "The action has been executed successfully" : "Failed to execute action",
        variant: success ? "default" : "destructive"
      })
    }, 2000)
  }

  const handleFormSubmit = (actionId: string) => {
    const action = actions.find(a => a.id === actionId)
    if (!action) return

    // Validate required fields
    const requiredFields = action.formFields.filter(field => field.required)
    const missingFields = requiredFields.filter(field => !formData[field.name])
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill in: ${missingFields.map(f => f.label).join(", ")}`,
        variant: "destructive"
      })
      return
    }

    handleExecuteAction(actionId)
  }

  const handleEditAction = (action: Action) => {
    setEditingAction(action)
    setEditDialogOpen(true)
  }

  const handleSaveEdit = (updatedAction: Action) => {
    setActions(prev => prev.map(a => a.id === updatedAction.id ? updatedAction : a))
    setEditDialogOpen(false)
    setEditingAction(null)
    toast({
      title: "Action Updated",
      description: `${updatedAction.title} has been updated successfully`,
      variant: "default"
    })
  }

  const handleDeleteAction = (actionId: string) => {
    const action = actions.find(a => a.id === actionId)
    if (!action) return

    if (confirm(`Are you sure you want to delete "${action.title}"?`)) {
      setActions(prev => prev.filter(a => a.id !== actionId))
      toast({
        title: "Action Deleted",
        description: `${action.title} has been deleted`,
        variant: "default"
      })
    }
  }

  const getStatusIcon = (status: ActionStatus) => {
    switch (status) {
      case "running":
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const renderCardView = (actions: Action[]) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {actions.map((action) => {
        const IconComponent = getIconComponent(action.icon)
        return (
          <Card key={action.id} className="border-posthog-cream-dark bg-white hover:border-posthog-orange transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5 text-posthog-orange" />
                  <CardTitle className="text-lg font-mono text-posthog-black">{action.title}</CardTitle>
                </div>
                {getStatusIcon(action.status)}
              </div>
              <p className="text-sm text-posthog-gray font-mono">{action.description}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-posthog-gray font-mono">Executed {action.executionCount} times</span>
                {action.lastExecuted && (
                  <span className="text-posthog-gray font-mono">
                    {new Date(action.lastExecuted).toLocaleDateString()}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-mono border-posthog-orange text-posthog-orange">
                  {action.backendIntegration}
                </Badge>
                {action.approvalRequired && (
                  <Badge variant="outline" className="text-xs font-mono border-posthog-orange text-posthog-orange">
                    Approval Required
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                  onClick={() => handleEditAction(action)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  EDIT
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex-1 font-mono text-xs bg-posthog-orange hover:bg-posthog-orange-dark text-white" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      EXECUTE
                    </Button>
                  </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5" />
                      {action.title}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                    
                    <div className="space-y-3">
                      {action.formFields.map((field) => renderFormField(field, action.id))}
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => handleFormSubmit(action.id)}
                        disabled={executingAction === action.id}
                        className="flex-1"
                      >
                        {executingAction === action.id ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Executing...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Execute
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              </div>
            </CardContent>
          </Card>
        )
      })}
      </div>
    )
  }

  const renderListView = (actions: Action[]) => {
    return (
      <div className="space-y-3">
      {actions.map((action) => {
        const IconComponent = getIconComponent(action.icon)
        return (
          <Card key={action.id} className="border-posthog-cream-dark bg-white hover:border-posthog-orange transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <IconComponent className="h-5 w-5 text-posthog-orange" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-sm font-mono font-medium text-posthog-black">{action.title}</h4>
                      {getStatusIcon(action.status)}
                    </div>
                    <p className="text-sm text-posthog-gray font-mono">{action.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-xs font-mono text-posthog-gray">
                  <span>Executed {action.executionCount} times</span>
                  {action.lastExecuted && (
                    <span>{new Date(action.lastExecuted).toLocaleDateString()}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-mono border-posthog-orange text-posthog-orange">
                    {action.backendIntegration}
                  </Badge>
                  {action.approvalRequired && (
                    <Badge variant="outline" className="text-xs font-mono border-posthog-orange text-posthog-orange">
                      Approval Required
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                    onClick={() => handleEditAction(action)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    EDIT
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="font-mono text-xs bg-posthog-orange hover:bg-posthog-orange-dark text-white" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        EXECUTE
                      </Button>
                    </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <IconComponent className="h-5 w-5" />
                        {action.title}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                      
                      <div className="space-y-3">
                        {action.formFields.map((field) => renderFormField(field, action.id))}
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={() => handleFormSubmit(action.id)}
                          disabled={executingAction === action.id}
                          className="flex-1"
                        >
                          {executingAction === action.id ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Executing...
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Execute
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
      </div>
    )
  }

  const renderTableView = (actions: Action[]) => {
    return (
    <div className="border border-posthog-cream-dark rounded-lg overflow-hidden">
      <div className="bg-posthog-cream px-4 py-3 border-b border-posthog-cream-dark">
        <div className="grid grid-cols-12 gap-4 font-mono text-xs font-medium text-posthog-black">
          <div className="col-span-3">ACTION</div>
          <div className="col-span-4">DESCRIPTION</div>
          <div className="col-span-2">INTEGRATION</div>
          <div className="col-span-1">STATUS</div>
          <div className="col-span-1">EXECUTIONS</div>
          <div className="col-span-1">ACTIONS</div>
        </div>
      </div>
      
      <div className="bg-white">
        {actions.map((action) => {
          const IconComponent = getIconComponent(action.icon)
          return (
            <div key={action.id} className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-posthog-cream-dark hover:bg-posthog-cream transition-colors">
              <div className="col-span-3 flex items-center gap-2">
                <IconComponent className="h-4 w-4 text-posthog-orange" />
                <span className="font-mono text-sm font-medium text-posthog-black">{action.title}</span>
              </div>
              <div className="col-span-4">
                <p className="font-mono text-xs text-posthog-gray">{action.description}</p>
              </div>
              <div className="col-span-2">
                <Badge variant="outline" className="text-xs font-mono border-posthog-orange text-posthog-orange">
                  {action.backendIntegration}
                </Badge>
              </div>
              <div className="col-span-1 flex items-center justify-center">
                {getStatusIcon(action.status)}
              </div>
              <div className="col-span-1 text-center">
                <span className="font-mono text-xs text-posthog-gray">{action.executionCount}</span>
              </div>
              <div className="col-span-1 flex items-center justify-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                  onClick={() => handleEditAction(action)}
                  title="Edit Action"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="h-8 w-8 p-0 font-mono text-xs bg-posthog-orange hover:bg-posthog-orange-dark text-white" size="sm" title="Execute Action">
                      <Play className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <IconComponent className="h-5 w-5" />
                        {action.title}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                      
                      <div className="space-y-3">
                        {action.formFields.map((field) => renderFormField(field, action.id))}
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={() => handleFormSubmit(action.id)}
                          disabled={executingAction === action.id}
                          className="flex-1"
                        >
                          {executingAction === action.id ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Executing...
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Execute
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )
        })}
      </div>
    </div>
    )
  }

  const renderFormField = (field: FormField, actionId: string) => {
    const fieldId = `${actionId}-${field.name}`
    
    switch (field.type) {
      case "password":
        return (
          <div key={fieldId} className="space-y-2">
            <Label htmlFor={fieldId}>{field.label}{field.required && " *"}</Label>
            <div className="relative">
              <Input
                id={fieldId}
                type={showPasswords[fieldId] ? "text" : "password"}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                required={field.required}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPasswords(prev => ({ ...prev, [fieldId]: !prev[fieldId] }))}
              >
                {showPasswords[fieldId] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )
      
      case "select":
        return (
          <div key={fieldId} className="space-y-2">
            <Label htmlFor={fieldId}>{field.label}{field.required && " *"}</Label>
            <Select
              value={formData[field.name] || field.defaultValue || ""}
              onValueChange={(value) => setFormData(prev => ({ ...prev, [field.name]: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      
      case "textarea":
        return (
          <div key={fieldId} className="space-y-2">
            <Label htmlFor={fieldId}>{field.label}{field.required && " *"}</Label>
            <Textarea
              id={fieldId}
              placeholder={field.placeholder}
              value={formData[field.name] || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
              required={field.required}
              rows={3}
            />
          </div>
        )
      
      default:
        return (
          <div key={fieldId} className="space-y-2">
            <Label htmlFor={fieldId}>{field.label}{field.required && " *"}</Label>
            <Input
              id={fieldId}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.name] || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
              required={field.required}
            />
          </div>
        )
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 font-mono text-posthog-black">
            <Zap className="h-6 w-6 text-posthog-orange" />
            SELF_SERVICE_ACTIONS
          </h1>
          <p className="text-posthog-gray font-mono text-sm">EXECUTE_ACTIONS_AND_MANAGE_INFRASTRUCTURE</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center border border-posthog-cream-dark rounded-md p-1 bg-white">
            <Button
              variant={viewMode === "card" ? "default" : "ghost"}
              size="sm"
              className={`h-8 px-3 font-mono text-xs ${viewMode === "card" ? "bg-posthog-orange text-white" : "text-posthog-gray hover:text-posthog-black"}`}
              onClick={() => setViewMode("card")}
            >
              <Grid3X3 className="h-4 w-4 mr-1" />
              CARDS
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className={`h-8 px-3 font-mono text-xs ${viewMode === "list" ? "bg-posthog-orange text-white" : "text-posthog-gray hover:text-posthog-black"}`}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4 mr-1" />
              LIST
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              className={`h-8 px-3 font-mono text-xs ${viewMode === "table" ? "bg-posthog-orange text-white" : "text-posthog-gray hover:text-posthog-black"}`}
              onClick={() => setViewMode("table")}
            >
              <Table className="h-4 w-4 mr-1" />
              TABLE
            </Button>
          </div>
          
          <Button variant="outline" size="sm" className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent">
            <History className="h-4 w-4 mr-2" />
            HISTORY
          </Button>
          <Button variant="outline" size="sm" className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent">
            <BarChart3 className="h-4 w-4 mr-2" />
            ANALYTICS
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-posthog-gray h-4 w-4" />
          <Input
            placeholder="Search actions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 font-mono text-sm border-posthog-cream-dark focus:border-posthog-orange"
          />
        </div>
        <Select value={selectedCategory} onValueChange={(value: any) => setSelectedCategory(value)}>
          <SelectTrigger className="w-48 font-mono text-xs border-posthog-cream-dark focus:border-posthog-orange">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="font-mono text-xs">ALL_ACTIONS</SelectItem>
            <SelectItem value="create" className="font-mono text-xs">CREATE_ACTIONS</SelectItem>
            <SelectItem value="day2" className="font-mono text-xs">DAY_2_OPERATIONS</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Actions Grid */}
      <Tabs defaultValue="create" className="space-y-4">
        <TabsList className="bg-white border border-posthog-cream-dark">
          <TabsTrigger value="create" className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white">
            CREATE_ACTIONS ({createActions.length})
          </TabsTrigger>
          <TabsTrigger value="day2" className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white">
            DAY_2_OPERATIONS ({day2Actions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          {viewMode === "card" && renderCardView(createActions)}
          {viewMode === "list" && renderListView(createActions)}
          {viewMode === "table" && renderTableView(createActions)}
        </TabsContent>

        <TabsContent value="day2" className="space-y-4">
          {viewMode === "card" && renderCardView(day2Actions)}
          {viewMode === "list" && renderListView(day2Actions)}
          {viewMode === "table" && renderTableView(day2Actions)}
        </TabsContent>
      </Tabs>

      {/* Execution Logs */}
      {executionLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-mono">
              <History className="h-5 w-5" />
              RECENT_EXECUTIONS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {executionLogs.slice(0, 10).map((log) => {
                  const action = actions.find(a => a.id === log.actionId)
                  return (
                    <div key={log.id} className="flex items-center justify-between p-2 rounded-lg border">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(log.status)}
                        <div>
                          <p className="font-medium">{action?.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {log.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {log.duration}s
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {log.status}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Edit Action Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-mono text-posthog-black flex items-center gap-2">
              <Edit className="h-5 w-5 text-posthog-orange" />
              EDIT_ACTION
            </DialogTitle>
          </DialogHeader>
          {editingAction && (
            <EditActionForm
              action={editingAction}
              onSave={handleSaveEdit}
              onCancel={() => {
                setEditDialogOpen(false)
                setEditingAction(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      </div>
    </div>
  )
}

// Edit Action Form Component
interface EditActionFormProps {
  action: Action
  onSave: (action: Action) => void
  onCancel: () => void
}

const EditActionForm: React.FC<EditActionFormProps> = ({ action, onSave, onCancel }) => {
  const [editedAction, setEditedAction] = useState<Action>({ ...action })
  const availableIcons = ["Zap", "Server", "Database", "Cloud", "Lock", "Settings", "Users", "Shield", "Bot", "Github", "Slack", "Code", "BarChart3", "History", "Play", "Package", "FileText", "Trash2"]
  const backendIntegrations = ["Webhook", "GitHub Workflow", "Azure Pipeline", "Terraform", "ArgoCD", "AWS CLI", "Slack API", "Custom Script", "Kubernetes API", "GitHub API"]

  const handleFieldChange = (field: keyof Action, value: any) => {
    setEditedAction(prev => ({ ...prev, [field]: value }))
  }

  const handleFormFieldChange = (index: number, field: keyof FormField, value: any) => {
    const updatedFields = [...editedAction.formFields]
    updatedFields[index] = { ...updatedFields[index], [field]: value }
    setEditedAction(prev => ({ ...prev, formFields: updatedFields }))
  }

  const handleAddFormField = () => {
    const newField: FormField = {
      name: `field_${Date.now()}`,
      label: "New Field",
      type: "text",
      required: false,
      placeholder: ""
    }
    setEditedAction(prev => ({
      ...prev,
      formFields: [...prev.formFields, newField]
    }))
  }

  const handleRemoveFormField = (index: number) => {
    setEditedAction(prev => ({
      ...prev,
      formFields: prev.formFields.filter((_, i) => i !== index)
    }))
  }

  const handleSave = () => {
    if (!editedAction.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive"
      })
      return
    }
    onSave(editedAction)
  }

  return (
    <div className="space-y-4 mt-4">
      {/* Basic Information */}
      <div className="space-y-3">
        <div>
          <Label className="font-mono text-xs text-posthog-black">TITLE</Label>
          <Input
            value={editedAction.title}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            className="font-mono text-sm border-posthog-cream-dark focus:border-posthog-orange"
            placeholder="Action title"
          />
        </div>
        <div>
          <Label className="font-mono text-xs text-posthog-black">DESCRIPTION</Label>
          <Textarea
            value={editedAction.description}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            className="font-mono text-sm border-posthog-cream-dark focus:border-posthog-orange"
            placeholder="Action description"
            rows={3}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="font-mono text-xs text-posthog-black">ICON</Label>
            <Select
              value={editedAction.icon}
              onValueChange={(value) => handleFieldChange("icon", value)}
            >
              <SelectTrigger className="font-mono text-sm border-posthog-cream-dark focus:border-posthog-orange">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableIcons.map((icon) => (
                  <SelectItem key={icon} value={icon} className="font-mono text-xs">
                    {icon}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="font-mono text-xs text-posthog-black">CATEGORY</Label>
            <Select
              value={editedAction.category}
              onValueChange={(value: "create" | "day2") => handleFieldChange("category", value)}
            >
              <SelectTrigger className="font-mono text-sm border-posthog-cream-dark focus:border-posthog-orange">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="create" className="font-mono text-xs">CREATE</SelectItem>
                <SelectItem value="day2" className="font-mono text-xs">DAY_2_OPERATIONS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label className="font-mono text-xs text-posthog-black">BACKEND_INTEGRATION</Label>
          <Select
            value={editedAction.backendIntegration}
            onValueChange={(value) => handleFieldChange("backendIntegration", value)}
          >
            <SelectTrigger className="font-mono text-sm border-posthog-cream-dark focus:border-posthog-orange">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {backendIntegrations.map((integration) => (
                <SelectItem key={integration} value={integration} className="font-mono text-xs">
                  {integration}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="approvalRequired"
            checked={editedAction.approvalRequired}
            onChange={(e) => handleFieldChange("approvalRequired", e.target.checked)}
            className="rounded border-posthog-cream-dark"
          />
          <Label htmlFor="approvalRequired" className="font-mono text-xs text-posthog-black cursor-pointer">
            APPROVAL_REQUIRED
          </Label>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="font-mono text-xs text-posthog-black font-bold">FORM_FIELDS</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddFormField}
            className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white"
          >
            <Plus className="h-3 w-3 mr-1" />
            ADD_FIELD
          </Button>
        </div>
        <ScrollArea className="h-64 border border-posthog-cream-dark rounded-lg p-3">
          <div className="space-y-3">
            {editedAction.formFields.map((field, index) => (
              <Card key={index} className="border-posthog-cream-dark bg-white p-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-medium text-posthog-black">FIELD_{index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFormField(index)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="font-mono text-xs text-posthog-gray">Label</Label>
                      <Input
                        value={field.label}
                        onChange={(e) => handleFormFieldChange(index, "label", e.target.value)}
                        className="font-mono text-xs border-posthog-cream-dark"
                        placeholder="Field label"
                      />
                    </div>
                    <div>
                      <Label className="font-mono text-xs text-posthog-gray">Type</Label>
                      <Select
                        value={field.type}
                        onValueChange={(value) => handleFormFieldChange(index, "type", value)}
                      >
                        <SelectTrigger className="font-mono text-xs border-posthog-cream-dark">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text" className="font-mono text-xs">Text</SelectItem>
                          <SelectItem value="textarea" className="font-mono text-xs">Textarea</SelectItem>
                          <SelectItem value="select" className="font-mono text-xs">Select</SelectItem>
                          <SelectItem value="number" className="font-mono text-xs">Number</SelectItem>
                          <SelectItem value="password" className="font-mono text-xs">Password</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => handleFormFieldChange(index, "required", e.target.checked)}
                      className="rounded border-posthog-cream-dark"
                    />
                    <Label className="font-mono text-xs text-posthog-gray cursor-pointer">Required</Label>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-posthog-cream-dark">
        <Button
          onClick={handleSave}
          className="flex-1 font-mono text-xs bg-posthog-orange hover:bg-posthog-orange-dark text-white"
        >
          <Save className="h-4 w-4 mr-2" />
          SAVE_CHANGES
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white"
        >
          CANCEL
        </Button>
      </div>
    </div>
  )
} 