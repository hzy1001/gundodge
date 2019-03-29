
function addJavascript(jsname) {

	var th = document.getElementsByTagName('head')[0];

	var s = document.createElement('script');

	s.setAttribute('type','text/javascript');

	s.setAttribute('src',jsname);

	th.appendChild(s);

}

//addJavascript('http://code.jquery.com/jquery-2.1.0.min.js');
//window.addEventListener("load", drawScreen, false);
//window.addEventListener("keydown", onkeydown, true);
//window.addEventListener("keyup", onkeyup, false);
//플레이어 이동 좌표배열[add by jiyoung]
//window.addEventListener("keypress", onkeydown, true);
window.addEventListener("keydown", onkeydown, false);
window.addEventListener("keyup", onkeyup, false);


//document.body.style.zoom = 1;

//키입력 저장 array
var isKeyDown = [];
var GAME_STATE_READY = 0; // 준비
var GAME_STATE_GAME = 1;  // 게임 중
var GAME_STATE_OVER = 2;  // 게임 오버

// 게임 상태값을 저장하는 변수
var GameState = GAME_STATE_READY; // 초깃값은 준비 상태


//컨트롤추가
function gameStart(as_keycode) {
  isKeyDown[as_keycode] = false;
  drawScreen();
  onReady();
  onGameStart();
  //isKeyDown[as_keycode] = true;

}

function gameEnd(as_keycode) {
      if(confirm("게임을 종료하시겠습니까?")){
        //onReady();
        //GameCanvas.fadeOut();
        //window.location = 'index.html';
        $("#GameCanvas").fadeOut( "slow", function() {
             // Animation complete.
             window.location = 'index.html'; 
        });
    }
}

function moveDirection(as_keycode) {
  isKeyDown[as_keycode] = true;
}

function moveDirection2(as_keycode) {
  isKeyDown[as_keycode] = false;
}

//게임 속도(타임 인터벌:프래임갱신간격)
var intervalID;

var arrMissiles = new Array();

//전체 화면 크기(안드로이드 배포시 화면 사이즈 적용안됨. 아래의 명령어로 수정)
// var TotW = screen.availWidth;
// var TotH = screen.availHeight;

//작업 표시줄이 차지하는 부분을 제외한 가로 크기를 가져옵니다. ==> 이것도 배포시 적용 안됨.
// var TotW = screen.availWidth;
// var TotH = screen.availHeight + 30;  //임의로 툴바 영역 감안해서 30px 더해줌.

//전체화면(툴바, 스크롤바 포함)  => 위와 동일한 결과 발생.
//var TotW = window.outerWidth
//var TotH = window.outerHeight 

//전체내용화면(툴바, 스크롤바 제외)
var TotW = window.innerWidth;
var TotH = window.innerHeight; 



var imgBackground01 = new Image();
imgBackground01.src = "img/background01.png";

imgBackground01.addEventListener("load", drawScreen, false);

var imgBackground02 = new Image();
imgBackground02.src = "img/background02.png";

imgBackground02.addEventListener("load", drawScreen, false);

//배경 사이즈
imgBackground01.width = TotW;
imgBackground01.height = TotH;

imgBackground02.width = TotW;
imgBackground02.height = TotH;

//플레이어모드1(무기장착)
var imgPlayer = new Image();
imgPlayer.src = "img/player17.png";
imgPlayer.addEventListener("load", drawScreen, false);


//플레이어모드2(무기없음)
var imgPlayer2 = new Image();
imgPlayer2.src = "img/player29.png";
imgPlayer2.addEventListener("load", drawScreen, false);


//플레이어모드3(비행기)
var imgPlayer3 = new Image();
imgPlayer3.src = "img/player35.png";
imgPlayer3.addEventListener("load", drawScreen, false);


var imgMissile = new Image();
//imgMissile.src = "img/missile11.png";
//imgMissile.src = "img/player15.png";
imgMissile.src = "img/missile21.png";

//alert(TotW * TotH);   //==>  기본면적 : 내pc기존 =1392000

