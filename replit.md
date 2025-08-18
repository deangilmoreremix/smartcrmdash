# Overview

This is a modern CRM (Customer Relationship Management) application built with React/TypeScript frontend and Node.js/Express backend. The system provides comprehensive contact management, deal tracking, task organization, and AI-powered features for sales and marketing automation. The application uses a monorepo structure with shared schemas and type definitions between client and server.

# User Preferences

Preferred communication style: Simple, everyday language.

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