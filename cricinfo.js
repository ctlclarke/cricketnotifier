const https = require('https');
let apiUrl = "";

const getRecentBall = async () => {

    return new Promise((resolve, reject) => { https.get(apiUrl, (resp) => {
        let data = '';
      
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          var numberOfPages = JSON.parse(data).commentary.pageCount;
      
          https.get(apiUrl, (resp) => {
            data = '';
            resp.on('data', (chunk) => {
                data += chunk;
              });
            resp.on('end', () => {
                var items = JSON.parse(data).commentary.items;
    
                var maxId = 0
                var newestText = ""
                var recentScore = ""
                var overs = ""
                var id = ""
    
                items.forEach((item) => {
                    if (item.sequence > maxId)
                    {
                        maxId = item.sequence
                        newestText = item.shortText
                        if (item.period % 2 == 1)
                        {
                          recentScore = item.homeScore
                        }
                        else
                        {
                          recentScore = item.awayScore
                        }
                        overs = item.over.overs
                        id = item.id
    
                    }
                })
                resolve({ overs, recentScore, newestText, id });
            });
          });      
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
        reject(err);
      });
    });



}

const setupUrl = (eventUrl) => {
  const urlParts = eventUrl.split("/");
  let series = null;
  let event = null;
  let seriesNext = false;
  let eventNext = false;
  urlParts.forEach(part => {
    if(seriesNext) {
      series = part;
      seriesNext = false;
    }
    if(eventNext) {
      event = part;
      eventNext = false;
    }
    if(part === 'series') {
      seriesNext = true;
    }
    if(part === 'game') {
      eventNext = true;
    }
  });
  if(event == null || series == null) {
    throw 'Bad URL';
  }
  apiUrl = "https://site.web.api.espn.com/apis/site/v2/sports/cricket/" + series + "/playbyplay?contentorigin=espn&event=" + event + "&section=cricinfo";
}

exports.setupUrl = setupUrl;
exports.getRecentBall = getRecentBall;
