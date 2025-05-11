const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.patch('/:id', authMiddleware, userController.update);
router.delete('/:id', authMiddleware, userController.delete);
router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/auth', authMiddleware, userController.check);

module.exports = router;
