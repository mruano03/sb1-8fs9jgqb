import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/lib/supabase';
import type { FormField } from '@/lib/types';

export type Step = 'form' | 'fields' | 'preview';

interface FormData {
  name: string;
  description: string;
  settings?: {
    requireAuth?: boolean;
    autoSave?: boolean;
  };
}

export function useFormSteps() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>('form');
  const [formData, setFormData] = useState<FormData | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormStep = (data: FormData) => {
    setFormData(data);
    setCurrentStep('fields');
  };

  const handleFieldsStep = () => {
    setCurrentStep('preview');
  };

  const handleBack = () => {
    if (currentStep === 'fields') setCurrentStep('form');
    if (currentStep === 'preview') setCurrentStep('fields');
  };

  const handleSubmit = async () => {
    if (!user || !formData) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { data: form, error: submitError } = await supabase
        .from('forms')
        .insert({
          name: formData.name,
          description: formData.description,
          user_id: user.id,
          fields: fields,
          settings: formData.settings,
        })
        .select()
        .single();

      if (submitError) throw submitError;

      navigate(`/dashboard/forms/${form.id}`);
    } catch (err) {
      console.error('Error creating form:', err);
      setError('Failed to create form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentStep,
    formData,
    fields,
    isSubmitting,
    error,
    setFields,
    handleFormStep,
    handleFieldsStep,
    handleBack,
    handleSubmit,
  };
}