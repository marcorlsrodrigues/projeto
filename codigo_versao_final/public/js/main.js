var global_socket;
let globalfData;
let globalData_TempTabuleiro;
let globalData_TempExtrusor;
let globalData_TempAguaChiller;
let globalData_TempMotorB;
let globalData_TempQuadro;
let globalData_TempSaidaCablagem;
let globalData_TempPontoMovel;
let histograma, histograma2, histograma3, histograma4,histograma5, histograma6, histograma7, histograma8;
let arrayGrafico = [];
let graficoDesenhado = false;

function getColor(value){
	let color="black";

	if(value < 31){
	    	color = "blue";
	    }
	    else if(value >= 31 && value < 81){
	    	color="green";
	    }
	    else if(value >= 81){
	    	color="red";
	    }
	    return color;
}

function dashboard(id, fData){
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
        let calcY = 28.0-calcHeight;
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

            //color=getColor(nD["0"][1]);

            let calcHeight = (25*nD["0"][1])/80;
            let calcY = 28.0-calcHeight;
            
            // transition the height and color of rectangles.
            bars.select("rect").transition().duration(50)
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
    
    if(id==='#dashboard'){
    	histograma = hG;	
    }
    if(id==='#dashboard-temperatura-tabuleiro'){
    	histograma2 = hG;	
    }
    if(id==='#dashboard-temperatura-extrusor'){
    	histograma3 = hG;	
    }
    if(id==='#dashboard-temperatura-agua-chiller'){
    	histograma4 = hG;	
    }
    if(id==='#dashboard-temperatura-motor-b'){
    	histograma5 = hG;	
    }
    if(id==='#dashboard-temperatura-quadro'){
    	histograma6 = hG;	
    }
    if(id==='#dashboard-temperatura-saida-cablagem'){
    	histograma7 = hG;	
    }
    if(id==='#dashboard-temperatura-ponto-movel'){
    	histograma8 = hG;	
    }
}

var freqData=[
{State:'AL',freq:{low:0, mid:0, high:0}}
];

