import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DynamicForm } from '@/components/forms/dynamic-form';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export function PublicFormView() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForm = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('forms')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setForm(data);
      } catch (err) {
        console.error('Error fetching form:', err);
        setError('Form not found or unavailable');
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Form Not Found</h2>
          <p className="mt-2 text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const { error } = await supabase
        .from('form_responses')
        .insert({
          form_id: id,
          data: data,
        });

      if (error) throw error;

      // Show success message or redirect
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{form.name}</h1>
          <p className="text-gray-600 mb-8">{form.description}</p>
          <DynamicForm fields={form.fields} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}