"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Server,
  Database,
  Zap,
  Activity,
  Search,
  Code,
  Globe,
  GitBranch,
  Settings,
  Monitor,
  CheckCircle,
  Clock,
} from "lucide-react"

interface ServiceOnboardingFormProps {
  onServiceAdded: (service: any) => void
}

const serviceTypes = [
  { id: "web-app", name: "WEB_APPLICATION", icon: Globe, description: "Frontend web application" },
  { id: "api", name: "REST_API", icon: Server, description: "RESTful API service" },
  { id: "microservice", name: "MICROSERVICE", icon: Database, description: "Microservice component" },
  { id: "worker", name: "BACKGROUND_WORKER", icon: Activity, description: "Background job processor" },
  { id: "data-pipeline", name: "DATA_PIPELINE", icon: Search, description: "Data processing pipeline" },
  { id: "lambda", name: "SERVERLESS_FUNCTION", icon: Zap, description: "Serverless function" },
]

const environments = [
  { id: "development", name: "DEVELOPMENT", color: "bg-blue-100 text-blue-800" },
  { id: "staging", name: "STAGING", color: "bg-yellow-100 text-yellow-800" },
  { id: "production", name: "PRODUCTION", color: "bg-green-100 text-green-800" },
]

const frameworks = [
  "NEXT.JS",
  "REACT",
  "VUE",
  "ANGULAR",
  "SVELTE",
  "EXPRESS",
  "FASTAPI",
  "DJANGO",
  "FLASK",
  "SPRING_BOOT",
  "LARAVEL",
  "RAILS",
]

const cloudProviders = [
  { id: "aws", name: "AWS", icon: "🟠" },
  { id: "gcp", name: "GOOGLE_CLOUD", icon: "🔵" },
  { id: "azure", name: "AZURE", icon: "🔷" },
  { id: "vercel", name: "VERCEL", icon: "⚫" },
  { id: "netlify", name: "NETLIFY", icon: "🟢" },
]

