require('dotenv').config();
const express = require('express');

const router = express.Router();
const { PutObjectCommand, GetObjectCommand} = require("@aws-sdk/client-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const REGION = "us-east-2";
const client = new S3Client({region: REGION})
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
const querystring = require('querystring'); 
const BUCKET = process.env.BUCKET;

router.get('/', async (req, res) => {
    const uuid = String(req.query.uuid);
    if (uuid.length != 36) {
        res.render('respondInput', { 
            title: 'RFC Respond'
        });
    } else {
        const command1 = new GetObjectCommand({
            Bucket: BUCKET,
            Key: uuid
        });
        try {
            const response = await client.send(command1);
            // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
            const str = await response.Body.transformToString();
            console.log(str);
            const key = `${uuidv4()}`;
            const json = JSON.parse(str);
            const titleRfc = json.title;
            const description = json.description;
            const author = json.author;
            const date = json.date;
            let responseRfc;
            if (json.response != undefined){
                responseRfc = `${json.response}<br>• ${key} - <a href="/read?uuid=${key}" class="a1">[Link]</a>`;
            } else {
                responseRfc = `<br>• ${key} - <a href="/read?uuid=${key}" class="a1">[Link]</a>`;
            }
            const text = json.text;
            const notes = json.notes;
            const jsonSend = JSON.stringify({ titleRfc, description, author, date, responseRfc, text, notes });
            const command2 = new PutObjectCommand({
                Bucket: BUCKET,
                Key: uuid,
                Body: jsonSend,
            });
            try {
                const response = await client.send(command2);
                console.log(response);
                res.render('respond', {
                    title: 'RFC Respond',
                    KEY: key,
                });
            } catch (err) {
                console.error(err);
                res.redirect('/error');
            }
        } catch (err) {
            console.error(err);
            res.redirect('/error');
        }
    }
});

router.post('/', async (req, res) => {
    console.log(req.body);
    const { title, description, author, text, notes, key } = req.body;
    const date = new Date().toISOString();
    const response = "";
    const json = JSON.stringify({ title, description, author, date, responseRfc, text, notes, key});
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

exports.respondRfc = router