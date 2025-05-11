const Router = require("express");
const router = new Router();
const ratingController = require("../controllers/ratingController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, ratingController.create);
router.get("/:userId", authMiddleware, ratingController.getAllByUser);
router.get("/:userId/:productId", authMiddleware, ratingController.getOne);
router.delete("/:id", authMiddleware, ratingController.delete);

module.exports = router;
