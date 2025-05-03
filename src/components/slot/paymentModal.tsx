// components/PaymentModal.tsx
import React from 'react';
import { X } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '@/components/user/PaymentForm';
import { STRIPE_PUBLISHABLE_KEY } from '@/utility/env';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientSecret: string | null;
  paymentId: string | null;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  clientSecret, 
  onSuccess 
}) => {
  if (!isOpen || !clientSecret) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Complete Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <Elements stripe={stripePromise} options={{ clientSecret: clientSecret }}>
          <PaymentForm
            clientSecret={clientSecret}
            onSuccess={onSuccess}
          />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentModal;