$(function(){
	var reader, filename;
	var socket = io.connect('http://localhost:8080');

	//send to server
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

	$('#gcode-file').on('change',function(event){
		  var file = this.files[0];
      filename = file.name;
          /*var reader = new FileReader();      
          reader.onload = function(e) {
            text = reader.result;
          }

          reader.onerror = function(err) {
            console.log(err, err.loaded
                        , err.loaded === 0
                        , file);
          }

          reader.readAsText(event.target.files[0]);*/
	});

	$('#btn-gcode-file').on('click',function(){
		// do stuff with `text`: `reader.result` from `addDoc`
        socket.emit('gcode', filename);
	});


	//notifications
    socket.on('MoveAxisToSet_X.SET_X_POS_MR', function(pos) {
    	$('#span-x-pos').width(pos);
    	$('#progress-x-pos').val(pos);
    	$('#strong-x-pos').text(pos);
    });

    socket.on('MoveAxisToSet_Y.SET_Y_POS_MR', function(pos) {
    	$('#span-y-pos').width(pos);
    	$('#progress-y-pos').val(pos);
    	$('#strong-y-pos').text(pos);
    });

    socket.on('MoveAxisToSet_Z.SET_Z_POS_MR', function(pos) {
    	$('#span-z-pos').width(pos);
    	$('#progress-z-pos').val(pos);
    	$('#strong-z-pos').text(pos);
    });
});


 function readSingleFile(file) {
    //Retrieve the first (and only!) File from the FileList object
    var f = file; 

    if (f) {
      var r = new FileReader();
      r.onload = function(e) { 
	      var contents = e.target.result;
        alert( "Got the file.n" 
              +"name: " + f.name + "n"
              +"type: " + f.type + "n"
              +"size: " + f.size + " bytesn"
              + "starts with: " + contents.substr(1, contents.indexOf("n"))
        );  
        console.log(f.result);
      }
      r.readAsText(f);
      r.loadend = function(e){
      	console.log(r.result);
      }
    } else { 
      alert("Failed to load file");
    }
}