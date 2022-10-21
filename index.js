const express = require("express");
const app = express();
const http = require("http");
server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname + '/client/public'));

server.listen(8888,()=>{
	console.log("Server started");
})

app.get("/client",(req,res)=>{
	res.sendFile(__dirname+"//client//index.html");
})

var socketlist = {};

io.on('connection', function (socket) {		

	_this = this;
	socket.spawn = false;	
	socket.x = 0;
	socket.y = 0;
	
	socket.on("playerMove",(data)=>{
				
		for(var i in data){	
			
			if(socket.spawn == false){
				socket.x = 400;
				socket.y = 400; 
			}else{
				console.log(data[i].x, data[i].y)
				socket.x = data[i].x;
				socket.y = data[i].y; 
			}
		
		}				
	
	});
	
	socket.on("playerSpawn",(data)=>{		
		socket.spawn = true;		
	})
	
	
	socketlist[socket.id] = socket;
	
	
	socket.on('disconnect', function (data) {
			
		for(var i in socketlist){	
			
			var allSocket = socketlist[i];
			allSocket.emit("playerShutdown",socket.id);		
		
		}
		
        delete socketlist[socket.id];
							
    })
	
});

setInterval(function (){	
	//package to send data
    var pack = [];
    for (let i in socketlist){
        let socket = socketlist[i];		
        
        pack.push
		({
			id:socket.id,
            x: socket.x,
            y: socket.y,			
			//online:socket.online,
        })	
	}		
	
	for(let i in socketlist){		
		let socket = socketlist[i];
		socket.emit('newPackage', pack);
	}	

}, 1000 / 25);
