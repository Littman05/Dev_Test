const Product = require("../models/product.model");
const Category = require("../models/category.model");
const Brand = require("../models/brand.model");
const User = require("../models/user.model");
const Order = require("../models/order.model");
const categoryData = require("../category.json");
const brandData = require("../brand.json");
const sampleProducts = require("./sampleProducts");
const { DEMO_ADMIN, DEMO_USER } = require("./demoData");

function discountedPrice(product, quantity) {
  return (
    Math.floor(((100 - product.discountPercentage) / 100) * product.price) *
    quantity
  );
}

function buildOrderItem(product, quantity, status) {
  const variation = product.variations[0];
  const color = variation.colors[0];

  return {
    product: product._id,
    quantity,
    color: color.color,
    colorCode: color.colorCode,
    size: variation.size,
    status,
  };
}

function buildCartItem(product, quantity = 1) {
  const variation = product.variations[0];
  const color = variation.colors[0];

  return {
    product: product._id,
    quantity,
    color: color.color,
    colorCode: color.colorCode,
    size: variation.size,
  };
}

async function seedCatalogIfEmpty() {
  const [productCount, categoryCount, brandCount] = await Promise.all([
    Product.countDocuments(),
    Category.countDocuments(),
    Brand.countDocuments(),
  ]);

  if (categoryCount === 0) {
    await Category.insertMany(categoryData);
    console.log("Seeded categories");
  }

  if (brandCount === 0) {
    await Brand.insertMany(brandData);
    console.log("Seeded brands");
  }

  if (productCount === 0) {
    await Product.insertMany(sampleProducts);
    console.log(`Seeded ${sampleProducts.length} sample products`);
  }
}

async function reseedCatalog() {
  await Promise.all([
    Product.deleteMany({}),
    Category.deleteMany({}),
    Brand.deleteMany({}),
  ]);

  await Category.insertMany(categoryData);
  await Brand.insertMany(brandData);
  await Product.insertMany(sampleProducts);

  console.log(`Re-seeded ${sampleProducts.length} sample products`);
  console.log(`Re-seeded ${categoryData.length} categories and ${brandData.length} brands`);
}

async function seedDemoUsers() {
  let admin = await User.findOne({ email: DEMO_ADMIN.email });

  if (!admin) {
    admin = await User.create(DEMO_ADMIN);
    console.log("Seeded admin user:", DEMO_ADMIN.email);
  } else if (admin.role !== "admin") {
    admin.role = "admin";
    await admin.save();
    console.log("Updated existing user to admin:", DEMO_ADMIN.email);
  }

  let demoUser = await User.findOne({ email: DEMO_USER.email });

  if (!demoUser) {
    demoUser = await User.create(DEMO_USER);
    console.log("Seeded demo user:", DEMO_USER.email);
  }

  return { admin, demoUser };
}

async function seedDemoUserActivity(demoUser, force = false) {
  if (!demoUser) {
    return;
  }

  const hasCart = demoUser.cart?.length > 0;
  const hasWishlist = demoUser.wishlist?.length > 0;

  if (!force && hasCart && hasWishlist) {
    return;
  }

  const products = await Product.find({ deleted: { $ne: true } }).limit(4);
  if (products.length < 2) {
    return;
  }

  demoUser.cart = [
    buildCartItem(products[0], 2),
    buildCartItem(products[1], 1),
  ];
  demoUser.wishlist = [products[2]._id, products[3]._id].filter(Boolean);
  await demoUser.save({ validateBeforeSave: false });

  console.log("Seeded demo user cart (2 items) and wishlist (2 items)");
}

async function reseedDemoData() {
  const demoEmails = [DEMO_ADMIN.email, DEMO_USER.email];
  const demoUsers = await User.find({ email: { $in: demoEmails } }).select("_id");
  const demoUserIds = demoUsers.map((user) => user._id);

  if (demoUserIds.length > 0) {
    await Order.deleteMany({ user: { $in: demoUserIds } });
  }

  await User.deleteMany({ email: { $in: demoEmails } });
  console.log("Reset demo users and their orders");

  const { demoUser } = await seedDemoUsers();
  await seedSampleOrders(demoUser, true);
  await seedDemoUserActivity(demoUser, true);
}

async function reseedAll() {
  await reseedCatalog();
  await reseedDemoData();
}

async function seedSampleOrders(demoUser, force = false) {
  if (!demoUser) {
    return;
  }

  const orderCount = await Order.countDocuments({
    user: demoUser._id,
  });

  if (orderCount > 0 && !force) {
    return;
  }

  if (force) {
    await Order.deleteMany({ user: demoUser._id });
  }

  const products = await Product.find({ deleted: { $ne: true } }).limit(3);
  if (products.length < 2) {
    return;
  }

  const [productA, productB, productC] = products;
  const orderOneItems = [buildOrderItem(productA, 2, "pending")];
  const orderTwoItems = [buildOrderItem(productB, 1, "dispatched")];
  const orderThreeItems = [
    buildOrderItem(productA, 1, "delivered"),
    buildOrderItem(productC || productB, 1, "delivered"),
  ];

  const orders = await Order.insertMany([
    {
      user: demoUser._id,
      billingName: demoUser.fullName,
      email: demoUser.email,
      items: orderOneItems,
      phoneNumber: demoUser.phoneNumber,
      address: demoUser.address[0],
      paymentMethod: "card",
      totalAmount: discountedPrice(productA, 2),
      totalItems: 2,
      paymentStatus: "fulfilled",
    },
    {
      user: demoUser._id,
      billingName: demoUser.fullName,
      email: demoUser.email,
      items: orderTwoItems,
      phoneNumber: demoUser.phoneNumber,
      address: demoUser.address[0],
      paymentMethod: "cash",
      totalAmount: discountedPrice(productB, 1),
      totalItems: 1,
      paymentStatus: "pending",
    },
    {
      user: demoUser._id,
      billingName: demoUser.fullName,
      email: demoUser.email,
      items: orderThreeItems,
      phoneNumber: demoUser.phoneNumber,
      address: demoUser.address[0],
      paymentMethod: "card",
      totalAmount:
        discountedPrice(productA, 1) +
        discountedPrice(productC || productB, 1),
      totalItems: 2,
      paymentStatus: "fulfilled",
    },
  ]);

  demoUser.orderHistory = orders.map((order) => order._id);
  await demoUser.save({ validateBeforeSave: false });

  console.log(`Seeded ${orders.length} sample orders`);
}

async function seedDatabaseIfEmpty() {
  await seedCatalogIfEmpty();
  const { demoUser } = await seedDemoUsers();
  await seedSampleOrders(demoUser);
  await seedDemoUserActivity(demoUser);
}

module.exports = {
  seedDatabaseIfEmpty,
  reseedDemoData,
  reseedAll,
  DEMO_ADMIN,
  DEMO_USER,
};
