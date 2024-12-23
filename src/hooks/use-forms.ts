import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/lib/supabase';

interface Form {
  id: string;
  name: string;
  description: string;
  fields: any[];
  created_at: string;
  user_id: string;
}

export function useForms() {
  const { user } = useAuth();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchForms = async () => {
      try {
        const { data, error } = await supabase
          .from('forms')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setForms(data || []);
      } catch (err) {
        console.error('Error fetching forms:', err);
        setError('Failed to load forms');
      } finally {
        setLoading(false);
      }
    };

    fetchForms();

    // Subscribe to changes
    const subscription = supabase
      .channel('forms_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'forms',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchForms();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const deleteForm = async (id: string) => {
    try {
      const { error } = await supabase
        .from('forms')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setForms(forms.filter(f => f.id !== id));
    } catch (err) {
      console.error('Error deleting form:', err);
      throw err;
    }
  };

  return {
    forms,
    loading,
    error,
    deleteForm,
  };
}