const serialport = require('serialport');
const Readline = serialport.parsers.Readline;
const axios = require('axios');

module.exports = {
    start: function (portName, serverUrl) {
        let possibilities = {};
        let current = "";

        const port = new serialport(portName, {
            baudRate: 9600,
        });

        const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

        parser.on('data', function (tick) {
            if (tick === '1' || tick === '0') {
                current += tick;
                if (!possibilities[current]) {
                    possibilities[current] = true;
                }
            }
            if (tick === 'EOM') {
                executePossibilities(possibilities);
                possibilities = {};
                current = "";
            }
        });

        function executePossibilities(possibilities) {
            for (let binary in possibilities) {
                // convert binary to bytes
                const bytes = [];
                for (let i = 0; i < binary.length; i++) {
                    bytes.push(binary[i].charCodeAt(0));
                }

                // Send the bytes to the server
                sendBytesToServer(bytes, serverUrl);
            }
        }

        function sendBytesToServer(bytes, serverUrl) {
            try {
                let data = { 'bytes': bytes};
                axios.post(serverUrl, data)
                    .then(response => {
                        console.log(`Bytes sent to server. Status: ${response.status}`);
                    })
                    .catch(error => {
                        console.log(`Error sending bytes to server: ${error}`);
                    });
            } catch (e) {
                console.log(`An error occurred: ${e}`);
            }
        }
    }
}
