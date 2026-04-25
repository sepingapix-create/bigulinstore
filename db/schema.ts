import {
  mysqlTable,
  varchar,
  text,
  int,
  timestamp,
  mysqlEnum,
  decimal,
  primaryKey,
  boolean
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// Enums
export const orderStatusEnum = mysqlEnum("status", ["PENDING", "PAID", "CANCELLED"]);

// Users table (NextAuth standard + app specific)
export const users = mysqlTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date", fsp: 3 }),
  password: varchar("password", { length: 255 }),
  image: varchar("image", { length: 255 }),
  role: varchar("role", { length: 20 }).default("USER"),
  isAffiliate: boolean("isAffiliate").default(false),
  document: varchar("document", { length: 20 }), // CPF/CNPJ
  phone: varchar("phone", { length: 20 }),
  street: varchar("street", { length: 255 }),
  number: varchar("number", { length: 20 }),
  neighborhood: varchar("neighborhood", { length: 100 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 2 }),
  zipCode: varchar("zipCode", { length: 10 }),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().onUpdateNow(),
});

// Accounts table (NextAuth standard)
export const accounts = mysqlTable("accounts", {
  userId: varchar("userId", { length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 255 }).notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: int("expires_at"),
  token_type: varchar("token_type", { length: 255 }),
  scope: varchar("scope", { length: 255 }),
  id_token: text("id_token"),
  session_state: varchar("session_state", { length: 255 }),
}, (account) => ({
  compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] })
}));

// Products table
export const products = mysqlTable("products", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("originalPrice", { precision: 10, scale: 2 }),
  isFlashDeal: boolean("isFlashDeal").default(false),
  flashDealEnd: timestamp("flashDealEnd"),
  category: varchar("category", { length: 100 }).notNull(),
  stock: int("stock").notNull().default(0),
  imageUrl: varchar("imageUrl", { length: 500 }).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().onUpdateNow(),
});

// Orders table
export const orders = mysqlTable("orders", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull().references(() => users.id),
  status: orderStatusEnum.notNull().default("PENDING"),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
  discountAmount: decimal("discountAmount", { precision: 10, scale: 2 }).default("0.00"),
  couponCode: varchar("couponCode", { length: 50 }),
  pixCode: text("pixCode"),
  qrCodeImage: text("qrCodeImage"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().onUpdateNow(),
});

// Order Items table
export const orderItems = mysqlTable("order_items", {
  id: varchar("id", { length: 255 }).primaryKey(),
  orderId: varchar("orderId", { length: 255 }).notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: varchar("productId", { length: 255 }).notNull().references(() => products.id),
  quantity: int("quantity").notNull().default(1),
  priceAtPurchase: decimal("priceAtPurchase", { precision: 10, scale: 2 }).notNull(),
});

