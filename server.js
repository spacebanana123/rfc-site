const express = require('express');

const app = express();

app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index', { 
    title: 'RFD', 
    });
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`RFD server started on port: ${server.address().port}`);
});