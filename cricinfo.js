const https = require('https');


const getScorecardForPeriod = async (url, period) => {
    return new Promise((resolve, reject) => { https.get(url + "&period=" + period, (resp) => {
        let data = '';
      
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          var d = JSON.parse(data).commentary;
           resolve(d.items.length != 0);

              
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
        reject(err);
      });
    });
}

const getNumberOfPages = async (url, period) => {
    return new Promise((resolve, reject) => { https.get(url + "&period=" + period, (resp) => {
        let data = '';
      
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            var d = JSON.parse(data).commentary;
            var numberOfPages = d.pageCount;
            resolve(numberOfPages);

              
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
        reject(err);
      });
    });
}


const getInitial = async (url) => {

    var potentialPeriod = 4

    var haveHadPeriodYet = await getScorecardForPeriod(url, potentialPeriod)
    do {
        potentialPeriod -= 1
        haveHadPeriodYet = await getScorecardForPeriod(url, potentialPeriod)
    } while (haveHadPeriodYet == false)
    var currentPeriod = potentialPeriod
    
    var numberOfPages = await getNumberOfPages(url, currentPeriod)

    return { currentPeriod, numberOfPages }
    // return period and number of pages
}



const getRecentBall = async (url) => {


    var i = await getInitial(url)
    var currentPeriod = i.currentPeriod
    var numberOfPages = i.numberOfPages

    return new Promise((resolve, reject) => { https.get(url + "&page=" + numberOfPages + "&period=" + currentPeriod, (resp) => {

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
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
        reject(err);
      });
    });



}

getRecentBall("https://site.web.api.espn.com/apis/site/v2/sports/cricket/19430/playbyplay?contentorigin=espn&event=1185307&section=cricinfo")



exports.getRecentBall = getRecentBall;
