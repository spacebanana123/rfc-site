const express = require('express');

const router = express.Router();
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const REGION = "us-east-2";
const client = new S3Client({region: REGION})
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
const querystring = require('querystring'); 


router.use((req, res, next) => {

    // -----------------------------------------------------------------------
    // authentication middleware
  
    const auth = {login: process.env.LOGIN || "Test", password: process.env.PASSWORD || "Password"} // change this
  
    // parse login and password from headers
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')
  
    // Verify login and password are set and correct
    if (login && password && login === auth.login && password === auth.password) {
      // Access granted...
      return next()
    }
  
    // Access denied...
    res.set('WWW-Authenticate', 'Basic realm="401"') // change this
    res.status(401).send('Authentication required.') // custom message
  
    // -----------------------------------------------------------------------
  
  })

router.get('/', (req, res) => {
    res.render('deleteInput', { 
        title: 'RFC Delete'
    });
});

exports.delete = router;