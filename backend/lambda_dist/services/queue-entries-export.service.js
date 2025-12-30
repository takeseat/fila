"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueEntriesExportService = void 0;
const json2csv_1 = require("json2csv");
const pdfkit_1 = __importDefault(require("pdfkit"));
class QueueEntriesExportService {
    /**
     * Generate CSV export
     */
    generateCSV(data, language = 'pt') {
        const fields = this.getCSVFields(language);
        const parser = new json2csv_1.Parser({
            fields,
            delimiter: ',',
            quote: '"',
            withBOM: true, // Excel compatibility
        });
        const transformedData = data.map(row => ({
            queueDate: this.formatDate(row.queueDate),
            customerName: row.customerName,
            customerPhone: row.customerPhone,
            partySize: row.partySize,
            createdAt: this.formatDateTime(row.createdAt),
            calledAt: row.calledAt ? this.formatDateTime(row.calledAt) : '—',
            seatedAt: row.seatedAt ? this.formatDateTime(row.seatedAt) : '—',
            status: this.translateStatus(row.status, language),
            timeToCall: row.timeToCall !== null ? `${row.timeToCall} min` : '—',
            timeToSeat: row.timeToSeat !== null ? `${row.timeToSeat} min` : '—',
            timeCallToSeat: row.timeCallToSeat !== null ? `${row.timeCallToSeat} min` : '—',
        }));
        return parser.parse(transformedData);
    }
    /**
     * Generate PDF export
     */
    async generatePDF(data, restaurantName, dateRange, language = 'pt') {
        return new Promise((resolve, reject) => {
            try {
                const doc = new pdfkit_1.default({
                    size: 'A4',
                    layout: 'landscape',
                    margin: 30,
                });
                const buffers = [];
                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => resolve(Buffer.concat(buffers)));
                // Header
                doc.fontSize(16).text(this.getReportTitle(language), { align: 'center' });
                doc.fontSize(10).text(restaurantName, { align: 'center' });
                doc.fontSize(8).text(`${this.getLabel('period', language)}: ${this.formatDate(dateRange.from)} - ${this.formatDate(dateRange.to)}`, { align: 'center' });
                doc.fontSize(8).text(`${this.getLabel('generatedAt', language)}: ${this.formatDateTime(new Date())}`, { align: 'center' });
                doc.moveDown(1);
                // Table
                this.drawTable(doc, data, language);
                doc.end();
            }
            catch (error) {
                reject(error);
            }
        });
    }
    /**
     * Draw table in PDF
     */
    drawTable(doc, data, language) {
        const startX = 30;
        let startY = doc.y;
        const rowHeight = 20;
        const fontSize = 7;
        // Column widths
        const columns = [
            { key: 'queueDate', label: this.getLabel('queueDate', language), width: 60 },
            { key: 'customerName', label: this.getLabel('customerName', language), width: 100 },
            { key: 'customerPhone', label: this.getLabel('customerPhone', language), width: 80 },
            { key: 'partySize', label: this.getLabel('partySize', language), width: 40 },
            { key: 'createdAt', label: this.getLabel('createdAt', language), width: 80 },
            { key: 'calledAt', label: this.getLabel('calledAt', language), width: 80 },
            { key: 'seatedAt', label: this.getLabel('seatedAt', language), width: 80 },
            { key: 'timeToCall', label: this.getLabel('timeToCall', language), width: 50 },
            { key: 'timeToSeat', label: this.getLabel('timeToSeat', language), width: 50 },
            { key: 'status', label: this.getLabel('status', language), width: 60 },
        ];
        // Draw header
        doc.fontSize(fontSize).font('Helvetica-Bold');
        let x = startX;
        columns.forEach(col => {
            doc.text(col.label, x, startY, { width: col.width, align: 'left' });
            x += col.width;
        });
        startY += rowHeight;
        // Draw rows
        doc.font('Helvetica');
        data.forEach((row) => {
            // Check if we need a new page
            if (startY > 500) {
                doc.addPage();
                startY = 30;
                // Redraw header on new page
                doc.font('Helvetica-Bold');
                x = startX;
                columns.forEach(col => {
                    doc.text(col.label, x, startY, { width: col.width, align: 'left' });
                    x += col.width;
                });
                startY += rowHeight;
                doc.font('Helvetica');
            }
            x = startX;
            const rowData = {
                queueDate: this.formatDate(row.queueDate),
                customerName: row.customerName.substring(0, 20),
                customerPhone: row.customerPhone,
                partySize: row.partySize.toString(),
                createdAt: this.formatTime(row.createdAt),
                calledAt: row.calledAt ? this.formatTime(row.calledAt) : '—',
                seatedAt: row.seatedAt ? this.formatTime(row.seatedAt) : '—',
                timeToCall: row.timeToCall !== null ? `${row.timeToCall}m` : '—',
                timeToSeat: row.timeToSeat !== null ? `${row.timeToSeat}m` : '—',
                status: this.translateStatus(row.status, language).substring(0, 10),
            };
            columns.forEach(col => {
                doc.text(rowData[col.key], x, startY, {
                    width: col.width,
                    align: 'left',
                });
                x += col.width;
            });
            startY += rowHeight;
        });
    }
    /**
     * Get CSV fields with translations
     */
    getCSVFields(language) {
        return [
            { label: this.getLabel('queueDate', language), value: 'queueDate' },
            { label: this.getLabel('customerName', language), value: 'customerName' },
            { label: this.getLabel('customerPhone', language), value: 'customerPhone' },
            { label: this.getLabel('partySize', language), value: 'partySize' },
            { label: this.getLabel('createdAt', language), value: 'createdAt' },
            { label: this.getLabel('calledAt', language), value: 'calledAt' },
            { label: this.getLabel('seatedAt', language), value: 'seatedAt' },
            { label: this.getLabel('status', language), value: 'status' },
            { label: this.getLabel('timeToCall', language), value: 'timeToCall' },
            { label: this.getLabel('timeToSeat', language), value: 'timeToSeat' },
            { label: this.getLabel('timeCallToSeat', language), value: 'timeCallToSeat' },
        ];
    }
    /**
     * Get translated label
     */
    getLabel(key, language) {
        const labels = {
            pt: {
                queueDate: 'Data da Fila',
                customerName: 'Nome do Cliente',
                customerPhone: 'Telefone',
                partySize: 'Pessoas',
                createdAt: 'Entrada',
                calledAt: 'Chamado',
                seatedAt: 'Sentado',
                status: 'Status',
                timeToCall: 'Tempo até Chamar',
                timeToSeat: 'Tempo até Sentar',
                timeCallToSeat: 'Tempo Chamada→Sentar',
                period: 'Período',
                generatedAt: 'Gerado em',
            },
            en: {
                queueDate: 'Queue Date',
                customerName: 'Customer Name',
                customerPhone: 'Phone',
                partySize: 'Party Size',
                createdAt: 'Entered',
                calledAt: 'Called',
                seatedAt: 'Seated',
                status: 'Status',
                timeToCall: 'Time to Call',
                timeToSeat: 'Time to Seat',
                timeCallToSeat: 'Time Call→Seat',
                period: 'Period',
                generatedAt: 'Generated at',
            },
        };
        return labels[language]?.[key] || labels['en'][key] || key;
    }
    /**
     * Get report title
     */
    getReportTitle(language) {
        return language === 'pt' ? 'Relatório Analítico da Fila' : 'Analytical Queue Report';
    }
    /**
     * Translate status
     */
    translateStatus(status, language) {
        const translations = {
            pt: {
                WAITING: 'Aguardando',
                CALLED: 'Chamado',
                SEATED: 'Sentado',
                CANCELLED: 'Cancelado',
                NO_SHOW: 'Não Compareceu',
            },
            en: {
                WAITING: 'Waiting',
                CALLED: 'Called',
                SEATED: 'Seated',
                CANCELLED: 'Cancelled',
                NO_SHOW: 'No Show',
            },
        };
        return translations[language]?.[status] || status;
    }
    /**
     * Format date (YYYY-MM-DD)
     */
    formatDate(date) {
        return new Date(date).toISOString().split('T')[0];
    }
    /**
     * Format datetime (YYYY-MM-DD HH:mm)
     */
    formatDateTime(date) {
        const d = new Date(date);
        return `${this.formatDate(d)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }
    /**
     * Format time only (HH:mm)
     */
    formatTime(date) {
        const d = new Date(date);
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }
}
exports.QueueEntriesExportService = QueueEntriesExportService;
//# sourceMappingURL=queue-entries-export.service.js.map