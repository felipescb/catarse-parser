const Nightmare = require('nightmare');      
const nightmare = Nightmare({ show: false, waitTimeout: 10000 });                                                                                                                                                                
const vo = require('vo');     

const loadMore = 'a[href="#loadMore"]';
const url = 'https://www.catarse.me/explore?ref=ctrse_header'

vo(run)(function(err, result) {
  if (err) throw err;
});

function* run() {
  let MAX_PAGE = 45;
  let currentPage = 0;
  let nextExists = true;
  let cards = [];

  yield nightmare
    .goto(url)
    .wait(loadMore)
    .click(loadMore)
    .wait(loadMore)

  nextExists = yield nightmare.visible(loadMore);

  while (nextExists && currentPage < MAX_PAGE) {
    if((currentPage + 1) == MAX_PAGE)
    { 
      cards.push(yield nightmare
        .evaluate(function() {
          return [].slice.call(document.querySelectorAll(".card")).map((c) => c.outerHTML);
        }));
    }
    
    yield nightmare
      .click(loadMore)
      .wait(loadMore)

    console.log(++currentPage);
    nextExists = yield nightmare.visible(loadMore);
  }

  let fs = require('fs');
  fs.writeFile ("cards2.html", cards, function(err) {
    if (err) throw err;
    console.log('complete');
  });

  yield nightmare.end();
}