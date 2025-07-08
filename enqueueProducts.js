const agenda = require("./Agenda/agenda");
const productModel = require("./Schema/productSchema");

const enqueAllProducts = async () => {
  const products = await productModel.find();
  for (let product of products) {
    await agenda.now(
      "check product price",
      { product },
      {
        unique: { "data.product._id": product._id },
      }
    );
  }
};
module.exports={enqueAllProducts}