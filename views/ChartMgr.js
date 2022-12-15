var Chart = require('./chart');
var rpc = require('./rpc');

var ChartMgr = {
	networkChart: new Chart(30, 12, rpc.getNetworkInfo.bind(rpc), ['connections_in','connections_out'], "connections")
};

module.exports = ChartMgr;
