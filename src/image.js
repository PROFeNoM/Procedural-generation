const helpers = require('./helpers.js');

const generators = require('./generators.js');
const generatorsLucas = require('./generators_lucas.js');
const generatorsleo = require('./generator_leo.js');
const colormaps = require('./colormap.js');
const functionMap = require('./function_map.js');


const filtersLucas = require('./filters_lucas.js');
const filtersleo = require('./filters_leo.js');

function imageGeneration(canvas, width, height, getPixelColor) {
    let context = canvas.getContext("2d");
    let image = context.createImageData(width, height);

    let n = 0; // Index inside the image array
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++, n += 4) {
            //console.log(x,y);
            let pixelColor = getPixelColor(x, y);
            image.data[n] = pixelColor.red;
            image.data[n + 1] = pixelColor.green;
            image.data[n + 2] = pixelColor.blue;
            image.data[n + 3] = pixelColor.alpha;
        }
    }
    context.putImageData(image, 0, 0);
    return canvas;
}

function getImage(canvas, width, height) {

    let pixel;
    
    ///////////////////// Generators : /////////////////////

    // Checkerboard
    //pixel = generatorsLucas.makeCheckerboard(width, height, 50,
	//						  helpers.getColor(255,0,0,255),
	//						  helpers.getColor(0,255,0,255));

    // Perlin Noise
    //pixel = generators.perlinNoiseGen(width, height, undefined, undefined, true);

    // Fractional Brownian Motion
    //pixel = generators.fractionalBrownianMotionGen(width, height, "perlin", undefined,8, 0.5, 2, 2, 0.1, false);
    //pixel = generators.fractionalBrownianMotionGen(width, height, "worley", ['f2 - f1', 'euclidean', false], 3, undefined, undefined, undefined, undefined, true)

    // Worley Noise
    //pixel = generators.worleyNoiseGen(width, height, 'f2 - f1', 'euclidean', true, true);

    // Colormap
    pixel = generatorsleo.getColormap(functionMap.focused(functionMap.juliaSpi(50),height,width,-1,1,-1,1),"islandD",0,7);
    
    //Bee
   
    //pixel = generatorsleo.bee(helpers.getColor(0,0,0,255),helpers.getColor(140,120,0,255));

    
    
    ///////////////////// Filters : /////////////////////

    //Opacity Changer with value
    //pixel = filtersLucas.opacityChanger(pixel, 100);

    canvas = imageGeneration(canvas, width, height, pixel);

    
    //let matrices = filtersleo.canvasToMatrix(canvas,height,width);
    //let matricesfiltered = filtersleo.reverseImg(matrices,"","");
    //canvas = filtersleo.MatrixToCanvas(matricesfiltered,height,width);
    
    return canvas;
}

exports.getImage = getImage;
