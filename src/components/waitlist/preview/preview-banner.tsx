import { Eye } from 'lucide-react';

export function PreviewBanner() {
  return (
    <div className="bg-blue-600 text-white px-4 py-2 text-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Eye className="h-4 w-4 mr-2" />
          <span>Preview Mode - This banner is only visible to you</span>
        </div>
        <button
          onClick={() => window.close()}
          className="text-blue-200 hover:text-white"
        >
          Exit Preview
        </button>
      </div>
    </div>
  );
}