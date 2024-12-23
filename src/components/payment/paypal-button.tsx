import { useEffect, useRef } from 'react';

interface PayPalButtonProps {
  planId: string;
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
}

export function PayPalButton({ planId, onSuccess, onError }: PayPalButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!buttonRef.current || !window.paypal) return;

    // Clear existing buttons
    buttonRef.current.innerHTML = '';

    const button = window.paypal.Buttons({
      style: {
        shape: 'rect',
        color: 'blue',
        layout: 'vertical',
        label: 'subscribe'
      },
      createSubscription: (_data: any, actions: any) => {
        return actions.subscription.create({
          plan_id: planId
        });
      },
      onApprove: (data: any) => {
        onSuccess(data);
      },
      onError: (err: any) => {
        onError(err);
      }
    });

    button.render(buttonRef.current);

    return () => {
      button.close();
    };
  }, [planId, onSuccess, onError]);

  return <div ref={buttonRef} className="min-h-[150px]" />;
}