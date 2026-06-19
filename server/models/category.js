const mongoosePaginate = require("mongoose-paginate-v2");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

categorySchema.plugin(mongoosePaginate);

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
module.exports = Category;
