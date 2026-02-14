# 🚀 Migración a Producción: Rate Limiting con Upstash Redis

## ⚠️ IMPORTANTE: Cambiar Rate Limiting antes de Desplegar

**El rate limiting actual usa `Map` en memoria**, lo que significa:

- ❌ Se reinicia cada vez que el servidor se reinicia
- ❌ No funciona en serverless (Vercel, AWS Lambda, etc.)
- ❌ No comparte estado entre múltiples instancias

**En producción DEBES usar Upstash Redis o Vercel KV.**

---

## 📋 Opción 1: Upstash Redis (Recomendado)

### Paso 1: Crear cuenta en Upstash

1. Ve a https://upstash.com
2. Crea una cuenta gratis
3. Crear nueva base de datos Redis
4. Copia las credenciales: `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`

### Paso 2: Agregar variables de entorno

```bash
# .env.local o Vercel Environment Variables
UPSTASH_REDIS_REST_URL=https://your-endpoint.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

### Paso 3: Instalar dependencia

```bash
npm install @upstash/redis
```

### Paso 4: Reemplazar en `app/api/upload/route.ts`

**❌ ELIMINAR (código actual):**

```typescript
const uploadAttempts = new Map<string, number[]>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const maxAttempts = 10;

  const attempts = uploadAttempts.get(ip) || [];
  const recentAttempts = attempts.filter((time) => now - time < windowMs);

  if (recentAttempts.length >= maxAttempts) {
    return false;
  }

  recentAttempts.push(now);
  uploadAttempts.set(ip, recentAttempts);
  return true;
}
```

**✅ AGREGAR (producción):**

```typescript
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

async function rateLimit(ip: string): Promise<boolean> {
  const key = `upload:${ip}`;
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hora
  const maxAttempts = 10;

  // Get current attempts
  const attempts = (await redis.get<number[]>(key)) || [];

  // Filter recent attempts
  const recentAttempts = attempts.filter((time) => now - time < windowMs);

  if (recentAttempts.length >= maxAttempts) {
    return false;
  }

  // Add current attempt
  recentAttempts.push(now);

  // Save to Redis with 1 hour expiration
  await redis.set(key, recentAttempts, { ex: 3600 });

  return true;
}
```

**⚠️ IMPORTANTE: Cambiar función a async**

```typescript
// Antes
export async function POST(request: NextRequest) {
  if (!rateLimit(ip)) { // ❌

// Después
export async function POST(request: NextRequest) {
  if (!(await rateLimit(ip))) { // ✅
```

### Paso 5: Hacer lo mismo en `app/api/job-application/route.ts`

Reemplazar:

```typescript
const applicationAttempts = new Map<string, number[]>();
```

Por:

```typescript
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

async function rateLimit(ip: string): Promise<boolean> {
  const key = `application:${ip}`;
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hora
  const maxAttempts = 5; // Más estricto

  const attempts = (await redis.get<number[]>(key)) || [];
  const recentAttempts = attempts.filter((time) => now - time < windowMs);

  if (recentAttempts.length >= maxAttempts) {
    return false;
  }

  recentAttempts.push(now);
  await redis.set(key, recentAttempts, { ex: 3600 });
  return true;
}
```

---

## 📋 Opción 2: Vercel KV (Solo si despliegas en Vercel)

### Paso 1: Habilitar KV en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Storage → Create Database → KV
3. Las variables de entorno se agregan automáticamente

### Paso 2: Instalar dependencia

```bash
npm install @vercel/kv
```

### Paso 3: Reemplazar código

```typescript
import { kv } from "@vercel/kv";

async function rateLimit(ip: string): Promise<boolean> {
  const key = `upload:${ip}`;
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const maxAttempts = 10;

  const attempts = (await kv.get<number[]>(key)) || [];
  const recentAttempts = attempts.filter((time) => now - time < windowMs);

  if (recentAttempts.length >= maxAttempts) {
    return false;
  }

  recentAttempts.push(now);
  await kv.set(key, recentAttempts, { ex: 3600 });
  return true;
}
```

---

## 🧪 Probar Rate Limiting en Producción

### Prueba 1: Upload Rate Limit

```bash
# Subir 11 archivos seguidos desde la misma IP
for i in {1..11}; do
  curl -X POST https://tu-dominio.com/api/upload \
    -F "resume=@test.pdf"
done

# Resultado esperado:
# Primeros 10: 200 OK
# Número 11: 429 Too Many Requests
```

### Prueba 2: Application Rate Limit

```bash
# Enviar 6 aplicaciones seguidas
for i in {1..6}; do
  curl -X POST https://tu-dominio.com/api/job-application \
    -H "Content-Type: application/json" \
    -d '{"fullName":"Test","email":"test@example.com",...}'
done

# Resultado esperado:
# Primeros 5: 200 OK
# Número 6: 429 Too Many Requests
```

---

## 📊 Comparación de Opciones

| Feature              | In-Memory Map | Upstash Redis | Vercel KV           |
| -------------------- | ------------- | ------------- | ------------------- |
| **Costo**            | Gratis        | $0-10/mes     | $0-20/mes           |
| **Serverless**       | ❌ No         | ✅ Sí         | ✅ Sí               |
| **Multi-instancia**  | ❌ No         | ✅ Sí         | ✅ Sí               |
| **Persistencia**     | ❌ No         | ✅ Sí         | ✅ Sí               |
| **Configuración**    | Fácil         | Media         | Muy fácil (Vercel)  |
| **Vendor lock-in**   | -             | Bajo          | Alto (solo Vercel)  |
| **Recomendado para** | Desarrollo    | Producción    | Producción (Vercel) |

---

## ⚡ Recordatorio de Despliegue

### Checklist Pre-Deploy

- [ ] Cambiar rate limiting de `Map` a Upstash/Vercel KV
- [ ] Configurar variables de entorno en producción
- [ ] Agregar reCAPTCHA keys (si usas reCAPTCHA)
- [ ] Verificar que `STRAPI_API_TOKEN` esté en producción
- [ ] Probar rate limiting en staging primero

### Variables de Entorno Necesarias

```bash
# Strapi
NEXT_PUBLIC_STRAPI_URL=https://tu-strapi.com
STRAPI_API_TOKEN=...

# reCAPTCHA (opcional)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=...
RECAPTCHA_SECRET_KEY=...

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...

# O Vercel KV (automático en Vercel)
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

---

## 🔍 Monitoreo en Producción

### Logs a revisar

```typescript
// En Upstash Dashboard verás:
// - Número de requests a Redis
// - Keys activas (upload:IP, application:IP)
// - Métricas de uso

// En tu aplicación:
console.log(`Rate limit triggered for IP: ${ip}`);
// → Alerta si es muy frecuente
```

### Alertas recomendadas

- Si >10% de requests reciben 429 → Posible ataque
- Si mismo IP hace >50 requests/hora → Bloquear IP
- Si Redis está down → Fallback a aceptar requests (fail open)

---

**Última actualización**: Diciembre 10, 2025
**Prioridad**: 🔴 CRÍTICA - Cambiar antes de deploy
