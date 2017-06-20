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
});