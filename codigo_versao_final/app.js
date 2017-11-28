var ads = require('ads');
//var http = require('http');
var fs = require('fs');
var randomizer = require('./randomizer');
var url = require('url');
var client;
var data = [];
var res = [];
var machineState = '';
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

var options = {
	//The IP or hostname of the target machine 
    //host: "192.168.200.113", 
    host: "192.168.200.20", 
    //The NetId of the target machine 
    //amsNetIdTarget: "10.1.35.204.1.1",
    amsNetIdTarget: "192.168.200.20.1.1",
    //The NetId of the source machine. 
    //You can choose anything in the form of x.x.x.x.x.x, 
    //but on the target machine this must be added as a route. 
    //amsNetIdSource: "192.168.137.50.1.1",
    amsNetIdSource: "192.168.200.20.1.2",
 
    //OPTIONAL: (These are set by default)  
    //The tcp destination port 
    //port: 48898 
    //The ams source port 
    //amsPortSource: 32905 
    //The ams target port 
    amsPortTarget: 851 
}

var hl_Poweron = {
    symname: 'GVL.Poweron',  
    bytelength: ads.BOOL,  
    propname: 'value'      
};

var hl_CncHmiData = {
	symname: 'CncHmiData.PlcHmiData.Channel[0].Axis[0].actCmdPosition',  
    bytelength: ads.STRING,  
    propname: 'value'
}

var hl_xActPos = {
	symname: 'CncHmiData.PlcHmiData.Channel[0].Axis[0].actCmdPosition',  
    bytelength: ads.LREAL,  
    propname: 'value'
}

var hl_yActPos = {
	symname: 'CncHmiData.PlcHmiData.Channel[0].Axis[2].actCmdPosition',  
    bytelength: ads.LREAL,  
    propname: 'value'
}

var hl_zActPos = {
	symname: 'CncHmiData.PlcHmiData.Channel[0].Axis[1].actCmdPosition',  
    bytelength: ads.LREAL,  
    propname: 'value'
}

var hl_bActPos = {
	symname: 'CncHmiData.PlcHmiData.Channel[0].Axis[3].actCmdPosition',  
    bytelength: ads.LREAL,  
    propname: 'value'
}

var hl_cActPos = {
	symname: 'CncHmiData.PlcHmiData.Channel[0].Axis[4].actCmdPosition',  
    bytelength: ads.LREAL,  
    propname: 'value'
}

var hl_VelAvanco = {
    symname: 'GVL.Vel_Avanco',  
    bytelength: ads.LREAL,  
    propname: 'value'      
};

var hl_VelExtrusaoPolimero = {
    symname: 'GVL.Vel_ExtrusaoPolimero',  
    bytelength: ads.LREAL,  
    propname: 'value'      
};

var hl_VelExtrusaoFibra = {
    symname: 'GVL.Vel_ExtrusaoFibra',  
    bytelength: ads.LREAL,  
    propname: 'value'      
};

var hl_VelPolimeroTrabalho = {
    symname: 'GVL.Vel_PolimeroTrabalho',  
    bytelength: ads.LREAL,  
    propname: 'value'      
};

var hl_VelFibraTrabalho = {
    symname: 'GVL.Vel_FibraTrabalho',  
    bytelength: ads.LREAL,  
    propname: 'value'      
};

var hl_TempCamara = {
    symname: 'GVL.Temp_Camara',  
    bytelength: ads.LREAL,  
    propname: 'value'      
};

var hl_TempTabuleiro = {
    symname: 'GVL.Temp_Tabuleiro',  
    bytelength: ads.LREAL,  
    propname: 'value'      
};

var hl_TempExtrusor = {
    symname: 'GVL.Temp_Extrusor',  
    bytelength: ads.LREAL,  
    propname: 'value'      
};

var hl_TempAguaChiller = {
    symname: 'GVL.Temp_AguaChiller',  
    bytelength: ads.LREAL,  
    propname: 'value'      
};

var hl_TempMotorB = {
    symname: 'GVL.Temp_MotorB',  
    bytelength: ads.LREAL,  
    propname: 'value'      
};

var hl_TempQuadro = {
    symname: 'GVL.Temp_Quadro',  
    bytelength: ads.LREAL,  
    propname: 'value'      
};

