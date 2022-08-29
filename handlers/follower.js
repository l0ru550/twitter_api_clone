const express = require('express');
const { follower: followerController } = require("../controllers");
const { validate, authentication } = require('../authentication');
const { body, param } = require('express-validator');
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
 *   delete:
 *     description: Follow up someone.
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
 *         description: Follow up someone.
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
 *          description: Impossible to follow up.
 *          content:
 *            application/json:
 *              schema: 
 *                type: string
 */
follower.post('/users/:id/followers', authentication, validate([
    param('id').isInt({ min: 1 }),
    body('id').isInt({ min: 1 })]),
    async (request, response) => {
        try {
            console.log('params.id', request.params.id);
            const follower = await followerController.followUp(request.params.id, request.body.id);
            response.json(follower);
        } catch (error) {
            request.log.error(error);
            response.end(JSON.stringify(error)).status(500);
        }
    });

/**
 * @openapi
 * /users/{id}/followers/{following_id}:
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
 *       - in: path
 *         name: following_id
 *         description: following id
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
follower.delete('/users/:id/followers/:following_id', authentication, validate([
    param('id').isInt({ min: 1 }),
    param('following_id').isInt({ min: 1 })]),
    async (request, response) => {
        try {
            const follower = await followerController.unFollow(request.params.id, request.params.following_id);
            response.json(follower);
        } catch (error) {
            request.log.error(error);
            response.end(JSON.stringify(error)).status(500);
        };
    });

module.exports = follower;