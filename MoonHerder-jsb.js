require("jsb.js");

var MH = MH || {};


var appFiles = [
	'src/Resource.js',
    'src/Star.js',
    'src/GameConfig.js',
	'src/GameManager.js',
	'src/GameLayer.js',
	'src/HelpLayer.js',
	'src/MenuLayer.js',
	'src/DrawLayer.js',
	'src/Line.js',
	'src/Moon.js',
	'src/Sun.js'
];


cc.dumpConfig();

for( var i=0; i < appFiles.length; i++) {
    require( appFiles[i] );
}

var director = cc.Director.getInstance();
director.setDisplayStats(true);

// set FPS. the default value is 1.0/60 if you don't call this
director.setAnimationInterval(1.0 / 60);

// create a scene. it's an autorelease object
var mainScene = MenuLayer.scene();

// run
director.runWithScene(mainScene);