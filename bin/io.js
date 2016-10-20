var sio = require('socket.io');
var io = null;

exports.io = function () {
    return io;
};

exports.initialize = function(server) {
    io = sio(server);

    io.on('connection', function(socket) {
        // Producer.startProducer();
        /*ditconsumer.start(function(value){
         io.emit('ditConsumer',value);
         });*/
        socket.on('createlogfile', function() {
            logsRecording.userLogs(function(filename) {
                socket.emit('filename', filename);
            });

        });
        socket.on('startrecording', function(filename) {
            console.log('response after creating file', filename);
            logsRecording.recordLogs(filename);
            //value that will be send it to file
        });
    });
};