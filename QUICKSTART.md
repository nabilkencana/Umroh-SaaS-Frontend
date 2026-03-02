# 🚀 Quick Start Guide

## Prerequisites

Pastikan sudah terinstall:
- Node.js 20+ ([Download](https://nodejs.org/))
- npm atau yarn
- Git

## Installation (5 Menit)

### 1. Clone & Install
```bash
# Clone repository
git clone <repository-url>
cd frontend

# Install dependencies
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 🎯 Explore the App

### Public Pages
1. **Homepage** - `http://localhost:3000`
   - Hero section dengan gambar Makkah
   - Fitur unggulan
   - Destinasi spiritual
   - CTA section

2. **Promo Page** - `http://localhost:3000/promo`
   - Featured promo dengan countdown
   - Filter berdasarkan travel
   - Grid promo cards
   - Discount badges

### Dashboard Pages
3. **Login** - `http://localhost:3000/dashboard/login`
   - Mock login (langsung redirect ke dashboard)
   - Email: admin@example.com
   - Password: (any)

4. **Dashboard** - `http://localhost:3000/dashboard`
   - Statistics cards
   - Recent jamaah
   - Active promos

5. **Jamaah Management** - `http://localhost:3000/dashboard/jamaah`
   - List jamaah
   - Search functionality
   - CRUD operations (UI only)

6. **Real-time Tracking** - `http://localhost:3000/dashboard/tracking`
   - Live location updates (simulated)
   - Map placeholder
   - Tracking table

7. **Trip Management** - `http://localhost:3000/dashboard/trips`
   - Trip cards
   - Schedule information
   - Jamaah count

8. **Analytics** - `http://localhost:3000/dashboard/analytics`
   - Super Admin dashboard
   - Statistics overview
   - Promo performance

9. **Promo Admin** - `http://localhost:3000/dashboard/promo-admin`
   - Create/Edit promo
   - Promo list
   - Status management

## 📁 Project Structure

```
frontend/
├── app/
│   ├── components/          # Reusable components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── PromoCard.tsx
│   │   ├── DashboardLayout.tsx
│   │   └── ...
│   ├── dashboard/           # Dashboard pages
│   │   ├── page.tsx
│   │   ├── jamaah/
│   │   ├── tracking/
│   │   ├── trips/
│   │   ├── analytics/
│   │   └── promo-admin/
│   ├── promo/              # Public promo page
│   ├── page.tsx            # Homepage
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── lib/
│   ├── types.ts            # TypeScript types
│   ├── constants.ts        # App constants
│   ├── mock-data.ts        # Mock data
│   └── utils.ts            # Helper functions
├── public/
│   ├── images/             # Images
│   ├── icons/              # PWA icons
│   └── manifest.json       # PWA manifest
└── Documentation files
```

## 🎨 Customization

### 1. Change Colors
Edit `app/globals.css`:
```css
:root {
  --primary: #0F5132;      /* Your primary color */
  --secondary: #1B5E20;    /* Your secondary color */
  --accent: #D4AF37;       /* Your accent color */
}
```

### 2. Update Mock Data
Edit `lib/mock-data.ts`:
```typescript
export const mockPromos: Promo[] = [
  {
    id: '1',
    title: 'Your Promo Title',
    // ... your data
  }
];
```

### 3. Add New Page
```bash
# Create new page
mkdir app/your-page
touch app/your-page/page.tsx
```

```typescript
// app/your-page/page.tsx
export default function YourPage() {
  return <div>Your Content</div>;
}
```

### 4. Add New Component
```bash
touch app/components/YourComponent.tsx
```

```typescript
// app/components/YourComponent.tsx
export default function YourComponent() {
  return <div>Your Component</div>;
}
```

## 🔧 Common Tasks

### Build for Production
```bash
npm run build
npm start
```

### Check TypeScript Errors
```bash
npx tsc --noEmit
```

### Lint Code
```bash
npm run lint
```

### Clear Cache
```bash
rm -rf .next node_modules
npm install
```

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Build Errors
```bash
# Clear everything and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Images Not Loading
- Check images exist in `public/images/`
- Use correct path: `/images/filename.jpg`
- Use Next.js Image component

## 📚 Learn More

### Documentation
- [README.md](README.md) - Getting started
- [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture details
- [FEATURES.md](FEATURES.md) - Feature documentation
- [API_INTEGRATION.md](API_INTEGRATION.md) - Backend integration
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub](https://github.com/vercel/next.js)

### Tailwind CSS
- [Tailwind Documentation](https://tailwindcss.com/docs)
- [Tailwind UI](https://tailwindui.com)

## 🎯 Next Steps

### 1. Explore the Code
- Browse through components
- Check mock data structure
- Review type definitions

### 2. Customize Design
- Update colors
- Change fonts
- Modify layouts

### 3. Add Features
- Create new pages
- Build new components
- Extend functionality

### 4. Backend Integration
- Read [API_INTEGRATION.md](API_INTEGRATION.md)
- Connect to NestJS API
- Implement authentication

### 5. Deploy
- Read [DEPLOYMENT.md](DEPLOYMENT.md)
- Choose hosting platform
- Deploy to production

## 💡 Tips

### Development
- Use React DevTools for debugging
- Check browser console for errors
- Use TypeScript for type safety

### Performance
- Optimize images before upload
- Use lazy loading for heavy components
- Monitor bundle size

### Best Practices
- Follow component structure
- Keep components small and focused
- Use TypeScript types
- Write clean, readable code

## 🆘 Need Help?

### Common Issues
1. **Build fails**: Clear cache and reinstall
2. **Images not showing**: Check file paths
3. **Styles not applying**: Check Tailwind config
4. **TypeScript errors**: Check type definitions

### Resources
- Check documentation files
- Review code examples
- Search Next.js docs
- Check GitHub issues

## ✅ Checklist

Before starting development:
- [ ] Node.js 20+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server running (`npm run dev`)
- [ ] Browser opened (http://localhost:3000)
- [ ] All pages accessible
- [ ] No console errors

Ready to customize:
- [ ] Read documentation
- [ ] Understand project structure
- [ ] Review mock data
- [ ] Check type definitions
- [ ] Explore components

Ready for production:
- [ ] Build succeeds (`npm run build`)
- [ ] All pages work
- [ ] Images optimized
- [ ] Environment variables set
- [ ] Backend integrated (optional)

---

**Happy Coding! 🚀**

Need help? Check the documentation files or create an issue.
