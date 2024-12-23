import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';

interface CreditCardFormProps {
  onSubmit: (data: CardDetails) => Promise<void>;
}

interface CardDetails {
  number: string;
  expiry: string;
  cvc: string;
  name: string;
}

export function CreditCardForm({ onSubmit }: CreditCardFormProps) {
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(cardDetails);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
          Card number
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CreditCard className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            id="card-number"
            maxLength={19}
            placeholder="4242 4242 4242 4242"
            value={cardDetails.number}
            onChange={(e) => setCardDetails({
              ...cardDetails,
              number: formatCardNumber(e.target.value),
            })}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">
            Expiry date
          </label>
          <Input
            type="text"
            id="expiry"
            placeholder="MM/YY"
            maxLength={5}
            value={cardDetails.expiry}
            onChange={(e) => setCardDetails({
              ...cardDetails,
              expiry: formatExpiry(e.target.value),
            })}
          />
        </div>

        <div>
          <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
            CVC
          </label>
          <Input
            type="text"
            id="cvc"
            placeholder="123"
            maxLength={3}
            value={cardDetails.cvc}
            onChange={(e) => setCardDetails({
              ...cardDetails,
              cvc: e.target.value.replace(/\D/g, ''),
            })}
          />
        </div>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name on card
        </label>
        <Input
          type="text"
          id="name"
          placeholder="John Doe"
          value={cardDetails.name}
          onChange={(e) => setCardDetails({
            ...cardDetails,
            name: e.target.value,
          })}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Pay with Card'
        )}
      </Button>
    </form>
  );
}