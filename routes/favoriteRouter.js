const Router = require("express");
const router = new Router();
const favoriteController = require("../controllers/favoriteController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, favoriteController.create);
router.delete("/", authMiddleware, favoriteController.delete);
router.get("/", authMiddleware, favoriteController.getAll);

module.exports = router;
