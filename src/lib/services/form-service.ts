import { supabase } from '@/lib/supabase';
import type { FormField } from '@/lib/types';

interface CreateFormData {
  name: string;
  description: string;
  user_id: string;
  fields: FormField[];
  settings?: {
    requireAuth?: boolean;
    autoSave?: boolean;
    maxFields?: number;
    allowFileUploads?: boolean;
    allowCustomValidation?: boolean;
  };
}

export const formService = {
  async createForm(data: CreateFormData) {
    try {
      const { data: form, error } = await supabase
        .from('forms')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return form;
    } catch (error) {
      console.error('Error creating form:', error);
      throw error;
    }
  },

  async validateFields(fields: FormField[]) {
    // Validate field structure and requirements
    const errors: string[] = [];

    if (fields.length === 0) {
      errors.push('At least one field is required');
    }

    fields.forEach((field, index) => {
      if (!field.label) {
        errors.push(`Field ${index + 1} requires a label`);
      }
      if (field.type === 'select' && (!field.options || field.options.length === 0)) {
        errors.push(`Select field "${field.label || index + 1}" requires options`);
      }
    });

    return errors;
  }
};