const AuthServices = require("../services/User/AuthService");
const UserServices = require("../services/User/UserServices");
const EquipeServices = require("../services/Equipe/EquipeServices");
const jwt = require('jsonwebtoken')
const maxAge = 1 * 24 * 60 * 60 * 1000
const { pool } = require('../config/db');
const createToken = (id) => {
  return jwt.sign({ id }, 'dsjfdfcsfjpsdfjgdfugjsdffijdsudfdhdisufhgdufhgiufhsipfuhcsdh', { expiresIn: maxAge })
}

module.exports = {
    afficherEquipes: async (req, res) => {
        const response = {
            status: "ok",
            data: null,
            message: "",
            error: null
        };
        try {
            const matricule = req.query.matricule;

            let histoEquipe = await EquipeServices.AfficheEquipe(matricule);
            response.data = histoEquipe;
            return res.json(response);
        } catch (error) {
            response.status = "ko";
            response.message = "Une erreur est survenue lors de la récupération des équipes.";
            response.error = error.message;
            return res.json(response);
        }
        
    },
    getEquipeLibelle: async (req, res) => {
        const response = {
            status: "ok",
            data: null,
            message: "",
            error: null
        };
        try {
            const histoEquipe = await EquipeServices.getEquipeLibelle();
            response.data = histoEquipe;
            return res.json(response);
        } catch (error) {
            response.status = "ko";
            response.message = "Une erreur est survenue lors de la récupération des équipes.";
            response.error = error.message;
            return res.json(response);
        }
        
    },

    ajouterEquipe: async (req, res) => {
        const { id_old, id_new, date, heure, id_pers } = req.body;
        try {
            await EquipeServices.AjoutEquipe(req.body);
            res.status(200).send('L\'équipe a été ajoutée avec succès.');
        } catch (error) {
            console.error(error);
            res.status(500).send('Une erreur est survenue lors de l\'ajout de l\'équipe.');
        }
    },

    modifierEquipe: async (req, res) => {
        const { ID } = req.params;
        const { id_old, id_new, date } = req.body;
        try {
            await EquipeServices.ModifieEquipe({ ID, id_old, id_new, date });
            res.status(200).send('L\'équipe a été modifiée avec succès.');
        } catch (error) {
            console.error(error);
            res.status(500).send('Une erreur est survenue lors de la modification de l\'équipe.');
        }
    },

    supprimerEquipe: async (req, res) => {
        try {
            const { ID } = req.params;
            await EquipeServices.SupprEquipe(ID);
            res.status(200).send('Suppression réussie');
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Une erreur est survenue lors de la suppression de l\'équipe.' });
        }
    },
};