export const productInventory = mysqlTable("product_inventory", {
  id: varchar("id", { length: 255 }).primaryKey(),
  productId: varchar("productId", { length: 255 }).notNull(),
  content: text("content").notNull(), // The actual account, key or link
  isSold: boolean("isSold").default(false),
  orderId: varchar("orderId", { length: 255 }), // Linked after purchase
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

export const coupons = mysqlTable("coupons", {
  code: varchar("code", { length: 50 }).primaryKey(),
  discountPercentage: int("discountPercentage").notNull(),
  maxUses: int("maxUses").default(100),
  usedCount: int("usedCount").default(0),
  expiresAt: timestamp("expiresAt"),
  isActive: boolean("isActive").default(true),
  affiliateId: varchar("affiliateId", { length: 255 }),
});

export const affiliates = mysqlTable("affiliates", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull().references(() => users.id),
  handle: varchar("handle", { length: 50 }).notNull().unique(),
  commissionRate: int("commissionRate").default(10), // Percentage
  balance: decimal("balance", { precision: 10, scale: 2 }).default("0.00"),
  totalEarned: decimal("totalEarned", { precision: 10, scale: 2 }).default("0.00"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

export const affiliateReferrals = mysqlTable("affiliatereferrals", {
  id: varchar("id", { length: 255 }).primaryKey(),
  affiliateId: varchar("affiliateId", { length: 255 }).notNull().references(() => affiliates.id),
  orderId: varchar("orderId", { length: 255 }).notNull().references(() => orders.id),
  commissionAmount: decimal("commissionAmount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).default("PENDING"), // PENDING, PAID, CANCELLED
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

export const affiliateVisits = mysqlTable("affiliatevisits", {
  id: varchar("id", { length: 255 }).primaryKey(),
  affiliateId: varchar("affiliateId", { length: 255 }).notNull().references(() => affiliates.id),
  visitorIp: varchar("visitorIp", { length: 100 }),
  userAgent: text("userAgent"),
  referrerUrl: varchar("referrerUrl", { length: 500 }),
  convertedToUser: boolean("convertedToUser").default(false), // became registered user
  convertedToSale: boolean("convertedToSale").default(false),  // made a purchase
  userId: varchar("userId", { length: 255 }), // filled if they registered
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

export const withdrawals = mysqlTable("withdrawals", {
  id: varchar("id", { length: 255 }).primaryKey(),
  affiliateId: varchar("affiliateId", { length: 255 }).notNull().references(() => affiliates.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  pixKey: varchar("pixKey", { length: 255 }).notNull(),
  pixKeyType: varchar("pixKeyType", { length: 50 }).notNull(), // CPF, Email, Phone, Random
  status: mysqlEnum("status", ["PENDING", "APPROVED", "REJECTED"]).default("PENDING"),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().onUpdateNow(),
});

// Settings table for app configurations
export const settings = mysqlTable("settings", {
  key: varchar("key", { length: 255 }).primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().onUpdateNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  accounts: many(accounts),
}));

export const productsRelations = relations(products, ({ many }) => ({
  inventory: many(productInventory),
}));

export const productInventoryRelations = relations(productInventory, ({ one }) => ({
  product: one(products, {
    fields: [productInventory.productId],
    references: [products.id],
  }),
  order: one(orders, {
    fields: [productInventory.orderId],
    references: [orders.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  coupon: one(coupons, {
    fields: [orders.couponCode],
    references: [coupons.code],
  }),
  items: many(orderItems),
  deliveredContent: many(productInventory),
  referral: one(affiliateReferrals, {
    fields: [orders.id],
    references: [affiliateReferrals.orderId],
  }),
}));

export const affiliatesRelations = relations(affiliates, ({ one, many }) => ({
  user: one(users, {
    fields: [affiliates.userId],
    references: [users.id],
  }),
  referrals: many(affiliateReferrals),
  coupons: many(coupons),
  visits: many(affiliateVisits),
}));

export const affiliateVisitsRelations = relations(affiliateVisits, ({ one }) => ({
  affiliate: one(affiliates, {
    fields: [affiliateVisits.affiliateId],
    references: [affiliates.id],
  }),
  user: one(users, {
    fields: [affiliateVisits.userId],
    references: [users.id],
  }),
}));

export const affiliateReferralsRelations = relations(affiliateReferrals, ({ one }) => ({
  affiliate: one(affiliates, {
    fields: [affiliateReferrals.affiliateId],
    references: [affiliates.id],
  }),
  order: one(orders, {
    fields: [affiliateReferrals.orderId],
    references: [orders.id],
  }),
}));

export const couponsRelations = relations(coupons, ({ one }) => ({
  affiliate: one(affiliates, {
    fields: [coupons.affiliateId],
    references: [affiliates.id],
  }),
}));

export const withdrawalsRelations = relations(withdrawals, ({ one }) => ({
  affiliate: one(affiliates, {
    fields: [withdrawals.affiliateId],
    references: [affiliates.id],
  }),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type ProductInventory = typeof productInventory.$inferSelect;
export type Setting = typeof settings.$inferSelect;
