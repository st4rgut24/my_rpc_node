var RpcClient = require('bitcoind-rpc');

var config = {
protocol: 'http',
user: process.env.RPC_USER,
pass: process.env.RPC_PASS,
host: '127.0.0.1',
port: '8332',
};

// config can also be an url, e.g.:
// var config = 'http://user:pass@127.0.0.1:18332';

var rpc = new RpcClient(config);

var txids = [];

function getLatestBlockHash(req, res, next, callback) {
	rpc.getBlockCount(function(err,ret) {
		if (err) {
			console.error(err);
			return setTimeout(getBlockStats, 10000);
		}
		console.log('block height', ret.result);
		rpc.getBlockHash(ret.result, function(err,ret) {
			console.log('block hash', ret.result);
			callback(ret.result);
		});
	});
}

module.exports = {
	getNetworkInfo: function (req, res, next) {
		rpc.getNetworkInfo(function(err, ret) {
		  if (err) {
			console.error(err);
			return setTimeout(getNetworkInfo, 10000);
		  }
		  req.networkinfo = ret;
		  next();
		})
	},
	getBlockchainInfo: function (req, res, next) {
		rpc.getBlockchainInfo(function(err, ret) {
		  if (err) {
			console.error(err);
			return setTimeout(getBlockchainInfo, 10000);
		  }
		  req.blockchaininfo = ret;
		  next();
		})
	},
	getPeerInfo: function (req, res, next) {
		rpc.getPeerInfo(function(err, ret) {
		  if (err) {
			console.error(err);
			return setTimeout(getPeerInfo, 10000);
		  }
		  req.peerinfo = ret;
		  next();
		})
	},
	getBlockStats: function (req, res, next) {
		getLatestBlockHash(req, res, next, function(latestBlockHash) {
			rpc.getBlockStats(latestBlockHash, function(err, ret) {
			  if (err) {
				console.error(err);
				return setTimeout(getBlockStats, 10000);
			  }
			  console.log('block stats', ret);
			  req.blockstats = ret;
			  next();
			})
		});
	},
	getMiningInfo: function (req, res, next) {
		rpc.getMiningInfo(function(err, ret) {
		  if (err) {
			console.error(err);
			return setTimeout(getPeerInfo, 10000);
		  }
		  req.mininginfo = ret;
		  next();
		})
	},
	getNetTotals: function (req, res, next) {
		rpc.getNetTotals(function(err, ret) {
		  if (err) {
			console.error(err);
			return setTimeout(getPeerInfo, 10000);
		  }
		  req.nettotals = ret;
		  next();
		})
	}
}
