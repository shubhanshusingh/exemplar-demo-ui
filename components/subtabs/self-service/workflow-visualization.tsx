'use client'

import React, { useCallback, useMemo, useState } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { 
  GitBranch, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Code,
  Users,
  Shield,
  Package,
  Eye,
  Play,
  Clock,
  Settings,
  Zap,
  ArrowRight,
  Circle,
  Workflow,
  ExternalLink,
  Info,
  Github,
  Server,
  Webhook,
  FileCode,
  FileText,
  BarChart3,
  History,
  Cloud,
  Database,
  Bot,
  Lock,
  Slack
} from 'lucide-react'

interface WorkflowAction {
  id: string
  name: string
  type: 'integration' | 'custom'
  integration?: string // e.g., 'GitHub Workflow', 'Webhook', 'Terraform', etc.
  customActionId?: string
  description?: string
  config?: Record<string, any>
}

interface WorkflowStep {
  id: string
  name: string
  description: string
  type: 'start' | 'process' | 'decision' | 'approval' | 'end'
  icon?: any
  duration?: string
  assignee?: string
  actions?: WorkflowAction[]
}

interface WorkflowVisualizationProps {
  workflow: {
    id: string
    name: string
    description: string
    steps: WorkflowStep[]
    category: string
    complexity: string
  }
  onClose?: () => void
  fullscreen?: boolean
}

