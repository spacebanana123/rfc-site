const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('create', { 
        title: 'Create RFC', 
        });
    }
);
exports.create = router;