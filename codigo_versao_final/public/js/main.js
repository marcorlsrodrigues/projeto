var global_socket;
let globalfData;
let histograma;



function getColor(value){
	let color="black";

	if(value <= 30){
	    	color = "blue";
	    }
	    else if(value >= 31 && value <= 80){
	    	color="green";
	    }
	    else if(value >= 81){
	    	color="red";
	    }
	    return color;
}

function dashboard(id, fData){
	globalfData=fData;
    function segColor(c){ return {low:"#807dba", mid:"#e08214",high:"#41ab5d"}[c]; }
    
    // compute total for each state.
    fData.forEach(function(d){d.total=d.freq.low+d.freq.mid+d.freq.high;});
    
    // function to handle histogram.
    function histoGram(fD){
        var hG={},    hGDim = {t: 60, r: 0, b: 30, l: 0};
        //hGDim.w =40 - hGDim.l - hGDim.r, 
        hGDim.w =22, 
        hGDim.h = 100 - hGDim.t - hGDim.b;
            
        //create svg for histogram.
        var hGsvg = d3.select(id).append("svg")
            .attr("width", hGDim.w + hGDim.l + hGDim.r)
            //.attr("height", hGDim.h + hGDim.t + hGDim.b).append("g");
            .attr("height", "25px").append("g");

        // create function for x-axis mapping.
        var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1)
                .domain(fD.map(function(d) { return d[0]; }));

        // Add x-axis to the histogram svg.
        /*hGsvg.append("g").attr("class", "x axis")
            .attr("transform", "translate(0," + hGDim.h + ")")
            .call(d3.svg.axis().scale(x).orient("bottom"));*/

        // Create function for y-axis map.
        var y = d3.scale.linear().range([hGDim.h, 0])
                .domain([0, d3.max(fD, function(d) { return d[1]; })]);

        // Create bars for histogram to contain rectangles and freq labels.
        var bars = hGsvg.selectAll(".bar").data(fD).enter()
                .append("g").attr("class", "bar");

        let calcHeight = (25*fD["0"][1])/80;
        let calcY = 20.0-calcHeight;
        let color="white";

        color=getColor(fD["0"][1]);
        
        //create the rectangles.
        bars.append("rect")
            //.attr("x", function(d) { return x(d[0]); })
            //.attr("y", function(d) { return y(d[1]); })
            .attr("y", calcY+"px")
            .attr("width", x.rangeBand())
            //.attr("height", function(d) { return hGDim.h - y(d[1]); })
            .attr("height", calcHeight+"px")
            .attr('fill',color)
            .on("mouseover",mouseover);// mouseout is defined below.
            
        //Create the frequency labels above the rectangles.
        /*bars.append("text").text(function(d){ return d3.format(",")(d[1])})
            .attr("x", function(d) { return x(d[0])+x.rangeBand()/2; })
            .attr("y", function(d) { return y(d[1])-5; })
            .attr("text-anchor", "middle");*/
        
        function mouseover(d){  // utility function to be called on mouseover.
            // filter for selected state.
            return;
            var st = fData.filter(function(s){ return s.State == d[0];})[0],
                nD = d3.keys(st.freq).map(function(s){ return {type:s, freq:st.freq[s]};});
               
            //leg.update(nD);
        }
        
        // create function to update the bars. This will be used by pie-chart.
        hG.update = function(nD, color){
            // update the domain of the y-axis map to reflect change in frequencies.
            //y.domain([0, d3.max(nD, function(d) { return d[1]; })]);
            
            // Attach the new data to the bars.
            var bars = hGsvg.selectAll(".bar").data(nD);

            color=getColor(nD["0"][1]);

            let calcHeight = (25*nD["0"][1])/80;
            let calcY = 20.0-calcHeight;
            
            // transition the height and color of rectangles.
            bars.select("rect").transition().duration(500)
                //.attr("y", function(d) {return y(d[1]); })
                .attr("y", calcY+"px")
                //.attr("height", function(d) { return hGDim.h - y(d[1]); })
                .attr("height", calcHeight+"px")
                .attr("fill", color);

            // transition the frequency labels location and change value.
            /*bars.select("text").transition().duration(500)
                .text(function(d){ return d3.format(",")(d[1])})
                .attr("y", function(d) {return y(d[1])-5; });            */
        }        
        return hG;
    }

    // calculate total frequency by segment for all state.
    var tF = ['low','mid','high'].map(function(d){ 
        return {type:d, freq: d3.sum(fData.map(function(t){ return t.freq[d];}))}; 
    });    
    
    // calculate total frequency by state for all segment.
    var sF = fData.map(function(d){return [d.State,d.total];});

    var hG = histoGram(sF); // create the histogram.
    histograma = hG;
}


