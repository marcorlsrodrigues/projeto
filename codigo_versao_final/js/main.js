$(function(){
	//var socket = io.connect('http://localhost:3000');

	var modal = document.getElementById('modal-teclado');

	// Get the button that opens the modal
	var btn = document.getElementById("img-teclado");

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];

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


