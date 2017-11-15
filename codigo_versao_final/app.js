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