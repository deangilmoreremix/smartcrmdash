# Overview

This project is a modern CRM (Customer Relationship Management) application designed to streamline sales and marketing operations. It features comprehensive contact management, deal tracking, task organization, and leverages AI for advanced automation. The system uses a monorepo structure, ensuring seamless integration and shared type definitions between its React/TypeScript frontend and Node.js/Express backend. The business vision is to provide a robust, AI-powered platform that significantly enhances sales velocity, win rates, deal sizes, and overall productivity for users.

## Recent Updates (January 2025)
- **Enhanced Entitlements System**: Complete subscription management with product types (lifetime, monthly, yearly, payment_plan), usage tracking, and automated enforcement
- **Multi-Tenant Email System**: Complete implementation of app context tracking and email template routing
- **Supabase Authentication**: Full integration with custom email templates matching SmartCRM branding
- **Webhook Configuration**: Automated user routing system for multi-app email isolation
- **Email Templates**: Professional templates optimized for spam filter avoidance using "Confirm Reauthentication" approach
- **Bulk Import System**: CSV-based user creation with automated email notifications and Supabase integration

# User Preferences

Preferred communication style: Simple, everyday language.
Design Implementation: Always use the exact design, styling, and structure from attached assets rather than creating custom interpretations. Follow the specific component layouts, color schemes, and UI patterns exactly as provided in the attached asset files.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript, built using Vite.
- **Styling**: Tailwind CSS with shadcn/ui for consistent UI components.
- **State Management**: Zustand stores for global state management.
- **Routing**: React Router for client-side navigation.
- **Component Architecture**: Feature-based organization with shared UI components, contexts, and lazy-loaded pages.
- **UI/UX Decisions**: Exact implementation of design patterns from attached assets, including specific component layouts, color schemes, and UI patterns. Features glass morphism and modern buttons on certain pages. Application defaults to light mode.

## Backend Architecture
- **Framework**: Express.js with TypeScript.
- **Storage Layer**: Modular storage interface supporting in-memory for development and PostgreSQL for production.
- **API Design**: RESTful endpoints with standardized error handling.

## Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless hosting for production.
- **ORM**: Drizzle ORM for type-safe database operations.
- **Schema**: Shared TypeScript schema definitions for core entities including comprehensive entitlements system.
- **Development**: In-memory storage.
- **Entitlements**: Advanced subscription management with timezone-aware revocation, payment tracking, and automated enforcement.

## Authentication and Authorization
- **Session Management**: PostgreSQL-backed session storage.
- **Multi-tenancy**: Built-in support for tenant-based access control.
- **User Roles**: Hierarchical permission system (super admin, partner admin, customer admin, end user).
- **Entitlements System**: Product-type based access control (lifetime, monthly, yearly, payment_plan) with automated enforcement and timezone-aware revocation.

## AI Integration Architecture
- **GPT-5 Official Integration**: Full implementation using OpenAI's GPT-5 model, utilizing its advanced API parameters (verbosity, reasoning_effort, custom tools, context-free grammar).
- **Expert-Level AI Services**: Production-ready GPT-5 service layer providing strategic business intelligence, advanced coding capabilities, and multimodal analysis.
- **Performance Optimizations**: Leverages GPT-5's efficiency improvements for reduced output tokens, fewer tool calls, and reduced thinking time.

## AI Goals System Architecture
- **Goal Management**: Comprehensive goal store with 58+ pre-configured business goals across 6 categories.
- **Agent Orchestration**: Composio service managing 7 specialized AI agents.
- **Real-time Execution**: Live goal execution with progress tracking, agent thinking visualization, and CRM integration.
- **State Management**: Zustand-based goal store with persistence.

## Remote Modules Integration
- **Integration**: Direct integration of multiple remote modules (Contacts, Pipeline, White Label Suite, Product Research, AI Analytics Dashboard) via iframes.
- **Communication**: Bidirectional PostMessage-based bridge system for real-time data synchronization and navigation control between remote modules and CRM.
- **Scalability**: Supports multiple remote modules with consistent loading patterns and a unified loading system.
- **Connected Apps Conversion (2025-01-19)**: Converted external connected apps to remote embedded apps with full-screen integration:
  - FunnelCraft AI (/funnelcraft-ai) - Enhanced funnel creation and AI optimization tools
  - SmartCRM Closer (/smartcrm-closer) - Advanced sales closing and CRM intelligence  
  - ContentAI (/content-ai) - AI-powered content generation and optimization platform
- **Remote App Architecture**: All connected apps now use consistent remote loader pattern with light mode communication and full-screen display.

## Comprehensive CRM System Pages
- Implemented 9 comprehensive, ready-to-use pages: PhoneSystem, Invoicing, ContentLibrary, FormsAndSurveys, VoiceProfiles, BusinessAnalysis, Appointments, CircleProspecting, CommunicationHub.
- Landing page embedded via iframe while preserving other core routes.

# External Dependencies

### Core Infrastructure
- **Database Hosting**: Neon (@neondatabase/serverless)
- **Authentication**: Supabase (@supabase/supabase-js)
- **File Storage**: Supabase

### AI Services
- **Google AI**: Gemini models
- **OpenAI**: GPT models
- **AI Orchestration**: Custom service layer

### Communication
- **Video Calling**: Simple-peer (WebRTC) with PeerJS
- **Real-time Features**: WebSockets
- **Email Integration**: SMTP

### UI and Visualization
- **Charts**: Recharts
- **Drag and Drop**: @hello-pangea/dnd
- **Date Handling**: date-fns
- **Search**: Fuse.js

### Utilities
- **HTTP Client**: TanStack Query
- **Form Handling**: React Hook Form with Zod
- **Styling Utilities**: clsx, class-variance-authority
- **Command Interface**: cmdk
```