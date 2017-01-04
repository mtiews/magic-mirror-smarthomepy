var smarthome = require('./smarthomepy-io');

function dataCallback(item, value) {
    console.log('Data received - ' + item + ': ' + value);
}

var io = smarthome.createInstance(
    { 
        host: '192.168.1.11', 
        port: '2121',
        items: ['EG_Wohnen_L_Decke.switch', 'heating.Temperatur_Aussen', 'sensors.epower_house']
    },
    dataCallback
);

io.open();

console.log('Press any key to exit');

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, 0));
