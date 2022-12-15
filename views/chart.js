var helper = require('./helper');
var rpc = require('./rpc');

const MS_IN_SEC = 1000;
const SEC_IN_MIN = 60;

class Chart {	
	/**
	 * interval		the duration at which data is collected in minutes
	 * length		the total duration over which data is displayed
	 * rpcFn		the rpc function called to retrieve the data
	 * propArr			the prop belonging to result of calling rpcFn that 
	 * 				contains the value of interest
	 */
	constructor(interval, length, rpcFn, propArr, title){
		this.length = length;
		this.interval = interval;
		this.title = title;
		this.initData();
		
		let msDuration = interval * MS_IN_SEC * SEC_IN_MIN;
		console.log('interval length', msDuration);
		setInterval(this.pollInterval, msDuration, rpcFn, propArr, this.xArr, this.yArr, this.yArr2, this.formatAMPM);
	}
	
	/*
	 * At every interval we poll node for data returned by rpc function
	 */
	pollInterval(rpcFn, propArr, xArr, yArr, yArr2, timeFn) {
		console.log('polling ...');
		rpcFn(function(err, ret) {
		  if (err) {
			console.error(err);
			return setTimeout(pollInterval, 10000);
		  }
			
			// remove the first elements of the arrays
			xArr.shift();
			yArr.shift();
			yArr2.shift();
			
			// add the new elements
			let time = timeFn(new Date());
			xArr.push(time);
			
			let yVal = ret.result[propArr[0]];
			let yVal2 = ret.result[propArr[1]];

			console.log('time', time);
			console.log('value', yVal);
			console.log('value2', yVal2);
			yArr.push(yVal);
			yArr2.push(yVal2);
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
		this.yArr2 = [];
		this.xArr = [];
		for (let i=0;i<this.length;i++){
			this.yArr.push(0);
			this.yArr2.push(0);
			this.xArr.push(0);
		}
	}
}

module.exports = Chart;
