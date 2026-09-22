# Retiro progresivo de imágenes de firmas

El calendario está en `lib/signature-retirement.ts`. El middleware responde con un
PNG transparente en las URLs originales, sin borrar los archivos. Requiere desplegar
el frontend en Vercel; abrir el HTML localmente no activa este comportamiento.

Calendario (hora de Colombia, desde las 00:00 de cada fecha):

| Fecha | Imágenes que dejan de mostrarse |
| --- | --- |
| 21 de septiembre de 2026 | LinkedIn y web |
| 22 de septiembre de 2026 | Edificio, casa y ubicación |
| 23 de septiembre de 2026 | Teléfono |
| 24 de septiembre de 2026 | Correo |
| 25 de septiembre de 2026 | Líneas separadoras |
| 26 de septiembre de 2026 | Logos OPAV y BYS |

Los textos permanecen. El espacio ocupado por las
imágenes y los enlaces permanecen también. Una vez desplegado, las etapas vencidas
se aplican inmediatamente y las siguientes se evalúan en cada solicitud, sin cron.

Solo afecta imágenes que Outlook u otro lector descargue de estas rutas del dominio
que sirve este proyecto. Puede afectar tanto mensajes nuevos como antiguos. Las
copias incorporadas como adjuntos no cambian y las cachés de terceros pueden demorar
el efecto; las cabeceras no permiten borrar copias ya almacenadas por los lectores.

Para restaurar una imagen, quitar su entrada del calendario y volver a desplegar.
Para restaurar todas, vaciar el calendario y desplegar. Los originales se conservan.
Verificar en el dominio que una imagen retirada devuelve HTTP 200, `image/png` y
un PNG transparente; comprobar también una imagen conservada y una página normal.
Enviar un correo de prueba desde la firma ya instalada para comprobar si sus imágenes
siguen enlazadas o están incorporadas.
