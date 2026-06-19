const mongoosePaginate = require("mongoose-paginate-v2");
const mongoose = require("mongoose");
const CartItem = require("./cartItem");
const Schema = mongoose.Schema;

//
const orderSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Mới",
        "Đã xác nhận",
        "Đang giao",
        "Đã giao",
        "Hoàn thành",
        "Đã hủy",
      ],
      default: "Mới",
    },
    deliveryInfo: {
      fullname: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    products: [CartItem],
  },
  { timestamps: true },
);

orderSchema.plugin(mongoosePaginate);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
module.exports = Order;
