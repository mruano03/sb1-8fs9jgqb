import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { WaitlistFeature } from '@/lib/types';

interface FeaturesSectionProps {
  features: WaitlistFeature[];
  onChange: (features: WaitlistFeature[]) => void;
}

export function FeaturesSection({ features, onChange }: FeaturesSectionProps) {
  const addFeature = () => {
    onChange([
      ...features,
      {
        id: crypto.randomUUID(),
        title: '',
        description: '',
        icon: 'Star',
      },
    ]);
  };

  const removeFeature = (id: string) => {
    onChange(features.filter((f) => f.id !== id));
  };

  const updateFeature = (id: string, updates: Partial<WaitlistFeature>) => {
    onChange(
      features.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Features</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addFeature}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Feature
        </Button>
      </div>

      <div className="space-y-4">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="bg-white rounded-lg border p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <Input
                value={feature.title}
                onChange={(e) =>
                  updateFeature(feature.id, { title: e.target.value })
                }
                placeholder="Feature title"
                className="flex-1 mr-4"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFeature(feature.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>

            <Input
              value={feature.description}
              onChange={(e) =>
                updateFeature(feature.id, { description: e.target.value })
              }
              placeholder="Feature description"
            />

            <select
              value={feature.icon}
              onChange={(e) =>
                updateFeature(feature.id, { icon: e.target.value })
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Star">Star</option>
              <option value="Zap">Zap</option>
              <option value="Shield">Shield</option>
              <option value="Bell">Bell</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}