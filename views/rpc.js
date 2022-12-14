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

module.exports = rpc;
