$(function(){
	var socket = io.connect('http://localhost:8080');

	$('.power-button').click(function(){
	  if ($(this).hasClass('on')){
	    $(this).removeClass('on');
	    socket.emit('power', '0');
	  }
	  else {
	    $(this).addClass('on');
	    socket.emit('power', '1');
	  }
	});

	$('#btn-axis-send-to').on('click', function() {
		var x = $('#x-axis-send-to').val(),
			y = $('#y-axis-send-to').val(),
			z = $('#z-axis-send-to').val(),
			sendto = [];

		sendto.push(x);
		sendto.push(y);
		sendto.push(z);

		socket.emit('sendto', sendto);
	});

    socket.on('temperature', function(temperature) {
    	$('#span-x-pos').width(temperature);
    	$('#progress-x-pos').val(temperature);
    	$('#strong-x-pos').text(temperature);
    });
});