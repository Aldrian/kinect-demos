


$(document).ready(function () {

    var isSensorConnected = false;

    var configuration = {

        "interaction" : {
            "enabled": false,
        },

        "userviewer" : {
            "enabled": false,
            //"resolution": "640x480", //320x240, 160x120, 128x96, 80x60
            //"userColors": { "engaged": 0x7fffffff, "tracked": 0x7fffffff },
            //"defaultUserColor": 0x70000000, //RGBA 2147483647
        },

        "backgroundRemoval" : {
            "enabled": false,
            //"resolution": "640x480", //1280x960
        },

        "skeleton" : {
            "enabled": true,
        },

        "sensorStatus" : {
            "enabled": true,
        }

    };

    // Create sensor and UI adapter layers
    var sensor = Kinect.sensor(Kinect.DEFAULT_SENSOR_NAME, function (sensorToConfig, isConnected) {
        isSensorConnected = isConnected;
        sensorToConfig.postConfig(configuration);
    });

    sensor.addEventHandler(function (event) {

        switch (event.category) {
            case Kinect.SENSORSTATUS_EVENT_CATEGORY:
                switch (event.eventType) {
                    case Kinect.SENSORSTATUSCHANGED_EVENT_TYPE:
                    var connected = event.connected;
                    isSensorConnected = event.connected;
                        break;
                }
                break;
        }
    });

    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }

    
    Ptypo.createFont('antique-font-game', 'antique').then(() => {
      Ptypo['antique-font-game'].subset = $('.main').html().replace(/[^\w\s]/gi, '').toLowerCase() + 'thanksforplayingetready3210.youwoncongratsgameover!';
    });
    Ptypo.createFont('antique-font', 'antique').then(() => {
      Ptypo['antique-font'].subset = $('.main').html().replace(/[^\w\s]/gi, '').toLowerCase() + 'thanksforplayingetready3210.youwoncongratsgameover!';
    });
    
    
    

    // $('.contenteditable').contentEditable().change(function(){
    //   console.log('coucou');
    //     $('.main').text($('span.contenteditable').text);
    // });


    $('.main').on('focus', function() {
      before = $(this).html();
    }).on('blur keyup paste', function() {
      if (before != $(this).html()) { $(this).trigger('change'); }
    });

    $('.main').on('change', function() {
       $('.outline').html($(this).html());
       Ptypo['antique-font'].subset = $(this).html().replace(/[^\w\s]/gi, '').toLowerCase() + 'thanksforplayingetready3210.youwoncongratsgameover!';
       Ptypo['antique-font-game'].subset = $(this).html().replace(/[^\w\s]/gi, '').toLowerCase() + 'thanksforplayingetready3210.youwoncongratsgameover!';
    });

    let gamePositions = [
      {
        'width': 1.22,
        'xHeight': 1059,
        'ascender': 204,
        'descender': -110,
        'thickness': 77
      },
      {
        'width': 4.45,
        'xHeight': 372,
        'ascender': 275,
        'descender': -108,
        'thickness': 77
      },
      {
        'width': 3.33,
        'xHeight': 839,
        'ascender': 160,
        'descender': -201,
        'thickness': 77
      },
      {
        'width': 2.40,
        'xHeight': 660,
        'ascender': 380,
        'descender': -4,
        'thickness': 77
      },
      {
        'width': 0.14,
        'xHeight': 492,
        'ascender': 94,
        'descender': -454,
        'thickness': 77
      },
      {
        'width': 1,
        'xHeight': 391,
        'ascender': 157,
        'descender': -152,
        'thickness': 84
      },
      {
        'width': 2.58,
        'xHeight': 673,
        'ascender': 176,
        'descender': -99,
        'thickness': 83
      },
      {
        'width': 0.44,
        'xHeight': 361,
        'ascender': 128,
        'descender': -118,
        'thickness': 83
      },
      {
        'width': 2.37,
        'xHeight': 383,
        'ascender': 380,
        'descender': -267,
        'thickness': 77
      },
    ];

    let progressBar = document.getElementsByClassName("progress-bar")[0];
    let background = document.getElementById("glyph");

    let stopgame = false;
    let index = 0;
    $('#startgame').on('click', () => {
      $('#startgame').hide();
      $('#stopgame').show();
      index = 0;
      stopgame = false;
      let score = 0;
      let text = $('.main').html();

      async function startgame() {
        while (index < gamePositions.length) {
          try {
            await play(index);
            console.log('game won!');
            background.classList.add("success");
            setTimeout(function () {
              void background.offsetWidth;
              background.classList.remove("success");
            }, 300);
            score ++;
            $('#score').text('Score: ' + score);
          } catch (e) {
            console.log('game lost!');
            background.classList.add("error");
            setTimeout(function () {
              void background.offsetWidth;
              background.classList.remove("error");
            }, 300);
          } finally {
              progressBar.classList.remove("loading");
              void progressBar.offsetWidth;
          }
          index++;
          if (index >= gamePositions.length && index !== 100) {
            console.log('game finished');
            Ptypo.createFont('antique-font-game', 'antique');
            $('.outline').hide();
            $('#startgame').show();
            $('#stopgame').hide();
            if (score >= 7) {
              $('.main').html('You won! Congrats!');
            } else {
              $('.main').html('Game over');
            }
            setTimeout(function () {
              $('.outline').show();
              $('#score').hide();
              $('.main').html('yellow <br> vibes');
              $('.outline').html('yellow <br> vibes');
            }, 5000);
            break;
          } else if (index === 100) {
            $('.outline').hide();
            Ptypo.createFont('antique-font-game', 'antique');
            $('.main').text('Thanks for playing!');
            setTimeout(function () {
              $('.outline').show();
              $('#score').hide();
              $('.main').html('yellow <br> vibes');
              $('.outline').html('yellow <br> vibes');
            }, 5000);
            break;
          }
        }
      }

      setTimeout(function () {
        $('.main').html('Get ready...');
        $('.outline').html('Get ready...');
        setTimeout(function () {
          $('.main').html('3');
          $('.outline').html('3');
          setTimeout(function () {
            $('.main').html('2');
            $('.outline').html('2');
            setTimeout(function () {
              $('.main').html('1');
              $('.outline').html('1');
              setTimeout(function () {
                $('.outline').show();
                $('#score').show();
                $('.main').html(text);
                $('.outline').html(text);
                startgame();
              }, 1000);
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);


    });

    $('#stopgame').on('click', () => {
      $('#stopgame').hide();
      $('#startgame').show();
      stopgame = true;
    });


    let play = (gameindex) => {
      return new Promise((resolve, reject) => {
        // Setup parameters
        Ptypo.changeParam(gamePositions[gameindex].width, 'width', 'antique-font-game');
        Ptypo.changeParam(gamePositions[gameindex].xHeight, 'xHeight', 'antique-font-game');
        Ptypo.changeParam(gamePositions[gameindex].ascender, 'ascender', 'antique-font-game');
        Ptypo.changeParam(gamePositions[gameindex].descender, 'descender', 'antique-font-game');
        Ptypo.changeParam(gamePositions[gameindex].thickness, 'thickness', 'antique-font-game');

        progressBar.classList.add("loading");

        //Timeout if not resolved
        setTimeout(function () {
          reject(false);
        }, 30000);
        // Check if position correct
        setInterval(function () {
          if (stopgame) {
            index = 99;
            reject(false);
          }
          if (checkIfCorrect(gameindex)) {
            resolve(true);
          }
        }, 50);
      });
    };

    let getParams = () => {
      return {
        'width' : Ptypo.getParam('width', 'antique-font'),
        'xHeight': Ptypo.getParam('xHeight', 'antique-font'),
        'ascender':Ptypo.getParam('ascender', 'antique-font'),
        'descender': Ptypo.getParam('descender', 'antique-font'),
        'thickness': Ptypo.getParam('thickness', 'antique-font')
      };
    }

    let checkIfCorrect = (gameindex) => {
      let gameparam = gamePositions[gameindex];
      let currentparam = getParams();
      if (
        Math.abs(gameparam.width - currentparam.width) < 0.55 &&
        Math.abs(gameparam.xHeight - currentparam.xHeight) < 60 &&
        Math.abs(gameparam.ascender - currentparam.ascender) < 60 &&
        Math.abs(gameparam.descender - currentparam.descender) < 60 &&
        Math.abs(gameparam.thickness - currentparam.thickness) < 30
      ) {
        return true;
      } else return false;
    };

    // Game logics
    var GAME_STATUS = 'waiting';
        loggedPlayers = 0;

    KinectGestures.init(sensor,{
        debug:true,
        registerPlayer:false,
        canvasElementID:'skeletonContainer',
        log:false,
        logElementID:'skeletonLogger',
    });

    //KinectGestures.on(KinectGestures.EventType.PlayerTracked, function(event){});

    //KinectGestures.on(KinectGestures.EventType.PlayerEngagedAgain, function(event){});

    //KinectGestures.on(KinectGestures.GestureType.Wave, function(event){});

    //KinectGestures.on(KinectGestures.GestureType.Swipe, function(event){});

    //KinectGestures.on('squat',function(event){});
    //KinectGestures.on(KinectGestures.GestureType.SquatPosition, function(event){});
    //KinectGestures.on(KinectGestures.GestureType.Squat, function(event){});

    //KinectGestures.on(KinectGestures.GestureType.Jump, function(event){});
    //KinectGestures.on(KinectGestures.GestureType.JumpPosition, function(event){});
    //KinectGestures.on(KinectGestures.GestureType.JumpPositionHip, function(event){});

    KinectGestures.on(KinectGestures.EventType.PlayerLost, function(event){
        Ptypo.tween(54, 'thickness', 'antique-font', 60, 1);
        Ptypo.tween(0.6, 'curviness', 'antique-font', 60, 1);
        Ptypo.tween(1, 'width', 'antique-font', 60, 1);
        Ptypo.changeParam(0, 'slant', 'antique-font');
        Ptypo.tween(600, 'xHeight', 'antique-font', 60, 1);
        Ptypo.tween(100, 'ascender', 'antique-font', 60, 1);
        Ptypo.tween(-90, 'descender', 'antique-font', 60, 1);
    });

    //KinectGestures.on(KinectGestures.GestureType.PlayerPosition, function(event){});

});
