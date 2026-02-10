import { Request, Response } from 'express';
import ReporteService from '../services/reportes.sesrvice';

export const descargarReporte = async (req: Request, res: Response) => {
    const { tipo, formato } = req.params;

    try {
        let buffer: any;
        let contentType = formato === 'xlsx'
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : 'application/pdf';

        if (tipo === 'inscripciones') {
            const datos = await ReporteService.getDatosInscripciones();
            
            if (formato === 'xlsx') {
                const cols = [
                    { header: 'Alumno', key: 'alumno' },
                    { header: 'Email', key: 'email' },
                    { header: 'Curso', key: 'curso' },
                    { header: 'Fecha', key: 'fecha' }
                ];
                const rows = datos.map((i: any) => ({
                    alumno: i.usuarioId?.nombre || 'N/A',
                    email: i.usuarioId?.email || 'N/A',
                    curso: i.cursoId?.titulo || 'N/A',
                    fecha: i.createdAt ? new Date(i.createdAt).toLocaleDateString() : 'N/A'
                }));
                buffer = await ReporteService.generarExcel(rows, cols);
            } else {
                const rows = datos.map((i: any) => [
                    i.usuarioId?.nombre || 'N/A',
                    i.usuarioId?.email || 'N/A',
                    i.cursoId?.titulo || 'N/A',
                    i.createdAt ? new Date(i.createdAt).toLocaleDateString() : 'N/A'
                ]);
                buffer = await ReporteService.generarPdf("Reporte de Inscripciones", ["Alumno", "Email", "Curso", "Fecha"], rows);
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