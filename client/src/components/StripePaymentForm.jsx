import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './StripePaymentForm.css';

const StripePaymentForm = ({ amount: initialAmount, onSuccessfulPayment }) => {
  const amount = Math.round(initialAmount * 100) / 100;
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      setError('Stripe.js has not loaded yet.');
      setProcessing(false);
      return;
    }

    try {
      // 1. Create Payment Intent on the server
      const response = await fetch('http://localhost:4242/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(amount * 100) }), // amount in cents
      });

      const { clientSecret, error: backendError } = await response.json();

      if (backendError) {
        throw new Error(backendError);
      }

      // 2. Confirm the card payment
      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (stripeError) {
        throw stripeError;
      }

      if (paymentIntent.status === 'succeeded') {
        onSuccessfulPayment(paymentIntent.id);
        setError(null);
      } else {
        setError(`Payment failed with status: ${paymentIntent.status}`);
      }
    } catch (err) {
      setError(err.message);
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="card-element">Credit or debit card</label>
      <div id="card-element" className="card-element-container">
        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      </div>
      {error && <div className="card-errors" role="alert">{error}</div>}
      <button type="submit" disabled={!stripe || processing} className="pay-button">
        {processing ? 'Processing...' : `Pay R ${amount.toFixed(2)}`}
      </button>
    </form>
  );
};

export default StripePaymentForm;