var intTime = 0; // 살아남은 시간을 저장할 변수

////////////////////////////////////////내가 정의한 전역변수////////////////////////////////////////////
var isBoosterYn  = 'N';        //부스터 여부
var isBoostSpeed = 1;          //부스터 카운터(속도)
var isBoostMin   = 1;          //최소 부스터
var isBoostMax   = 1;          //최대 부스터
var isTmpNum01   = 0;          //첫번째임시변수
var isPlayerSize = 0.7;
 
//스크린의 크기에 따라 플레이어 크기도 조정되도록 한다.
//isPlayerSize = isPlayerSize * TotW/1500;
//isPlayerSize = 1;
//isPlayerSize = (isPlayerSize * TotW/1600) * 1.2;
isPlayerSize = (isPlayerSize * TotW/1600);

var isHorizon    = TotH/500;   //수평선경계
//alert(isHorizon)
//////////////////////////////////////////////////////////////////////////////////////////////////

//초기위치설정
//var intPlayerX = 350;
//var intPlayerY = 250;
//정중앙에 위치
var intPlayerX = TotW / 3;
var intPlayerY = TotH / 3 - 50;


function drawScreenReady(Context) {
  //Context.fillText( "준비", 330, 180  );
  Context.fillText("준비", TotW / 2 - 80, TotH / 2 - 250);
}


function drawScreenGame(Context) {

  // 총알을 그려준다
  //for (var i = 0; i < arrMissiles.length; i++) {

    /*
    Context.drawImage(imgMissile, 자를부분x,자를부분y,자를부분w,자를부분h, 자른부분x,자른부분y,자른부분w,자른부분h);
    */

    //Context.drawImage(imgMissile, arrMissiles[i].x, arrMissiles[i].y,10,10);
    //Context.drawImage(imgMissile, arrMissiles[i].x, arrMissiles[i].y, 30, 10);
	  //Context.drawImage(imgMissile, arrMissiles[i].x, arrMissiles[i].y, 40, 15);
    //Context.drawImage(imgMissile, arrMissiles[i].x, arrMissiles[i].y, 192/i, 64/i);

  //}

//Context.drawImage(imgMissile, TotW / 2 - 400 , 350 , 800 - intTime*0.01, 200 - intTime*0.01);

}

function drawScreenEnd(Context) {
  // 총알을 그려준다
  for (var i = 0; i < arrMissiles.length; i++) {
    Context.drawImage(imgMissile, arrMissiles[i].x, arrMissiles[i].y);
  }
  //Context.fillText( "게임 오버", 330, 180  );
  Context.fillText("게임 오버", TotW / 2 - 80, TotH / 2 - 250);
}

