import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name!"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email!"],
      unique: true,
      lowercase: true, // Fixed typo
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password!"],
      minlength: [6, "Password must be at least 6 characters!"],
    },
    cartItem: [
      {
        quantity: {
          type: Number,
          default: 1,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  {
    timestamps: true, // Moved to correct location
  }
);

export default mongoose.model("User", userSchema);
