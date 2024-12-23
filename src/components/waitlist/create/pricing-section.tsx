import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { WaitlistPricing } from '@/lib/types';

interface PricingSectionProps {
  pricing: WaitlistPricing;
  onChange: (pricing: WaitlistPricing) => void;
}

export function PricingSection({ pricing, onChange }: PricingSectionProps) {
  const [newFeature, setNewFeature] = useState('');

  const addFeature = () => {
    if (!newFeature.trim()) return;
    onChange({
      ...pricing,
      features: [...(pricing.features || []), newFeature.trim()],
    });
    setNewFeature('');
  };

  const removeFeature = (index: number) => {
    onChange({
      ...pricing,
      features: pricing.features?.filter((_, i) => i !== index) || [],
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Pricing Details</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <Input
            type="number"
            value={pricing.amount}
            onChange={(e) => onChange({
              ...pricing,
              amount: parseFloat(e.target.value) || 0,
            })}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Interval
          </label>
          <select
            value={pricing.interval}
            onChange={(e) => onChange({
              ...pricing,
              interval: e.target.value as 'month' | 'year',
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Features
        </label>
        <div className="mt-2 space-y-3">
          {pricing.features?.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={feature}
                onChange={(e) => {
                  const newFeatures = [...(pricing.features || [])];
                  newFeatures[index] = e.target.value;
                  onChange({ ...pricing, features: newFeatures });
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFeature(index)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Add a feature..."
              onKeyPress={(e) => e.key === 'Enter' && addFeature()}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addFeature}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}