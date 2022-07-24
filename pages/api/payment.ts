import { NextApiRequest, NextApiResponse } from 'next';
const stripe = require('stripe')(`${process.env.SECRET_KEY_STRIPE}`);

const payment = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { stripePrice, routeId } = req.body;
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: stripePrice,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/payment/?success=true&routeId=${routeId}`,
      cancel_url: `${req.headers.origin}/payment/?canceled=true`,
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(err.statusCode || 500).json(err.message);
  }
};

export default payment;
