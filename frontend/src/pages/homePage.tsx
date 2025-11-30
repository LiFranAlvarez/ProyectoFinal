/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Curso } from "../types/cursoType";
import CursoCard from "../components/catalogo/cursoCard";
import "../styles/home.css"


const HomePage: React.FC = () => {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const resp = await fetch("http://localhost:3000/api/cursos");
                if (!resp.ok) throw new Error("No se pudieron cargar los cursos");
                
                const data = await resp.json();
                const tresPrimerosCursos = data.slice(0, 3);
                const normalizados = tresPrimerosCursos.map((c: any) => ({
                    ...c,
                    descripcion: c.descripcion || c.describe || "", 
                    categorias: Array.isArray(c.categorias) ? c.categorias : [], 
                }));

                setCursos(normalizados);

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCursos();
    }, []);

    return (
        <main>
        <div className="fondo">
            <div className="hero-section">
                <h1>¡Impulsa tu carrera con nuestros cursos online!</h1>
                <p>Aprende de los mejores profesionales en tecnología y negocios.</p>
                
                <div className="promocion-banner"> 
                    <p>
                        💥 ¡Últimos días! 50% de descuento en tu primer curso con el código MET-SIS-002
                    </p>
                </div>
                
                <Link to="/cursos" className="boton-cta-principal"> 
                    ¡Empieza a aprender hoy! ➡️
                </Link>
            </div>
            
            <section className="cursos-populares">
                <h2>Cursos populares</h2>

                {loading && <p>Cargando cursos...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                {!loading && !error && cursos.length === 0 && (
                    <p>¡Ups! Parece que aún no hay cursos cargados. Vuelve pronto.</p>
                )}

                <div className="cursos-grid">
                    {cursos.map((curso) => (
                        <CursoCard key={curso._id} curso={curso} />
                    ))}
                </div>

                <Link to="/cursos" className="boton-catalogo">
                    Ver catálogo completo
                </Link>
            </section>
            <section className="prueba-social">
                <h2>Nuestros estudiantes nos avalan</h2>
                <div className="metricas-clave">
                    <div>
                        <p className="numero">15.000+</p>
                        <p>Estudiantes matriculados</p>
                    </div>
                </div>
            </section>
            <section className="ventajas">
                <h2>¿Por qué elegirnos?</h2>
                <ul>
                    <li>📚 Cursos actualizados y prácticos</li>
                    <li>👩‍🏫 Docentes verificados</li>
                    <li>📈 Seguimiento de tu progreso</li>
                    <li>🔒 Acceso seguro y flexible</li>
                </ul>
            </section>
            <section className="newsletter-suscripcion">
                <h2>¿Quieres unirte a la vanguardia?</h2>
                <p>Suscríbete y recibe una guía gratuita y ofertas exclusivas.</p>
                
                <form className="formulario-suscripcion">
                    <input type="email" placeholder="Tu correo electrónico" required />
                    <button type="submit" className="boton-suscribir">
                        ¡Suscribirme!
                    </button>
                </form>
            </section>
            
            <section className="faq">
                <h2>Preguntas Frecuentes</h2>
                <p>Resuelve todas tus dudas sobre pagos, acceso y certificados.</p>
                <Link to="/faq" className="boton-simple">Ver todas las preguntas</Link>
            </section>

        </div>
    </main>
    );
};

export default HomePage;
