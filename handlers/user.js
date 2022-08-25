const express = require('express');
const { user: userController } = require("../controllers");
const validate = require('../validate');
const authentication = require('../authentication');
const { body } = require('express-validator');
const user = express.Router();


/**
 * @openapi
 * /users:
 *   get:
 *     description: Returns all users.
 *     tags:
 *      - User
 *     responses:
 *       200:
 *        description: Returns all users.
 *        content:
 *          application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  id:
 *                     type: integer
 *                  username:
 *                     type: string
 *                  first_name:
 *                     type: string
 *                  last_name:
 *                     type: string
 *                  age:
 *                     type: integer
 *                  email:
 *                     type: string
 *                  password:
 *                     type: string
 */
user.get('/', async (request, response) => {
    try {
        const user = await userController.getUser();
        response.json(user);
    } catch (error) {
        request.log.error(error);
        response.end(JSON.stringify(error)).status(500);
    }
});


/**
 * @openapi
 * /users/signup:
 *   post:
 *     description: Sign Up.
 *     tags:
 *      - User
 *     produces:
 *       - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *           type: object   
 *           properties: 
 *                  username:
 *                     type: string
 *                  first_name:
 *                     type: string
 *                  last_name:
 *                     type: string
 *                  age:
 *                     type: integer
 *                  email:
 *                     type: string
 *                  password:
 *                     type: string
 *     responses:
 *       200:
 *        description: Sign Up.
 *        content:
 *          application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  id:
 *                     type: integer
 *                  username:
 *                     type: string
 *                  first_name:
 *                     type: string
 *                  last_name:
 *                     type: string
 *                  age:
 *                     type: integer
 *                  email:
 *                     type: string
 *                  password:
 *                     type: string
 *       404:
 *          description: Impossible to complete sign up.
 *          content:
 *            application/json:
 *              schema: 
 *                type: string
 */
user.post('/signup', validate([
    body('username').isLength({ max: 30 }),
    body('first_name').isLength({ max: 15 }),
    body('last_name').isLength({ max: 15 }),
    body('age').isNumeric().isLength({ max: 3 }),
    body('email').isEmail().isLength({ max: 60 }),
    body('password').isLength({ max: 30 }),
]),
    async (request, response) => {
        try {
            const user = await userController.signUp(request.body);
            response.json(user);
        } catch (error) {
            request.log.error(error);
            response.end(JSON.stringify(error)).status(500);
        }
    });


/**
 * @openapi
 * /users/login:
 *   post:
 *     description: Login.
 *     tags:
 *      - User
 *     produces:
 *       - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *           type: object   
 *           properties: 
 *                  email:
 *                     type: string
 *                  password:
 *                     type: string
 *     responses:
 *       200:
 *        description: Login.
 *        content:
 *          application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  id:
 *                     type: integer
 *                  username:
 *                     type: string
 *                  first_name:
 *                     type: string
 *                  last_name:
 *                     type: string
 *                  age:
 *                     type: integer
 *                  email:
 *                     type: string
 *       404:
 *          description: Impossible log in.
 *          content:
 *            application/json:
 *              schema: 
 *                type: string
 */
user.post('/login', validate([
    body('email').isLength({ max: 60 }),
    body('password').isLength({ max: 30 }),
]),
    async (request, response) => {
        try {
            const user = await userController.login(request.body);
            if (user !== undefined) {
                response.json(user);
            } else {
                response.sendStatus(401);
            }
        } catch (error) {
            request.log.error(error);
            response.end(JSON.stringify(error)).status(500);
        };
    });


/**
 * @openapi
 * /users/resetPassword:
 *   post:
 *     description: Reset password.
 *     tags:
 *      - User
 *     produces:
 *       - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *           type: object   
 *           properties: 
 *                  email:
 *                     type: string
 *                  old_password:
 *                     type: string
 *                  new_password:
 *                     type: string
 *     security:
 *      - bearerAuth: []  
 *     responses:
 *       200:
 *        description: Password changed.
 *        content:
 *          application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  id:
 *                     type: integer
 *                  username:
 *                     type: string
 *                  first_name:
 *                     type: string
 *                  last_name:
 *                     type: string
 *                  age:
 *                     type: integer
 *                  email:
 *                     type: string
 *       404:
 *          description: Impossible to reset password.
 *          content:
 *            application/json:
 *              schema: 
 *                type: string
 */
user.post('/resetPassword', authentication, validate([
    body('email').isLength({ max: 60 }),
    body('old_password').isLength({ max: 30 }),
    body('new_password').isLength({ max: 30 })
]),
    async (request, response) => {
        try {
            const reset = await userController.resetPassword(request.body);
            if (reset) {
                response.json(reset);
            } else {
                response.sendStatus(401);
            }
        } catch (error) {
            request.log.error(error);
            response.end(JSON.stringify(error)).status(500);
        };

    });

