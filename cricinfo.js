const https = require('https');


const getRecentBall = async () => {


    https.get("https://site.web.api.espn.com/apis/site/v2/sports/cricket/19430/playbyplay?contentorigin=espn&event=1185307&period=1&section=cricinfo", (resp) => {
        let data = '';
      
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          var numberOfPages = JSON.parse(data).commentary.pageCount;
      
      
          https.get("https://site.web.api.espn.com/apis/site/v2/sports/cricket/19430/playbyplay?contentorigin=espn&event=1185307&page=" + numberOfPages + "&period=1&section=cricinfo", (resp) => {
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
                          recentScore = item.homeScore
                          overs = item.over.overs
      
                      }
                  })
      
      
                  return { overs, recentScore, newestText }
      
      
      
              })
          })
      
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });



}



exports.getRecentBall = getRecentBall;