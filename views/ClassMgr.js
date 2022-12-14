var Chart = require('./chart');
var rpc = require('./rpc');

var ClassMgr = {
	networkChart: new Chart(60, 12, rpc.getNetworkInfo, 'connections_in');
};

module.exports = ClassMgr;
