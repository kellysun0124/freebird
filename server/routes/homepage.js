import dotenv from 'dotenv'
import express from 'express'
import mysql from 'mysql2/promise'
import { Storage } from '@google-cloud/storage';

const storage = new Storage({ keyFilename: './key.json' });
const bucketName = 'clippy_bird-2';
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

const readUsersImagesQuery = `
    SELECT * FROM IMAGE
    WHERE USER_ID = ?;
`

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

const deleteImageQuery = `
    DELETE FROM IMAGE
    WHERE USER_ID = ? AND IMAGE_ID = ?;
`

// get all images from a user
// -> homepage/username
router.get("/:USER_ID", async (req, res) => {
    const { USER_ID } = req.params;
    
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(readUsersImagesQuery, [USER_ID]);
        connection.release();

        const imagesWithUrlsPromises = rows.map(async (image) => {
            const file = storage.bucket(bucketName).file(image.IMAGE_NAME);
            const [signedUrl] = await file.getSignedUrl({
                action: 'read',
                expires: Date.now() + 1 * 60 * 1000, // 1 minute
            });
            return { ...image, SIGNED_URL: signedUrl };
        });

        const imagesWithUrls = await Promise.all(imagesWithUrlsPromises);

        res.json(imagesWithUrls);
    } catch (error) {
        console.error("Error retrieving images: ", error);
        res.status(500).json({ error: "Internal Server Error"});
    }
});

// update an images location
// -> homepage/username/100000000016/IMAGE_LOCATION
router.patch("/:USER_ID/:IMAGE_ID/IMAGE_LOCATION", async (req, res) => {
    const { USER_ID, IMAGE_ID } = req.params;
    const { IMAGE_LOCATION } = req.body;

    try {
        const connection = await pool.getConnection();
        const [result] = await connection.query(
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
        const connection = await pool.getConnection();
        const [result] = await connection.query(
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
        const connection = await pool.getConnection();
        const [result] = await connection.query(
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

// const deleteImageQuery = `
//     DELETE FROM IMAGE
//     WHERE USER_ID = ? AND IMAGE_ID = ?;
// `

// delete image
// -> homepage/username/100000000016
router.delete("/:USER_ID/:IMAGE_ID", async (req, res) => {
    const { USER_ID, IMAGE_ID } = req.params;

    try {
        const connection = await pool.getConnection();
        const [result] = await connection.query(
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