function drawScreen() {

  var theCanvas = document.getElementById("GameCanvas");
  var Context = theCanvas.getContext("2d");

  theCanvas.width = TotW;
  theCanvas.height = TotH - 50; //주소창 감안 ..

  Context.fillStyle = "#000000";
  //Context.fillRect(0, 0, 800, 600);
  Context.fillRect(0, 0, TotW, TotH);

  Context.drawImage(imgBackground01, 0, 0, TotW, TotH );

  //imgBackground02.src = "img/background02.png";
  //alert(intTime/100);

  //console.log(parseInt(String("0"+intTime/100).slice(-2)));

//return;
//alert(TotH/70)
Context.translate(0, isHorizon)
//alert(intTime +","+ intTime%2 );
/*
if (intTime%200 == 0){

  //imgBackground02.src = "img/background02.png";
  Context.drawImage(imgBackground02, 0, 0, TotW, TotH );
}else {
  //imgBackground02.src = "img/background08.png";
  //Context.drawImage(imgBackground01, 0, 0, TotW, TotH );
  Context.drawImage(imgBackground02, 0, intTime/10000, TotW, TotH );
}
*/

//imgBackground02.addEventListener("load", drawScreen, false);

//Context.save();
//Context.restore();

//Context.translate(0, -1*isHorizon)

/*
if (parseInt(String("0"+intTime/100).slice(-2)) >= 50){
    ++isTmpNum01;
    Context.translate(0, 730 + isTmpNum01);
    Context.drawImage(imgBackground02, 0, 0, TotW, TotH );
    Context.translate(0, -(730 + isTmpNum01));
}else {
    --isTmpNum01;
    Context.translate(0, (730 + isTmpNum01) - isTmpNum01)
    Context.drawImage(imgBackground02, 0, 0, TotW, TotH );
    Context.translate(0, -(730 + isTmpNum01));
};
*/

//console.log(isTmpNum01);

//Context.save();
//Context.restore();


  // 배경 화면 그리기(화면 이미지, x축, y축, 가로사이즈, 세로사이즈)
    //degrees = -1*intTime/100;

    //Context.save();

    //return;
    //degrees = 0;
   // Context.save();
    //Context.translate(0, 300);      //이미지의 생성점과 회전 기준점을 설정



  //Context.drawImage(imgBackground01, 0, 0, TotW, TotH);
  //Context.translate(0, 0)
  //Context.rotate(degrees*Math.PI/18480
 //imgPlayer.src = "img/player11.png";
 // imgBackground01.src = "img/background02.png";
  //imgBackground01.src = "img/background02.png";
 // Context.drawImage(imgBackground01, 0, 400, TotW, TotH - 400);

  // 플레이어 그리기(플레이어 크기설정)
  //Context.drawImage(imgPlayer, intPlayerX, intPlayerY, 80, 20);
//  Context.drawImage(imgPlayer, intPlayerX, intPlayerY, 70, 100);
  //Context.drawImage(imgPlayer, intPlayerX, intPlayerY, 120, 110);
  // Context.drawImage(imgPlayer, intPlayerX, intPlayerY, 200, 50);
  // Context.drawImage(imgPlayer, intPlayerX, intPlayerY, 400, 100);
  // Context.drawImage(imgPlayer, intPlayerX, intPlayerY, 500, 120);
  // Context.drawImage(imgPlayer, intPlayerX, intPlayerY, 800, 200);
  // Context.drawImage(imgPlayer, intPlayerX - 500, intPlayerY + 80, 1200, 300);

//Context.drawImage(imgPlayer, intPlayerX, intPlayerY, 120, 110);                 //정지
//Context.drawImage(imgPlayer, intPlayerX, intPlayerY, 120, 70);                  //전진
//Context.drawImage(imgPlayer, intPlayerX, intPlayerY, 160, 110);                   //좌측

//Context.drawImage(imgPlayer, 0, 120 / 2, 120, 2, 0, 110 / 2, 110, 2);


//context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);     //drawImage 사용법
//Context.drawImage(imgPlayer, intPlayerX, intPlayerY, 90, 80, intPlayerX + 100, intPlayerY + 100, 120, 110);           //좌로이동
//Context.drawImage(imgPlayer, intPlayerX, intPlayerY, 120, 110);

  //var i = 1.8;

  //console.log(isBoosterYn);
  //스페이스키 누르면 부스터 점화
  //console.log(isBoosterYn);
  if (isBoosterYn == 'N'){
    //var i = 0.5;
    //isBoosterYn = 'Y';
    //imgPlayer.src = "img/player29.png";
    //imgPlayer.style.opacity = isBoostSpeed*10000;
	//imgPlayer.src = "img/player17.png";
    Context.drawImage(imgPlayer, intPlayerX, intPlayerY, imgPlayer.width * isPlayerSize, imgPlayer.height * isPlayerSize);

    //Context.drawImage(imgPlayer, intPlayerX, intPlayerY , imgPlayer.width * isPlayerSize - isBoostSpeed, imgPlayer.height * isPlayerSize - isBoostSpeed);


  }else {
    //isBoosterYn = 'N';
    //alert("a")
    //alert(i);
    //imgPlayer.src = "img/player29.png";
    //Context.drawImage(imgPlayer, intPlayerX, intPlayerY , imgPlayer.width * isPlayerSize, imgPlayer.height * isPlayerSize);
   //mgPlayer.src = "img/player22png";
   //ontext.drawImage(imgPlayer, intPlayerX, intPlayerY , imgPlayer.width * isPlayerSize, imgPlayer.height * isPlayerSize);


    //imgPlayer.src = "img/player35.png";
    Context.drawImage(imgPlayer3, intPlayerX, intPlayerY , imgPlayer3.width * isPlayerSize - isBoostSpeed, imgPlayer3.height * isPlayerSize - isBoostSpeed);
	 

  }

//  Context.drawImage(imgPlayer, 10, 10, 240 , 200 );


// Context.drawImage(imgPlayer, 220, 10, 200 , 200 );
/*
var j = 4;
var k = 3;
for (var i = 0; i <= 6; i++) {

    Context.drawImage(imgPlayer, 50 * i, 10 + (k*i), 240 + (i*2) , 210 - (j*i) );

    //원하는 부분만 그리기
    //context.drawImage(imgPlayer,sourcex,sourcey,sourcewidth,sourceheight,drawx,drawy,drawwidth,drawheight);
    Context.drawImage(imgPlayer, 50, 50, 50 , 50, 50 * i, 310 + (k*i), 24 + (i*2) , 21 - (j*i) );

    j++;
    k++;
}
*/


/*
  Context.drawImage(imgPlayer, 240, 10, 240 , 210 );

  Context.drawImage(imgPlayer, 440, 30, 250 , 160 );

  Context.drawImage(imgPlayer, 440, 30, 250 , 160 );

  Context.drawImage(imgPlayer, 440, 30, 250 , 160 );

  Context.drawImage(imgPlayer, 440, 30, 250 , 160 );

  Context.drawImage(imgPlayer, 440, 30, 250 , 160 );
*/

//  Context.drawImage(imgPlayer, 560, 10, 240 , 210 );


  Context.fillStyle = "#ffffff";
  Context.font = '50px Arial';
  Context.textBaseline = "top";

  // 게임 준비 중
  if (GameState == GAME_STATE_READY) {
    //imgMissile.src = "img/missile21.png";  //미사일 이미지를 다시 보여준다.
    drawScreenReady(Context);
  }
  // 게임 중
  else if (GameState == GAME_STATE_GAME) {
    drawScreenGame(Context);
  }
  // 게임 오버
  else if (GameState == GAME_STATE_OVER) {
    imgMissile.src = "";  //미사일 이미지를 않보이게 한다.
    drawScreenEnd(Context);
  }

  Context.font = '20px Arial';
  Context.fillText("Score : " + intTime / 1000, 20, 5);
  Context.fillText("총알 수 : " + arrMissiles.length, 680, 5);


}

