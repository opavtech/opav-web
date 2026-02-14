# Auditoría Completa SEO, Performance y Accesibilidad - Home Page

**Fecha**: 15 de Diciembre, 2025  
**Página**: app/[locale]/page.tsx

## ✅ Cambios Implementados

### 1. **Success Section - Filtro OPAV vs B&S**

- ✅ Componente `SuccessCasesFilter.tsx` creado
- ✅ Filtros interactivos con animaciones (Framer Motion)
- ✅ Descripción de cada empresa en los filtros
- ✅ Contador de casos mostrados
- ✅ Animaciones suaves al cambiar filtro
- ✅ Estados vacíos manejados
- ✅ Traducciones ES/EN completas

### 2. **TypeScript Errors**

- ✅ Arreglados 7 errores de tipo en `getLocalizedPath`
- ✅ Type assertions agregados: `locale as 'es' | 'en'`

---

## 🔍 Mejoras SEO Críticas (IMPLEMENTAR)

### **Meta Tags y Structured Data**

#### 1. **Agregar JSON-LD BreadcrumbList** ⚠️ ALTA PRIORIDAD

```typescript
// Agregar al final de page.tsx, dentro del return
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: locale === "es" ? "Inicio" : "Home",
          item: `https://opav.com.co/${locale}`,
        },
      ],
    }),
  }}
/>
```

#### 2. **Agregar Schema LocalBusiness** ⚠️ ALTA PRIORIDAD

```typescript
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://opav.com.co/#business",
  "name": "OPAV SAS",
  "image": "https://opav.com.co/images/logos/opav-logo.png",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Tu dirección aquí",
    "addressLocality": "Bogotá",
    "addressRegion": "Cundinamarca",
    "postalCode": "110111",
    "addressCountry": "CO"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 4.7110,
    "longitude": -74.0721
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "08:00",
    "closes": "18:00"
  },
  "telephone": "+57-1-XXX-XXXX",
  "email": "info@opav.com.co"
}
```

#### 3. **Mejorar Open Graph Images**

- ❌ Falta `og:image:width` y `og:image:height`
- ❌ Agregar múltiples imágenes (cuadradas y rectangulares)

```typescript
images: [
  {
    url: `${baseUrl}/images/og/opav-og-1200x630.jpg`, // Crear esta imagen
    width: 1200,
    height: 630,
    alt: "OPAV SAS - Administración de Propiedades",
    type: "image/jpeg",
  },
  {
    url: `${baseUrl}/images/og/opav-og-square.jpg`, // Crear esta imagen
    width: 1200,
    height: 1200,
    alt: "OPAV SAS Logo",
    type: "image/jpeg",
  },
];
```

#### 4. **Agregar Canonical Tag Dinámico**

```typescript
// Verificar que está en generateMetadata
alternates: {
  canonical: `${baseUrl}/${locale}`,
  languages: {
    'es-CO': `${baseUrl}/es`,
    'en-US': `${baseUrl}/en`,
    'x-default': `${baseUrl}/es` // Agregar default
  }
}
```

#### 5. **Agregar meta robots avanzados**

```typescript
robots: {
  index: true,
  follow: true,
  nocache: false,
  googleBot: {
    index: true,
    follow: true,
    noimageindex: false,
    'max-video-preview': -1,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
}
```

### **Content SEO**

#### 6. **Agregar Schema.org FAQPage** 🎯 RECOMENDADO

Crear sección FAQ al final del home con preguntas frecuentes:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Qué servicios ofrece OPAV?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "OPAV ofrece administración integral de propiedades corporativas..."
      }
    }
  ]
}
```

#### 7. **Optimizar Hero para Featured Snippets**

- ✅ Ya tiene H1 optimizado
- ⚠️ Agregar structured data para el hero metric

#### 8. **Internal Linking Optimization**

- ⚠️ Agregar más links internos con anchor text descriptivo
- ⚠️ Asegurar que todos los CTAs tengan `aria-label` descriptivos

---

## ⚡ Mejoras de Performance (IMPLEMENTAR)

### **Images**

#### 9. **Lazy Loading Agresivo** ⚠️ ALTA PRIORIDAD

```typescript
// Hero image - mantener priority
<Image priority loading="eager" fetchPriority="high" />

// Todas las demás imágenes
<Image loading="lazy" />

// Certificación ISO (below fold)
<Image
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/svg+xml;base64,..."
/>
```

#### 10. **Responsive Images Sizes Optimizados**

```typescript
// Company showcase images
sizes = "(max-width: 640px) 100vw, (max-width: 768px) 50vw, 600px";

// Success case images
sizes = "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px";
```

#### 11. **WebP/AVIF Format** 🎯 CRÍTICO

```bash
# Convertir todas las imágenes a WebP
cwebp -q 85 hero-background.png -o hero-background.webp
cwebp -q 85 opav-showcase.jpg -o opav-showcase.webp
cwebp -q 85 bs-facilities-showcase.png -o bs-facilities-showcase.webp

# Next.js auto-optimiza, pero asegurar:
# next.config.ts
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

### **Fonts**

#### 12. **Optimizar Font Loading** ⚠️ CRÍTICO

```typescript
// lib/fonts.ts
import { Inter } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Evita FOIT
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true, // Reduce CLS
  variable: '--font-inter',
})

