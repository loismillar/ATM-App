const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;
var pinNo = '';
const https = require('https');

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post('/PinCheck', function (required, response) {
    pinNo = required.body.pin;
    console.log("Pin entry:" + pinNo);

    if (pinNo != '') {

        const data = JSON.stringify({
            "pin": pinNo
        });

        const options = {
            hostname: 'frontend-challenge.screencloud-michael.now.sh',
            port: null,
            path: '/api/pin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }

        const req = https.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`);


            if (`${res.statusCode}` == 200) {
                res.on('data', d => {
                    process.stdout.write(d);
                    var obj = JSON.parse(d);
                    var bal = obj.currentBalance;
                    var str = JSON.stringify(bal);
                    console.log(str);
                    response.end(str);
                });
            }
            else {
                response.end('fail');
            };
        });

        req.on('error', error => {
            console.error(error);
        });

        req.write(data);
        req.end();
    }
});

app.post('/getBalance', function (required, response) {
    pinNo = required.body.pin;
    console.log(pinNo);
});

app.listen(port, () => console.log(`ATM app is listening on port ${port}!`));