require('dotenv').config();
const express = require('express');

const router = express.Router();
const { ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const REGION = "us-east-2";
const client = new S3Client({region: REGION})
const DOMPurify = require('isomorphic-dompurify');
const BUCKET = process.env.BUCKET;

router.get('/', async (req, res) => {
    const command = new ListObjectsV2Command({
        Bucket: BUCKET,
        // The default and maximum number of keys returned is 1000.
      });
    
      try {
        let isTruncated = true;
        let contents = "";
    
        while (isTruncated) {
          const { Contents, IsTruncated, NextContinuationToken } = await client.send(command);
          const contentsList = Contents.map((c) => `${c.Key}`).join(",");
          contents += contentsList + ",";
          isTruncated = IsTruncated;
          command.input.ContinuationToken = NextContinuationToken;
        }
        let list = contents.split(",");
        list.pop();
        let filter1 = list.filter(list => list.length == 36);
        let filter = filter1.filter(filter1 => filter1 != "cyclic-db/ac81e671/stream_lambda.zip");
        contents = "";
        for (let i = 0; i < filter.length; i++) {
            contents += `• ${filter[i]} - <a href="/read?uuid=${filter[i]}" class="a1">[Link]</a><br>`;
        }
        let clean = DOMPurify.sanitize(contents);
        res.render('list',
            {
                title: 'RFC List',
                contents: clean
            }
        )
    
      } catch (err) {
        console.error(err);
      }
});
exports.list = router;