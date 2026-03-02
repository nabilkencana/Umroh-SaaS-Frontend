# 🔌 API Integration Guide

## Backend API Endpoints

### Base URL
```
Development: http://localhost:3001/api
Production: https://api.yourdomain.com/api
```

## Authentication

### Login
```typescript
POST /auth/login
Body: {
  email: string;
  password: string;
}
Response: {
  access_token: string;
  refresh_token: string;
  user: User;
}
```

### Refresh Token
```typescript
POST /auth/refresh
Body: {
  refresh_token: string;
}
Response: {
  access_token: string;
}
```

## Promo Endpoints

### Get All Promos
```typescript
GET /promo
Query: {
  tenant_id?: string;
  is_active?: boolean;
  is_featured?: boolean;
}
Response: Promo[]
```

### Get Promo by ID
```typescript
GET /promo/:id
Response: Promo
```

### Create Promo (Super Admin Only)
```typescript
POST /promo
Headers: {
  Authorization: Bearer <token>
}
Body: {
  title: string;
  description?: string;
  banner_image?: string;
  discount_percentage?: number;
  start_date?: string;
  end_date?: string;
  tenant_id?: string;
  is_featured?: boolean;
}
Response: Promo
```

### Update Promo
```typescript
PATCH /promo/:id
Headers: {
  Authorization: Bearer <token>
}
Body: Partial<Promo>
Response: Promo
```

### Delete Promo
```typescript
DELETE /promo/:id
Headers: {
  Authorization: Bearer <token>
}
Response: { success: boolean }
```

## Jamaah Endpoints

### Get All Jamaah
```typescript
GET /jamaah
Headers: {
  Authorization: Bearer <token>
}
Query: {
  tenant_id?: string;
  branch_id?: string;
  status?: string;
}
Response: Jamaah[]
```

### Create Jamaah
```typescript
POST /jamaah
Headers: {
  Authorization: Bearer <token>
}
Body: {
  full_name: string;
  passport_number: string;
  phone: string;
  branch_id?: string;
}
Response: Jamaah
```

### Update Jamaah
```typescript
PATCH /jamaah/:id
Headers: {
  Authorization: Bearer <token>
}
Body: Partial<Jamaah>
Response: Jamaah
```

## Tracking Endpoints

### Get Tracking Logs
```typescript
GET /tracking
Headers: {
  Authorization: Bearer <token>
}
Query: {
  tenant_id?: string;
  jamaah_id?: string;
  date?: string;
}
Response: TrackingLog[]
```

### WebSocket Connection
```typescript
// Connect to WebSocket
const ws = new WebSocket('ws://localhost:3001/tracking');

// Join tenant room
ws.send(JSON.stringify({
  event: 'join',
  data: { tenant_id: 'xxx' }
}));

// Listen for updates
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Handle tracking update
};

// Send location update
ws.send(JSON.stringify({
  event: 'location_update',
  data: {
    jamaah_id: 'xxx',
    latitude: 21.4225,
    longitude: 39.8262,
    status: 'active'
  }
}));
```

## Analytics Endpoints

### Get Dashboard Stats
```typescript
GET /analytics/dashboard
Headers: {
  Authorization: Bearer <token>
}
Response: {
  total_tenants: number;
  total_jamaah: number;
  active_promos: number;
  tracking_today: number;
}
```

### Get Promo Performance
```typescript
GET /analytics/promo-performance
Headers: {
  Authorization: Bearer <token>
}
Response: {
  promo_id: string;
  views: number;
  clicks: number;
  conversion_rate: number;
}[]
```

## Frontend Integration Examples

### 1. API Client Setup
```typescript
// lib/api-client.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}
```

### 2. Authentication Hook
```typescript
// hooks/useAuth.ts
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/dashboard/login');
      return;
    }
    
    // Verify token and get user
    fetchUser(token);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
    setUser(response.user);
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    router.push('/dashboard/login');
  };

  return { user, loading, login, logout };
}
```

### 3. Promo Service
```typescript
// services/promo.service.ts
import { apiRequest } from '@/lib/api-client';
import { Promo } from '@/lib/types';

export const promoService = {
  getAll: (params?: { tenant_id?: string }) => 
    apiRequest<Promo[]>('/promo', {
      method: 'GET',
    }),

  getById: (id: string) => 
    apiRequest<Promo>(`/promo/${id}`),

  create: (data: Partial<Promo>) => 
    apiRequest<Promo>('/promo', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Promo>) => 
    apiRequest<Promo>(`/promo/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) => 
    apiRequest(`/promo/${id}`, {
      method: 'DELETE',
    }),
};
```

### 4. WebSocket Hook
```typescript
// hooks/useTracking.ts
'use client';

import { useEffect, useState } from 'react';

export function useTracking(tenantId: string) {
  const [trackingData, setTrackingData] = useState([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const websocket = new WebSocket(
      process.env.NEXT_PUBLIC_WS_URL + '/tracking'
    );

    websocket.onopen = () => {
      websocket.send(JSON.stringify({
        event: 'join',
        data: { tenant_id: tenantId }
      }));
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTrackingData(prev => [...prev, data]);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [tenantId]);

  const sendLocation = (jamaahId: string, lat: number, lng: number) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        event: 'location_update',
        data: {
          jamaah_id: jamaahId,
          latitude: lat,
          longitude: lng,
          status: 'active'
        }
      }));
    }
  };

  return { trackingData, sendLocation };
}
```

### 5. Usage in Components
```typescript
// app/promo/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { promoService } from '@/services/promo.service';

export default function PromoPage() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPromos();
  }, []);

  const loadPromos = async () => {
    try {
      const data = await promoService.getAll();
      setPromos(data);
    } catch (error) {
      console.error('Failed to load promos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {promos.map(promo => (
        <PromoCard key={promo.id} promo={promo} />
      ))}
    </div>
  );
}
```

## Error Handling

```typescript
// lib/error-handler.ts
export class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
  }
}

export async function handleAPIError(error: any) {
  if (error.status === 401) {
    // Refresh token or redirect to login
    localStorage.removeItem('access_token');
    window.location.href = '/dashboard/login';
  } else if (error.status === 403) {
    // Forbidden - show error message
    alert('Anda tidak memiliki akses ke resource ini');
  } else {
    // Generic error
    console.error('API Error:', error);
  }
}
```

## Rate Limiting

Backend implements rate limiting:
- 100 requests per 15 minutes per IP
- 1000 requests per hour per authenticated user

## CORS Configuration

Backend CORS settings:
```typescript
{
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  credentials: true,
}
```

---

**Ready for seamless backend integration! 🔌**
