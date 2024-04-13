<<<<<<< HEAD
import express from 'express'
import { getConnection } from '../server.js';


const router = express.Router()

=======
import dotenv from 'dotenv'
import express from 'express'
import mysql from 'mysql2/promise'

const router = express.Router()
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
>>>>>>> main

const readUsersImagesQuery = `
    SELECT * FROM IMAGE
    WHERE USER_ID = ?;
`

<<<<<<< HEAD
=======
const createImageQuery = `
    INSERT INTO IMAGE (USER_ID, FILE_LOCATION, DATE_TIME, IMAGE_LOCATION, IMAGE_NAME, SPECIES) 
    VALUES (?, ?, ?, ?, ?, ?);
`

>>>>>>> main
const updateImageNameQuery = `
    UPDATE IMAGE
    SET IMAGE_NAME = ?
    WHERE USER_ID = ? AND IMAGE_ID = ?;
`

const updateImageLocationQuery = `
    UPDATE IMAGE
    SET IMAGE_LOCATION = ?
    WHERE USER_ID = ? AND IMAGE_ID = ?;
`

const updateImageSeciesQuery = `
    UPDATE IMAGE
    SET SPECIES = ?
    WHERE USER_ID = ? AND IMAGE_ID = ?;
`

<<<<<<< HEAD
const deleteImageQuery = `
    DELETE FROM IMAGE
    WHERE USER_ID = ? AND IMAGE_ID = ?;
`

=======
>>>>>>> main
// get all images from a user
// -> homepage/username
router.get("/:USER_ID", async (req, res) => {
    const { USER_ID } = req.params;
    
    try {
<<<<<<< HEAD
        const connection = await getConnection();
        const [rows] = await connection.execute(readUsersImagesQuery, [USER_ID]);
        connection.release();

=======
        const connection = await pool.getConnection();
        const [rows] = await connection.query(readUsersImagesQuery, [USER_ID]);
        connection.release();
>>>>>>> main
        res.json(rows);
    } catch (error) {
        console.error("Error retrieving images: ", error);
        res.status(500).json({ error: "Internal Server Error"});
    }
});

<<<<<<< HEAD
=======
// create an image
// -> homepage/username
router.post("/:USER_ID", async (req, res) => {
    const { USER_ID } = req.params;
    const { FILE_LOCATION, DATE_TIME, IMAGE_LOCATION, IMAGE_NAME, SPECIES } = req.body;
    
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.query(
            createImageQuery,
            [USER_ID, FILE_LOCATION, DATE_TIME, IMAGE_LOCATION, IMAGE_NAME, SPECIES]
        );
        connection.release();
        res.status(201).json({
            message: "Image created successfully",
            imageId: result.insertId
        });
    } catch (error) {
        console.error("Error creating image: ", error);
        res.status(500).json({ error: "Internal Server Error"});
    }
});

>>>>>>> main
// update an images location
// -> homepage/username/100000000016/IMAGE_LOCATION
router.patch("/:USER_ID/:IMAGE_ID/IMAGE_LOCATION", async (req, res) => {
    const { USER_ID, IMAGE_ID } = req.params;
    const { IMAGE_LOCATION } = req.body;

    try {
<<<<<<< HEAD
        const connection = await getConnection();
        const [result] = await connection.execute(
=======
        const connection = await pool.getConnection();
        const [result] = await connection.query(
>>>>>>> main
            updateImageLocationQuery,
            [IMAGE_LOCATION, USER_ID, IMAGE_ID]
        );
        connection.release();

        res.status(200).json({
            message: "Image column updated successfully",
            imageId: IMAGE_ID
        });
    } catch (error) {
        console.error(`Error updating image location's value: `, error);
        res.status(500).json({ error: "Internal Server Error"});
    }

});

// update an images name
// -> homepage/username/100000000016/IMAGE_NAME
router.patch("/:USER_ID/:IMAGE_ID/IMAGE_NAME", async (req, res) => {
    const { USER_ID, IMAGE_ID } = req.params;
    const { IMAGE_NAME } = req.body;

    try {
<<<<<<< HEAD
        const connection = await getConnection();
        const [result] = await connection.execute(
=======
        const connection = await pool.getConnection();
        const [result] = await connection.query(
>>>>>>> main
            updateImageNameQuery,
            [IMAGE_NAME, USER_ID, IMAGE_ID]
        );
        connection.release();

        res.status(200).json({
            message: "Image column updated successfully",
            imageId: IMAGE_ID
        });
    } catch (error) {
        console.error(`Error updating image name's value: `, error);
        res.status(500).json({ error: "Internal Server Error"});
    }

});

// update an images species
// -> homepage/username/100000000016/SPECIES
router.patch("/:USER_ID/:IMAGE_ID/SPECIES", async (req, res) => {
    const { USER_ID, IMAGE_ID } = req.params;
    const { SPECIES } = req.body;

    try {
<<<<<<< HEAD
        const connection = await getConnection();
        const [result] = await connection.execute(
=======
        const connection = await pool.getConnection();
        const [result] = await connection.query(
>>>>>>> main
            updateImageSeciesQuery,
            [SPECIES, USER_ID, IMAGE_ID]
        );
        connection.release();

        res.status(200).json({
            message: "Image column updated successfully",
            imageId: IMAGE_ID
        });
    } catch (error) {
        console.error(`Error updating species' value: `, error);
        res.status(500).json({ error: "Internal Server Error"});
    }

});

<<<<<<< HEAD
=======
const deleteImageQuery = `
    DELETE FROM IMAGE
    WHERE USER_ID = ? AND IMAGE_ID = ?;
`

>>>>>>> main
// delete image
// -> homepage/username/100000000016
router.delete("/:USER_ID/:IMAGE_ID", async (req, res) => {
    const { USER_ID, IMAGE_ID } = req.params;

    try {
<<<<<<< HEAD
        const connection = await getConnection();
        const [result] = await connection.execute(
=======
        const connection = await pool.getConnection();
        const [result] = await connection.query(
>>>>>>> main
            deleteImageQuery,
            [USER_ID, IMAGE_ID]
        );
        connection.release();

        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Image not found "});
        } else {
            res.status(200).json({
                message: "Image deleted successfully",
                imageId: IMAGE_ID
            });
        }

    } catch (error) {
        console.error("Error deleting image: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;