import express from "express";
import dotenv from "dotenv";
import { connectDatabase } from "./config/db.js";
import ProductRouter from "./routes/product.route.js";
import CategoryRouter from "./routes/category.route.js";
import AuthRouter from "./user/user.route.js";
import OutletRouter from "./routes/outlet.route.js";
import OrderRouter from "./routes/order.route.js";

dotenv.config();

connectDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/products", ProductRouter);
app.use("/api/categories", CategoryRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/outlet", OutletRouter);
app.use("/api/order", OrderRouter);

app.listen(PORT, () => {
  console.log("Server started at http://localhost:5000");
});