function onkeydown(e) {

  //일시정지
  //ESC키를 누르면 일시 정지
  if (e.keyCode==27) {
      if(confirm("게임을 종료하시겠습니까?")){
        //onReady();
        //GameCanvas.fadeOut();
        //window.location = 'index.html';
        $("#GameCanvas").fadeOut( "slow", function() {
             // Animation complete.
             window.location = 'index.html';
        });
    }
  }

  //alert(e.keyCode)
  // 게임 준비 중
  if (GameState == GAME_STATE_READY) {
    // 게임을 시작합니다
    if (e.keyCode == 13 || e.keyCode == 32) {
		//alert(e.keyCode )
		//if (e.keyCode != null) {
      // 엔터를 입력하면 게임시작
      onGameStart();

    }
  }
  // 게임 중
  else if (GameState == GAME_STATE_GAME) {

    isKeyDown[e.keyCode] = true;

    // 기존의 플레이어 이동 처리 코드 주석
    // :원소스와 다르게 플레이어의 이동을 키이벤트 발생시가 아닌 타임 interval 주기로 발생시킨다.[mod by jiyoung]
    //switch( e.keyCode )
    //{
    //case 106: // LEFT
    //intPlayerX-=5;
    ////intPlayerX = intPlayerX - Math.sqrt(3);
    ////intPlayerY = intPlayerY - Math.sqrt(3);
    //if( intPlayerX < 0 )
    //{
    //intPlayerX = 0;
    //}
    //break;
    //case 108: // RIGHT
    //intPlayerX+=5;
    //if( intPlayerX > 740 )
    //{
    //intPlayerX = 740;
    //}
    //break;
    //case 105: // UP
    //intPlayerY-=5;
    //if( intPlayerY < 0 )
    //{
    //intPlayerY = 0;
    //}
    //break;
    //case 107: // DOWN
    //intPlayerY+=5;
    //if( intPlayerY > 540 )
    //{
    //intPlayerY = 540;
    //}
    //break;
    //};
  }
  // 게임 오버
  else if (GameState == GAME_STATE_OVER) {
    // 게임 준비 상태로 변경
    if (e.keyCode == 13) {
      // 엔터를 입력하면 준비 상태로
      onReady();
    }
  }

  // 화면 갱신
  drawScreen();
}

