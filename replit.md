# AffiliateHub - Replit Configuration

## Overview

AffiliateHub is a comprehensive affiliate marketing management platform built as a full-stack web application. It provides affiliate marketers with a centralized dashboard to manage programs, track links, monitor performance, and analyze earnings across multiple affiliate networks.

The application follows a modern web architecture with a React frontend, Express.js backend, PostgreSQL database via Neon, and uses shadcn/ui for the component library.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite for development and production builds
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **Styling**: Tailwind CSS with shadcn/ui components
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Authentication**: Replit Auth integration with session management
- **API Design**: RESTful API with CRUD operations

### Database Architecture
- **Database**: PostgreSQL via Neon Database
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations
- **Session Storage**: PostgreSQL-based session store using connect-pg-simple

## Key Components

### Core Entities
1. **Users**: Authentication and profile management via Replit Auth
2. **Affiliate Programs**: Program details, commission structures, and status tracking
3. **Affiliate Links**: Link management with click and conversion tracking
4. **Performance Data**: Analytics and reporting data
5. **User Settings**: Notification preferences and configuration

### Authentication & Authorization
- **Provider**: Replit Auth with OpenID Connect
- **Session Management**: Server-side sessions stored in PostgreSQL
- **Security**: Secure session cookies with HTTP-only flags
- **Authorization**: Route-level authentication middleware

### Data Storage
- **Primary Database**: PostgreSQL hosted on Neon
- **ORM**: Drizzle ORM with schema-first approach
- **Migrations**: Managed via Drizzle Kit
- **Connection**: Neon serverless driver with WebSocket support

### API Structure
- **Authentication Routes**: `/api/auth/*` for user management
- **Program Management**: `/api/programs` for CRUD operations
- **Link Management**: `/api/links` for affiliate link operations
- **Analytics**: `/api/analytics/*` for performance data
- **Settings**: `/api/settings` for user preferences

## Data Flow

### User Authentication Flow
1. User accesses protected route
2. Authentication middleware checks session
3. If unauthenticated, redirects to Replit Auth
4. On successful auth, creates/updates user record
5. Establishes secure session

### Data Management Flow
1. Frontend makes API requests with credentials
2. Backend validates authentication and authorization
3. Drizzle ORM handles database operations
4. Response data is formatted and returned
5. TanStack Query manages client-side caching

### Analytics Pipeline
1. Performance data is collected from affiliate networks
2. Data is stored in the performance_data table
3. Analytics API aggregates data for reporting
4. Charts and visualizations display insights

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless database
- **Authentication**: Replit Auth service
- **UI Components**: shadcn/ui component library
- **Charts**: Recharts for data visualization
- **Validation**: Zod for schema validation

### Development Tools
- **Build Tool**: Vite with React plugin
- **Development Server**: Express with Vite middleware
- **Database Management**: Drizzle Kit for schema management
- **Error Handling**: Replit runtime error overlay

### Production Dependencies
- **Session Store**: connect-pg-simple for PostgreSQL sessions
- **Security**: CORS and security headers
- **Process Management**: Node.js process management

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with HMR
- **Database**: Neon development database
- **Authentication**: Replit Auth development mode
- **Error Handling**: Runtime error modal for debugging

### Production Build
- **Frontend**: Vite build with static asset optimization
- **Backend**: esbuild bundling with ESM output
- **Database**: Neon production database with connection pooling
- **Process**: Node.js production server

### Environment Configuration
- **Database URL**: PostgreSQL connection string via environment variable
- **Session Secret**: Secure session signing key
- **Auth Configuration**: Replit Auth OIDC settings
- **CORS**: Domain-specific CORS configuration

## Changelog

- July 06, 2025: Initial setup
- July 06, 2025: Added affiliate application tracking system with full CRUD operations
- July 06, 2025: Implemented comprehensive affiliate tracking platform addressing major industry pain points:
  * Multi-network commission tracking and reconciliation
  * Advanced fraud detection and security monitoring
  * Content performance tracking and optimization
  * Competitor intelligence and market analysis
  * Tax compliance management and reporting
  * Link health monitoring and uptime tracking
  * Real-time analytics with 50%+ cost savings features
  * AI-powered optimization capabilities through OpenAI integration
  * Enhanced dashboard with comprehensive pain point solutions

## Recent Changes

### Advanced Affiliate Management Features
- **Commission Payment Tracking**: Full CRUD operations for managing payments across multiple networks
- **Link Monitoring System**: Real-time health checks, uptime monitoring, and broken link detection
- **Fraud Detection Engine**: AI-powered suspicious activity detection with risk scoring
- **Content Performance Analytics**: Track ROI and performance across all content channels
- **Competitor Intelligence**: Monitor competitor strategies and market positioning
- **Tax Compliance Dashboard**: Automated 1099 generation and regulatory compliance tracking
- **Advanced Analytics Engine**: Multi-dimensional reporting with predictive insights

### Database Schema Expansion
- Added 8 new comprehensive tables for enterprise-level affiliate tracking
- Implemented proper relations and foreign key constraints
- Added fraud detection algorithms and risk assessment capabilities
- Created content performance tracking with SEO impact analysis

### API Architecture
- Comprehensive REST API with 20+ endpoints covering all tracking features
- Advanced analytics endpoint providing multi-network insights
- Real-time monitoring capabilities for link health and fraud detection
- Secure authentication and authorization for all sensitive operations

## User Preferences

Preferred communication style: Simple, everyday language.