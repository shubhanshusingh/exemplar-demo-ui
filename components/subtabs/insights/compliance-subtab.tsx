import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, Shield, AlertCircle, CheckCircle, Activity, FileText, Clock, Users, Target } from "lucide-react"

interface ComplianceSubtabProps {
  onQuickAction: (command: string) => void
}

export const ComplianceSubtab: React.FC<ComplianceSubtabProps> = ({ onQuickAction }) => {
  const complianceMetrics = [
    {
      title: "SECURITY_SCORE",
      value: "94%",
      change: "+2%",
      trend: "up",
      icon: Shield,
      color: "text-green-600",
    },
    {
      title: "POLICY_VIOLATIONS",
      value: "3",
      change: "-7",
      trend: "down",
      icon: AlertCircle,
      color: "text-yellow-600",
    },
    {
      title: "COMPLIANCE_RATE",
      value: "98.2%",
      change: "+0.5%",
      trend: "up",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "AUDIT_READINESS",
      value: "Ready",
      change: "100%",
      trend: "up",
      icon: Shield,
      color: "text-green-600",
    },
  ]

  const securityIncidents = [
    {
      type: "vulnerability",
      severity: "medium",
      service: "auth-service",
      description: "Outdated dependency detected",
      status: "investigating",
      time: "2 hours ago",
      assignee: "security-team",
    },
    {
      type: "access",
      severity: "low",
      service: "user-portal",
      description: "Unusual login pattern detected",
      status: "resolved",
      time: "1 day ago",
      assignee: "security-team",
    },
    {
      type: "configuration",
      severity: "high",
      service: "database-cluster",
      description: "Public access enabled",
      status: "critical",
      time: "4 hours ago",
      assignee: "platform-team",
    },
  ]

  const complianceChecks = [
    {
      framework: "SOC2",
      status: "compliant",
      lastCheck: "2 days ago",
      nextCheck: "in 28 days",
      score: "98.5%",
      team: "compliance",
    },
    {
      framework: "GDPR",
      status: "compliant",
      lastCheck: "1 week ago",
      nextCheck: "in 21 days",
      score: "99.1%",
      team: "legal",
    },
    {
      framework: "ISO27001",
      status: "review",
      lastCheck: "3 days ago",
      nextCheck: "in 7 days",
      score: "92.3%",
      team: "security",
    },
    {
      framework: "HIPAA",
      status: "compliant",
      lastCheck: "2 weeks ago",
      nextCheck: "in 42 days",
      score: "97.8%",
      team: "compliance",
    },
  ]

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="h-3 w-3 text-green-600" />
    ) : (
      <TrendingDown className="h-3 w-3 text-red-600" />
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-blue-600"
      default:
        return "text-posthog-gray"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "text-green-600"
      case "review":
        return "text-yellow-600"
      case "investigating":
        return "text-blue-600"
      case "critical":
        return "text-red-600"
      case "resolved":
        return "text-green-600"
      default:
        return "text-posthog-gray"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-posthog-black font-mono">COMPLIANCE_DASHBOARD</h1>
          <p className="text-sm text-posthog-gray font-mono">SECURITY_AND_REGULATORY_COMPLIANCE_METRICS</p>
        </div>
      </div>

      {/* Compliance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {complianceMetrics.map((metric, index) => (
          <Card key={index} className="border-posthog-cream-dark bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  <span className="text-xs font-mono text-posthog-gray">{metric.title}</span>
                </div>
                {getTrendIcon(metric.trend)}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-posthog-black font-mono">{metric.value}</span>
                <span className="text-xs text-posthog-gray font-mono">{metric.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Incidents */}
        <Card className="border-posthog-cream-dark bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 font-mono text-posthog-black">
              <AlertCircle className="h-5 w-5 text-posthog-orange" />
              SECURITY_INCIDENTS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {securityIncidents.map((incident, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-posthog-cream rounded">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono font-medium text-posthog-black">{incident.service}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs font-mono ${getSeverityColor(incident.severity)} border-current`}
                    >
                      {incident.severity.toUpperCase()}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`text-xs font-mono ${getStatusColor(incident.status)} border-current`}
                    >
                      {incident.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-posthog-gray font-mono">
                    <span className="truncate">{incident.description}</span>
                    <span>{incident.time}</span>
                    <span>{incident.assignee}</span>
                  </div>
                </div>
              </div>
            ))}
            <Button
              onClick={() => onQuickAction("show security incident report")}
              variant="outline"
              size="sm"
              className="w-full font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange-light"
            >
              VIEW_INCIDENT_REPORT
            </Button>
          </CardContent>
        </Card>

        {/* Compliance Checks */}
        <Card className="border-posthog-cream-dark bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 font-mono text-posthog-black">
              <FileText className="h-5 w-5 text-posthog-orange" />
              COMPLIANCE_FRAMEWORKS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {complianceChecks.map((framework, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-posthog-cream rounded">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono font-medium text-posthog-black">{framework.framework}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs font-mono ${getStatusColor(framework.status)} border-current`}
                    >
                      {framework.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-posthog-gray font-mono">
                    <span>{framework.score}</span>
                    <span>last: {framework.lastCheck}</span>
                    <span>next: {framework.nextCheck}</span>
                    <span>{framework.team}</span>
                  </div>
                </div>
              </div>
            ))}
            <Button
              onClick={() => onQuickAction("show compliance dashboard")}
              variant="outline"
              size="sm"
              className="w-full font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange-light"
            >
              VIEW_COMPLIANCE_DASHBOARD
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 