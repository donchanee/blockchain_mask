require('date-utils');
let d = new Date("2020-02-01");
d.addHours(9);
console.log(d);
//let time = s.toFormat('YYYY-MM-DD');
//console.log(time);
let ts = Math.floor(d.getTime()/1000);
console.log(ts);
console.log(ts + 3600*24);