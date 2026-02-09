const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const apiKey = import.meta.env.VITE_API_KEY;

export const descargarReporte = async (tipo: string, formato: string) => {
    let token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    const realizarPeticion = async (t: string | null) => {
        return await fetch(`${API_URL}/api/reportes/${tipo}/${formato}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${t}`,
                "x-api-key": apiKey
            }
        });
    };

    let response = await realizarPeticion(token);

    if (response.status === 401 || response.status === 403) {
        console.warn("Token inválido o expirado. Intentando refrescar...");

        const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken })
        });

        if (refreshRes.ok) {
            const data = await refreshRes.json();
            localStorage.setItem("token", data.accessToken);
            
            response = await realizarPeticion(data.accessToken);
        } else {
            localStorage.clear();
            window.location.href = "/admin";
            return;
        }
    }

    if (!response.ok) throw new Error("No se pudo obtener el reporte");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte_${tipo}_${new Date().getTime()}.${formato}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
};