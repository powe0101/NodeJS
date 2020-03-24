var socket = io()

$(document).ready(function(){
    // canvas
    var cnvs = document.getElementById('cnvs');
    // cavnas 있음
    if (cnvs.getContext) {
        // 캔버스 컨텍스트
        var ctx = cnvs.getContext('2d');
        // 그리기 모드인지 체크하는 변수
        var isDraw = false;

        // 그리기 옵션
        var dot = 1;
        var color = 'rgb(0, 0, 0)';            

        // 그리기 옵션 - 도트크기
        $('#dot').bind('change', function(){ dot = $('#dot').val(); });
        // 그리기 옵션 - 색깔
        $('#color').bind('change', function(){ color = $('#color').val(); });

        // 이벤트 핸들러 연결
        cnvs.onmousemove = function(e){
            // 그릴 수 있으면 그린다.
            if (isDraw) draw(e);
        }
        cnvs.onmousedown = function(e){
            // 왼쪽 버튼 down 이면 그리는 중
            if (e.button===0) {
                isDraw = true;
                draw(e);
            }
        }
        cnvs.onmouseup = function(e){
            // 버튼 up이면 그리기 종료
            isDraw = false;
        }

        // 그리기
        function draw(e)
        {
          ctx.fillStyle = color;
          // 내가 전송할 메시지 클라이언트에게 표시
          ctx.fillRect(e.offsetX, e.offsetY, dot, dot);
          
          // 서버로 message 이벤트 전달 + 데이터와 함께
          var data = new Array(color, e.offsetX, e.offsetY, dot, dot);
          socket.emit('draw', {type: 'draw', message: data})
        }
    // canvas 없음
    } else {
        alert('canvas가 지원되지 않는 브라우저입니다. 구글 크롬을 권장합니다.');
        return;
    }
});