function onkeyup(e) {
  isKeyDown[e.keyCode] = false;
}

function RandomNextInt(max) {
  return 1 + Math.floor(Math.random() * max);
}

function onGameStart() {

  clearInterval(intervalID);

  // 게임 시작
  GameState = GAME_STATE_GAME;
  // 게임 프래임
  //예: 1000 => 10초마다 갱신
  //intervalID = setInterval( InGameUpdate, 1000/30);

  //게임속도, 인터벌이 클수록 이동속도 감소
  //intervalID = setInterval(InGameUpdate, 50);  //0.5초마다.
  //intervalID = setInterval(InGameUpdate, 20);  //0.2초마다.
  intervalID = setInterval(InGameUpdate, 30);  //0.3초마다.


  // 총알 위치 추가하기
  // 총알 수
  //for( var i = 0; i < 80; i++)
  for (var i = 0; i < 10; i++) {
    var MissileType = RandomNextInt(4);
    var intX, intY, intGoX, intGoY;
    switch (MissileType) {
      case 1: // 왼쪽 총알
        intX = 0;
        intY = RandomNextInt(600);
        intGoX = RandomNextInt(2);
        intGoY = -1 + RandomNextInt(4);
        break;
      case 2: // 오른쪽 총알
        //intX = 800;
        intX = TotW;
        //intY = RandomNextInt(600);
        intY = RandomNextInt(TotH);
        intGoX = -RandomNextInt(2);
        intGoY = -1 + RandomNextInt(4);
        break;
      case 3: // 위쪽 총알
        //intX = RandomNextInt(800);
        intX = RandomNextInt(TotW);
        intY = 0;
        intGoX = -1 + RandomNextInt(4);
        intGoY = RandomNextInt(2);
        break;
      case 4: // 아래쪽 총알
        //intX = RandomNextInt(800);
        intX = RandomNextInt(TotW);
        //intY = 600;
        intY = TotH;
        intGoX = -1 + RandomNextInt(4);
        intGoY = -RandomNextInt(2);
        break;
    };

    arrMissiles.push({ x: intX, y: intY, go_x: intGoX, go_y: intGoY });
  }

}
function onGameOver() {
  // 게임 오버
  GameState = GAME_STATE_OVER;
  clearInterval(intervalID);
}
function onReady() {
  // 게임 준비
  GameState = GAME_STATE_READY;

  // 타이머 초기화
  intTime = 0;

  // 플레이어 위치 초기화
  //intPlayerX = 350;
  //intPlayerY = 250;
  // intPlayerX = TotW / 3 - 50;
  // intPlayerY = TotH / 3 - 50;
  intPlayerX = TotW / 3;
  intPlayerY = TotH / 3 - 50;
  // 총알 리스트 초기화
  while (arrMissiles.length != 0) {
    arrMissiles.pop();
  }

  //총알 이미지 셋팅(종료시 안보이게 했으므로...)
  imgMissile.src = "img/missile21.png";
  //부스터 초기화
  //isBoostSpeed = 1;
  isBoostSpeed = 1;
}

