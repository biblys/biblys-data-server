const express = require('express');
const router  = express.Router();

router.use('/api/v0/books', require('./books'));
router.use('/api/v0/contributors', require('./contributors'));
router.use('/api/v0/publishers', require('./publishers'));
router.use('/api/v0/users', require('./users'));

module.exports = router;
