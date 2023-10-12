const EquipeController = require('../controllers/EquipeController');
const router = require('express').Router();

router.get('/affiche_equipe', EquipeController.afficherEquipes);
router.get('/getLibelle', EquipeController.getEquipeLibelle);
router.post('/add_equipe', EquipeController.ajouterEquipe);
router.put('/update_equipe/:ID', EquipeController.modifierEquipe);
router.delete('/delete_equipe/:ID', EquipeController.supprimerEquipe);

module.exports = router;
