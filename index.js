const notificationService = require('./notification-service');
const path = require('path');
const cricinfo = require('./cricinfo')

let message = {};

async function demo() {

  console.log('Updating..')

  const oldMessage = message;
  message = await cricinfo.getRecentBall();
  
  if(oldMessage == {} || message.id != oldMessage.id) {

    notificationService.notify(
      {
        title: message.overs + ' - ' + message.recentScore,
        message: message.newestText,
        icon: path.join(__dirname, 'cricket.png'), // Absolute path (doesn't work on balloons)
        sound: false, // Only Notification Center or Windows Toasters
        wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
      },
      function(err, response) {
        // Response is response from notification
        console.log("DONE")
      }
    );
  } else {
    console.log('nothing new');
  }
}

var args = process.argv.slice(2);
var url = args[0];
if(url == undefined) {
  throw "You must supply a url";
}
cricinfo.setupUrl(url);
demo();
setInterval(demo, 10000);