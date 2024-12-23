import { supabase } from '@/lib/supabase';
import { formatExportData } from './format-utils';
import type { ExportFormat, ExportOptions } from './types';

// Helper functions (private by closure)
const fetchWaitlists = async (userId: string) => {
  const { data, error } = await supabase
    .from('waitlists')
    .select('*')
    .eq('user_id', userId);
    
  if (error) throw error;
  return data;
};

const fetchEntries = async (userId: string) => {
  const { data, error } = await supabase
    .from('waitlist_entries')
    .select('*, waitlists!inner(user_id)')
    .eq('waitlists.user_id', userId);
    
  if (error) throw error;
  return data;
};

const fetchForms = async (userId: string) => {
  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .eq('user_id', userId);
    
  if (error) throw error;
  return data;
};

// Export service object
export const exportService = {
  async exportUserData(userId: string, format: ExportFormat, options: ExportOptions) {
    try {
      // Fetch user data
      const [waitlists, entries, forms] = await Promise.all([
        fetchWaitlists(userId),
        fetchEntries(userId),
        fetchForms(userId),
      ]);

      // Format data based on selected format and options
      const formattedData = formatExportData({ waitlists, entries, forms }, format, options);
      
      return formattedData;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }
};