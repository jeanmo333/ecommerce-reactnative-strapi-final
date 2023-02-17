"use strict";
const stripe = require("stripe")(process.env.STRAPI_SECRET_KEY);

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

function calcPrice(price, discount, quantity) {
  if (!discount) return price * parseInt(quantity);

  const discountAmount = (price * discount) / 100;

  const priceTemp = (price - discountAmount).toFixed(0);
  return priceTemp * parseInt(quantity);
}

module.exports = {
  async create(ctx) {
    const { tokenStripe, products, idUser, addressShipping } = ctx.request.body;
    let totalPayment = 0;
    products.forEach((product) => {
      const priceProduct = calcPrice(
        product.price,
        product.discount,
        product.quantity
      );
      totalPayment += priceProduct;
    });

    const charge = await stripe.charges.create({
      amount: totalPayment,
      currency: "clp",
      source: tokenStripe,
      description: `ID Usuario: ${idUser}`,
    });

    const createOrder = [];
    for await (const product of products) {
      const data = {
        product: product.id,
        user: idUser,
        totalPayment: totalPayment,
        productsPayment: calcPrice(
          product.price,
          product.discount,
          product.quantity
        ),
        quantity: product.quantity,
        idPayment: charge.id,
        addressShipping,
      };

      const validData = await strapi.entityValidator.validateEntityCreation(
        strapi.models.order,
        data
      );
      const entry = await strapi.query("order").create(validData);
      createOrder.push(entry);
    }

    return createOrder;
  },
};
