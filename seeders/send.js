import mongoose from "mongoose";
import { connectDatabase } from "../src/config/db.js";
import dotenv from "dotenv";
import Role from "../src/user/role.model.js";
import Permission from "../src/user/permission.model.js";
import Outlet from "../src/outlet/outlet.model.js";
import Product from "../src/product/product.model.js";
import Category from "../src/category/category.model.js";
import User from "../src/user/user.model.js";
import RefreshToken from "../src/user/refreshToken.model.js";

dotenv.config();

connectDatabase();

const seeder = async () => {
  try {
    await Role.deleteMany({});
    await Permission.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Outlet.deleteMany({});
    await User.deleteMany({});
    await RefreshToken.deleteMany({});

    const createPermission = new Permission({
      name: "create",
      description: "Permission untuk menulis data",
    });

    const readPermission = new Permission({
      name: "read",
      description: "Permission untuk membaca data",
    });

    const updatePermission = new Permission({
      name: "update",
      description: "Permission untuk mengubah data",
    });

    const deletePermission = new Permission({
      name: "delete",
      description: "Permission untuk menghapus data",
    });

    await createPermission.save();
    await readPermission.save();
    await updatePermission.save();
    await deletePermission.save();

    const allPermission = await Permission.find();
    const permissionId = allPermission.map((permission) => permission._id);

    const adminRole = new Role({
      name: "admin",
      permission: permissionId,
    });

    const userRole = new Role({
      name: "user",
      permission: permissionId.filter((_, index) => index < 2),
    });

    await adminRole.save();
    await userRole.save();

    const outlets = await Outlet.insertMany([
      { name: "Outlet Jakarta", location: "Jalan Sudirman" },
      { name: "Outlet Bandung", location: "Jalan Asia Afrika" },
      { name: "Outlet Malang", location: "Jalan Soekarno-Hatta" },
    ]);

    const categories = await Category.insertMany([
      { name: "Makanan" },
      { name: "Minuman" },
      { name: "Makanan Pedas" },
      { name: "Minuman Dingin" },
    ]);

    const products = [
      {
        name: "Nasi Ayam Geprek",
        price: 10,
        image: "examplenasiayamgeprek.com/image",
        categoryId: categories[2]._id,
        outletId: outlets[0]._id,
      },
      {
        name: "Nasi Ayam Campur",
        price: 20,
        image: "examplenasiayamcampur.com/image",
        categoryId: categories[0]._id,
        outletId: outlets[1]._id,
      },
      {
        name: "Es Teh Tawar",
        price: 30,
        image: "exampleestehtawar/image",
        categoryId: categories[1]._id,
        outletId: outlets[2]._id,
      },
      {
        name: "Es Pop Ice",
        price: 12,
        image: "exampleespopice.co/image",
        categoryId: categories[3]._id,
        outletId: outlets[0]._id,
      },
    ];

    await Product.insertMany(products);

    console.log("Seeder successfully");
    mongoose.connection.close();
  } catch (error) {
    console.log("Seeder error", error);
    mongoose.connection.close();
  }
};

seeder();
