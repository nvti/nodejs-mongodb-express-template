import mongoose from "mongoose";
import logger from "../../../logger";
const Schema = mongoose.Schema;

const User = mongoose.model(
  "User",
  new Schema({
    _id: String,
    phone_number: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: {
        hash: {
          type: String,
          required: true,
        },
        salt: {
          type: String,
          required: true,
        },
        iterations: {
          type: Number,
          required: true,
        },
      },
      required: true,
    },
    auth_session: String,
    last_login: Date,
    name: {
      type: String,
      required: true,
    },
    avatar: String,
    type: {
      type: String,
      required: true,
      enum: Object.values(userModel.type),
    },
  })
);