const CustomNode = ({ data, selected }: any) => {
  const [showActions, setShowActions] = useState(false)

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Server, Github, Slack, Lock, Settings, Zap, Code, Users, Shield, Bot,
      Package, FileText, BarChart3, History, Play, Cloud, Database, CheckCircle,
      AlertCircle, Eye, GitBranch, Workflow, FileCode, Webhook, Circle
    }
    return iconMap[iconName] || Circle
  }

  const getIcon = () => {
    if (data.icon) {
      // Handle both string (icon name) and component
      if (typeof data.icon === 'string') {
        const IconComponent = getIconComponent(data.icon)
        return <IconComponent className="h-5 w-5" />
      } else if (typeof data.icon === 'function') {
        const IconComponent = data.icon
        return <IconComponent className="h-5 w-5" />
      }
    }
    return <Circle className="h-5 w-5" />
  }

  const getNodeColor = () => {
    switch (data.type) {
      case 'start':
        return 'bg-green-500 border-green-600'
      case 'end':
        return 'bg-red-500 border-red-600'
      case 'decision':
        return 'bg-yellow-500 border-yellow-600'
      case 'approval':
        return 'bg-blue-500 border-blue-600'
      default:
        return 'bg-posthog-orange border-posthog-orange-dark'
    }
  }

  const getActionIcon = (action: WorkflowAction) => {
    if (action.type === 'integration') {
      switch (action.integration) {
        case 'GitHub Workflow':
          return Github
        case 'Webhook':
          return Webhook
        case 'Terraform':
          return FileCode
        case 'ArgoCD':
        case 'Kubernetes API':
          return Server
        default:
          return Settings
      }
    }
    return Zap
  }

  return (
    <>
      <Handle type="target" position={Position.Top} style={{ background: '#FF6B35' }} />
      <div className={`px-4 py-3 rounded-lg border-2 ${getNodeColor()} shadow-lg min-w-[200px] relative`}>
        <div className="flex items-center gap-2 mb-2">
          <div className="text-white">{getIcon()}</div>
          <div className="text-white font-mono text-xs font-bold flex-1">{data.name}</div>
          {data.actions && data.actions.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation()
                setShowActions(true)
              }}
              title="View Actions"
            >
              <Info className="h-3 w-3" />
            </Button>
          )}
        </div>
        {data.description && (
          <div className="text-white/90 font-mono text-xs mt-1">{data.description}</div>
        )}
        {data.duration && (
          <div className="text-white/80 font-mono text-xs mt-1 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {data.duration}
          </div>
        )}
        {data.actions && data.actions.length > 0 && (
          <div className="mt-2 pt-2 border-t border-white/20">
            <div className="text-white/80 font-mono text-xs flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {data.actions.length} {data.actions.length === 1 ? 'Action' : 'Actions'}
            </div>
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: '#FF6B35' }} />

      {/* Actions Dialog */}
      <Dialog open={showActions} onOpenChange={setShowActions}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-mono text-posthog-black">
              NODE_ACTIONS: {data.name}
            </DialogTitle>
            <DialogDescription className="font-mono text-posthog-gray">
              {data.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {data.actions?.map((action: WorkflowAction) => {
              const ActionIcon = getActionIcon(action)
              return (
                <Card key={action.id} className="border-posthog-cream-dark bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-posthog-orange/10 rounded-lg">
                        <ActionIcon className="h-5 w-5 text-posthog-orange" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm font-medium text-posthog-black">
                            {action.name}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs font-mono ${
                              action.type === 'integration' 
                                ? 'border-blue-500 text-blue-600' 
                                : 'border-posthog-orange text-posthog-orange'
                            }`}
                          >
                            {action.type === 'integration' ? 'INTEGRATION' : 'CUSTOM'}
                          </Badge>
                        </div>
                        {action.integration && (
                          <div className="text-xs font-mono text-posthog-gray mb-1">
                            Integration: {action.integration}
                          </div>
                        )}
                        {action.customActionId && (
                          <div className="text-xs font-mono text-posthog-gray mb-1">
                            Action ID: {action.customActionId}
                          </div>
                        )}
                        {action.description && (
                          <p className="text-xs font-mono text-posthog-gray mt-1">
                            {action.description}
                          </p>
                        )}
                        {action.config && Object.keys(action.config).length > 0 && (
                          <div className="mt-2 p-2 bg-posthog-cream rounded border border-posthog-cream-dark">
                            <div className="text-xs font-mono font-bold text-posthog-black mb-1">
                              CONFIGURATION:
                            </div>
                            <div className="space-y-1">
                              {Object.entries(action.config).map(([key, value]) => (
                                <div key={key} className="text-xs font-mono text-posthog-gray">
                                  <span className="font-medium">{key}:</span> {String(value)}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white"
                        onClick={() => {
                          // Navigate to action details or execute action
                          console.log('View action:', action)
                        }}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        VIEW
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

const nodeTypes = {
  custom: CustomNode,
}

export const WorkflowVisualization: React.FC<WorkflowVisualizationProps> = ({ 
  workflow, 
  onClose,
  fullscreen = false
}) => {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = []
    const edges: Edge[] = []

    // Calculate layout positions - horizontal linear flow
    const nodeWidth = 240
    const nodeHeight = 140
    const horizontalSpacing = 300
    const startY = 150

    workflow.steps.forEach((step, index) => {
      // Create node
      nodes.push({
        id: step.id,
        type: 'custom',
        position: { 
          x: index * horizontalSpacing + 50, 
          y: startY 
        },
        data: {
          ...step,
          label: step.name,
        },
        style: {
          width: nodeWidth,
          height: nodeHeight,
        },
      })

      // Connect to next step
      if (index < workflow.steps.length - 1) {
        const nextStep = workflow.steps[index + 1]
        edges.push({
          id: `e${step.id}-${nextStep.id}`,
          source: step.id,
          target: nextStep.id,
          type: 'smoothstep',
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#FF6B35',
          },
          style: {
            stroke: '#FF6B35',
            strokeWidth: 3,
          },
        })
      }
    })

    return { nodes, edges }
  }, [workflow])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  if (fullscreen) {
    return (
      <div className="h-full w-full flex flex-col">
        <div className="flex-1 border border-posthog-cream-dark overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2, maxZoom: 1.5 }}
            className="bg-posthog-cream"
            defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
            connectionLineStyle={{ stroke: '#FF6B35', strokeWidth: 3 }}
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#FF6B35', strokeWidth: 3 },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#FF6B35',
              },
            }}
          >
            <Background color="#E5E5E5" gap={16} />
            <Controls className="bg-white border border-posthog-cream-dark rounded-md" />
            <MiniMap 
              className="bg-white border border-posthog-cream-dark rounded-md"
              nodeColor={(node) => {
                switch (node.data?.type) {
                  case 'start': return '#10B981'
                  case 'end': return '#EF4444'
                  case 'decision': return '#F59E0B'
                  case 'approval': return '#3B82F6'
                  default: return '#FF6B35'
                }
              }}
              pannable
              zoomable
            />
          </ReactFlow>
        </div>
      </div>
    )
  }

  return (
    <Card className="border-posthog-cream-dark bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-mono text-posthog-black flex items-center gap-2">
              <Workflow className="h-5 w-5 text-posthog-orange" />
              {workflow.name}
            </CardTitle>
            <p className="text-sm text-posthog-gray font-mono mt-1">{workflow.description}</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="font-mono text-xs border-posthog-orange text-posthog-orange">
              {workflow.category}
            </Badge>
            <Badge variant="outline" className="font-mono text-xs border-posthog-orange text-posthog-orange">
              {workflow.complexity.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[600px] w-full border border-posthog-cream-dark rounded-lg overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2, maxZoom: 1.5 }}
            className="bg-posthog-cream"
            defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
            connectionLineStyle={{ stroke: '#FF6B35', strokeWidth: 3 }}
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#FF6B35', strokeWidth: 3 },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#FF6B35',
              },
            }}
          >
            <Background color="#E5E5E5" gap={16} />
            <Controls className="bg-white border border-posthog-cream-dark rounded-md" />
            <MiniMap 
              className="bg-white border border-posthog-cream-dark rounded-md"
              nodeColor={(node) => {
                switch (node.data?.type) {
                  case 'start': return '#10B981'
                  case 'end': return '#EF4444'
                  case 'decision': return '#F59E0B'
                  case 'approval': return '#3B82F6'
                  default: return '#FF6B35'
                }
              }}
              pannable
              zoomable
            />
          </ReactFlow>
        </div>
        
        {/* Step Details */}
        <div className="mt-4 space-y-2">
          <h4 className="font-mono text-sm font-bold text-posthog-black">WORKFLOW_STEPS</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {workflow.steps.map((step, index) => (
              <div 
                key={step.id} 
                className="flex items-start gap-3 p-3 bg-posthog-cream rounded border border-posthog-cream-dark"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-posthog-orange text-white flex items-center justify-center font-mono text-xs font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {step.icon && typeof step.icon === 'string' && (
                      <span className="font-mono text-xs text-posthog-orange">{step.icon}</span>
                    )}
                    <span className="font-mono text-sm font-medium text-posthog-black">{step.name}</span>
                    <Badge 
                      variant="outline" 
                      className="text-xs font-mono border-posthog-orange text-posthog-orange"
                    >
                      {step.type.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs font-mono text-posthog-gray">{step.description}</p>
                  {step.duration && (
                    <div className="text-xs font-mono text-posthog-gray mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {step.duration}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

