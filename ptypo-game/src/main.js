


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
    
    
    Ptypo.createFont('antique-font', 'antique');
    Ptypo.createFont('antique-font-game', 'antique');
    
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
       $('.outline').text($(this).text());
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

    $('#startgame').on('click', async() => {
      let index = 0;
      $('.outline').show();
      while (index < gamePositions.length) {
        try {
          await play(index);
          console.log('game won!');
        } catch (e) {
          console.log('game lost!');
        } finally {
            progressBar.classList.remove("loading");
            void progressBar.offsetWidth;
        }
        index++;
        if (index >= gamePositions.length) {
          console.log('game finished');
          $('.outline').hide();
          break;
        }
      }
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
        Math.abs(gameparam.width - currentparam.width) < 0.25 &&
        Math.abs(gameparam.xHeight - currentparam.xHeight) < 40 &&
        Math.abs(gameparam.ascender - currentparam.ascender) < 40 &&
        Math.abs(gameparam.descender - currentparam.descender) < 40 &&
        Math.abs(gameparam.thickness - currentparam.thickness) < 5
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
        $('#glyph').removeClass('stroboscopic');
        Ptypo.changeParam(parseFloat(115), 'thickness', 'antique-font');
        Ptypo.changeParam(parseFloat(0.6), 'curviness', 'antique-font');
        Ptypo.changeParam(parseFloat(1), 'width', 'antique-font');
        Ptypo.changeParam(parseFloat(520), 'xHeight', 'antique-font');
        Ptypo.changeParam(parseFloat(230), 'ascender', 'antique-font');
        Ptypo.changeParam(parseFloat(-230), 'descender', 'antique-font');
    });

    //KinectGestures.on(KinectGestures.GestureType.PlayerPosition, function(event){});

});

