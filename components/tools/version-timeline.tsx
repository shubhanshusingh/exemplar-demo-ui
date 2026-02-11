"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Clock,
  User,
  GitBranch,
  MessageSquare,
  ArrowUp,
  ArrowDown,
  Plus,
  Minus,
  X,
  Calendar,
  Tag,
} from "lucide-react"

interface VersionEntry {
  version: string
  date: string
  author: string
  changes: string[]
  type: "major" | "minor" | "patch"
  description: string
  commitHash?: string
  branch?: string
}

interface VersionTimelineProps {
  isOpen: boolean
  onClose: () => void
  promptTitle: string
  versions: VersionEntry[]
  currentVersion: string
}

const getVersionType = (version: string): "major" | "minor" | "patch" => {
  const parts = version.split('.')
  if (parts.length >= 3 && parseInt(parts[2]) > 0) return "patch"
  if (parts.length >= 2 && parseInt(parts[1]) > 0) return "minor"
  return "major"
}

const getVersionIcon = (type: "major" | "minor" | "patch") => {
  switch (type) {
    case "major":
      return <ArrowUp className="h-4 w-4 text-red-500" />
    case "minor":
      return <Plus className="h-4 w-4 text-blue-500" />
    case "patch":
      return <Minus className="h-4 w-4 text-green-500" />
  }
}

const getVersionColor = (type: "major" | "minor" | "patch") => {
  switch (type) {
    case "major":
      return "bg-red-100 text-red-800 border-red-200"
    case "minor":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "patch":
      return "bg-green-100 text-green-800 border-green-200"
  }
}

