const { checkPriceDrop } = require("../periodic");
const agenda = require("./agenda");

agenda.define(
  "check product price",
  {
    concurrency: 3,
  },
  async (job) => {
    const { product } = job.attrs.data;
    await checkPriceDrop(product);
  }
);
module.exports = agenda;