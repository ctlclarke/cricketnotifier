const notifier = require('node-notifier');

const notify = (notificationObject) => {
    notifier.notify(notificationObject, null);
    
    notifier.on('click', function(notifierObject, options, event) {
    // Triggers if `wait: true` and user clicks notification
    });
    
    notifier.on('timeout', function(notifierObject, options) {
    // Triggers if `wait: true` and notification closes
    });
}

exports.notify = notify;

