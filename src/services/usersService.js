require('dotenv').config();

const pool = require('../config/database');

const bcrypt = require('bcrypt');





// ================================
// CREATE / REGISTER USER
// ================================

const createUser = async(payload = {})=>{

    const username = payload.username || payload.fullname || payload.name;
    const email = payload.email;
    const password = payload.password;

    if (!username || !email || !password) {
        throw new Error('Username, email, dan password wajib diisi');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const id = `user-${Date.now()}`;

    const query = `

        INSERT INTO users

        (

            id,

            username,

            email,

            password,

            created_at,

            updated_at

        )

        VALUES

        ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)

        ON CONFLICT (email) 
        DO UPDATE SET 
            username = EXCLUDED.username,
            password = EXCLUDED.password,
            updated_at = CURRENT_TIMESTAMP

        RETURNING

            id,

            username,

            email

    `;

    const values = [

        id,

        username,

        email,

        hashedPassword

    ];

    const result = await pool.query(

        query,

        values

    );

    return result.rows[0];


};









// ================================
// GET ALL USERS
// ================================

const getUsers = async()=>{


    const query = `

        SELECT

            id,

            username,

            email,

            created_at,

            updated_at

        FROM users

        ORDER BY created_at DESC

    `;



    const result = await pool.query(

        query

    );



    return result.rows;


};









// ================================
// GET USER BY ID
// ================================

const getUserById = async(id)=>{


    const query = `

        SELECT

            id,

            username,

            email,

            created_at,

            updated_at

        FROM users

        WHERE id=$1

    `;



    const result = await pool.query(

        query,

        [

            id

        ]

    );



    return result.rows[0];


};









// ================================
// UPDATE USER
// ================================

const updateUser = async({

    id,

    username,

    email


})=>{


    const query = `

        UPDATE users

        SET

            username=$1,

            email=$2,

            updated_at=CURRENT_TIMESTAMP


        WHERE id=$3


        RETURNING

            id,

            username,

            email,

            created_at,

            updated_at

    `;




    const values = [


        username,

        email,

        id


    ];




    const result = await pool.query(

        query,

        values

    );



    return result.rows[0];


};









// ================================
// DELETE USER
// ================================

const deleteUser = async(id)=>{


    const query = `

        DELETE FROM users

        WHERE id=$1

        RETURNING id

    `;




    const result = await pool.query(

        query,

        [

            id

        ]

    );



    return result.rows[0];


};









module.exports = {

    createUser,

    getUsers,

    getUserById,

    updateUser,

    deleteUser


};