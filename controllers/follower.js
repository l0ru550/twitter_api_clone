const pool = require("../db")


const getFollows = async () => {
    const query = 'SELECT * FROM follower WHERE delete_at is NULL';
    const res = await pool.query(query);
    return res.rows;
};

const getUserFollowers = async (id) => {
    const query = 'SELECT * FROM follower WHERE following_id = $1';
    const res = await pool.query(query, [id]);
    return res.rows;
};

const getFollowings = async (id) => {
    const query = 'SELECT * FROM follower WHERE follower_id = $1';
    const res = await pool.query(query, [id]);
    return res.rows;
};

const followUp = async (user_id, id) => {
    const query = 'INSERT INTO follower (follower_id, following_id, created_at) VALUES($1, $2, now()) RETURNING *';
    const res = await pool.query(query, [user_id, id]);
    return res.rows[0];
};

const unFollow = async (user_id, id) => {
    const query = 'UPDATE follower SET delete_at=NOW() WHERE follower_id=$1 AND following_id=$2 RETURNING *';
    const res = await pool.query(query, [user_id, id]);
    return res.rows[0];
};


module.exports = { getFollows, getUserFollowers, getFollowings, followUp, unFollow };