"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { CheckCircle, XCircle, AlertTriangle, Cloud, Server, Shield, Activity, Settings, RefreshCw, Info, X, Database, Lock, Zap, Plus, Search, Play, Clock, History, BarChart3, Code, Users, Bot, Code2 } from "lucide-react"
import { getActionsByBackendIntegration, getBackendIntegrationForService, getAvailableOperations } from "@/lib/actions-data"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CloudIntegrationsProps {
  onQuickAction: (command: string) => void
}

const cloudProviders = [
  {
    id: "aws",
    name: "Amazon Web Services",
    status: "connected",
    region: "us-east-1",
    services: ["EC2", "S3", "RDS", "Lambda", "EKS"],
    resources: 47,
    monthlyCost: "$2,340",
    lastSync: "2 minutes ago",
  },
  {
    id: "gcp",
    name: "Google Cloud Platform",
    status: "connected",
    region: "us-central1",
    services: ["Compute Engine", "Cloud Storage", "Cloud SQL", "GKE"],
    resources: 23,
    monthlyCost: "$890",
    lastSync: "5 minutes ago",
  },
  {
    id: "azure",
    name: "Microsoft Azure",
    status: "disconnected",
    region: "eastus",
    services: ["Virtual Machines", "Blob Storage", "SQL Database"],
    resources: 0,
    monthlyCost: "$0",
    lastSync: "Never",
  },
]

