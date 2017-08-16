const io = require('socket.io');
var config = require('../config.js');
const ApiAi = require('apiai')(config.APIAI_TOKEN);

module.exports = function(server) {
    const talk = io(server);
    talk.on('connection', function(socket) {
        console.log('a user connected');
    });
    talk.on('connection', function(socket) {
        socket.on('chat message', (text) => {
            // Get a reply from API.ai
            let apiaiReq = ApiAi.textRequest(text, {
                sessionId: config.APIAI_SESSION_ID
            });
            // console.log(apiaiReq)
            apiaiReq.on('response', (response) => {
                let aiText = response.result.fulfillment.speech;
                socket.emit('bot reply', aiText || "听不懂你在说什么");
            });

            apiaiReq.on('error', (error) => {
                console.log(error);
            });

            apiaiReq.end();

        });
    });
}