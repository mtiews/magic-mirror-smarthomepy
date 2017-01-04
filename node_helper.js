var smarthomepy = require('./smarthomepy-io.js');
var NodeHelper = require('node_helper');

module.exports = NodeHelper.create({
    start: function(){
        console.log(this.name  + ' helper started!');
    },
    
    socketNotificationReceived : function(notification, payload) {
        if(notification === 'CONFIG')
        {
            var that = this;

            var config = {};
            config.host = payload.host;
            config.port = payload.port;
            config.items = [];
            payload.items.forEach(function(element) {
                config.items.push(element.item);
            });

            var io = smarthomepy.createInstance(
                config,
                function(item, value) {
                    that.sendSocketNotification('DATA_RECEIVED',{item: item, value: value});
                } 
            );
            io.open();
        }
    }
});