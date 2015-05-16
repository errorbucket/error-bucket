var express = require('express');
var router = express.Router();

var redirectTo = require('./redirect-to');
var ensureAuthenticated = require('./auth/ensure-authenticated')(router);

router.use(ensureAuthenticated);
router.get('/reports/:type', require('./route-reports'));
router.get('/:type/:id?', require('./route-index'));
router.get('/', redirectTo('/dashboard/'));

module.exports = router;
