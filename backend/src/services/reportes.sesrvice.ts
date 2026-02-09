import Inscripcion from '../models/inscripciones';
import Curso from '../models/curso.schema';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit-table';

class ReporteService {
  async getDatosInscripciones() {
    return await Inscripcion.find()
      .populate('usuarioId', 'nombre email')
      .populate('cursoId');
  }

  async getDatosCursos() {
    return await Curso.find().populate('profesor', 'nombre');
  }

  async generarExcel(datos: any[], columnas: any[]) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Reporte');
    sheet.columns = columnas;
    datos.forEach(d => sheet.addRow(d));
    return await workbook.xlsx.writeBuffer();
  }

  async generarPdf(titulo: string, cabeceras: string[], filas: any[][]) {
    return new Promise<Buffer>((resolve) => {
      const doc = new PDFDocument({ margin: 30, size: 'A4' });
      const buffers: any[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      doc.fontSize(20).text(titulo, { align: 'center' }).moveDown();
      
      const table = {
        title: "Listado Detallado",
        headers: cabeceras,
        rows: filas,
      };

      doc.table(table, { prepareHeader: () => doc.fontSize(10), prepareRow: () => doc.fontSize(10) });
      doc.end();
    });
  }
}

export default new ReporteService();