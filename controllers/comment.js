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
    const query = 'INSERT INTO comment (user_id, tweet_id, text, photo, created_at) VALUES($1, $2, $3, $4, now()) RETURNING *';
    const res = await pool.query(query, [user_id, id, body.text, body.photo]);
    return res.rows;
};

const updateComment = async (newComment, id) => {
    const query = 'UPDATE comment SET text=$1, photo=$2 update_at=NOW() WHERE id=$3 RETURNING *';
    const res = await pool.query(query, [newComment.text, newComment.photo, id]);
    return res.rows;
};

const deleteComment = async (id) => {
    const query = 'UPDATE comment SET delete_at=NOW() WHERE id=$1 RETURNING *'
    const res = await pool.query(query, [id]);
    return res.rows[0];
};

module.exports = { getComments, getComment, getCommentsByTweet, getCommentsByUser, createComment, updateComment, deleteComment };