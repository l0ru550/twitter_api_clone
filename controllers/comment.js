const pool = require("../db");
const jwt = require('jsonwebtoken');


const getComments = async () => {
    const query = 'SELECT * FROM comment WHERE delete_at is NULL';
    const res = await pool.query(query);
    return res.rows;
};

const getComment = async (id) => {
    const query = 'SELECT * FROM comment WHERE id=$1 AND delete_at is NULL';
    const res = await pool.query(query, [id]);
    return res.rows;
};

const getCommentsByTweet = async (id) => {
    const query = 'SELECT * FROM comment WHERE tweet_id=$1 AND delete_at is NULL';
    const res = await pool.query(query, [id]);
    return res.rows;
};

const getCommentsByUser = async (id) => {
    const query = 'SELECT * FROM comment WHERE user_id=$1 AND delete_at is NULL';
    const res = await pool.query(query, [id]);
    return res.rows;
};

const createComment = async (user_id, id, body) => {
    const query = 'INSERT INTO comment (user_id, tweet_id, text, created_at) VALUES($1, $2, $3, now()) RETURNING *';
    const res = await pool.query(query, [user_id, id, body.text]);
    return res.rows;
};

const updateComment = async (newComment, id) => {
    const query = 'UPDATE comment SET text=$1, update_at=NOW() WHERE id=$2 RETURNING *';
    const res = await pool.query(query, [newComment.text, id]);
    return res.rows;
};

const deleteComment = async (id, user_id) => {
    const query = 'UPDATE comment SET delete_at=NOW() WHERE user_id=$1 AND id=$2 RETURNING *'
    const res = await pool.query(query, [user_id, id]);
    return res.rows[0];
};

module.exports = { getComments, getComment, getCommentsByTweet, getCommentsByUser, createComment, updateComment, deleteComment };