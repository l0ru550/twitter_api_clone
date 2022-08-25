const config = require('./config');
const jwt = require('jsonwebtoken');
const { user: userController } = require("./controllers");

async function authentication(request, response, next) {
    const bearerHeader = request.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1]
        try {
            const authData = jwt.verify(bearerToken, config.secret);
            request.authorization = authData;
            request.token = bearerToken;
            await userController.getUserByEmail(authData.user.email);
            next();
        } catch (error) {
            console.log("error", error);
            response.sendStatus(401);
        }
    }
};


module.exports = authentication;