const Router = require('express');
const router = new Router();
const tagController = require('../controllers/tagController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', checkRole('ADMIN'), tagController.create);
router.patch('/:id', checkRole('ADMIN'), tagController.update);
router.get('/', tagController.getAll);
router.delete('/:id', checkRole('ADMIN'), tagController.delete);

module.exports = router;
