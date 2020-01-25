const notificationService = require('./notification-service');
const path = require('path');
const cricinfo = require('./cricinfo')

async function demo() {

  const message = await cricinfo.getRecentBall();
  console.log(message);

  notificationService.notify(
    {
      title: message.overs + ' - ' + message.recentScore,
      message: message.newestText,
      icon: path.join(__dirname, 'coulson.jpg'), // Absolute path (doesn't work on balloons)
      sound: true, // Only Notification Center or Windows Toasters
      wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
    },
    function(err, response) {
      // Response is response from notification
      console.log("DONE")
    }
  );
}

demo();