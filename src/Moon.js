
var Moon = cc.Sprite.extend({

    radius : 0,
    squaredRadius : 0,
    vector : cc.p(0,0),
    nextPosition : cc.p(0,0),
    active : true, 

	isOff : false,
	_blinkTimer : 2,
	_blinkInterval : 0,
	_blinkState : 1,
	
    ctor:function () {
        this._super();
		cc.associateWithNative( this, cc.Sprite);
        this.initWithSpriteFrameName("moon.png")
        this.radius = 16;
        this.squaredRadius = 16 * 16;
        
    },
    
    
	turnOnOff : function (value) {
		if (value) {
			this.isOff = false;
			this._blinkState = 1;
			this.setDisplayFrame (
				cc.SpriteFrameCache.getInstance().getSpriteFrame("moon.png")
			);
		} else {
			this.isOff = false;
			this._blinkState = 0;
			this.setDisplayFrame (
				cc.SpriteFrameCache.getInstance().getSpriteFrame("moon_off.png")
			);
		}
	},
	
	limitSpeeds: function() {
		if (this.vector.x > MH.TERMINAL_VELOCITY) this.vector.x = MH.TERMINAL_VELOCITY;
		if (this.vector.x < -MH.TERMINAL_VELOCITY) this.vector.x = -MH.TERMINAL_VELOCITY;
		if (this.vector.y > MH.TERMINAL_VELOCITY) this.vector.y = MH.TERMINAL_VELOCITY;
		if (this.vector.y < -MH.TERMINAL_VELOCITY) this.vector.y = -MH.TERMINAL_VELOCITY;
	},
	
	reset : function() {
		this.isOff = false;
		this._blinkTimer = 0;
		this._blinkState = 1;
		this.setDisplayFrame (
			cc.SpriteFrameCache.getInstance().getSpriteFrame("moon.png")
		);
		this.active = true;
		this.vector = cc.p(0,0);
		
	},
                            
    place : function () {
        this.setPositionX(this.nextPosition.x);
        this.setPositionY(this.nextPosition.y);
    },
	
	update : function (dt) {
		
		if (!this.active) return;
	
		this.vector.y -= MH.GRAVITY;
		
		this.nextPosition = cc.p (
			this.getPositionX() + this.vector.x * dt,
			this.getPositionY() + this.vector.y * dt
		);
		
		this.limitSpeeds();
		
		//if hitting sides of screen
		if (this.nextPosition.x < this.radius) {
			this.nextPosition.x = this.radius;
			this.vector.x *= -1;
			
			//I play the same sound as when sun is hit		
			cc.AudioEngine.getInstance().playEffect(sun_hit_snd);
		}
		
		if (this.nextPosition.x > SCREEN_SIZE.width - this.radius) {
			this.nextPosition.x = SCREEN_SIZE.width - this.radius;
			this.vector.x *= -1;
			cc.AudioEngine.getInstance().playEffect(sun_hit_snd);
		}
		
		//rotate moon based on VX
		this.setRotation (this.getRotation() + this.vector.x * 0.08);
	
		//moon blinks when power is boosting
		if (GameManager.getInstance().boosting) {
	
			this._blinkTimer += dt;
			if (this._blinkTimer > this._blinkInterval) {
				this._blinkTimer = 0;
				
				if (this._blinkState == 1) {
					this._blinkState = 0;
					
					this.setDisplayFrame (
						cc.SpriteFrameCache.getInstance().getSpriteFrame("moon_off.png")
					);
				} else {
					this._blinkState = 1;
					this.setDisplayFrame (
						cc.SpriteFrameCache.getInstance().getSpriteFrame("moon.png")
					);
				}
			}
		} else {
			if (this._blinkState == 0 && this._manager.getLineEnergy() > 0) {
				this._blinkState = 1;
				this.setDisplayFrame (
					cc.SpriteFrameCache.getInstance().getSpriteFrame("moon.png")
				);
			}
		}
	}
});



