require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(cors());
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  const amount = Number(req.body?.amount);

  // Stripe's minimum charge for ZAR is R5.00 (500 cents).
  if (!Number.isInteger(amount) || amount < 500) {
    return res.status(400).send({ error: 'Amount must be a whole number of cents, at least 500.' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: 'zar',
      payment_method_types: ['card'],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Node server listening on port ${PORT}`));
