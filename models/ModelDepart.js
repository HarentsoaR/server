const { pool } = require("../config/db");
module.exports = {

    queryAffiche: function (matricule) {

        let request = `
        SELECT id, id_pers, id_old, id_new, libelle_old, libelle_new, nom, prenom, to_char(date_basculement,'YYYY-MM-DD') AS date_basculement
        FROM (
          SELECT
              r_dep_hist.id,
              r_dep_hist.id_pers,
              r_dep_hist.id_old,
              r_dep_hist.id_new,
              CASE
               WHEN r_dep_hist.id_old = -1 OR r_dep_hist.id_old = 0 THEN r_dep_new.libelle
                  ELSE r_dep.libelle
              END AS libelle_old,
              r_dep_new.libelle AS libelle_new,
              r_pers.nom,
              r_pers.prenom,
              DATE(r_dep_hist.date) AS date_basculement,
              ROW_NUMBER() OVER (PARTITION BY r_dep_hist.id_pers, r_dep_new.libelle ORDER BY DATE(r_dep_hist.date) ASC) AS row_num
          FROM
              r_departement_historique r_dep_hist
              LEFT JOIN r_departement r_dep ON (r_dep_hist.id_old = r_dep.id)
              LEFT JOIN r_departement r_dep_new ON (r_dep_hist.id_new = r_dep_new.id)
              JOIN r_personnel r_pers ON (r_dep_hist.id_pers = r_pers.id_pers)
          WHERE
          r_dep_hist.id_pers = ${matricule}
        ) AS subquery
        WHERE row_num = 1
        ORDER BY id_pers, date_basculement ASC;
        `;

        return pool.query(request);
    },

    queryAjout: function (data) {
        const { id_old, id_new, date, heure, id_pers } = data;
        const getMaxIdQuery = 'SELECT MAX("id") AS max_id FROM r_departement_historique';
        return new Promise((resolve, reject) => {
          pool.query(getMaxIdQuery, (error, results) => {
            if (error) {
              console.error(error);
              reject('Erreur lors de la récupération du maximum de "id"');
            } else {
              const lastId = parseInt(results.rows[0].max_id, 10) || 0;
              const newId = lastId + 1;
              const insertQuery = 'INSERT INTO r_departement_historique ("id", "id_old", "id_new", "date", "heure", "id_pers") VALUES ($1, $2, $3, $4, $5, $6)';
    
              pool.query(insertQuery, [newId, id_old, id_new, date, heure, id_pers], (error, results) => {
                if (error) {
              
                  reject('Erreur lors de l\'insertion du département');
                } else {
                  resolve('Msg depui le model : Le département a été ajouté avec succès');
                }
              });
            }
          });
        });
        
      },

      queryModif: function (data) {
        const { ID, id_old, id_new, date } = data;
        return new Promise((resolve, reject) => {
          let updateQuery = `
            UPDATE r_departement_historique
            SET "id_old" = $2, "id_new" = $3, "date" = $4
            WHERE "id" = $1
          `;
    
          pool.query(updateQuery, [ID, id_old, id_new, date], (error, results) => {
            if (error) {
              console.error(error);
              reject('Erreur lors de la mise à jour dans la table r_departement_historique');
            } else {
              resolve('Mise à jour réussie');
            }
          });
        });
      },

    querySuppr: function (ID) {
        let request = `
        DELETE FROM r_departement_historique
        WHERE "id" = $1
        `;
        let params = [ID];
        return pool.query(request, params);

    },


};