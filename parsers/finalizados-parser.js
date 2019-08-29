const Nightmare = require('nightmare');
const nightmare = Nightmare({
    show: false,
    waitTimeout: 7500000,
    executionTimeout: 5000000,
    loadTimeout: 5000000,
    gotoTimeout: 5000000
});
const vo = require('vo');

const loadMore = 'a[href="#loadMore"]';
const url = 'https://www.catarse.me/explore?ref=ctrse_header'
const savePath = '../data/tmp/finalizados.html'
const partialSavePath = '../data/tmp/finalizados_part.html'

const cards = [];
let progress;

vo(run)(function(err, result) {
    if (err) {
        let fs = require('fs');
        fs.writeFile(partialSavePath, progress, function(_err) {
            if (_err) throw err;
            console.log('complete');
        });
        console.log(err);
    }
});

function* run() {
    let MAX_PAGE = 2377;
    let currentPage = 0;
    let nextExists = true;

    yield nightmare
        .goto(url)
        .wait('.explore-filter-wrapper:last-child .explore-span-filter .inline-block')
        .click('.explore-filter-wrapper:last-child .explore-span-filter .inline-block')
        .wait('.explore-filter-select > a:nth-last-of-type(2)')
        .click('.explore-filter-select > a:nth-last-of-type(2)')
        .wait(loadMore)
        .click(loadMore)
        .wait(loadMore)

    nextExists = yield nightmare.visible(loadMore);

    while (nextExists && (currentPage <= MAX_PAGE)) {

        yield nightmare
            .click(loadMore)
            .wait(loadMore)

        console.log(currentPage);

        if (currentPage > 2370) {
            progress = (yield nightmare
                .evaluate(function() {
                    return [].slice.call(document.querySelectorAll(".card")).map((c) => c.outerHTML);
                }));
        }

        if ((currentPage++) == MAX_PAGE) {
            console.log("saving data");
            cards.push(yield nightmare
                .evaluate(function() {
                    return [].slice.call(document.querySelectorAll(".card")).map((c) => c.outerHTML);
                }));
        }

        nextExists = yield nightmare.visible(loadMore);
    }

    let fs = require('fs');
    fs.writeFile(savePath, cards, function(err) {
        if (err) throw err;
        console.log('complete');
    });

    yield nightmare.end();
}