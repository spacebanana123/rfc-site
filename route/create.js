const express = require('express');

const router = express.Router();
const AWS = require("aws-sdk");
const s3 = new AWS.S3()
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
    res.render('create', { 
        title: 'Create RFC', 
        });
    }
);

router.post('/', (req, res) => {
    console.log(req.body);
    const { title, description, author, status, text, notes } = req.body;
    const date = new Date().toISOString();
    const json = JSON.stringify({ title, description, author, date, status, text, notes });
    const key = `${uuidv4()}.json`;
    console.log("Key is:" + key);
    const params = {
        Body: json,
        Bucket: 'cyclic-erin-seagull-gown-us-east-2',
        Key: key
    }
    s3.putObject(params, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
        }
    });
    const query = querystring.stringify({
        "uuid": key,
    });
    res.redirect('/read?' + query);
});
exports.create = router;