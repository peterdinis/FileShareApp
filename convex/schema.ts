import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  files: defineTable({
    name: v.string(),
    storageId: v.id("_storage"),
    ownerId: v.id("users"),
    size: v.number(),
    type: v.string(),
  }).index("by_owner", ["ownerId"]),
  
  shares: defineTable({
    fileId: v.id("files"),
    accessCode: v.string(),
    createdBy: v.id("users"),
    expiresAt: v.optional(v.number()),
  })
    .index("by_access_code", ["accessCode"])
    .index("by_file", ["fileId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
