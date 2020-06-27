const express = require('express');
const router = express.Router();
const formController = require('../controller/formController')

router.get('/', formController.handleSubmit)
router.post('/', formController.AfterSubmit)

module.exports = router;