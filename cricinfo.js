const https = require('https');


const getRecentBall = async () => {


    return new Promise((resolve, reject) => { https.get("https://site.web.api.espn.com/apis/site/v2/sports/cricket/19430/playbyplay?contentorigin=espn&event=1185307&section=cricinfo&period=2", (resp) => {
        let data = '';
      
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          var numberOfPages = JSON.parse(data).commentary.pageCount;
          console.log(numberOfPages);
      
          https.get("https://site.web.api.espn.com/apis/site/v2/sports/cricket/19430/playbyplay?contentorigin=espn&event=1185307&page=" + numberOfPages + "&section=cricinfo&period=2", (resp) => {
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
    
                items.forEach((item) => {
                    if (item.id > maxId)
                    {
                        maxId = item.id
                        newestText = item.shortText
                        console.log(item.period + ' ' + item.homeScore + ' ' + item.awayScore);
                        if (item.period % 2 == 1)
                        {
                          recentScore = item.homeScore
                        }
                        else
                        {
                          recentScore = item.awayScore
                        }
                        overs = item.over.overs
    
                    }
                })
                resolve({ overs, recentScore, newestText });
            });
          });      
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
        reject(err);
      });
    });



}



exports.getRecentBall = getRecentBall;
