const helpers = require('./helpers.js');


function gradient(x,min,max,begin,end){

    let dist = max-min;
    return begin + ((end-begin) * (((x-min)%dist)/dist));
}

function multiGradient(x,min,max,begin,end){

    let dist = max-min;

    let val = (x-min);
    let new_val = 0 ;
    let index = 0 ;
    
    if (val !== 0){	
	index = Math.floor((val%dist)*begin.length/dist);
	new_val = ((val%dist)*begin.length/dist);
    }
    else {
	index  = 0 ;
	new_val = 0;
    }

    return begin[index] + ((end[index]-begin[index]) * (new_val-Math.floor(new_val)));
}

function colormapGreys(f,min,max){

    function greys(x,y){
	
	let res = f(x,y);
	let begin = 255 ;
	let end  = 0;
	let color = gradient(res,min,max,begin,end);
	
	return helpers.getColor(color,color,color,begin);
    }
    return greys;
}


function colormapMushroom(f,min,max){

    function mushroom(x,y){

	let res = f(x,y);
	let begin = 255 ;
	let end = 0 ;
	let red = gradient(res,min,max,begin,end);
	let green = begin-gradient(res,min,max,begin,end);
	let blue = begin-gradient(res,min,max,begin,end);
	
	return helpers.getColor(red,green,blue,begin);
    }
    return mushroom;
}

function colormapSpring(f,min,max){

    function spring(x,y){

	let res = f(x,y);
	let begin = 255 ;
	let end = 0;
	let red = gradient(res,min,max,begin,end);
	let green = begin-gradient(res,min,max,begin,end);
	let blue = 0;
	return helpers.getColor(red,green,blue,begin);
    }
    return spring;
}

function colormapJet(f,min,max){

    function jet(x,y){

	let res = f(x,y);
	let begin = 255 ;
	let end = 0;
	let red = gradient(res,min,max,begin,end);
	let green = 0;
	let blue = begin-gradient(res,min,max,begin,end);
	return helpers.getColor(red,green,blue,begin);
    }
    return jet;
}

function colormapHSL(f,min,max){

    function hsl(x,y){

	let res = f(x,y);
	let begin = 0 ;
	let end = 255;
	let blue = gradient(res,min,max,begin,end);
	let red = 240;
	let green = 97;
	return helpers.getColor(red,blue,green,255);
    }
    return hsl;
}

function colormapLight(f,min,max){

    function light(x,y){

	let res = f(x,y);
	let blue = multiGradient(res,min,max,[255,125,0,0,0,0],[125,0,0,0,0,0]);
	let green = multiGradient(res,min,max,[0,125,255,125,0],[125,255,125,0,0]);
	let red = multiGradient(res,min,max,[0,0,0,0,125],[0,0,125,255,0]);
	return helpers.getColor(red,green,blue,255);
    }
    return light;
}

function colormapIsland(f,min,max){

    function island(x,y){

	let res = f(x,y);
	let red = multiGradient(res,min,max,[0,135,249,127,154,128],[0,135,249,127,154,128]);
	let green = multiGradient(res,min,max,[0,206,228,255,205,128],[0,206,228,255,205,128]);
	let blue = multiGradient(res,min,max,[255,235,183,0,50,0],[255,235,183,0,50,0]);	
	return helpers.getColor(red,green,blue,255);
    }
    return island;
}
/*
function colormapHot(f,min,max,axis){

    function hot(x,y){

	let res = f(x-axis[0],y-axis[1]);
	let maxIntensity = 255 ;

	let blue = multiGradient(res,min,max,[120,240,30],[240,30,246]);
	let red = multiGradient(res,min,max,[12,120],[120,11])
	let green = gradient(res,min,max,0,255)
	return helpers.getColor(red,blue,green,255)
    }
    return hot;
}
*/

function colormapHot(f,min,max){

    function hot(x,y){

	let res = f(x,y);
	let blue = multiGradient(res,min,max,[255,120,0,0],[120,0,0,0]);
	let red = multiGradient(res,min,max,[0,0,120,240],[0,120,240,110]);
	let green = multiGradient(res,min,max,[0,0,120,0],[0,120,0,0]);
	return helpers.getColor(red,green,blue,255);
    }
    return hot;
}


const colormaps = {greys:colormapGreys,mushroom:colormapMushroom,hot:colormapHot,spring:colormapSpring,jet:colormapJet,hsl:colormapHSL,light:colormapLight,island:colormapIsland} ;

exports.colormaps = colormaps;

