const Equipe = require("../../models/ModelEquipe");

module.exports = {
    AfficheEquipe: async function (matricule) {
        return (await Equipe.queryAfficheEquipe(matricule)).rows;
    },

    getEquipeLibelle: async function () {
        const histoEquipe = await Equipe.getLibelleEquipes();
        return histoEquipe;
      },

    AjoutEquipe: async function (data) {
        try {
            const result = await Equipe.queryAjoutEquipe(data);
            return result;
        } catch (error) {
            throw error;
        }
    },

    ModifieEquipe: async function (data) {
        try {
            const result = await Equipe.queryModifEquipe(data);
            return result;
        } catch (error) {
            throw error;
        }
    },

    SupprEquipe: async function (ID) {
        await Equipe.querySupprEquipe(ID);
        return 'Suppression réussie';
    },

};
