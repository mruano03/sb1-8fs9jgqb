import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { OrderSummary } from '@/components/payment/order-summary';
import { CreditCardForm } from '@/components/payment/credit-card-form';
import { useSubscription } from '@/hooks/use-subscription';

declare global {
  interface Window {
    paypal?: any;
  }
}

interface PayPalSubscriptionData {
  orderID?: string;
  subscriptionID?: string;
}

interface PayPalActions {
  subscription: {
    create: (data: { plan_id: string }) => Promise<string>;
  };
}

interface CardDetails {
  number: string;
  expiry: string;
  cvc: string;
  name: string;
}

export function PaymentPage() {
  const navigate = useNavigate();
  const { updateSubscription } = useSubscription();
  const paypalButtonRef = useRef<HTMLDivElement>(null);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (window.paypal) {
      setPaypalLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
    script.async = true;
    script.setAttribute('data-sdk-integration-source', 'button-factory');
    
    script.onload = () => {
      setPaypalLoaded(true);
      setError(null);
    };

    script.onerror = () => {
      setError('PayPal is being blocked by your browser. Please disable your ad blocker or add this site to your allowlist to proceed with payment.');
      console.error('PayPal SDK was blocked from loading. This may be due to an ad blocker.');
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (!paypalLoaded || !window.paypal || !paypalButtonRef.current) return;

    try {
      if (paypalButtonRef.current.childNodes.length > 0) {
        return; // Evita renderizado múltiple
      }

      window.paypal.Buttons({
        style: {
          shape: 'pill',
          color: 'blue',
          layout: 'vertical',
          label: 'subscribe'
        },
        createSubscription: async function(data: PayPalSubscriptionData, actions: PayPalActions) {
          setProcessing(true);
          try {
            const subscription = await actions.subscription.create({
              plan_id: import.meta.env.VITE_PAYPAL_PLAN_ID || ''
            });
            return subscription;
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al crear la suscripción';
            setError(`Error en PayPal: ${errorMessage}`);
            setProcessing(false);
            throw err;
          }
        },
        onApprove: async function(data: PayPalSubscriptionData) {
          try {
            if (!data.subscriptionID) {
              throw new Error('No se recibió ID de suscripción');
            }
            await updateSubscription(data.subscriptionID);
            navigate('/dashboard/subscription');
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al activar la suscripción';
            setError(`Error al activar la suscripción: ${errorMessage}`);
          } finally {
            setProcessing(false);
          }
        },
        onError: function(err: Error) {
          console.error('PayPal error:', err);
          setError(`Error en el proceso de pago: ${err.message}`);
          setProcessing(false);
        },
        onCancel: function() {
          setProcessing(false);
          setError(null);
        }
      }).render(paypalButtonRef.current);
    } catch (renderError) {
      console.error('Error al renderizar botones de PayPal:', renderError);
      setError('No se pudo inicializar el sistema de pago. Por favor, intenta más tarde.');
    }
  }, [paypalLoaded, navigate, updateSubscription]);

 
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Lock className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Complete Payment
          </h2>
        </div>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <OrderSummary
            planName="Pro Plan"
            price={10.00}
          />
          <div className="my-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Pay with PayPal
            </h3>
            {error && (
              <div className="text-red-500 mb-4 text-sm">
                {error}
              </div>
            )}
            {!paypalLoaded ? (
              <div className="text-gray-500 text-center py-8">Loading payment options...</div>
            ) : (
              <div 
                ref={paypalButtonRef} 
                className={`min-h-[150px] ${processing ? 'opacity-50 pointer-events-none' : ''}`} 
              />
            )}
          </div>

         

          
        </Card>
      </div>
    </div>
  );
}