const https = require("https");
let apiUrl = "";

const getScorecardForPeriod = async period => {
  return new Promise((resolve, reject) => {
    https
      .get(apiUrl + "&period=" + period, resp => {
        let data = "";

        // A chunk of data has been recieved.
        resp.on("data", chunk => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on("end", () => {
          var d = JSON.parse(data).commentary;
          resolve(d.items.length != 0);
        });
      })
      .on("error", err => {
        console.log("Error: " + err.message);
        reject(err);
      });
  });
};

const getNumberOfPages = async period => {
  return new Promise((resolve, reject) => {
    https
      .get(apiUrl + "&period=" + period, resp => {
        let data = "";

        // A chunk of data has been recieved.
        resp.on("data", chunk => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on("end", () => {
          var d = JSON.parse(data).commentary;
          var numberOfPages = d.pageCount;
          resolve(numberOfPages);
        });
      })
      .on("error", err => {
        console.log("Error: " + err.message);
        reject(err);
      });
  });
};

const getInitial = async () => {
  var potentialPeriod = 4;

  var haveHadPeriodYet = await getScorecardForPeriod(potentialPeriod);
  while (haveHadPeriodYet == false) {
    potentialPeriod -= 1;
    haveHadPeriodYet = await getScorecardForPeriod(potentialPeriod);
  }
  var currentPeriod = potentialPeriod;

  var numberOfPages = await getNumberOfPages(currentPeriod);

  return { currentPeriod, numberOfPages };
  // return period and number of pages
};

const getRecentBall = async () => {
  var i = await getInitial();
  var currentPeriod = i.currentPeriod;
  var numberOfPages = i.numberOfPages;

  return new Promise((resolve, reject) => {
    https
      .get(
        apiUrl + "&page=" + numberOfPages + "&period=" + currentPeriod,
        resp => {
          data = "";
          resp.on("data", chunk => {
            data += chunk;
          });
          resp.on("end", () => {
            var items = JSON.parse(data).commentary.items;

            var maxId = 0;
            var newestText = "";
            var recentScore = "";
            var overs = "";
            var id = "";

            items.forEach(item => {
              if (item.sequence > maxId) {
                maxId = item.sequence;
                newestText = item.shortText;
                recentScore = item.innings.runs + "/" + item.innings.wickets;
                overs = item.over.overs;
                id = item.id;
              }
            });
            resolve({ overs, recentScore, newestText, id });
          });
        }
      )
      .on("error", err => {
        console.log("Error: " + err.message);
        reject(err);
      });
  });
};

const setupUrl = eventUrl => {
  const urlParts = eventUrl.split("/");
  let series = null;
  let event = null;
  let seriesNext = false;
  let eventNext = false;
  urlParts.forEach(part => {
    if (seriesNext) {
      series = part;
      seriesNext = false;
    }
    if (eventNext) {
      event = part;
      eventNext = false;
    }
    if (part === "series") {
      seriesNext = true;
    }
    if (part === "game") {
      eventNext = true;
    }
  });
  if (event == null || series == null) {
    throw "Bad URL";
  }
  apiUrl =
    "https://site.web.api.espn.com/apis/site/v2/sports/cricket/" +
    series +
    "/playbyplay?contentorigin=espn&event=" +
    event +
    "&section=cricinfo";
};

exports.setupUrl = setupUrl;
exports.getRecentBall = getRecentBall;
