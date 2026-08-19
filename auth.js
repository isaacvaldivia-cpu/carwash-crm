// ============================================
// AUTH.JS — Firebase Authentication
// ============================================
import { auth, signInWithEmailAndPassword, onAuthStateChanged } from "./firebase-config.js";
import DB from "./db.js";

async function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("error-msg");

    if (!username || !password) {
        errorMsg.textContent = "Por favor ingrese usuario y contraseña.";
        return;
    }

    errorMsg.style.color = "#4f46e5";
    errorMsg.textContent = "Iniciando sesión...";

    try {
        // En Firebase Auth usamos email — convertimos username a email
        const email = username.includes("@") ? username : username + "@carwash-crm.app";
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        errorMsg.textContent = "Cargando datos...";

        // Cargar datos desde Firestore
        const data = await DB.load();
        if (!data) {
            errorMsg.style.color = "#e53e3e";
            errorMsg.textContent = "❌ Error al cargar datos.";
            return;
        }

        // Guardar en sessionStorage para compatibilidad con módulos existentes
        sessionStorage.setItem("appData", JSON.stringify(data));
        sessionStorage.setItem("currentUser", JSON.stringify({
            username: username,
            role: "admin",
            uid: user.uid
        }));
        sessionStorage.setItem("_firebaseUser", user.uid);

        window.location.href = "app.html";

    } catch (e) {
        errorMsg.style.color = "#e53e3e";
        if (e.code === "auth/user-not-found" || e.code === "auth/wrong-password" || e.code === "auth/invalid-credential") {
            errorMsg.textContent = "❌ Usuario o contraseña incorrectos.";
        } else if (e.code === "auth/too-many-requests") {
            errorMsg.textContent = "❌ Demasiados intentos. Intente más tarde.";
        } else {
            errorMsg.textContent = "❌ Error: " + e.message;
        }
    }
}

// Verificar sesión activa al cargar
function checkSession() {
    const user = sessionStorage.getItem("currentUser");
    const data = sessionStorage.getItem("appData");
    if (!user || !data) {
        // Intentar restaurar desde Firebase Auth
        return false;
    }
    return JSON.parse(user);
}

document.addEventListener("keydown", function(e) {
    if (e.key === "Enter") login();
});

window.login = login;
window.checkSession = checkSession;
