$(function(){
	var socket = io.connect('http://localhost:3000');

	var modal = document.getElementById('modal-teclado');

	// Get the button that opens the modal
	var btn = document.getElementById("img-teclado");

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];

	let machState='off';
	let ficheiroGcode=[];

	// When the user clicks on the button, open the modal 
	btn.onclick = function() {
	    modal.style.display = "block";
	}

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	    modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	    if (event.target == modal) {
	        modal.style.display = "none";
	    }
	}

	$('#btn-teclado-x').on('click',function(){
		let inputMdiGcode = $('#input-mdi-gcode').val();
		$('#input-mdi-gcode').val(inputMdiGcode+'X');
	});
	$('#btn-teclado-y').on('click',function(){
		let inputMdiGcode = $('#input-mdi-gcode').val();
		$('#input-mdi-gcode').val(inputMdiGcode+'Y');
	});
	$('#btn-teclado-z').on('click',function(){
		let inputMdiGcode = $('#input-mdi-gcode').val();
		$('#input-mdi-gcode').val(inputMdiGcode+'Z');
	});

	$('#btn-teclado-apaga').on('click',function(){
		$('#input-mdi-gcode').val('');
	});

	$('#btn-teclado-apaga-ultimo').on('click',function(){
		let str = $('#input-mdi-gcode').val();
		if(str.length > 0){
			let newStr = str.substring(0, str.length - 1);
			$('#input-mdi-gcode').val(newStr);
		}
	});

	$('#btn-teclado-executa').on('click',function(){
		let spanMdiGcode = $('#input-mdi-gcode').val();
		$('#table-mdi-gcode').append('<tr><td>'+spanMdiGcode+'</td></tr>');
		$('#mdi-linha-gcode').val(spanMdiGcode);
	});

	$('#btn-tab-automatic').addClass('active');
	$('#btn-tab-aquecimento').addClass('active');
	$('#Automatic').css('display','block');
	$('#Aquecimento').css('display','block');

	machineState(machState);

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

	$('#ficheiro-gcode').on('change',function(event){
		var file = this.files[0];
          var reader = new FileReader();      
          reader.onload = function(e) {
            text = reader.result;
            ficheiroGcode = text.split('\n');
		    //console.log(ficheiroGcode);
		    /*for(var line = 0; line < lines.length; line++){
		      console.log(lines[line]);
		    }*/
		    console.log(file.name);
		    socket.emit('gcode_filename', file.name);
          }

          reader.onerror = function(err) {
            console.log(err, err.loaded
                        , err.loaded === 0
                        , file);
          }

          reader.readAsText(event.target.files[0]);
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

    socket.on('CncHmiData.PlcHmiData.Channel[0].Axis[0].actCmdPosition', function(actCmdPosition) {
        $('#span-x-pos').width(actCmdPosition);
    	$('#progress-x-pos').val(actCmdPosition);
    	$('#strong-x-pos').text((actCmdPosition).toFixed(2));
    });

    socket.on('CncHmiData.PlcHmiData.Channel[0].Axis[1].actCmdPosition', function(actCmdPosition) {
        $('#span-z-pos').width(actCmdPosition);
    	$('#progress-z-pos').val(actCmdPosition);
    	$('#strong-z-pos').text((actCmdPosition).toFixed(2));
    });

    socket.on('CncHmiData.PlcHmiData.Channel[0].Axis[2].actCmdPosition', function(actCmdPosition) {
        $('#span-y-pos').width(actCmdPosition);
    	$('#progress-y-pos').val(actCmdPosition);
    	$('#strong-y-pos').text((actCmdPosition).toFixed(2));
    });

    socket.on('CncHmiData.PlcHmiData.Channel[0].Axis[3].actCmdPosition', function(actCmdPosition) {
        $('#span-b-pos').width(actCmdPosition);
    	$('#progress-b-pos').val(actCmdPosition);
    	$('#strong-b-pos').text((actCmdPosition).toFixed(2));
    });

    socket.on('CncHmiData.PlcHmiData.Channel[0].Axis[4].actCmdPosition', function(actCmdPosition) {
        $('#span-c-pos').width(actCmdPosition);
    	$('#progress-c-pos').val(actCmdPosition);
    	$('#strong-c-pos').text((actCmdPosition).toFixed(2));
    });

    socket.on('GVL.Vel_Avanco', function(value) {
    	$('#span-velocidade-avanco-valor').text((value).toFixed(2));
    });
    socket.on('GVL.Vel_ExtrusaoPolimero', function(value) {
    	$('#span-velocidade-extrusao-polimero-valor').text((value).toFixed(2));
    });
    socket.on('GVL.Vel_ExtrusaoFibra', function(value) {
    	$('#span-velocidade-extrusao-fibra-valor').text((value).toFixed(2));
    });
    socket.on('GVL.Vel_PolimeroTrabalho', function(value) {
    	$('#span-velocidade-polimero-trabalho-valor').text((value).toFixed(2));
    });
    socket.on('GVL.Vel_FibraTrabalho', function(value) {
    	$('#span-velocidade-fibra-trabalho-valor').text((value).toFixed(2));
    });

    socket.on('GVL.Temp_Camara', function(value) {
    	$('#span-temperatura-camara-valor').text((value).toFixed(2));
    });
    socket.on('GVL.Temp_Tabuleiro', function(value) {
    	$('#span-temperatura-tabuleiro-valor').text((value).toFixed(2));
    });
    socket.on('GVL.Temp_Extrusor', function(value) {
    	$('#span-temperatura-extrusor-valor').text((value).toFixed(2));
    });
    socket.on('GVL.Temp_AguaChiller', function(value) {
    	$('#span-temperatura-agua-chiller-valor').text((value).toFixed(2));
    });
    socket.on('GVL.Temp_MotorB', function(value) {
    	$('#span-temperatura-motor-b-valor').text((value).toFixed(2));
    });
    socket.on('GVL.Temp_Quadro', function(value) {
    	$('#span-temperatura-quadro-valor').text((value).toFixed(2));
    });
    socket.on('GVL.Temp_SaidaCablagem', function(value) {
    	$('#span-temperatura-saida-cablagem-valor').text((value).toFixed(2));
    });
    socket.on('GVL.Temp_PontoMovel', function(value) {
    	$('#span-temperatura-ponto-movel-valor').text((value).toFixed(2));
    });

    socket.on('GVL.block_number',function(value){
    	console.log(value);
    	let block = 0;
    	if(value > 0){
    		block = value - 1;
    		$('#linha-gcode-1').val(ficheiroGcode[block]);
    		$('#linha-gcode-2').val(ficheiroGcode[block+1]);
    		$('#linha-gcode-3').val(ficheiroGcode[block+2]);
    		$('#linha-gcode-4').val(ficheiroGcode[block+3]);
    		$('#linha-gcode-5').val(ficheiroGcode[block+4]);
    	}else{
    		$('#linha-gcode-1').val('');
    		$('#linha-gcode-2').val('');
    		$('#linha-gcode-3').val('');
    		$('#linha-gcode-4').val('');
    		$('#linha-gcode-5').val('');
    	}
    	
    });

    var input = document.getElementsByClassName('custom-file-input');
    for (var i = 0, len = input.length; i < len; ++i) {
        var theInput = input[i].getElementsByTagName('input')[0];
        theInput.onchange = function() {
            this.parentNode.parentNode.children[0].innerHTML = this.value;
            this.title = this.value;
        };
    }
});


function abreModoOperacao(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

function abreParametros(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent2");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks2");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
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