//플레이어 및 총알 이동 좌표 => 타이머에서 주기적으르  InGameUpdate()을 호출하여 화면을 갱신,
//1.플애이어 이동:버튼을 매번 누르지않아도, 누르고만 있으면 동일한 간격으로 함수가 호출되어 플레이어를 부드럽게 이동된다.(
//            (이동좌표 전역변수에 저장, drawScreen()에서 좌표 이동)
//2.미사일 이동:미사일들도  랜덤위치에서 동인한 랜덤 간격으로 함수가 호출되어 부드럽게 이동된다.
//            (미사일 들의 이동좌표들을  전역배열에 저장, drawScreen()에서 게임 실행시 drawScreenGame()가 호출하여 여기서 미사일들을 새로 그려준다.)
function InGameUpdate() {

  // 게임 중 ==> 원소스와 다르게 플레이어 이동 로직을 키이벤트발생시가 아닌 프래임이 갱신될때 발생되도록 추가
  // => 이동시 부자연스러운 문제 해결 [add by jiyoung]
  if (GameState == GAME_STATE_GAME) {

    //이동
    //이동속도 증가 변수
    var ll_add_speed = 5;

    if (isKeyDown[37]) {

      //alert("L")
      intPlayerX -= 6 + ll_add_speed;

      if (intPlayerX < 0) {
        intPlayerX = 0;
      }
    }

    //NUMLOCK:103
    if (isKeyDown[103]) {

      //alert("L")
      intPlayerX -= 6 + ll_add_speed;

      if (intPlayerX < 0) {
        intPlayerX = 0;
      } 

      //alert("U")
      intPlayerY -= 6 + ll_add_speed;

      if (intPlayerY < 0) {
        intPlayerY = 0;
      }

    }  
    
    if (isKeyDown[38]) {
      //alert("U")
      intPlayerY -= 6 + ll_add_speed;

      if (intPlayerY < 0) {
        intPlayerY = 0;
      }
    }
    //NUMLOCK:105
    if (isKeyDown[105]) {
      //alert("R")
      intPlayerX += 6 + ll_add_speed;

      //if( intPlayerX > 740 )
      //{
      //intPlayerX = 740;
      //}
      //alert("U")
      intPlayerY -= 6 + ll_add_speed;

      if (intPlayerY < 0) {
        intPlayerY = 0;
      }      
    }
    
    if (isKeyDown[39]) {
      //alert("R")
      intPlayerX += 6 + ll_add_speed;

      //if( intPlayerX > 740 )
      //{
      //intPlayerX = 740;
      //}

      if (intPlayerX > TotW - 40) {
        intPlayerX = TotW - 40;
      }

    }

    //NUMLOCK:97
    if (isKeyDown[97]) {
      //alert("L")
      intPlayerX -= 6 + ll_add_speed;

      if (intPlayerX < 0) {
        intPlayerX = 0;
      }      
      //alert("D")
      intPlayerY += 6 + ll_add_speed;

      //if( intPlayerY > 540 )
      //{
      //intPlayerY = 540;
      //}

      if (intPlayerY > TotH - 40) {
        intPlayerY = TotH - 40;
      }  
    }

    if (isKeyDown[40]) {
      //alert("D")
      intPlayerY += 6 + ll_add_speed;

      //if( intPlayerY > 540 )
      //{
      //intPlayerY = 540;
      //}

      if (intPlayerY > TotH - 40) {
        intPlayerY = TotH - 40;
      }
    }

    //NUMLOCK:99
    if (isKeyDown[99]) {
      //alert("R")
      intPlayerX += 6 + ll_add_speed;

      //if( intPlayerX > 740 )
      //{
      //intPlayerX = 740;
      //}

      if (intPlayerX > TotW - 40) {
        intPlayerX = TotW - 40;
      }   
      //alert("D")
      intPlayerY += 6 + ll_add_speed;

      //if( intPlayerY > 540 )
      //{
      //intPlayerY = 540;
      //}

      if (intPlayerY > TotH - 40) {
        intPlayerY = TotH - 40;
      }  
    }
        
    //스페이스키(부스터 가동)
    if (isKeyDown[32]) {

      var theCanvas = document.getElementById("GameCanvas");
      var Context = theCanvas.getContext("2d");


      //var imgPlayer = new Image();
      //imgPlayer.src = "img/player17.png";
      //imgPlayer.addEventListener("load", drawScreen, false);
      //alert("booster")
      /*
      var j = 4;
      var k = 3;

      for (var i = 0; i <= 500; i++) {

          console.log(i);
          //Context.translate(0, 100)
          //Context.drawImage(imgPlayer, 50 * i, 10 + (k*i), 240 + (i*2) , 210 - (j*i) );

          //원하는 부분만 그리기
          //context.drawImage(imgPlayer,sourcex,sourcey,sourcewidth,sourceheight,drawx,drawy,drawwidth,drawheight);
          //Context.drawImage(imgPlayer, 50, 50, 50 , 50, 50 * i, 310 + (k*i), 24 + (i*2) , 21 - (j*i) );
          //Context.drawImage(imgPlayer, 50, 50, 50 , 50  );
            //var i = 1.8;

            Context.drawImage(imgPlayer, intPlayerX, intPlayerY , imgPlayer.width - i, imgPlayer.height - i);

          j++;
          k++;


      }


      //return;
      */

      isBoosterYn = 'Y';

      if (isBoostSpeed <= isBoostMax){
        //isBoostSpeed++;
        //isBoostSpeed = isBoostSpeed + intTime/100;

        //isBoostSpeed = isBoostSpeed + 20;
        //intPlayerX = intPlayerX + 5;

        //isBoostSpeed++;
        //isBoostSpeed++;
        isBoostSpeed++;
      }

      //alert(imgPlayer.width)
      //console.log(imgPlayer.width+","+imgPlayer.height)
      //imgPlayer.width = 1000
      //imgPlayer.height = parseInt(imgPlayer.height * 1.01); //10%씩 높이 증가
      // 배경 화면 그리기(화면 이미지, x축, y축, 가로사이즈, 세로사이즈)
      //Context.drawImage(imgPlayer,0, 0, 100, 100);
    }else {

       isBoosterYn = 'N';

       //부스터를 끄면 원위치
       if (isBoostSpeed >= isBoostMin){
        //isBoostSpeed++;
        isBoostSpeed = isBoostSpeed - 5;
        //isBoostSpeed = isBoostSpeed - intTime/100;
        //intPlayerX = intPlayerX + 5;
        //intPlayerX = intPlayerX;
       }

    }
  }

  // 시간 체크
  intTime += 100;
  if (intTime % 5000 == 0) {
    for (var i = 0; i < 5; i++) {
      var MissileType = RandomNextInt(4);
      var intX, intY, intGoX, intGoY;
      switch (MissileType) {
        case 1: // 왼쪽 총알
          intX = 0;
          //intY = RandomNextInt(600);
          intY = RandomNextInt(TotH);
          intGoX = RandomNextInt(2);
          intGoY = -2 + RandomNextInt(4);
          break;
        case 2: // 오른쪽 총알
          //intX = 800;
          intX = TotW;
          //intY = RandomNextInt(600);
          intY = RandomNextInt(TotH);
          intGoX = -RandomNextInt(2);
          intGoY = -2 + RandomNextInt(4);
          break;
        case 3: // 위쪽 총알
          //intX = RandomNextInt(800);
          intX = RandomNextInt(TotW);
          intY = 0;
          intGoX = -2 + RandomNextInt(4);
          intGoY = RandomNextInt(2);
          break;
        case 4: // 아래쪽 총알
          //intX = RandomNextInt(800);
          intX = RandomNextInt(TotW);
          //intY = 600;
          intY = TotH;
          intGoX = -2 + RandomNextInt(4);
          intGoY = -RandomNextInt(2);
          break;
      };

      arrMissiles.push({ x: intX, y: intY, go_x: intGoX, go_y: intGoY });
    }
  }


  //갱신될때마다 미사일이 이동한다.
  MoveMissile();

}

