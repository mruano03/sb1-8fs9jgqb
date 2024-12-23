import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { WaitlistBenefit } from '@/lib/types';

interface BenefitsSectionProps {
  benefits: WaitlistBenefit[];
  onChange: (benefits: WaitlistBenefit[]) => void;
}

export function BenefitsSection({ benefits, onChange }: BenefitsSectionProps) {
  const addBenefit = () => {
    if (benefits.length >= 5) return;
    onChange([
      ...benefits,
      {
        id: crypto.randomUUID(),
        title: '',
        description: '',
      },
    ]);
  };

  const removeBenefit = (id: string) => {
    onChange(benefits.filter((b) => b.id !== id));
  };

  const updateBenefit = (id: string, updates: Partial<WaitlistBenefit>) => {
    onChange(
      benefits.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Early Access Benefits</h3>
          <p className="text-sm text-gray-500 mt-1">Add up to 5 benefits for early access members</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addBenefit}
          disabled={benefits.length >= 5}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Benefit
        </Button>
      </div>

      <div className="space-y-4">
        {benefits.map((benefit) => (
          <div
            key={benefit.id}
            className="bg-white rounded-lg border p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <Input
                value={benefit.title}
                onChange={(e) =>
                  updateBenefit(benefit.id, { title: e.target.value })
                }
                placeholder="Benefit title"
                className="flex-1 mr-4"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeBenefit(benefit.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>

            <Input
              value={benefit.description}
              onChange={(e) =>
                updateBenefit(benefit.id, { description: e.target.value })
              }
              placeholder="Benefit description"
            />
          </div>
        ))}
      </div>
    </div>
  );
}