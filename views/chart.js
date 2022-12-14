var helper = require('./helper');
var rpc = require('./rpc');

const MS_IN_SEC = 1000;
const SEC_IN_MIN = 60;

class Chart {	
	/**
	 * interval		the duration at which data is collected in minutes
	 * length		the total duration over which data is displayed
	 * rpcFn		the rpc function called to retrieve the data
	 * prop			the prop belonging to result of calling rpcFn that 
	 * 				contains the value of interest
	 */
	constructor(interval, length, rpcFn, prop){
		this.length = length;
		this.interval = interval;
		this.initData();
		
		let msDuration = interval * MS_IN_SEC * SEC_IN_MIN;
		setInterval(this.pollInterval, msDuration, rpcFn, prop, this.xArr, this.yArr, this.formatAMPM);
	}
	
	/*
	 * At every interval we poll node for data returned by rpc function
	 */
	pollInterval(rpcFn, prop, xArr, yArr, timeFn) {
		console.log('polling ...');
		rpcFn(function(err, ret) {
		  if (err) {
			console.error(err);
			return setTimeout(pollInterval, 10000);
		  }
			
			// remove the first elements of the arrays
			xArr.shift();
			yArr.shift();
			
			// add the new elements
			let time = timeFn(new Date());
			xArr.push(time);
			
			let yVal = ret.result[prop];
			yArr.push(yVal);
		})
	}
	
	formatAMPM(date) {
	  var hours = date.getHours();
	  var minutes = date.getMinutes();
	  var ampm = hours >= 12 ? 'pm' : 'am';
	  hours = hours % 12;
	  hours = hours ? hours : 12; // the hour '0' should be '12'
	  minutes = minutes < 10 ? '0'+minutes : minutes;
	  var strTime = hours + ':' + minutes + ' ' + ampm;
	  return strTime;
	}	
	
	// when we first create a chart, populate it with dummy data
	initData() {
		this.yArr = [];
		this.xArr = [];
		for (let i=0;i<this.length;i++){
			this.yArr.push(0);
			this.xArr.push(0);
		}
	}
}

module.exports = Chart;
