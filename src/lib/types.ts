// Update the FormField type in the existing types.ts file
export type FieldType = 
  | 'text'
  | 'email'
  | 'number'
  | 'date'
  | 'select'
  | 'file'
  | 'signature'
  | 'phone'
  | 'url'
  | 'textarea'
  | 'checkbox'
  | 'radio';

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    allowedTypes?: string[];
  };
}