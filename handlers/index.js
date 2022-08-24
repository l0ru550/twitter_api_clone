const user = require("./user");
const follower = require("./follower");
const tweet = require("./tweet");
const comment = require("./comment");


/**
 * @openapi
 * components:
 *  securitySchemes:
 *   bearerAuth:            
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT 
 */

module.exports = { user, follower, tweet, comment };