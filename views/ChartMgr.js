var Chart = require('./chart');
var rpc = require('./rpc');

var ChartMgr = {
	networkChart: new Chart(60, 12, rpc.getNetworkInfo.bind(rpc), 'connections_in')
};

module.exports = ChartMgr;
