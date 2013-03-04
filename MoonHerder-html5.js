
var MH = MH || {};

(function () {
    var d = document;
    var c = {
        menuType:'canvas', //whether to use canvas mode menu or dom menu
        COCOS2D_DEBUG:0, //0 to turn debug off, 1 for basic debug, and 2 for full debug
        showFPS:true,
        frameRate:40,
        tag:'gameCanvas', //the dom element to run cocos2d on
        //engineDir:'../cocos2d/cocos2d/',
        engineDir:'libs/cocos2d/',
        appFiles:[
            'src/GameConfig.js',
            'src/Resource.js',
            'src/GameManager.js',
            'src/GameLayer.js',
            'src/HelpLayer.js',
            'src/MenuLayer.js',
            'src/DrawLayer.js',
            'src/Line.js',
            'src/Moon.js',
            'src/Sun.js',
            'src/Star.js'
        ]
    };
    window.addEventListener('DOMContentLoaded', function () {
        //first load engine file if specified
        var s = d.createElement('script');
        s.src = c.engineDir + 'platform/jsloader.js';
        d.body.appendChild(s);
        document.ccConfig = c;
        s.id = 'cocos2d-html5';
        //else if single file specified, load singlefile
    });
})();
