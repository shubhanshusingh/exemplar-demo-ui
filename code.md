# Exemplar Console - Code Documentation

## Project Overview

The Exemplar Console is a **Next.js-based internal developer platform (IDP)** that serves as an AI-powered platform engineering assistant. It's designed to help development teams with service management, infrastructure provisioning, and developer productivity.

## Architecture & Technology Stack

### Frontend
- **Next.js 15** with React 19 (App Router)
- **TypeScript** for type safety
- **Tailwind CSS** for styling with custom PostHog-inspired design system
- **Radix UI** components for accessible UI primitives
- **Lucide React** for icons

### Backend
- **Next.js API Routes** for backend functionality
- **AI SDK** with OpenAI GPT-4o integration
- **Vercel** for deployment

### Key Dependencies
\`\`\`json
{
  "@ai-sdk/openai": "latest",
  "@ai-sdk/react": "latest",
  "ai": "latest",
  "next": "15.2.4",
  "react": "^19",
  "react-dom": "^19",
  "tailwindcss": "^3.4.17",
  "typescript": "^5"
}
\`\`\`

## Core Features

### 1. AI-Powered Chat Interface
- Main interaction point with the platform
- Uses OpenAI's GPT-4o model via AI SDK
- Supports tool calling for platform operations
- Contextual suggestions and quick commands
- Located in `app/page.tsx`

### 2. Modular Tab System
The application uses a configurable tab system defined in `tab-config.json`:

#### Currently Enabled Tabs:
- **AI Tab** (expanded by default) with subtabs:
  - **Prompt Hub**: Template management for AI prompts
  - **AI Memory**: Contextual memory system for AI interactions
  - **AI Guardrails**: Safety and compliance controls
  - **Human-in-the-Loop**: Manual review workflows
- **Integrations Tab** with subtabs:
  - **Cloud Integration**: AWS/GCP/Azure management
  - **Vault/Secrets**: Secret management
  - **External Services**: Third-party service integration
- **Utilities Tab**: Developer tools and utilities

#### Disabled Tabs (can be enabled via config):
- Chat, Catalog, Platform Engineering Insights, Portal, Tech Radar

### 3. AI Tools & Capabilities

The AI assistant has access to several tools defined in `app/api/chat/route.ts`:

- **`deployService`**: Deploy services to different environments
- **`checkServiceHealth`**: Monitor service health and metrics
- **`serviceCatalog`**: Browse and search internal services
- **`platformMetrics`**: Get platform engineering KPIs
- **`provisionInfrastructure`**: Provision cloud resources
- **`manageSecrets`**: Handle secret management
- **`complianceCheck`**: Verify compliance requirements

## Key Components

### Prompt Hub (`components/prompt-hub.tsx`)
- Template library for AI prompts
- Categories: Code Review, Documentation, Debugging, Architecture, Testing
- Prompt creation wizard
- Usage analytics and ratings
- Playground for testing prompts

### AI Memory (`components/ai-memory.tsx`)
- Stores contextual information from conversations
- Memory types: Conversations, Code Context, Decisions, Learnings
- Relevance scoring and search capabilities
- Analytics dashboard for memory usage

### AI Guardrails (`components/ai-guardrails.tsx`)
- Content safety filters
- Security controls (PII detection, code security)
- Compliance checks (GDPR, etc.)
- Performance monitoring
- Real-time blocking and warning system

### Vault Secrets (`components/vault-secrets.tsx`)
- Secret management interface
- Integration with HashiCorp Vault
- Secret rotation and access control
- Audit logging

### Other Components
- **Cloud Integrations** (`components/cloud-integrations.tsx`): Multi-cloud management
- **Service Catalog** (`components/service-catalog.tsx`): Service discovery and management
- **Tech Radar** (`components/tech-radar.tsx`): Technology evaluation and tracking
- **Dev Tools** (`components/dev-tools.tsx`): Developer utilities
- **Platform Dashboard** (`components/platform-dashboard.tsx`): Engineering insights

## Configuration System

### Tab Configuration (`tab-config.json`)
\`\`\`json
{
  "tabs": {
    "ai": {
      "enabled": true,
      "label": "AI",
      "icon": "Bot",
      "expandByDefault": true,
      "subtabs": {
        "prompt-hub": {
          "enabled": true,
          "label": "PROMPT_HUB",
          "icon": "Bot"
        }
      }
    }
  }
}
\`\`\`

Controls:
- Which tabs are enabled/disabled
- Tab labels and icons
- Subtab configuration
- Default expanded states

## Design System

### Color Palette
- Primary: `posthog-orange` (#FF6B4A)
- Secondary: `posthog-orange-dark` (#E55A3A)
- Background: `posthog-cream` (#F9F7F4)
- Text: `posthog-black` (#1D1D1D)
- Gray: `posthog-gray` (#6B7280)

### Typography
- Monospace fonts for technical feel
- Responsive design for mobile and desktop
- Dark/light theme support

## Quick Commands

The platform includes predefined quick commands for common tasks:

### Platform Engineering
- Show platform metrics for last 30 days
- Check compliance for payment-service
- Provision microservice infrastructure
- Analyze cost optimization opportunities

### Developer Experience
- Search service catalog for authentication
- Check developer onboarding progress
- Show deployment frequency metrics
- List platform governance policies

### Infrastructure
- Deploy my-app to production
- Check health of api-service
- Scale frontend to 3 instances

### AWS Commands
- List all ec2 instances in us-east-1
- Create s3 bucket for user-uploads
- Deploy lambda function user-auth
- Backup rds database prod-db

## File Structure

\`\`\`
exemplar-console-ui/
├── app/
│   ├── api/chat/route.ts          # AI chat API endpoint
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main application page
├── components/
│   ├── ui/                        # Radix UI components
│   ├── ai-guardrails.tsx          # AI safety controls
│   ├── ai-memory.tsx              # AI memory system
│   ├── cloud-integrations.tsx     # Cloud management
│   ├── dev-tools.tsx              # Developer utilities
│   ├── platform-dashboard.tsx     # Engineering insights
│   ├── prompt-hub.tsx             # Prompt management
│   ├── service-catalog.tsx        # Service discovery
│   ├── tech-radar.tsx             # Technology tracking
│   └── vault-secrets.tsx          # Secret management
├── lib/
│   └── utils.ts                   # Utility functions
├── tab-config.json                # Tab configuration
├── tailwind.config.ts             # Tailwind configuration
└── package.json                   # Dependencies
\`\`\`

## Development Workflow

1. **v0.dev Integration**: Built with v0.dev and automatically synced
2. **Vercel Deployment**: Live deployment at the provided Vercel URL
3. **Real-time Updates**: Changes from v0.dev automatically push to this repository

## API Endpoints

### `/api/chat` (POST)
- Main AI chat endpoint
- Uses OpenAI GPT-4o model
- Supports tool calling for platform operations
- Streams responses for real-time interaction

## State Management

The application uses React hooks for state management:
- `useState` for local component state
- `useChat` from AI SDK for chat functionality
- Context providers for theme and mobile detection

## Security Features

- AI guardrails for content safety
- PII detection and redaction
- Code security scanning
- API rate limiting
- GDPR compliance checks
- Secret management integration

## Performance Optimizations

- Next.js App Router for optimized routing
- Tailwind CSS for efficient styling
- Radix UI for accessible, performant components
- Streaming responses for better UX
- Lazy loading of components

## Deployment

- **Platform**: Vercel
- **Framework**: Next.js
- **Environment**: Production-ready with CI/CD
- **Domain**: Automatically deployed from v0.dev

## Future Enhancements

Potential areas for improvement:
- Real-time collaboration features
- Advanced analytics and reporting
- Integration with more cloud providers
- Enhanced AI model support
- Mobile app development
- Advanced workflow automation
