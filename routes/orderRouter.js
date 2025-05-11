const Router = require("express");
const router = new Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", authMiddleware, orderController.create);
router.get("/", checkRole("ADMIN"), orderController.getAll);
router.patch("/:id", checkRole("ADMIN"), orderController.updateStatus);
router.delete("/:id", authMiddleware, orderController.delete);
router.get("/:id", authMiddleware, orderController.getOne);
router.get("/user-orders/:userId", authMiddleware, orderController.getAllOfUser);

module.exports = router;
