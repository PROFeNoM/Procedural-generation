const fs = require('fs');
const { createCanvas, createImageData } = require('canvas');
const generators = require('./generators.js');


function imageGeneration(canvas, width, height, getPixelColor) {
    let context = canvas.getContext("2d");
    let image = createImageData(width, height);

    let n = 0; // Index inside the image array
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++, n += 4) {
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

const width = 500, height = 500;
let canvas = createCanvas(width, height);
canvas = imageGeneration(canvas, width, height, generators.randGen);
let buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./canvas.png', buffer);