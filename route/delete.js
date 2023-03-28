require('dotenv').config();
const express = require('express');

const router = express.Router();
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const REGION = "us-east-2";
const client = new S3Client({ region: REGION })
const bodyParser = require('body-parser');
router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
const BUCKET = process.env.BUCKET;


router.use((req, res, next) => {

  // -----------------------------------------------------------------------
  // authentication middleware

  const auth = { login: process.env.LOGIN || "Test", password: process.env.PASSWORD || "Password" } // change this

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
  res.render('delete', {
    title: 'RFC Delete'
  });
});

router.post('/', async (req, res) => {
  const uuid = String(req.body.uuid);
  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: uuid,
  });

  try {
    const response = await client.send(command);
    console.log(response);
    res.render('deleted', {
      title: 'RFC Deleted',
      uuid: uuid
    });
  } catch (err) {
    console.error(err);
    res.redirect('/error');
  }
  
});
  exports.deleteRfc = router;