"use strict";
/**
 * Order.js controller
 *
 * @description: A set of functions called "actions" for managing `Order`.
 */
// note that this needs to be a "private" key from STRIPE
const stripe = require("stripe")(
  "sk_test_51Mo1Q0SHX9EmkHxSDr3m1QlofQffh4LvLNjyF9RsFxHTHpi1EZJVNwmmF6ROouR4IrVc8xRN9WZJxZKdOx1mL3fF00HqaiOqdK"
);
module.exports = {
  /**
   * Create a/an order record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    const { address, amount, dishes, token, city, state } = JSON.parse(
      ctx.request.body
    );
    console.log("hi");
    const stripeAmount = Math.floor(amount * 100);
    // charge on stripe
    const charge = await stripe.paymentIntents.create({
      // Transform cents to dollars.
      amount: stripeAmount,
      currency: "INR",
      description: `Order ${new Date()} by ${ctx.state.user._id}`,
      source: token,
    });

    // Register the order in the database
    const order = await strapi.services.order.create({
      user: ctx.state.user.id,
      charge_id: charge.id,
      amount: stripeAmount,
      address,
      dishes,
      city,
      state,
    });
    console.log(order);
    return order;
  },
};
