const express = require('express');
const userController = require('../controllers/userController');
const petController = require('../controllers/petController');
const checkAuth = require('../middleware/auth');

const router = express.Router();

// User Auth
router.post('/register', userController.create);
router.post('/login', userController.login);
router.get('/logout', userController.logout);

// Pet CRUD (protected routes)
router.get('/pets', checkAuth, petController.getPets);
router.post('/pets', checkAuth, petController.addPet);
router.put('/pets/:id', checkAuth, petController.updatePet);
router.delete('/pets/:id', checkAuth, petController.deletePet);

module.exports = router;
