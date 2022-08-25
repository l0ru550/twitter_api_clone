const express = require('express');
const pino = require('pino-http')();
const bodyParser = require('body-parser');
const { user, follower,tweet, comment } = require("./handlers");
let app = express();
require('./db');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
// const  openapiSpecification = require('./swagger.json');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Twitter API',
            version: '1.0.0',
        },
    },
    apis: ['./handlers/*.js'],
};

const openapiSpecification = swaggerJsdoc(options);


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification, options));

app.use(pino);

app.use("/users", user);

app.use(follower);

app.use(tweet);

app.use(comment);


app.listen(3000, () => {
    console.log('Listening on port 3000');
});