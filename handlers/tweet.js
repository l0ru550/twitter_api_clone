const express = require('express');
const { tweet: tweetController } = require("../controllers");
const { validate, authentication } = require('../authentication');
const { body, param } = require('express-validator');
const tweet = express.Router();


/**
 * @openapi
 * /tweets:
 *   get:
 *     description: Returns all tweets.
 *     tags:
 *      - Tweet
 *     responses:
 *       200:
 *        description: Returns all tweets.
 *        content:
 *          application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  id:
 *                     type: integer
 *                  user_id:
 *                     type: integer
 *                  text:
 *                     type: string
 *                  photo:
 *                     type: string
 */
tweet.get('/tweets', async (request, response) => {
    try {
        const tweets = await tweetController.getTweets();
        response.json(tweets);
    } catch (error) {
        request.log.error(error);
        response.end(JSON.stringify(error)).status(500);
    }
});


/**
 * @openapi
 * /tweets/{id}/tweet:
 *   get:
 *     description: Returns a specific tweet.
 *     tags:
 *      - Tweet
 *     parameters:
 *       - in: path
 *         name: id
 *         description: tweet id
 *         schema:
 *          type: integer
 *     responses:
 *       200:
 *        description: Returns a specific tweet.
 *        content:
 *          application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  id:
 *                     type: integer
 *                  user_id:
 *                     type: integer
 *                  text:
 *                     type: string
 *                  photo:
 *                     type: string
 */
tweet.get('/tweets/:id/tweet',
    validate([param('id').isInt({ min: 1 })]),
    async (request, response) => {
        try {
            const tweet = await tweetController.getTweet(request.params.id);
            response.json(tweet);
        } catch (error) {
            request.log.error(error);
            response.end(JSON.stringify(error)).status(500);
        }
    });

/**
 * @openapi
 * /tweets/{id}/tweets:
 *   get:
 *     description: Returns all tweets by a specific user.
 *     tags:
 *      - Tweet
 *     parameters:
 *       - in: path
 *         name: id
 *         description: user id
 *         schema:
 *          type: integer
 *     responses:
 *       200:
 *        description: Returns all tweets by a specific user.
 *        content:
 *          application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  id:
 *                     type: integer
 *                  user_id:
 *                     type: integer
 *                  text:
 *                     type: string
 *                  photo:
 *                     type: string
 */
tweet.get('/tweets/:id/tweets',
    validate([param('id').isInt({ min: 1 })]),
    async (request, response) => {
        try {
            const tweets = await tweetController.getTweetByUser(request.params.id);
            response.json(tweets);
        } catch (error) {
            request.log.error(error);
            response.end(JSON.stringify(error)).status(500);
        }
    });


/**
 * @openapi
 * /tweets:
 *   post:
 *     description: Tweet.
 *     tags:
 *      - Tweet
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
 *                  photo:
 *                     type: string
 *     security:
 *      - bearerAuth: [] 
 *     responses:
 *       200:
 *        description: Tweet.
 *        content:
 *          application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  id:
 *                     type: integer
 *                  user_id:
 *                     type: integer
 *                  text:
 *                     type: string
 *                  photo:
 *                     type: string
 *       404:
 *          description: Impossible to tweet.
 *          content:
 *            application/json:
 *              schema: 
 *                type: string
 */
tweet.post('/tweets', authentication, validate([
    body('user_id').isLength({ max: 30 }),
    body('text').isLength({ max: 500 }),
    body('photo').isURL().optional({ nullable: true }),
]),
    async (request, response) => {
        try {
            const tweet = await tweetController.createTweet(request.body, request.authorization.user.id);
            response.json(tweet);
        } catch (error) {
            request.log.error(error);
            response.end(JSON.stringify(error)).status(500);
        }
    });

/**
 * @openapi
 * /tweets/{id}:
 *   put:
 *     description: Update tweet.
 *     tags:
 *      - Tweet
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
 *                  photo:
 *                     type: string
 *     security:
 *      - bearerAuth: [] 
 *     responses:
 *       200:
 *        description: Updated tweet.
 *        content:
 *          application/json:
 *             schema: 
 *                type: object
 *                properties:
 *                  id:
 *                     type: integer
 *                  user_id:
 *                     type: integer
 *                  text:
 *                     type: string
 *                  photo:
 *                     type: string
 *       404:
 *          description: Impossible to update the tweet.
 *          content:
 *            application/json:
 *              schema: 
 *                type: string
 */
tweet.put('/tweets/:id', authentication, validate([
    param('id').isInt({ min: 1 }),
    body('text').isLength({ max: 500 }).optional({ nullable: true }),
    body('photo').isURL().optional({ nullable: true })
]),
    async (request, response) => {
        let tweet = await tweetController.getTweet(request.params.id);
        try {
            let newTweet = {};
            if (request.body.text) {
                newTweet.text = request.body.text;
            } else {
                newTweet.text = tweet.text;
            }
            if (request.body.photo) {
                newTweet.photo = request.body.photo;
            } else {
                newTweet.photo = tweet.photo;
            }
            tweet = await tweetController.updateTweet(request.authorization.user.id, newTweet);
            response.json(tweet);
        } catch (error) {
            request.log.error(error);
            response.end(JSON.stringify(error)).status(500);
        };
    });

/**
 * @openapi
 * /tweets/{id}:
 *   delete:
 *     description: Delete the tweet.
 *     tags:
 *      - Tweet
 *     parameters:
 *       - in: path
 *         name: id
 *         description: tweet id
 *         schema:
 *          type: integer
 *     security:
 *      - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: Delete the tweet.
 *         content:
 *           application/json:
 *              schema: 
 *                type: object
 *                properties:
 *                  id:
 *                     type: integer
 *                  user_id:
 *                     type: integer
 *                  text:
 *                     type: string
 *                  photo:
 *                     type: string
 *       404:
 *          description: Impossible to delete the tweet.
 *          content:
 *            application/json:
 *              schema: 
 *                type: string
 */
tweet.delete('/tweets/:id', authentication, validate([
    param('id').isInt({ min: 1 })]),
    async (request, response) => {
        try {
            const tweet = await tweetController.deleteTweet(request.params.id);
            response.json(tweet);
        } catch (error) {
            request.log.error(error);
            response.end(JSON.stringify(error)).status(500);
        };
    });

module.exports = tweet;