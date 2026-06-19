const request = require("supertest");
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");

const customerRouter = require("../routes/customer");
const orderRouter = require("../routes/order");

const Customer = require("../models/customer");
const Product = require("../models/product");
const Order = require("../models/order");

jest.mock("../models/customer");
jest.mock("../models/product");
jest.mock("../models/order");

const app = express();
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

app.use("/customers", customerRouter);
app.use("/orders", orderRouter);

// BẮT ĐẦU SUITE TEST
describe("Backend API Integration Tests", () => {
  let agent;

  beforeEach(() => {
    jest.clearAllMocks();
    // Dùng supertest.agent để tự động duy trì và gửi Cookie (Session) qua lại giữa các request
    agent = request.agent(app);
  });

  // ================================================
  // 1. TEST LOGIN
  // ================================================
  describe("POST /customers/login", () => {
    it("should login successfully with correct credentials", async () => {
      // Giả lập tìm thấy khách hàng trong DB
      const mockCustomer = {
        _id: new mongoose.Types.ObjectId(),
        fullname: "Test Customer",
        email: "customer@test.com",
        password: "hashed_password_123",
        phone: "0123456789",
        address: "Hanoi",
        status: "Active",
        cart: [],
        save: jest.fn().mockResolvedValue(true),
      };

      Customer.findOne.mockResolvedValue(mockCustomer);

      // Giả lập thư viện bcrypt.compare trả về true
      const bcrypt = require("bcryptjs");
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

      const res = await agent
        .post("/customers/login")
        .send({ email: "customer@test.com", password: "correct_password" });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toContain("Login Successfully!");
      expect(res.body.customer).toHaveProperty("email", "customer@test.com");
    });

    it("should fail with incorrect credentials", async () => {
      Customer.findOne.mockResolvedValue(null); // Không tìm thấy email

      const res = await agent
        .post("/customers/login")
        .send({ email: "wrong@test.com", password: "bad" });

      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toContain("Email Not Found!");
    });
  });

  // ================================================
  // 2. TEST ĐẶT HÀNG (POST /orders/create)
  // ================================================
  describe("POST /orders/create", () => {
    it("should deny access if customer is not logged in", async () => {
      // Không qua bước login, gọi thẳng route cần middleware isAuth
      const res = await agent
        .post("/orders/create")
        .send({ fullname: "Giao Hang" });

      expect(res.statusCode).toBe(401);
    });

    it("should create order successfully when logged in and cart is valid", async () => {
      // Bước A: Giả lập đăng nhập để có Session
      const customerId = new mongoose.Types.ObjectId();
      const mockCustomer = {
        _id: customerId,
        fullname: "Customer A",
        email: "customer@test.com",
        password: "hashed",
        status: "Active",
        cart: [
          {
            productId: new mongoose.Types.ObjectId(),
            quantity: 2,
            priceAt: 50000,
          },
        ],
        save: jest.fn().mockResolvedValue(true),
      };
      Customer.findOne.mockResolvedValue(mockCustomer);
      Customer.findById.mockResolvedValue(mockCustomer);

      const bcrypt = require("bcryptjs");
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

      // Kích hoạt session login
      await agent
        .post("/customers/login")
        .send({ email: "customer@test.com", password: "12" });

      // Bước B: Giả lập kiểm tra tồn kho mặt hàng (Product.findById)
      const mockProduct = {
        _id: mockCustomer.cart[0].productId,
        name: "Product Test",
        status: "Active",
        stock: 10,
        save: jest.fn().mockResolvedValue(true),
      };
      Product.findById.mockResolvedValue(mockProduct);

      // Giả lập lưu đơn hàng mới thành công
      Order.prototype.save = jest.fn().mockResolvedValue(true);

      // Bước C: Tiến hành Checkout
      const res = await agent.post("/orders/create").send({
        fullname: "Nguyen Van A",
        email: "customer@test.com",
        phone: "09090909",
        address: "123 Chợ Lách, Vĩnh Long",
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toContain("Create Order Successfully!");
      expect(mockProduct.stock).toBe(8); // Tồn kho giảm từ 10 xuống 8
      expect(mockCustomer.cart.length).toBe(0); // Giỏ hàng bị xóa sạch sau khi mua
    });
  });

  // ================================================
  // 3. TEST PHÂN QUYỀN ADMIN (DELETE /customers/:customerId)
  // ================================================
  describe("DELETE /customers/:customerId", () => {
    it("should deny delete if user is not Admin", async () => {
      // Giả lập tài liệu Auth bình thường (Không có quyền Admin trong Session)
      // Gọi thẳng API xóa
      const res = await agent.delete(
        `/customers/${new mongoose.Types.ObjectId()}`,
      );

      expect(res.statusCode).toBe(403); // Access Denied từ middleware isAdmin
    });
  });
});
