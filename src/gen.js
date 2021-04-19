const helpers = require('./colors.js');

/**
 * 
 * @param {*} min 
 * @param {*} max 
 * @returns 
 */
function multiGradient(min, max) {
    const dist = Math.abs(max - min) * 1.01; //distance intervalle
    const sign = 1;
    if (min > max) { // si les bornes sont inversée on inverse tout ainsi que x
        min = -min;
        max = -max;
        sign = -1;
    }
    function _gradient(x, variations) {
        let value;
        let normedValue;
        let index;
        let step;
        
        x = x * sign;
        if (x < min) { // si x est avant l'intervalle
            // borne max positive - écart
            value = dist - Math.abs(x - min) % dist; // calcul de l'écart à la borne modulo la taille de l'intervalle
        }
        else if (x <= max) { // si x est dans l'intervalle pas de soucis
            value = x - min;
        }
        else { // si x est après l'intervalle
            value = Math.abs(x - max) % dist; // calcul de l'écart à la borne modulo la taille de l'intervalle
        }
        index = Math.floor(value / dist);
        step = dist / variations.length;
        normedValue = (value - index * step) / step;
        if (variations[index].length === 1)
            return variations[index][0];
        return variations[index][0] + (variations[index][1] - variations[index][0]) * normedValue;
    }
    return _gradient;
}

/**
 * Apply multiGradient to each color depending on the result of f(x, y)
 * @param {*} f 
 * @param {*} min 
 * @param {*} max 
 * @param {*} redVariations 
 * @param {*} greenVariations 
 * @param {*} blueVariations 
 * @param {*} alphaVariations 
 * @returns 
 */
function colorMap(options) {
    const gradient = multiGradient(options.min, options.max);
    function _colorMap(x, y) {
        let res = options.f(x, y);
        let red = gradient(res, options.redVariations);
        let green = gradient(res, options.greenVariations);
        let blue = gradient(res, options.blueVariations);
        let alpha = gradient(res, options.alphaVariations);
        return helpers.createColor(red, green, blue, alpha);
    }
    return _colorMap;
}

exports.colorMap = colorMap;