var socket = io()

var name = 'first'
/* 접속 되었을 때 실행 */
socket.on('connect', function() {
  /* 이름을 입력받고 */
  if(name == 'first')
  {
    name = prompt('이름을 입력해주세요!', '')

    /* 이름이 빈칸인 경우 */
    if(!name) {
      name = '익명'
    }
  
    /* 서버에 새로운 유저가 왔다고 알림 */
    socket.emit('newUser', name)
    }
})

/* 서버로부터 데이터 받은 경우 */
socket.on('update', function(data) {
  var className = ''

  // 타입에 따라 적용할 클래스를 다르게 지정
  switch(data.type)
  {
    //그리기 영역
    case 'draw':
      className = 'draw'
      DrawPoint(data)
      return
    //채팅 영역
    case 'message':
      className = 'other'
      break
    case 'connect':
      className = 'connect'
      break
    case 'disconnect':
      className = 'disconnect'
      break
  }
  AppendMessage(className, data)
})

function DrawPoint(data) {
  var cnvs = document.getElementById('cnvs')
  // cavnas 있음
  if (cnvs.getContext) {
    // 캔버스 컨텍스트
    var ctx = cnvs.getContext('2d')
    ctx.fillStyle = data.message[0]
    ctx.fillRect(data.message[1], data.message[2], data.message[3], data.message[4])
  }
}

function AppendMessage(className, data)
{
  var message = document.createElement('div')
  {
    var node = document.createTextNode(`${data.name}: ${data.message}`)
    message.classList.add(className)
    message.appendChild(node)
  }

  var chat = document.getElementById('chat')
  {
    chat.appendChild(message)
    chat.scrollTop = chat.scrollHeight;
  }
}

/* 메시지 전송 함수 */
function send() {
  // 입력되어있는 데이터 가져오기
  var message = GetMessageAndClearInputBox()
  // 내가 전송할 메시지 클라이언트에게 표시
  AppendMessage('me',{name : name, message : message})
  // 서버로 message 이벤트 전달 + 데이터와 함께
  socket.emit('message', {type: 'message', message: message})
}

function GetMessageAndClearInputBox() {
  var message = document.getElementById('inputMessageBox').value
  // 가져왔으니 데이터 빈칸으로 변경
  document.getElementById('inputMessageBox').value = ''
  return message
}

function enterkey() {
    if (window.event.keyCode == 13) {
         // 엔터키가 눌렸을 때 실행할 내용
         send();
    }
}
