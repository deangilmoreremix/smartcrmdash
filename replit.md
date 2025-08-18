# Overview

This is a modern CRM (Customer Relationship Management) application built with React/TypeScript frontend and Node.js/Express backend. The system provides comprehensive contact management, deal tracking, task organization, and AI-powered features for sales and marketing automation. The application uses a monorepo structure with shared schemas and type definitions between client and server.

# User Preferences

Preferred communication style: Simple, everyday language.
Design Implementation: Always use the exact design, styling, and structure from attached assets rather than creating custom interpretations. Follow the specific component layouts, color schemes, and UI patterns exactly as provided in the attached asset files.

# Recent Changes (2025-01-18)

## Comprehensive CRM System Implementation (January 18, 2025)
- **Removed 5 specific placeholder sales analytics routes** as requested: /sales-analytics, /quote-builder, /commission-tracker, /follow-up-reminders, /territory-management
- **Implemented 9 comprehensive ready-to-use pages** from attached assets:
  - **PhoneSystem** - Complete VoIP system with dialer, call logs, voicemail management
  - **Invoicing** - Enhanced invoice management with templates and tracking
  - **ContentLibrary** - Media content management and organization system
  - **FormsAndSurveys** - Complete form builder with 858+ lines of functionality
  - **VoiceProfiles** - Voice settings and AI voice management interface
  - **BusinessAnalysis** - AI-powered business analysis and insights tool
  - **Appointments** - Full calendar/scheduling system with 1000+ lines of professional scheduling capabilities
  - **CircleProspecting** - Geographic prospecting with AI-powered lead scoring
  - **CommunicationHub** - Unified SMS, WhatsApp & Email messaging system
- **Technical Updates**: Fixed routing conflicts, resolved duplicate imports, updated App.tsx with proper protected routes
- **User Confirmed**: Appointments system working with comprehensive calendar features, contact integration, and professional scheduling interface
- **Design Consistency Requirement**: User requires exact implementation of design patterns from attached assets - no custom interpretations or modifications to styling/structure
- **Phase 1 Design System Complete (2025-01-18)**: Implemented comprehensive design system with dark mode support, CSS variables, and glass morphism effects. Created design-system.css, updated index.css with theme variables, and extended Tailwind config with design tokens.

## Remote Contacts Integration Success
- Successfully embedded user's remote contacts module from Netlify
- Implemented comprehensive bridge system for CRM-remote module communication
- Added navigation capabilities allowing remote module to control CRM routing
- Created documentation and JavaScript bridge code for future enhancements
- Resolved performance issues by removing complex local implementations in favor of direct remote embedding
- User confirmed navigation functionality is working as expected

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript, built using Vite for fast development and optimized builds
- **Styling**: Tailwind CSS for utility-first styling with shadcn/ui component library for consistent UI components
- **State Management**: Zustand stores for global state management across different domains (contacts, deals, tasks, appointments)
- **Routing**: React Router for client-side navigation
- **Component Architecture**: Feature-based organization with shared UI components, contexts for cross-cutting concerns (theme, video calls, navigation), and lazy-loaded pages for performance

## Backend Architecture
- **Framework**: Express.js with TypeScript for the API server
- **Development Setup**: Hot reloading with Vite integration and custom error handling middleware
- **Storage Layer**: Modular storage interface with in-memory implementation for development and PostgreSQL support for production
- **API Design**: RESTful endpoints with `/api` prefix and standardized error handling

## Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless hosting for production
- **ORM**: Drizzle ORM for type-safe database operations and schema management
- **Schema**: Shared schema definitions in TypeScript covering users, contacts, deals, and related entities
- **Development**: In-memory storage implementation for rapid development and testing

## Authentication and Authorization
- **Session Management**: Connect-pg-simple for PostgreSQL-backed session storage
- **Multi-tenancy**: Built-in support for tenant-based access control with role-based permissions
- **User Roles**: Hierarchical permission system supporting super admin, partner admin, customer admin, and end user roles

## AI Integration Architecture
- **Multiple Providers**: Support for both OpenAI and Google Gemini AI models with automatic provider selection
- **AI Services**: Modular AI services for contact enrichment, email composition, predictive analytics, and automation suggestions
- **Context Management**: AI context providers for managing AI state and operations across components
- **Intelligence Features**: Advanced AI capabilities including lead scoring, automated insights, and intelligent recommendations

## AI Goals System Architecture (Completed 2025-01-18)
- **Goal Management**: Comprehensive goal store with 58+ pre-configured business goals across 6 categories (Sales, Marketing, Relationship, Automation, Analytics, Content)
- **Agent Orchestration**: Composio service managing 7 specialized AI agents with role-based capabilities and model preferences
- **Real-time Execution**: Live goal execution with step-by-step progress tracking, agent thinking visualization, and CRM integration
- **Interactive Interface**: Goal cards with priority indicators, ROI metrics, filtering, and execution modals
- **State Management**: Zustand-based goal store with persistence, execution tracking, and performance analytics
- **Data Architecture**: Structured goal types, execution steps, progress tracking, and result management

## Remote Contacts Module Integration (Completed 2025-01-18)
- **Iframe Embedding**: Direct integration of remote contacts module (https://taupe-sprinkles-83c9ee.netlify.app) within CRM interface
- **Bidirectional Communication**: PostMessage-based bridge system for real-time data synchronization between remote module and CRM
- **Navigation Bridge**: Remote module can control parent CRM navigation (dashboard, deals, tasks, calendar routing)
- **Contact Synchronization**: Automatic sync of contact data between remote module and local CRM store
- **Bridge Services**: RemoteContactsBridge service managing secure cross-origin communication with fallback mechanisms
- **Developer Integration**: Complete documentation and JavaScript bridge code for extending remote module functionality

## External Dependencies

### Core Infrastructure
- **Database Hosting**: Neon (@neondatabase/serverless) for serverless PostgreSQL
- **Authentication**: Supabase (@supabase/supabase-js) for user authentication and session management
- **File Storage**: Integrated with Supabase for document and media storage

### AI Services
- **Google AI**: Gemini models for content generation and analysis
- **OpenAI**: GPT models for advanced language processing tasks
- **AI Orchestration**: Custom service layer for managing multiple AI providers and fallback strategies

### Communication
- **Video Calling**: Simple-peer for WebRTC-based video communication with PeerJS infrastructure
- **Real-time Features**: WebSocket support for live updates and notifications
- **Email Integration**: SMTP integration for email automation and tracking

### Development Tools
- **Build System**: Vite with React plugin and TypeScript support
- **Code Quality**: ESLint and TypeScript for code quality and type safety
- **Development Environment**: Replit-specific plugins for cloud development experience

### UI and Visualization
- **Charts**: Recharts for data visualization and analytics dashboards
- **Drag and Drop**: @hello-pangea/dnd for Kanban boards and sortable interfaces
- **Date Handling**: date-fns for date manipulation and formatting
- **Search**: Fuse.js for fuzzy search capabilities across contacts and deals

### Utilities
- **HTTP Client**: TanStack Query for API state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe forms
- **Styling Utilities**: clsx and class-variance-authority for dynamic styling
- **Command Interface**: cmdk for command palette functionality