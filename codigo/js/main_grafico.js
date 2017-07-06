    var buffer = [];
    var minBufferSize = 50;
    var maxBufferSize = 299;
    var clientInterval = null;
    var rebuffer = true;
    var serverUpdates = 1;
    var clientUpdates = 100;
    var data = [];
var res = [];

$(function(){
	var reader, filename;
	var socket = io.connect('http://localhost:8080');
    var http = location.protocol;
    var slashes = http.concat("//");
    var host = slashes.concat(window.location.hostname);



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

    $('#btn-axis-send-to-false').on('click', function() {
    socket.emit('sendtofalse', '0');
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

    $('#btn-setpos').on('click',function(){
        socket.emit('setpos', '1');
  });


	//notifications
    socket.on('GVL_AXIS.Axis1pos', function(pos) {
    	$('#span-x-pos').width(pos);
    	$('#progress-x-pos').val(pos);
    	$('#strong-x-pos').text((pos).toFixed(2));
    });

    socket.on('GVL_AXIS.Axis3pos', function(pos) {
    	$('#span-y-pos').width(pos);
    	$('#progress-y-pos').val(pos);
    	$('#strong-y-pos').text((pos).toFixed(2));
    });

    socket.on('GVL_AXIS.Axis4pos', function(pos) {
    	$('#span-z-pos').width(pos);
    	$('#progress-z-pos').val(pos);
    	$('#strong-z-pos').text((pos).toFixed(2));
    });

    socket.on('GVL.Poweron', function(power) {
      if(power==1){
        $('#power-button').addClass('on');
      }else{
        $('#power-button').removeClass('on');
      }
    });

    socket.on('chart-interval', function (point) {
        /*if(data.length==0){
            data.push(point);  
        }else if(data.length <= maxBufferSize){
            data.splice(0,1);
            data.push(point);  
        }*/

        if(res.length==0){
          res.push([0, point]);
        }else if(res.length < maxBufferSize){
            res.push([res.length-1, point]);  
        }else if(res.length == maxBufferSize){
          res.splice(0,1);
          res.push([res.length-1, point]);
        }

        if(buffer.length == 0) {
            rebuffer = true;
        } else if(buffer.length > maxBufferSize){
            rebuffer = false;
        }
        if(buffer.length <= maxBufferSize) {
            buffer.push(res);
        }
    });
    
    clientInterval = setInterval(function () {
        repaintGraph();
    },clientUpdates);


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
        socket.emit('stop', '0');
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


    function repaintGraph() {
      console.log('buffer.length:'+buffer.length);
      console.log('res.length:'+res.length);
        //$("#buffer").text(Math.floor(buffer.length / maxBufferSize * 100));
        if (!repaintGraph.init && buffer.length > 0) {
            repaintGraph.init = true;

            repaintGraph.plot = $.plot("#placeholder-chart", [ buffer.shift() ], {
                series: {
                    shadowSize: 0 // Drawing is faster without shadows
                },
                yaxis: {
                    min: 500,
                    max: 700
                },
                xaxis: {
                    show: false
                }
            });
        } else if (!rebuffer && buffer.length > 0) {
            //If we don't have data, then we have to re-buffer
            //so there's nothing new to draw.
            repaintGraph.plot.setData([buffer.shift()]);
            repaintGraph.plot.draw();
        }
    }