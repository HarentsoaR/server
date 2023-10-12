const jwt = require('jsonwebtoken');
const UserServices = require("../services/User/UserServices");

module.exports = {


    requireAuth: async (req, res, next) => {
        const token = req.cookies.bnf

        if (token) {
            jwt.verify(token, 'dsjfdfcsfjpsdfjgdfugjsdffijdsudfdhdisufhgdufhgiufhsipfuhcsdh', async (err, decodedToken) => {
                if (err) {
                    console.log(err)
                }
                else {
                    // console.log(decodedToken)
                    let UserConnected = await UserServices.GetOneUser(parseInt(decodedToken.id))
                    if (UserConnected) {
                        res.locals.user = UserConnected
                        res.status(200).send(UserConnected)
                    } else {
                        console.log('Erreur sur requireAuth')
                    }
                }
            })
        } else {
            console.log('NO TOKEN')
            next()
        }
    },

    useConnectedUser: async (req, res, next) => {
        const token = req.cookies.bnf

        if (token) {
            jwt.verify(token, 'dsjfdfcsfjpsdfjgdfugjsdffijdsudfdhdisufhgdufhgiufhsipfuhcsdh', async (err, decodedToken) => {
                if (err) {
                    console.log(err)
                }
                else {
                    let UserConnected = await UserServices.GetOneUser(parseInt(decodedToken.id))
                    if (UserConnected) {
                        res.locals.user = UserConnected
                        next()
                    } else {
                        console.log('Erreur sur rquireAuth')
                        res.status(401).send('Erreur sur rquireAuth')
                        next()
                    }
                }
            })
        } else {
            res.status(401).send("Vous n'ête pas autoriser a acceder a cette ressource, veullize vous connecter")
            next()
        }
    }
}