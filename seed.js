// ============================================================
// CATÁLOGO SEMILLA — Kapohs Kitchen (demo)
// Dominican pop-up, Kendall / Miami FL. @orderkapohskitchen
// Menú extraído de las capturas de Instagram del negocio.
// Precio CONFIRMADO: 1 Golpe $12 (visto en su menú).
// Todo lo demás lleva precio SUGERIDO — el dueño confirma.
// CATALOG_VERSION: subir para re-sembrar en el servidor.
// ============================================================

const CATALOG_VERSION = 1;

const SEED_CATALOG = {
  departments: [
    {
      id: "golpes",
      name: "Los Golpes",
      icon: "🍳",
      categories: [
        {
          id: "golpes-todos",
          name: "El desayuno dominicano de verdad",
          items: [
            { id: "golpe-1", name: "1 Golpe", price: 12.00, unit: "plato", active: true, tag: "⭐ El favorito", image: "golpe-1.jpg",
              desc: "Mangú cremoso (puré de plátano verde) con cebollita encurtida y tu golpe favorito: huevo, queso frito, salami o longaniza." },
            { id: "golpe-2", name: "2 Golpes", price: 16.00, unit: "plato", active: true, image: "golpe-2.jpg",
              pending: true, note: "Precio sugerido — el dueño confirma",
              desc: "Mangú cremoso con cebollita encurtida y dos golpes a tu elección: huevo, queso frito, salami o longaniza." },
            { id: "golpe-3", name: "3 Golpes", price: 19.00, unit: "plato", active: true, image: "golpe-3.jpg",
              pending: true, note: "Precio sugerido — el dueño confirma",
              desc: "Mangú cremoso con huevo, queso frito y salami — coronado con cebollita encurtida." },
            { id: "golpe-4", name: "4 Golpes", price: 22.00, unit: "plato", active: true, tag: "🔥 El de la casa", image: "golpe-4.jpg",
              pending: true, note: "Precio sugerido — el dueño confirma",
              desc: "El completo: mangú con huevo, queso frito, salami Y longaniza. Cuatro golpes, cero piedad." }
          ]
        }
      ]
    },
    {
      id: "frituras",
      name: "Frituras & Más",
      icon: "🍟",
      categories: [
        {
          id: "frituras-todas",
          name: "Para acompañar el golpe",
          items: [
            { id: "golpe-fries", name: "3 Golpe Fries", price: 14.00, unit: "orden", active: true, tag: "🔥 Cargadas", image: "golpe-fries.jpg",
              pending: true, note: "Precio sugerido — el dueño confirma",
              desc: "Papas cargadas con longaniza, queso frito, cebolla encurtida y nuestra salsa rosada." },
            { id: "tia-empanadas", name: "Tía's Empanadas", price: 3.50, unit: "empanada", active: true, image: "empanadas.jpg",
              pending: true, note: "Precio sugerido — el dueño confirma",
              desc: "Las de la tía: empanadas doradas y crujientes, hechas con amor y tradición familiar." },
            { id: "papi-quipes", name: "Papi's Quipes", price: 3.50, unit: "quipe", active: true, image: "quipes.jpg",
              pending: true, note: "Precio sugerido — el dueño confirma",
              desc: "Los del papi: quipes crujientes rellenos de carne sazonada, con su cuña de limón." },
            { id: "cebollita-extra", name: "Extra Cebollita Encurtida", price: 4.00, unit: "porción", active: true, image: "cebollita.jpg",
              pending: true, note: "Precio sugerido — el dueño confirma",
              desc: "La cebollita encurtida que corona el mangú — pídela extra para tu plato." }
          ]
        }
      ]
    },
    {
      id: "bebidas",
      name: "Bebidas",
      icon: "🥤",
      categories: [
        {
          id: "bebidas-todas",
          name: "Para bajar el golpe",
          items: [
            { id: "morir-sonando", name: "Morir Soñando", price: 6.00, unit: "vaso", active: true, image: "morir-sonando.jpg",
              pending: true, note: "Precio sugerido — el dueño confirma",
              desc: "El clásico dominicano: leche cremosa con jugo de naranja bien frío. Te vas a morir soñando." },
            { id: "bebida", name: "Bebida", price: 3.00, unit: "vaso", active: true,
              pending: true, note: "Precio sugerido — el dueño confirma",
              desc: "Refresco bien frío para acompañar." },
            { id: "agua", name: "Agua", price: 2.00, unit: "botella", active: true,
              pending: true, note: "Precio sugerido — el dueño confirma",
              desc: "Agua pura y refrescante." }
          ]
        }
      ]
    }
  ]
};

module.exports = { SEED_CATALOG, CATALOG_VERSION };
