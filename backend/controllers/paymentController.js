const stripe = require('../config/stripe');
const Payment = require('../models/Payment');

const createCheckoutSession = async (req, res) => {
    try {
        const {vehicleId, vehicleBrand,vehicleModel,  pickupDateTime, dropoffDateTime, totalBill ,bookingId } = req.body;
        const userId = req.user.id;

        

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: `Booking for Vehicle ${vehicleBrand} ${vehicleModel}`,
                        description: `From ${pickupDateTime} to ${dropoffDateTime}`,
                    },
                    unit_amount: Math.round(totalBill * 100), 
                },
                quantity: 1,
            }],
            metadata: {
                vehicleId,
                userId,
                bookingId,
                pickupDateTime,
                dropoffDateTime,
               
            },
            success_url: `${process.env.CLIENT_URL}/user/vehicleBooking/${vehicleId}?success=true&bookingId=${bookingId}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/user/vehicleBooking/${vehicleId}?success=false`,
        });

        res.status(200).json({ id: session.id, url: session.url });

    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: 'Failed to create Stripe session' });
    }
};


const getStripeSession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    res.json({
      id: session.id,
      payment_intent: session.payment_intent,
      amount_total: session.amount_total,
      currency: session.currency,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve session" });
  }
};

//this controller handle the payment db storage
const handlePayment = async (req, res) => {
    const { bookingId, userId, hostId, amount, paymentMethod, status, transactionId } = req.body;

    try {
        const payment = new Payment({
            bookingId,
            userId,
            hostId,
            amount,
            paymentMethod,
            status,
            transactionId
        });

        await payment.save();
        res.status(201).json({ message: "Payment recorded successfully", payment });
    } catch (error) {
        console.error('Error recording payment:', error);
        res.status(500).json({ error: "Failed to record payment" });
    }
};
module.exports={createCheckoutSession ,getStripeSession, handlePayment}