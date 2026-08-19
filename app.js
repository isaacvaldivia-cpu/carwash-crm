// ============================================
// APP.JS — Logic Principal (Firebase version)
// ============================================
import DB from "./db.js";
import { auth, signOut, onAuthStateChanged } from "./firebase-config.js";

const moduleInitMap = {
    dashboard: "loadDashboard",
    inventory: "loadInventory",
    settings: "loadSettings",
    reports: "loadReports",
    movements: "loadMovements",
    services: "loadServices",
    receipts: "loadReceipts",
    clients: "loadClients",
    nomina: "loadNomina"
};

// Auto-save every 30 seconds
let autoSaveInterval = null;

function startAutoSave() {
    if (autoSaveInterval) clearInterval(autoSaveInterval);
    autoSaveInterval = setInterval(async () => {
        const data = sessionStorage.getItem("appData");
        if (data) {
            await DB.save(JSON.parse(data));
            console.log("Auto-saved at", new Date().toLocaleTimeString());
        }
    }, 30000);
}

function checkSession() {
    const user = sessionStorage.getItem("currentUser");
    const data = sessionStorage.getItem("appData");
    if (!user || !data) {
        window.location.href = "index.html";
        return null;
    }
    return JSON.parse(user);
}

function loadUserInfo() {
    const user = checkSession();
    if (!user) return;
    const el = document.getElementById("current-user");
    if (el) el.textContent = "👤 " + user.username + " (admin)";
    if (typeof loadSidebarBranding === "function") loadSidebarBranding();
}

function buildSidebar() {
    const nav = document.getElementById("sidebar-nav");
    if (!nav) return;
    nav.innerHTML = "";
    AppConfig.modules.forEach(function(module) {
        if (!module.enabled) return;
        const btn = document.createElement("button");
        btn.className = "nav-btn";
        btn.id = "nav-" + module.id;
        btn.innerHTML = module.icon + " " + module.name;
        btn.onclick = function() { loadModule(module); };
        nav.appendChild(btn);
    });
}

function loadModule(module) {
    document.querySelectorAll(".nav-btn").forEach(function(b) { b.classList.remove("active"); });
    const activeBtn = document.getElementById("nav-" + module.id);
    if (activeBtn) activeBtn.classList.add("active");
    const template = document.getElementById("tpl-" + module.id);
    const content = document.getElementById("main-content");
    if (!template) {
        content.innerHTML = "<div style='padding:40px;text-align:center;color:#888;'><h2>🚧 Módulo Próximamente</h2></div>";
        return;
    }
    content.innerHTML = "";
    const clone = template.content.cloneNode(true);
    content.appendChild(clone);
    const fnName = moduleInitMap[module.id];
    if (fnName) {
        let attempts = 0;
        const interval = setInterval(function() {
            attempts++;
            if (typeof window[fnName] === "function") {
                clearInterval(interval);
                window[fnName]();
            } else if (attempts > 20) {
                clearInterval(interval);
            }
        }, 100);
    }
}

async function logout() {
    // Save before logout
    const data = sessionStorage.getItem("appData");
    if (data) await DB.save(JSON.parse(data));
    await signOut(auth);
    sessionStorage.clear();
    if (autoSaveInterval) clearInterval(autoSaveInterval);
    window.location.href = "index.html";
}

function loadDefaultModule() {
    const first = AppConfig.modules.find(function(m) { return m.enabled; });
    if (first) loadModule(first);
}

// Check Firebase Auth state on load
onAuthStateChanged(auth, async function(user) {
    if (!user) {
        // No Firebase session - redirect to login
        if (!sessionStorage.getItem("currentUser")) {
            window.location.href = "index.html";
        }
        return;
    }

    // Firebase user exists but session might be empty (page refresh)
    if (!sessionStorage.getItem("appData")) {
        const data = await DB.load();
        if (data) {
            sessionStorage.setItem("appData", JSON.stringify(data));
            sessionStorage.setItem("currentUser", JSON.stringify({
                username: user.email.replace("@carwash-crm.app", ""),
                role: "admin",
                uid: user.uid
            }));
        }
    }
});

window.onload = function() {
    checkSession();
    loadUserInfo();
    buildSidebar();
    loadDefaultModule();
    startAutoSave();
};

window.logout = logout;
window.loadModule = loadModule;
