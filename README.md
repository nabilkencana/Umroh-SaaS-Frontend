# 🕌 Umroh Management System - Frontend

Platform SaaS Multi-Tenant untuk Manajemen Umroh dengan Next.js 16 dan TypeScript.

## 🎨 Design System

### Color Palette
- **Primary**: `#0F5132` (Emerald Green)
- **Secondary**: `#1B5E20` (Deep Green)
- **Accent**: `#D4AF37` (Gold)
- **Background**: `#FFFFFF` (White)

### Features
- ✅ Islamic modern design dengan pola subtle
- ✅ Gold border pada cards
- ✅ Elegant minimal UI
- ✅ Responsive design
- ✅ PWA ready

## 📁 Project Structure

```
app/
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── PromoCard.tsx
│   ├── DashboardLayout.tsx
│   └── CountdownTimer.tsx
├── dashboard/
│   ├── page.tsx (Dashboard utama)
│   ├── jamaah/page.tsx (Manajemen Jamaah)
│   ├── tracking/page.tsx (Tracking Realtime)
│   ├── trips/page.tsx (Manajemen Perjalanan)
│   ├── analytics/page.tsx (Analytics)
│   └── promo-admin/page.tsx (Kelola Promo)
├── promo/
│   └── page.tsx (Halaman Promo Publik)
├── page.tsx (Homepage)
├── layout.tsx
└── globals.css

lib/
├── types.ts (TypeScript interfaces)
├── constants.ts (App constants)
└── mock-data.ts (Mock data untuk development)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm atau yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```


Buka [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## 📱 Pages Overview

### Public Pages
- **/** - Homepage dengan hero section dan fitur unggulan
- **/promo** - Halaman promo dengan countdown timer dan filter

### Dashboard Pages (Protected)
- **/dashboard** - Dashboard utama dengan statistik
- **/dashboard/jamaah** - Manajemen data jamaah
- **/dashboard/tracking** - Tracking realtime lokasi jamaah
- **/dashboard/trips** - Manajemen perjalanan umroh
- **/dashboard/analytics** - Analytics dan laporan
- **/dashboard/promo-admin** - Kelola promo (Super Admin)

## 🎯 Key Features

### 1. Promo Management
- Banner slider dengan countdown timer
- Filter berdasarkan tenant
- Featured promo badge
- Discount percentage display
- Gold border animation

### 2. Dashboard
- Role-based access control
- Real-time statistics
- Sidebar navigation
- Responsive layout

### 3. Tracking System
- Real-time location updates
- Map integration ready
- Live status indicators
- Spiritual locations reference

### 4. Analytics
- Super Admin dashboard
- Tenant statistics
- Promo performance metrics
- Growth charts

## 🔐 Roles

```typescript
enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN_CABANG = 'admin_cabang',
  PEMBIMBING = 'pembimbing',
  JAMAAH = 'jamaah',
  KELUARGA = 'keluarga'
}
```

## 🗺️ Spiritual Locations

- **Masjid al-Haram** - Makkah (21.4225°N, 39.8262°E)
- **Masjid an-Nabawi** - Madinah (24.4672°N, 39.6111°E)

## 🎨 UI Components

### PromoCard
- Image banner dengan hover effect
- Discount badge
- Featured indicator
- Date range display
- CTA button

### DashboardLayout
- Sidebar navigation
- Top navbar dengan user info
- Responsive menu
- Active route highlighting

### CountdownTimer
- Real-time countdown
- Days, hours, minutes, seconds
- Auto-update setiap detik

## 📦 Dependencies

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **React 19** - UI library

## 🔄 Mock Data

Mock data tersedia di `lib/mock-data.ts`:
- Promo data
- Tenant data
- Jamaah data

## 🌐 PWA Configuration

PWA manifest tersedia di `public/manifest.json`:
- Installable
- Offline mode ready
- Theme color: #0F5132
- Icons: 192x192, 512x512

## 🎯 Next Steps

### Backend Integration
1. Connect ke NestJS API
2. Implement authentication (JWT)
3. WebSocket untuk tracking realtime
4. Redis caching

### Additional Features
1. Google Maps / Leaflet integration
2. Push notifications
3. Offline sync
4. File upload untuk banner promo
5. Export laporan (PDF/Excel)

## 📝 Notes

- Semua data saat ini menggunakan mock data
- Ready untuk integrasi dengan backend NestJS
- Design system mengikuti tema Islami modern
- Optimized untuk 1000+ concurrent users

## 🤝 Contributing

Sistem ini dibangun dengan clean architecture dan modular design untuk kemudahan maintenance dan scalability.

---

**Built with ❤️ for Umroh Travel Management**
