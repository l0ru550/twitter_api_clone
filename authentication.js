function authentication(request, response, next) {
    const bearerHeader = request.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1]
        try {
            const authData = jwt.verify(bearerToken, config.secret);
            request.authorization = authData;
            request.token = bearerToken;
            next();
        } catch (error) {
            response.sendStatus(401);
        }
    }
};
