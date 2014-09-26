$(function() {
 
    if (!window.WebSocket) {
        $('#last').html("No socket support!");
    }

    var socket = io();


    $('#send').click(function() {
        socket.emit('message', $('#message').val());
    });

    socket.on('connect', function() {
        console.log('started');
        socket.emit('id', location.pathname.substring(1));
    });

    $('#message').keydown(function(e) {
        if (e.keyCode == 13) {
            $('#send').click();
        }
    });

    socket.on('update', function(message) {
        if (message == "" || message == null) {
            return;
        }
        $('#lastlink').html(message);
        $('#lastlink').attr('href', message);

        $('#video').html('');
        $('#container').removeAttr('style');
        
        
        if (message.match(/youtube.com|youtu.be/)) {
            var code = message.match(/watch\?v=(.*)/)[1];
            if (!code) {
                return;
            }
            $('#video').html(
                '<iframe width="960" height="480" src="//www.youtube.com/embed/'+code+'?autoplay=1" frameborder="0" allowfullscreen></iframe>'
            );
        } else if (message.match(/(mp3|acc|mp4|avi|ogg)$/)) {
            $('#video').html(
                '<video controls="controls" width="960" height="480"><source src="'+message+'"></video>'
            );
        } else {
            $('#container').css('background-image', 'url('+message+')');
        }

    });
})
