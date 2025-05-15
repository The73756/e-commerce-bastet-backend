const Router = require("express");
const router = new Router();
const basketController = require("../controllers/basketController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, basketController.create);
router.delete("/:id", authMiddleware, basketController.delete);
router.get("/:basketId", authMiddleware, basketController.getAll);
router.patch("/:id", authMiddleware, basketController.update);
router.post("/clear", authMiddleware, basketController.clearAll);

module.exports = router;