// Usar en layout.tsx
<body className={inter.variable}>
```

#### 13. **Preconnect a Google Fonts** (si se usa)

```typescript
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
```

### **CSS & JavaScript**

#### 14. **Code Splitting Mejorado**

```typescript
// Lazy load components below fold
const CorporateTestimonials = dynamic(
  () => import("@/components/CorporateTestimonials"),
  {
    loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
    ssr: true, // Mantener SSR para SEO
  }
);

const SuccessCasesFilter = dynamic(
  () => import("@/components/SuccessCasesFilter")
);
const InsightsCarousel = dynamic(() => import("@/components/InsightsCarousel"));
```

#### 15. **Remover Framer Motion de componentes simples**

- ⚠️ AnimatedSection usa intersection observer - BIEN
- ⚠️ SuccessCasesFilter usa Framer Motion - considerar CSS animations para filtro

### **Critical CSS**

#### 16. **Inline Critical CSS** 🎯 AVANZADO

```typescript
// Extraer CSS crítico del hero y navbar
// Usar critters o manual extraction
<style
  dangerouslySetInnerHTML={{
    __html: `
    /* Hero critical styles */
    .hero-title-copperplate { font-family: 'Copperplate', serif; }
  `,
  }}
/>
```

---

## ♿ Mejoras de Accesibilidad (IMPLEMENTAR)

### **ARIA y Semántica**

#### 17. **Mejorar Landmarks** ⚠️ MEDIA PRIORIDAD

```typescript
// Hero section
<section aria-labelledby="hero-title" role="banner">
  <h1 id="hero-title">{t("hero.title")}</h1>
</section>

// Company section
<section aria-labelledby="company-title">
  <h2 id="company-title">{t("company.title")}</h2>
</section>
```

#### 18. **Skip Links** ⚠️ ALTA PRIORIDAD

```typescript
// Agregar al inicio del <main>
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded"
>
  Saltar al contenido principal
</a>
```

#### 19. **Botones y Links Accesibles**

```typescript
// Todos los botones deben tener aria-label cuando solo tienen íconos
<button aria-label="Cerrar filtro de casos de éxito">
  <svg>...</svg>
</button>

// Links deben describir destino
<Link aria-label="Ver detalles de certificación ISO 9001:2015">
  Ver Detalles
</Link>
```

#### 20. **Focus Visible Mejorado**

```css
/* globals.css */
*:focus-visible {
  outline: 2px solid #d50058;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Para elementos oscuros */
.dark *:focus-visible {
  outline-color: #fff;
}
```

### **Keyboard Navigation**

#### 21. **Tab Index Optimizado**

```typescript
// Filtros de Success Cases
<button
  role="tab"
  aria-selected={activeFilter === "OPAV"}
  aria-controls="opav-cases"
  tabIndex={activeFilter === "OPAV" ? 0 : -1}
>
  OPAV
</button>
```

#### 22. **Escape para cerrar modales/carruseles**

```typescript
// InsightsCarousel.tsx
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      // cerrar expanded view
    }
  };
  document.addEventListener("keydown", handleEscape);
  return () => document.removeEventListener("keydown", handleEscape);
}, []);
```

### **Screen Readers**

#### 23. **Live Regions para cambios dinámicos**

```typescript
// Success Cases Filter
<div aria-live="polite" aria-atomic="true" className="sr-only">
  Mostrando {filteredCases.length} casos de {activeFilter}
</div>
```

#### 24. **Describir elementos visuales**

```typescript
<div role="img" aria-label="Patrón decorativo de fondo">
  {/* Background pattern */}
</div>
```

---

## 📊 Core Web Vitals Optimization

### **LCP (Largest Contentful Paint)** - Objetivo: < 2.5s

#### 25. **Hero Background Priority** ⚠️ CRÍTICO

```typescript
<Image
  src="/images/hero/hero-background.png"
  priority
  loading="eager"
  fetchPriority="high" // Agregar
  quality={90} // Ya está
/>
```

#### 26. **Resource Hints**

```typescript
// layout.tsx <head>
<link rel="dns-prefetch" href="https://your-strapi-domain.com" />
<link rel="preconnect" href="https://your-strapi-domain.com" />
```

### **CLS (Cumulative Layout Shift)** - Objetivo: < 0.1

#### 27. **Aspect Ratios Fijos**

```typescript
// Todas las imágenes deben tener width y height explícitos
<Image
  width={1200}
  height={630}
  // o aspect ratio fijo
  className="aspect-video"
