import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import { stripe } from "../lib/stripe.js";
import dotenv from "dotenv";
dotenv.config();

// createCheckoutSession is a function that will be defined in the payment.controller.js file.
export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid or empty prodcuts array" });
    }

    let totalAmount = 0;

    const lineItems = products.map((product) => {
      const amout = Math.round(product.price * 100); // stripe wants us to send the amount in the format of cents
      total += amount * product.quantity;

      return {
        price_data: "usd",
        product_data: {
          name: product.title,
          images: [product.image],
        },
        unit_amount: amount,
      };
    });

    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });
      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.discountPercentage) / 100
        );
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "visa", "mastercard", "paypal"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${processs.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${processs.env.CLIENT_URL}/purchase-cancel`,
      discounts: coupon
        ? [{ coupon: await createStripeCoupon(coupon.discountPercentage) }]
        : [],
      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          }))
        ),
      },
    });

    if (totalAmount >= 20000) {
      await createNewCoupon(req.user._id.toString());
    }
    res
      .status(200)
      .json({ sessionId: session.id, totatlAmount: totalAmount / 100 });
  } catch (error) {
    console.error("error creating checkout session: ", error);
    res
      .status(500)
      .json({ error: "Error creating checkout session", error: error.message });
  }
};

// checkoutSuccess
export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userId: session.metadata.userId,
          },
          {
            isActive: false,
          }
        );
      }

      // create a new order in the database
      const products = JSON.parse(session.metadata.products);
      const newOrder = new Order({
        user: session.metadata.userId,
        products: products.map((prodcut) => ({
          product: product.id,
          quantity: product.quantity,
          price: prodcut.price,
        })),

        totalAmount: session.amount_total / 100, //convert it to dollars from cents
        stripeSessionId: sessionId,
      });
      await newOrder.save();
      res.status(200).json({
        message:
          "Payment, order created successfully. Coupon deactivated if used.",
        success: true,
        orderId: newOrder._id,
      });
    }
  } catch (error) {
    console.error("error processing successful checkout: ", error);
    res.status(500).json({
      error: "Error processing successful checkout",
      error: error.message,
    });
  }
};

//helper funcs
async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });
  return coupon.id;
}

async function createNewCoupon(userId) {
  const createNewCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substr(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    userId: userId,
  });
  await newCoupon.save();
  return newCoupon;
}
