
var Sun = cc.Sprite.extend({

    radius : 0,
    squaredRadius : 0,
    vector : cc.p(0,0),
    nextPosition : cc.p(0,0),
    hasRisen : false,
	hasGrown : false,
	
	sunPosY : 0,
	
	_friction : 0.98,
	_frame1 : null,
	_frame2 : null,

    ctor:function () {
        
        this._super();
        cc.associateWithNative( this, cc.Sprite);
        this.initWithSpriteFrameName("sun_1.png")

        this.radius = 50;
        this.squaredRadius = 50 * 50;
                           
		//two suns, one small, one large
		this._frame1 = cc.SpriteFrameCache.getInstance().getSpriteFrame("sun_1.png");
		this._frame2 = cc.SpriteFrameCache.getInstance().getSpriteFrame("sun_2.png");
		
		this.sunPosY = SCREEN_SIZE.height - 120;
                           
    },
    
    checkCollisionWithMoon : function ( moon ) {
		if (!this.hasRisen) return false;
				
		var diffx = moon.nextPosition.x - this.nextPosition.x;
		var diffy = moon.nextPosition.y - this.nextPosition.y;
		var distance = (diffx * diffx + diffy * diffy);
	
		//simple collision check
		if (distance < Math.pow(moon.radius + this.radius, 2)) {
			var angle = Math.atan2(diffy,diffx);
	
			moon.vector = cc.p(10 * Math.cos(angle),  10 * Math.sin(angle));
	
			this.vector.x = -1 * moon.vector.x;
			this.vector.y = -1 * moon.vector.y;
			
			return true;
		}
		
		return false;
	},
	
	highNoon : function () {
		this.radius = 64;
		this.squaredRadius = this.radius * this.radius;
		this.setDisplayFrame (
			this._frame2
		);
		this._friction = 0.9;
		
		this.hasGrown = true;
	},
	
	update : function (dt) {
	
		//move sun up to final positon; don't check for collision yet
		if (!this.hasRisen) {
					
			this.vector.y += dt;
			
			if (this.nextPosition.y >= this.sunPosY) {
				this.vector.y = 0;
				this.hasRisen = true;
				this.nextPosition.y = this.sunPosY;
			} else {
				this.nextPosition.y = this.getPositionY() + this.vector.y;
			}
			

		} else {
			//sun is ready, 
			if (this.nextPosition.y < 80) this.vector.y +=  0.2;
			
			this.nextPosition.x = this.getPositionX() + this.vector.x * dt;
			this.nextPosition.y = this.getPositionY() + this.vector.y * dt;
		
			
			//check collision with sides
			if (this.nextPosition.x < this.radius) {
				this.nextPosition.x = this.radius;
				this.vector.x *= -1;
			}
			
			if (this.nextPosition.x > SCREEN_SIZE.width - this.radius) {
				this.nextPosition.x = SCREEN_SIZE.width - this.radius ;
				this.vector.x *= -1;
			}
		
			if (this.nextPosition.y > SCREEN_SIZE.height) {
				this.nextPosition.y = SCREEN_SIZE.height;
				this.vector.y *= -1;
			}
			
			//rotate sun based either o VX or dt 
			if (Math.abs(this.vector.x) > dt) {
				this.setRotation ( this.getRotation() + this.vector.x * 0.5);
			} else {
				this.setRotation ( this.getRotation() + dt);
			}
			
			this.vector.x *= this._friction;
			this.vector.y *= this._friction;
		}
	},
	
	reset : function () {
		this.radius = 50;
		this.squaredRadius = this.radius * this.radius;
	    this.setDisplayFrame (
			this._frame1
		);
		
		this._friction = 0.98;
		this.hasGrown = false;
	},
    place : function () {
        this.setPositionX(this.nextPosition.x);
        this.setPositionY(this.nextPosition.y);
    },
});



