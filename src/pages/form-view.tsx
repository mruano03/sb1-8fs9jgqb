import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/lib/supabase';
import { Loader2, Settings, ExternalLink, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export function FormViewPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForm = async () => {
      if (!id || !user) return;

      try {
        const { data, error } = await supabase
          .from('forms')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setForm(data);
      } catch (err) {
        console.error('Error fetching form:', err);
        setError('Failed to load form');
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Form not found'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{form.name}</h1>
          <p className="mt-1 text-sm text-gray-500">{form.description}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" to={`/forms/${form.id}`} target="_blank">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Form
          </Button>
          <Button variant="outline" size="sm" to={`/dashboard/forms/${form.id}/settings`}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Form Details</h3>
          <dl className="grid grid-cols-1 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {format(new Date(form.created_at), 'MMM d, yyyy')}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Total Fields</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {form.fields?.length || 0} fields
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Responses</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {form.responses_count || 0} responses
              </dd>
            </div>
          </dl>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Form Fields</h3>
          <div className="space-y-4">
            {form.fields?.map((field: any) => (
              <div key={field.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{field.label}</p>
                  <p className="text-sm text-gray-500">Type: {field.type}</p>
                </div>
                {field.required && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Required
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}