# 🍳 Kapohs Kitchen — Pedidos (demo)

Sistema de pedidos para **Kapohs Kitchen**, pop-up de desayuno
dominicano en Kendall / Miami FL (@orderkapohskitchen).

- App de clientes (`/`) — fondo crema, estilo dominicano: azul marino,
  rojo y dorado, precios grandes y legibles, español primero, US$.
- Pantalla de tienda (`/tienda`) — fondo negro, protegida con `STORE_KEY`:
  pipeline nuevo → preparando → listo → entregado, pedidos Zelle en
  espera (`pendiente_pago` con botón **Pago recibido**), sonido de pedido
  nuevo, editor de catálogo/precios, pestaña Historial (filtros por fecha
  y estado, conteo de pedidos, total de ingresos, confirmación de
  cancelación).

## Precios semilla

Extraídos el 20-sep-2026 de las capturas de Instagram del negocio.
El precio del **1 Golpe ($12)** es CONFIRMADO (visto en su menú).
Todos los demás precios están marcados "sugerido" — el dueño confirma.

## Despliegue (Render)

1. Render → **New → Blueprint**
2. Conectar el repo `Papyboy1920/kapohs-kitchen-pedidos`
3. **Apply** y esperar el despliegue
4. Copiar la clave generada de `STORE_KEY` (Render → Environment)
5. Pegarla en `/tienda` y hacer un pedido de prueba

## Demo local

```bash
npm install
STORE_KEY=prueba node server.js
# http://localhost:3000/        (clientes)
# http://localhost:3000/tienda  (tienda)
```

**Nota:** usa SQLite en disco efímero — solo para demo/arranque.
Un lanzamiento real necesita Postgres pago.
