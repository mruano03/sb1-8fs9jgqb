import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Settings, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useForms } from '@/hooks/use-forms';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export function FormsPage() {
  const { forms, loading, error, deleteForm } = useForms();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteForm(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Forms</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage your custom forms
          </p>
        </div>
        <Button to="/dashboard/forms/new">
          <Plus className="h-4 w-4 mr-2" />
          Create Form
        </Button>
      </div>

      {!forms?.length ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No forms</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new form.</p>
          <div className="mt-6">
            <Button to="/dashboard/forms/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Form
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {forms.map((form, index) => (
            <motion.div
              key={form.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {form.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {form.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 border-t pt-4">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{form.fields?.length || 0} fields</span>
                      <span>{format(new Date(form.created_at), 'MMM d, yyyy')}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <Link
                        to={`/forms/${form.id}`}
                        className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Form
                      </Link>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      to={`/dashboard/forms/${form.id}/settings`}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(form.id)}
                      disabled={deletingId === form.id}
                      className="text-gray-500 hover:text-red-600"
                    >
                      {deletingId === form.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}