/>
```

#### 28. **Skeleton Loaders**

```typescript
// Para contenido dinámico de Strapi
{!certificaciones ? (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
  </div>
) : (
  // contenido real
)}
```

### **FID/INP (Interaction)** - Objetivo: < 200ms

#### 29. **Debounce en Filtros**

```typescript
// SuccessCasesFilter.tsx
import { useDebouncedCallback } from "use-debounce";

const debouncedFilter = useDebouncedCallback((filter) => {
  setActiveFilter(filter);
}, 100);
```

#### 30. **Reduce JS Bundle**

```bash
# Analizar bundle
pnpm build
pnpm analyze

# Remover dependencias innecesarias
# Verificar que lucide-react solo importe iconos usados
import { Building2, MapPin } from 'lucide-react'; // ✅ Bien (tree-shaking)
```

---

## 🔒 Security Headers (Implementar en next.config.ts)

#### 31. **Headers de Seguridad**

```typescript
// next.config.ts
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload'
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin'
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()'
        }
      ]
    }
  ]
}
```

---

## 📱 PWA & Mobile Optimization

#### 32. **Manifest.json** 🎯 RECOMENDADO

```json
{
  "name": "OPAV SAS - Administración de Propiedades",
  "short_name": "OPAV",
  "description": "Líder en administración de propiedades corporativas",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#d50058",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

#### 33. **Apple Touch Icons**

```html
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
```

---

## 🧪 Testing & Monitoring

#### 34. **Lighthouse CI** 🎯 IMPLEMENTAR

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install && npm run build
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://opav.com.co
            https://opav.com.co/en
          uploadArtifacts: true
```

#### 35. **Web Vitals Tracking**

```typescript
// app/layout.tsx
import { WebVitals } from "@/components/WebVitals";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <WebVitals /> {/* Ya existe, verificar que envíe a Analytics */}
      </body>
    </html>
  );
}
```

---

## 📋 Checklist de Implementación

### 🔴 CRÍTICO (Hacer YA)

- [ ] Implementar lazy loading agresivo (#9)
- [ ] Optimizar hero background con fetchPriority (#25)
- [ ] Agregar JSON-LD BreadcrumbList (#1)
- [ ] Agregar Schema LocalBusiness (#2)
- [ ] Convertir imágenes a WebP/AVIF (#11)
- [ ] Optimizar font loading (#12)
- [ ] Agregar skip links (#18)
- [ ] Aspect ratios fijos para todas las imágenes (#27)

### 🟡 ALTA PRIORIDAD (Esta semana)

- [ ] Mejorar Open Graph images (#3)
- [ ] Code splitting components below fold (#14)
- [ ] ARIA landmarks mejorados (#17)
- [ ] Botones y links accesibles (#19)
- [ ] Resource hints (preconnect, dns-prefetch) (#26)
- [ ] Security headers (#31)

### 🟢 MEDIA PRIORIDAD (Próximas 2 semanas)

- [ ] Schema FAQPage (#6)
- [ ] Focus visible mejorado (#20)
- [ ] Tab index optimizado (#21)
- [ ] Live regions (#23)
- [ ] Skeleton loaders (#28)
- [ ] Debounce en filtros (#29)
- [ ] PWA manifest (#32)

### 🔵 BAJA PRIORIDAD (Cuando tengas tiempo)

- [ ] Inline critical CSS (#16)
- [ ] Lighthouse CI (#34)
- [ ] Bundle analysis (#30)

---

## 🎯 Métricas Objetivo

| Métrica           | Actual (estimado) | Objetivo | Acción Principal                 |
| ----------------- | ----------------- | -------- | -------------------------------- |
| **LCP**           | ~3.5s             | < 2.5s   | Hero image priority + WebP       |
| **FID**           | ~150ms            | < 100ms  | Code splitting + debounce        |
| **CLS**           | ~0.15             | < 0.1    | Aspect ratios + skeleton loaders |
| **SEO Score**     | 85                | 95+      | Schema.org + meta tags           |
| **Accessibility** | 88                | 95+      | ARIA + skip links + focus        |
| **Performance**   | 75                | 90+      | Images + fonts + lazy loading    |

---

## 📝 Notas Finales

1. **Priorizar según impacto**: Los items críticos pueden mejorar el score de Lighthouse en 15-20 puntos
2. **Testing incremental**: Implementar cambios en batches y medir con Lighthouse
3. **Monitoreo continuo**: Usar WebVitals component para tracking en producción
4. **No sobre-optimizar**: Algunos items de baja prioridad pueden no valer el esfuerzo

**Próximo paso recomendado**: Ejecutar `pnpm build && pnpm start` y hacer audit con Lighthouse para baseline actual.
