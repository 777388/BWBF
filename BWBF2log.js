const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

app.use(bodyParser.json());

app.post('/log', (req, res) => {
    const { output, type, httpCode } = req.body;
    const date = new Date();
    let filename = `${date.toISOString()}-${type}.log`;
    if (httpCode) {
        filename = `${date.toISOString()}-${type}-${httpCode}.log`;
    }
    fs.appendFile(`/path/to/logs/${filename}`, `${output}\n`, (err) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
