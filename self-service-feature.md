# Self-Service Action Feature

## Overview
A comprehensive self-service platform that empowers developers to provision, manage, and operate infrastructure and services independently while maintaining organizational guardrails and compliance standards.

## Key Features

### 1. Rich Self-Service Frontend
- Create intuitive, good-looking self-service interfaces in seconds
- Build forms, wizards, and multi-step workflows
- Implement input validation and custom approval workflows
- Support both simple forms and complex multi-step processes

### 2. Loosely Coupled Infrastructure Integration
- Seamlessly integrate with existing tools and workflows
- Support for GitHub Workflows, Azure pipelines, Terraform, and custom automation
- Fire automation on form submission with `OnFormSubmit()` functionality
- Enable long-running and asynchronous actions

### 3. Stateful Operations
- All self-service actions automatically reflect in the software catalog
- Create, modify, or delete catalog entities through actions
- Maintain consistency between actions and catalog state
- Support temporary and permanent resource management

### 4. Role-Based Access Control
- Define granular permissions for teams and users
- Control what actions users can perform and how often
- Implement policy-based approvals and organizational requirements
- Ensure self-service only when actions conform to standards

## Popular Use Cases

### Microservices SDLC
- Add secrets and environment variables
- Force merge pull requests (with crisis bypass options)
- Scaffold new microservices
- Deploy with canary or blue-green strategies
- Manage feature flags and package upgrades
- Lock deployments and revert changes

### Data & ML Operations
- Train and deploy ML models
- Pre-process datasets
- Execute A/B testing traffic routing
- Spin up remote Jupyter notebooks
- Manage Airflow DAGs and data pipelines
- Duplicate and modify database tables

### SRE & Operations
- Update pod counts and auto-scaling groups
- Execute incident response runbooks
- Manage cloud resource provisioning
- Handle permissions and access control

### Developer Environments
- Spin up ephemeral developer environments with TTL
- ETL mock data to environments
- Invite developers to environments
- Extend environment time limits

## Benefits
- **Eliminate Infrastructure Clutter**: Transform time-consuming DevOps tasks into one-click operations
- **Faster Delivery**: Save thousands of hours on understanding and managing infrastructure
- **Quality & Compliance**: Use scorecards and golden paths to maintain standards
- **Developer Happiness**: Reduce context switching and improve developer experience
- **80% Reduction in Jira Tickets**: Let developers run free with proper guardrails

## Technical Requirements
- Support for long-running and asynchronous actions
- Real-time run logs and status updates
- TTL (Time To Live) support for temporary resources
- Integration with existing CI/CD pipelines and infrastructure tools
- Comprehensive audit trails and approval workflows

## Implementation Notes
This self-service action feature will enable developers to operate independently while maintaining organizational standards, significantly improving developer productivity and reducing operational overhead.

## Reference
Based on [Port.io Self-Service Platform](https://www.port.io/product/self-service) 