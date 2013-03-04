
    

var HelpLayer = cc.Layer.extend({
	
	_gameBatchNode : null,
	_moonPerch : null,
	_bgDark : null,
	_bgLight : null,
    
    _manager : null,
	_moon : null,
	_sun : null,
	_drawLayer : null,

    _boostHitParticles : null,
    _lineHitParticles : null,
    _groundHitParticles : null,
    _starHitParticles : null,
    
	_moonStartPoint : cc.p(0,0),
        
	_starsCollected : false,
	_sunRise : false, 
    _runningGame : false,
    _active: 0,
    
    _gameState : 0,
    _numStars : 0,
    _starsUpdateIndex : 0,
    _starsUpdateRange : 10,
    _starsUpdateInterval : 5,
    _starsUpdateTimer : 0,
	_tutorialLabel : null,    
	_energyMsgShown : false,
    _timeMsgShown : false,
    _tutorialDone : false,
    _labelTimer : 0,
    _labelInterval : 8,
	
    ctor:function () {
        cc.associateWithNative( this, cc.Layer );
    },

    init:function () {
        var bRet = false;

        if (this._super()) {
        
        	this._manager = GameManager.getInstance();
			this._manager.reset();
			
			this._moonStartPoint = cc.p(60, SCREEN_SIZE.height - 60);
			
			this._starsCollected = false;
			this._sunRise = false;
			this._runningGame = false;
			
			
			this.createGameScreen();
			
                                
			this.reset();
			this._runningGame = false;
			
			this.setTouchEnabled(true);
			
			cc.AudioEngine.getInstance().stopMusic();
			cc.AudioEngine.getInstance().playMusic(bgMusic, true);
        	
			this.scheduleUpdate();
			
            bRet = true;
        }

        return bRet;
    },
    
	reset : function () {
		
		//reset sun
		this._sun.setPosition(cc.p(SCREEN_SIZE.width * 0.5, -this._sun.radius));
		this._sun.nextPosition = cc.p(SCREEN_SIZE.width * 0.5, -this._sun.radius);
		
		this._sun.setVisible(false);
		this._sun.reset();
		
		//reset moon and perch
		this._moon.setPosition(cc.p(60, SCREEN_SIZE.height - 60));
		this._moon.nextPosition = cc.p(60, SCREEN_SIZE.height - 60);
		this._moon.reset();
		this._moonPerch.setOpacity(100);
		
		this._starsCollected = false;
	
		this._drawLayer.startPoint = cc.p(0,0);
		this._drawLayer.touchPoint = cc.p(0,0);
		
		this._bgDark.setOpacity (255);
		this._bgLight.setOpacity(0);
		this._bgDark.setVisible(true);
		this._bgLight.setVisible(false);
		
		this._starsUpdateIndex = 0;
		this._starsUpdateRange = 10;
		this._starsUpdateInterval = 5;
		this._starsUpdateTimer = 0.0;
		
		this.addStars();
		this._gameState = MH.GAMESTATE.kGameStatePlay;
		
	},
	
	onTouchesBegan:function (touches, event) {
		
		if (!this._runningGame) return;
				
		if (!touches)
			return;
		
		var touch = touches[0];
		var location = touch.getLocation();
		
		
		this._drawLayer.startPoint = location;
			
	},
	
	
	onTouchesMoved:function (touches, event) {
		
		if (!this._runningGame) return;
		
		if (!touches) {
			return;
		}
			
		var touch = touches[0];
		
		var location = touch.getLocation();
		this._drawLayer.touchPoint = location;  
	},
	
	onTouchesEnded:function (touches, event) {
		
		if (!touches)
			return;
		var touch = touches[0];
		var location = touch.getLocation();
	

		 if (!this._runningGame) {
            if (!this._tutorialDone) {
                
                this._moon.reset();
                this._moon.setPosition(cc.p(60, SCREEN_SIZE.height - 60));
                this._moon.nextPosition = cc.p(60, SCREEN_SIZE.height - 60);
                
                this._tutorialLabel.setString("Collect all stars.\n\nIf you take too long,\nthe sun will rise.\nAnd then grow!");
                this._labelTimer = 0;
                this._runningGame = true;
                
                
            } else {
            	this._drawLayer.update();
                var newScene = cc.TransitionProgressRadialCW.create(0.5, GameLayer.scene());
				if (newScene) {
					cc.Director.getInstance().replaceScene(newScene);		
				}
			}
            
            return;
        } else {
        	if (this._gameState == MH.GAMESTATE.kGameStatePlay) {
			
				var line_count = this._manager.lines.length;
				
				//don't bother creating new lines if 10 on stage already, or if no power
				if (line_count > 10 || this._manager.lineEnergy <= 0) {
					this._drawLayer.startPoint = cc.p(0,0);
					this._drawLayer.touchPoint = cc.p(0,0);
					return;
				}
				//don't bother with line if points aren't set on screen
				//and if start and end points are the same
				
				if (this._drawLayer.startPoint.x != 0 && this._drawLayer.startPoint.y != 0 &&
				this._drawLayer.startPoint.x != location.x && this._drawLayer.startPoint.y != location.y) { 
					var line = this._manager.lineFromPool();
					line.setValues(this._drawLayer.startPoint, location);
					
					//check length of the line, if too short, get rid of it
					if (line.length < 40) {
						this._drawLayer.startPoint = cc.p(0,0);
						this._drawLayer.touchPoint = cc.p(0,0);
						return;
					}
					this._manager.lines.push(line);
					if (this._manager.boosting) {
						this._manager.setBoosting ( false );
						this._moon.turnOnOff(this._manager.lineEnergy > 0);
					}
					this._drawLayer.setBlinking ( true );
					
					 //calculate the energy cost of the created line
					var cost = line.length * this._manager.lineDecrement;
					 
					 //if more than one line on screen, then add that to the cost
					if (line_count > 1) cost *= line_count;
					
					this._manager.lineEnergy -= 0.005 * cost;
				}
				this._drawLayer.startPoint = cc.p(0,0);
				this._drawLayer.touchPoint = cc.p(0,0);
				
			} 
        }

	},
	
	update : function (dt) {
		if (this._gameState == MH.GAMESTATE.kGameStatePlay) {
			
			//if running game logic
			if (this._runningGame) {
				
				this._manager.update(dt);
				
				this._labelTimer += dt;
				if (this._labelTimer > this._labelInterval) {
					this._labelTimer = 0;
					this._tutorialLabel.setString("");
				}
				
				dt *= MH.DT_RATE;
				
				//update elements
                this._drawLayer.update();
				this._moon.update(dt);
				
				
				if (this._sun.isVisible()) {
					this._sun.update(dt);
					if (this._sun.checkCollisionWithMoon(this._moon)) {
						cc.AudioEngine.getInstance().playEffect(sun_hit_snd);
					}
				}
				
				
				//check collision with lines, update, draw
				var line;
				var len = this._manager.lines.length;
				var collisionDetected = false;
				
				for (var i = len-1; i >= 0; i--) {
					
					line = this._manager.lines[i];
					
					if (!collisionDetected && line.active) {
						if (line.collidesWithMoon(this._moon)) {
							collisionDetected = true;
							cc.AudioEngine.getInstance().playEffect(line_hit_snd);
							var p = cc.p(line.collisionPoint.x + this._moon.vector.x,
							line.collisionPoint.y + this._moon.vector.y);
							this._lineHitParticles.setPosition(p);
							this._lineHitParticles.resetSystem();
						}
					}
					
					if (line.trashme) {
						this._manager.lines.splice(i, 1);
					} else {
						line.update(dt);
					}
				}
				
				this._moon.place();
				
				
				//if moon off screen to the top, make screen darker as moons gets farther and farther away
				if (this._moon.getPositionY() > SCREEN_SIZE.height) {
					if (!this._sun.isVisible()) {
						var opacity = Math.abs((255 * (this._moon.getPositionY() - SCREEN_SIZE.height))/SCREEN_SIZE.height);
						if (opacity > 200) opacity = 200;
						if (!this._sun.isVisible()) this._bgDark.setOpacity ( 255 - opacity );
					}
				} else {
					if (!this._sun.isVisible()) {
						if (this._bgDark.getOpacity() != 255) this._bgDark.setOpacity ( 255 );
					}
				}
			
				
				//track collision with MOON and STAR (usign grid logic)
				var range = this._moon.radius;
				var posX = this._moon.getPositionX();
				var posY = this._moon.getPositionY();
				
				//I decided to check 9 cells for precision sake
				this.clearStarAt(cc.p(posX, posY));
				this.clearStarAt(cc.p(posX, posY + range));
				this.clearStarAt(cc.p(posX, posY - range));
				this.clearStarAt(cc.p(posX + range, posY));
				this.clearStarAt(cc.p(posX + range, posY + range));
				this.clearStarAt(cc.p(posX + range, posY - range));
				this.clearStarAt(cc.p(posX - range, posY));
				this.clearStarAt(cc.p(posX - range, posY - range));
				this.clearStarAt(cc.p(posX - range, posY + range));
				
				if (this._manager.time < 0.65 && !this._timeMsgShown) {
					this._tutorialLabel.setString("Watch out for your time.");
					this._labelTimer = 0;
					this._timeMsgShown = true;
				}
				
				//check timer
				if (this._manager.time  <= 0.65 && !this._sun.isVisible()) {
					cc.AudioEngine.getInstance().playEffect(sun_rise_snd);
					this._sun.setVisible(true);
					this._sun.hasRisen = false;
				} else if (this._manager.time <= 0.25 && this._sun.isVisible() && !this._sun.hasGrown) {
					cc.AudioEngine.getInstance().playEffect(sun_grow_snd);
					this._sun.highNoon();
				} else if (this._manager.time <= 0.0) {
					//if you want game over once time runs out.
					//game over;
				}
				
				
				if (this._sun.isVisible()) {
					if (!this._bgLight.isVisible()) {
						this._bgLight.setVisible(true);
					}
					//when sun is added to screen, fade out dark bg
					if (this._bgLight.getOpacity() + 5  < 255) {
						this._bgLight.setOpacity(this._bgLight.getOpacity() + 5 );
						this._bgDark.setOpacity (this._bgDark.getOpacity() - 5);
					} else {
						this._bgDark.setVisible(false);
						this._bgDark.setOpacity(255);
						this._bgLight.setOpacity(255);
					}
					this._sun.place();
				}
				
				
				//check power
				if (this._manager.lineEnergy <= 0) {
					if (!this._moon.isOff) {
						this._moon.turnOnOff(false);
					}
				}
				
				//track collision between Moon and Moon's perch
				if (this._starsCollected) {

					if (Math.pow (60 - this._moon.getPositionX(), 2) +
						Math.pow (SCREEN_SIZE.height - 60 - this._moon.getPositionY(), 2) < this._moon.squaredRadius) {
						this._moon.setPosition(cc.p(60, SCREEN_SIZE.height - 60));
						this._moon.nextPosition = cc.p(60, SCREEN_SIZE.height - 60);
						this._moon.active = false;
						this._tutorialLabel.setString("That's it!\n\nTo your right is the power bar.\nAt the bottom your timer\n\n Tap screen to play.");
						this._tutorialDone = true;
						this._labelTimer= 0;
						this._runningGame = false;
						this._manager.lines = [];
					}
				}
				
				
				if (this._moon.getPositionY() < this._moon.radius && this._moon.active) {
					this._groundHitParticles.setPosition(this._moon.getPosition());
					this._groundHitParticles.resetSystem();
					cc.AudioEngine.getInstance().playEffect(ground_hit_snd);
					this._moon.active = false;
					this._runningGame = false;
					
					if (Math.random() > 0.5) {
						this._tutorialLabel.setString("Oops! Try again. \n\n\n Tap screen to begin.");
					} else {
						this._tutorialLabel.setString("Oops! \n\nDraw lines to stop the moon\n from falling to the ground.\n\n\n Tap screen to try again.");
					}
					this._manager.lines = [];
					this._drawLayer.update();
					this._labelTimer= 0;
				}
				                                
				//make stars blink
				if (!this._sun.isVisible()) {
					this._starsUpdateTimer += dt;
					var stars_count = this._numStars;
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
					var star;
					for (var i = this._starsUpdateIndex; i < this._starsUpdateIndex + this._starsUpdateRange; i++) {
						if (i < stars_count) {
                            var point = this._manager.starPosition(i);
							var index = point.y * this._manager.columns + point.x;
							if (index >= MH.STARS_IN_POOL) index = MH.STARS_IN_POOL - 1;
							
							//identify cell in array
							star = this._gameBatchNode.getChildByTag(index);
							if (star.isVisible() && !star.isBoost) star.update(dt);
						}						
					}
				}
				
			}
		}
	},
	
	
	createGameScreen : function () {
		
		//add light bg
		this._bgLight = cc.Sprite.create(bgLight);
		this._bgLight.setPosition(cc.p(SCREEN_SIZE.width * 0.5, SCREEN_SIZE.height * 0.5));
		this.addChild(this._bgLight, MH.Z.kBackground);
		this._bgLight.setVisible(false);
		this._bgLight.setOpacity(0);
	
	
		//add dark bg
		this._bgDark = cc.Sprite.create(bgDark);
		this._bgDark.setPosition(cc.p(SCREEN_SIZE.width * 0.5, SCREEN_SIZE.height * 0.5));
		this.addChild(this._bgDark, MH.Z.kBackground);
	
		this._boostHitParticles = cc.ParticleSystem.create(boost_hit);
		this._lineHitParticles = cc.ParticleSystem.create(line_burst);
		this._groundHitParticles = cc.ParticleSystem.create(off_screen);
		this._starHitParticles  = cc.ParticleSystem.create(star_burst);
		
		this._boostHitParticles.stopSystem();
		this._lineHitParticles.stopSystem();
		this._groundHitParticles.stopSystem();
		this._starHitParticles.stopSystem();
		
		this.addChild(this._boostHitParticles);
		this.addChild(this._lineHitParticles);
		this.addChild(this._groundHitParticles);
		this.addChild(this._starHitParticles);
		
	
		this._gameBatchNode = cc.SpriteBatchNode.create(spriteSheetImg, 800);
		this.addChild(this._gameBatchNode,MH.Z.kBackground);
		
		
		this._moonPerch = cc.Sprite.createWithSpriteFrameName("moon_perch.png");
		this._moonPerch.setPosition(cc.p(60, SCREEN_SIZE.height - 60));
		this._moonPerch.setOpacity(50);
		this._gameBatchNode.addChild(this._moonPerch);
		
		var ground = cc.Sprite.createWithSpriteFrameName("ground.png");
		ground.setAnchorPoint(cc.p(0,0));
		this._gameBatchNode.addChild(ground, MH.Z.kForeground);
		
        this._moon = new Moon();
		this._moon.setPosition(	cc.p(60, SCREEN_SIZE.height - 60));
		this._moon.nextPosition = cc.p(60, SCREEN_SIZE.height - 60);
		this._gameBatchNode.addChild(this._moon, MH.Z.kMiddleground);
		
        this._sun = new Sun();
		this._sun.setPosition(cc.p(SCREEN_SIZE.width * 0.5, -this._sun.radius));
		this._sun.nextPosition = cc.p(SCREEN_SIZE.width * 0.5, -this._sun.radius);
		this._sun.setVisible(false);
		this._gameBatchNode.addChild(this._sun, MH.Z.kMiddleground);
		
		
		this._scoreLabel = cc.LabelBMFont.create("", fontScore, SCREEN_SIZE.width * 0.8);
		this._scoreLabel.setPosition(cc.p(SCREEN_SIZE.width * 0.5, SCREEN_SIZE.height * 0.48));
		this.addChild(this._scoreLabel, MH.Z.kForeground);
		this._scoreLabel.setVisible(false);
		
		
		this._levelLabel = cc.LabelBMFont.create("2", fontLevel, SCREEN_SIZE.width * 0.5);
		this._levelLabel.setAnchorPoint(cc.p(0,0));
		this._levelLabel.setPosition(cc.p(SCREEN_SIZE.width * 0.46, SCREEN_SIZE.height * 0.61));
		this.addChild(this._levelLabel, MH.Z.kForeground);
		this._levelLabel.setVisible(false);
		
        for (var i = 0; i < MH.STARS_IN_POOL; i++) {
            var star = new Star();
            star.setTag(i);
            star.setVisible(false);
            this._gameBatchNode.addChild(star, MH.Z.kMiddleground);
        
        }

		
		this._tutorialLabel = cc.LabelTTF.create("Draw lines to stop the moon\n from falling to the ground.\n\n\n Tap screen to begin.", "TrebuchetMS-Bold", 16, cc.size(SCREEN_SIZE.width * 0.8, SCREEN_SIZE.height * 0.4), cc.TEXT_ALIGNMENT_CENTER);
   		this._tutorialLabel.setPosition(cc.p (SCREEN_SIZE.width * 0.5, SCREEN_SIZE.height * 0.2) );
    	this.addChild(this._tutorialLabel, MH.Z.kForeground);
	    this._labelTimer= 0;
    		 
        
        this._drawLayer = new DrawLayer();
        this.addChild(this._drawLayer, MH.Z.kForeground);
                                
	},
	
	clearStarAt : function (point) {

		var col = Math.floor(point.x / MH.TILE);
		var row  = Math.floor((SCREEN_SIZE.height - point.y) / MH.TILE);
		
		if (row < 0 || col < 0 || row >= this._manager.rows || col >= this._manager.columns ||
			row * this._manager.columns + col >= MH.STARS_IN_POOL) {
			return;
		}
		
		//identify cell in array
		var star = this._gameBatchNode.getChildByTag(row * this._manager.columns + col);
				
		if (star && star.isVisible()) {
			
			var diffx = this._moon.getPositionX() - star.getPositionX();
			var diffy = this._moon.getPositionY() - star.getPositionY();
	
			if ((diffx * diffx + diffy * diffy) <= this._moon.squaredRadius) {
				
				this._manager.collectedStars++;
				this._manager.totalCollectedStars++;
				
				star.setVisible(false);
				
				var totalStars = this._numStars;
				var starsCollected = this._manager.collectedStars;
				
				//did we hit a boost?
				if (star.isBoost) {
					
					this._manager.setBoosting(true);
					
					if (starsCollected != totalStars) {
						this._boostHitParticles.setPosition(star.getPosition());
						this._boostHitParticles.resetSystem();
					}
				}
				
				//if last star on screen, show particles, show Moon Perch...
				if (starsCollected == this._numStars) {
					cc.AudioEngine.getInstance().playEffect(last_star_snd);
					this._starHitParticles.setPosition(star.getPosition());
					this._starHitParticles.resetSystem();
					this._starsCollected = true;
	
					if (this._sun.isVisible()) {
						this._moonPerch.setOpacity(100);
					} else {
						this._moonPerch.setOpacity(200);
					}
					this._tutorialLabel.setString("Return the moon to its perch.");
                	this._labelTimer= 0;
				} else {
					if (star.isBoost) {
						cc.AudioEngine.getInstance().playEffect(boost_hit_snd);
						this._tutorialLabel.setString("This is a boost.\n It increases your energy\n until a new line is added.");
                    	this._labelTimer= 0;
					} else {
						cc.AudioEngine.getInstance().playEffect(star_hit_snd);
					}
				}
				
			}
		}
	},
	
	addStars : function () {

		var star;
		//number of stars and boosts to add to this level
		this._numStars = 5;
		var numBoosts = 1;
			
		var cnt = 0;
		var i = 0;
	
		var index;
		var starPosition;
		var position;
		
		while (cnt < this._numStars) {
			
			starPosition = this._manager.starPosition(i);
			position =  cc.p(0,0);
			i++;
			
			//grab stars array index based on selected Grid Cell
			index = starPosition.y * this._manager.columns + starPosition.x;
			
			if (index >= MH.STARS_IN_POOL) {
				continue;
			}
		
			//grab position from selected Grid Cell
			position.x = starPosition.x * MH.TILE;
			position.y = SCREEN_SIZE.height - starPosition.y * MH.TILE;
			
			//don't use cells too close to moon perch
			
			if (Math.abs(position.x  - 60) < this._moon.radius * 2 &&
				Math.abs(position.y - SCREEN_SIZE.height - 60) < this._moon.radius * 2) {
				continue;
			}
			
			//grab star from pool
            star = this._gameBatchNode.getChildByTag(index);
            if (!star) continue;
                    
			if (star.getOpacity() != 255) star.setOpacity(255);
			
			//add boosts first, if any
			if ( cnt >= this._numStars - numBoosts) {
				star.setValues(position, true);
				
			} else {
				star.setValues(position, false);
			}
			star.setVisible(true);
			
			cnt++;
		}
	},
	
});

HelpLayer.create = function () {
    var hl = new HelpLayer();
    if (hl && hl.init()) {
        return hl;
    }
    return null;
};

HelpLayer.scene = function () {
    var scene = cc.Scene.create();
    var layer = HelpLayer.create();
    scene.addChild(layer);
    return scene;
};

    




