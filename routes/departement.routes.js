
const UserController = require('../controllers/DepartController');
const router = require('express').Router();


router.get('/affiche_dep', UserController.afficherDepartements);
router.post('/add_dep', UserController.ajouterDepartement);
router.put('/update_dep/:ID', UserController.modifierDepartement);
router.delete('/delete_dep/:ID', UserController.supprimerDepartement);


module.exports = router; 