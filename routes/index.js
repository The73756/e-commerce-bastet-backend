const Router = require("express");
const router = new Router();
const userRouter = require("./userRouter");
const productRouter = require("./productRouter");
const brandRouter = require("./brandRouter");
const typeRouter = require("./typeRouter");
const basketRouter = require("./basketRouter");
const favoriteRouter = require("./favoriteRouter");
const orderRouter = require("./orderRouter");
const ratingRouter = require("./ratingRouter");

router.use("/user", userRouter);
router.use("/type", typeRouter);
router.use("/brand", brandRouter);
router.use("/product", productRouter);
router.use("/basket", basketRouter);
router.use("/favorite", favoriteRouter);
router.use("/order", orderRouter);
router.use("/rating", ratingRouter);

module.exports = router;
