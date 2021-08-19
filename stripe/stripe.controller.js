/* eslint-disable no-console */
const stripe = require('stripe')(process.env.STRIPE_SK_LIVE);
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
      success_url: 'https://www.testably.co/dashboard?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://www.testably.co/account',
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
  const returnUrl = 'https://www.testably.co/dashboard';
  const customer = req.body.stripeCustomerID;

  const session = await stripe.billingPortal.sessions.create({
    customer,
    return_url: returnUrl,
  });

  console.log('session', session);

  return res.json({ session });
};

const webhook = async (req, res) => {
  const { data } = req.body;
  const eventType = req.body.type;

  if (eventType === 'checkout.session.completed') {
    console.log('firing checkout.session.completed');
    const filter = { stripeCustomerID: data.object.customer };
    const update = { currentPlan: data.object.amount_total };
    const updatedUser = await User.findOneAndUpdate(filter, update, { returnOriginal: false });
    console.log('checkout.session.completed', updatedUser);
  }
  if (eventType === 'invoice.paid') {
    console.log('firing invoice.paid');

    const subscription = await stripe.subscriptions.retrieve(data.object.subscription);
    const { amount } = subscription.plan;

    const filter = { stripeCustomerID: data.object.customer };
    const update = { currentPlan: amount };

    const updatedUser = await User.findOneAndUpdate(filter, update, { returnOriginal: false });
    console.log('invoice.paid', updatedUser);
  }
  if (eventType === 'invoice.payment_failed') {
    console.log('firing invoice.payment_failed');
    const filter = { stripeCustomerID: data.object.customer };
    const update = { currentPlan: 'none' };
    const updatedUser = await User.findOneAndUpdate(filter, update, { returnOriginal: false });
    console.log(updatedUser);
  }
  res.sendStatus(200);
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
