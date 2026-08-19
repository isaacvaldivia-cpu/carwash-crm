// ============================================
// DB.JS — Firebase Firestore (reemplaza localStorage)
// ============================================
import { db, auth, doc, getDoc, setDoc } from "./firebase-config.js";

const DB = {

    _clientId: "carwash-001", // ID único del negocio — cambiar por cliente

    // Guardar todos los datos en Firestore
    async save(data) {
        try {
            const user = auth.currentUser;
            if (!user) { console.error("No user logged in"); return false; }
            const docRef = doc(db, "businesses", this._clientId);
            await setDoc(docRef, { data: JSON.stringify(data), updatedAt: new Date().toISOString() });
            return true;
        } catch (e) {
            console.error("Save failed:", e);
            return false;
        }
    },

    // Cargar todos los datos desde Firestore
    async load() {
        try {
            const docRef = doc(db, "businesses", this._clientId);
            const snap = await getDoc(docRef);
            if (!snap.exists()) return this.emptyData();
            const raw = snap.data();
            return JSON.parse(raw.data);
        } catch (e) {
            console.error("Load failed:", e);
            return null;
        }
    },

    // Estructura vacía inicial
    emptyData() {
        return {
            users: [],
            inventory: [],
            services: [],
            serviceSales: [],
            inventoryMovements: [],
            clients: [],
            empleados: [],
            nominaHistorial: [],
            prestamos: [],
            settings: { lowStockThreshold: 5, currency: "MXN" },
            companyInfo: {}
        };
    },

    // Compatibilidad — ya no necesitamos password
    getPassword() { return "firebase-auth"; },
    setPassword() {},
    clearPassword() {}
};

export default DB;
