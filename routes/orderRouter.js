const Router = require("express");
const router = new Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/create", authMiddleware, orderController.create);
router.delete("/delete", authMiddleware, orderController.delete);
router.get("/userOrders", authMiddleware, orderController.getAllOfUser);
router.get("/userOrders/:id", authMiddleware, orderController.getOne);
router.get("/allOrders", checkRole("ADMIN"), orderController.getAll);
router.put("/update", checkRole("ADMIN"), orderController.updateStatus);

module.exports = router;
