const express = require('express');

const app = express();
const path = require('path');
const { create } = require("./route/create.js");

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', { 
    title: 'RFC', 
    });
});
app.use('/create', create);

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`RFC server started on port: ${server.address().port}`);
});