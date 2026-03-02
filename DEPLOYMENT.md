# 🚀 Deployment Guide

## Prerequisites

- Node.js 20+
- npm atau yarn
- Git

## Environment Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_WS_URL=wss://api.yourdomain.com
NEXT_PUBLIC_JWT_SECRET=your-production-secret
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Production Build

### 1. Build
```bash
npm run build
```

### 2. Test Production Build
```bash
npm start
```

### 3. Verify
- Check all pages load correctly
- Test responsive design
- Verify PWA functionality

## Deployment Options

### Option 1: Vercel (Recommended)

#### Via Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
```

#### Via Git Integration
1. Push code to GitHub
2. Import project di Vercel
3. Configure environment variables
4. Deploy

### Option 2: Netlify

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### Option 3: Docker

#### Dockerfile
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Build & Run
```bash
docker build -t umroh-frontend .
docker run -p 3000:3000 umroh-frontend
```

### Option 4: VPS (Ubuntu)

#### 1. Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 2. Install PM2
```bash
sudo npm install -g pm2
```

#### 3. Deploy Application
```bash
git clone <repository-url>
cd frontend
npm install
npm run build
pm2 start npm --name "umroh-frontend" -- start
pm2 save
pm2 startup
```

#### 4. Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Performance Optimization

### 1. Image Optimization
- Use Next.js Image component
- Compress images before upload
- Use WebP format

### 2. Code Splitting
- Automatic with Next.js
- Dynamic imports for heavy components

### 3. Caching
```javascript
// next.config.ts
export default {
  headers: async () => [
    {
      source: '/:all*(svg|jpg|png)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
};
```

## Monitoring

### 1. Vercel Analytics
```bash
npm install @vercel/analytics
```

### 2. Google Analytics
Add to `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 3. Error Tracking (Sentry)
```bash
npm install @sentry/nextjs
```

## Security Checklist

- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Rate limiting implemented
- [ ] Input validation
- [ ] XSS protection
- [ ] CSRF protection

## CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Rollback Strategy

### Vercel
```bash
vercel rollback
```

### PM2
```bash
pm2 reload umroh-frontend
```

### Docker
```bash
docker pull umroh-frontend:previous-tag
docker stop current-container
docker run -d umroh-frontend:previous-tag
```

## Troubleshooting

### Build Errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Memory Issues
```bash
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

## Post-Deployment

### 1. Verify Deployment
- [ ] Homepage loads
- [ ] Promo page works
- [ ] Dashboard accessible
- [ ] Images load correctly
- [ ] PWA installable

### 2. Performance Check
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals pass
- [ ] Load time < 3s

### 3. SEO Check
- [ ] Meta tags present
- [ ] Sitemap generated
- [ ] Robots.txt configured

---

**Ready for production deployment! 🚀**