//window.addEventListener("keydown",onkeydown,false);
//window.addEventListener("keyup",onKeyUp,false);
//window.addEventListener("keydown",onkeydown,false);
//window.addEventListener("keyup",onkeyup,false);

function MoveMissile() {
  // 총알 이동 처리
  for (var i = 0; i < arrMissiles.length; i++) {
    //arrMissiles[i].x += arrMissiles[i].go_x * 3;
    //arrMissiles[i].y += arrMissiles[i].go_y * 3;
    //총알속도
    arrMissiles[i].x += arrMissiles[i].go_x * 6;
    arrMissiles[i].y += arrMissiles[i].go_y * 6;


    if (IsCollisionWithPlayer(arrMissiles[i].x, arrMissiles[i].y)) {
      // 충돌 시 게임 오버
      onGameOver();
    }
    //if( arrMissiles[i].x <0 || arrMissiles[i].x > 800
    //  || arrMissiles[i].y < 0 || arrMissiles[i].y > 600 )
    if (arrMissiles[i].x < 0 || arrMissiles[i].x > TotW
      || arrMissiles[i].y < 0 || arrMissiles[i].y > TotH) {
      var MissileType = RandomNextInt(4);
      switch (MissileType) {
        case 1: // 왼쪽 총알
          arrMissiles[i].x = 0;
          //arrMissiles[i].y = RandomNextInt(600);
          arrMissiles[i].y = RandomNextInt(TotH);
          arrMissiles[i].go_x = RandomNextInt(2);
          arrMissiles[i].go_y = -2 + RandomNextInt(4);
          break;
        case 2: // 오른쪽 총알
          //arrMissiles[i].x = 800;
          arrMissiles[i].x = TotW;
          //arrMissiles[i].y = RandomNextInt(600);
          arrMissiles[i].y = RandomNextInt(TotH);
          arrMissiles[i].go_x = -RandomNextInt(2);
          arrMissiles[i].go_y = -2 + RandomNextInt(4);
          break;
        case 3: // 위쪽 총알
          //arrMissiles[i].x = RandomNextInt(800);
          arrMissiles[i].x = RandomNextInt(TotH);
          arrMissiles[i].y = 0;
          arrMissiles[i].go_x = -2 + RandomNextInt(4);
          arrMissiles[i].go_y = RandomNextInt(2);
          break;
        case 4: // 아래쪽 총알
          //arrMissiles[i].x = RandomNextInt(800);
          arrMissiles[i].x = RandomNextInt(TotW);
          //arrMissiles[i].y = 600;
          arrMissiles[i].y = TotH;
          arrMissiles[i].go_x = -2 + RandomNextInt(4);
          arrMissiles[i].go_y = -RandomNextInt(2);
          break;
      };
    }
  }

  // 화면 갱신
  drawScreen();
}

// 충돌시
function IsCollisionWithPlayer(x, y) {
  //플레이어(38,35)
  //총알(9,11)
  //  if( intPlayerX + 16 >  x + 4  &&  //좌측에서 오는 총알
  //    intPlayerX + 4  < x + 20 &&     //우측에서 오는 총알
  //    intPlayerY + 4  < y + 20  &&
  //    intPlayerY + 16  > y + 5 )
  /*
  if (intPlayerX + 38 > x + 9 &&  //좌측에서 오는 총알
    intPlayerX < x &&     //우측에서 오는 총알
    intPlayerY < y &&
    intPlayerY + 35 > y + 11) {
  */
  if (intPlayerX > x + 9 &&  //좌측에서 오는 총알
    intPlayerX < x &&     //우측에서 오는 총알
    intPlayerY < y &&
    intPlayerY + imgPlayer.height * isPlayerSize > y + 11) {
    //console.log(intPlayerX + "," + x + "/" + intPlayerY + "," + y)
    isKeyDown.pop();
    //테스트를 위하여 임시로 충돌해도 통과
    //return false;
    return true;
  }

  return false;
}
