const Router = require("express");
const router = new Router();
const orderTypeController = require("../controllers/orderTypeController");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", checkRole("ADMIN"), orderTypeController.create);
router.patch("/:id", checkRole("ADMIN"), orderTypeController.update);
router.get("/", orderTypeController.getAll);
router.delete("/:id", checkRole("ADMIN"), orderTypeController.delete);

module.exports = router;
