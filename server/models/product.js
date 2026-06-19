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
      enum: ["In Stock", "Out of Stock", "Discontinued"],
      default: "In Stock",
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
      this.status = "Out of Stock";
    } else if (this.status === "Out of Stock" && this.stock > 0) {
      this.status = "In Stock";
    }
  }
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
module.exports = Product;
