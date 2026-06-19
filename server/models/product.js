const mongoosePaginate = require("mongoose-paginate-v2");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
      validate: [(val) => val.length <= 5],
    },
    description: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ["Còn hàng", "Hết hàng", "Ngừng kinh doanh"],
      default: "Còn hàng",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true },
);

productSchema.plugin(mongoosePaginate);

productSchema.pre("save", function (next) {
  if (this.isModified("stock")) {
    if (this.stock === 0) {
      this.status = "Hết hàng";
    } else if (this.status === "Hết hàng" && this.stock > 0) {
      this.status = "Còn hàng";
    }
  }
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
module.exports = Product;
