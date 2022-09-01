const pool = require("../db");
const { getCommentsByTweet } = require("./comment");

const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

const getTweets = async () => {
    const query = 'SELECT * FROM tweet WHERE delete_at is NULL';
    const res = await pool.query(query);
    await asyncForEach(res.rows, async (tweet) => {
        const commentsByTweet = await getCommentsByTweet(tweet.id);
        tweet.comments = commentsByTweet;
    });
    return res.rows;
};

const getTweet = async (id) => {
    const query = 'SELECT * FROM tweet WHERE id=$1 AND delete_at is NULL';
    const res = await pool.query(query, [id]);
    const commentsByTweet = await getCommentsByTweet(id);
    res.rows[0].comments = commentsByTweet;
    return res.rows;
};

const getTweetsByUser = async (id) => {
    const query = 'SELECT * FROM tweet WHERE user_id=$1 AND delete_at is NULL';
    const res = await pool.query(query, [id]);
    await asyncForEach(res.rows, async (tweet) => {
        const commentsByTweet = await getCommentsByTweet(tweet.id);
        tweet.comments = commentsByTweet;
    });
    return res.rows;
};

const createTweet = async (body, user_id) => {
    const query = 'INSERT INTO tweet (user_id, text, photo, created_at) VALUES($1, $2, $3, now()) RETURNING *';
    const res = await pool.query(query, [user_id, body.text, body.photo]);
    return res.rows;
};

const updateTweet = async (user_id, newTweet) => {
    const query = 'UPDATE tweet SET text=$1, photo=$2, update_at=NOW() WHERE user_id=$3 RETURNING *';
    const res = await pool.query(query, [newTweet.text, newTweet.photo, user_id]);
    return res.rows;
};

const deleteTweet = async (id) => {
    const query = 'UPDATE tweet SET delete_at=NOW() WHERE id=$1 RETURNING *'
    const res = await pool.query(query, [id]);
    return res.rows[0];
};


module.exports = { getTweets, getTweet, getTweetsByUser, createTweet, updateTweet, deleteTweet };