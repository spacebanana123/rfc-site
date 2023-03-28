require('dotenv').config();
const express = require('express');

const router = express.Router();
const { GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const REGION = "us-east-2";
const client = new S3Client({region: REGION})
const DOMPurify = require('isomorphic-dompurify');
const marked = require('marked');
const BUCKET = process.env.BUCKET;

router.get('/', async (req, res) => {
    const uuid = String(req.query.uuid);
    if (uuid.length != 36) {
        res.render('readInput', { 
            title: 'RFC Read'
        });
    } else {
        console.log(uuid);
        const command = new GetObjectCommand({
            Bucket: BUCKET,
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
            const cleanMarkdown = DOMPurify.sanitize(marked.parse(text));
            res.render('read', { 
                title: 'RFC Read', 
                uuid: uuid,
                titleRfc: titleRfc,
                description: description,
                author: author,
                date: date,
                status: status,
                text: cleanMarkdown,
                notes: notes
            });
        } catch (err) {
            console.error(err);
        }  
    }
});

exports.read = router;