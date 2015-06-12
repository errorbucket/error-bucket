var express = require('express');
var router = express.Router();

var redirectTo = require('./redirect-to');
var db = require('./database');
var ensureAuthenticated = require('./auth/ensure-authenticated')(router);

router.use(ensureAuthenticated);
router.get('/reports/:type',
    db.connect,
    require('./route-reports'),
    db.close
);
router.get('/:type/:id?', require('./route-index'));
router.get('/', redirectTo('/dashboard/'));

module.exports = router;
