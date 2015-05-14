var express = require('express');
var router = express.Router();

var redirectTo = require('./redirect-to');
var ensureAuthenticated = require('./auth/ensure-authenticated')(router);
var dbConn = require('./database-connection');

router.use(ensureAuthenticated);
router.get('/reports/:type',
    dbConn.connect,
    require('./route-reports'),
    dbConn.close
);
router.get('/:type/:id?', require('./route-index'));
router.get('/', redirectTo('/dashboard/'));

module.exports = router;