export default function VersionTimeline({ isOpen, onClose, promptTitle, versions, currentVersion }: VersionTimelineProps) {
  const [selectedVersion, setSelectedVersion] = useState<VersionEntry | null>(null)

  const sortedVersions = [...versions].sort((a, b) => {
    const aParts = a.version.split('.').map(Number)
    const bParts = b.version.split('.').map(Number)
    
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aPart = aParts[i] || 0
      const bPart = bParts[i] || 0
      if (aPart !== bPart) {
        return bPart - aPart // Descending order (newest first)
      }
    }
    return 0
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 border-b border-posthog-cream-dark">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="font-mono text-posthog-black flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                VERSION_TIMELINE
              </DialogTitle>
              <p className="text-sm font-mono text-posthog-gray mt-1">
                {promptTitle} - Version History
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="font-mono text-xs text-posthog-gray hover:text-posthog-black"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Current Version Banner */}
            <Card className="border-posthog-orange bg-orange-50 mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className="font-mono text-sm bg-posthog-orange text-white">
                      CURRENT: {currentVersion}
                    </Badge>
                    <span className="text-sm font-mono text-posthog-black">
                      Latest version in use
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-posthog-gray">
                    <Calendar className="h-3 w-3" />
                    {sortedVersions[0]?.date || "Unknown"}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Version Timeline */}
            <div className="space-y-4">
              {sortedVersions.map((version, index) => {
                const versionType = getVersionType(version.version)
                const isLatest = index === 0
                const isCurrent = version.version === currentVersion

                return (
                  <Card 
                    key={version.version} 
                    className={`border-posthog-cream-dark bg-white cursor-pointer transition-all hover:shadow-md ${
                      isCurrent ? 'ring-2 ring-posthog-orange' : ''
                    }`}
                    onClick={() => setSelectedVersion(version)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          {/* Version Badge */}
                          <div className="flex flex-col items-center gap-2">
                            <Badge className={`font-mono text-sm border ${getVersionColor(versionType)}`}>
                              {getVersionIcon(versionType)}
                              <span className="ml-1">{version.version}</span>
                            </Badge>
                            {isLatest && (
                              <Badge className="font-mono text-xs bg-green-100 text-green-800 border-green-200">
                                LATEST
                              </Badge>
                            )}
                            {isCurrent && (
                              <Badge className="font-mono text-xs bg-posthog-orange text-white">
                                CURRENT
                              </Badge>
                            )}
                          </div>

                          {/* Version Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-mono text-sm font-medium text-posthog-black">
                                Version {version.version}
                              </h3>
                              <span className="text-xs font-mono text-posthog-gray capitalize">
                                {versionType} update
                              </span>
                            </div>
                            
                            <p className="text-sm font-mono text-posthog-gray mb-2">
                              {version.description}
                            </p>

                            <div className="flex items-center gap-4 text-xs font-mono text-posthog-gray">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {version.author}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {version.date}
                              </div>
                              {version.commitHash && (
                                <div className="flex items-center gap-1">
                                  <GitBranch className="h-3 w-3" />
                                  {version.commitHash.substring(0, 8)}
                                </div>
                              )}
                            </div>

                            {/* Change Summary */}
                            {version.changes.length > 0 && (
                              <div className="mt-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <MessageSquare className="h-3 w-3 text-posthog-gray" />
                                  <span className="text-xs font-mono text-posthog-gray font-medium">
                                    CHANGES ({version.changes.length})
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {version.changes.slice(0, 3).map((change, changeIndex) => (
                                    <div key={changeIndex} className="text-xs font-mono text-posthog-gray flex items-start gap-2">
                                      <span className="text-posthog-orange mt-0.5">•</span>
                                      <span>{change}</span>
                                    </div>
                                  ))}
                                  {version.changes.length > 3 && (
                                    <div className="text-xs font-mono text-posthog-gray">
                                      +{version.changes.length - 3} more changes
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button
                          size="sm"
                          variant="outline"
                          className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white"
                        >
                          VIEW_DETAILS
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Empty State */}
            {sortedVersions.length === 0 && (
              <Card className="border-posthog-cream-dark bg-white">
                <CardContent className="text-center py-12">
                  <GitBranch className="h-12 w-12 mx-auto mb-4 text-posthog-gray" />
                  <p className="text-posthog-gray font-mono text-sm mb-2">NO_VERSION_HISTORY</p>
                  <p className="text-posthog-gray font-mono text-xs">
                    This is the first version of this prompt
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Version Detail Modal */}
        {selectedVersion && (
          <Dialog open={!!selectedVersion} onOpenChange={() => setSelectedVersion(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-mono text-posthog-black flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  VERSION_{selectedVersion.version}_DETAILS
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-posthog-gray">VERSION</label>
                    <p className="font-mono text-sm text-posthog-black">{selectedVersion.version}</p>
                  </div>
                  <div>
                    <label className="text-xs font-mono text-posthog-gray">TYPE</label>
                    <p className="font-mono text-sm text-posthog-black capitalize">{selectedVersion.type}</p>
                  </div>
                  <div>
                    <label className="text-xs font-mono text-posthog-gray">AUTHOR</label>
                    <p className="font-mono text-sm text-posthog-black">{selectedVersion.author}</p>
                  </div>
                  <div>
                    <label className="text-xs font-mono text-posthog-gray">DATE</label>
                    <p className="font-mono text-sm text-posthog-black">{selectedVersion.date}</p>
                  </div>
                  {selectedVersion.commitHash && (
                    <div>
                      <label className="text-xs font-mono text-posthog-gray">COMMIT</label>
                      <p className="font-mono text-sm text-posthog-black font-mono">{selectedVersion.commitHash}</p>
                    </div>
                  )}
                  {selectedVersion.branch && (
                    <div>
                      <label className="text-xs font-mono text-posthog-gray">BRANCH</label>
                      <p className="font-mono text-sm text-posthog-black">{selectedVersion.branch}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-mono text-posthog-gray">DESCRIPTION</label>
                  <p className="font-mono text-sm text-posthog-black mt-1">{selectedVersion.description}</p>
                </div>

                {selectedVersion.changes.length > 0 && (
                  <div>
                    <label className="text-xs font-mono text-posthog-gray">CHANGES</label>
                    <div className="mt-2 space-y-2">
                      {selectedVersion.changes.map((change, index) => (
                        <div key={index} className="text-sm font-mono text-posthog-black flex items-start gap-2 p-2 bg-posthog-cream rounded">
                          <span className="text-posthog-orange mt-0.5">•</span>
                          <span>{change}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  )
} 