const config = require('./config');
const jwt = require('jsonwebtoken');
const { user: userController } = require("./controllers");
const { validationResult } = require('express-validator');

const validate = validations => {
    return async (request, response, next) => {
        await Promise.all(validations.map(validation => validation.run(request)));

        const errors = validationResult(request);
        if (errors.isEmpty()) {
            return next();
        }

        response.status(400).json({
            errors: errors.array()
        });
    };
};

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


module.exports = { validate, authentication };