$(function(){
  $('.file-upload-input').replaceWith($('.file-upload-input').clone());
  $('.file-upload-content').hide();
  $('.image-upload-wrap').show();

  
	var reader, filename;
	var socket = io.connect('http://localhost:8080');

  var machState='off';
  var x_send_to=0,y_send_to=0,z_send_to=0,
      current_x=0,current_y=0,current_z=0;
  var gcode_total_lines=0, gcode_current_line=0,percentageCompleted=0;

  machineState(machState);

	//send to server
	$('.power-button').click(function(){
	  if ($(this).hasClass('on')){
	    $(this).removeClass('on');
	    socket.emit('power', '0');
      machState='off';
	  }
	  else {
	    $(this).addClass('on');
	    socket.emit('power', '1');
      machState='on';
	  }
    machineState(machState);
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
    machState='manual';
    machineState(machState);

    x_send_to=x;
    y_send_to=y;
    z_send_to=z;
	});

  $('#btn-axis-send-to-false').on('click', function() {
    socket.emit('sendtofalse', '0');
    machineState('on');
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
        machineState('auto');
	});

    $('#btn-setpos').on('click',function(){
        socket.emit('setpos', '1');
  });


	//notifications
    socket.on('GVL_AXIS.Axis1pos', function(pos) {
    	$('#span-x-pos').width(pos);
    	$('#progress-x-pos').val(pos);
    	$('#strong-x-pos').text((pos).toFixed(2));

      current_x=pos;

      if(machState=='manual'){
        if((Math.abs(current_x-x_send_to) < 1) && (Math.abs(current_y-y_send_to)<1) && (Math.abs(current_z-z_send_to)<1)){
          machState='on';
          machineState(machState);
        }
      }
    });

    socket.on('GVL_AXIS.Axis3pos', function(pos) {
    	$('#span-y-pos').width(pos);
    	$('#progress-y-pos').val(pos);
    	$('#strong-y-pos').text((pos).toFixed(2));

      current_y=pos;
    });

    socket.on('GVL_AXIS.Axis4pos', function(pos) {
    	$('#span-z-pos').width(pos);
    	$('#progress-z-pos').val(pos);
    	$('#strong-z-pos').text((pos).toFixed(2));

      current_z=pos;
    });

    socket.on('GVL.Poweron', function(power) {
      if(power==1){
        $('#power-button').addClass('on');
        machineState('on');
      }else{
        $('#power-button').removeClass('on');
        machineState('off');
      }
    });

    socket.on('GVL_GCODE.GLINE0_STR', function(line) {
      $('#gcode-line0').text(line);
    });

    socket.on('GVL_GCODE.GLINE1_STR', function(line) {
      $('#gcode-line1').text(line);
    });

    socket.on('GVL_GCODE.GLINE2_STR', function(line) {
      $('#gcode-line2').text(line);
    });

    socket.on('GVL_GCODE.GLINE3_STR', function(line) {
      $('#gcode-line3').text(line);
    });

    socket.on('GVL_GCODE.GLINE4_STR', function(line) {
      $('#gcode-line4').text(line);
    });

    socket.on('GVL_GCODE.GLINE5_STR', function(line) {
      $('#gcode-line5').text(line);
    });

    socket.on('EXTRU_CONT.Vel_hmi', function(velocity) {
      $('#extrusion-velocity').text(velocity);
    });

    socket.on('Rea_prog.nRow', function(lines) {
      gcode_total_lines=lines;
    });

    socket.on('GVL_GCODE.Block_N', function(block) {

      gcode_current_line=block;

      if(gcode_total_lines==0 || gcode_current_line==0){
        percentageCompleted=0;
      }else{
        percentageCompleted = (gcode_current_line/gcode_total_lines) * 100;  
      }
      
      $('#percentage-completed').width(percentageCompleted);
      $('#progress-percentage-completed').val(percentageCompleted);
      $('#percentage-completed').text((percentageCompleted).toFixed(2));

      if(percentageCompleted==0){
        machineState('on');
      }
    });



    $('#btn-extrude').on('mousedown',function(){
        socket.emit('extrude', '1');
    });

    $('#btn-extrude').on('mouseup',function(){
        socket.emit('extrude', '0');
    });

    $('#btn-retract').on('mousedown',function(){
        socket.emit('retract', '1');
    });

    $('#btn-retract').on('mouseup',function(){
        socket.emit('retract', '0');
    });

    $('#btn-stop').on('click',function(){
      var confirmation = confirm("This will STOP the program execution. Do you confirm?");
      if (confirmation == true) {
          socket.emit('stop', '1');
          machineState('on');
      }
    });

    $('#btn-pause').on('click',function(){
        socket.emit('pause', '1');
        machineState('pause');
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

function machineState(state){
  if(state=='on'){
      $('#machine-state').text('ON');
      $('#machine-state').css('color', "green");
  }
  if(state=='off'){
      $('#machine-state').text('OFF');
      $('#machine-state').css('color', "red");
  }
  if(state=='manual'){
      $('#machine-state').text('MANUAL');
      $('#machine-state').css('color', "blue"); 
  }
  if(state=='auto'){
      $('#machine-state').text('AUTO');
      $('#machine-state').css('color', "blue"); 
  }
  if(state=='pause'){
      $('#machine-state').text('PAUSE');
      $('#machine-state').css('color', "yellow"); 
  }
}


function readURL(input) {
  if (input.files && input.files[0]) {

    var reader = new FileReader();

    reader.onload = function(e) {
      $('.image-upload-wrap').hide();

      $('.file-upload-image').attr('src', e.target.result);
      $('.file-upload-content').show();

      $('.image-title').html(input.files[0].name);
    };

    reader.readAsDataURL(input.files[0]);

  } else {
    removeUpload();
  }
}

function removeUpload() {
  $('.file-upload-input').replaceWith($('.file-upload-input').clone());
  $('.file-upload-content').hide();
  $('.image-upload-wrap').show();
}
$('.image-upload-wrap').bind('dragover', function () {
    $('.image-upload-wrap').addClass('image-dropping');
  });
  $('.image-upload-wrap').bind('dragleave', function () {
    $('.image-upload-wrap').removeClass('image-dropping');
});
