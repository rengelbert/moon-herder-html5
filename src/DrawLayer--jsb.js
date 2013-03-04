
var DrawLayer = cc.Node.extend({

	length : 0,
	startPoint : cc.p(0,0),
	touchPoint : cc.p(0,0),
	_manager : null,
	_blinkStateTime: 0,
	_blinkStateEnergy: 0,
	_blinking: false,
	_blinkTimer : 0,
	_blinkCount: 0,
    _draw: null,
	
    ctor:function () {
        this._super();
        cc.associateWithNative( this, cc.Node);
        this._manager = GameManager.getInstance();
        
        this._blinkTimer = 0;
        this._blinkCount = 0;
        this._blinkStateTime = 0;
        this._blinkStateEnergy = 0;
        this._startPoint = cc.p(0,0);
        
        //add draw node            
        this._draw = cc.DrawNode.create();
        this.addChild( this._draw);
    },

    
    setBlinking : function (value) {
	
		if (value) {
			this._blinkCount = 0;
			this._blinkStateTime = 0;
		}
	},

   update : function () {
	   //clear drawings
	   this._draw.clear();
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
	   
	   
		this._draw.drawSegment( this.startPoint, this.touchPoint,
						MH.LINE_THICKNESS, cc.c4f(0, 0, 0, 1) );

	   
	   }
	   //draw time bar
	   this.drawBar(MH.ORIENTATION.HORIZONTAL);
	   
	   //draw power bar
	   this.drawBar(MH.ORIENTATION.VERTICAL);
   },
	
		
	drawBar : function (orientation ){
	
		var barX;
		var barY;
        var color;
		if (orientation == MH.ORIENTATION.HORIZONTAL) {
			//draw time bar
			if (this._manager.time == 0) return;

			var totalWidth = SCREEN_SIZE.width * 0.8;
			barX = SCREEN_SIZE.width * 0.1;
			barY = SCREEN_SIZE.height * 0.03;
			
			if (this._manager.time != 1) {
				this._draw.drawSegment(cc.p(barX,barY),
                cc.p(barX + totalWidth, barY), MH.BAR_THICKNESS, cc.c4f(0, 0, 0, 1));
			}
			
			this._draw.drawSegment(cc.p(barX, barY), cc.p(barX + totalWidth * this._manager.time, barY), MH.BAR_THICKNESS, cc.c4f(0, 1, 1, 1));
             
			
		} else {
			//draw energy bar
			var totalHeight = SCREEN_SIZE.height * 0.8;
			barX = SCREEN_SIZE.width * 0.96;
			barY = SCREEN_SIZE.height * 0.1;
			
			if (this._manager.lineEnergy != 1) {
				if (this._blinkStateTime == 0) {
					color = cc.c4f(0, 0, 0, 1);
				} else {
					color = cc.c4f(1, 0, 0, 1);
				}
				this._draw.drawSegment(cc.p(barX, barY), cc.p(barX, barY + totalHeight), MH.BAR_THICKNESS, color);
			}
			
			if (this._manager.lineEnergy <= 0) return;
			
			if (this._manager.boosting) {
				if (this._blinkStateEnergy == 0) {
					color = cc.c4f(1, 1, 0, 1);
				} else {
					color = cc.c4f(1, 0, 1, 1);
				}
			} else {
					color = cc.c4f(1, 1, 0, 1);
			}
			this._draw.drawSegment(cc.p(barX, barY), cc.p(barX, barY + totalHeight * this._manager.lineEnergy), MH.BAR_THICKNESS, color);

		}
	},
	
	drawLine : function (line){
		var color;

		if (line.blinkState == 0) {
            color = cc.c4f(1, 0, 1, 1);

		} else {
            color = cc.c4f(1, 1, 1, 1);
		}
		
		//draw curved line
		if (line.curveState != 0 && line.curve.x != 0 && line.curve.y != 0 ) {
			var t = 0;
			var x_;
			var y_;
			
			var previous = line.start;
			for (var i = 0; i < 11; i++) {
				x_ = Math.pow(1 - t, 2) * line.start.x + 2 * (1 - t) * t * line.curve.x + t * t * line.end.x;
				y_ = Math.pow(1 - t, 2) * line.start.y + 2 * (1 - t) * t * line.curve.y + t * t * line.end.y;
				
				this._draw.drawSegment( previous, cc.p (x_, y_), MH.LINE_THICKNESS, color);
				previous = cc.p(x_, y_);
				
				t +=  1 / 10;
			}

		//draw straight line
		} else {
            this._draw.drawSegment( line.start, line.end, MH.LINE_THICKNESS, color);
		}
	}

    

});


