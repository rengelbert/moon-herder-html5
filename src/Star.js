
var Star = cc.Sprite.extend ({
	isBoost : false,
	_blinkTimer : 0,
	_blinkInterval : 0,
	_frame : 0,
	_frame1 : null,
	_frame2 : null,

    ctor:function () {
        this._super();
        cc.associateWithNative( this, cc.Sprite );
        this.initWithSpriteFrameName("star_1.png")
    },
    
    setValues : function (position, boost) {
    	this.isBoost = boost;
    	var r;
    	if (this.isBoost) {
    		this.setDisplayFrame (
    			cc.SpriteFrameCache.getInstance().getSpriteFrame("boost.png")
    		);
    	} else {
    		var index = star_types[TYPE_INDEX];
    		this._frame1 = cc.SpriteFrameCache.getInstance().getSpriteFrame("star_"+index+".png");
    		this._frame2 = cc.SpriteFrameCache.getInstance().getSpriteFrame("star_"+index+"_off.png");
    		
    		r = Math.floor( Math.random() * 10);
    		
    		if (r > 5) {
    			this.setDisplayFrame (this._frame1);
    			_frame = 1;
    		} else {
	    		this.setDisplayFrame (this._frame2);
	    		this._frame = 2;
    		}
    	}
    	
    	var random_range = Math.random() * 2 + 1;
		r = Math.random() * 10 + 1;
		this.setPosition (position);
		
		//offset the stars a bit, so as to get rid of the "Grid Cell" look
		this.setPositionX (position.x + random_range * r * 0.5);
		this.setPositionY (position.y + random_range * r * 0.5);
		
		
		//if too close to the sides, move stars a bit
		if (this.getPositionX() < 10) this.setPositionX(10);
		if (this.getPositionX() > SCREEN_SIZE.width - 16)
			this.setPositionX (SCREEN_SIZE.width - 16);
		
		//if too close to the top, same thing
		if (this.getPositionY() > SCREEN_SIZE.height - 10)
			this.setPositionY (SCREEN_SIZE.height - 10);
		  
		TYPE_INDEX += 1;
		if (TYPE_INDEX == 22) TYPE_INDEX = 0;
		
		this.setVisible(true);
		
		this._blinkTimer = 0;
		this._blinkInterval = Math.random() * 5 + 5;
    },
    
    update:function (dt) {
		this._blinkTimer += dt;
		//change image used, and change opacity when animated
		if (this._blinkTimer > this._blinkInterval && !this.isBoost) {
			this._blinkTimer = 0;
			
			if (this._frame == 1 && this._frame2) {
				this._frame = 2;
				this.setDisplayFrame (
					this._frame2
				);
			} else  {
                if (this._frame1) {
                    this._frame = 1;
                    this.setDisplayFrame (
                        this._frame1
                    );
                }
			}
			this.setOpacity( this.getOpacity() == 180 ?  255 : 180);
			this.setRotation (this.getRotation() + 20);
		}
    }
                             
});
