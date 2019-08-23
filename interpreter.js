const HTMLParser = require('node-html-parser');
const fs = require('fs');
const path = process.cwd();
const buffer = fs.readFileSync(path + "\\finalizados.html");
const csvjson = require('csvjson');		

const data = buffer.toString();
const root = HTMLParser.parse(data);

//console.log(root.querySelectorAll(".w-row"));

let cards = root.querySelectorAll(".card");  
let session = [];

cards.forEach((el, index, array) => {
	let cash = (el.querySelector('.card-project-stats .u-text-center-small-only .fontweight-semibold')||{}).innerHTML || "";
	let title = (el.querySelector('.link-hidden')||{}).innerHTML || "";
	let time = (el.querySelector('.card-project-stats .u-text-right .lineheight-tightest')||el.querySelector('.card-project-stats .u-text-right')||{}).innerHTML || "";
	let percentage = (el.querySelector('.card-project-stats .fontsize-base')||{}).innerHTML || "";

	let template = {
		'title' : title,
		'percentage' : percentage,
		'cash' : cash,
		'time' : time
	}

	session.push(template);

	if(index === array.length - 1) { 
		
		const csvData = csvjson.toCSV(session, {
			headers: 'key'
		});

		fs.writeFile('./finalizados_data.csv', csvData, (err) => {
			if(err) {
            	console.log(err); // Do something to handle the error or just throw it
            	throw new Error(err);
        	}
        	console.log('Success!');
    	});

	}
});