# 🏗️ Architecture Documentation

## Frontend Architecture

### Technology Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Hooks (useState, useEffect)
- **Routing**: Next.js App Router

### Design Patterns

#### 1. Component Structure
```
components/
├── Layout Components (Navbar, Footer, DashboardLayout)
├── Feature Components (PromoCard, CountdownTimer)
├── UI Components (LoadingSpinner, EmptyState, StatsCard)
└── Page Components (app/*/page.tsx)
```

#### 2. Data Flow
```
Mock Data (lib/mock-data.ts)
    ↓
Type Definitions (lib/types.ts)
    ↓
Components (useState/useEffect)
    ↓
UI Rendering
```

#### 3. Folder Structure
```
app/                    # Next.js App Router
├── components/         # Reusable components
├── dashboard/          # Protected dashboard pages
├── promo/             # Public promo pages
├── page.tsx           # Homepage
├── layout.tsx         # Root layout
└── globals.css        # Global styles

lib/                   # Utilities & helpers
├── types.ts           # TypeScript interfaces
├── constants.ts       # App constants
├── mock-data.ts       # Development data
└── utils.ts           # Helper functions

public/                # Static assets
├── images/            # Images
├── icons/             # PWA icons
└── manifest.json      # PWA manifest
```

### Key Features Implementation

#### 1. Multi-Tenant Support
- Tenant filtering in promo page
- Tenant-specific data isolation
- Role-based access control ready

#### 2. Real-time Tracking
- WebSocket ready structure
- Live update simulation
- Location data management

#### 3. PWA Configuration
- Manifest.json configured
- Offline-ready structure
- Installable app

#### 4. Responsive Design
- Mobile-first approach
- Tailwind responsive utilities
- Adaptive layouts

### Performance Optimization

#### 1. Image Optimization
- Next.js Image component
- Lazy loading
- Responsive images

#### 2. Code Splitting
- Automatic with Next.js App Router
- Dynamic imports ready
- Route-based splitting

#### 3. Caching Strategy
- Static generation ready
- API caching ready
- Redis integration ready

### Security Considerations

#### 1. Authentication Flow
```
Login Page → JWT Token → Protected Routes → Dashboard
```

#### 2. Role-Based Access
```typescript
enum Role {
  SUPER_ADMIN,    // Full access
  ADMIN_CABANG,   // Branch management
  PEMBIMBING,     // Guide access
  JAMAAH,         // Pilgrim access
  KELUARGA        // Family access
}
```

#### 3. Data Isolation
- Tenant ID filtering
- Branch ID filtering
- User role validation

### Integration Points

#### 1. Backend API
```typescript
// Ready for integration
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const WS_URL = process.env.NEXT_PUBLIC_WS_URL;
```

#### 2. WebSocket
```typescript
// Tracking realtime updates
ws://localhost:3001/tracking
```

#### 3. Authentication
```typescript
// JWT token management
localStorage.setItem('token', jwt);
```

### Scalability Features

#### 1. Component Reusability
- Modular components
- Props-based customization
- Type-safe interfaces

#### 2. State Management
- Local state for UI
- Ready for Redux/Zustand
- Context API ready

#### 3. API Integration
- Centralized API calls ready
- Error handling structure
- Loading states

### Testing Strategy (Ready)

#### 1. Unit Tests
- Component testing
- Utility function testing
- Type checking

#### 2. Integration Tests
- Page flow testing
- API integration testing
- User journey testing

#### 3. E2E Tests
- Critical path testing
- Multi-tenant scenarios
- Role-based access testing

### Deployment Strategy

#### 1. Development
```bash
npm run dev
```

#### 2. Production Build
```bash
npm run build
npm start
```

#### 3. Environment Variables
- `.env.local` for development
- `.env.production` for production
- Secure secrets management

### Future Enhancements

#### 1. Real Backend Integration
- [ ] Connect to NestJS API
- [ ] Implement JWT authentication
- [ ] WebSocket for tracking
- [ ] Redis caching

#### 2. Advanced Features
- [ ] Google Maps integration
- [ ] Push notifications
- [ ] Offline sync
- [ ] File uploads
- [ ] PDF/Excel exports

#### 3. Performance
- [ ] Server-side rendering
- [ ] Static site generation
- [ ] Image optimization
- [ ] Bundle size optimization

### Monitoring & Analytics

#### 1. Performance Monitoring
- Core Web Vitals
- Load time tracking
- Error tracking

#### 2. User Analytics
- Page views
- User flows
- Conversion tracking

#### 3. Business Metrics
- Promo performance
- User engagement
- Tenant statistics

---

**Architecture designed for scalability, maintainability, and production readiness.**
