const Router = require("express");
const router = new Router();
const petController = require("../controllers/petController");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", checkRole("ADMIN"), petController.create);
router.get("/", petController.getAll);
router.delete("/", checkRole("ADMIN"), petController.delete);

module.exports = router;