export default function CloudIntegrations({ onQuickAction }: CloudIntegrationsProps) {
  const [selectedProvider, setSelectedProvider] = useState(cloudProviders[0])
  const [actionsDialogOpen, setActionsDialogOpen] = useState(false)
  const [selectedProviderForActions, setSelectedProviderForActions] = useState<any>(null)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "disconnected":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "syncing":
        return <RefreshCw className="h-4 w-4 text-posthog-orange animate-spin" />
      default:
        return <AlertTriangle className="h-4 w-4 text-posthog-gray" />
    }
  }

  const handleViewActions = (provider: any) => {
    setSelectedProviderForActions(provider)
    setActionsDialogOpen(true)
  }

  const getAvailableActions = (provider: any) => {
    const backendIntegrations = getBackendIntegrationForService(provider.name)
    const allActions: any[] = []
    backendIntegrations.forEach(integration => {
      const actions = getActionsByBackendIntegration(integration)
      allActions.push(...actions)
    })
    // Remove duplicates based on action id
    return Array.from(new Map(allActions.map(action => [action.id, action])).values())
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-mono text-posthog-black">CLOUD_INTEGRATIONS</h2>
          {/* <p className="text-posthog-gray font-mono text-sm">MANAGE_CLOUD_PROVIDER_CONNECTIONS_AND_RESOURCES </p>               */}
          <p className="text-posthog-gray font-mono text-sm">Multi-cloud orchestration and management across GCP, AWS, and Azure</p>
        </div>
        <Button
          onClick={() => onQuickAction("sync all cloud providers")}
          className="bg-posthog-orange hover:bg-posthog-orange-dark text-white font-mono text-xs"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          SYNC_ALL
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Provider List */}
        <div className="space-y-4">
          <h3 className="font-mono text-sm font-medium text-posthog-black">CLOUD_PROVIDERS</h3>
          {cloudProviders.map((provider) => (
            <Card
              key={provider.id}
              className={`cursor-pointer transition-all hover:shadow-md border-posthog-cream-dark bg-white ${
                selectedProvider.id === provider.id ? "ring-2 ring-posthog-orange" : ""
              }`}
              onClick={() => setSelectedProvider(provider)}
            >
              <CardContent className="p-4 m-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-posthog-orange" />
                    <span className="font-medium font-mono text-posthog-black text-sm">{provider.name}</span>
                  </div>
                  {getStatusIcon(provider.status)}
                </div>
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-posthog-gray">REGION:</span>
                    <span className="text-posthog-black">{provider.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-posthog-gray">RESOURCES:</span>
                    <span className="text-posthog-black">{provider.resources}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-posthog-gray">COST:</span>
                    <span className="text-posthog-black">{provider.monthlyCost}</span>
                  </div>
                </div>
                <Badge
                  variant={provider.status === "connected" ? "default" : "destructive"}
                  className="mt-2 font-mono text-xs"
                >
                  {provider.status.toUpperCase()}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Provider Details */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="bg-white border border-posthog-cream-dark">
              <TabsTrigger
                value="overview"
                className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white"
              >
                OVERVIEW
              </TabsTrigger>
              <TabsTrigger
                value="services"
                className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white"
              >
                SERVICES
              </TabsTrigger>
              <TabsTrigger
                value="configuration"
                className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white"
              >
                CONFIGURATION
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card className="border-posthog-cream-dark bg-white">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 font-mono text-posthog-black">
                    <Cloud className="h-5 w-5 text-posthog-orange" />
                    {selectedProvider.name.toUpperCase()}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                    <div>
                      <span className="font-medium text-posthog-black">STATUS:</span>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(selectedProvider.status)}
                        <Badge
                          variant={selectedProvider.status === "connected" ? "default" : "destructive"}
                          className="font-mono text-xs"
                        >
                          {selectedProvider.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-posthog-black">REGION:</span>
                      <div className="text-posthog-gray mt-1">{selectedProvider.region}</div>
                    </div>
                    <div>
                      <span className="font-medium text-posthog-black">RESOURCES:</span>
                      <div className="text-posthog-gray mt-1">{selectedProvider.resources} active</div>
                    </div>
                    <div>
                      <span className="font-medium text-posthog-black">MONTHLY_COST:</span>
                      <div className="text-posthog-gray mt-1">{selectedProvider.monthlyCost}</div>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-posthog-black text-sm font-mono">LAST_SYNC:</span>
                    <div className="text-posthog-gray text-sm font-mono mt-1">{selectedProvider.lastSync}</div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-posthog-cream-dark bg-white">
                  <CardHeader>
                    <CardTitle className="text-sm font-mono text-posthog-black">QUICK_ACTIONS</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full justify-start font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                      onClick={() => onQuickAction(`list ${selectedProvider.id} resources`)}
                    >
                      <Server className="h-3 w-3 mr-2" />
                      LIST_RESOURCES
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full justify-start font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                      onClick={() => onQuickAction(`check ${selectedProvider.id} costs`)}
                    >
                      <Activity className="h-3 w-3 mr-2" />
                      CHECK_COSTS
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full justify-start font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                      onClick={() => onQuickAction(`sync ${selectedProvider.id} resources`)}
                    >
                      <RefreshCw className="h-3 w-3 mr-2" />
                      SYNC_NOW
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full justify-start font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                      onClick={() => handleViewActions(selectedProvider)}
                    >
                      <Info className="h-3 w-3 mr-2" />
                      VIEW_ACTIONS
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-posthog-cream-dark bg-white">
                  <CardHeader>
                    <CardTitle className="text-sm font-mono text-posthog-black">RESOURCE_SUMMARY</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm font-mono">
                      <div className="flex justify-between">
                        <span className="text-posthog-gray">COMPUTE:</span>
                        <span className="text-posthog-black">12 instances</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-posthog-gray">STORAGE:</span>
                        <span className="text-posthog-black">2.4 TB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-posthog-gray">DATABASES:</span>
                        <span className="text-posthog-black">5 instances</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-posthog-gray">NETWORKS:</span>
                        <span className="text-posthog-black">3 VPCs</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="services" className="space-y-4">
              <Card className="border-posthog-cream-dark bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-mono text-posthog-black">AVAILABLE_SERVICES</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedProvider.services.map((service, index) => (
                      <div
                        key={index}
                        className="p-3 bg-posthog-cream rounded border border-posthog-cream-dark hover:border-posthog-orange transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Server className="h-4 w-4 text-posthog-orange" />
                          <span className="font-medium font-mono text-posthog-black text-sm">{service}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="outline"
                            className="font-mono text-xs border-posthog-orange text-posthog-orange"
                          >
                            ACTIVE
                          </Badge>
                          <Switch defaultChecked className="data-[state=checked]:bg-posthog-orange" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="configuration" className="space-y-4">
              <Card className="border-posthog-cream-dark bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-mono text-posthog-black">PROVIDER_CONFIGURATION</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="access-key" className="font-mono text-posthog-black">
                        ACCESS_KEY_ID
                      </Label>
                      <Input
                        id="access-key"
                        type="password"
                        defaultValue="AKIA••••••••••••••••"
                        className="border-posthog-orange font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secret-key" className="font-mono text-posthog-black">
                        SECRET_ACCESS_KEY
                      </Label>
                      <Input
                        id="secret-key"
                        type="password"
                        defaultValue="••••••••••••••••••••••••••••••••••••••••"
                        className="border-posthog-orange font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region" className="font-mono text-posthog-black">
                      DEFAULT_REGION
                    </Label>
                    <Input
                      id="region"
                      defaultValue={selectedProvider.region}
                      className="border-posthog-orange font-mono"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button className="bg-posthog-orange hover:bg-posthog-orange-dark text-white font-mono text-xs">
                      <Settings className="h-4 w-4 mr-2" />
                      UPDATE_CONFIG
                    </Button>
                    <Button
                      variant="outline"
                      className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      TEST_CONNECTION
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Available Actions Dialog */}
      <Dialog open={actionsDialogOpen} onOpenChange={setActionsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-white border border-posthog-cream-dark shadow-xl">
          <DialogHeader className="relative">
            <DialogTitle className="font-mono text-posthog-black text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-posthog-orange" />
              {selectedProviderForActions?.name.toUpperCase()}_INTEGRATION
            </DialogTitle>
            <DialogDescription className="font-mono text-xs text-posthog-gray mt-2">
              Available actions and operations/APIs for this cloud provider
            </DialogDescription>
            <button
              onClick={() => {
                setActionsDialogOpen(false)
                setSelectedProviderForActions(null)
              }}
              className="absolute top-0 right-0 p-2 text-posthog-gray hover:text-posthog-orange transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogHeader>
          {selectedProviderForActions && (
            <Tabs defaultValue="operations" className="w-full flex flex-col" style={{ height: 'calc(90vh - 200px)' }}>
              <TabsList className="bg-white border border-posthog-cream-dark mb-4 flex-shrink-0">
                <TabsTrigger
                  value="actions"
                  className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  ACTIONS ({getAvailableActions(selectedProviderForActions).length})
                </TabsTrigger>
                <TabsTrigger
                  value="operations"
                  className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white"
                >
                  <Code2 className="h-4 w-4 mr-2" />
                  OPERATIONS/APIS ({getAvailableOperations(selectedProviderForActions.name).length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="actions" className="mt-0 flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="space-y-3 pr-4">
                {getAvailableActions(selectedProviderForActions).length > 0 ? (
                  getAvailableActions(selectedProviderForActions).map((action) => {
                    const getIconComponent = (iconName: string) => {
                      const iconMap: { [key: string]: any } = {
                        Server, Cloud, Database, Lock, Settings, Zap, Plus, Search, Play, Clock,
                        CheckCircle, XCircle, AlertTriangle, RefreshCw, History, BarChart3, Code, Users, Shield, Bot
                      }
                      return iconMap[iconName] || Zap
                    }
                    const IconComponent = getIconComponent(action.icon)
                    return (
                      <Card key={action.id} className="border-posthog-cream-dark bg-white">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <IconComponent className="h-5 w-5 text-posthog-orange mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-mono text-sm font-medium text-posthog-black">{action.title}</h4>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs font-mono ${
                                      action.category === "create"
                                        ? "border-green-500 text-green-700"
                                        : "border-blue-500 text-blue-700"
                                    }`}
                                  >
                                    {action.category.toUpperCase()}
                                  </Badge>
                                  {action.approvalRequired && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs font-mono border-orange-500 text-orange-700"
                                    >
                                      APPROVAL_REQUIRED
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-posthog-gray font-mono mb-2">{action.description}</p>
                                <div className="flex items-center gap-4 text-xs font-mono">
                                  <div>
                                    <span className="text-posthog-gray">BACKEND:</span>
                                    <span className="text-posthog-black ml-1">{action.backendIntegration}</span>
                                  </div>
                                  <div>
                                    <span className="text-posthog-gray">EXECUTIONS:</span>
                                    <span className="text-posthog-black ml-1">{action.executionCount}</span>
                                  </div>
                                  {action.lastExecuted && (
                                    <div>
                                      <span className="text-posthog-gray">LAST_RUN:</span>
                                      <span className="text-posthog-black ml-1">
                                        {new Date(action.lastExecuted).toLocaleDateString()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                {action.formFields && action.formFields.length > 0 && (
                                  <div className="mt-2">
                                    <span className="text-xs font-mono text-posthog-gray">FORM_FIELDS:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {action.formFields.map((field: any, idx: number) => (
                                        <Badge
                                          key={idx}
                                          variant="outline"
                                          className="text-xs font-mono border-posthog-orange text-posthog-orange"
                                        >
                                          {field.label}
                                          {field.required && " *"}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                ) : (
                  <div className="text-center py-8">
                    <Info className="h-12 w-12 mx-auto text-posthog-gray mb-4" />
                    <p className="text-posthog-gray font-mono text-sm">
                      No actions available for this cloud provider yet
                    </p>
                  </div>
                )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="operations" className="mt-0 flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="space-y-3 pr-4">
                    {getAvailableOperations(selectedProviderForActions.name).length > 0 ? (
                      getAvailableOperations(selectedProviderForActions.name).map((operation, idx) => (
                        <Card key={idx} className="border-posthog-cream-dark bg-white">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <Code2 className="h-5 w-5 text-posthog-orange mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-mono text-sm font-medium text-posthog-black">{operation.name}</h4>
                                    {operation.method && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs font-mono border-blue-500 text-blue-700"
                                      >
                                        {operation.method.split(' ')[0]}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-posthog-gray font-mono mb-2">{operation.description}</p>
                                  {operation.method && (
                                    <div className="mt-2 p-2 bg-posthog-cream rounded border border-posthog-cream-dark">
                                      <code className="text-xs font-mono text-posthog-black">{operation.method}</code>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Code2 className="h-12 w-12 mx-auto text-posthog-gray mb-4" />
                        <p className="text-posthog-gray font-mono text-sm">
                          No operations/APIs documented for this cloud provider yet
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          )}
          <div className="flex justify-end pt-4 border-t border-posthog-cream-dark">
            <Button
              variant="outline"
              onClick={() => {
                setActionsDialogOpen(false)
                setSelectedProviderForActions(null)
              }}
              className="font-mono text-xs border-posthog-cream-dark text-posthog-gray hover:border-posthog-orange hover:text-posthog-orange bg-transparent"
            >
              CLOSE
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
