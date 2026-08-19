// ============================================
// CONFIG.JS — Registro de Módulos
// ============================================

const AppConfig = {

    appName: "Business Manager",
    version: "1.0.0",

    modules: [
        {
            id: "dashboard",
            name: "Panel Principal",
            icon: "📈",
            path: "modules/dashboard/dashboard.html",
            enabled: true
        },
        {
            id: "inventory",
            name: "Inventario",
            icon: "📦",
            path: "modules/inventory/inventory.html",
            enabled: true
        },
        {
            id: "movements",
            name: "Movimientos",
            icon: "🔄",
            path: "modules/movements/movements.html",
            enabled: false
        },
        {
            id: "services",
            name: "Servicios",
            icon: "🛠️",
            path: "modules/services/services.html",
            enabled: true
        },
        {
            id: "receipts",
            name: "Recibos",
            icon: "🧾",
            path: "modules/receipts/receipts.html",
            enabled: true
        },
        {
            id: "clients",
            name: "Clientes",
            icon: "👥",
            path: "modules/clients/clients.html",
            enabled: true
        },
        {
            id: "reports",
            name: "Reportes",
            icon: "📊",
            path: "modules/reports/reports.html",
            enabled: true
        }
,{
            id: "nomina",
            name: "Nómina",
            icon: "👷",
            path: "modules/nomina/nomina.html",
            enabled: true
        },
        {
            id: "settings",
            name: "Configuración",
            icon: "⚙️",
            path: "modules/settings/settings.html",
            enabled: true
        }
    ],

    lowStockThreshold: 5,
    currency: "MXN"
};
