const express = require('express')
const socket = require('socket.io')
const http = require('http')
const app = express()
const server = http.createServer(app)
const io = socket(server)
const fs = require('fs')


app.use('/css', express.static('./static/css'))
app.use('/js', express.static('./static/js'))

app.get('/', function(request, response){
    fs.readFile('./static/index.html',function(err, data)
    {
        if(err)
        {
            response.send("index error");
        }
        else
        {
            response.writeHead(200, {'Content-Type':'text/html'})
            response.write(data)
            response.end()
        }
    })
})


io.sockets.on('connection', function(socket) {

    /* 새로운 유저가 접속했을 경우 다른 소켓에게도 알려줌 */
    socket.on('newUser', function(name) {
      console.log(name + ' 님이 접속하였습니다.')
  
      /* 소켓에 이름 저장해두기 */
      socket.name = name
  
      /* 모든 소켓에게 전송 */
      io.sockets.emit('update', {type: 'connect', name: 'SERVER', message: name + '님이 접속하였습니다.'})
    })
  
    /* 전송한 메시지 받기 */
    socket.on('message', function(data) {
      /* 받은 데이터에 누가 보냈는지 이름을 추가 */
      data.name = socket.name
      
      console.log(data)
  
      /* 보낸 사람을 제외한 나머지 유저에게 메시지 전송 */
      socket.broadcast.emit('update', data);
    })
  
    socket.on('draw', function(data){
      data.name = socket.name
      console.log(data)

      socket.broadcast.emit('update', data);
    })

    /* 접속 종료 */
    socket.on('disconnect', function() {
      console.log(socket.name + '님이 나가셨습니다.')
  
      /* 나가는 사람을 제외한 나머지 유저에게 메시지 전송 */
      socket.broadcast.emit('update', {type: 'disconnect', name: 'SERVER', message: socket.name + '님이 나가셨습니다.'});
    })
  })

server.listen(8080, function(){
console.log("Server is Running!");
})

