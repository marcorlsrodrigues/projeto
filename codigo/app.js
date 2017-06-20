var ads = require('ads');
var http = require('http');
var fs = require('fs');
var url = require('url');

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


var hl_PowerBOn = {
    symname: 'Power_B_on.Power_B_MR',  
    bytelength: ads.BOOL,  
    propname: 'value'      
};

//para notificar!
/*client = ads.connect(options, function() {
    this.notify(myHandle);
    myHandle.value = 'Node JS';
    this.write(myHandle, function(err) {
        this.read(myHandle, function(err, handle) {
            console.log(handle.value);
        });
    });
});*/

//para escrever!
/*
client = ads.connect(options, function() {
    myHandle.value = 'Teste3';
    console.log(myHandle);
    this.write(myHandle, function(err) {
    	console.log('err: '+ err);
        this.read(myHandle, function(err, handle) {
        	console.log(err);
            console.log(handle.value);
            this.end();
        });
    });
});


client.on('notification', function(handle){
    console.log(handle.value);
});

process.on('exit', function () {
    console.log("exit");
});

process.on('SIGINT', function() {
    client.end(function() {
        process.exit();
    });
});
*/


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

io.sockets.on('connection',function(socket){
    console.log('Client connected');

    // When the server receives a “message” type signal from the client   
    socket.on('message', function (message) {
        console.log('A client is speaking to me! They’re saying: ' + message);
    });

    socket.on('power', function (power) {
        console.log('A client is speaking to me! They’re saying: ' + power);

        client = ads.connect(options, function() {
            hl_PowerBOn.value = power;
            console.log(hl_PowerBOn);
            this.write(hl_PowerBOn, function(err) {
                console.log('err: '+ err);
                this.read(hl_PowerBOn, function(err, handle) {
                    console.log(handle);
                    console.log(err);
                    this.end();
                });
            });
        });
    }); 
});

server.listen(8080);