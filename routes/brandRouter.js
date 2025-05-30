const Router = require('express');
const router = new Router();
const brandController = require('../controllers/brandController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', checkRole('ADMIN'), brandController.create);
router.patch('/:id', checkRole('ADMIN'), brandController.update);
router.get('/', brandController.getAll);
router.delete('/:id', checkRole('ADMIN'), brandController.delete);

module.exports = router;
