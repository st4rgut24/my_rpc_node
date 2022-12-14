var express = require('express');
var db = require('../db');
var helper = require('../views/helper')
var ChartMgr = require('../views/ChartMgr');

var router = express.Router();

/*
 * Get data nested with the json rpc result
 * assumes req.params maintains order of params in url
 */
function getNestedData(result, params){
	for(prop in params) {
		let key = params[prop];
		if (key !== undefined) {
			result = result[key];
		}
	}
	return result;
}

/*
 * Remove the question mark added to the end of the url when btn pressed
 * this interferes with constructing links to rpc calls in ejs file
 */
function sanitizeUrl(url) {
	let qIdx = url.indexOf('?');
	if (qIdx === -1){
		return url;
	}
	else {
		let removeStr = url.substr(qIdx);
		return url.split(removeStr)[0];
	}
}

/*
 * Set locals for ejs file such as the url, and the rpc objects
 */
function setData(req, res, rpcData) {
	// remove chart data
	res.locals.xValues = null;
	res.locals.url = sanitizeUrl(req.originalUrl);
	// no params, just use the root level result
	if (req.params.prop1 === undefined){
		res.locals.data = rpcData.result;
	}
	else {
		res.locals.data = getNestedData(rpcData.result, req.params);
	}
}

/*json rpc */
router.get('/getnetworkinfo/:prop1?/:prop2?/:prop3?', function(req, res, next) {
  if (!req.user) { return res.render('home'); }
  next();
}, helper.getNetworkInfo, function(req, res, next) { 
	setData(req, res, req.networkinfo);
	res.render('index', { user: req.user });
});

router.get('/getblockchaininfo', function(req, res, next) {
  if (!req.user) { return res.render('home'); }
  next();
}, helper.getBlockchainInfo, function(req, res, next) { 
	setData(req, res, req.blockchaininfo);
	res.render('index', { user: req.user });
});

router.get('/getpeerinfo/:prop1?/:prop2?/:prop3?', function(req, res, next) {
  if (!req.user) { return res.render('home'); }
  next();
}, helper.getPeerInfo, function(req, res, next) { 
	setData(req, res, req.peerinfo);
	res.render('index', { user: req.user });
});

router.get('/getblockstats/:prop1?/:prop2?/:prop3?', function(req, res, next) {
  if (!req.user) { return res.render('home'); }
  next();
}, helper.getBlockStats, function(req, res, next) { 
	setData(req, res, req.blockstats);
	res.render('index', { user: req.user });
});

router.get('/getmininginfo/:prop1?/:prop2?/:prop3?', function(req, res, next) {
  if (!req.user) { return res.render('home'); }
  next();
}, helper.getMiningInfo, function(req, res, next) { 
	setData(req, res, req.mininginfo);
	res.render('index', { user: req.user });
});

router.get('/getnettotals/:prop1?/:prop2?/:prop3?', function(req, res, next) {
  if (!req.user) { return res.render('home'); }
  next();
}, helper.getNetTotals, function(req, res, next) { 
	setData(req, res, req.nettotals);
	res.render('index', { user: req.user });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.user) { return res.render('home'); }
  next();
}, function(req, res, next) {
  res.locals.data = null;
  
  res.locals.xValues = JSON.stringify(ChartMgr.networkChart.xArr);
  res.locals.yValues = JSON.stringify(ChartMgr.networkChart.yArr);
  console.log('updated chart with the latest values');
  res.render('index', { user: req.user });
});

router.post('/', function(req, res, next) {
  req.body.title = req.body.title.trim();
  next();
}, function(req, res, next) {
  if (req.body.title !== '') { return next(); }
  return res.redirect('/' + (req.body.filter || ''));
});

router.post('/:id(\\d+)', function(req, res, next) {
  req.body.title = req.body.title.trim();
  next();
}, function(req, res, next) {
  if (req.body.title !== '') { return next(); }
  db.run('DELETE FROM todos WHERE id = ? AND owner_id = ?', [
    req.params.id,
    req.user.id
  ], function(err) {
    if (err) { return next(err); }
    return res.redirect('/' + (req.body.filter || ''));
  });
}, function(req, res, next) {
  db.run('UPDATE todos SET title = ?, completed = ? WHERE id = ? AND owner_id = ?', [
    req.body.title,
    req.body.completed !== undefined ? 1 : null,
    req.params.id,
    req.user.id
  ], function(err) {
    if (err) { return next(err); }
    return res.redirect('/' + (req.body.filter || ''));
  });
});

router.post('/:id(\\d+)/delete', function(req, res, next) {
  db.run('DELETE FROM todos WHERE id = ? AND owner_id = ?', [
    req.params.id,
    req.user.id
  ], function(err) {
    if (err) { return next(err); }
    return res.redirect('/' + (req.body.filter || ''));
  });
});

router.post('/toggle-all', function(req, res, next) {
  db.run('UPDATE todos SET completed = ? WHERE owner_id = ?', [
    req.body.completed !== undefined ? 1 : null,
    req.user.id
  ], function(err) {
    if (err) { return next(err); }
    return res.redirect('/' + (req.body.filter || ''));
  });
});

router.post('/clear-completed', function(req, res, next) {
  db.run('DELETE FROM todos WHERE owner_id = ? AND completed = ?', [
    req.user.id,
    1
  ], function(err) {
    if (err) { return next(err); }
    return res.redirect('/' + (req.body.filter || ''));
  });
});

module.exports = router;
