const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  product_name: {
    type: String,
    required: true
  },
  product_url: {
    type: String,
    required: true
  },
  price_limit: {
    type: Number,
    required: true
  }
});

// Export the model correctly in a CommonJS environment
const productModel = mongoose.model("productalert", productSchema);

module.exports = productModel;
