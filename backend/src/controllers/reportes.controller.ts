import { Request, Response } from 'express';
import ReporteService from '../services/reportes.sesrvice';
import Inscripcion from '../models/inscripciones';

export const descargarReporte = async (req: Request, res: Response) => {
    const { tipo, formato } = req.params;

    try {
        let buffer: any;
        let contentType = formato === 'xlsx'
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : 'application/pdf';

        if (tipo === 'inscripciones') {
            // 1. Forzamos la consulta con populate
            // Nota: Asegúrate de que 'usuarioId' y 'cursoId' sean los nombres exactos en tu Schema
            const datos = await Inscripcion.find()
                .populate('UsuarioId', 'nombre email') 
                .populate('cursoId');

            console.log('REVISIÓN FINAL DE DATOS:', datos[0]); // Mira si aquí usuarioId tiene datos

            if (formato === 'xlsx') {
                const cols = [
                    { header: 'Alumno', key: 'alumno' },
                    { header: 'Email', key: 'email' },
                    { header: 'Curso', key: 'curso' },
                    { header: 'Fecha', key: 'fecha' }
                ];

                const rows = datos.map((i: any) => ({
                    // Usamos encadenamiento opcional ?. y valores por defecto
                    alumno: i.usuarioId?.nombre || 'No encontrado',
                    email: i.usuarioId?.email || 'N/A',
                    curso: i.cursoId?.titulo || 'N/A',
                    // Usamos fechaInscripcion que es la de tu Schema
                    fecha: i.fechaInscripcion ? new Date(i.fechaInscripcion).toLocaleDateString() : 'N/A'
                }));
                buffer = await ReporteService.generarExcel(rows, cols);
            } else {
                // PDF: Aquí el orden de las columnas debe ser exacto al header ["Alumno", "Email", "Curso", "Fecha"]
                const rows = datos.map((i: any) => [
                    i.usuarioId?.nombre || 'No encontrado',
                    i.usuarioId?.email || 'N/A',
                    i.cursoId?.titulo || 'N/A',
                    i.fechaInscripcion ? new Date(i.fechaInscripcion).toLocaleDateString() : 'N/A'
                ]);
                
            
                buffer = await ReporteService.generarPdf(
                    "Reporte de Inscripciones", 
                    ["Alumno", "Email", "Curso", "Fecha"], 
                    rows
                );
            }

        } else if (tipo === 'cursos') {
            const datos = await ReporteService.getDatosCursos();

            if (formato === 'xlsx') {
                const cols = [
                    { header: 'Título del Curso', key: 'titulo' },
                    { header: 'Profesor', key: 'profesor' },
                    { header: 'Estado', key: 'estado' }
                ];
                const rows = datos.map((c: any) => ({
                    titulo: c.titulo,
                    profesor: c.profesor?.nombre || 'Sin asignar',
                    estado: c.estado
                }));
                buffer = await ReporteService.generarExcel(rows, cols);
            } else {
                const rows = datos.map((c: any) => [
                    c.titulo,
                    c.profesor?.nombre || 'Sin asignar',
                    c.estado
                ]);
                buffer = await ReporteService.generarPdf("Catálogo de Cursos Online", ["Título", "Profesor", "Estado"], rows);
            }

        } else {
            return res.status(404).json({ message: "Tipo de reporte no encontrado" });
        }

        res.setHeader('Content-Type', contentType);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition'); 
        res.setHeader('Content-Disposition', `attachment; filename=reporte_${tipo}.${formato}`);
        
        return res.send(buffer);

    } catch (error) {
        console.error("Error en descargarReporte:", error);
        return res.status(500).json({ message: "Error al generar archivo" });
    }
};