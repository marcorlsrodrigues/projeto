var ads = require('ads');
var http = require('http');
var fs = require('fs');
var randomizer = require('./randomizer');
var url = require('url');
var client;
var data = [];
var res = [];

var options = {
	//The IP or hostname of the target machine 
    host: "192.168.200.164", 
    //The NetId of the target machine 
    amsNetIdTarget: "10.1.35.204.1.1",
    //The NetId of the source machine. 
    //You can choose anything in the form of x.x.x.x.x.x, 
    //but on the target machine this must be added as a route. 
    //amsNetIdSource: "192.168.137.50.1.1",
    amsNetIdSource: "192.168.201.128.1.1",
 
    //OPTIONAL: (These are set by default)  
    //The tcp destination port 
    //port: 48898 
    //The ams source port 
    //amsPortSource: 32905 
    //The ams target port 
    amsPortTarget: 851 
}
/*
client = ads.connect(options, function() {
    this.readDeviceInfo(function(err, result) {
        console.log(result);
        this.end();
    });
});
 
client.on('error', function(error) {
    console.log(error);
});*/


var myHandle = {
    //Handle name in twincat 
    symname: 'MAIN.PlcVarString2',  
    //An ads type object or an array of type objects. 
    //You can also specify a number or an array of numbers, 
    //the result will then be a buffer object. 
    //If not defined, the default will be BOOL. 
    bytelength: { length: 20, name: 'STRING' },  
    //The propery name where the value should be written. 
    //This can be an array with the same length as the array length of byteLength.  
    //If not defined, the default will be 'value'.      
    propname: 'value'      
};


var hl_Poweron = {
    symname: 'GVL.Poweron',  
    bytelength: ads.BOOL,  
    propname: 'value'      
};

var hl_PowerBOn = {
    symname: 'Power_B_on.Power_B',  
    bytelength: ads.BOOL,  
    propname: 'value'      
};

var hl_set_x_pos = {
    symname: 'MoveAxisToSet_X.SET_X_POS',  
    bytelength: ads.LREAL,  
    propname: 'value'      
};

var hl_actual_x_pos = {
    symname: 'GVL_AXIS.Axis1pos',  
    bytelength: ads.LREAL,  
    propname: 'value'      
};

var hl_set_y_pos = {
    symname: 'MoveAxisToSet_Y.SET_Y_POS',  
    bytelength: ads.LREAL,  
    propname: 'value'      
};

var hl_actual_y_pos = {
    symname: 'GVL_AXIS.Axis3pos',  
    bytelength: ads.LREAL,  
    propname: 'value'      
};

var hl_set_z_pos = {
    symname: 'MoveAxisToSet_Z.SET_Z_POS',  
    bytelength: ads.LREAL,  
    propname: 'value'      
};

var hl_actual_z_pos = {
    symname: 'GVL_AXIS.Axis4pos',  
    bytelength: ads.LREAL,  
    propname: 'value'      
};

var hl_gcode_filename = {
    symname: 'GVL_GCODE.g_strProgram_AUX',  
    bytelength: ads.STRING,  
    propname: 'value'      
};

var hl_gcode_cncon = {
    symname: 'GVL_GCODE.CNC_ON',  
    bytelength: ads.BOOL,  
    propname: 'value'      
};

var hl_setpos = {
    symname: 'ZeroG_ST.GPos_Set',  
    bytelength: ads.BOOL,  
    propname: 'value'      
};


var hl_gvlaxis_setmovstart = {
    symname: 'GVL_AXIS.SETMOV_START',  
    bytelength: ads.BOOL,  
    propname: 'value'      
};

var hl_gvlaxis_setmovstart_mr = {
    symname: 'GVL_AXIS.SETMOV_START_MR',  
    bytelength: ads.BOOL,  
    propname: 'value'      
};


var hl_stop = {
    symname: 'GVL_GCODE.Pause_on',  
    bytelength: ads.BOOL,  
    propname: 'value'      
};

var hl_axis_halt = {
    symname: 'AXIS_HALT.Stop_Mov',  
    bytelength: ads.BOOL,  
    propname: 'value'      
};

var hl_extrude = {
    symname: 'EXTRU_CONT.Extr_B_CW',  
    bytelength: ads.BOOL,  
    propname: 'value'      
};

var hl_retract = {
    symname: 'EXTRU_CONT.Extr_B_CCW',  
    bytelength: ads.BOOL,  
    propname: 'value'      
};



var hl_temperature = {
    symname: 'MAIN.temperature',  
    bytelength: ads.LREAL,
    propname: 'value'    
};

var hl_humidity = {
    symname: 'MAIN.humidity',  
    bytelength: ads.LREAL,  
    propname: 'value'      
};

function setposfalse(client){
        hl_setpos.value = '0';
        client.write(hl_setpos, function(err) {
            client.read(hl_setpos, function(err, handle) {
                console.log('err: '+ err);
            });
        });
}

function sendtofalse(){
    hl_gvlaxis_setmovstart.value = '0';
    client.write(hl_gvlaxis_setmovstart, function(err,handle) {
        console.log('err: '+ err);
        client.read(hl_gvlaxis_setmovstart, function(err, handle) {
            console.log(err);
        });
    });
}
/*
VERSAO ANTERIOR
var server = http.createServer(function(req,res){
    fs.readFile('index.html','utf-8',function(error,content){
        // parses the url request for a file and pulls the pathname
        var url_request = url.parse(req.url).pathname;      
        var tmp  = url_request.lastIndexOf(".");
        var extension  = url_request.substring(tmp + 1);

        // set content type
        if (extension === 'html') res.writeHead(200, {"Content-Type": 'text/html'});
        else if (extension === 'htm') res.writeHead(200, {"Content-Type": 'text/html'});
        else if (extension === 'css') res.writeHead(200, {"Content-Type": 'text/css'});
        else if (extension === 'js') res.writeHead(200, {"Content-Type": 'text/javascript'});
        else if (extension === 'png') res.writeHead(200, {"Content-Type": 'image/png'});
        else if (extension === 'jpg') res.writeHead(200, {"Content-Type": 'image/jpg'});
        else if (extension === 'jpeg') res.writeHead(200, {"Content-Type": 'image/jpeg'});
        else { console.log("NO CORRECT EXTENSION");};
        
        console.log(extension);
        res.end(content);
    });
});*/

