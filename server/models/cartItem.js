const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//
const cartItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    priceAt: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
    timestamps: true,
  },
);

module.exports = cartItemSchema;
