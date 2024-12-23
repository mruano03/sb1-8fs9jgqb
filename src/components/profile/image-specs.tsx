import { Card } from '@/components/ui/card';
import { Image } from 'lucide-react';

export function ImageSpecs() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Image Specifications</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Image className="h-5 w-5 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-900">Logo Requirements</h4>
          </div>
          
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Maximum size: 2MB</li>
            <li>• Recommended dimensions: 200x200px</li>
            <li>• Accepted formats: JPG, PNG, GIF</li>
            <li>• Square aspect ratio recommended</li>
            <li>• Transparent background preferred</li>
          </ul>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Image className="h-5 w-5 text-purple-600" />
            </div>
            <h4 className="font-medium text-gray-900">Cover Image Requirements</h4>
          </div>
          
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Maximum size: 5MB</li>
            <li>• Recommended dimensions: 1200x630px</li>
            <li>• Accepted formats: JPG, PNG</li>
            <li>• 1.91:1 aspect ratio recommended</li>
            <li>• High resolution (minimum 72 dpi)</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}