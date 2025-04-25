import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
    outletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Outlet",
    },
    refreshTokenId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RefreshToken",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
