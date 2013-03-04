
var Line = cc.Class.extend({

	active : true,
	trashme : false,
	hit : false,
	length : 0,
	blinkState : 0,
	curveState : 0,
	start : cc.p(0,0),
	end : cc.p(0,0),
	curve : cc.p(0,0),
	collisionPoint : cc.p(0,0),
	
	_blinkInterval : 0,
	_activeInterval : 0,
	_curveInterval : 0,
	_vectorX : 0,
	_vectorY : 0,
	_normalAngle : 0,
	_normalCos : 0,
	_normalSin : 0,
	_lenSquared : 0,
	_normalLeft : cc.p(0,0),
	_normalRight : cc.p(0,0),
	_blinking : false,
	
	
    ctor:function () {
        cc.associateWithNative( this, cc.Class);
    },
    update : function (dt) {
		if (!this.active || this.trashme) return;
		
		//count active time
		this._activeInterval += dt;
		if (this.hit) {
			//animate curve if line is hit
			this._curveInterval += dt;
	
			if (this._curveInterval > MH.LINE_CURVE_INTERVAL) {
				this._curveInterval = 0;
				this.curveState = (this.curveState == 0) ? 1 : 0;
			}
			
		} else {
			//if not hit, and at 75% active time, start blinking the line
			if (this._activeInterval > MH.LINE_TIME_ACTIVE * 0.75) {
			   this._blinking = true;
			}
		}
		
		//destroy line if past its active time
		if (this._activeInterval > MH.LINE_TIME_ACTIVE) {
			this.active = false;
			this.trashme = true;
			return;
		}
		
		if (this._blinking) {
			this._blinkInterval += dt;
			//blink
			if (this._blinkInterval > MH.LINE_BLINK_INTERVAL) {
				this._blinkInterval = 0;
				this.blinkState = (this.blinkState == 0) ? 1 : 0;
			}
			
		}
	
	},
	
	setValues: function (start, end){
		if (start.x <= end.x) {
			this.start = start;
			this.end = end;
		} else {
			this.start = end;
			this.end = start;
		}
		
		this.curve = cc.p(0,0);
		
		this.active = true;
		this.trashme = false;
		this.hit = false;
		
		//these are used as timers for blinking time, active time, curve animation
		this._blinkInterval = 0;
		this._activeInterval = 0;
		this._curveInterval = 0;
		this._blinking = false;
		this.blinkState = 0;
		this.curveState = 0;
	
		this.calculateLineData();
	},
	
	collidesWithMoon: function (moon){
		//line can only collide once
		if (this.hit)
		{
			return false;
		}
		
		//if within range of line segment
		var r = this.rangeWithMoon(moon);
		
		if (r < 0 || r > 1)  return false;
		
		var normal = this.getNormalForMoon(moon);
		var t = this.moonProjectionOfMoon(moon, normal);
		
		if (t > 0 && t < 1) {
			
			//get moon's vector
			var moonDiffX = moon.nextPosition.x - moon.getPositionX();
			var moonDiffY = moon.nextPosition.y - moon.getPositionY();
			
			if (moonDiffX * normal.x + moonDiffY * normal.y > 0) return false;
			
			//collision!!!!
			this.hit = true;
			this._blinking = true;
			if (this._activeInterval < MH.LINE_TIME_ACTIVE * MH.LINE_TIME_CURVING) 
				this._activeInterval = MH.LINE_TIME_ACTIVE * MH.LINE_TIME_CURVING;
			
			var power = this.length;
			moon.vector = cc.p(MH.LINE_BOUNCE * power * normal.x, MH.LINE_BOUNCE * power * normal.y);
	
			this.collisionPoint = cc.p(moon.getPositionX() + t * moonDiffX,
								  moon.getPositionY() + t * moonDiffY);
			this.curve = this.collisionPoint;
			
			this.curve.x -= MH.LINE_CURVE_AMOUNT * normal.x;
			this.curve.y -= MH.LINE_CURVE_AMOUNT * normal.y;
		
			this.curveState = 1;
	
			return true;
		}
		
		return false;
	},
	
	rangeWithMoon : function (moon){
		var moonToStartX = moon.getPositionX() - this.start.x;
		var moonToStartY = moon.getPositionY() - this.start.y;
					
		//get dot product of this line's vector and moonToStart vector
		var dot = moonToStartX * this._vectorX + moonToStartY * this._vectorY;
		//solve it to the segment
		return dot/this._lenSquared;
	},
	
	getNormalForMoon : function (moon){
		var lineStartTomoonX = moon.getPositionX() - this.start.x;
		var lineStartTomoonY = moon.getPositionY() - this.start.y;
		
		//check dot product value to grab correct normal
		var leftNormal = lineStartTomoonX * this._normalLeft.x + lineStartTomoonY * this._normalLeft.y;
		var normal;
		
		if (leftNormal > 0) {
			normal = this._normalLeft;
		} else {
			normal = this._normalRight;
		}
		return normal;
	},
	
	moonProjectionOfMoon : function (moon, normal) {
		var lineStartTomoonNowX = moon.getPositionX() - this.start.x;
		var lineStartTomoonNowY = moon.getPositionY() - this.start.y;
		
		var lineStartTomoonNextX = moon.nextPosition.x - this.start.x;
		var lineStartTomoonNextY = moon.nextPosition.y - this.start.y;
		
		//check dot product value to grab correct normal
		var distanceToLineNow = lineStartTomoonNowX * normal.x + lineStartTomoonNowY * normal.y;
		var distanceToLineNext = lineStartTomoonNextX * normal.x + lineStartTomoonNextY * normal.y;
		
		return (moon.radius - distanceToLineNow) / (distanceToLineNext - distanceToLineNow);
	},
	
	calculateLineData : function () {
		this.length = cc.pDistance(this.start, this.end);
		//line vector
		this._vectorX = this.end.x - this.start.x;
		this._vectorY = this.end.y - this.start.y;
		
		//squared length
		this._lenSquared = this._vectorX * this._vectorX + this._vectorY * this._vectorY;
		
		var normalX = this._vectorY;
		var normalY = -this._vectorX;
		
		var normalLength = Math.sqrt(normalX * normalX + normalY * normalY);
		
		//normalized normals
		this._normalLeft = cc.p(normalX / normalLength, normalY / normalLength);
		this._normalRight = cc.p( -1*this._normalLeft.x, -1*this._normalLeft.y); 
	
	}

    
});









