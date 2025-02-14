import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

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
  // createdAt and updatedAt fields will be
  //  automatically added to the schema
  {
    timestamps: true,
  }
);

//encrypt password before save

//pre-save hoot to hash password before saving to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

//compare passwords
userSchema.methods.comparePassword = async function (password) {
  return bcryptjs.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
