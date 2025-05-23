import express from "express";
import dotenv from "dotenv";
import { connectDatabase } from "./config/db.js";
import morgan from "morgan";
import fs from "fs";
import helmet from "helmet";
import ProductRouter from "./product/product.route.js";
import CategoryRouter from "./category/category.route.js";
import AuthRouter from "./user/user.route.js";
import OutletRouter from "./outlet/outlet.route.js";
import OrderRouter from "./order/order.route.js";
import rateLimit from "express-rate-limit";

dotenv.config();

connectDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again after 15 minutes",
});

app.use(express.json());
app.use(morgan("dev"));
app.use(limiter);
app.use(
  morgan("common", {
    stream: fs.createWriteStream("./access.log", { flags: "a" }),
  })
);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/products", ProductRouter);
app.use("/api/v1/categories", CategoryRouter);
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/outlets", OutletRouter);
app.use("/api/v1/orders", OrderRouter);

app.listen(PORT, () => {
  console.log("Server started at http://localhost:5000");
});
