import { Card } from '@/components/ui/card';

interface OrderSummaryProps {
  planName: string;
  price: number;
  taxRate?: number;
}

export function OrderSummary({ planName, price, taxRate = 0.1 }: OrderSummaryProps) {
  const tax = price * taxRate;
  const total = price + tax;

  return (
    <Card className="p-4 bg-gray-50">
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Order Summary
      </h3>
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">{planName} (Monthly)</span>
        <span className="font-medium">${price.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm mt-2">
        <span className="text-gray-500">Tax</span>
        <span className="font-medium">${tax.toFixed(2)}</span>
      </div>
      <div className="border-t border-gray-200 mt-2 pt-2">
        <div className="flex justify-between text-base font-medium">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  );
}