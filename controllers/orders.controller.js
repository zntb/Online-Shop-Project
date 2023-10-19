const stripe = require("stripe")(
  "sk_test_51O2oRrGpzLAfVBczeoxQq7Lgq2rgBdzcM0DAbpytLwxrfBhJ9enVd5DYqhTwQ1DBAQqAcWewS9aJ75rMTd4VXchp00kUhY6LAD"
);

const Order = require("../models/order.model");
const User = require("../models/user.model");

async function getOrders(req, res) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render("customer/orders/all-orders", {
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
}

async function addOrder(req, res, next) {
  let userDocument;
  try {
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }
  const cart = res.locals.cart;
  const order = new Order(cart, userDocument);

  try {
    await order.save();
  } catch (error) {
    next(error);
    return;
  }

  req.session.cart = null;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price_data: {
          currency: "usd",
          product_data: {
            name: "Dummy",
          },
          unit_amount_decimal: 10.99,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `localhost:3000/orders/success`,
    cancel_url: `localhost:3000/orders/failure`,
  });

  res.redirect(303, session.url);
}

function getSucces(req, res) {
  res.render("customer/orders/succes");
}

function getFailure(req, res) {
  res.render("customer/orders/failure");
}

module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
  getSucces: getSucces,
  getFailure: getFailure,
};
