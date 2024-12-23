import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FormPreview } from '@/components/forms/create/form-preview';
import { PreviewBanner } from '@/components/forms/preview/preview-banner';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export function FormPreviewPage() {
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
        setError('Form not found');
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id]);

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
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <>
      <PreviewBanner />
      <div className="max-w-3xl mx-auto py-12 px-4">
        <FormPreview formData={form} />
      </div>
    </>
  );
}