var hl_TempSaidaCablagem = {
    symname: 'GVL.Temp_SaidaCablagem',  
    bytelength: ads.LREAL,  
    propname: 'value'      
};

var hl_TempPontoMovel = {
    symname: 'GVL.Temp_PontoMovel',  
    bytelength: ads.LREAL,  
    propname: 'value'      
};

var hl_BlockNumber = {
    symname: 'GVL.block_number',  
    bytelength: ads.DINT,  
    propname: 'value'      
};

var hl_File = {
    symname: 'GVL.gvl_sprogramname',  
    bytelength: ads.STRING,  
    propname: 'value'      
};

var hl_FileStart = {
    symname: 'GVL.gvl_bstate_start',  
    bytelength: ads.BOOL,  
    propname: 'value'      
};

var hl_ModeAuto = {
    symname: 'HLI_CncChannel.pChannel^.Mode.Auto',  
    bytelength: ads.BOOL,  
    propname: 'value'      
};

var hl_AutomaticoPausar = {
    symname: 'GVL.gvl_automaticstop',  
    bytelength: ads.BOOL,  
    propname: 'value'      
};

var hl_AutomaticoReset = {
    symname: 'GVL.gvl_automaticreset',  
    bytelength: ads.BOOL,  
    propname: 'value'      
};

var hl_AutomaticoSelected = {
    symname: 'GVL.gvl_automaticselected',  
    bytelength: ads.BOOL,  
    propname: 'value'      
};

var hl_Homing = {
    symname: 'GVL.gvl_homing',  
    bytelength: ads.BOOL,  
    propname: 'value'      
};

var hl_HomingGeral = {
    symname: 'GVL.gvl_hominggeral',  
    bytelength: ads.BOOL,  
    propname: 'value'      
};

var hl_PlcManualModeSelectedAxis = {
    symname: 'Global_Variables.PlcManualModeSelectedAxis',  
    bytelength: ads.UINT,  
    propname: 'value'      
};

var hl_PlcManualModeRightKey = {
    symname: 'Global_Variables.PlcManualModeRightKey',  
    bytelength: ads.BOOL,  
    propname: 'value'      
};

var hl_PlcManualModeLeftKey = {
    symname: 'Global_Variables.PlcManualModeLeftKey',  
    bytelength: ads.BOOL,  
    propname: 'value'      
};

var hl_PlcManualModeSpeed = {
    symname: 'Global_Variables.PlcManualModeSpeed',  
    bytelength: ads.UDINT,  
    propname: 'value'      
};

var hl_DesligarMotores = {
    symname: 'GVL.gvl_desligarmotores',  
    bytelength: ads.BOOL,  
    propname: 'value'      
};

var hl_DesligarAquecimentoCamara = {
    symname: 'GVL.gvl_desligaraquecimentocamara',  
    bytelength: ads.BOOL,  
    propname: 'value'      
};

var hl_DesligarSistemaAquecimento = {
    symname: 'GVL.gvl_desligarsistemaaquecimento',  
    bytelength: ads.BOOL,  
    propname: 'value'      
};

var hl_DesligarTudo = {
    symname: 'GVL.gvl_desligartudo',  
    bytelength: ads.BOOL,  
    propname: 'value'      
};

var hl_AquecimentoTabuleiro = {
    symname: 'GVL.gvl_aquecimentotabuleiro',  
    bytelength: ads.BOOL,  
    propname: 'value'      
};

var hl_AquecimentoExtrusor = {
    symname: 'GVL.gvl_aquecimentoextrusor',  
    bytelength: ads.BOOL,  
    propname: 'value'      
};



function setValue(){
	client.read(hl_Poweron, function(err, handle) {
		console.log('reading...');
        //result is the myHandle object with the new properties filled in 
        console.log(handle.value);
        //All handles will be released automaticly here 
    });
}

function setValue2(){
	console.log('testing...');
        //result is the myHandle object with the new properties filled in 
        //All handles will be released automaticly here 
}

function automatic_pausar_false(){
    hl_AutomaticoPausar.value = '0';
    client.write(hl_AutomaticoPausar, function(err,handle) {
        console.log('err: '+ err);
        client.read(hl_AutomaticoPausar, function(err, handle) {
            console.log(err);
        });
    });
}

