const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/Auth");
// const userRoute = require("./routes/User");
// const orderRoute = require("./routes/Order");
// const cartRoute = require("./routes/Cart");
const productRoute = require("./routes/Product");
// const favRoute = require("./routes/Fav");
// const categoryRoute = require("./routes/Category");
// const reviewsRoute = require("./routes/Review");
const cors = require("cors");
dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });


  app.use(cors());
  app.use(express.json());
  app.use("/api/auth", authRoute);
  // app.use("/api/user", userRoute);
  // app.use("/api/orders", orderRoute);
  // app.use("/api/carts", cartRoute);
  app.use("/api/products", productRoute);
  // app.use("/api/favs", favRoute);
  // app.use("/api/category", categoryRoute);
  // app.use("/api/review", reviewsRoute);




  app.listen(process.env.PORT || 5000, () => {
    console.log(`Backend server is running! Connected to Port ${process.env.PORT || 5000}`);
  });

  

