const mongoosePaginate = require("mongoose-paginate-v2");
const mongoose = require("mongoose");
const CartItem = require("./cartItem");
const Schema = mongoose.Schema;

//
const customerSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      default: "",
    },
    cart: [CartItem],
    status: {
      type: String,
      required: true,
      enum: ["Active", "Locked", "Pending"],
      default: "Active",
      trim: true,
    },
  },
  { timestamps: true },
);

customerSchema.plugin(mongoosePaginate);

const Customer =
  mongoose.models.Customer || mongoose.model("Customer", customerSchema);
module.exports = Customer;
