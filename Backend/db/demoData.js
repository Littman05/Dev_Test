const DEMO_ADMIN = {
  email: "admin@shopcart.com",
  password: "Admin@123",
  fullName: "Shop Admin",
  role: "admin",
};

const DEMO_USER = {
  email: "user@shopcart.com",
  password: "User@123",
  fullName: "Demo User",
  role: "user",
  phoneNumber: "9876543210",
  address: [
    {
      street: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      pinCode: "400001",
    },
  ],
};

module.exports = { DEMO_ADMIN, DEMO_USER };
