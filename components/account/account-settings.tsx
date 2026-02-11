"use client"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Users, Folder, Server, ChevronDown, ChevronUp, X } from "lucide-react"

type User = {
  id: number;
  name: string;
  email: string;
};
type Team = {
  id: number;
  name: string;
};
type TeamMembership = {
  user_id: number;
  team_id: number;
  role: "Owner" | "Admin" | "Member";
};
type Project = {
  id: number;
  name: string;
  team_id: number;
};
type EnvironmentType = "development" | "staging" | "production" | "none"
type Environment = {
  id: number;
  name: string;
  project_id: number;
  type?: EnvironmentType;
};

const initialUsers: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
  { id: 3, name: "Carol", email: "carol@example.com" },
]
const initialTeams: Team[] = [
  { id: 1, name: "Platform Team" },
  { id: 2, name: "QA Team" },
]
const initialMemberships: TeamMembership[] = [
  { user_id: 1, team_id: 1, role: "Owner" },
  { user_id: 2, team_id: 1, role: "Member" },
  { user_id: 3, team_id: 2, role: "Admin" },
]
const initialProjects: Project[] = [
  { id: 1, name: "Exemplar Console", team_id: 1 },
  { id: 2, name: "AI Playground", team_id: 1 },
  { id: 3, name: "QA Dashboard", team_id: 2 },
]
const initialEnvironments: Environment[] = [
  { id: 1, name: "Production", project_id: 1 },
  { id: 2, name: "Staging", project_id: 1 },
  { id: 3, name: "Development", project_id: 2 },
  { id: 4, name: "Testing", project_id: 3 },
]

