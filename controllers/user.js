const pool = require("../db");
const jwt = require('jsonwebtoken');
const config = require('../config');
const bcrypt = require("bcrypt");

const getUser = async () => {
    const query = 'SELECT * FROM users WHERE delete_at is NULL';
    const res = await pool.query(query);
    return res.rows;
};

const getUserByEmail = async (email) => {
    console.log("email", email);
    const query = 'SELECT * FROM users WHERE email = $1 AND delete_at is NULL';
    const res = await pool.query(query, [email]);
    if (res.rows.length == 0) {
        throw "user not found";
    };
    return res.rows[0];
};


const signUp = async (body) => {
    const passHash = await bcrypt.hash(body.password, config.saltRounds);
    const query = 'INSERT INTO users (username, first_name, last_name, age, email, password, created_at) VALUES($1, $2, $3, $4, $5, $6, now()) RETURNING *';
    const res = await pool.query(query, [body.username, body.first_name, body.last_name, body.age, body.email, passHash]);
    return res.rows[0];
};

const login = async (body) => {
    const query = 'SELECT * FROM users WHERE email = $1 ';
    const res = await pool.query(query, [body.email]);
    let user = res.rows[0];
    const match = await bcrypt.compare(body.password, user.password);
    if (match) {
        delete user.password;
        let token = jwt.sign({ user }, config.secret)
        return ({
            token,
            user
        });
    } else {
        return undefined;
    }
};

const resetPassword = async (body) => {
    const query = 'SELECT * FROM users WHERE email=$1';
    const res = await pool.query(query, [body.email]);
    const match = await bcrypt.compare(body.old_password, res.rows[0].password);
    if (match) {
        const passHash = await bcrypt.hash(body.new_password, config.saltRounds);
        const query = 'UPDATE users SET password=$1, update_at=NOW() WHERE email=$2 RETURNING *';
        const res = await pool.query(query, [passHash, body.email]);
        return res.rows[0];
    } else {
        return undefined;
    }
};

const forgetPassword = async (body) => {
    const query = 'SELECT * FROM users WHERE email=$1';
    const res = await pool.query(query, [body.email]);
    let user = res.rows[0];
    let token = jwt.sign({ user }, config.secret)
    return token;
};

const forgetReset = async (body, token) => {
    const email = jwt.decode(token).user.email;
    const passHash = await bcrypt.hash(body.new_password, config.saltRounds);
    const query = 'UPDATE users SET password=$1, update_at=NOW() WHERE email=$2 RETURNING *';
    const res = await pool.query(query, [passHash, email]);
    return res.rows[0];
};

const updateUser = async (token, newUser) => {
    const email = jwt.decode(token).user.email;
    const query = 'UPDATE users SET username=$1, first_name=$2, last_name=$3, age=$4, email=$5, update_at=NOW() WHERE email=$6 RETURNING *';
    const res = await pool.query(query, [newUser.username, newUser.first_name, newUser.last_name, newUser.age, newUser.email, email]);
    return res.rows[0];
};

const deleteUser = async (token) => {
    const email = jwt.decode(token).user.email;
    const query = 'UPDATE users SET delete_at=NOW() WHERE email=$1 RETURNING *';
    const res = await pool.query(query, [email]);
    return res.rows[0];
};



module.exports = { getUser, getUserByEmail, signUp, login, resetPassword, forgetPassword, forgetReset, updateUser, deleteUser };
