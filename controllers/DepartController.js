const AuthServices = require("../services/User/AuthService");
const UserServices = require("../services/User/UserServices");
const DepartementServices = require("../services/Departement/DepartementServices");
const jwt = require('jsonwebtoken')
const maxAge = 1 * 24 * 60 * 60 * 1000
const { pool } = require('../config/db');
const createToken = (id) => {
  return jwt.sign({ id }, 'dsjfdfcsfjpsdfjgdfugjsdffijdsudfdhdisufhgdufhgiufhsipfuhcsdh', { expiresIn: maxAge })
}


module.exports = {

  afficherDepartements: async (req, res) => {
    const response = {
      status: "ok",
      data: null,
      message: "",
      error: null
    };
    try {
      const matricule = req.query.matricule;

      let histoDepartement = await DepartementServices.AfficheDep(matricule);
      // console.log(histoDepartement);
      response.data = histoDepartement;
      return res.json(response);
    } catch (error) {
      response.status = "ko";
      response.message = "Une erreur est survenue lors de la récupération des départements.";
      response.error = error.message;
      return res.json(response);
    }
  },

  ajouterDepartement: async (req, res) => {
    const { id_old, id_new, date, heure, id_pers } = req.body;
    try {
      await DepartementServices.AjoutDep(req.body);
      res.status(200).send('Msg: Controlleur Le département a été ajouté avec succès.');
    } catch (error) {
      console.error(error);
      res.status(500).send('Une erreur est survenue lors de l\'ajout du département.');
    }
  },
  

  modifierDepartement: async (req, res) => {
    const { ID } = req.params;
    const { id_old, id_new, date } = req.body;
    try {
      await DepartementServices.ModifieDep({ ID, id_old, id_new, date });
      res.status(200).send('Le département a été modifié avec succès.');
    } catch (error) {
      console.error(error);
      res.status(500).send('Une erreur est survenue lors de la modification du département.');
    }
  },
  
  supprimerDepartement: async (req, res) => {
    try {
      const { ID } = req.params;
      await DepartementServices.SupprDep(ID);
      res.status(200).send('Suppression réussie');
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Une erreur est survenue lors de la suppression du département.' });
    }
  },
  


  Login: async function (req, res) {
    const response = {
      status: "undefined",
      data: {},
      message: "",
      error: ""
    };
  
    try {
      const { matricule, password } = req.body;
      const userConnected = await AuthServices.AuthLogin(matricule, password);
  
      if (!userConnected) {
        response.status = "ko";
        response.error = 'Invalid credentials';
      } else {
        response.status = "ok";
        response.data = userConnected;
        
        // Assuming 'createToken' and 'maxAge' are defined elsewhere
        const token = createToken(userConnected[0].id_pers);
        res.cookie('historique_depart', token, { httpOnly: true, maxAge });
      }
  
      return res.json(response);
    } catch (error) {
      console.error('Error in login:', error);
      response.status = "ko";
      response.message = "An error occurred during login";
      response.error = error.message;
      return res.json(response);
    }
  },
  

  Logout: (req, res) => {
      res.cookie('bnf', '', { maxAge: 1 })
      res.redirect('/bnf/pages/login/login3')
  },


  GetPictures: async (req, res) => {
      try {
          const { matricule } = req.body
          let dataPicture = await UserServices.GetDataPicture(parseInt(matricule))
          res.status(200).send(dataPicture)
      } catch (e) {
          console.log(e)
      }
  },
};

