

var MenuLayer = cc.Layer.extend({

	_gameBatchNode : null,
	_btnPlay : null,
	_btnHelp : null,
	_starsUpdateIndex : 0,
    _starsUpdateRange : 10,
    _starsUpdateInterval : 5,
    _starsUpdateTimer : 0,
    _manager : null,
	
    ctor:function () {
		this._super()
		cc.associateWithNative( this, cc.Layer );
		this._manager = GameManager.getInstance();
		SCREEN_SIZE = cc.Director.getInstance().getWinSize();
		
		//add dark bg
		var bg = cc.Sprite.create(bgDark);
		bg.setPosition(cc.p(SCREEN_SIZE.width * 0.5, SCREEN_SIZE.height * 0.5));
		this.addChild(bg, MH.Z.kBackground);
		
		
		this._gameBatchNode = cc.SpriteBatchNode.create(spriteSheetImg, 800);
		this.addChild(this._gameBatchNode);
		
		
		//add ground
		var ground = cc.Sprite.createWithSpriteFrameName("ground.png");
		ground.setAnchorPoint(cc.p(0,0));
		this._gameBatchNode.addChild(ground, MH.Z.kForeground);
		
		
		//add moon
		var moon = cc.Sprite.createWithSpriteFrameName("intro_moon.png");
		moon.setPosition(cc.p(80, 400));
		this._gameBatchNode.addChild(moon, MH.Z.kForeground);
		
		//add logo
		var logo = cc.Sprite.createWithSpriteFrameName("label_logo.png");
		logo.setPosition(cc.p(SCREEN_SIZE.width * 0.5, SCREEN_SIZE.height * 0.55));
		this._gameBatchNode.addChild(logo, MH.Z.kForeground);
		
		//add play and help buttons
		this._btnPlay = cc.Sprite.createWithSpriteFrameName("label_play.png");
		this._btnPlay.setPosition(cc.p(SCREEN_SIZE.width * 0.5, SCREEN_SIZE.height * 0.3));
		this._gameBatchNode.addChild(this._btnPlay, MH.Z.kForeground);
		
		this._btnHelp = cc.Sprite.createWithSpriteFrameName("label_tutorial.png");
		this._btnHelp.setPosition(cc.p(SCREEN_SIZE.width * 0.5, SCREEN_SIZE.height * 0.2));
		this._gameBatchNode.addChild(this._btnHelp, MH.Z.kForeground);
		
		
		
		//add best score number
		var bestScore = this._manager.bestScore;
		
		if (bestScore > 1) {
			var score = bestScore+"";
			var scoreLabel = cc.LabelBMFont.create(score, fontScore, SCREEN_SIZE.width * 0.8);
			scoreLabel.setPosition(cc.p(SCREEN_SIZE.width * 0.5, SCREEN_SIZE.height * 0.4));
			this.addChild(scoreLabel, MH.Z.kForeground);
		}
		
		
		for (var i = 0; i < MH.STARS_IN_POOL; i++) {
			var star = new Star();
			star.setTag(i);
			star.setVisible(false);
			this._gameBatchNode.addChild(star, MH.Z.kMiddleground);
			
		}
		
		//add stars
		var star;
		//number of stars and boosts to add to this level
		var numStars = 150;
		
		var cnt = 0;
		var i = 0;
		
		var index = 0;
		var starPosition;
		var position;
		
		
		
		while (cnt < numStars) {
		
			starPosition = this._manager.starPosition(i);
			position = cc.p(0,0);
			i++;
			
			//grab stars array index based on selected Grid Cell
			index = Math.floor(starPosition.y) * this._manager.columns + Math.floor(starPosition.x);
			
			if (index >= MH.STARS_IN_POOL) {
				continue;
			}
			
			//grab position from selected Grid Cell
			position.x = starPosition.x * MH.TILE;
			position.y = SCREEN_SIZE.height - starPosition.y * MH.TILE;
			
			//don't use cells too close to moon perch
			
			if (Math.abs(position.x  - moon.getPositionX()) < moon.getBoundingBox().width * 0.4 &&
				Math.abs(position.y - moon.getPositionY()) < moon.getBoundingBox().width * 0.4) {
				continue;
			}
			
			
			//grab star from pool
			star = this._gameBatchNode.getChildByTag(index);
			if (!star) continue;
			
			star.setPosition(position);
			star.setValues(position, false);
			star.setOpacity(200);
			star.setVisible(true);
			
			cnt++;
		}
		
		
		this.setTouchEnabled(true);
		this.scheduleUpdate();
    },
    
    onTouchesEnded:function (touches, event) {
        if (!touches)
            return;
        var touch = touches[0];
        var location = touch.getLocation();

		var boundsPlay = this._btnPlay.getBoundingBox();
		var boundsHelp = this._btnHelp.getBoundingBox();

        if ( cc.rectContainsPoint(boundsPlay, location) ) {
        	var scene = cc.Scene.create();
			scene.addChild(GameLayer.create());
			cc.Director.getInstance().replaceScene(cc.TransitionProgressRadialCCW.create(1.2, scene));
			
        } else if ( cc.rectContainsPoint(boundsHelp, location) ) {

            var scene = cc.Scene.create();
			scene.addChild(HelpLayer.create());
			cc.Director.getInstance().replaceScene(cc.TransitionProgressRadialCCW.create(0.5, scene));
        }

    },

  
    update:function (dt) {

    	this._starsUpdateTimer += dt;
		var stars_count = 150;
		if (this._starsUpdateTimer > this._starsUpdateInterval) {
			
			if (stars_count - this._starsUpdateIndex < this._starsUpdateRange) {
				this._starsUpdateIndex = 0;
			} else if (this._starsUpdateIndex + this._starsUpdateRange > stars_count - 1) {
				this._starsUpdateIndex += stars_count - this._starsUpdateIndex - 1;
			} else {
				this._starsUpdateIndex += this._starsUpdateRange;
			}
			
			this._starsUpdateTimer = 0;
			this._starsUpdateInterval = Math.random() * 5;
		}
	
                                
		//update stars within update range
		var starSprite;
		for (var i = this._starsUpdateIndex; i < this._starsUpdateIndex + this._starsUpdateRange; i++) {
			if (i < stars_count) {
                        
                
				var point = this._manager.starPosition(i);
				var index = Math.floor(point.y) * this._manager.columns + Math.floor(point.x);
				if (index >= MH.STARS_IN_POOL) index = MH.STARS_IN_POOL - 1;
				
				//identify cell in array
				starSprite =  this._gameBatchNode.getChildByTag(index);
				if (starSprite != null && starSprite.getParent() && starSprite.isVisible()) {
					starSprite.update(dt * MH.DT_RATE);
				}
	
			}
			
		}

    }     
  
});

MenuLayer.scene = function () {
    var scene = cc.Scene.create();
    var layer = new MenuLayer();
    scene.addChild(layer);
    return scene;
};
