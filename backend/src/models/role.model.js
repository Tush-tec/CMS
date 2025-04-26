import { Schema, model } from "mongoose";

const permissionEnum = [
  "create_news",
  "edit_news",
  "publish_news",
  "delete_news",
  "manage_users",
  "manage_categories",
  "view_stats",
  "submit_news",
  "roles"
];

const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    permissions: {
      type: [String],
      enum: permissionEnum,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Role = model("Role", roleSchema);