/**
* @openapi
* /users/forgetPassword:
*   post:
*     description: Forget Password.
*     tags:
*      - User
*     produces:
*       - application/json
*     requestBody:
*       content:
*         application/json:
*          schema:
*           type: object   
*           properties: 
*                  email:
*                     type: string
*     responses:
*       200:
*        description: Password recovered.
*        content:
*          application/json:
*             schema: 
*                type: object
*                properties:
*                  id:
*                     type: integer
*                  username:
*                     type: string
*                  first_name:
*                     type: string
*                  last_name:
*                     type: string
*                  age:
*                     type: integer
*                  email:
*                     type: string
*       404:
*          description: Impossible to recover password.
*          content:
*            application/json:
*              schema: 
*                type: string
*/
user.post('/forgetPassword', validate([
    body('email').isLength({ max: 60 })
]),
    async (request, response) => {
        try {
            const forget = await userController.forgetPassword(request.body);
            if (forget !== undefined) {
                response.json(forget);
            } else {
                response.sendStatus(401);
            }
        } catch (error) {
            request.log.error(error);
            response.end(JSON.stringify(error)).status(500);
        };
    });


/**
 * @openapi
 * /users/forget/reset:
 *   post:
 *     description: Reset Password.
 *     tags:
 *      - User
 *     produces:
 *       - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *           type: object   
 *           properties: 
 *                  new_password:
 *                     type: string
 *     security:
 *      - bearerAuth: [] 
 *     responses:
 *       200:
 *        description: Password changed.
 *        content:
 *          application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  id:
 *                     type: integer
 *                  username:
 *                     type: string
 *                  first_name:
 *                     type: string
 *                  last_name:
 *                     type: string
 *                  age:
 *                     type: integer
 *                  email:
 *                     type: string
 *       404:
 *          description: Impossible to changed password.
 *          content:
 *            application/json:
 *              schema: 
 *                type: string
 */
user.post('/forget/reset', authentication, validate([
    body('new_password').isLength({ max: 30 })
]),
    async (request, response) => {
        try {
            const reset = await userController.forgetReset(request.body, request.token);
            if (reset) {
                response.json(reset);
            } else {
                response.sendStatus(401);
            }
        } catch (error) {
            request.log.error(error);
            response.end(JSON.stringify(error)).status(500);
        };

    });

/**
 * @openapi
 * /users:
 *   put:
 *     description: Returns an updated user.
 *     tags:
 *      - User
 *     produces:
 *       - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *           type: object   
 *           properties: 
 *                  username:
 *                     type: string
 *                  first_name:
 *                     type: string
 *                  last_name:
 *                     type: string
 *                  age:
 *                     type: integer
 *                  email:
 *                     type: string
 *     security:
 *      - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: Returns an updated user.
 *         content:
 *           application/json:
 *              schema: 
 *                type: object
 *                properties:
 *                  id:
 *                     type: integer
 *                  username:
 *                     type: string
 *                  first_name:
 *                     type: string
 *                  last_name:
 *                     type: string
 *                  age:
 *                     type: integer
 *                  email:
 *                     type: string
 *       404:
 *          description: Impossible to update this user.
 *          content:
 *            application/json:
 *              schema: 
 *                type: string
 */
user.put('/', authentication, validate([
    body('username').isLength({ max: 30 }).optional({ nullable: true }),
    body('first_name').isLength({ max: 15 }).optional({ nullable: true }),
    body('last_name').isLength({ max: 15 }).optional({ nullable: true }),
    body('age').isNumeric().isLength({ max: 3 }).optional({ nullable: true }),
    body('email').isEmail().isLength({ max: 60 }).optional({ nullable: true })
]),
    async (request, response) => {
        let user = await userController.getUserByEmail(request.authorization.user.email);
        try {
            let newUser = {};
            if (request.body.username) {
                newUser.username = request.body.username;
            } else {
                newUser.username = user.username;
            }
            if (request.body.first_name) {
                newUser.first_name = request.body.first_name;
            } else {
                newUser.first_name = user.first_name;
            }
            if (request.body.last_name) {
                newUser.last_name = request.body.last_name;
            } else {
                newUser.last_name = user.last_name;
            }
            if (request.body.age) {
                newUser.age = request.body.age;
            } else {
                newUser.age = user.age;
            }
            if (request.body.email) {
                newUser.email = request.body.email;
            } else {
                newUser.email = user.email;
            }
            user = await userController.updateUser(request.authorization.user.email, newUser);
            response.json(user);
        } catch (error) {
            request.log.error(error);
            response.end(JSON.stringify(error)).status(500);
        };
    });


/**
 * @openapi
 * /users:
 *   delete:
 *     description: Returns a deleted user.
 *     tags:
 *      - User
 *     produces:
 *       - application/json
 *     security:
 *      - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: Returns a deleted user.
 *         content:
 *           application/json:
 *              schema: 
 *                type: object
 *                properties:
 *                  id:
 *                     type: integer
 *                  username:
 *                     type: string
 *                  first_name:
 *                     type: string
 *                  last_name:
 *                     type: string
 *                  age:
 *                     type: integer
 *                  email:
 *                     type: string
 *       404:
 *          description: Impossible to delete this user.
 *          content:
 *            application/json:
 *              schema: 
 *                type: string
 */
user.delete('/', authentication, async (request, response) => {
    try {
        const user = await userController.deleteUser(request.authorization.user.email);
        response.json(user);
    } catch (error) {
        request.log.error(error);
        response.end(JSON.stringify(error)).status(500);
    };
});

module.exports = user;