const Router = require("express");
const router = new Router();
const userRouter = require("./userRouter");
const productRouter = require("./productRouter");
const brandRouter = require("./brandRouter");
const typeRouter = require("./typeRouter");
const orderTypeRouter = require("./orderTypeRouter");
const orderStatusRouter = require("./orderStatusRouter");
const basketRouter = require("./basketRouter");
const favoriteRouter = require("./favoriteRouter");
const orderRouter = require("./orderRouter");
const ratingRouter = require("./ratingRouter");
const tagRouter = require("./tagRouter");

router.use("/user", userRouter);
router.use("/type", typeRouter);
router.use("/order-type", orderTypeRouter);
router.use("/order-status", orderStatusRouter);
router.use("/tag", tagRouter);
router.use("/brand", brandRouter);
router.use("/product", productRouter);
router.use("/basket", basketRouter);
router.use("/favorite", favoriteRouter);
router.use("/order", orderRouter);
router.use("/rating", ratingRouter);

module.exports = router;
