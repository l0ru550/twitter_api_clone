const express = require('express');
const { follower: followerController } = require("../controllers");
const validate = require('../validate');
const authentication = require('../authentication');
const { param } = require('express-validator');
const follower = express.Router();


/**
 * @openapi
 * /followers:
 *   get:
 *     description: Returns all follows.
 *     tags:
 *      - Follower
 *     responses:
 *       200:
 *        description: Returns all follows.
 *        content:
 *          application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  id:
 *                     type: integer
 *                  follower_id:
 *                     type: integer
 *                  following_id:
 *                     type: integer
 */
follower.get('/followers', async (request, response) => {
    try {
        const follows = await followerController.getFollow();
        response.json(follows);
    } catch (error) {
        request.log.error(error);
        response.end(JSON.stringify(error)).status(500);
    }
});

/**
 * @openapi
 * /users/{id}/followers:
 *   get:
 *     description: Returns all followers.
 *     tags:
 *      - Follower
 *     parameters:
 *       - in: path
 *         name: id
 *         description: user id
 *         schema:
 *          type: integer
 *     responses:
 *       200:
 *        description: Returns all followers.
 *        content:
 *          application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  id:
 *                     type: integer
 *                  follower_id:
 *                     type: integer
 *                  following_id:
 *                     type: integer
 */
follower.get('/users/:id/followers',
    validate([param('id').isInt({ min: 1 })]),
    async (request, response) => {
        try {
            const follower = await followerController.getFollowers(request.params.id);
            response.json(follower);
        } catch (error) {
            request.log.error(error);
            response.end(JSON.stringify(error)).status(500);
        }
    });

/**
 * @openapi
 * /users/{id}/followings:
 *   get:
 *     description: Returns all followings.
 *     tags:
 *      - Follower
 *     parameters:
 *       - in: path
 *         name: id
 *         description: user id
 *         schema:
 *          type: integer
 *     responses:
 *       200:
 *        description: Returns all followings.
 *        content:
 *          application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  id:
 *                     type: integer
 *                  follower_id:
 *                     type: integer
 *                  following_id:
 *                     type: integer
 */
follower.get('/users/:id/followings',
    validate([param('id').isInt({ min: 1 })]),
    async (request, response) => {
        try {
            const following = await followerController.getFollowings(request.params.id);
            response.json(following);
        } catch (error) {
            request.log.error(error);
            response.end(JSON.stringify(error)).status(500);
        }
    });

/**
 * @openapi
 * /users/{id}/followers:
 *   post:
 *     description: Follow Up.
 *     tags:
 *      - Follower
 *     parameters:
 *       - in: path
 *         name: id
 *         description: user id
 *         schema:
 *          type: integer
 *     security:
 *      - bearerAuth: [] 
 *     responses:
 *       200:
 *        description: Follow Up.
 *        content:
 *          application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  id:
 *                     type: integer
 *                  follower_id:
 *                     type: integer
 *                  following_id:
 *                     type: integer
 *       404:
 *          description: Impossible to complete follow up.
 *          content:
 *            application/json:
 *              schema: 
 *                type: string
 */
follower.post('/users/:id/followers', authentication,
    validate([param('id').isInt({ min: 1 })]),
    async (request, response) => {
        try {
            const follower = await followerController.followUp(request.params.id, request.authorization.user.id);
            response.json(follower);
        } catch (error) {
            request.log.error(error);
            response.end(JSON.stringify(error)).status(500);
        }
    });

/**
 * @openapi
 * /followers/{id}:
 *   delete:
 *     description: Stop to follow someone.
 *     tags:
 *      - Follower
 *     parameters:
 *       - in: path
 *         name: id
 *         description: user id
 *         schema:
 *          type: integer
 *     security:
 *      - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: Stop to follow someone.
 *         content:
 *           application/json:
 *              schema: 
 *                type: object
 *                properties:
 *                  id:
 *                     type: integer
 *                  follower_id:
 *                     type: integer
 *                  following_id:
 *                     type: integer
 *       404:
 *          description: Impossible to unfollow.
 *          content:
 *            application/json:
 *              schema: 
 *                type: string
 */
follower.delete('/followers/:id', authentication,
    validate([param('id').isInt({ min: 1 })]),
    async (request, response) => {
        try {
            const follower = await followerController.unFollow(request.params.id, request.authorization.user.id);
            response.json(follower);
        } catch (error) {
            request.log.error(error);
            response.end(JSON.stringify(error)).status(500);
        };
    });

module.exports = follower;