export default function ServiceOnboardingForm({ onServiceAdded }: ServiceOnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    // Basic Info
    name: "",
    description: "",
    type: "",
    framework: "",

    // Repository
    repository: "",
    branch: "main",
    buildCommand: "",
    startCommand: "",

    // Deployment
    environment: "",
    cloudProvider: "",
    region: "us-east-1",
    instances: 1,

    // Configuration
    envVars: [{ key: "", value: "" }],
    healthCheckPath: "/health",
    port: "3000",

    // Monitoring
    enableMetrics: true,
    enableLogs: true,
    enableAlerts: true,
    alertEmail: "",
  })

  const steps = [
    { id: "basic", name: "BASIC_INFO", icon: Code },
    { id: "repository", name: "REPOSITORY", icon: GitBranch },
    { id: "deployment", name: "DEPLOYMENT", icon: Server },
    { id: "config", name: "CONFIGURATION", icon: Settings },
    { id: "monitoring", name: "MONITORING", icon: Monitor },
    { id: "review", name: "REVIEW", icon: CheckCircle },
  ]

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addEnvVar = () => {
    setFormData((prev) => ({
      ...prev,
      envVars: [...prev.envVars, { key: "", value: "" }],
    }))
  }

  const updateEnvVar = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      envVars: prev.envVars.map((env, i) => (i === index ? { ...env, [field]: value } : env)),
    }))
  }

  const removeEnvVar = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      envVars: prev.envVars.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = () => {
    const newService = {
      id: formData.name.toLowerCase().replace(/\s+/g, "-"),
      name: formData.name,
      icon: serviceTypes.find((t) => t.id === formData.type)?.icon || Server,
      status: "deploying",
      environment: formData.environment,
      type: formData.type,
      repository: formData.repository,
      metrics: {
        cpu: 0,
        memory: 0,
        instances: formData.instances,
      },
      ...formData,
    }

    onServiceAdded(newService)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return (
          <div className="space-y-4">
            <div>
              <Label className="font-mono text-posthog-black">SERVICE_NAME</Label>
              <Input
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                placeholder="my-awesome-service"
                className="border-posthog-orange font-mono"
              />
            </div>

            <div>
              <Label className="font-mono text-posthog-black">DESCRIPTION</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                placeholder="DESCRIBE_WHAT_THIS_SERVICE_DOES..."
                className="border-posthog-orange font-mono"
              />
            </div>

            <div>
              <Label className="font-mono text-posthog-black">SERVICE_TYPE</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {serviceTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => updateFormData("type", type.id)}
                    className={`p-3 rounded border text-left transition-all font-mono ${
                      formData.type === type.id
                        ? "border-posthog-orange bg-posthog-orange-light"
                        : "border-posthog-cream-dark hover:border-posthog-orange"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <type.icon className="h-4 w-4 text-posthog-orange" />
                      <span className="text-sm font-medium text-posthog-black">{type.name}</span>
                    </div>
                    <p className="text-xs text-posthog-gray">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="font-mono text-posthog-black">FRAMEWORK</Label>
              <Select value={formData.framework} onValueChange={(value) => updateFormData("framework", value)}>
                <SelectTrigger className="border-posthog-orange font-mono">
                  <SelectValue placeholder="SELECT_FRAMEWORK" />
                </SelectTrigger>
                <SelectContent>
                  {frameworks.map((framework) => (
                    <SelectItem key={framework} value={framework.toLowerCase()}>
                      {framework}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 1: // Repository
        return (
          <div className="space-y-4">
            <div>
              <Label className="font-mono text-posthog-black">REPOSITORY_URL</Label>
              <Input
                value={formData.repository}
                onChange={(e) => updateFormData("repository", e.target.value)}
                placeholder="https://github.com/username/repo"
                className="border-posthog-orange font-mono"
              />
            </div>

            <div>
              <Label className="font-mono text-posthog-black">BRANCH</Label>
              <Input
                value={formData.branch}
                onChange={(e) => updateFormData("branch", e.target.value)}
                placeholder="main"
                className="border-posthog-orange font-mono"
              />
            </div>

            <div>
              <Label className="font-mono text-posthog-black">BUILD_COMMAND</Label>
              <Input
                value={formData.buildCommand}
                onChange={(e) => updateFormData("buildCommand", e.target.value)}
                placeholder="npm run build"
                className="border-posthog-orange font-mono"
              />
            </div>

            <div>
              <Label className="font-mono text-posthog-black">START_COMMAND</Label>
              <Input
                value={formData.startCommand}
                onChange={(e) => updateFormData("startCommand", e.target.value)}
                placeholder="npm start"
                className="border-posthog-orange font-mono"
              />
            </div>
          </div>
        )

      case 2: // Deployment
        return (
          <div className="space-y-4">
            <div>
              <Label className="font-mono text-posthog-black">ENVIRONMENT</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {environments.map((env) => (
                  <button
                    key={env.id}
                    onClick={() => updateFormData("environment", env.id)}
                    className={`p-3 rounded border text-center transition-all font-mono ${
                      formData.environment === env.id
                        ? "border-posthog-orange bg-posthog-orange-light"
                        : "border-posthog-cream-dark hover:border-posthog-orange"
                    }`}
                  >
                    <span className="text-sm font-medium text-posthog-black">{env.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="font-mono text-posthog-black">CLOUD_PROVIDER</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {cloudProviders.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => updateFormData("cloudProvider", provider.id)}
                    className={`p-3 rounded border text-left transition-all font-mono ${
                      formData.cloudProvider === provider.id
                        ? "border-posthog-orange bg-posthog-orange-light"
                        : "border-posthog-cream-dark hover:border-posthog-orange"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{provider.icon}</span>
                      <span className="text-sm font-medium text-posthog-black">{provider.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-mono text-posthog-black">REGION</Label>
                <Input
                  value={formData.region}
                  onChange={(e) => updateFormData("region", e.target.value)}
                  className="border-posthog-orange font-mono"
                />
              </div>
              <div>
                <Label className="font-mono text-posthog-black">INSTANCES</Label>
                <Input
                  type="number"
                  value={formData.instances}
                  onChange={(e) => updateFormData("instances", Number.parseInt(e.target.value))}
                  min="1"
                  max="10"
                  className="border-posthog-orange font-mono"
                />
              </div>
            </div>
          </div>
        )

      case 3: // Configuration
        return (
          <div className="space-y-4">
            <div>
              <Label className="font-mono text-posthog-black">ENVIRONMENT_VARIABLES</Label>
              <div className="space-y-2 mt-2">
                {formData.envVars.map((env, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="KEY"
                      value={env.key}
                      onChange={(e) => updateEnvVar(index, "key", e.target.value)}
                      className="border-posthog-orange font-mono"
                    />
                    <Input
                      placeholder="VALUE"
                      value={env.value}
                      onChange={(e) => updateEnvVar(index, "value", e.target.value)}
                      className="border-posthog-orange font-mono"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeEnvVar(index)}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addEnvVar}
                  className="border-posthog-orange text-posthog-orange hover:bg-posthog-orange-light font-mono bg-transparent"
                >
                  ADD_VARIABLE
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-mono text-posthog-black">HEALTH_CHECK_PATH</Label>
                <Input
                  value={formData.healthCheckPath}
                  onChange={(e) => updateFormData("healthCheckPath", e.target.value)}
                  className="border-posthog-orange font-mono"
                />
              </div>
              <div>
                <Label className="font-mono text-posthog-black">PORT</Label>
                <Input
                  value={formData.port}
                  onChange={(e) => updateFormData("port", e.target.value)}
                  className="border-posthog-orange font-mono"
                />
              </div>
            </div>
          </div>
        )

      case 4: // Monitoring
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="metrics"
                  checked={formData.enableMetrics}
                  onCheckedChange={(checked) => updateFormData("enableMetrics", checked)}
                />
                <Label htmlFor="metrics" className="font-mono text-posthog-black">
                  ENABLE_METRICS_COLLECTION
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="logs"
                  checked={formData.enableLogs}
                  onCheckedChange={(checked) => updateFormData("enableLogs", checked)}
                />
                <Label htmlFor="logs" className="font-mono text-posthog-black">
                  ENABLE_LOG_AGGREGATION
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="alerts"
                  checked={formData.enableAlerts}
                  onCheckedChange={(checked) => updateFormData("enableAlerts", checked)}
                />
                <Label htmlFor="alerts" className="font-mono text-posthog-black">
                  ENABLE_ALERTING
                </Label>
              </div>
            </div>

            {formData.enableAlerts && (
              <div>
                <Label className="font-mono text-posthog-black">ALERT_EMAIL</Label>
                <Input
                  type="email"
                  value={formData.alertEmail}
                  onChange={(e) => updateFormData("alertEmail", e.target.value)}
                  placeholder="alerts@company.com"
                  className="border-posthog-orange font-mono"
                />
              </div>
            )}
          </div>
        )

      case 5: // Review
        return (
          <div className="space-y-4">
            <Card className="border-posthog-cream-dark bg-posthog-cream">
              <CardHeader>
                <CardTitle className="font-mono text-posthog-black">SERVICE_CONFIGURATION_REVIEW</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 font-mono text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-posthog-black">NAME:</span>
                    <p className="text-posthog-gray">{formData.name || "NOT_SET"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-posthog-black">TYPE:</span>
                    <p className="text-posthog-gray">{formData.type?.toUpperCase() || "NOT_SET"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-posthog-black">FRAMEWORK:</span>
                    <p className="text-posthog-gray">{formData.framework?.toUpperCase() || "NOT_SET"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-posthog-black">ENVIRONMENT:</span>
                    <p className="text-posthog-gray">{formData.environment?.toUpperCase() || "NOT_SET"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-posthog-black">REPOSITORY:</span>
                    <p className="text-posthog-gray break-all">{formData.repository || "NOT_SET"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-posthog-black">CLOUD_PROVIDER:</span>
                    <p className="text-posthog-gray">{formData.cloudProvider?.toUpperCase() || "NOT_SET"}</p>
                  </div>
                </div>

                {formData.envVars.filter((env) => env.key).length > 0 && (
                  <div>
                    <span className="font-medium text-posthog-black">ENVIRONMENT_VARIABLES:</span>
                    <div className="mt-1 space-y-1">
                      {formData.envVars
                        .filter((env) => env.key)
                        .map((env, index) => (
                          <div key={index} className="text-xs bg-white p-2 rounded border">
                            <code>
                              {env.key}={"*".repeat(env.value.length)}
                            </code>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 font-mono text-xs ${
                index <= currentStep
                  ? "border-posthog-orange bg-posthog-orange text-white"
                  : "border-posthog-cream-dark text-posthog-gray"
              }`}
            >
              {index < currentStep ? (
                <CheckCircle className="h-4 w-4" />
              ) : index === currentStep ? (
                <Clock className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-12 h-0.5 mx-2 ${index < currentStep ? "bg-posthog-orange" : "bg-posthog-cream-dark"}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Names */}
      <div className="flex justify-between text-xs font-mono">
        {steps.map((step, index) => (
          <span key={step.id} className={index <= currentStep ? "text-posthog-black" : "text-posthog-gray"}>
            {step.name}
          </span>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">{renderStepContent()}</div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="border-posthog-orange text-posthog-orange hover:bg-posthog-orange-light font-mono"
        >
          PREVIOUS
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            className="bg-posthog-orange hover:bg-posthog-orange-dark text-white font-mono"
          >
            NEXT
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="bg-posthog-orange hover:bg-posthog-orange-dark text-white font-mono"
          >
            DEPLOY_SERVICE
          </Button>
        )}
      </div>
    </div>
  )
}
