require('dotenv').config();
const express = require('express');

const app = express();
const path = require('path');
const { create } = require("./route/create.js");
const { read } = require("./route/read.js");
const { list } = require("./route/list.js");
const { deleteRfc } = require("./route/delete.js");
const { error } = require("./route/error.js");
const { respondRfc } = require("./route/respond.js");
const BUCKET = process.env.BUCKET;
exports.BUCKET = BUCKET;

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
  res.render('index', { 
    title: 'RFC', 
    });
  next()
});
app.use('/create', create);
app.use('/read', read);
app.use('/list', list);
app.use('/delete', deleteRfc);
app.use('/error', error);
app.use('/respond', respondRfc);

app.use(function(req, res, next) {
  res.status(404);
  res.render('404', {
    title: '404'
  });
});


const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`RFC server started on port: ${server.address().port}`);
});