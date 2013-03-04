
var DrawLayer = cc.Layer.extend({

	length : 0,
	startPoint : cc.p(0,0),
	touchPoint : cc.p(0,0),
	_manager : null,
	_blinkStateTime: 0,
	_blinkStateEnergy: 0,
	_blinking: false,
	_blinkTimer : 0,
	_blinkCount: 0,
	
    ctor:function () {
    	this._super();
        cc.associateWithNative( this, cc.Layer);
        this._manager = GameManager.getInstance();
		
		cc.renderContext.lineWidth = MH.LINE_THICKNESS;

		//_blinking = false;
		this._blinkTimer = 0;
		this._blinkCount = 0;
		this._blinkStateTime = 0;
		this._blinkStateEnergy = 0;
		this._startPoint = cc.p(0,0);
    },
    
    setBlinking : function (value) {
	
		if (value) {
			this._blinkCount = 0;
			this._blinkStateTime = 0;
		}
	},
	
	draw : function (){
		
		this._super();
	
		cc.renderContext.lineWidth = MH.LINE_THICKNESS;
		//draw lines
		var lines = this._manager.lines;
		var numLines = lines.length;
		var line;
		for (var i = numLines - 1; i >= 0; i--) {
			line = lines[i];
			this.drawLine(line);
		}
		
		this._blinkTimer++;
		
		if (this._blinkTimer > 10) {
			if (this._blinkStateTime == 0) {
				this._blinkStateTime = 1;
			} else {
				this._blinkStateTime = 0;
			}
			if (this._blinkStateEnergy == 0) {
				this._blinkStateEnergy = 1;
			} else {
				this._blinkStateEnergy = 0;
			}
			this._blinkTimer = 0;
			this._blinkCount++;
			if (this._blinkCount > 5) {
				this._blinkStateTime = 0;
				this._blinkCount = 6;
			}
		}
		//draw temp line if any
		var pZero = cc.p(0,0);
	
		if (this.startPoint.x != 0 && this.startPoint.y != 0 &&
		this.touchPoint.x != 0 && this.touchPoint.y != 0) {
			
			cc.renderContext.strokeStyle = "rgba(0,0,0,1)";
			cc.renderContext.fillStyle = "rgba(0,0,0,1)";
			cc.drawingUtil.drawFilledCircle(this.startPoint, 5, Math.PI * 2, 10, false);
			cc.drawingUtil.drawFilledCircle(this.touchPoint, 5, Math.PI * 2, 10, false);
			cc.drawingUtil.drawLine(this.startPoint, this.touchPoint);
			
		}
		cc.renderContext.lineWidth = MH.BAR_THICKNESS;
	
		//draw time bar
		this.drawBar(MH.ORIENTATION.HORIZONTAL);
		
		//draw power bar
		this.drawBar(MH.ORIENTATION.VERTICAL);
		
	}, 
	
	drawBar : function (orientation ){
	
		var barX;
		var barY;
		
		if (orientation == MH.ORIENTATION.HORIZONTAL) {
			//draw time bar
			if (this._manager.time == 0) return;

			var totalWidth = SCREEN_SIZE.width * 0.8;
			barX = SCREEN_SIZE.width * 0.1;
			barY = SCREEN_SIZE.height * 0.03;
			
			if (this._manager.time != 1) {
				cc.renderContext.strokeStyle = "rgba(0,0,0,1)";
				cc.drawingUtil.drawLine(cc.p(barX,barY),
						   cc.p(barX + totalWidth, barY));
			}
			
			cc.renderContext.strokeStyle = "rgba(0,255,255,1)";
			cc.drawingUtil.drawLine(cc.p(barX, barY), cc.p(barX + totalWidth * this._manager.time, barY));
			
		} else {
			//draw energy bar
			var totalHeight = SCREEN_SIZE.height * 0.8;
			barX = SCREEN_SIZE.width * 0.96;
			barY = SCREEN_SIZE.height * 0.1;
			
			if (this._manager.lineEnergy != 1) {
				if (this._blinkStateTime == 0) {
					cc.renderContext.strokeStyle = "rgba(0,0,0,1)";
				} else {
					cc.renderContext.strokeStyle = "rgba(255,0,0,1)";
				}
				cc.drawingUtil.drawLine(cc.p(barX, barY), cc.p(barX, barY + totalHeight));
			}
			
			if (this._manager.lineEnergy <= 0) return;
			
			if (this._manager.boosting) {
				if (this._blinkStateEnergy == 0) {
					cc.renderContext.strokeStyle = "rgba(255,225,0,1)";
				} else {
					cc.renderContext.strokeStyle = "rgba(255,0,255,1)";
				}
			} else {
				cc.renderContext.strokeStyle = "rgba(255,225,0,1)";
			}
			
			cc.drawingUtil.drawLine(cc.p(barX, barY), cc.p(barX, barY + totalHeight * this._manager.lineEnergy));
		}
	},
	
	drawLine : function (line){
		if (line.blinkState == 0) {
			cc.renderContext.strokeStyle = "rgba(255,0,255,1)";
		} else {
			cc.renderContext.strokeStyle = "rgba(255,225,255,1)";
		}
		
		//draw curved line
		if (line.curveState != 0 && line.curve.x != 0 && line.curve.y != 0 ) {
			
			cc.drawingUtil.drawQuadBezier( line.start,
							line.curve,
							line.end,
							10);
			
		//draw straight line
		} else {
			cc.drawingUtil.drawLine(line.start, line.end);
		}
	}

    

});



