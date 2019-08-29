const HTMLParser = require('node-html-parser');
const fs = require('fs');
const csvjson = require('csvjson');
const path = process.cwd();
const argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .command('mode', 'Define the post-parser input')
    .example('$0 mode -m finalizados', 'Parse the HTML data from the finalized projects')
    .alias('m', 'mode')
    .nargs('m', 1)
    .describe('m', 'Define the post parser works')
    .demandOption(['m'])
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2019')
    .argv;


let buffer, data, root;

if (argv.mode == 'finalizados') {
	buffer = fs.readFileSync(path + "\\..\\data\\tmp\\finalizados.html");

} else {
	buffer = fs.readFileSync(path + "\\..\\data\\tmp\\ativos.html");
}

data = buffer.toString();
root = HTMLParser.parse(data);

let cards = root.querySelectorAll(".card");  
let session = [];

cards.forEach((el, index, array) => {
	let cash = (el.querySelector('.card-project-stats .u-text-center-small-only .fontweight-semibold')||{}).innerHTML || "";
	let title = (el.querySelector('.link-hidden')||{}).innerHTML || "";
	let time = (el.querySelector('.card-project-stats .u-text-right .lineheight-tightest')||el.querySelector('.card-project-stats .u-text-right')||{}).innerHTML || "";
	let percentage = (el.querySelector('.card-project-stats .fontsize-base')||{}).innerHTML || "";
	let project_url = (el.querySelectorAll('.card-project-thumb')[0]).attributes.href;

	let template = {
		'title' : title,
		'percentage' : percentage,
		'project_url' : project_url,
		'cash' : cash,
		'time' : time
	}

	session.push(template);

	if(index === array.length - 1) { 
		
		const csvData = csvjson.toCSV(session, {
			headers: 'key'
		});

		fs.writeFile('../data/finalizados_data3.csv', csvData, (err) => {
			if(err) {
            	console.log(err); // Do something to handle the error or just throw it
            	throw new Error(err);
        	}
        	console.log('Success!');
    	});

	}
});