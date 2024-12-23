export type ExportFormat = 'csv' | 'json' | 'excel';

export interface ExportOptions {
  includeWaitlists: boolean;
  includeEntries: boolean;
  includeForms: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ExportData {
  waitlists: any[];
  entries: any[];
  forms: any[];
}