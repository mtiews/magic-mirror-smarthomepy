var WebSocketClient = require('websocket').client;

function createInstance(configuration, dataCallback) {
    return new SmarthomepyIO(configuration, dataCallback);
}

function SmarthomepyIO(configuration, dataCallback) {
    this.config = configuration;
    this.callback = dataCallback;
    this.connection = null;
}

SmarthomepyIO.prototype.open = function() {
    var that = this;
    var client = new WebSocketClient();

    client.on('connectFailed', function(error) {
        console.log('SmartHome.py: Connect Error: ' + error.toString());
    });
     
    client.on('connect', function(connection) {
        that.connection = connection;
        console.log('SmartHome.py: WebSocket Client Connected');
        sendJson({
                cmd: "proto",
                ver: 3
            });
        sendJson({
                cmd: "monitor",
                items: that.config.items
            });

        connection.on('error', function(error) {
            console.log("SmartHome.py: Connection Error: " + error.toString());
        });
        connection.on('close', function() {
            console.log('SmartHome.py: Connection Closed');
        });
        connection.on('message', function(message) {
            if (message.type === 'utf8') {
                //console.log("SmartHome.py: Data Received: '" + message.utf8Data + "'");
                var data = JSON.parse(message.utf8Data);
                if(data.cmd == 'item') {
                    data.items.forEach(function(element) {
                        that.callback(element[0],element[1]);
                    });
                }
            }
        });

        function sendJson(data) {
            if (connection.connected) {
                connection.sendUTF(JSON.stringify(data));
            }
        }
    });
     
    client.connect('ws://' + this.config.host + ':' + this.config.port + '/');
}

SmarthomepyIO.prototype.close = function() {
    if(this.connection != null) {
        this.connection.close();
    }
}

module.exports.createInstance = createInstance;