function homing_false(){
    hl_Homing.value = '0';
    client.write(hl_Homing, function(err,handle) {
        console.log('err: '+ err);
        client.read(hl_Homing, function(err, handle) {
            console.log(err);
        });
    });
}

function homing_geral_false(){
    hl_HomingGeral.value = '0';
    client.write(hl_HomingGeral, function(err,handle) {
        console.log('err: '+ err);
        client.read(hl_HomingGeral, function(err, handle) {
            console.log(err);
        });
    });
}


function automatic_selected_true(){
	hl_AutomaticoSelected.value = '1';
    client.write(hl_AutomaticoSelected, function(err,handle) {
        console.log('err: '+ err);
        client.read(hl_AutomaticoSelected, function(err, handle) {
            console.log(err);
        });
    });

    setTimeout(automatic_selected_false, 2000); 
}

function automatic_selected_false(){
	hl_AutomaticoSelected.value = '0';
    client.write(hl_AutomaticoSelected, function(err,handle) {
        console.log('err: '+ err);
        client.read(hl_AutomaticoSelected, function(err, handle) {
            console.log(err);
        });
    });
}

function automatic_reset_false(){
	hl_AutomaticoReset.value = '0';
    client.write(hl_AutomaticoReset, function(err,handle) {
        console.log('err: '+ err);
        client.read(hl_AutomaticoReset, function(err, handle) {
            console.log(err);
        });
    });
    setTimeout(automatic_selected_true, 1000); 
}



app.use(express.static('public'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});

