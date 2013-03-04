
var dirRes = "res/";
var dirMusic = "res/Sounds/";


//image
var bgDark = dirRes + "bg_dark.jpg";
var bgLight = dirRes + "bg_light.jpg";
var spriteSheetImg = dirRes + "sprite_sheet.png";
var fontLevelImg = dirRes + "fontLevel.png";
var fontScoreImg = dirRes + "fontScore.png";

//font data
var fontLevel = dirRes + "fontLevel-40.fnt";
var fontScore = dirRes + "fontScore-20.fnt";

//music
var bgMusic = dirMusic + "bg.mp3";

//sound
var boost_hit_snd = dirMusic + "boost_hit.mp3" ;
var ground_hit_snd = dirMusic + "ground_hit.mp3" ;
var last_star_snd = dirMusic + "last_star_hit.mp3" ;
var line_hit_snd = dirMusic + "line_hit.mp3" ;
var star_hit_snd = dirMusic + "star_hit.mp3" ;
var sun_grow_snd = dirMusic + "sun_grow.mp3" ;
var sun_hit_snd = dirMusic + "sun_hit.mp3" ;
var sun_rise_snd = dirMusic + "sun_rise.mp3" ;
var wall_hit_snd = dirMusic + "wall_hit.mp3" ;

//plist
var spriteSheet = dirRes + "sprite_sheet.plist";
var star_burst = dirRes + "star_burst.plist";
var off_screen = dirRes + "off_screen.plist";
var line_burst = dirRes + "line_burst.plist";
var boost_hit = dirRes + "boost_hit.plist";


var g_ressources = [
    //image
    {type:"image", src:bgDark},
    {type:"image", src:bgLight},
    {type:"image", src:spriteSheetImg},
    {type:"image", src:fontLevelImg},
    {type:"image", src:fontScoreImg},

    //plist
    {type:"plist", src:spriteSheet},
    {type:"plist", src:star_burst},
    {type:"plist", src:off_screen},
    {type:"plist", src:line_burst},
    {type:"plist", src:boost_hit},

    //sound
    {type:"sound", src:bgMusic},
    {type:"sound", src:boost_hit_snd},
	{type:"sound", src:ground_hit_snd},
    {type:"sound", src:line_hit_snd},
    {type:"sound", src:star_hit_snd},
    {type:"sound", src:sun_hit_snd},
	{type:"sound", src:wall_hit_snd},
    {type:"sound", src:last_star_snd},
    {type:"sound", src:sun_grow_snd},
    {type:"sound", src:sun_rise_snd},

    // FNT
    {type:"fnt", src:fontLevel},
    {type:"fnt", src:fontScore}

];
