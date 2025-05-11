const Router = require("express");
const router = new Router();
const orderStatusController = require("../controllers/orderStatusController");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", checkRole("ADMIN"), orderStatusController.create);
router.patch("/:id", checkRole("ADMIN"), orderStatusController.update);
router.get("/", orderStatusController.getAll);
router.delete("/:id", checkRole("ADMIN"), orderStatusController.delete);

module.exports = router;
