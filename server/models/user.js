const mongoosePaginate = require("mongoose-paginate-v2");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//
const userSchema = new Schema(
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
    role: {
      type: String,
      required: true,
      enum: ["Admin", "Staff"],
      default: "Staff",
    },
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

userSchema.plugin(mongoosePaginate);

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;
