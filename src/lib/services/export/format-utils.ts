import type { ExportFormat, ExportOptions, ExportData } from './types';

export function formatExportData(data: ExportData, format: ExportFormat, options: ExportOptions): string | Blob {
  switch (format) {
    case 'csv':
      return formatCSV(data, options);
    case 'json':
      return formatJSON(data, options);
    case 'excel':
      return formatExcel(data, options);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

function formatCSV(data: ExportData, options: ExportOptions): string {
  const rows: string[] = [];
  
  if (options.includeWaitlists && data.waitlists.length) {
    rows.push('Waitlists');
    rows.push('ID,Name,Description,Status,Created At');
    data.waitlists.forEach(w => {
      rows.push(`${w.id},${w.name},${w.description},${w.status},${w.created_at}`);
    });
    rows.push('');
  }

  if (options.includeEntries && data.entries.length) {
    rows.push('Entries');
    rows.push('ID,Name,Email,Status,Created At');
    data.entries.forEach(e => {
      rows.push(`${e.id},${e.name},${e.email},${e.status},${e.created_at}`);
    });
  }

  return rows.join('\n');
}

function formatJSON(data: ExportData, options: ExportOptions): string {
  const exportData: any = {};
  
  if (options.includeWaitlists) {
    exportData.waitlists = data.waitlists;
  }
  if (options.includeEntries) {
    exportData.entries = data.entries;
  }
  if (options.includeForms) {
    exportData.forms = data.forms;
  }

  return JSON.stringify(exportData, null, 2);
}

function formatExcel(data: ExportData, options: ExportOptions): Blob {
  // Implementation for Excel format would go here
  // Would typically use a library like xlsx
  throw new Error('Excel export not implemented');
}