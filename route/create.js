require('dotenv').config();
const express = require('express');

const router = express.Router();
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const REGION = "us-east-2";
const client = new S3Client({region: REGION})
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
const querystring = require('querystring'); 
const BUCKET = process.env.BUCKET;

router.get('/', (req, res) => {
    res.render('create', { 
        title: 'Create RFC', 
        });
    }
);

router.post('/', async (req, res) => {
    console.log(req.body);
    const { title, description, author, text, notes } = req.body;
    const date = new Date().toISOString();
    const responseRfc = "";
    const json = JSON.stringify({ title, description, author, date, responseRfc, text, notes });
    const key = `${uuidv4()}`;
    console.log("Key is:" + key);
    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: json,
    });
    try {
        const response = await client.send(command);
        console.log(response);
    } catch (err) {
        console.error(err);
        res.redirect('/error');
    }
    const query = querystring.stringify({
        "uuid": key,
    });
    res.redirect('/read?' + query);
});
exports.create = router;