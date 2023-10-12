const { pool } = require("../config/db");
module.exports = {

  queryAfficheEquipe: function (matricule) {

    let request = `
    SELECT id, id_pers, id_old, id_new, libelle_old, libelle_new, nom, prenom, to_char(date_basculement, 'YYYY-MM-DD') AS date_basculement, heure
FROM (
    SELECT
        r_equipe_hist.id,
        r_equipe_hist.id_old,
        r_equipe_hist.id_new,
        r_equipe_hist.date,
        r_equipe_hist.heure,
        r_equipe_hist.id_pers,
        CASE
            WHEN r_equipe_hist.id_old = -1 OR r_equipe_hist.id_old = 0 THEN r_eq.libelle
            ELSE r_eq.libelle
        END AS libelle_old,
        r_equipe_new.libelle AS libelle_new,
        r_pers.nom,
        r_pers.prenom,
        DATE(r_equipe_hist.date) AS date_basculement,
        ROW_NUMBER() OVER (PARTITION BY r_equipe_hist.id_pers, r_equipe_new.libelle ORDER BY DATE(r_equipe_hist.date) ASC) AS row_num
    FROM
        r_equipe_historique r_equipe_hist
        LEFT JOIN r_equipe r_eq ON (r_equipe_hist.id_old = r_eq.id_equipe)
        LEFT JOIN r_equipe r_equipe_new ON (r_equipe_hist.id_new = r_equipe_new.id_equipe)
        JOIN r_personnel r_pers ON (r_equipe_hist.id_pers = r_pers.id_pers)
    WHERE
        r_equipe_hist.id_pers = ${matricule}
) AS subquery
WHERE row_num = 1
ORDER BY id_pers, date ASC;

    `;
    return pool.query(request);
},

getLibelleEquipes: async function () {
    let request = `
      SELECT id_equipe, libelle
      FROM r_equipe
    `;

    const result = await pool.query(request);
  
    const libelleEquipes = [];
    for (const row of result.rows) {
      libelleEquipes.push({ id: row.id_equipe, libelle: row.libelle });
    }
  
    return libelleEquipes;
},


queryAjoutEquipe: function (data) {
  const { id_old, id_new, date, heure, id_pers } = data;
  const getMaxIdQuery = 'SELECT MAX("id") AS max_id FROM r_equipe_historique';
  
  return new Promise((resolve, reject) => {
      pool.query(getMaxIdQuery, (error, results) => {
          if (error) {
              console.error(error);
              reject('Erreur lors de la récupération du maximum de "id"');
          } else {
              const lastId = parseInt(results.rows[0].max_id, 10) || 0;
              const newId = lastId + 1;
              const insertQuery = 'INSERT INTO r_equipe_historique ("id", "id_old", "id_new", "date", "heure", "id_pers") VALUES ($1, $2, $3, $4, $5, $6)';

              pool.query(insertQuery, [newId, id_old, id_new, date, heure, id_pers], (error, results) => {
                  if (error) {
                      reject('Erreur lors de l\'insertion de l\'équipe');
                  } else {
                      resolve('Msg depuis le modèle : L\'équipe a été ajoutée avec succès');
                  }
              });
          }
      });
  });
},


queryModifEquipe: function (data) {
  const { ID, id_old, id_new, date } = data;
  
  return new Promise((resolve, reject) => {
      let updateQuery = `
          UPDATE r_equipe_historique
          SET "id_old" = $2, "id_new" = $3, "date" = $4
          WHERE "id" = $1
      `;

      pool.query(updateQuery, [ID, id_old, id_new, date], (error, results) => {
          if (error) {
              console.error(error);
              reject('Erreur lors de la mise à jour dans la table r_equipe_historique');
          } else {
              resolve('Mise à jour réussie');
          }
      });
  });
},


querySupprEquipe: function (ID) {
  let request = `
      DELETE FROM r_equipe_historique
      WHERE "id" = $1
  `;
  let params = [ID];
  
  return pool.query(request, params);
},



};