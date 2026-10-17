import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { formatPrice } from "../utils/format";
import "./StripePaymentForm.css";

const STRIPE_ENABLED = !!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
const PAYMENT_API_URL = process.env.REACT_APP_PAYMENT_API_URL || "http://localhost:4242";

// Live mode: Stripe Elements + the payment-intent server in /server.
const LiveCardForm = ({ amount, onSuccessfulPayment, disabled }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setError(null);

    try {
      const response = await fetch(`${PAYMENT_API_URL}/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const { clientSecret, error: backendError } = await response.json();
      if (backendError) throw new Error(backendError);

      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });
      if (stripeError) throw stripeError;

      if (paymentIntent.status === "succeeded") {
        await onSuccessfulPayment({ method: "card", reference: paymentIntent.id });
      } else {
        setError(`Payment wasn't completed (status: ${paymentIntent.status}). You haven't been charged.`);
      }
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "We couldn't reach the payment service. Check your connection and try again."
          : err.message
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-form">
      <label htmlFor="card-element" className="card-label">
        Card details
      </label>
      <div id="card-element" className="card-element-container">
        <CardElement
          options={{
            hidePostalCode: true,
            style: { base: { fontSize: "16px", color: "#221c18", "::placeholder": { color: "#5b5149" } } },
          }}
        />
      </div>
      {error && (
        <p className="form-alert" role="alert">
          {error}
        </p>
      )}
      <button type="submit" disabled={!stripe || processing || disabled} className="btn btn-primary pay-button">
        {processing ? "Processing payment…" : `Pay ${formatPrice(amount)}`}
      </button>
    </form>
  );
};

const formatCardNumber = (v) =>
  v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");

const formatExpiry = (v) => {
  const digits = v.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

// Demo mode: no Stripe keys configured. Simulates a card payment so the
// full order flow can be tried end to end without taking money.
const DemoCardForm = ({ amount, onSuccessfulPayment, disabled }) => {
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const update = (key, value) => {
    setCard((c) => ({ ...c, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const found = {};
    if (card.number.replace(/\s/g, "").length !== 16) found.number = "Enter the 16-digit card number.";
    const [mm, yy] = card.expiry.split("/").map(Number);
    const now = new Date();
    const expired = !yy || yy + 2000 < now.getFullYear() || (yy + 2000 === now.getFullYear() && mm < now.getMonth() + 1);
    if (!mm || mm > 12 || expired) found.expiry = "Enter a future expiry date as MM/YY.";
    if (!/^\d{3,4}$/.test(card.cvc)) found.cvc = "Enter the 3-digit code on the back.";
    if (!card.name.trim()) found.name = "Enter the name on the card.";
    setErrors(found);
    return Object.keys(found).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));

    if (card.number.replace(/\s/g, "") === "4000000000000002") {
      setError("Your card was declined. Try another card — you haven't been charged.");
      setProcessing(false);
      return;
    }

    try {
      await onSuccessfulPayment({
        method: "card",
        reference: `demo_${Date.now().toString(36)}`,
        last4: card.number.slice(-4),
        demo: true,
      });
    } finally {
      setProcessing(false);
    }
  };

  const err = (key) =>
    errors[key] && (
      <span id={`card-${key}-error`} className="field-error">
        {errors[key]}
      </span>
    );

  return (
    <form onSubmit={handleSubmit} className="card-form" noValidate>
      <p className="demo-note">
        <strong>Demo mode.</strong> No real payment is taken. Use card 4242 4242 4242 4242 with any future date and
        CVC, or 4000 0000 0000 0002 to see a declined payment.
      </p>

      <div className="field">
        <label htmlFor="card-number">Card number</label>
        <input
          id="card-number"
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="1234 5678 9012 3456"
          value={card.number}
          onChange={(e) => update("number", formatCardNumber(e.target.value))}
          aria-invalid={!!errors.number}
          aria-describedby={errors.number ? "card-number-error" : undefined}
        />
        {err("number")}
      </div>

      <div className="card-row">
        <div className="field">
          <label htmlFor="card-expiry">Expiry</label>
          <input
            id="card-expiry"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/YY"
            value={card.expiry}
            onChange={(e) => update("expiry", formatExpiry(e.target.value))}
            aria-invalid={!!errors.expiry}
            aria-describedby={errors.expiry ? "card-expiry-error" : undefined}
          />
          {err("expiry")}
        </div>
        <div className="field">
          <label htmlFor="card-cvc">CVC</label>
          <input
            id="card-cvc"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="123"
            maxLength={4}
            value={card.cvc}
            onChange={(e) => update("cvc", e.target.value.replace(/\D/g, ""))}
            aria-invalid={!!errors.cvc}
            aria-describedby={errors.cvc ? "card-cvc-error" : undefined}
          />
          {err("cvc")}
        </div>
      </div>

      <div className="field">
        <label htmlFor="card-name">Name on card</label>
        <input
          id="card-name"
          autoComplete="cc-name"
          value={card.name}
          onChange={(e) => update("name", e.target.value)}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "card-name-error" : undefined}
        />
        {err("name")}
      </div>

      {error && (
        <p className="form-alert" role="alert">
          {error}
        </p>
      )}

      <button type="submit" disabled={processing || disabled} className="btn btn-primary pay-button">
        {processing ? "Processing payment…" : `Pay ${formatPrice(amount)}`}
      </button>
    </form>
  );
};

// `amount` is in cents.
const StripePaymentForm = (props) => (STRIPE_ENABLED ? <LiveCardForm {...props} /> : <DemoCardForm {...props} />);

export default StripePaymentForm;
