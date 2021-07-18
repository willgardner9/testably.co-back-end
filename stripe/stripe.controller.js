const stripe = require('stripe')(process.env.STRIPE_SK);
const User = require('../user/user.model');

const createCheckoutSession = async (req, res) => {
  const { priceId, stripeCustomerID } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: stripeCustomerID,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
      // the actual Session ID is returned in the query parameter when your customer
      // is redirected to the success page.
      success_url: 'https://testably-co-front-end.vercel.app/dashboard?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://testably-co-front-end.vercel.app/account',
    });

    return res.json(session.id);
  } catch (e) {
    res.status(400);
    return res.send({
      error: {
        message: e.message,
      },
    });
  }
};

const customerPortal = async (req, res) => {
  // This is the url to which the customer will be redirected when they are done
  // managing their billing with the portal.
  const returnUrl = 'https://testably-co-front-end.vercel.app/dashboard';
  const customer = req.body.stripeCustomerID;

  const session = await stripe.billingPortal.sessions.create({
    customer,
    return_url: returnUrl,
  });

  return res.json({ session });
};

const webhook = async (req, res) => {
  const { data } = req.body;
  const eventType = req.body.type;

  if (eventType === 'checkout.session.completed') {
    const filter = { stripeCustomerID: data.object.customer };
    const update = { currentPlan: data.object.amount_total };
    const updatedUser = await User.findOneAndUpdate(filter, update, { returnOriginal: false });
    res.status(200).json(updatedUser);
  }
  if (eventType === 'invoice.paid') {
    const filter = { stripeCustomerID: data.object.customer };
    const update = { currentPlan: data.object.lines.data[0].amount };
    const updatedUser = await User.findOneAndUpdate(filter, update, { returnOriginal: false });
    res.status(200).json(updatedUser);
  }
  if (eventType === 'invoice.payment_failed') {
    const filter = { stripeCustomerID: data.object.customer };
    const update = { currentPlan: 'done' };
    const updatedUser = await User.findOneAndUpdate(filter, update, { returnOriginal: false });
    res.status(200).json(updatedUser);
  }
};

const createCustomerId = async (email) => {
  const newCustomer = await stripe.customers.create({ email });
  return newCustomer;
};

module.exports = {
  createCheckoutSession,
  customerPortal,
  webhook,
  createCustomerId,
};
