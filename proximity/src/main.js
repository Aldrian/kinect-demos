


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
        console.log('isSensorConnected',isSensorConnected);
    });

    sensor.addEventHandler(function (event) {
                
        switch (event.category) {
            case Kinect.SENSORSTATUS_EVENT_CATEGORY:
                switch (event.eventType) {
                    case Kinect.SENSORSTATUSCHANGED_EVENT_TYPE:
                    var connected = event.connected;
                    isSensorConnected = event.connected;
                    console.log('isSensorConnected',isSensorConnected);
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
    
    
    Ptypo.createFont('anrt-font', 'anrt');
    
    // Game logics
    var GAME_STATUS = 'waiting';
        loggedPlayers = 0;

    KinectGestures.init(sensor,{
        debug:true,
        registerPlayer:true,
        numPlayersToRegister:1,
        canvasElementID:'skeletonContainer',
        log:true,
        logElementID:'skeletonLogger',
    });

    KinectGestures.on(KinectGestures.EventType.PlayerTracked, function(event){
        KinectGestures.log('Come closer or move back to change the glyph width'); 
    });
    
    KinectGestures.on(KinectGestures.EventType.PlayerEngagedAgain, function(event){
        KinectGestures.log('Come closer or move back to change the glyph width'); 
    });    

    //KinectGestures.on(KinectGestures.GestureType.Wave, function(event){});
    
    //KinectGestures.on(KinectGestures.GestureType.Swipe, function(event){});

    //KinectGestures.on('squat',function(event){});
    //KinectGestures.on(KinectGestures.GestureType.SquatPosition, function(event){});
    //KinectGestures.on(KinectGestures.GestureType.Squat, function(event){});

    //KinectGestures.on(KinectGestures.GestureType.Jump, function(event){});
    //KinectGestures.on(KinectGestures.GestureType.JumpPosition, function(event){});
    //KinectGestures.on(KinectGestures.GestureType.JumpPositionHip, function(event){});
    
    KinectGestures.on(KinectGestures.EventType.PlayerLost, function(event){
        KinectGestures.log('I lost you!');
    });

    KinectGestures.on(KinectGestures.GestureType.PlayerPosition, function(event){
        KinectGestures.log('Come closer or move back to change the glyph width'); 
    });

    KinectGestures.log('Come closer, I can\'t see you!');

});

