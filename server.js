const express = require('express');

const app = express();
const path = require('path');
const { create } = require("./route/create.js");
const { read } = require("./route/read.js");
const { list } = require("./route/list.js");


app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', { 
    title: 'RFC', 
    });
});
app.use('/create', create);
app.use('/read', read);
app.use('/list', list);

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`RFC server started on port: ${server.address().port}`);
});