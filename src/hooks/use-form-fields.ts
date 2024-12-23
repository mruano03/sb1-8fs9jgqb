import { useState } from 'react';
import type { FormField } from '@/lib/types';

export function useFormFields(initialFields: FormField[] = []) {
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [draggedField, setDraggedField] = useState<FormField | null>(null);

  const addField = (maxFields: number = -1) => {
    if (maxFields !== -1 && fields.length >= maxFields) {
      return false;
    }

    const newField: FormField = {
      id: crypto.randomUUID(),
      label: '',
      type: 'text',
      required: false,
      validation: {},
    };

    const updatedFields = [...fields, newField];
    setFields(updatedFields);
    return updatedFields;
  };

  const removeField = (id: string) => {
    const updatedFields = fields.filter((field) => field.id !== id);
    setFields(updatedFields);
    return updatedFields;
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    const updatedFields = fields.map((field) =>
      field.id === id ? { ...field, ...updates } : field
    );
    setFields(updatedFields);
    return updatedFields;
  };

  const reorderFields = (startIndex: number, endIndex: number) => {
    const newFields = [...fields];
    const [removed] = newFields.splice(startIndex, 1);
    newFields.splice(endIndex, 0, removed);
    setFields(newFields);
    return newFields;
  };

  const handleDragStart = (field: FormField) => {
    setDraggedField(field);
  };

  const handleDragOver = (index: number) => {
    if (!draggedField) return;

    const draggedIndex = fields.findIndex(f => f.id === draggedField.id);
    if (draggedIndex === index) return;

    const updatedFields = reorderFields(draggedIndex, index);
    return updatedFields;
  };

  const handleDragEnd = () => {
    setDraggedField(null);
  };

  return {
    fields,
    addField,
    removeField,
    updateField,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    draggedField,
  };
}