globalfData = freqData;
globalData_TempTabuleiro = freqData;
globalData_TempExtrusor = freqData;
globalData_TempAguaChiller = freqData;
globalData_TempMotorB = freqData;
globalData_TempQuadro = freqData;
globalData_TempSaidaCablagem = freqData;
globalData_TempPontoMovel = freqData;
dashboard('#dashboard',freqData);
dashboard('#dashboard-temperatura-tabuleiro',freqData);
dashboard('#dashboard-temperatura-extrusor',freqData);
dashboard('#dashboard-temperatura-agua-chiller',freqData);
dashboard('#dashboard-temperatura-motor-b',freqData);
dashboard('#dashboard-temperatura-quadro',freqData);
dashboard('#dashboard-temperatura-saida-cablagem',freqData);
dashboard('#dashboard-temperatura-ponto-movel',freqData);

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
	        $('#div-historico').empty();
	        $('#div-historico').append('<div class="div-linha"><div class="div-celula-caption"><span>Ficheiro</span></div><div class="div-celula-caption"><span>Início</span></div><div class="div-celula-caption"><span>Fim</span></div><div class="div-celula-caption"><span>Duração(mins)</span></div><div class="div-celula-caption"><span>Detalhes</span></div></div>');
	    }
	    if (event.target == modalHistoricoDetalhes) {
	        modalHistoricoDetalhes.style.display = "none";
	        $('#div-historico-detalhes').empty();
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

    function updateBar(value){
    	let color = getColor(value);
    	histograma.update(globalfData.map(function(v){ 
    	return ["AL",(value).toFixed(2)];}),color);

    	$('#span-temperatura-camara-valor').css('color',color);
    }

    socket.on('GVL.Temp_Camara', function(value) {
    	$('#span-temperatura-camara-valor').text((value).toFixed(2));

    	let color = getColor(value);
    	histograma.update(globalfData.map(function(v){ 
    	return ["AL",(value).toFixed(2)];}),color);

    	$('#span-temperatura-camara-valor').css('color',color);

    });
    socket.on('GVL.Temp_Tabuleiro', function(value) {
    	$('#span-temperatura-tabuleiro-valor').text((value).toFixed(2));
    	
    	let color = getColor(value);
    	histograma2.update(globalData_TempTabuleiro.map(function(v){ 
    	return ["AL",(value).toFixed(2)];}),color);

    	$('#span-temperatura-tabuleiro-valor').css('color',color);
    });
    socket.on('GVL.Temp_Extrusor', function(value) {
    	$('#span-temperatura-extrusor-valor').text((value).toFixed(2));
    	
    	let color = getColor(value);
    	histograma3.update(globalData_TempExtrusor.map(function(v){ 
    	return ["AL",(value).toFixed(2)];}),color);

    	$('#span-temperatura-extrusor-valor').css('color',color);
    });
    socket.on('GVL.Temp_AguaChiller', function(value) {
    	$('#span-temperatura-agua-chiller-valor').text((value).toFixed(2));
    	
    	let color = getColor(value);
    	histograma4.update(globalData_TempAguaChiller.map(function(v){ 
    	return ["AL",(value).toFixed(2)];}),color);

    	$('#span-temperatura-agua-chiller-valor').css('color',color);
    });
    socket.on('GVL.Temp_MotorB', function(value) {
    	$('#span-temperatura-motor-b-valor').text((value).toFixed(2));
    	
    	let color = getColor(value);
    	histograma5.update(globalData_TempMotorB.map(function(v){ 
    	return ["AL",(value).toFixed(2)];}),color);

    	$('#span-temperatura-motor-b-valor').css('color',color);
    });
    socket.on('GVL.Temp_Quadro', function(value) {
    	$('#span-temperatura-quadro-valor').text((value).toFixed(2));
    	
    	let color = getColor(value);
    	histograma6.update(globalData_TempQuadro.map(function(v){ 
    	return ["AL",(value).toFixed(2)];}),color);

    	$('#span-temperatura-quadro-valor').css('color',color);
    });
    socket.on('GVL.Temp_SaidaCablagem', function(value) {
    	$('#span-temperatura-saida-cablagem-valor').text((value).toFixed(2));
    	
    	let color = getColor(value);
    	histograma7.update(globalData_TempSaidaCablagem.map(function(v){ 
    	return ["AL",(value).toFixed(2)];}),color);

    	$('#span-temperatura-saida-cablagem-valor').css('color',color);
    });
    socket.on('GVL.Temp_PontoMovel', function(value) {
    	$('#span-temperatura-ponto-movel-valor').text((value).toFixed(2));

    	let color = getColor(value);
    	histograma8.update(globalData_TempPontoMovel.map(function(v){ 
    	return ["AL",(value).toFixed(2)];}),color);

    	$('#span-temperatura-ponto-movel-valor').css('color',color);
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
    	$('#div-historico').append('<div class="div-linha"><div class="div-celula" style="padding-top:15px"><span>'+obj.filename+'</span></div><div class="div-celula" style="padding-top:15px"><span>'+obj.start_date+'</span></div><div class="div-celula" style="padding-top:15px"><span>'+obj.stop_date+'</span></div><div class="div-celula" style="padding-top:15px"><span>'+obj.duration.toFixed(2)+'</span></div><div class="div-celula" style="text-align: center;"><a id="a-historicoDetalhes" href="#" data-type="a-historicoDetalhes" data-id='+obj.id+' data-filename='+obj.filename+'><img src="../img/info.png" alt="Detalhes" height="30" width="30"/></a></div></div>');
    });

    socket.on('historico_detalhes_min_temp_camara', function(data) {
    	//$('#div-historico-detalhes').append('<div class="div-linha2"><span>Temperatura Mínima da Câmara: '+data+'</span></div>');
    	$('#span-temp-camara-min').append(data);
    	desenhaGraficoDetalhes();
    });

    socket.on('historico_detalhes_max_temp_camara', function(data) {
    	//$('#div-historico-detalhes').append('<div class="div-linha2"><span>Temperatura Máxima da Câmara: '+data+'</span></div>');
    	$('#span-temp-camara-max').append(data);
    });

    socket.on('historico_detalhes_avg_temp_camara', function(data) {
    	//$('#div-historico-detalhes').append('<div class="div-linha2"><span>Temperatura Média da Câmara: '+data+'</span></div>');
    	$('#span-temp-camara-media').append(data);
    });

    socket.on('historico_detalhes_min_temp_tabuleiro', function(data) {
    	//$('#div-historico-detalhes').append('<div class="div-linha2"><span>Temperatura Mínima do Tabuleiro: '+data+'</span></div>');
    	$('#span-temp-tabuleiro-min').append(data);
    });

    socket.on('historico_detalhes_max_temp_tabuleiro', function(data) {
    	//$('#div-historico-detalhes').append('<div class="div-linha2"><span>Temperatura Máxima do Tabuleiro: '+data+'</span></div>');
    	$('#span-temp-tabuleiro-max').append(data);
    });

    socket.on('historico_detalhes_avg_temp_tabuleiro', function(data) {
    	//$('#div-historico-detalhes').append('<div class="div-linha2"><span>Temperatura Média do Tabuleiro: '+data+'</span></div>');
    	$('#span-temp-tabuleiro-media').append(data);
    });

    socket.on('historico_detalhes_min_temp_quadro', function(data) {
    	//$('#div-historico-detalhes').append('<div class="div-linha2"><span>Temperatura Mínima do Quadro: '+data+'</span></div>');
    	$('#span-temp-quadro-min').append(data);
    });

    socket.on('historico_detalhes_max_temp_quadro', function(data) {
    	//$('#div-historico-detalhes').append('<div class="div-linha2"><span>Temperatura Máxima do Quadro: '+data+'</span></div>');
    	$('#span-temp-quadro-max').append(data);
    });

    socket.on('historico_detalhes_avg_temp_quadro', function(data) {
    	//$('#div-historico-detalhes').append('<div class="div-linha2"><span>Temperatura Média do Quadro: '+data+'</span></div>');
    	$('#span-temp-quadro-media').append(data);
    });

    socket.on('historico_detalhes_min_temp_motorB', function(data) {
    	//$('#div-historico-detalhes').append('<div class="div-linha2"><span>Temperatura Mínima do Motor B: '+data+'</span></div>');
    	$('#span-temp-motor-b-min').append(data);
    });

    socket.on('historico_detalhes_max_temp_motorB', function(data) {
    	//$('#div-historico-detalhes').append('<div class="div-linha2"><span>Temperatura Máxima do Motor B: '+data+'</span></div>');
    	$('#span-temp-motor-b-max').append(data);
    });

    socket.on('historico_detalhes_avg_temp_motorB', function(data) {
    	//$('#div-historico-detalhes').append('<div class="div-linha2"><span>Temperatura Média do Motor B: '+data+'</span></div>');
    	$('#span-temp-motor-b-media').append(data);
    });

    socket.on('historico_detalhes_min_temp_extrusor', function(data) {
    	//$('#div-historico-detalhes').append('<div class="div-linha2"><span>Temperatura Mínima do Extrusor: '+data+'</span></div>');
    	$('#span-temp-extrusor-min').append(data);
    });

    socket.on('historico_detalhes_max_temp_extrusor', function(data) {
    	//$('#div-historico-detalhes').append('<div class="div-linha2"><span>Temperatura Máxima do Extrusor: '+data+'</span></div>');
    	$('#span-temp-extrusor-max').append(data);
    });

    socket.on('historico_detalhes_avg_temp_extrusor', function(data) {
    	//$('#div-historico-detalhes').append('<div class="div-linha2"><span>Temperatura Média do Extrusor: '+data+'</span></div>');
    	$('#span-temp-extrusor-media').append(data);
    });

    socket.on('historico_detalhes_min_temp_aguaChiller', function(data) {
    	//$('#div-historico-detalhes').append('<div class="div-linha2"><span>Temperatura Mínima da Água á Entrada do Chiller: '+data+'</span></div>');
    	$('#span-temp-agua-chiller-min').append(data);
    });

    socket.on('historico_detalhes_max_temp_aguaChiller', function(data) {
    	//$('#div-historico-detalhes').append('<div class="div-linha2"><span>Temperatura Máxima da Água á Entrada do Chiller: '+data+'</span></div>');
    	$('#span-temp-agua-chiller-max').append(data);
    });

    socket.on('historico_detalhes_avg_temp_aguaChiller', function(data) {
    	//$('#div-historico-detalhes').append('<div class="div-linha2"><span>Temperatura Média da Água á Entrada do Chiller: '+data+'</span></div>');
    	$('#span-temp-agua-chiller-media').append(data);
    });

    socket.on('historico_detalhes_min_temp_saidaCablagem', function(data) {
    	//$('#div-historico-detalhes').append('<div class="div-linha2"><span>Temperatura Mínima da Saída da Cablagem: '+data+'</span></div>');
    	$('#span-temp-saida-cablagem-min').append(data);
    });

    socket.on('historico_detalhes_max_temp_saidaCablagem', function(data) {
    	//$('#div-historico-detalhes').append('<div class="div-linha2"><span>Temperatura Máxima da Saída da Cablagem: '+data+'</span></div>');
    	$('#span-temp-saida-cablagem-max').append(data);
    });

    socket.on('historico_detalhes_avg_temp_saidaCablagem', function(data) {
    	//$('#div-historico-detalhes').append('<div class="div-linha2"><span>Temperatura Média da Saída da Cablagem: '+data+'</span></div>');
    	$('#span-temp-saida-cablagem-media').append(data);
    });

    socket.on('historico_detalhes_min_temp_pontoMovel', function(data) {
    	//$('#div-historico-detalhes').append('<div class="div-linha2"><span>Temperatura Mínima do Ponto Móvel: '+data+'</span></div>');
    	$('#span-temp-ponto-movel-min').append(data);
    });

    socket.on('historico_detalhes_max_temp_pontoMovel', function(data) {
    	//$('#div-historico-detalhes').append('<div class="div-linha2"><span>Temperatura Máxima do Ponto Móvel: '+data+'</span></div>');
    	$('#span-temp-ponto-movel-max').append(data);
    });

    socket.on('historico_detalhes_avg_temp_pontoMovel', function(data) {
    	//$('#div-historico-detalhes').append('<div class="div-linha2"><span>Temperatura Média do Ponto Móvel: '+data+'</span></div>');
    	$('#span-temp-ponto-movel-media').append(data);
    });

    socket.on('historico_detalhes_grafico', function(data) {
    	arrayGrafico.push(data);
    });

    var input = document.getElementsByClassName('custom-file-input');
    for (var i = 0, len = input.length; i < len; ++i) {
        var theInput = input[i].getElementsByTagName('input')[0];
        theInput.onchange = function() {
            this.parentNode.parentNode.children[0].innerHTML = this.value;
            this.title = this.value;
        };
    }


    $('#div-historico').on('click', 'a', function () {
    	let aType = $(this).data('type');
    	if(aType==='a-historicoDetalhes'){
    		let id = $(this).data('id')
    		let filename = $(this).data('filename');
    		btnHistoricoDetalhes_Click(id,filename);
    	}
    });    

});


