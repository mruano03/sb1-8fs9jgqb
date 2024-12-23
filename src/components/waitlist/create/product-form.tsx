import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface ProductFormData {
  name: string;
  description: string;
  features: Array<{ title: string; description: string; icon: string }>;
  benefits: string[];
  pricing: {
    amount: string;
    currency: string;
  };
  image_url: string;
}

interface ProductFormProps {
  data: ProductFormData;
  onChange: (data: ProductFormData) => void;
}

export function ProductForm({ data, onChange }: ProductFormProps) {
  const addFeature = () => {
    onChange({
      ...data,
      features: [
        ...data.features,
        { title: '', description: '', icon: 'Star' }
      ]
    });
  };

  const removeFeature = (index: number) => {
    onChange({
      ...data,
      features: data.features.filter((_, i) => i !== index)
    });
  };

  const updateFeature = (index: number, field: keyof typeof data.features[0], value: string) => {
    onChange({
      ...data,
      features: data.features.map((feature, i) => 
        i === index ? { ...feature, [field]: value } : feature
      )
    });
  };

  const addBenefit = () => {
    onChange({
      ...data,
      benefits: [...data.benefits, '']
    });
  };

  const removeBenefit = (index: number) => {
    onChange({
      ...data,
      benefits: data.benefits.filter((_, i) => i !== index)
    });
  };

  const updateBenefit = (index: number, value: string) => {
    onChange({
      ...data,
      benefits: data.benefits.map((benefit, i) => 
        i === index ? value : benefit
      )
    });
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Product Information</h3>
      <div className="space-y-6">
        <div>
          <label htmlFor="product_name" className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <Input
            id="product_name"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            required
            className="mt-1"
            placeholder="Your product name"
          />
        </div>

        <div>
          <label htmlFor="product_description" className="block text-sm font-medium text-gray-700">
            Product Description
          </label>
          <textarea
            id="product_description"
            value={data.description}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
            required
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Describe your product and its value proposition"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Key Features
            </label>
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
            {data.features.map((feature, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-1 space-y-4">
                  <Input
                    value={feature.title}
                    onChange={(e) => updateFeature(index, 'title', e.target.value)}
                    placeholder="Feature title"
                  />
                  <Input
                    value={feature.description}
                    onChange={(e) => updateFeature(index, 'description', e.target.value)}
                    placeholder="Feature description"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFeature(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Benefits
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addBenefit}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Benefit
            </Button>
          </div>
          <div className="space-y-4">
            {data.benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4">
                <Input
                  value={benefit}
                  onChange={(e) => updateBenefit(index, e.target.value)}
                  placeholder={`Benefit ${index + 1}`}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBenefit(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <Input
              id="price"
              type="number"
              value={data.pricing.amount}
              onChange={(e) => onChange({
                ...data,
                pricing: { ...data.pricing, amount: e.target.value }
              })}
              required
              min="0"
              step="0.01"
              className="mt-1"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
              Currency
            </label>
            <select
              id="currency"
              value={data.pricing.currency}
              onChange={(e) => onChange({
                ...data,
                pricing: { ...data.pricing, currency: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="product_image" className="block text-sm font-medium text-gray-700">
            Product Image URL
          </label>
          <Input
            id="product_image"
            type="url"
            value={data.image_url}
            onChange={(e) => onChange({ ...data, image_url: e.target.value })}
            className="mt-1"
            placeholder="https://example.com/product-image.jpg"
          />
          <p className="mt-1 text-sm text-gray-500">Optional: Add a product image</p>
        </div>
      </div>
    </Card>
  );
}