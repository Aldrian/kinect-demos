


$(document).ready(function () {
  
  Ptypo.createFont('grotesk-font', 'grotesk').then(() => {
    Ptypo['grotesk-font'].subset = text.data[text.index].one + text.data[text.index].two
      + text.data[(text.index + 1) % text.data.length].one + text.data[(text.index + 1) % text.data.length].two
    text.index++;
    setInterval(function () {
      $('#glyph span.one').html(text.data[text.index].one);
      $('#glyph span.two').html(text.data[text.index].two);
	    Ptypo['grotesk-font'].subset = text.data[text.index].one + text.data[text.index].two
		    + text.data[(text.index + 1) % text.data.length].one + text.data[(text.index + 1) % text.data.length].two
      if (text.index + 1 > text.data.length) {
        text.index = 0;
      }
      else text.index++;
    }, 10000);
  });
  
    var text = {
      'data': [
        {'one':'ARTISTS', two:' ROBOTS'},
        {'one':'10TH OF JUNE', two:'10TH OF SEPTEMBER'},
        {'one':'ASTANA', two:'KAZAKHSTAN'},
        {'one':'RAQUEL', two:'KOGAN'},
        {'one':'ELIAS', two:'CRESPIN'},
        {'one':'LAB[AU]', two:''},
        {'one':'JACOPO BABONI', two:'SCHILINGI'},
        {'one':'LEONEL', two:'MOURA'},
        {'one':'PATRICK', two:'TRESSET'},
        {'one':'QUAYOLA', two:''},
        {'one':'MICHAEL', two:'HANSMEYER'},
        {'one':'EDMOND COUCHOT', two:'& MICHEL BRET'},
        {'one':'MIGUEL', two:'CHEVALIER'},
        {'one':'FRANÇOIS BRUMENT', two:'& SONIA LAUGIER'},
        {'one':'NERVOUS', two:'SYSTEM'},
        {'one':'PETER', two:'KOGLER'},
        {'one':'RAFAEL LOZANO', two:'HEMMER'},
        {'one':'STELARC', two:''},
        {'one':'MEMO', two:'AKTEN'},
        {'one':'DEMIAN', two:'CONRAD'},
        {'one':'CYBER', two:'SENSITIVITY'},
        {'one':'ALGORITHMIC', two:'MAGIC'},
        {'one':'ORGANIC', two:'COMMUNITY'},
        {'one':'ARTIFICIAL', two:'NATURE'},
        {'one':'NEURONAL', two:'NETWORK'},
        {'one':'BINARY', two:'INTELLIGENCE'},
        {'one':'DIGITAL', two:'AVATAR'},
        {'one':'SPACIAL', two:'DATA'},
        {'one':'LUNAR', two:'NETWORK'},
        {'one':'INTERACTIVE', two:'ARTISTS'},
        {'one':'PIXEL', two:'SOUL'},
        {'one':'VIRTUAL', two:'ROBOTS'}
      ],
      'index': 0
    };
    $('#glyph span.one').html(text.data[text.index].one);
    $('#glyph span.two').html(text.data[text.index].two);
    

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

    KinectGestures.on(KinectGestures.GestureType.Wave, function(event){
	    Ptypo.tween(-0.15, '_contrast', 'grotesk-font', 30, 0.3, function(name, font) {
		    Ptypo.tween(-1.3, name, font, 30, 0.3, function(name, font) {
          Ptypo.tween(-1, name, font, 30, 0.1);
        });
	    });
    });
    
    //KinectGestures.on(KinectGestures.GestureType.Swipe, function(event){});

    //KinectGestures.on('squat',function(event){});
    //KinectGestures.on(KinectGestures.GestureType.SquatPosition, function(event){});
    //KinectGestures.on(KinectGestures.GestureType.Squat, function(event){});

    //KinectGestures.on(KinectGestures.GestureType.Jump, function(event){});
    //KinectGestures.on(KinectGestures.GestureType.JumpPosition, function(event){});
    //KinectGestures.on(KinectGestures.GestureType.JumpPositionHip, function(event){});
    
    KinectGestures.on(KinectGestures.EventType.PlayerLost, function(event){
        Ptypo.tween(115, 'thickness', 'grotesk-font', 60, 2);
        Ptypo.tween(0.6, 'curviness', 'grotesk-font', 60, 2);
        Ptypo.tween(1, 'width', 'grotesk-font', 60, 2);
        Ptypo.tween(1, 'crossbar', 'grotesk-font', 60, 2);
        Ptypo.tween(0, 'slant', 'grotesk-font', 60, 2);
    });

    //KinectGestures.on(KinectGestures.GestureType.PlayerPosition, function(event){});

});

