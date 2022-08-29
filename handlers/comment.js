const express = require('express');
const { comment: commentController } = require("../controllers");
const { validate, authentication } = require('../authentication');
const { body, param } = require('express-validator');
const comment = express.Router();


/**
 * @openapi
 * /comments:
 *   get:
 *     description: Returns all comments.
 *     tags:
 *      - Comment
 *     responses:
 *       200:
 *        description: Returns all comments.
 *        content:
 *          application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  id:
 *                     type: integer
 *                  user_id:
 *                     type: integer
 *                  tweet_id:
 *                     type: integer
 *                  text:
 *                     type: string
 */
comment.get('/comments', async (request, response) => {
    try {
        const comments = await commentController.getComments();
        response.json(comments);
    } catch (error) {
        request.log.error(error);
        response.end(JSON.stringify(error)).status(500);
    }
});

/**
 * @openapi
 * /comments/{id}:
 *   get:
 *     description: Returns a specific comment.
 *     tags:
 *      - Comment
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Comment id
 *         schema:
 *          type: integer
 *     responses:
 *       200:
 *        description: Returns a specific comment.
 *        content:
 *          application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  id:
 *                     type: integer
 *                  user_id:
 *                     type: integer
 *                  tweet_id:
 *                     type: integer
 *                  text:
 *                     type: string
 */
comment.get('comments/:id',
    validate([param('id').isInt({ min: 1 })]),
    async (request, response) => {
        try {
            const comment = await commentController.getComment(request.params.id);
            response.json(comment);
        } catch (error) {
            request.log.error(error);
            response.end(JSON.stringify(error)).status(500);
        }
    });

/**
 * @openapi
 * /tweets/{id}/comments:
 *   get:
 *     description: Returns all comments for a specific tweet.
 *     tags:
 *      - Comment
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Tweet id
 *         schema:
 *          type: integer
 *     responses:
 *       200:
 *        description: Returns all comments for a specific tweet.
 *        content:
 *          application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  id:
 *                     type: integer
 *                  user_id:
 *                     type: integer
 *                  tweet_id:
 *                     type: integer
 *                  text:
 *                     type: string
 */
comment.get('/tweets/:id/comments',
    validate([param('id').isInt({ min: 1 })]),
    async (request, response) => {
        try {
            const comments = await commentController.getCommentsByTweet(request.params.id);
            response.json(comments);
        } catch (error) {
            request.log.error(error);
            response.end(JSON.stringify(error)).status(500);
        }
    });

/**
* @openapi
* /users/{id}/comments:
*   get:
*     description: Returns all comments by a specific user.
*     tags:
*      - Comment
*     parameters:
*       - in: path
*         name: id
*         description: user id
*         schema:
*          type: integer
*     responses:
*       200:
*        description: Returns all comments by a specific user.
*        content:
*          application/json:
*             schema: 
*                type: object
*                properties:
*                  id:
*                     type: integer
*                  user_id:
*                     type: integer
*                  tweet_id:
*                     type: integer
*                  text:
*                     type: string
*/
comment.get('/users/:id/comments',
    validate([param('id').isInt({ min: 1 })]),
    async (request, response) => {
        try {
            const comments = await commentController.getCommentsByUser(request.params.id);
            response.json(comments);
        } catch (error) {
            request.log.error(error);
            response.end(JSON.stringify(error)).status(500);
        }
    });

/**
 * @openapi
 * /tweets/{id}/comments:
 *   post:
 *     description: Comment.
 *     tags:
 *      - Comment
 *     parameters:
 *       - in: path
 *         name: id
 *         description: tweet id
 *         schema:
 *          type: integer
 *     produces:
 *       - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *           type: object   
 *           properties: 
 *                  text:
 *                     type: string
 *     security:
 *      - bearerAuth: [] 
 *     responses:
 *       200:
 *        description: comment.
 *        content:
 *          application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  id:
 *                     type: integer
 *                  user_id:
 *                     type: integer
 *                  tweet_id:
 *                     type: integer
 *                  text:
 *                     type: string
 *       404:
 *          description: Impossible to comment.
 *          content:
 *            application/json:
 *              schema: 
 *                type: string
 */
comment.post('/tweets/:id/comments', authentication, validate([
    param('id').isInt({ min: 1 }),
    body('text').isLength({ max: 500 })
]),
    async (request, response) => {
        try {
            const comment = await commentController.createComment(request.authorization.user.id, request.params.id, request.body);
            response.json(comment);
        } catch (error) {
            request.log.error(error);
            response.end(JSON.stringify(error)).status(500);
        }
    });

/**
 * @openapi
 * /comments/{id}:
 *   put:
 *     description: Update the comment.
 *     tags:
 *      - Comment
 *     parameters:
 *       - in: path
 *         name: id
 *         description: comment id
 *         schema:
 *          type: integer
 *     produces:
 *       - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *           type: object   
 *           properties: 
 *                  text:
 *                     type: string
 *     security:
 *      - bearerAuth: [] 
 *     responses:
 *       200:
 *        description: Updated comment.
 *        content:
 *          application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  id:
 *                     type: integer
 *                  user_id:
 *                     type: integer
 *                  tweet_id:
 *                     type: integer
 *                  text:
 *                     type: string
 *       404:
 *          description: Impossible to update the comment.
 *          content:
 *            application/json:
 *              schema: 
 *                type: string
 */
comment.put('/comments/:id', authentication, validate([
    param('id').isInt({ min: 1 }),
    body('text').isLength({ max: 500 })
]),
    async (request, response) => {
        let comment = await commentController.getComment(request.params.id);
        try {
            let newComment = {};
            if (request.body.text) {
                newComment.text = request.body.text;
            } else {
                newComment.text = comment.text;
            }
            comment = await commentController.updateComment(newComment, request.params.id);
            response.json(comment);
        } catch (error) {
            request.log.error(error);
            response.end(JSON.stringify(error)).status(500);
        };
    });

/**
 * @openapi
 * /comments/{id}:
 *   delete:
 *     description: Delete the comment.
 *     tags:
 *      - Comment
 *     parameters:
 *       - in: path
 *         name: id
 *         description: comment id
 *         schema:
 *          type: integer
 *     security:
 *      - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: Delete the comment.
 *         content:
 *           application/json:
 *              schema: 
 *                type: object
 *                properties:
 *                  id:
 *                     type: integer
 *                  user_id:
 *                     type: integer
 *                  tweet_id:
 *                     type: integer
 *                  text:
 *                     type: string
 *       404:
 *          description: Impossible to delete the comment.
 *          content:
 *            application/json:
 *              schema: 
 *                type: string
 */
comment.delete('/comments/:id', authentication, validate([
    param('id').isInt({ min: 1 })]),
    async (request, response) => {
        try {
            const comment = await commentController.deleteComment(request.params.id);
            response.json(comment);
        } catch (error) {
            request.log.error(error);
            response.end(JSON.stringify(error)).status(500);
        };
    });

module.exports = comment;