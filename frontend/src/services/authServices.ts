
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const login = async (data: { email: string; password: string }) => {
  const res = await fetch(`${API_URL}/api/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error en login");
  return res.json();
};

export const register = async (data: { nombre: string; email: string; password: string; rol:string }) => {
  const res = await fetch(`${API_URL}/api/usuario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error en registro");
  return res.json();
};
// Función para renovar el token
const renovarToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    const res = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken })
    });

    if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.accessToken);
        return data.accessToken;
    }
    return null;
};

// Función de fetch inteligente
export const fetchConAutoRefresh = async (url: string, options: any = {}) => {
    let token = localStorage.getItem("token");
    
    // Inyectar headers comunes
    options.headers = {
        ...options.headers,
        "Authorization": `Bearer ${token}`,
        "x-api-key": import.meta.env.VITE_API_KEY
    };

    let response = await fetch(url, options);

    // Si el token expiró (401 o 403)
    if (response.status === 401 || response.status === 403) {
        console.log("Token expirado, intentando renovar...");
        const nuevoToken = await renovarToken();
        
        if (nuevoToken) {
            // Reintentar la petición con el nuevo token
            options.headers["Authorization"] = `Bearer ${nuevoToken}`;
            response = await fetch(url, options);
        } else {
            // Si no se pudo renovar, cerrar sesión
            localStorage.clear();
            window.location.href = "/login";
        }
    }

    return response;
};