const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/search', auth, userController.searchUsers);
router.post('/contacts/add', auth, userController.addContact);

router.get('/contacts', auth, userController.getContacts);


router.delete('/contacts/delete', auth, userController.deleteContact);

module.exports = router;