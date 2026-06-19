const path = require("path");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const multer = require("multer");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const cartRoutes = require("./routes/cart");
const productsRoutes = require("./routes/product");
const categoriesRoutes = require("./routes/category");
const usersRoutes = require("./routes/user");
const customersRoutes = require("./routes/customer");
const ordersRoutes = require("./routes/order");

//
const MONGODB_URI = `mongodb+srv://test:EfOZwRzsOaDH0KOw@cluster0.jnncur8.mongodb.net/webDemo`;

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const fileStore = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      new Date().getTime() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

io.on("connection", (socket) => {
  console.log(`Connect ID: ${socket.id}`);

  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected!");
  });
});

app.set("io", io);

const allowedOrigins = [
  "https://your-client-app.vercel.app", // URL của Client App trên Vercel
  "https://your-admin-app.vercel.app", // URL của Admin App trên Vercel
  "http://localhost:3000", // Cho phép test dưới máy local
  "http://localhost:3001", // Cho phép test dưới máy local
];

app.use(
  cors({
    // origin: ["http://localhost:3000", "http://localhost:3001"],
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }

      return callback(new Error("CORS Policy Error"), false);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  multer({ storage: fileStore, fileFilter: fileFilter }).array("images", 5),
);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.static(path.join(__dirname, "public")));
app.use("/dist", express.static(path.join(__dirname, "dist")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production" ? true : false,
    },
  }),
);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use("/carts", cartRoutes);
app.use("/products", productsRoutes);
app.use("/categories", categoriesRoutes);
app.use("/users", usersRoutes);
app.use("/customers", customersRoutes);
app.use("/orders", ordersRoutes);

// app.use("/", async (req, res, next) => {
//   const customerId = req.session.customer._id;
//   const customer = await Customer.findById(customerId);
//   const customers = await Customer.find();
//   console.log("Customers: ", customers);
//   console.log("CustomerId: ", customerId);
//   console.log("Customer: ", customer);
// });

const errorHandler = require("./middleware/error");
const Customer = require("./models/customer");
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    httpServer.listen(PORT, () => {
      console.log(`Công kết nối BackEnd: ${PORT}`);
      console.log(`Kết nối CSDL MongoDB thành công!`);
    });
  })
  .catch((err) => {
    console.error("Lỗi kết nối MongoDB:", err);
  });
