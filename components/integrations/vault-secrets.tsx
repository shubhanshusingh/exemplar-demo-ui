"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Key,
  Lock,
  Shield,
  Eye,
  EyeOff,
  Plus,
  RefreshCw,
  Copy,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"

interface VaultSecretsProps {
  onQuickAction: (command: string) => void
}

const secrets = [
  {
    id: "db-password",
    name: "DATABASE_PASSWORD",
    type: "password",
    service: "payment-service",
    environment: "production",
    lastRotated: "7 days ago",
    expiresIn: "23 days",
    status: "active",
    description: "Primary database connection password",
  },
  {
    id: "api-key-stripe",
    name: "STRIPE_API_KEY",
    type: "api_key",
    service: "payment-service",
    environment: "production",
    lastRotated: "30 days ago",
    expiresIn: "335 days",
    status: "active",
    description: "Stripe payment processing API key",
  },
  {
    id: "jwt-secret",
    name: "JWT_SECRET",
    type: "secret",
    service: "auth-service",
    environment: "production",
    lastRotated: "90 days ago",
    expiresIn: "275 days",
    status: "expiring_soon",
    description: "JWT token signing secret",
  },
  {
    id: "oauth-client",
    name: "OAUTH_CLIENT_SECRET",
    type: "oauth",
    service: "auth-service",
    environment: "production",
    lastRotated: "15 days ago",
    expiresIn: "350 days",
    status: "active",
    description: "OAuth client secret for third-party authentication",
  },
  {
    id: "redis-password",
    name: "REDIS_PASSWORD",
    type: "password",
    service: "cache-service",
    environment: "staging",
    lastRotated: "2 days ago",
    expiresIn: "88 days",
    status: "active",
    description: "Redis cache connection password",
  },
]

