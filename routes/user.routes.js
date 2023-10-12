const UserController = require('../controllers/DepartController');
const middleware = require('../middlewares/Auth.middelware');

const router = require('express').Router();

router.post('/login', UserController.Login);
router.get('/logout', UserController.Logout);

// La route /home nécessite une authentification
router.get('/home', middleware.requireAuth, (req, res) => {
  // Code pour la page d'accueil
});

router.post('/get-picture', UserController.GetPictures);

module.exports = router;