var server = http.createServer(function (req, res) {
    if(req.url.indexOf('.html') != -1){ //req.url has the pathname, check if it conatins '.html'
      fs.readFile('index.html', function (err, data) {
        if (err) console.log(err);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      });

    }

    if(req.url.indexOf('.js') != -1){ //req.url has the pathname, check if it conatins '.js'

      fs.readFile(__dirname + '/js/main.js', function (err, data) {
        if (err) console.log(err);
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.write(data);
        res.end();
      });
    }

    if(req.url.indexOf('.css') != -1){ //req.url has the pathname, check if it conatins '.css'

      fs.readFile(__dirname + '/css/style.css', function (err, data) {
        if (err) console.log(err);
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end();
      });

    }

});


var io = require('socket.io').listen(server);
console.log('Trying to connect socket');
io.sockets.on('connection',function(socket){
    console.log('Socket connected');
    console.log('Trying to connect Ads');
    client = ads.connect(options, function() {
        console.log('Ads connected');

        this.notify(hl_Poweron);
        this.notify(hl_actual_x_pos);
        this.notify(hl_actual_y_pos);
        this.notify(hl_actual_z_pos);
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

    socket.on('sendto',function(sendto){
            //write x axis
            hl_set_x_pos.value = sendto[0];
            client.write(hl_set_x_pos, function(err) {
                console.log('err: '+ err);
                client.read(hl_set_x_pos, function(err, handle) {
                    console.log(err);
                });
            });

            //write y axis
            hl_set_y_pos.value = sendto[1];
            client.write(hl_set_y_pos, function(err) {
                console.log('err: '+ err);
                client.read(hl_set_y_pos, function(err, handle) {
                    console.log(err);
                });
            });

            //write z axis
            hl_set_z_pos.value = sendto[2];
            client.write(hl_set_z_pos, function(err) {
                console.log('err: '+ err);
                client.read(hl_set_z_pos, function(err, handle) {
                    console.log(err);
                });
            });

            //set mov start
            hl_gvlaxis_setmovstart.value = '1';
            client.write(hl_gvlaxis_setmovstart, function(err,handle) {
                console.log('err: '+ err);
                client.read(hl_gvlaxis_setmovstart, function(err, handle) {
                    console.log(err);
                });
            });

            setTimeout(sendtofalse, 2000);
    });


    socket.on('gcode',function(gcode){
        fs.createReadStream('C:\\Users\\mrodrigues\\Desktop\\'+gcode).pipe(fs.createWriteStream('\\\\2256025-001\\Nci\\'+gcode));
            hl_gcode_filename.value=gcode;
            client.write(hl_gcode_filename, function(err) {
                client.read(hl_gcode_filename, function(err, handle) {
                    console.log('err: '+ err);
                });
            });

            hl_gcode_cncon.value='1';
            client.write(hl_gcode_cncon, function(err) {
                client.read(hl_gcode_cncon, function(err, handle) {
                    console.log(handle.value);
                    console.log('err: '+ err);
                });
            });
    });

    socket.on('extrude', function (extrude) {
        hl_extrude.value = extrude;
        client.write(hl_extrude, function(err) {
            client.read(hl_extrude, function(err, handle) {
                console.log('err: '+ err);
            });
        });
    });

    socket.on('retract', function (retract) {
        hl_retract.value = retract;
        client.write(hl_retract, function(err) {
            client.read(hl_retract, function(err, handle) {
                console.log('err: '+ err);
            });
        });
    }); 

    socket.on('stop', function (stop) {
        hl_stop.value = stop;
        client.write(hl_stop, function(err) {
            client.read(hl_stop, function(err, handle) {
                console.log('err: '+ err);
            });
        });

        hl_axis_halt.value = stop;
        client.write(hl_axis_halt, function(err) {
            client.read(hl_axis_halt, function(err, handle) {
                console.log('err: '+ err);
            });
        });
    });

    socket.on('setpos', function (setpos) {
        hl_setpos.value = setpos;
        client.write(hl_setpos, function(err) {
            client.read(hl_setpos, function(err, handle) {
                console.log('err: '+ err);
            });
        });

        setTimeout(setposfalse, 2000,client);
    }); 

    var interval = setInterval(function() {
        /*res = [];
        for (var i = 0; i < data.length; ++i) {
            res.push([i, data[i]])
        }*/

        socket.emit('chart-interval', hl_actual_x_pos.value);
    }, 100);

    client.on('notification', function(handle){
            socket.emit(handle.symname, handle.value );
            /*if(handle.symname == 'GVL_AXIS.Axis1pos'){
                if(data.length<300){
                    data.push(handle.value);  
                }else{
                    data.splice(0,1);
                    data.push(handle.value);  
                }
            }*/
    });

    client.on('error', function(error) {
        console.log(error);
    });

    process.on('exit', function () {
        console.log("exit");
    });

    process.on('SIGINT', function() {
        client.end(function() {
            process.exit();
        });
    });

});

io.sockets.on('error', function(err) {
    console.log('Socket Error');
    console.log(err);
});


server.listen(8080);