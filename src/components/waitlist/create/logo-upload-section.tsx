import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface LogoUploadSectionProps {
  onLogoSelect: (file: File) => void;
}

export function LogoUploadSection({ onLogoSelect }: LogoUploadSectionProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File) => {
    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a JPG, PNG, or GIF file');
      return false;
    }

    if (file.size > maxSize) {
      setError('File size must be less than 2MB');
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (file) {
      if (validateFile(file)) {
        onLogoSelect(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Logo</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add your brand logo to customize your waitlist page
          </p>
        </div>
        {error && (
          <div className="flex items-center text-red-600 text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        {preview ? (
          <div className="relative w-40 h-40 rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="Logo preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <label className="cursor-pointer text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Change Logo
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span>
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF (Max 2MB)</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        )}
      </motion.div>

      <div className="text-xs text-gray-500 space-y-1">
        <p>• Maximum size: 2MB</p>
        <p>• Recommended size: 200x200px</p>
        <p>• Supported formats: JPG, PNG, GIF</p>
      </div>
    </div>
  );
}