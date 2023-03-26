const express = require('express');

const router = express.Router();
const AWS = require("aws-sdk");
const s3 = new AWS.S3()

router.get('/', async (req, res) => {
    const uuid = req.query.uuid;
    console.log(uuid);
    let file = await s3.getObject({
        Bucket: 'cyclic-erin-seagull-gown-us-east-2',
        Key: uuid
    }).promise()
    const json = JSON.parse(file.Body.toString());
    console.log(json.Body.toString());
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
    }
);

exports.read = router;