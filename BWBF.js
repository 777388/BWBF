const serialport = require('serialport');
const Readline = serialport.parsers.Readline;

module.exports = {
    start: function (portName) {
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

                // Open the bytes in a new tab
                openBytesInTab(bytes);
            }
        }

        function openBytesInTab(bytes) {
            try {
                let binary = new Uint8Array(bytes);
                let file = new Blob([binary], {type: "application/octet-stream"});
                let url = URL.createObjectURL(file);
                window.open(url, "_blank");
            } catch (e) {
                console.log(`An error occurred: ${e}`);
            }
        }
    }
}
