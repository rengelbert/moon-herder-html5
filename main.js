
var cocos2dApp = cc.Application.extend({
    config:document.ccConfig,
    ctor:function (scene) {
        this._super();
        this.startScene = scene;
        cc.COCOS2D_DEBUG = this.config.COCOS2D_DEBUG;
        cc.setup(this.config.tag);
        cc.Loader.getInstance().onloading = function () {
            cc.LoaderScene.getInstance().draw();
        };
        cc.Loader.getInstance().onload = function () {
            cc.AppController.shareAppController().didFinishLaunchingWithOptions();
        };
        cc.Loader.getInstance().preload(g_ressources);
    },
    applicationDidFinishLaunching:function () {
        // initialize director
        var director = cc.Director.getInstance();

        // turn on display FPS
        director.setDisplayStats(this.config.showFPS);

        // set FPS. the default value is 1.0/60 if you don't call this
        director.setAnimationInterval(1.0 / this.config.frameRate);

        // run
        director.runWithScene(new this.startScene());

        return true;
    }
});

var myApp = new cocos2dApp(MenuLayer.scene);