console.log('Trying to connect socket');
io.sockets.on('connection',function(socket){
    console.log('Socket connected');
    console.log('Trying to connect Ads');
    client = ads.connect(options, function() {
        console.log('Ads connected');

        /*(function myLoop (i) {          
		   setTimeout(function () {   
		      setValue();          //  your code here                
		      if (--i) myLoop(i);      //  decrement i and call myLoop again if i > 0
		   }, 3000)
		})(10); */

    	this.notify(hl_Poweron);
    	this.notify(hl_xActPos);
    	this.notify(hl_yActPos);
    	this.notify(hl_zActPos);
    	this.notify(hl_bActPos);
    	this.notify(hl_cActPos);
    	this.notify(hl_VelAvanco);
    	this.notify(hl_VelExtrusaoPolimero);
		this.notify(hl_VelExtrusaoFibra);
		this.notify(hl_VelPolimeroTrabalho);
		this.notify(hl_VelFibraTrabalho);
		this.notify(hl_TempCamara);
		this.notify(hl_TempTabuleiro);
		this.notify(hl_TempExtrusor);
		this.notify(hl_TempAguaChiller);
		this.notify(hl_TempMotorB);
		this.notify(hl_TempQuadro);
		this.notify(hl_TempSaidaCablagem);
		this.notify(hl_TempPontoMovel);
		this.notify(hl_BlockNumber);
    });

    socket.on('power', function (power) {
        hl_Poweron.value = power;
        client.write(hl_Poweron, function(err) {
            console.log('err: '+ err);
            client.read(hl_Poweron, function(err, handle) {
                console.log(err);
            });
        });
    });

    socket.on('gcode_filename', function (filename) {
        hl_File.value = 'C:\\TwinCAT\\Gcode\\' + filename;
        client.write(hl_File, function(err) {
            console.log('err: '+ err);
            client.read(hl_File, function(err, handle) {
                console.log(err);
            });
        });        
    });

    socket.on('automatico_iniciar', function (value) {
    	hl_FileStart.value=value;
        client.write(hl_FileStart, function(err) {
            console.log('err: '+ err);
            client.read(hl_FileStart, function(err, handle) {
                console.log(err);
            });
        });
    });

    socket.on('automatico_pausar', function (value) {
    	hl_AutomaticoPausar.value=value;
        client.write(hl_AutomaticoPausar, function(err) {
            console.log('err: '+ err);
            client.read(hl_AutomaticoPausar, function(err, handle) {
                console.log(err);
            });
        });

        setTimeout(automatic_pausar_false, 2000);
    });

    socket.on('automatico_parar', function (value) {
    	hl_AutomaticoReset.value=value;
        client.write(hl_AutomaticoReset, function(err) {
            console.log('err: '+ err);
            client.read(hl_AutomaticoReset, function(err, handle) {
                console.log(err);
            });
        });

		setTimeout(automatic_reset_false, 2000); 
    });

    socket.on('homing', function (value) {
    	hl_Homing.value=value;
        client.write(hl_Homing, function(err) {
            console.log('err: '+ err);
            client.read(hl_Homing, function(err, handle) {
                console.log(err);
            });
        });

        setTimeout(homing_false, 2000);
    });

    socket.on('homing_geral', function (value) {
    	hl_HomingGeral.value=value;
        client.write(hl_HomingGeral, function(err) {
            console.log('err: '+ err);
            client.read(hl_HomingGeral, function(err, handle) {
                console.log(err);
            });
        });

        setTimeout(homing_geral_false, 2000);
    });

	socket.on('move_eixo_manual', function (value) {
		if(value[0] === ''){
	        hl_PlcManualModeRightKey.value='0';
        	client.write(hl_PlcManualModeRightKey, function(err) {
	            console.log('err: '+ err);
	            client.read(hl_PlcManualModeRightKey, function(err, handle) {
	                console.log(err);
	            });
        	});

        	hl_PlcManualModeLeftKey.value='0';
        	client.write(hl_PlcManualModeLeftKey, function(err) {
	            console.log('err: '+ err);
	            client.read(hl_PlcManualModeLeftKey, function(err, handle) {
	                console.log(err);
	            });
        	});
		}else{
			hl_PlcManualModeSelectedAxis.value=value[0];
	        client.write(hl_PlcManualModeSelectedAxis, function(err) {
	            console.log('err: '+ err);
	            client.read(hl_PlcManualModeSelectedAxis, function(err, handle) {
	                console.log(err);
	            });
	        });

	        hl_PlcManualModeSpeed.value=value[1];
	        client.write(hl_PlcManualModeSpeed, function(err) {
	            console.log('err: '+ err);
	            client.read(hl_PlcManualModeSpeed, function(err, handle) {
	                console.log(err);
	            });
	        });

	        let sinal=value[2];
	        if(sinal==='positivo'){
	        	hl_PlcManualModeRightKey.value='1';
	        	client.write(hl_PlcManualModeRightKey, function(err) {
		            console.log('err: '+ err);
		            client.read(hl_PlcManualModeRightKey, function(err, handle) {
		                console.log(err);
		            });
	        	});
	        }else{
	        	hl_PlcManualModeLeftKey.value='1';
	        	client.write(hl_PlcManualModeLeftKey, function(err) {
		            console.log('err: '+ err);
		            client.read(hl_PlcManualModeLeftKey, function(err, handle) {
		                console.log(err);
		            });
	        	});
	        }
		}
    });

    socket.on('temperatura_camara', function (value) {
    	let  atual_temp = hl_TempCamara.value;

    	if(value[1]==='negativo'){
    		atual_temp = atual_temp - value[0];
    	}else{
			atual_temp = atual_temp + value[0];    		
    	}
    	
    	hl_TempCamara.value = atual_temp;
	    client.write(hl_TempCamara, function(err,handle) {
	        console.log('err: '+ err);
	        client.read(hl_TempCamara, function(err, handle) {
	            console.log(err);
	        });
	    });
    });

    socket.on('temperatura_tabuleiro', function (value) {
    	let  atual_temp = hl_TempTabuleiro.value;

    	if(value[1]==='negativo'){
    		atual_temp = atual_temp - value[0];
    	}else{
			atual_temp = atual_temp + value[0];    		
    	}
    	
    	hl_TempTabuleiro.value = atual_temp;
	    client.write(hl_TempTabuleiro, function(err,handle) {
	        console.log('err: '+ err);
	        client.read(hl_TempTabuleiro, function(err, handle) {
	            console.log(err);
	        });
	    });
    });

    socket.on('temperatura_extrusor', function (value) {
    	let  atual_temp = hl_TempExtrusor.value;

    	if(value[1]==='negativo'){
    		atual_temp = atual_temp - value[0];
    	}else{
			atual_temp = atual_temp + value[0];    		
    	}
    	
    	hl_TempExtrusor.value = atual_temp;
	    client.write(hl_TempExtrusor, function(err,handle) {
	        console.log('err: '+ err);
	        client.read(hl_TempExtrusor, function(err, handle) {
	            console.log(err);
	        });
	    });
    });

    socket.on('velocidade_avanco', function (value) {
    	let  atual_temp = hl_VelAvanco.value;

    	if(value[1]==='negativo'){
    		atual_temp = atual_temp - value[0];
    	}else{
			atual_temp = atual_temp + value[0];    		
    	}
    	
    	hl_VelAvanco.value = atual_temp;
	    client.write(hl_VelAvanco, function(err,handle) {
	        console.log('err: '+ err);
	        client.read(hl_VelAvanco, function(err, handle) {
	            console.log(err);
	        });
	    });
    });

    socket.on('velocidade_extrPolimero', function (value) {
    	let  atual_temp = hl_VelExtrusaoPolimero.value;

    	if(value[1]==='negativo'){
    		atual_temp = atual_temp - value[0];
    	}else{
			atual_temp = atual_temp + value[0];    		
    	}
    	
    	hl_VelExtrusaoPolimero.value = atual_temp;
	    client.write(hl_VelExtrusaoPolimero, function(err,handle) {
	        console.log('err: '+ err);
	        client.read(hl_VelExtrusaoPolimero, function(err, handle) {
	            console.log(err);
	        });
	    });
    });

    socket.on('velocidade_extrFibra', function (value) {
    	let  atual_temp = hl_VelExtrusaoFibra.value;

    	if(value[1]==='negativo'){
    		atual_temp = atual_temp - value[0];
    	}else{
			atual_temp = atual_temp + value[0];    		
    	}
    	
    	hl_VelExtrusaoFibra.value = atual_temp;
	    client.write(hl_VelExtrusaoFibra, function(err,handle) {
	        console.log('err: '+ err);
	        client.read(hl_VelExtrusaoFibra, function(err, handle) {
	            console.log(err);
	        });
	    });
    });

    socket.on('desligar_motores', function (value) {
    	hl_DesligarMotores.value = value;
	    client.write(hl_DesligarMotores, function(err,handle) {
	        console.log('err: '+ err);
	        client.read(hl_DesligarMotores, function(err, handle) {
	            console.log(err);
	        });
	    });
    });

    socket.on('desligar_aquecimento_camara', function (value) {
    	hl_DesligarAquecimentoCamara.value = value;
	    client.write(hl_DesligarAquecimentoCamara, function(err,handle) {
	        console.log('err: '+ err);
	        client.read(hl_DesligarAquecimentoCamara, function(err, handle) {
	            console.log(err);
	        });
	    });
    });

    socket.on('desligar_sistema_aquecimento', function (value) {
    	hl_DesligarSistemaAquecimento.value = value;
	    client.write(hl_DesligarSistemaAquecimento, function(err,handle) {
	        console.log('err: '+ err);
	        client.read(hl_DesligarSistemaAquecimento, function(err, handle) {
	            console.log(err);
	        });
	    });
    });

    socket.on('desligar_tudo', function (value) {
    	hl_DesligarTudo.value = value;
	    client.write(hl_DesligarTudo, function(err,handle) {
	        console.log('err: '+ err);
	        client.read(hl_DesligarTudo, function(err, handle) {
	            console.log(err);
	        });
	    });
    });

    socket.on('desligar_aquecimento_tabuleiro', function (value) {
    	hl_AquecimentoTabuleiro.value = value;
	    client.write(hl_AquecimentoTabuleiro, function(err,handle) {
	        console.log('err: '+ err);
	        client.read(hl_AquecimentoTabuleiro, function(err, handle) {
	            console.log(err);
	        });
	    });
    });

    socket.on('desligar_aquecimento_extrusor', function (value) {
    	hl_AquecimentoExtrusor.value = value;
	    client.write(hl_AquecimentoExtrusor, function(err,handle) {
	        console.log('err: '+ err);
	        client.read(hl_AquecimentoExtrusor, function(err, handle) {
	            console.log(err);
	        });
	    });
    });
    
    


    client.on('notification', function(handle){
            socket.emit(handle.symname, handle.value );
    });

    client.on('error', function(error) {
    	console.log('client error');
        console.log(error);
    });

    process.on('exit', function () {
        console.log("exit");
    });

    process.on('SIGINT', function() {
        client.end(function() {
        	console.log('sigint');
            process.exit();
        });
    });
});


io.sockets.on('error', function(err) {
    console.log('Socket Error');
    console.log(err);
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});