var freqData=[
{State:'AL',freq:{low:0, mid:0, high:0}}
];

dashboard('#dashboard',freqData);







$(function(){
	var socket = io.connect('http://localhost:3000');
	global_socket = socket;

	var modal = document.getElementById('modal-teclado');
	var modalHistorico = document.getElementById('modal-historico');
	var modalHistoricoDetalhes = document.getElementById('modal-historico-detalhes');

	// Get the button that opens the modal
	var btn = document.getElementById("img-teclado");
	var btnHistorico = document.getElementById("btn-historico");
	//var btnHistoricoDetalhes = document.getElementById("btn-historico-detalhes");

	// Get the <span> element that closes the modal
	var span = document.getElementById("modal-teclado-close");
	var spanHistorico = document.getElementById("modal-historico-close");
	var spanHistoricoDetalhes = document.getElementById("modal-historico-detalhes-close");
	var autoBlockNumber = 0, automatico_inicia = false;

	let machState='off';
	let ficheiroGcode=[];
	let manualModeData = [], temperaturaCamara = [], temperaturaTabuleiro = [], temperaturaExtrusor = [],
		velocidadeAvanco=[], velocidadeExtrPolimero = [],velocidadeExtrFibra=[], file_executions_table = [];

	// When the user clicks on the button, open the modal 
	btn.onclick = function() {
	    modal.style.display = "block";
	}
	btnHistorico.onclick = function() {
	    modalHistorico.style.display = "block";
	    socket.emit('historico', '1');
	}
	/*btnHistoricoDetalhes.onclick = function() {
	    modalHistoricoDetalhes.style.display = "block";
	    socket.emit('historico-detalhes', '1');
	}*/

	$('#div-historico-detalhes').on('click', '#btn-historico-detalhes', function(){
    	modalHistoricoDetalhes.style.display = "block";
    	socket.emit('historico-detalhes', '1');
	});



	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	    modal.style.display = "none";
	}

	spanHistorico.onclick = function() {
	    modalHistorico.style.display = "none";
	    $('#div-historico').empty();
	    $('#div-historico').append('<div class="div-linha"><div class="div-celula-caption"><span>Ficheiro</span></div><div class="div-celula-caption"><span>Início</span></div><div class="div-celula-caption"><span>Fim</span></div><div class="div-celula-caption"><span>Duração(mins)</span></div><div class="div-celula-caption"><span>Detalhes</span></div></div>');
	}

	spanHistoricoDetalhes.onclick = function() {
	    modalHistoricoDetalhes.style.display = "none";
	    $('#div-historico-detalhes').empty();
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	    if (event.target == modal) {
	        modal.style.display = "none";
	    }
	    if (event.target == modalHistorico) {
	        modalHistorico.style.display = "none";
	    }
	    if (event.target == modalHistoricoDetalhes) {
	        modalHistoricoDetalhes.style.display = "none";
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
	$('#btn-teclado-g').on('click',function(){
		let inputMdiGcode = $('#input-mdi-gcode').val();
		$('#input-mdi-gcode').val(inputMdiGcode+'G');
	});
	$('#btn-teclado-m').on('click',function(){
		let inputMdiGcode = $('#input-mdi-gcode').val();
		$('#input-mdi-gcode').val(inputMdiGcode+'M');
	});
	$('#btn-teclado-b').on('click',function(){
		let inputMdiGcode = $('#input-mdi-gcode').val();
		$('#input-mdi-gcode').val(inputMdiGcode+'B');
	});
	$('#btn-teclado-c').on('click',function(){
		let inputMdiGcode = $('#input-mdi-gcode').val();
		$('#input-mdi-gcode').val(inputMdiGcode+'C');
	});
	$('#btn-teclado-e').on('click',function(){
		let inputMdiGcode = $('#input-mdi-gcode').val();
		$('#input-mdi-gcode').val(inputMdiGcode+'E');
	});
	$('#btn-teclado-f').on('click',function(){
		let inputMdiGcode = $('#input-mdi-gcode').val();
		$('#input-mdi-gcode').val(inputMdiGcode+'F');
	});
	$('#btn-teclado-s').on('click',function(){
		let inputMdiGcode = $('#input-mdi-gcode').val();
		$('#input-mdi-gcode').val(inputMdiGcode+'S');
	});
	$('#btn-teclado-t').on('click',function(){
		let inputMdiGcode = $('#input-mdi-gcode').val();
		$('#input-mdi-gcode').val(inputMdiGcode+'T');
	});
	$('#btn-teclado-espaco').on('click',function(){
		let inputMdiGcode = $('#input-mdi-gcode').val();
		$('#input-mdi-gcode').val(inputMdiGcode+' ');
	});
	$('#btn-teclado-0').on('click',function(){
		let inputMdiGcode = $('#input-mdi-gcode').val();
		$('#input-mdi-gcode').val(inputMdiGcode+'0');
	});
	$('#btn-teclado-1').on('click',function(){
		let inputMdiGcode = $('#input-mdi-gcode').val();
		$('#input-mdi-gcode').val(inputMdiGcode+'1');
	});
	$('#btn-teclado-2').on('click',function(){
		let inputMdiGcode = $('#input-mdi-gcode').val();
		$('#input-mdi-gcode').val(inputMdiGcode+'2');
	});
	$('#btn-teclado-3').on('click',function(){
		let inputMdiGcode = $('#input-mdi-gcode').val();
		$('#input-mdi-gcode').val(inputMdiGcode+'3');
	});
	$('#btn-teclado-4').on('click',function(){
		let inputMdiGcode = $('#input-mdi-gcode').val();
		$('#input-mdi-gcode').val(inputMdiGcode+'4');
	});
	$('#btn-teclado-5').on('click',function(){
		let inputMdiGcode = $('#input-mdi-gcode').val();
		$('#input-mdi-gcode').val(inputMdiGcode+'5');
	});
	$('#btn-teclado-6').on('click',function(){
		let inputMdiGcode = $('#input-mdi-gcode').val();
		$('#input-mdi-gcode').val(inputMdiGcode+'6');
	});
	$('#btn-teclado-7').on('click',function(){
		let inputMdiGcode = $('#input-mdi-gcode').val();
		$('#input-mdi-gcode').val(inputMdiGcode+'7');
	});
	$('#btn-teclado-8').on('click',function(){
		let inputMdiGcode = $('#input-mdi-gcode').val();
		$('#input-mdi-gcode').val(inputMdiGcode+'8');
	});
	$('#btn-teclado-9').on('click',function(){
		let inputMdiGcode = $('#input-mdi-gcode').val();
		$('#input-mdi-gcode').val(inputMdiGcode+'9');
	});
	$('#btn-teclado-point').on('click',function(){
		let inputMdiGcode = $('#input-mdi-gcode').val();
		$('#input-mdi-gcode').val(inputMdiGcode+'.');
	});
	$('#btn-teclado-menos').on('click',function(){
		let inputMdiGcode = $('#input-mdi-gcode').val();
		$('#input-mdi-gcode').val(inputMdiGcode+'-');
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

	$('#btn-mdi-iniciar').on('click',function(){
		$('#mdi-linha-gcode5').val($('#mdi-linha-gcode4').val());
		$('#mdi-linha-gcode4').val($('#mdi-linha-gcode3').val());
		$('#mdi-linha-gcode3').val($('#mdi-linha-gcode2').val());
		$('#mdi-linha-gcode2').val($('#mdi-linha-gcode1').val());
		$('#mdi-linha-gcode1').val($('#mdi-linha-gcode').val());
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

	$('#btn-iniciar').click(function(){	  
	  socket.emit('automatico_iniciar', '1');
	});

	$('#btn-pausar').click(function(){
	  socket.emit('automatico_pausar', '1');
	});

	$('#btn-parar').click(function(){
	  automatico_inicia=false;
	  socket.emit('automatico_parar', '1');
	});

	$('#ficheiro-gcode').on('change',function(event){
		$('#nome-ficheiro').text('');
	      var file = this.files[0];
          var reader = new FileReader();      
          reader.onload = function(e) {
            text = reader.result;
            ficheiroGcode = text.split('\n');
		    //console.log(ficheiroGcode);
		    /*for(var line = 0; line < lines.length; line++){
		      console.log(lines[line]);
		    }*/
		    socket.emit('gcode_filename', file.name);
		    $('#nome-ficheiro').text(file.name);
          }

          reader.onerror = function(err) {
            console.log(err, err.loaded
                        , err.loaded === 0
                        , file);
          }

          reader.readAsText(event.target.files[0]);
	});

	$('.btn-push').on('click',function(event){
		if($(this).hasClass('btn-push')){
			if($(this).hasClass('btn-eixos')){
				$('#btn-x-manual').removeClass('lightblue');
				$('#btn-y-manual').removeClass('lightblue');
				$('#btn-z-manual').removeClass('lightblue');
				$('#btn-b-manual').removeClass('lightblue');
				$('#btn-c-manual').removeClass('lightblue');
				$('#btn-ext-manual').removeClass('lightblue');
			}

			if($(this).hasClass('btn-vel')){
				$('#btn-menoszeroum-manual').removeClass('lightblue');
				$('#btn-menosum-manual').removeClass('lightblue');
				$('#btn-menosdez-manual').removeClass('lightblue');
				$('#btn-maiszeroum-manual').removeClass('lightblue');
				$('#btn-maisum-manual').removeClass('lightblue');
				$('#btn-maisdez-manual').removeClass('lightblue');
			}

			$(this).addClass('lightblue');
		}else{
			$(this).removeClass('lightblue');
		}
	});

	$('#btn-homing-manual').on('click',function(){
		socket.emit('homing', '1');
	});

	$('#btn-homing-geral-manual').on('click',function(){
		socket.emit('homing_geral', '1');
	});

	$('#btn-mover-eixo-manual').mousedown(function(){
		let eixo = '', valor = 0, sinal = '';

		if($('#btn-x-manual').hasClass('lightblue')){
			eixo='1';
		}else if($('#btn-y-manual').hasClass('lightblue')){
			eixo='3';
		}else if($('#btn-z-manual').hasClass('lightblue')){
			eixo='2';
		}else if($('#btn-b-manual').hasClass('lightblue')){
			eixo='4';
		}else if($('#btn-c-manual').hasClass('lightblue')){
			eixo='7';
		}else if($('#btn-ext-manual').hasClass('lightblue')){
			eixo='9';
		}

		if($('#btn-menoszeroum-manual').hasClass('lightblue')){
			valor=0.1;
			sinal = 'negativo';
		}else if($('#btn-menosum-manual').hasClass('lightblue')){
			valor=1;
			sinal = 'negativo';
		}else if($('#btn-menosdez-manual').hasClass('lightblue')){
			valor=10;
			sinal = 'negativo';
		}else if($('#btn-maiszeroum-manual').hasClass('lightblue')){
			valor=0;
			sinal = 'positivo';
		}else if($('#btn-maisum-manual').hasClass('lightblue')){
			valor=1;
			sinal = 'positivo';
		}else if($('#btn-maisdez-manual').hasClass('lightblue')){
			valor=10;
			sinal = 'positivo';
		}

		manualModeData = [eixo,valor,sinal];
		socket.emit('move_eixo_manual', manualModeData);
	});

	$('#btn-mover-eixo-manual').mouseup(function(){
		manualModeData = ['',0,''];		
		socket.emit('move_eixo_manual', manualModeData);
	});

	$('#aquecimento-temperatura-camara--10').on('click',function(){
		temperaturaCamara = [10,'negativo'];
		socket.emit('temperatura_camara', temperaturaCamara);
	});

	$('#aquecimento-temperatura-camara--1').on('click',function(){
		temperaturaCamara = [1,'negativo'];
		socket.emit('temperatura_camara', temperaturaCamara);
	});

	$('#aquecimento-temperatura-camara-10').on('click',function(){
		temperaturaCamara = [10,'positivo'];
		socket.emit('temperatura_camara', temperaturaCamara);
	});

	$('#aquecimento-temperatura-camara-1').on('click',function(){
		temperaturaCamara = [1,'positivo'];
		socket.emit('temperatura_camara', temperaturaCamara);
	});

	$('#aquecimento-temperatura-tabuleiro--10').on('click',function(){
		temperaturaTabuleiro = [10,'negativo'];
		socket.emit('temperatura_tabuleiro', temperaturaTabuleiro);
	});

	$('#aquecimento-temperatura-tabuleiro--1').on('click',function(){
		temperaturaTabuleiro = [1,'negativo'];
		socket.emit('temperatura_tabuleiro', temperaturaTabuleiro);
	});

	$('#aquecimento-temperatura-tabuleiro-10').on('click',function(){
		temperaturaTabuleiro = [10,'positivo'];
		socket.emit('temperatura_tabuleiro', temperaturaTabuleiro);
	});

	$('#aquecimento-temperatura-tabuleiro-1').on('click',function(){
		temperaturaTabuleiro = [1,'positivo'];
		socket.emit('temperatura_tabuleiro', temperaturaTabuleiro);
	});

	$('#aquecimento-temperatura-extrusor--10').on('click',function(){
		temperaturaExtrusor = [10,'negativo'];
		socket.emit('temperatura_extrusor', temperaturaExtrusor);
	});

	$('#aquecimento-temperatura-extrusor--1').on('click',function(){
		temperaturaExtrusor = [1,'negativo'];
		socket.emit('temperatura_extrusor', temperaturaExtrusor);
	});

	$('#aquecimento-temperatura-extrusor-10').on('click',function(){
		temperaturaExtrusor = [10,'positivo'];
		socket.emit('temperatura_extrusor', temperaturaExtrusor);
	});

	$('#aquecimento-temperatura-extrusor-1').on('click',function(){
		temperaturaExtrusor = [1,'positivo'];
		socket.emit('temperatura_extrusor', temperaturaExtrusor);
	});

	$('#parametros-velocidade-avanco--10').on('click',function(){
		velocidadeAvanco = [10,'negativo'];
		socket.emit('velocidade_avanco', velocidadeAvanco);
	});

	$('#parametros-velocidade-avanco--1').on('click',function(){
		velocidadeAvanco = [1,'negativo'];
		socket.emit('velocidade_avanco', velocidadeAvanco);
	});

	$('#parametros-velocidade-avanco-10').on('click',function(){
		velocidadeAvanco = [10,'positivo'];
		socket.emit('velocidade_avanco', velocidadeAvanco);
	});

	$('#parametros-velocidade-avanco-1').on('click',function(){
		velocidadeAvanco = [1,'positivo'];
		socket.emit('velocidade_avanco', velocidadeAvanco);
	});

	$('#parametros-velocidade-extrusao-polimero--10').on('click',function(){
		velocidadeExtrPolimero = [10,'negativo'];
		socket.emit('velocidade_extrPolimero', velocidadeExtrPolimero);
	});

	$('#parametros-velocidade-extrusao-polimero--1').on('click',function(){
		velocidadeExtrPolimero = [1,'negativo'];
		socket.emit('velocidade_extrPolimero', velocidadeExtrPolimero);
	});

	$('#parametros-velocidade-extrusao-polimero-10').on('click',function(){
		velocidadeExtrPolimero = [10,'positivo'];
		socket.emit('velocidade_extrPolimero', velocidadeExtrPolimero);
	});

	$('#parametros-velocidade-extrusao-polimero-1').on('click',function(){
		velocidadeExtrPolimero = [1,'positivo'];
		socket.emit('velocidade_extrPolimero', velocidadeExtrPolimero);
	});

	$('#parametros-velocidade-extrusao-fibra--10').on('click',function(){
		velocidadeExtrFibra = [10,'negativo'];
		socket.emit('velocidade_extrFibra', velocidadeExtrFibra);
	});

	$('#parametros-velocidade-extrusao-fibra--1').on('click',function(){
		velocidadeExtrFibra = [1,'negativo'];
		socket.emit('velocidade_extrFibra', velocidadeExtrFibra);
	});

	$('#parametros-velocidade-extrusao-fibra-10').on('click',function(){
		velocidadeExtrFibra = [10,'positivo'];
		socket.emit('velocidade_extrFibra', velocidadeExtrFibra);
	});

	$('#parametros-velocidade-extrusao-fibra-1').on('click',function(){
		velocidadeExtrFibra = [1,'positivo'];
		socket.emit('velocidade_extrFibra', velocidadeExtrFibra);
	});

	$('#desligar-motores').on('click',function(){
		socket.emit('desligar_motores', '1');
	});

	$('#desligar-aquecimento-camara').on('click',function(){
		socket.emit('desligar_aquecimento_camara', '1');
	});

	$('#desligar-sistema-aquecimento').on('click',function(){
		socket.emit('desligar_sistema_aquecimento', '1');
	});

	$('#desligar-tudo').on('click',function(){
		socket.emit('desligar_tudo', '1');
	});

	$('#input-aquecimento-camara').on('click',function(){
		let value;
		if($(this)["0"].checked){
			value='1';
		}else{
			value='0';
		}
		socket.emit('desligar_aquecimento_camara', value);
	});

	$('#input-aquecimento-tabuleiro').on('click',function(){
		let value;
		if($(this)["0"].checked){
			value='1';
		}else{
			value='0';
		}
		socket.emit('desligar_aquecimento_tabuleiro', value);
	});

	$('#input-aquecimento-extrusor').on('click',function(){
		let value;
		if($(this)["0"].checked){
			value='1';
		}else{
			value='0';
		}
		socket.emit('desligar_aquecimento_extrusor', value);
	});

	$('#input-insuflacao-camara').on('click',function(){
		let value;
		if($(this)["0"].checked){
			value='1';
		}else{
			value='0';
		}
		socket.emit('insuflacao_ar_camara', value);
	});

	$('#input-insuflacao-eixox').on('click',function(){
		let value;
		if($(this)["0"].checked){
			value='1';
		}else{
			value='0';
		}
		socket.emit('insuflacao_ar_eixox', value);
	});

	$('#input-outros-iluminacao-camara').on('click',function(){
		let value;
		if($(this)["0"].checked){
			value='1';
		}else{
			value='0';
		}
		socket.emit('outros_iluminacao_camara', value);
	});

	$('#outros-ajuste-mesa').on('click',function(){
		socket.emit('outros_ajuste_mesa', '1');
	});

	$('#select-insuflacao-quadro').on('change',function(){
		socket.emit('insuflacao_quadro', $(this).val());
	});

	$('#btn-historicodelete').on('click',function(){
		let confirmDelete = confirm("De certeza que quer apagar todos os registos?");
		if (confirmDelete == true) {
		    socket.emit('historico_delete', '1');
		}
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
    	let color = getColor(value);
    	histograma.update(globalfData.map(function(v){ 
    	return ["AL",(value).toFixed(2)];}),color);

    	$('#span-temperatura-camara-valor').css('color',color);
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
    	let block = 0;
    	autoBlockNumber = value;
    	if(value > 0){
    		automatico_inicia=true;
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

    	if(automatico_inicia==true && value==0){
    		automatico_inicia=false;
    		socket.emit('automatico_parar', '2');
    	}
    	
    });

    socket.on('historico_resp', function(obj) {
    	$('#div-historico').append('<div class="div-linha"><div class="div-celula"><span>'+obj.filename+'</span></div><div class="div-celula"><span>'+obj.start_date+'</span></div><div class="div-celula"><span>'+obj.stop_date+'</span></div><div class="div-celula"><span>'+obj.duration.toFixed(2)+'</span></div><div class="div-celula"><button id="btn-historicoDetalhes" data-id='+obj.id+' onclick="btnHistoricoDetalhes_Click(\''+obj.id+'\',\''+obj.filename+'\')">Detalhes</button></div></div>');
    });

    socket.on('historico_detalhes_min_temp_camara', function(data) {
    	$('#div-historico-detalhes').append('<div class="div-linha"><span>Temperatura da Câmara Mínima: '+data+'</span></div>');
    });

    socket.on('historico_detalhes_max_temp_camara', function(data) {
    	$('#div-historico-detalhes').append('<div class="div-linha"><span>Temperatura da Câmara Máxima: '+data+'</span></div>');
    });

    socket.on('historico_detalhes_avg_temp_camara', function(data) {
    	$('#div-historico-detalhes').append('<div class="div-linha"><span>Temperatura da Câmara Média: '+data+'</span></div>');
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



function btnHistoricoDetalhes_Click(id,filename){
	var modalHistoricoDetalhes = document.getElementById('modal-historico-detalhes');
	modalHistoricoDetalhes.style.display = "block";
	$('#div-historico-detalhes').append('<div class="div-linha"><span>Ficheiro: '+filename+'</span></div>');
	global_socket.emit('historico_detalhes', id);
}