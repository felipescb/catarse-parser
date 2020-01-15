const Nightmare = require('nightmare');      
const csv = require('csv-parser');
const csvjson = require('csvjson'); 
const fs = require('fs');                                                                                                                                                              
const url = (project_url) => { return 'https://www.catarse.me' + project_url; }
const data =  [];

function retrieveProjectData(short_url, next)
{
    let nightmare = Nightmare(
    {
        show: false,
        waitTimeout: 5000000,
        executionTimeout: 5000000,
        loadTimeout: 5000000,
        gotoTimeout: 5000000
    });

    nightmare
    .goto(url(short_url))
    .wait('#project-about')
    .evaluate(() =>
    {
        return {
            where: document.querySelector(".project-highlight .w-hidden-tiny a").text,
            category: document.querySelector(".project-highlight .w-hidden-tiny").text,
            pledged: document.querySelector("#pledged").innerHTML,
            contributors: document.querySelector("#contributors").innerHTML,
            goal: (document.querySelector("#aon .w-col-tiny-10 .fontweight-semibold") || document.querySelector(".w-col-tiny-10 .fontweight-semibold") ||
                {}).innerHTML || "",
            type: (document.querySelector("#aon .w-col-tiny-10 .fontsize-smallest") || document.querySelector(".w-col-tiny-10 .fontsize-smallest") ||
                {}).firstChild.textContent || ""
        };
    })
    .end()
    .then((data) =>
    {
        next(data)
    })
}


let progress = [];
let stream = fs.createReadStream('../data/remove_used.csv')
.pipe(csv())
.on('data', (row) => {
    stream.pause();
    if(row.project_url != null) {
        retrieveProjectData(row.project_url, (project_data) => { 
            project_data.title = row.title;
            project_data.percentage = row.percentage;
            project_data.cash = row.cash;
            project_data.time = row.time;
            project_data.time = row.time;
            project_data.project_url = row.project_url;

            progress.push(project_data);
            console.log("Finishing: ", row.title);

            let csvData = csvjson.toCSV(progress, {
              headers: 'key'
          });

            stream.resume();
            fs.writeFile('../data/project_data_2.csv', csvData, (err) => {
              if(err) {
                        console.log(err); // Do something to handle the error or just throw it
                        //throw new Error(err);
               }
               console.log('Success!');
               stream.resume();
             })
        })
    } else {
        stream.resume();
    }
})
.on('end', () => {
 console.log('CSV file successfully processed')
})


