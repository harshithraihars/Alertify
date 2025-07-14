const agenda = require("./Agenda/agenda");
const productModel = require("./Schema/productSchema");

const enqueAllProducts = async () => {
  const products = await productModel.find();
  for (let product of products) {
    await agenda
      .create("check product price", { product }) // create job
      .unique({ "data.product._id": product._id }) // ensure uniqueness
      .schedule("in 30 seconds") // schedule for later
      .save(); // save to DB
  }
};
module.exports = { enqueAllProducts };
