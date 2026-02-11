export interface Action {
  id: string
  title: string
  description: string
  icon: string
  category: "create" | "day2"
  status: "idle" | "running" | "success" | "error"
  executionCount: number
  lastExecuted: Date
  formFields: FormField[]
  backendIntegration: string
  approvalRequired: boolean
}

export interface FormField {
  name: string
  label: string
  type: "text" | "textarea" | "select" | "number" | "password"
  required: boolean
  placeholder?: string
  options?: string[]
  defaultValue?: string
}

export const initialActions: Action[] = [
  // Create Actions
  {
    id: "scaffold-service",
    title: "Scaffold Service",
    description: "Create a new microservice with standard structure and configuration",
    icon: "Server",
    category: "create",
    status: "idle",
    executionCount: 12,
    lastExecuted: new Date(Date.now() - 86400000), // 1 day ago
    formFields: [
      { name: "serviceName", label: "Service Name", type: "text", required: true, placeholder: "Enter service name" },
      { name: "framework", label: "Framework", type: "select", required: true, options: ["Node.js", "Python", "Go", "Java"], defaultValue: "Node.js" },
      { name: "database", label: "Database", type: "select", required: false, options: ["PostgreSQL", "MongoDB", "Redis", "None"], defaultValue: "PostgreSQL" },
      { name: "description", label: "Description", type: "textarea", required: false, placeholder: "Service description" }
    ],
    backendIntegration: "GitHub Workflow",
    approvalRequired: false
  },
  {
    id: "create-github-secret",
    title: "Create GitHub Secret",
    description: "Add a new secret to GitHub repository",
    icon: "Github",
    category: "create",
    status: "idle",
    executionCount: 8,
    lastExecuted: new Date(Date.now() - 3600000), // 1 hour ago
    formFields: [
      { name: "secretKey", label: "Secret Key", type: "text", required: true, placeholder: "Enter secret key" },
      { name: "secretValue", label: "Secret Value", type: "password", required: true, placeholder: "Enter secret value" }
    ],
    backendIntegration: "GitHub API",
    approvalRequired: true
  },
  {
    id: "role-assignment",
    title: "Role Assignment",
    description: "Assign IAM roles to users or services",
    icon: "Cloud",
    category: "create",
    status: "idle",
    executionCount: 3,
    lastExecuted: new Date(Date.now() - 1800000), // 30 minutes ago
    formFields: [
      { name: "user", label: "User/Service", type: "text", required: true, placeholder: "Enter user or service name" },
      { name: "role", label: "Role", type: "select", required: true, options: ["Admin", "Developer", "ReadOnly", "Custom"], defaultValue: "Developer" },
      { name: "permissions", label: "Custom Permissions", type: "textarea", required: false, placeholder: "JSON format permissions" }
    ],
    backendIntegration: "AWS IAM",
    approvalRequired: true
  },
  {
    id: "create-database",
    title: "Create Database",
    description: "Provision a new database instance",
    icon: "Database",
    category: "create",
    status: "idle",
    executionCount: 6,
    lastExecuted: new Date(Date.now() - 7200000), // 2 hours ago
    formFields: [
      { name: "dbName", label: "Database Name", type: "text", required: true, placeholder: "Enter database name" },
      { name: "dbType", label: "Database Type", type: "select", required: true, options: ["PostgreSQL", "MySQL", "MongoDB", "Redis"], defaultValue: "PostgreSQL" },
      { name: "size", label: "Instance Size", type: "select", required: true, options: ["Small", "Medium", "Large"], defaultValue: "Medium" },
      { name: "backup", label: "Backup Enabled", type: "select", required: true, options: ["Yes", "No"], defaultValue: "Yes" }
    ],
    backendIntegration: "Terraform",
    approvalRequired: true
  },
  {
    id: "create-monitoring",
    title: "Create Monitoring",
    description: "Set up monitoring and alerting for a service",
    icon: "BarChart3",
    category: "create",
    status: "idle",
    executionCount: 4,
    lastExecuted: new Date(Date.now() - 14400000), // 4 hours ago
    formFields: [
      { name: "service", label: "Service Name", type: "text", required: true, placeholder: "Enter service name" },
      { name: "metrics", label: "Metrics", type: "select", required: true, options: ["CPU", "Memory", "Disk", "Network", "All"], defaultValue: "All" },
      { name: "alerts", label: "Alert Channels", type: "select", required: true, options: ["Slack", "Email", "PagerDuty", "All"], defaultValue: "Slack" }
    ],
    backendIntegration: "Custom Script",
    approvalRequired: false
  },

  // Day-2 Operations
  {
    id: "create-kafka-topic",
    title: "Create Kafka Topic",
    description: "Create a new Kafka topic with specified configuration",
    icon: "Server",
    category: "day2",
    status: "idle",
    executionCount: 12,
    lastExecuted: new Date(Date.now() - 3600000), // 1 hour ago
    formFields: [
      { name: "topicName", label: "Topic Name", type: "text", required: true, placeholder: "Enter topic name (e.g., user-events)" },
      { name: "partitions", label: "Partitions", type: "number", required: true, placeholder: "Number of partitions" },
      { name: "replicationFactor", label: "Replication Factor", type: "number", required: true, placeholder: "Replication factor (1-3)" },
      { name: "retentionHours", label: "Retention Hours", type: "number", required: false, placeholder: "Message retention in hours (default: 168)" },
      { name: "compressionType", label: "Compression Type", type: "select", required: false, options: ["none", "gzip", "snappy", "lz4", "zstd"], defaultValue: "gzip" },
      { name: "description", label: "Description", type: "textarea", required: false, placeholder: "Topic description and usage notes" }
    ],
    backendIntegration: "Kafka API",
    approvalRequired: false
  },
  {
    id: "provision-database",
    title: "Provision Database",
    description: "Provision a new database instance for development or testing",
    icon: "Database",
    category: "day2",
    status: "idle",
    executionCount: 8,
    lastExecuted: new Date(Date.now() - 7200000), // 2 hours ago
    formFields: [
      { name: "dbName", label: "Database Name", type: "text", required: true, placeholder: "Enter database name" },
      { name: "dbType", label: "Database Type", type: "select", required: true, options: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Cassandra"], defaultValue: "PostgreSQL" },
      { name: "instanceSize", label: "Instance Size", type: "select", required: true, options: ["Small (1 CPU, 2GB RAM)", "Medium (2 CPU, 4GB RAM)", "Large (4 CPU, 8GB RAM)", "XLarge (8 CPU, 16GB RAM)"], defaultValue: "Medium (2 CPU, 4GB RAM)" },
      { name: "environment", label: "Environment", type: "select", required: true, options: ["dev", "staging", "prod"], defaultValue: "dev" },
      { name: "backupEnabled", label: "Backup Enabled", type: "select", required: true, options: ["Yes", "No"], defaultValue: "Yes" },
      { name: "ttl", label: "TTL (hours)", type: "number", required: false, placeholder: "Auto-delete after X hours (optional)" }
    ],
    backendIntegration: "Terraform",
    approvalRequired: true
  },
  {
    id: "provision-ephemeral-env",
    title: "Provision Ephemeral Env for Dev",
    description: "Create a temporary development environment with specified services",
    icon: "Cloud",
    category: "day2",
    status: "idle",
    executionCount: 6,
    lastExecuted: new Date(Date.now() - 1800000), // 30 minutes ago
    formFields: [
      { name: "envName", label: "Environment Name", type: "text", required: true, placeholder: "Enter environment name (e.g., dev-feature-123)" },
      { name: "services", label: "Services", type: "textarea", required: true, placeholder: "Comma-separated service names (e.g., api-service, frontend-service, db-service)" },
      { name: "duration", label: "Duration", type: "select", required: true, options: ["1 hour", "4 hours", "8 hours", "24 hours", "48 hours"], defaultValue: "8 hours" },
      { name: "autoCleanup", label: "Auto Cleanup", type: "select", required: true, options: ["Yes", "No"], defaultValue: "Yes" },
      { name: "namespace", label: "Kubernetes Namespace", type: "text", required: false, placeholder: "Custom namespace (optional)" },
      { name: "description", label: "Description", type: "textarea", required: false, placeholder: "Purpose of this ephemeral environment" }
    ],
    backendIntegration: "Kubernetes API",
    approvalRequired: false
  },
  {
    id: "send-scorecard-reminder",
    title: "Send Scorecard Reminder",
    description: "Send reminder for pending scorecard reviews",
    icon: "Slack",
    category: "day2",
    status: "idle",
    executionCount: 5,
    lastExecuted: new Date(Date.now() - 7200000), // 2 hours ago
    formFields: [
      { name: "team", label: "Team", type: "select", required: true, options: ["Platform Team", "QA Team", "DevOps Team"], defaultValue: "Platform Team" },
      { name: "message", label: "Custom Message", type: "textarea", required: false, placeholder: "Custom reminder message" }
    ],
    backendIntegration: "Slack API",
    approvalRequired: false
  },
  {
    id: "promote-to-production",
    title: "Promote to Production",
    description: "Deploy service to production environment",
    icon: "Server",
    category: "day2",
    status: "idle",
    executionCount: 15,
    lastExecuted: new Date(Date.now() - 43200000), // 12 hours ago
    formFields: [
      { name: "service", label: "Service", type: "text", required: true, placeholder: "Enter service name" },
      { name: "version", label: "Version", type: "text", required: true, placeholder: "Enter version tag" },
      { name: "strategy", label: "Deployment Strategy", type: "select", required: true, options: ["Blue-Green", "Canary", "Rolling"], defaultValue: "Blue-Green" }
    ],
    backendIntegration: "ArgoCD",
    approvalRequired: true
  },
  {
    id: "lock-service",
    title: "Lock Service",
    description: "Prevent deployments to a service",
    icon: "Lock",
    category: "day2",
    status: "idle",
    executionCount: 2,
    lastExecuted: new Date(Date.now() - 900000), // 15 minutes ago
    formFields: [
      { name: "service", label: "Service", type: "text", required: true, placeholder: "Enter service name" },
      { name: "reason", label: "Lock Reason", type: "textarea", required: true, placeholder: "Reason for locking the service" }
    ],
    backendIntegration: "ArgoCD",
    approvalRequired: false
  },
  {
    id: "unlock-service",
    title: "Unlock Service",
    description: "Remove deployment lock from a service",
    icon: "Lock",
    category: "day2",
    status: "idle",
    executionCount: 1,
    lastExecuted: new Date(Date.now() - 600000), // 10 minutes ago
    formFields: [
      { name: "service", label: "Service", type: "text", required: true, placeholder: "Enter service name" }
    ],
    backendIntegration: "ArgoCD",
    approvalRequired: false
  },
  {
    id: "enrich-service",
    title: "Enrich Service",
    description: "Add metadata and configuration to service",
    icon: "Settings",
    category: "day2",
    status: "idle",
    executionCount: 7,
    lastExecuted: new Date(Date.now() - 14400000), // 4 hours ago
    formFields: [
      { name: "service", label: "Service", type: "text", required: true, placeholder: "Enter service name" },
      { name: "owner", label: "Owner", type: "text", required: true, placeholder: "Service owner" },
      { name: "team", label: "Team", type: "text", required: true, placeholder: "Team name" },
      { name: "description", label: "Description", type: "textarea", required: false, placeholder: "Service description" }
    ],
    backendIntegration: "Custom Script",
    approvalRequired: false
  },
  {
    id: "scale-service",
    title: "Scale Service",
    description: "Scale service replicas up or down",
    icon: "BarChart3",
    category: "day2",
    status: "idle",
    executionCount: 9,
    lastExecuted: new Date(Date.now() - 3600000), // 1 hour ago
    formFields: [
      { name: "service", label: "Service", type: "text", required: true, placeholder: "Enter service name" },
      { name: "replicas", label: "Replicas", type: "number", required: true, placeholder: "Number of replicas" },
      { name: "reason", label: "Scale Reason", type: "textarea", required: false, placeholder: "Reason for scaling" }
    ],
    backendIntegration: "Kubernetes API",
    approvalRequired: false
  },
  {
    id: "restart-service",
    title: "Restart Service",
    description: "Restart a service deployment",
    icon: "RefreshCw",
    category: "day2",
    status: "idle",
    executionCount: 3,
    lastExecuted: new Date(Date.now() - 1800000), // 30 minutes ago
    formFields: [
      { name: "service", label: "Service", type: "text", required: true, placeholder: "Enter service name" },
      { name: "reason", label: "Restart Reason", type: "textarea", required: true, placeholder: "Reason for restart" }
    ],
    backendIntegration: "Kubernetes API",
    approvalRequired: false
  },
  {
    id: "update-config",
    title: "Update Configuration",
    description: "Update service configuration and environment variables",
    icon: "Settings",
    category: "day2",
    status: "idle",
    executionCount: 11,
    lastExecuted: new Date(Date.now() - 28800000), // 8 hours ago
    formFields: [
      { name: "service", label: "Service", type: "text", required: true, placeholder: "Enter service name" },
      { name: "configType", label: "Config Type", type: "select", required: true, options: ["Environment Variables", "ConfigMap", "Secret"], defaultValue: "Environment Variables" },
      { name: "configData", label: "Configuration", type: "textarea", required: true, placeholder: "Key-value pairs or JSON config" }
    ],
    backendIntegration: "Kubernetes API",
    approvalRequired: true
  },
  {
    id: "backup-database",
    title: "Backup Database",
    description: "Create a backup of database",
    icon: "Database",
    category: "day2",
    status: "idle",
    executionCount: 6,
    lastExecuted: new Date(Date.now() - 86400000), // 1 day ago
    formFields: [
      { name: "database", label: "Database", type: "text", required: true, placeholder: "Enter database name" },
      { name: "backupType", label: "Backup Type", type: "select", required: true, options: ["Full", "Incremental", "Differential"], defaultValue: "Full" },
      { name: "retention", label: "Retention Days", type: "number", required: true, placeholder: "Days to retain backup" }
    ],
    backendIntegration: "Custom Script",
    approvalRequired: false
  },
  {
    id: "health-check",
    title: "Health Check",
    description: "Run comprehensive health check on service",
    icon: "CheckCircle",
    category: "day2",
    status: "idle",
    executionCount: 8,
    lastExecuted: new Date(Date.now() - 7200000), // 2 hours ago
    formFields: [
      { name: "service", label: "Service", type: "text", required: true, placeholder: "Enter service name" },
      { name: "checkType", label: "Check Type", type: "select", required: true, options: ["Basic", "Comprehensive", "Security"], defaultValue: "Basic" },
      { name: "notify", label: "Notify on Failure", type: "select", required: true, options: ["Yes", "No"], defaultValue: "Yes" }
    ],
    backendIntegration: "Custom Script",
    approvalRequired: false
  },
  {
    id: "rollback-deployment",
    title: "Rollback Deployment",
    description: "Rollback to previous deployment version",
    icon: "History",
    category: "day2",
    status: "idle",
    executionCount: 2,
    lastExecuted: new Date(Date.now() - 14400000), // 4 hours ago
    formFields: [
      { name: "service", label: "Service", type: "text", required: true, placeholder: "Enter service name" },
      { name: "version", label: "Target Version", type: "text", required: true, placeholder: "Version to rollback to" },
      { name: "reason", label: "Rollback Reason", type: "textarea", required: true, placeholder: "Reason for rollback" }
    ],
    backendIntegration: "ArgoCD",
    approvalRequired: true
  },
  {
    id: "cleanup-resources",
    title: "Cleanup Resources",
    description: "Clean up unused resources and temporary files",
    icon: "Trash2",
    category: "day2",
    status: "idle",
    executionCount: 4,
    lastExecuted: new Date(Date.now() - 86400000), // 1 day ago
    formFields: [
      { name: "resourceType", label: "Resource Type", type: "select", required: true, options: ["Logs", "Temporary Files", "Old Backups", "Unused Volumes"], defaultValue: "Logs" },
      { name: "olderThan", label: "Older Than (days)", type: "number", required: true, placeholder: "Delete resources older than X days" },
      { name: "dryRun", label: "Dry Run", type: "select", required: true, options: ["Yes", "No"], defaultValue: "Yes" }
    ],
    backendIntegration: "Custom Script",
    approvalRequired: false
  },
  {
    id: "sync-secrets",
    title: "Sync Secrets",
    description: "Synchronize secrets across environments",
    icon: "Shield",
    category: "day2",
    status: "idle",
    executionCount: 5,
    lastExecuted: new Date(Date.now() - 28800000), // 8 hours ago
    formFields: [
      { name: "sourceEnv", label: "Source Environment", type: "select", required: true, options: ["dev", "staging", "prod"], defaultValue: "staging" },
      { name: "targetEnv", label: "Target Environment", type: "select", required: true, options: ["dev", "staging", "prod"], defaultValue: "prod" },
      { name: "secretNames", label: "Secret Names", type: "textarea", required: false, placeholder: "Comma-separated secret names (leave empty for all)" }
    ],
    backendIntegration: "Kubernetes API",
    approvalRequired: true
  },
  {
    id: "update-dependencies",
    title: "Update Dependencies",
    description: "Update service dependencies and packages",
    icon: "Package",
    category: "day2",
    status: "idle",
    executionCount: 7,
    lastExecuted: new Date(Date.now() - 43200000), // 12 hours ago
    formFields: [
      { name: "service", label: "Service", type: "text", required: true, placeholder: "Enter service name" },
      { name: "dependencyType", label: "Dependency Type", type: "select", required: true, options: ["Security", "Minor", "Major", "All"], defaultValue: "Security" },
      { name: "autoDeploy", label: "Auto Deploy", type: "select", required: true, options: ["Yes", "No"], defaultValue: "No" }
    ],
    backendIntegration: "GitHub Workflow",
    approvalRequired: true
  },
  {
    id: "generate-report",
    title: "Generate Report",
    description: "Generate service performance and usage reports",
    icon: "FileText",
    category: "day2",
    status: "idle",
    executionCount: 3,
    lastExecuted: new Date(Date.now() - 86400000), // 1 day ago
    formFields: [
      { name: "service", label: "Service", type: "text", required: true, placeholder: "Enter service name" },
      { name: "reportType", label: "Report Type", type: "select", required: true, options: ["Performance", "Usage", "Security", "Cost"], defaultValue: "Performance" },
      { name: "timeRange", label: "Time Range", type: "select", required: true, options: ["Last 24h", "Last 7 days", "Last 30 days"], defaultValue: "Last 7 days" },
      { name: "format", label: "Format", type: "select", required: true, options: ["PDF", "CSV", "JSON"], defaultValue: "PDF" }
    ],
    backendIntegration: "Custom Script",
    approvalRequired: false
  }
]

// Helper function to get actions by category
export const getActionsByCategory = (category: "create" | "day2") => {
  return initialActions.filter(action => action.category === category)
}

// Helper function to get action by id
export const getActionById = (id: string) => {
  return initialActions.find(action => action.id === id)
}

// Helper function to get actions by entity type
export const getActionsByEntityType = (entityType: string) => {
  // This can be customized based on which actions are relevant for which entity types
  const entityActionMapping: { [key: string]: string[] } = {
    "Service": ["scaffold-service", "promote-to-production", "lock-service", "unlock-service", "enrich-service", "scale-service", "restart-service", "update-config", "health-check", "rollback-deployment", "update-dependencies", "generate-report", "provision-ephemeral-env"],
    "API": ["create-github-secret", "create-monitoring", "health-check", "generate-report"],
    "Database": ["create-database", "backup-database", "cleanup-resources", "provision-database"],
    "ML Model": ["create-monitoring", "health-check", "generate-report"],
    "Kafka": ["create-kafka-topic"]
  }
  
  const actionIds = entityActionMapping[entityType] || []
  return initialActions.filter(action => actionIds.includes(action.id))
}

// Helper function to get actions by backend integration
export const getActionsByBackendIntegration = (backendIntegration: string) => {
  return initialActions.filter(action => action.backendIntegration === backendIntegration)
}

// Helper function to map integration names to backend integration strings
export const getBackendIntegrationForService = (serviceName: string): string[] => {
  const integrationMapping: { [key: string]: string[] } = {
    "GitHub": ["GitHub Workflow", "GitHub API"],
    "GitLab": ["GitHub Workflow", "Custom Script"], // Using similar patterns
    "Bitbucket": ["GitHub Workflow", "Custom Script"],
    "Jenkins": ["Custom Script", "Webhook"],
    "CircleCI": ["GitHub Workflow", "Webhook"],
    "Azure DevOps": ["Azure Pipeline", "Custom Script"],
    "GitHub Workflows": ["GitHub Workflow", "GitHub API"],
    "GitLab Pipelines": ["GitHub Workflow", "Custom Script"],
    "Terraform": ["Terraform"],
    "Pulumi": ["Terraform", "Custom Script"],
    "Terraform Cloud": ["Terraform"],
    "AWS": ["AWS CLI", "Terraform"],
    "GCP": ["Terraform", "Custom Script"],
    "Azure": ["Azure Pipeline", "Terraform"],
    "Kubernetes": ["Kubernetes API"],
    "OpenShift": ["Kubernetes API"],
    "ArgoCD": ["ArgoCD"],
    "Slack": ["Slack API"],
    "Kafka": ["Kafka API"],
    "Amazon Web Services": ["AWS CLI", "Terraform"],
    "Google Cloud Platform": ["Terraform", "Custom Script"],
    "Microsoft Azure": ["Azure Pipeline", "Terraform"],
  }
  
  return integrationMapping[serviceName] || ["Custom Script", "Webhook"]
}

// Helper function to get available operations/APIs for a service
export const getAvailableOperations = (serviceName: string) => {
  const operationsMapping: { [key: string]: Array<{ name: string; description: string; method?: string }> } = {
    "GitHub": [
      { name: "List Repositories", description: "Get list of repositories", method: "GET /repos" },
      { name: "Create Repository", description: "Create a new repository", method: "POST /repos" },
      { name: "Get Repository", description: "Get repository details", method: "GET /repos/{owner}/{repo}" },
      { name: "List Issues", description: "List repository issues", method: "GET /repos/{owner}/{repo}/issues" },
      { name: "Create Issue", description: "Create a new issue", method: "POST /repos/{owner}/{repo}/issues" },
      { name: "List Pull Requests", description: "List pull requests", method: "GET /repos/{owner}/{repo}/pulls" },
      { name: "Create Pull Request", description: "Create a new pull request", method: "POST /repos/{owner}/{repo}/pulls" },
      { name: "List Workflows", description: "List GitHub Actions workflows", method: "GET /repos/{owner}/{repo}/actions/workflows" },
      { name: "Trigger Workflow", description: "Trigger a workflow dispatch", method: "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches" },
      { name: "List Secrets", description: "List repository secrets", method: "GET /repos/{owner}/{repo}/actions/secrets" },
      { name: "Create Secret", description: "Create a repository secret", method: "PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}" },
      { name: "List Webhooks", description: "List repository webhooks", method: "GET /repos/{owner}/{repo}/hooks" },
      { name: "Create Webhook", description: "Create a repository webhook", method: "POST /repos/{owner}/{repo}/hooks" },
    ],
    "GitLab": [
      { name: "List Projects", description: "Get list of projects", method: "GET /projects" },
      { name: "Create Project", description: "Create a new project", method: "POST /projects" },
      { name: "List Pipelines", description: "List project pipelines", method: "GET /projects/{id}/pipelines" },
      { name: "Trigger Pipeline", description: "Trigger a pipeline", method: "POST /projects/{id}/pipeline" },
      { name: "List Merge Requests", description: "List merge requests", method: "GET /projects/{id}/merge_requests" },
      { name: "Create Merge Request", description: "Create a merge request", method: "POST /projects/{id}/merge_requests" },
      { name: "List Webhooks", description: "List project webhooks", method: "GET /projects/{id}/hooks" },
      { name: "Create Webhook", description: "Create a project webhook", method: "POST /projects/{id}/hooks" },
    ],
    "Slack": [
      { name: "Post Message", description: "Send a message to a channel", method: "POST /chat.postMessage" },
      { name: "Update Message", description: "Update an existing message", method: "POST /chat.update" },
      { name: "Delete Message", description: "Delete a message", method: "POST /chat.delete" },
      { name: "List Channels", description: "List all channels", method: "GET /conversations.list" },
      { name: "Create Channel", description: "Create a new channel", method: "POST /conversations.create" },
      { name: "List Users", description: "List all users", method: "GET /users.list" },
      { name: "Get User Info", description: "Get user information", method: "GET /users.info" },
      { name: "Upload File", description: "Upload a file", method: "POST /files.upload" },
      { name: "List Files", description: "List files in workspace", method: "GET /files.list" },
      { name: "Create Reaction", description: "Add reaction to message", method: "POST /reactions.add" },
    ],
    "AWS": [
      { name: "EC2: List Instances", description: "List EC2 instances", method: "aws ec2 describe-instances" },
      { name: "EC2: Create Instance", description: "Launch EC2 instance", method: "aws ec2 run-instances" },
      { name: "EC2: Terminate Instance", description: "Terminate EC2 instance", method: "aws ec2 terminate-instances" },
      { name: "S3: List Buckets", description: "List S3 buckets", method: "aws s3 ls" },
      { name: "S3: Create Bucket", description: "Create S3 bucket", method: "aws s3 mb" },
      { name: "S3: Upload Object", description: "Upload file to S3", method: "aws s3 cp" },
      { name: "RDS: List Databases", description: "List RDS instances", method: "aws rds describe-db-instances" },
      { name: "RDS: Create Database", description: "Create RDS instance", method: "aws rds create-db-instance" },
      { name: "Lambda: List Functions", description: "List Lambda functions", method: "aws lambda list-functions" },
      { name: "Lambda: Invoke Function", description: "Invoke Lambda function", method: "aws lambda invoke" },
      { name: "IAM: List Users", description: "List IAM users", method: "aws iam list-users" },
      { name: "IAM: Create User", description: "Create IAM user", method: "aws iam create-user" },
    ],
    "Kubernetes": [
      { name: "List Pods", description: "List all pods", method: "kubectl get pods" },
      { name: "Create Pod", description: "Create a pod", method: "kubectl create pod" },
      { name: "Delete Pod", description: "Delete a pod", method: "kubectl delete pod" },
      { name: "List Services", description: "List all services", method: "kubectl get services" },
      { name: "Create Service", description: "Create a service", method: "kubectl create service" },
      { name: "List Deployments", description: "List deployments", method: "kubectl get deployments" },
      { name: "Create Deployment", description: "Create deployment", method: "kubectl create deployment" },
      { name: "Scale Deployment", description: "Scale deployment replicas", method: "kubectl scale deployment" },
      { name: "Get Logs", description: "Get pod logs", method: "kubectl logs" },
      { name: "Describe Resource", description: "Describe resource details", method: "kubectl describe" },
      { name: "Apply Manifest", description: "Apply YAML manifest", method: "kubectl apply -f" },
      { name: "List Namespaces", description: "List all namespaces", method: "kubectl get namespaces" },
    ],
    "ArgoCD": [
      { name: "List Applications", description: "List ArgoCD applications", method: "GET /api/v1/applications" },
      { name: "Get Application", description: "Get application details", method: "GET /api/v1/applications/{name}" },
      { name: "Create Application", description: "Create new application", method: "POST /api/v1/applications" },
      { name: "Sync Application", description: "Sync application", method: "POST /api/v1/applications/{name}/sync" },
      { name: "Rollback Application", description: "Rollback application", method: "POST /api/v1/applications/{name}/rollback" },
      { name: "List Repositories", description: "List Git repositories", method: "GET /api/v1/repositories" },
      { name: "Create Repository", description: "Add Git repository", method: "POST /api/v1/repositories" },
    ],
    "Kafka": [
      { name: "List Topics", description: "List all Kafka topics", method: "kafka-topics --list" },
      { name: "Create Topic", description: "Create a new topic", method: "kafka-topics --create" },
      { name: "Delete Topic", description: "Delete a topic", method: "kafka-topics --delete" },
      { name: "Describe Topic", description: "Get topic details", method: "kafka-topics --describe" },
      { name: "Produce Message", description: "Produce message to topic", method: "kafka-console-producer" },
      { name: "Consume Messages", description: "Consume messages from topic", method: "kafka-console-consumer" },
      { name: "List Consumer Groups", description: "List consumer groups", method: "kafka-consumer-groups --list" },
      { name: "Describe Consumer Group", description: "Get consumer group details", method: "kafka-consumer-groups --describe" },
    ],
    "Terraform": [
      { name: "Initialize", description: "Initialize Terraform", method: "terraform init" },
      { name: "Plan", description: "Create execution plan", method: "terraform plan" },
      { name: "Apply", description: "Apply changes", method: "terraform apply" },
      { name: "Destroy", description: "Destroy infrastructure", method: "terraform destroy" },
      { name: "Validate", description: "Validate configuration", method: "terraform validate" },
      { name: "Format", description: "Format configuration files", method: "terraform fmt" },
      { name: "State List", description: "List resources in state", method: "terraform state list" },
      { name: "State Show", description: "Show resource in state", method: "terraform state show" },
    ],
    "Jenkins": [
      { name: "List Jobs", description: "List all jobs", method: "GET /api/json?tree=jobs[name]" },
      { name: "Get Job Info", description: "Get job information", method: "GET /job/{name}/api/json" },
      { name: "Build Job", description: "Trigger job build", method: "POST /job/{name}/build" },
      { name: "Get Build Info", description: "Get build information", method: "GET /job/{name}/{buildNumber}/api/json" },
      { name: "Get Build Console", description: "Get build console output", method: "GET /job/{name}/{buildNumber}/consoleText" },
      { name: "Stop Build", description: "Stop running build", method: "POST /job/{name}/{buildNumber}/stop" },
    ],
    "CircleCI": [
      { name: "List Projects", description: "List all projects", method: "GET /api/v2/project" },
      { name: "Get Pipeline", description: "Get pipeline details", method: "GET /api/v2/pipeline/{id}" },
      { name: "Trigger Pipeline", description: "Trigger a pipeline", method: "POST /api/v2/project/{project-slug}/pipeline" },
      { name: "List Workflows", description: "List pipeline workflows", method: "GET /api/v2/pipeline/{id}/workflow" },
      { name: "Get Job", description: "Get job details", method: "GET /api/v2/project/{project-slug}/job/{job-number}" },
      { name: "Cancel Job", description: "Cancel a job", method: "POST /api/v2/project/{project-slug}/job/{job-number}/cancel" },
    ],
    "GCP": [
      { name: "List Instances", description: "List Compute Engine instances", method: "gcloud compute instances list" },
      { name: "Create Instance", description: "Create Compute Engine instance", method: "gcloud compute instances create" },
      { name: "List Buckets", description: "List Cloud Storage buckets", method: "gsutil ls" },
      { name: "Create Bucket", description: "Create Cloud Storage bucket", method: "gsutil mb" },
      { name: "List Databases", description: "List Cloud SQL instances", method: "gcloud sql instances list" },
      { name: "List Functions", description: "List Cloud Functions", method: "gcloud functions list" },
      { name: "Deploy Function", description: "Deploy Cloud Function", method: "gcloud functions deploy" },
    ],
    "Google Cloud Platform": [
      { name: "List Instances", description: "List Compute Engine instances", method: "gcloud compute instances list" },
      { name: "Create Instance", description: "Create Compute Engine instance", method: "gcloud compute instances create" },
      { name: "List Buckets", description: "List Cloud Storage buckets", method: "gsutil ls" },
      { name: "Create Bucket", description: "Create Cloud Storage bucket", method: "gsutil mb" },
      { name: "List Databases", description: "List Cloud SQL instances", method: "gcloud sql instances list" },
      { name: "List Functions", description: "List Cloud Functions", method: "gcloud functions list" },
      { name: "Deploy Function", description: "Deploy Cloud Function", method: "gcloud functions deploy" },
    ],
    "Microsoft Azure": [
      { name: "List VMs", description: "List virtual machines", method: "az vm list" },
      { name: "Create VM", description: "Create virtual machine", method: "az vm create" },
      { name: "List Storage Accounts", description: "List storage accounts", method: "az storage account list" },
      { name: "List Databases", description: "List SQL databases", method: "az sql db list" },
      { name: "List Functions", description: "List Azure Functions", method: "az functionapp list" },
      { name: "Deploy Function", description: "Deploy Azure Function", method: "az functionapp deployment" },
    ],
    "Azure": [
      { name: "List VMs", description: "List virtual machines", method: "az vm list" },
      { name: "Create VM", description: "Create virtual machine", method: "az vm create" },
      { name: "List Storage Accounts", description: "List storage accounts", method: "az storage account list" },
      { name: "List Databases", description: "List SQL databases", method: "az sql db list" },
      { name: "List Functions", description: "List Azure Functions", method: "az functionapp list" },
      { name: "Deploy Function", description: "Deploy Azure Function", method: "az functionapp deployment" },
    ],
    "Amazon Web Services": [
      { name: "EC2: List Instances", description: "List EC2 instances", method: "aws ec2 describe-instances" },
      { name: "EC2: Create Instance", description: "Launch EC2 instance", method: "aws ec2 run-instances" },
      { name: "EC2: Terminate Instance", description: "Terminate EC2 instance", method: "aws ec2 terminate-instances" },
      { name: "S3: List Buckets", description: "List S3 buckets", method: "aws s3 ls" },
      { name: "S3: Create Bucket", description: "Create S3 bucket", method: "aws s3 mb" },
      { name: "S3: Upload Object", description: "Upload file to S3", method: "aws s3 cp" },
      { name: "RDS: List Databases", description: "List RDS instances", method: "aws rds describe-db-instances" },
      { name: "RDS: Create Database", description: "Create RDS instance", method: "aws rds create-db-instance" },
      { name: "Lambda: List Functions", description: "List Lambda functions", method: "aws lambda list-functions" },
      { name: "Lambda: Invoke Function", description: "Invoke Lambda function", method: "aws lambda invoke" },
      { name: "IAM: List Users", description: "List IAM users", method: "aws iam list-users" },
      { name: "IAM: Create User", description: "Create IAM user", method: "aws iam create-user" },
    ],
  }
  
  return operationsMapping[serviceName] || []
}
