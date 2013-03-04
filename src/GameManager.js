

var GameManager = cc.Class.extend({

	lines : [],
	columns : 0,
	rows : 0,
	boosting : false,
	score : 0,
	level : 1,
	bestScore : 0,
	boostNumber : 0,
	collectedStars : 0,
	totalCollectedStars : 0,
	totalStars : 0,
	lineDecrement : 0,
	timeDecrement : 0,
	lineEnergy : 1,
	time : 1,
	_linesPool : [],
	_linesPoolIndex : 0,
	_initialLineDecrement : 0.07,
	_lineDecrementRatio : 0.009,
	_initialStars : 3,
	_starsRatio : 3,
	_initialTimeDecrement : 0.006,
	_timeDecrementRatio : 0.0005,
	_initialBoostNumber : -2,
	_boostNumberIncrement : 1,
	_boostSpeed : 1,
	_gridCells : [],
                    
	
	
    ctor:function () {
        // needed for JS-Bindings compatibility
        cc.associateWithNative( this, cc.Class);
    },

	init : function () {
	
		var cache = cc.SpriteFrameCache.getInstance();
        cache.addSpriteFrames(spriteSheet, spriteSheetImg);
        
		
		SCREEN_SIZE = cc.Director.getInstance().getWinSize();
        
        //create lines pool
        for (var i = 0; i < 50; i++) {
            this._linesPool.push(new Line());
        }
        
        //create grid cells
		this.columns = SCREEN_SIZE.width / MH.TILE;
		this.rows = SCREEN_SIZE.height * 0.9 / MH.TILE;
		
		//create grid
		var c;
		var r;
		
		//for (r = 0; r < _rows; r++) {
		for (r = this.rows - 1; r >= 0; r--) {
			for (c = 0; c < this.columns; c++) {
				this._gridCells.push(cc.p(c,r));
			}
		}
		
		this.shuffleArray(this._gridCells);
		
		//test code to clear stored data
		//cc.UserDefault.getInstance().setIntegerForKey("bestScore", 0);
       
		//load las best score
	   if (cc.UserDefault.getInstance().getIntegerForKey("bestScore") == 0){
			this.bestScore = 0;
			cc.UserDefault.getInstance().setIntegerForKey("bestScore", 0);
		} else {
			bestScore = cc.UserDefault.getInstance().getIntegerForKey("bestScore");
		}
		
		this.reset();
	},
	
	shuffleArray : function ( myArray ) {
	  var i = myArray.length, j, tempi, tempj;
	  if ( i == 0 ) return false;
	  while ( --i ) {
		 j = Math.floor( Math.random() * ( i + 1 ) );
		 tempi = myArray[i];
		 tempj = myArray[j];
		 myArray[i] = tempj;
		 myArray[j] = tempi;
	   }
	},
	
	reset : function () {
		//reset to level 1 values (base values)
		this.level = 1;
		this.totalCollectedStars = 0;
		this.updateGameData();
		
	},
	
	setBoosting : function (value) {
		
		this.boosting = value;
		
		if (value) {
			this._boostSpeed++;
		} else {
			this._boostSpeed = 1;
		}
	},
	
	setBestScore : function (value) {
		this.bestScore = value;
		cc.UserDefault.getInstance().setIntegerForKey("bestScore", this.bestScore);
	},
	
	update : function ( dt) {
	
		this.time -= this.timeDecrement * dt;

		if (this.time < 0) this.time = 0;
		
		//boosting
		if (this.boosting) {
			this.lineEnergy += 0.02 * dt * this._boostSpeed;
			if (this.lineEnergy > 1) this.lineEnergy = 1;
			
		}
	},
	
	
	updateGameData : function () {
		//increase line decrement value, total stars, boosts, and time decrement
	
		this.lineDecrement = this._initialLineDecrement + (this.level-1) * this._lineDecrementRatio;
		this.totalStars = this._initialStars + (this.level - 1) * this._starsRatio;
		
		if (this.totalStars > MH.STARS_IN_POOL) {
			this.totalStars = MH.STARS_IN_POOL;
		}
		if (this.lineDecrement > 0.5) this.lineDecrement = 0.5;
		
		this.collectedStars = 0;
		this.timeDecrement = this._initialTimeDecrement + (this.level - 1) * this._timeDecrementRatio;
		this.boostNumber = this._initialBoostNumber + (this.level - 1) * this._boostNumberIncrement;
		if (this.boostNumber > 5) this.boostNumber = 5;
		
		this.shuffleArray(this._gridCells);
		
		this.lines = [];
		
		this.lineEnergy = 1;
		this.time = 1;
		this.boosting = false;
		this._boostSpeed = 1;
		
	},	
		
	lineFromPool : function () {
		var line =  this._linesPool[this._linesPoolIndex];
		this._linesPoolIndex++;
		if (this._linesPoolIndex == this._linesPool.length) this._linesPoolIndex = 0;
		return line;
	},
    
	setLevel : function (value) {
		this.level = value;
		this.updateGameData();
	
	},
	
	starPosition : function (i) {
		return this._gridCells[i];
	}
});

GameManager.getInstance = function () {
	if (!MH.GameManager) {
		MH.GameManager= new GameManager();
		MH.GameManager.init();
	} 
	return MH.GameManager;
	
};




	
	