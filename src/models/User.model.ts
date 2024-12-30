// const { Schema, model } = require("mongoose");
import { model, Schema, Model, InferSchemaType } from "mongoose";
import { type } from "os";
// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);
type UserType = InferSchemaType<typeof userSchema>;
// const User = model("User", userSchema);
const User: Model<UserType> = model("user", userSchema);

// module.exports = User;
export default User;
