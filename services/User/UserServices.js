const User = require("../../models/User");

module.exports = {

    GetOneUserLdap: async function (matricule) {
        return (await User.getOneUserFromLdap(matricule)).rows;
    }, 

    GetOneUser: async function (matricule) {

        if (!Number.isInteger(matricule)) throw ("Matricule doit être un nombre");
        return (await User.getOneUser(matricule)).rows;
    },

    GetDataPicture: async function(matricule){        
        if (!Number.isInteger(matricule)) throw ("Matricule doit être un nombre");
        return (await User.getPicture(matricule)).rows;
    },
    
    ValidateUserLogin: async function(matricule){
        return (await User.getUserAccess(matricule)).rows;
    }

};