export default function VaultSecrets({ onQuickAction }: VaultSecretsProps) {
  const [selectedSecret, setSelectedSecret] = useState<any>(null)
  const [showValue, setShowValue] = useState<{ [key: string]: boolean }>({})
  const [isAddingSecret, setIsAddingSecret] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "expiring_soon":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "expired":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-posthog-gray" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      expiring_soon: "secondary",
      expired: "destructive",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"} className="font-mono text-xs">
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    )
  }

  const toggleSecretVisibility = (secretId: string) => {
    setShowValue((prev) => ({
      ...prev,
      [secretId]: !prev[secretId],
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-mono text-posthog-black">VAULT_&_SECRETS</h2>
          {/* <p className="text-posthog-gray font-mono text-sm">SECURE_SECRET_MANAGEMENT_AND_ROTATION </p> */}
          <p className="text-posthog-gray font-mono text-sm">Secure secret management, API keys, and credential storage with encryption</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onQuickAction("rotate all expiring secrets")}
            className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            ROTATE_EXPIRING
          </Button>
          <Dialog open={isAddingSecret} onOpenChange={setIsAddingSecret}>
            <DialogTrigger asChild>
              <Button className="bg-posthog-orange hover:bg-posthog-orange-dark text-white font-mono text-xs">
                <Plus className="h-4 w-4 mr-2" />
                ADD_SECRET
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-posthog-orange">
              <DialogHeader>
                <DialogTitle className="font-mono text-posthog-black">ADD_NEW_SECRET</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="secret-name" className="font-mono text-posthog-black">
                      SECRET_NAME
                    </Label>
                    <Input id="secret-name" placeholder="API_KEY_NAME" className="border-posthog-orange font-mono" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secret-type" className="font-mono text-posthog-black">
                      TYPE
                    </Label>
                    <Select>
                      <SelectTrigger className="border-posthog-orange font-mono">
                        <SelectValue placeholder="SELECT_TYPE" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="password">PASSWORD</SelectItem>
                        <SelectItem value="api_key">API_KEY</SelectItem>
                        <SelectItem value="secret">SECRET</SelectItem>
                        <SelectItem value="oauth">OAUTH</SelectItem>
                        <SelectItem value="certificate">CERTIFICATE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="service" className="font-mono text-posthog-black">
                      SERVICE
                    </Label>
                    <Input id="service" placeholder="payment-service" className="border-posthog-orange font-mono" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="environment" className="font-mono text-posthog-black">
                      ENVIRONMENT
                    </Label>
                    <Select>
                      <SelectTrigger className="border-posthog-orange font-mono">
                        <SelectValue placeholder="SELECT_ENVIRONMENT" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="production">PRODUCTION</SelectItem>
                        <SelectItem value="staging">STAGING</SelectItem>
                        <SelectItem value="development">DEVELOPMENT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secret-value" className="font-mono text-posthog-black">
                    SECRET_VALUE
                  </Label>
                  <Input
                    id="secret-value"
                    type="password"
                    placeholder="ENTER_SECRET_VALUE"
                    className="border-posthog-orange font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="font-mono text-posthog-black">
                    DESCRIPTION
                  </Label>
                  <Input
                    id="description"
                    placeholder="Brief description of the secret"
                    className="border-posthog-orange font-mono"
                  />
                </div>
                <Button
                  className="w-full bg-posthog-orange hover:bg-posthog-orange-dark text-white font-mono"
                  onClick={() => setIsAddingSecret(false)}
                >
                  CREATE_SECRET
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Secrets List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {secrets.map((secret) => (
              <Card
                key={secret.id}
                className={`cursor-pointer transition-all hover:shadow-md border-posthog-cream-dark bg-white ${
                  selectedSecret?.id === secret.id ? "ring-2 ring-posthog-orange" : ""
                }`}
                onClick={() => setSelectedSecret(secret)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-posthog-orange" />
                      <span className="font-medium font-mono text-posthog-black text-xs">{secret.name}</span>
                    </div>
                    {getStatusIcon(secret.status)}
                  </div>
                  <div className="space-y-1 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-posthog-gray">SERVICE:</span>
                      <span className="text-posthog-black">{secret.service}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-posthog-gray">ENV:</span>
                      <span className="text-posthog-black">{secret.environment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-posthog-gray">EXPIRES:</span>
                      <span className="text-posthog-black">{secret.expiresIn}</span>
                    </div>
                  </div>
                  <div className="mt-2">{getStatusBadge(secret.status)}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Secret Details */}
        <div className="lg:col-span-2">
          {selectedSecret ? (
            <Tabs defaultValue="details" className="space-y-4">
              <TabsList className="bg-white border border-posthog-cream-dark">
                <TabsTrigger
                  value="details"
                  className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white"
                >
                  DETAILS
                </TabsTrigger>
                <TabsTrigger
                  value="access"
                  className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white"
                >
                  ACCESS_LOG
                </TabsTrigger>
                <TabsTrigger
                  value="rotation"
                  className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white"
                >
                  ROTATION
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <Card className="border-posthog-cream-dark bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 font-mono text-posthog-black">
                      <Lock className="h-5 w-5 text-posthog-orange" />
                      {selectedSecret.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                      <div>
                        <span className="font-medium text-posthog-black">TYPE:</span>
                        <div className="text-posthog-gray mt-1">{selectedSecret.type.toUpperCase()}</div>
                      </div>
                      <div>
                        <span className="font-medium text-posthog-black">STATUS:</span>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusIcon(selectedSecret.status)}
                          {getStatusBadge(selectedSecret.status)}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-posthog-black">SERVICE:</span>
                        <div className="text-posthog-gray mt-1">{selectedSecret.service}</div>
                      </div>
                      <div>
                        <span className="font-medium text-posthog-black">ENVIRONMENT:</span>
                        <div className="text-posthog-gray mt-1">{selectedSecret.environment.toUpperCase()}</div>
                      </div>
                      <div>
                        <span className="font-medium text-posthog-black">LAST_ROTATED:</span>
                        <div className="text-posthog-gray mt-1">{selectedSecret.lastRotated}</div>
                      </div>
                      <div>
                        <span className="font-medium text-posthog-black">EXPIRES_IN:</span>
                        <div className="text-posthog-gray mt-1">{selectedSecret.expiresIn}</div>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-posthog-black text-sm font-mono">DESCRIPTION:</span>
                      <div className="text-posthog-gray text-sm font-mono mt-1">{selectedSecret.description}</div>
                    </div>
                    <div>
                      <span className="font-medium text-posthog-black text-sm font-mono">SECRET_VALUE:</span>
                      <div className="flex items-center gap-2 mt-2">
                        <Input
                          type={showValue[selectedSecret.id] ? "text" : "password"}
                          value={showValue[selectedSecret.id] ? "sk_live_51H..." : "••••••••••••••••••••"}
                          readOnly
                          className="flex-1 border-posthog-orange font-mono text-sm"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleSecretVisibility(selectedSecret.id)}
                          className="border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                        >
                          {showValue[selectedSecret.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard("sk_live_51H...")}
                          className="border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button
                    className="bg-posthog-orange hover:bg-posthog-orange-dark text-white font-mono text-xs"
                    onClick={() => onQuickAction(`rotate ${selectedSecret.name} secret`)}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    ROTATE_NOW
                  </Button>
                  <Button
                    variant="outline"
                    className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    UPDATE_PERMISSIONS
                  </Button>
                  <Button
                    variant="outline"
                    className="font-mono text-xs border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    DELETE
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="access" className="space-y-4">
                <Card className="border-posthog-cream-dark bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg font-mono text-posthog-black">ACCESS_LOG</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { user: "payment-service", action: "READ", timestamp: "2 minutes ago", ip: "10.0.1.45" },
                        { user: "deployment-bot", action: "READ", timestamp: "15 minutes ago", ip: "10.0.2.12" },
                        { user: "admin@company.com", action: "UPDATE", timestamp: "1 hour ago", ip: "192.168.1.100" },
                        { user: "payment-service", action: "READ", timestamp: "2 hours ago", ip: "10.0.1.45" },
                      ].map((log, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-posthog-cream rounded">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-posthog-orange rounded-full"></div>
                            <div>
                              <span className="font-medium font-mono text-posthog-black text-sm">{log.user}</span>
                              <div className="text-xs font-mono text-posthog-gray">{log.ip}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={log.action === "READ" ? "outline" : "default"}
                              className="font-mono text-xs"
                            >
                              {log.action}
                            </Badge>
                            <div className="text-xs font-mono text-posthog-gray mt-1">{log.timestamp}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rotation" className="space-y-4">
                <Card className="border-posthog-cream-dark bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg font-mono text-posthog-black">ROTATION_SETTINGS</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rotation-interval" className="font-mono text-posthog-black">
                          ROTATION_INTERVAL
                        </Label>
                        <Select defaultValue="90">
                          <SelectTrigger className="border-posthog-orange font-mono">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30_DAYS</SelectItem>
                            <SelectItem value="60">60_DAYS</SelectItem>
                            <SelectItem value="90">90_DAYS</SelectItem>
                            <SelectItem value="180">180_DAYS</SelectItem>
                            <SelectItem value="365">365_DAYS</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="auto-rotate" className="font-mono text-posthog-black">
                          AUTO_ROTATION
                        </Label>
                        <div className="flex items-center gap-2 mt-2">
                          <input type="checkbox" defaultChecked className="accent-posthog-orange" />
                          <span className="text-sm font-mono text-posthog-black">ENABLED</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notification-email" className="font-mono text-posthog-black">
                        NOTIFICATION_EMAIL
                      </Label>
                      <Input
                        id="notification-email"
                        defaultValue="platform-team@company.com"
                        className="border-posthog-orange font-mono"
                      />
                    </div>
                    <Button className="bg-posthog-orange hover:bg-posthog-orange-dark text-white font-mono text-xs">
                      UPDATE_ROTATION_SETTINGS
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="h-96 flex items-center justify-center border-posthog-cream-dark bg-white">
              <div className="text-center">
                <Lock className="h-12 w-12 mx-auto text-posthog-gray mb-4" />
                <p className="text-posthog-gray font-mono">SELECT_A_SECRET_TO_VIEW_DETAILS</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
