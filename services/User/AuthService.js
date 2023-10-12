const UserServices = require("./UserServices");
const ldap = require('ldapjs');

module.exports = {
    /**
     * se connecter avec ldap 
     * @param {*} matricule
     * @param {*} password
     */
    AuthLogin: async function (matricule, password) {
        
        var client = ldap.createClient({
            url: 'ldap://easytech.mg',
            reconnect: false
        });

        client.on('error', function (err) {
           return new Error("Access refusée, "+ err);
        });       

        let UserConnected = await this.BindClient(client, matricule, password);
        // console.log(UserConnected)
        
        if (UserConnected || UserConnected[0]) {
            let userFetched = null;
            if(Array.isArray(UserConnected)){
                if(UserConnected[0].id_departement === '12'){
                    return UserConnected;
                } 
                else if(UserConnected[0] && UserConnected[0].id_departement !== '12'){
                    userFetched = await UserServices.ValidateUserLogin(parseInt(UserConnected[0].matricule));
                }                           
            }
             else{
                if(UserConnected.id_departement === '12'){
                    return UserConnected;
                }
                userFetched = await UserServices.ValidateUserLogin(parseInt(UserConnected.matricule));
             }
            console.log("userFetched ===> ", userFetched)
            // console.log("USER RETOUR C", UserConnected);
            return UserConnected;            
        }
        else{
            throw new Error("Access refusée");
        }
    },


    /**
     * se connecter avec ldap 
     * @param {*} client 
     * @param {*} matricule
     * @param {*} password
     */
    //test ldapServer
    BindClient: async function (client, matricule, password) {
        return new Promise((resolve, reject) => {
            try {
                let UserConnected = {}
                client.bind('EASYTECH\\' + matricule, password, async function (err) {
                    if (err) {
                        console.log(err)
                        resolve(null)
                    } else {
                        UserConnected = await UserServices.GetOneUserLdap(matricule)
                        resolve(UserConnected)
                    }
                });
            } catch (e) {
                console.log(e)
                // reject(e)
            }
        })
    },

};