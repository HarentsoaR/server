const Departement = require("../../models/ModelDepart");
 
module.exports = {

    AfficheDep: async function (matricule) {
        return (await Departement.queryAffiche(matricule)).rows;
    }, 

    AjoutDep: async function (data) {
        try {
          const result = await Departement.queryAjout(data);
          return result;
        } catch (error) {
          throw error;
        }
      },

    ModifieDep: async function (data) {
        try {
            const result = await Departement.queryModif(data);
            return result;
          } catch (error) {
            throw error;
          }
    }, 

    SupprDep: async function (ID) {
        await Departement.querySuppr(ID);
        return 'Suppression réussie';
      },

};