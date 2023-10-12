const { pool, poolGPAO } = require("../config/db");
//   WHERE  id_pers=$1

module.exports = {

    getUserAccess: function (matricule) {
        let request = `
        SELECT matricule, nom, prenom, r_departement.libelle AS departement
        FROM r_personnel
        JOIN r_departement ON r_personnel.id_departement = r_departement.id
        WHERE (id_departement = 12 OR id_departement = 36) AND actif = 'true' AND id_pers = $1;
        
        `;
        let params = [matricule];
        return pool.query(request, params);
    },

    getOneUserFromLdap: function (matricule) {

        let request = `
        SELECT matricule, nom, prenom, r_departement.libelle AS departement
        FROM r_personnel
        JOIN r_departement ON r_personnel.id_departement = r_departement.id
        WHERE (id_departement = 12 OR id_departement = 36) AND actif = 'true' AND id_pers = $1;
        
        `;

        let params = [matricule];

        return pool.query(request, params);

    },
    getOneUser: function (matricule) {

        let request = `
        SELECT matricule, nom, prenom, r_departement.libelle AS departement
        FROM r_personnel
        JOIN r_departement ON r_personnel.id_departement = r_departement.id
        WHERE (id_departement = 12 OR id_departement = 36) AND actif = 'true' AND id_pers = $1;
        
        `;

        let params = [matricule];

        return pool.query(request, params);

    },

    getPicture: function (matricule) {

        let request = `
SELECT matricule, nom, prenom,r_departement.libelle AS departement
FROM r_personnel
JOIN r_departement ON r_personnel.id_departement = r_departement.id
WHERE  id_pers=$1
        `;

        let params = [matricule];

        return poolGPAO.query(request, params);
    }
};