import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, X } from 'lucide-react';
import { exportService } from '@/lib/services/export/export-service';
import type { ExportFormat, ExportOptions } from '@/lib/services/export/types';

interface ExportDataModalProps {
  userId: string;
  onClose: () => void;
}

export function ExportDataModal({ userId, onClose }: ExportDataModalProps) {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [options, setOptions] = useState<ExportOptions>({
    includeWaitlists: true,
    includeEntries: true,
    includeForms: true,
  });
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      const data = await exportService.exportUserData(userId, format, options);
      
      // Create download
      const blob = new Blob([data], { 
        type: format === 'json' ? 'application/json' : 'text/csv' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `data-export.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      onClose();
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">Export Data</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Export Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as ExportFormat)}
              className="w-full rounded-md border-gray-300"
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Include Data
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={options.includeWaitlists}
                  onChange={(e) => setOptions({
                    ...options,
                    includeWaitlists: e.target.checked
                  })}
                  className="rounded border-gray-300 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-600">Waitlists</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={options.includeEntries}
                  onChange={(e) => setOptions({
                    ...options,
                    includeEntries: e.target.checked
                  })}
                  className="rounded border-gray-300 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-600">Entries</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={options.includeForms}
                  onChange={(e) => setOptions({
                    ...options,
                    includeForms: e.target.checked
                  })}
                  className="rounded border-gray-300 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-600">Forms</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            {loading ? 'Exporting...' : 'Export Data'}
          </Button>
        </div>
      </Card>
    </div>
  );
}