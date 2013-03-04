var SCREEN_SIZE = null;
var star_types = [1,2,3,4,2,3,4,1,3,4,2,1,3,4,4,2,2,4,3,3,3,1,1];
var TYPE_INDEX = 0;

MH.GameManager = null;

MH.GAMESTATE = {
    kGameStatePlay: 0,
    kGameStateNewLevel: 1,
    kGameStateGameOver: 2,
    kGameStateMenu: 3
};

MH.Z = {
    kBackground:0,
    kMiddleground:1,
    kForeground:2
};

MH.ORIENTATION  = {
	HORIZONTAL: 0,
	VERTICAL: 1
};


MH.DT_RATE = 10;
MH.TILE = 16;
MH.GRAVITY = 0.2;
MH.TERMINAL_VELOCITY = 30;
MH.LINE_TIME_ACTIVE = 36;
MH.LINE_TIME_CURVING = 0.85;
MH.LINE_BLINK_INTERVAL = 1;
MH.LINE_CURVE_INTERVAL = 1;
MH.LINE_CURVE_AMOUNT = 40;
MH.LINE_BOUNCE = 0.2;
MH.LINE_THICKNESS = 4;
MH.BAR_THICKNESS = 1;
MH.STARS_IN_POOL = 450;