function desenhaGraficoDetalhes(){
	if(graficoDesenhado){
		return;
	}
	$('#div-historico-detalhes-grafico').empty();
	graficoDesenhado=true;
    var margin = {top: 20, right: 20, bottom: 130, left: 50},
    width = 500 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

	var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;

	var x = d3.time.scale()
	    .range([0, width])

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom").tickFormat(d3.time.format("%Y-%m-%d %H:%M:%S"));

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var line = d3.svg.line()
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(parseFloat(d.close)); });

	var line2 = d3.svg.line()
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(parseFloat(d.temp_tabuleiro)); });

	var line3 = d3.svg.line()
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(parseFloat(d.temp_extrusor)); });

	var line4 = d3.svg.line()
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(parseFloat(d.temp_aguaChiller)); });

	var line5 = d3.svg.line()
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(parseFloat(d.temp_motorB)); });

	var line6 = d3.svg.line()
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(parseFloat(d.temp_saidaCablagem)); });

	var line7 = d3.svg.line()
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(parseFloat(d.temp_pontoMovel)); });

	var line8 = d3.svg.line()
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(parseFloat(d.temp_quadro)); });

	var svg = d3.select("#div-historico-detalhes-grafico").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  	.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	  var data = arrayGrafico.map(function(d) {
	      return {
	         date: parseDate(d[0]),
	         close: parseFloat(d[1]),
	         temp_tabuleiro:parseFloat(d[2]),
	         temp_extrusor:parseFloat(d[3]),
	         temp_aguaChiller:parseFloat(d[4]),
	         temp_motorB:parseFloat(d[5]),
	         temp_saidaCablagem:parseFloat(d[6]),
	         temp_pontoMovel:parseFloat(d[7]),
	         temp_quadro:parseFloat(d[8])
	      };
	  });

	  x.domain(d3.extent(data, function(d) { return d.date; }));
	  y.domain([0, 100]);
	  //y.domain([0, d3.max(data, function(d) { return d.close; })]);
	  //y.domain(d3.extent(data, function(d) { return d.close; }));

	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis)
	      .selectAll("text")
          .attr("y", 0)
		  .attr("x", 9)
		  .attr("dy", ".35em")
    	  .attr("transform", "rotate(60)")
    	  .style("text-anchor", "start");

	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "start")
	      .text("Temperatura");

	  svg.append("path")
	      .datum(data)
	      .attr("class", "line")
	      .style("stroke","blue")
	      .attr("d", line);

	   svg.append("path")
	      .datum(data)
	      .attr("class", "line")
	      .style("stroke","red")
	      .attr("d", line2);

	   	svg.append("path")
	      .datum(data)
	      .attr("class", "line")
	      .style("stroke","green")
	      .attr("d", line3);

	   	svg.append("path")
	      .datum(data)
	      .attr("class", "line")
	      .style("stroke","yellow")
	      .attr("d", line4);

	   	svg.append("path")
	      .datum(data)
	      .attr("class", "line")
	      .style("stroke","pink")
	      .attr("d", line5);

	   	svg.append("path")
	      .datum(data)
	      .attr("class", "line")
	      .style("stroke","violet")
	      .attr("d", line6);

	    svg.append("path")
	      .datum(data)
	      .attr("class", "line")
	      .style("stroke","black")
	      .attr("d", line7);

	   	svg.append("path")
	      .datum(data)
	      .attr("class", "line")
	      .style("stroke","orange")
	      .attr("d", line8);

	 svg.append("text")
		.attr("transform", "translate(10,-10)")
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.style("fill", "blue")
		.style("font-size", "10px")
		.text("Câmara");

	svg.append("text")
		.attr("transform", "translate(40,0)")
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.style("fill", "red")
		.style("font-size", "10px")
		.text("Tabuleiro");

	svg.append("text")
		.attr("transform", "translate(60,-10)")
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.style("fill", "green")
		.style("font-size", "10px")
		.text("Extrusor");

	svg.append("text")
		.attr("transform", "translate(90,0)")
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.style("fill", "yellow")
		.style("font-size", "10px")
		.text("Agua Chiller");

	svg.append("text")
		.attr("transform", "translate(130,-10)")
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.style("fill", "pink")
		.style("font-size", "10px")
		.text("Motor B");

	svg.append("text")
		.attr("transform", "translate(170,0)")
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.style("fill", "violet")
		.style("font-size", "10px")
		.text("Saida Cablagem");

	svg.append("text")
		.attr("transform", "translate(220,-10)")
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.style("fill", "black")
		.style("font-size", "10px")
		.text("Ponto Móvel");

	svg.append("text")
		.attr("transform", "translate(280,0)")
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.style("fill", "orange")
		.style("font-size", "10px")
		.text("Quadro");
}


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
	graficoDesenhado=false;
	$('#div-historico-detalhes-grafico').empty();
	arrayGrafico = [];
	var modalHistoricoDetalhes = document.getElementById('modal-historico-detalhes');
	modalHistoricoDetalhes.style.display = "block";
	let htmlTempCamara = '<div class="div-temp-caption">Câmara</div><div id="div-temp-camara-min">Min:<span id="span-temp-camara-min"> </span></div><div id="div-temp-camara-max">Max:<span id="span-temp-camara-max"> </span></div><div id="div-temp-camara-media">Média:<span id="span-temp-camara-media"> </span></div>';
	let htmlTempTabuleiro = '<div class="div-temp-caption">Tabuleiro</div><div id="div-temp-tabuleiro-min">Min:<span id="span-temp-tabuleiro-min"> </span></div><div id="div-temp-tabuleiro-max">Max:<span id="span-temp-tabuleiro-max"> </span></div><div id="div-temp-tabuleiro-media">Média:<span id="span-temp-tabuleiro-media"> </span></div>';
	let htmlTempExtrusor = '<div class="div-temp-caption">Extrusor</div><div id="div-temp-extrusor-min">Min:<span id="span-temp-extrusor-min"> </span></div><div id="div-temp-extrusor-max">Max:<span id="span-temp-extrusor-max"> </span></div><div id="div-temp-extrusor-media">Média:<span id="span-temp-extrusor-media"> </span></div>';
	let htmlTempAguaChiller = '<div class="div-temp-caption">Água á Entrada do Chiller</div><div id="div-temp-agua-chiller-min">Min:<span id="span-temp-agua-chiller-min"> </span></div><div id="div-temp-agua-chiller-max">Max:<span id="span-temp-agua-chiller-max"> </span></div><div id="div-temp-agua-chiller-media">Média:<span id="span-temp-agua-chiller-media"> </span></div>';
	let htmlTempMotorB = '<div class="div-temp-caption">Motor B</div><div id="div-temp-motor-b-min">Min:<span id="span-temp-motor-b-min"> </span></div><div id="div-temp-motor-b-max">Max:<span id="span-temp-motor-b-max"> </span></div><div id="div-temp-motor-b-media">Média:<span id="span-temp-motor-b-media"> </span></div>';
	let htmlTempQuadro = '<div class="div-temp-caption">Quadro</div><div id="div-temp-quadro-min">Min:<span id="span-temp-quadro-min"> </span></div><div id="div-temp-quadro-max">Max:<span id="span-temp-quadro-max"> </span></div><div id="div-temp-quadro-media">Média:<span id="span-temp-quadro-media"> </span></div>';
	let htmlTempSaidaCablagem = '<div class="div-temp-caption">Saída Cablagem</div><div id="div-temp-saida-cablagem-min">Min:<span id="span-temp-saida-cablagem-min"> </span></div><div id="div-temp-saida-cablagem-max">Max:<span id="span-temp-saida-cablagem-max"> </span></div><div id="div-temp-saida-cablagem-media">Média:<span id="span-temp-saida-cablagem-media"> </span></div>';
	let htmlTempPontoMovel = '<div class="div-temp-caption">Ponto Móvel</div><div id="div-temp-ponto-movel-min">Min:<span id="span-temp-ponto-movel-min"> </span></div><div id="div-temp-ponto-movel-max">Max:<span id="span-temp-ponto-movel-max"> </span></div><div id="div-temp-ponto-movel-media">Média:<span id="span-temp-ponto-movel-media"> </span></div>';

	$('#div-historico-detalhes').append('<div class="div-linha2"><span>Ficheiro: '+filename+' - Temperaturas</span></div>'+htmlTempCamara+htmlTempTabuleiro+htmlTempExtrusor+htmlTempAguaChiller+htmlTempMotorB+htmlTempQuadro+htmlTempSaidaCablagem+htmlTempPontoMovel);
	global_socket.emit('historico_detalhes', id);
}