export default function AccountSettings() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [teams, setTeams] = useState<Team[]>(initialTeams)
  const [memberships, setMemberships] = useState<TeamMembership[]>(initialMemberships)
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [environments, setEnvironments] = useState<Environment[]>(initialEnvironments.map(e => ({ ...e, type: undefined })))
  const [newTeam, setNewTeam] = useState("")
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null)
  const [inviteInputs, setInviteInputs] = useState<{ [teamId: number]: { name: string; email: string; role: TeamMembership["role"] } }>({})
  // New state for project/environment creation
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectTeamId, setNewProjectTeamId] = useState<number>(teams[0]?.id || 0)
  const [newEnvName, setNewEnvName] = useState("")
  const [newEnvProjectId, setNewEnvProjectId] = useState<number>(projects[0]?.id || 0)
  // Default selections
  const [defaultTeamId, setDefaultTeamId] = useState<number>(teams[0]?.id || 0)
  const [defaultProjectId, setDefaultProjectId] = useState<number>(projects[0]?.id || 0)

  // Add team
  const handleAddTeam = () => {
    if (!newTeam.trim()) return
    const newId = Date.now()
    setTeams([...teams, { id: newId, name: newTeam.trim() }])
    setNewTeam("")
  }

  // Invite/add user to team
  const handleInviteUser = (teamId: number) => {
    const input = inviteInputs[teamId] || { name: "", email: "", role: "Member" }
    if (!input.name.trim() || !input.email.trim()) return
    // Check if user exists
    let user = users.find(u => u.email === input.email)
    if (!user) {
      user = { id: Date.now(), name: input.name.trim(), email: input.email.trim() }
      setUsers([...users, user])
    }
    // Add membership if not already
    if (!memberships.some(m => m.user_id === user!.id && m.team_id === teamId)) {
      setMemberships([...memberships, { user_id: user!.id, team_id: teamId, role: input.role }])
    }
    setInviteInputs({ ...inviteInputs, [teamId]: { name: "", email: "", role: "Member" } })
  }

  // Remove user from team
  const handleRemoveUser = (teamId: number, userId: number) => {
    setMemberships(memberships.filter(m => !(m.user_id === userId && m.team_id === teamId)))
  }

  // Change user role
  const handleChangeRole = (teamId: number, userId: number, role: TeamMembership["role"]) => {
    setMemberships(memberships.map(m =>
      m.user_id === userId && m.team_id === teamId ? { ...m, role } : m
    ))
  }

  // Add project
  const handleAddProject = () => {
    if (!newProjectName.trim() || !newProjectTeamId) return
    setProjects([
      ...projects,
      { id: Date.now(), name: newProjectName.trim(), team_id: newProjectTeamId }
    ])
    setNewProjectName("")
  }

  // Add environment
  const handleAddEnv = () => {
    if (!newEnvName.trim() || !newEnvProjectId) return
    setEnvironments([
      ...environments,
      { id: Date.now(), name: newEnvName.trim(), project_id: newEnvProjectId }
    ])
    setNewEnvName("")
  }

  // Set environment type, only one of each type per project
  const handleSetEnvType = (envId: number, projectId: number, type: EnvironmentType) => {
    setEnvironments(envs =>
      envs.map(env => {
        if (env.project_id === projectId && env.type === type && env.id !== envId) {
          return { ...env, type: undefined }
        }
        if (env.id === envId) {
          return { ...env, type: type === "none" ? undefined : type }
        }
        return env
      })
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold font-mono mb-6">Account Settings</h1>
      <Tabs defaultValue="team" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="team"><Users className="h-4 w-4 mr-2" />Team</TabsTrigger>
          <TabsTrigger value="project"><Folder className="h-4 w-4 mr-2" />Projects</TabsTrigger>
          <TabsTrigger value="environment"><Server className="h-4 w-4 mr-2" />Environments</TabsTrigger>
        </TabsList>
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Manage Teams & Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  value={newTeam}
                  onChange={e => setNewTeam(e.target.value)}
                  placeholder="Add new team..."
                  className="font-mono"
                />
                <Button onClick={handleAddTeam} className="bg-posthog-orange text-white">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <ul className="space-y-2">
                {teams.map(team => (
                  <li key={team.id} className="border-b pb-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm cursor-pointer" onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}>
                        {team.name}
                        {defaultTeamId === team.id && <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">Default</span>}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={defaultTeamId === team.id ? "default" : "outline"}
                          className={defaultTeamId === team.id ? "bg-green-600 text-white" : "border-posthog-orange text-posthog-orange"}
                          onClick={() => setDefaultTeamId(team.id)}
                        >
                          {defaultTeamId === team.id ? "Default" : "Set as Default"}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
                          className="text-posthog-gray"
                        >
                          {expandedTeam === team.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500"
                          onClick={() => setTeams(teams.filter(t => t.id !== team.id))}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                    {expandedTeam === team.id && (
                      <div className="mt-3 bg-posthog-cream rounded p-4">
                        {/* Members */}
                        <div className="mb-4">
                          <div className="font-mono text-xs mb-2">Members</div>
                          <div className="flex gap-2 mb-2">
                            <Input
                              value={inviteInputs[team.id]?.name || ""}
                              onChange={e => setInviteInputs({ ...inviteInputs, [team.id]: { ...(inviteInputs[team.id] || { email: "", role: "Member" }), name: e.target.value } })}
                              placeholder="Name..."
                              className="font-mono text-xs"
                            />
                            <Input
                              value={inviteInputs[team.id]?.email || ""}
                              onChange={e => setInviteInputs({ ...inviteInputs, [team.id]: { ...(inviteInputs[team.id] || { name: "", role: "Member" }), email: e.target.value } })}
                              placeholder="Email..."
                              className="font-mono text-xs"
                            />
                            <select
                              value={inviteInputs[team.id]?.role || "Member"}
                              onChange={e => setInviteInputs({ ...inviteInputs, [team.id]: { ...(inviteInputs[team.id] || { name: "", email: "" }), role: e.target.value as TeamMembership["role"] } })}
                              className="font-mono text-xs border rounded px-2 py-1"
                            >
                              <option value="Owner">Owner</option>
                              <option value="Admin">Admin</option>
                              <option value="Member">Member</option>
                            </select>
                            <Button
                              size="sm"
                              onClick={() => handleInviteUser(team.id)}
                              className="bg-posthog-orange text-white"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <ul className="flex flex-col gap-2">
                            {memberships.filter(m => m.team_id === team.id).map(m => {
                              const user = users.find(u => u.id === m.user_id)
                              return user ? (
                                <li key={user.id} className="flex items-center bg-white border rounded px-2 py-1 text-xs font-mono justify-between">
                                  <div className="flex items-center gap-2">
                                    <span>{user.name}</span>
                                    <span className="text-posthog-gray">({user.email})</span>
                                    <select
                                      value={m.role}
                                      onChange={e => handleChangeRole(team.id, user.id, e.target.value as TeamMembership["role"])}
                                      className="font-mono text-xs border rounded px-2 py-1"
                                    >
                                      <option value="Owner">Owner</option>
                                      <option value="Admin">Admin</option>
                                      <option value="Member">Member</option>
                                    </select>
                                  </div>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="ml-1 text-red-500"
                                    onClick={() => handleRemoveUser(team.id, user.id)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </li>
                              ) : null
                            })}
                          </ul>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="project">
          <Card>
            <CardHeader>
              <CardTitle>Manage Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4 items-center">
                <Input
                  value={newProjectName}
                  onChange={e => setNewProjectName(e.target.value)}
                  placeholder="Add new project..."
                  className="font-mono"
                />
                <select
                  value={newProjectTeamId}
                  onChange={e => setNewProjectTeamId(Number(e.target.value))}
                  className="font-mono text-xs border rounded px-2 py-1"
                >
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
                <Button
                  onClick={handleAddProject}
                  className="bg-posthog-orange text-white"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <ul className="space-y-2">
                {projects.map(project => (
                  <li key={project.id} className="flex items-center justify-between border-b pb-2">
                    <span className="font-mono text-sm">
                      {project.name} <span className="text-xs text-posthog-gray">({teams.find(t => t.id === project.team_id)?.name})</span>
                      {defaultProjectId === project.id && <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">Default</span>}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={defaultProjectId === project.id ? "default" : "outline"}
                        className={defaultProjectId === project.id ? "bg-green-600 text-white" : "border-posthog-orange text-posthog-orange"}
                        onClick={() => setDefaultProjectId(project.id)}
                      >
                        {defaultProjectId === project.id ? "Default" : "Set as Default"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500"
                        onClick={() => setProjects(projects.filter(p => p.id !== project.id))}
                      >
                        Remove
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="environment">
          <Card>
            <CardHeader>
              <CardTitle>Manage Environments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4 items-center">
                <Input
                  value={newEnvName}
                  onChange={e => setNewEnvName(e.target.value)}
                  placeholder="Add new environment..."
                  className="font-mono"
                />
                <select
                  value={newEnvProjectId}
                  onChange={e => setNewEnvProjectId(Number(e.target.value))}
                  className="font-mono text-xs border rounded px-2 py-1"
                >
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
                <Button
                  onClick={handleAddEnv}
                  className="bg-posthog-orange text-white"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <ul className="space-y-2">
                {environments.map(env => (
                  <li key={env.id} className="flex items-center justify-between border-b pb-2">
                    <span className="font-mono text-sm">
                      {env.name} <span className="text-xs text-posthog-gray">({projects.find(p => p.id === env.project_id)?.name})</span>
                      {env.type && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded capitalize">{env.type}</span>}
                    </span>
                    <div className="flex items-center gap-2">
                      <select
                        value={env.type || "none"}
                        onChange={e => handleSetEnvType(env.id, env.project_id, e.target.value as EnvironmentType)}
                        className="font-mono text-xs border rounded px-2 py-1"
                      >
                        <option value="none">No Type</option>
                        <option value="development">Development</option>
                        <option value="staging">Staging</option>
                        <option value="production">Production</option>
                      </select>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500"
                        onClick={() => setEnvironments(environments.filter(e => e.id !== env.id))}
                      >
                        Remove
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 