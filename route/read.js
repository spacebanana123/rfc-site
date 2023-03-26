const express = require('express');

const router = express.Router();
const { GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");

const REGION = "us-east-2";
const client = new S3Client({region: REGION})

router.get('/', async (req, res) => {
    const uuid = String(req.query.uuid);
    console.log(uuid);
    const command = new GetObjectCommand({
        Bucket: "cyclic-erin-seagull-gown-us-east-2",
        Key: uuid
      });
    
    try {
        const response = await client.send(command);
        // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
        const str = await response.Body.transformToString();
        console.log(str);
        const json = JSON.parse(str);
        const titleRfc = json.title;
        const description = json.description;
        const author = json.author;
        const date = json.date;
        const status = json.status;
        const text = json.text;
        const notes = json.notes;
        res.render('read', { 
            title: 'RFC Read', 
            uuid: uuid,
            titleRfc: titleRfc,
            description: description,
            author: author,
            date: date,
            status: status,
            text: text,
            notes: notes
        });
    } catch (err) {
        console.error(err);
    }  
});

exports.read = router;