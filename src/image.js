const colors = require('./colors.js');
const generators = require('./generators.js');
const filters = require('./filters.js');


function imageGeneration(canvas, width, height, getPixelColor) {
    let context = canvas.getContext("2d");
    let image = context.createImageData(width, height);

    let n = 0; // Index inside the image array
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++, n += 4) {
            const pixelColor = getPixelColor(x, y);
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

    const planet = {
        src: {
            img: generators.colorMap.colorMap,
            options: {
                f: generators.colorMap.predicate.focused(
                    (x, y) => {
                        if (Math.sqrt(x ** 2 + y ** 2) < 75) {
                            return x ** 2 + y ** 2;
                        }
                        return 75 ** 2;
                    },
                    height, width, -150, 150, -150, 150),
                min: 0,
                max: 75 ** 2,
                redVariations: [[255, 20], [20, 0]],
                greenVariations: [[255, 20], [20, 0]],
                blueVariations: [[255, 20], [20, 0]],
                alphaVariations: [[255], [0]]
            },
            filters: {
                1: {
                    filter: filters.bulge,
                    filter_options: {
                        size: {
                            width: width,
                            height: height
                        },
                        coef: 0.5
                    }
                }
            }
        },
        linker: {
            composition: filters.composition.multiply,
        },
        dst: {
            src: {
                img: generators.colorMap.examples.hot,
                options: {
                    f: generators.noiseGenerator(
                        {
                            noise: generators.noise.noiseFractals.fractal,
                            noiseOptions: {
                                width: width,
                                height: height,
                                fractal: 'fbm',
                                fractalOptions: {
                                    noiseGen: "perlin",
                                    argsList: {
                                        variant: "simplex",
                                        scale: 12
                                    },
                                    octaves: 4,
                                    persistence: 0.5,
                                    lacunarity: 2,
                                    initial_amplitude: 3,
                                    initial_frequency: 0.3,
                                    get_noise: true
                                }
                            }
                        }
                    ),
                    min: -1,
                    max: 1
                }
            }
        }
    };

    const stars = {
        src: {
            img: generators.colorMap.colorMap,
            options: {
                f: generators.noiseGenerator(
                    {
                        noise: generators.noise.noiseFractals.warp,
                        noiseOptions: {
                            width: width,
                            height: height,
                            fractalGen: {
                                fractal: 'turbulence',
                                fractalOptions: {
                                    noiseGen: "perlin",
                                    noiseSeed: 1339,
                                    argsList: {
                                        variant: "simplex",
                                        scale: 48
                                    },
                                    octaves: 4,
                                    initial_frequency: 0.3,
                                    initial_amplitude: 3,
                                    lacunarity: 3,
                                    frequency: 0.7
                                }
                            },
                            qMultiplier: 100,
                            rMultiplier: 100,
                            colored: false,
                            get_noise: true
                        }
                    }
                ),
                min: 1,
                max: -1,
                redVariations: [[0], [0], [0], [0], [0], [0], [0, 255], [255]],
                greenVariations: [[0], [0], [0], [0], [0], [0], [0, 255], [255]],
                blueVariations: [[0], [0], [0], [0], [0], [0], [0, 255], [255]],
                alphaVariations: [[255]]
            }
        }
    };

    const starsXplanet = {
        src: {
            img: () => generators.generate(planet),
        },
        linker: {
            composition: filters.composition.over
        },
        dst: {
            src: {
                img: () => generators.generate(stars)
            }
        },
        filters: {
            1: {
                filter: filters.anaglyphe,
                filter_options: {
                    dx: 3,
                    dy: 2,
                    color: colors.examples.TRANSPARENT
                }
            }
        }
    };


    ////////////////////////////////////////////////////
    ///////////////////// FILTERS //////////////////////
    ////////////////////////////////////////////////////

    //// Shortcut to filters functions in the JSON representation ////
    //// For example, mirror has to be called as :               ////
    //// mirror(options of the filter)(index determining the      ////
    //// order to apply filters)(other_filters function)           ////
    const mirror = generators.filtersDescriptorHelper(filters.mirror);
    const clear = generators.filtersDescriptorHelper(filters.clear);
    const bulge = generators.filtersDescriptorHelper(filters.bulge);
    const setOpacity = generators.filtersDescriptorHelper(filters.setOpacity);
    const transform = generators.filtersDescriptorHelper(filters.transform);
    const limit = generators.filtersDescriptorHelper(filters.limit);
    const pixelate = generators.filtersDescriptorHelper(filters.pixelate);
    const negative = generators.filtersDescriptorHelper(filters.negative)();
    const changeRGBAColor = generators.filtersDescriptorHelper(filters.changeRGBAColor);
    const repeat = generators.filtersDescriptorHelper(filters.repeat);
    const anaglyphe = generators.filtersDescriptorHelper(filters.anaglyphe);
    const gaussianBlur = generators.filtersDescriptorHelper(filters.gaussianBlur);
    const blackWhite = generators.filtersDescriptorHelper(filters.blackWhite)();

    ///////////// Filters with pre-defined options /////////////
    ///////// Example : xMirror(index)(other_filters) //////////

    const xMirror = mirror({
        axe: 'x',
        width: width,
        height: height
    });
    const yMirror = mirror({
        axe: 'y',
        width: width,
        height: height
    });
    const xyMirror = mirror({
        axe: 'xy',
        width: width,
        height: height
    });
    
    const clearInCircle = clear({
        toClear: (x, y) => Math.sqrt((x - 125) ** 2 + (y - 125) ** 2) > 100
    });

    const bulgeBump = bulge({
        size: {
            width : width,
            height: height
        },
        bulge: {
            x: 0.4,
            y: 0.6
        },
        coef: 1
    });
    const bulgeVanishingPoint = bulge({
        size: {
            width : width,
            height: height
        },
        bulge: {
            x: 0.4,
            y: 0.6
        },
        coef: -1
    });
    const bulgeHole = bulge({
        size: {
            width : width,
            height: height
        },
        bulge: {
            x: 0.4,
            y: 0.6
        },
        coef: -0.5
    });

    const halfOpacity = setOpacity({
        coef: 0.5
    });
    const hundredOpacity = setOpacity({
        opacity: 100
    });

    const translateRotateScale = transform({
        size: {
            width: width,
            height: height
        },
        offset: {
            x: 50,
            y: 10
        },
        scale: {
            x: 0.5,
            y: 0.5
        },
        angle: 42
    });

    const window = limit({
        xlim: {
            min: 42,
            max: 125
        },
        ylim: {
            min: 89,
            max: 200
        }
    });

    const bigPixel = pixelate({
        size: {
            x: 5,
            y: 3
        }
    });

    const redMax = changeRGBAColor({
        red: 255
    });

    const smallRepeat = repeat({
        width: width,
        height: height,
        size: {
            x: width / 5,
            y: height / 5
        }
    });

    const effect3D = anaglyphe({
        dx: 3,
        dy: 2
    });

    const kernel = filters.createKernel(
        {
            kernelSize : 3,
            sigma : 1.5
        });
    const blur = gaussianBlur({
        kernel : kernel,
        kernelSize : 3
    });


    ///////////// Composition filters /////////////
    const xor = filters.composition.xor;
    const over = filters.composition.over;
    const add = filters.composition.add;
    const atop = filters.composition.atop;
    const multiply = filters.composition.multiply;
    const divide = filters.composition.divide;
    const inSrc = filters.composition.inSrc;
    const minus = filters.composition.minus;
    const out = filters.composition.out;
    const screen = filters.composition.screen;


    ////////////////////////////////////////////////////
    ///////////////// NOISE Generators /////////////////
    ////////////////////////////////////////////////////

    //// Shortcut to noise generator functions in the JSON representation /////
    //// to use like noise(options)()                                     /////
    const noise = generators.imageDescriptorHelper(generators.noiseGenerator);

    ///////////// Noise generators with pre-defined options /////////////
    ////////////// Example : xMirror(index)(other_filters) //////////////

    ///////////////// Perlin Noise /////////////////////

    const simplexNoise = noise({
        noise: generators.noise.noiseGenerators.perlinNoise,
        noiseOptions: {
            width: width,
            height: height,
            seed: 1338,
            variant: 'simplex'
        }
    })();

    const valueNoise = noise({
        noise: generators.noise.noiseGenerators.perlinNoise,
        noiseOptions: {
            width: width,
            height: height,
            seed: 1338,
            variant: 'value'
        }
    })();

    const gradientNoise = noise({
        noise: generators.noise.noiseGenerators.perlinNoise,
        noiseOptions: {
            width: width,
            height: height,
            seed: 1338,
            variant: 'gradient'
        }
    })();

    ///////////////// Fractal Brownian Motion //////////

    const fractalFbmPerlinSimplexColored = noise({
        noise: generators.noise.noiseFractals.fractal,
        noiseOptions: {
            width: width,
            height: height,
            fractal: 'fbm',
            fractalOptions: {
                noiseGen: "perlin",
                noiseSeed: 2567,
                argsList: {
                    variant: "simplex"
                },
                octaves: 5,
                persistence: 0.5,
                lacunarity: 2,
                initial_amplitude: 2,
                initial_frequency: 0.2,
                colored: true
            }
        }
    })();

    const fractalFbmWorley = noise({
        noise: generators.noise.noiseFractals.fractal,
        noiseOptions: {
            width: width,
            height: height,
            fractal: 'fbm',
            fractalOptions: {
                noiseGen: "worley",
                noiseSeed: 1338,
                argsList: {
                    type: "f2 - f1",
                    distance: "euclidean",
                    three_dimensions: true
                },
                octaves: 2,
            }
        }
    })();

    ///////////////// Turbulence Noise /////////////////

    const fractalTurbulencePerlin = noise({
        noise: generators.noise.noiseFractals.fractal,
        noiseOptions: {
            width: width,
            height: height,
            fractal: 'turbulence',
            fractalOptions: {
                noiseGen: "perlin",
                noiseSeed: 1338,
                argsList: {
                    variant: "simplex",
                    scale: 4
                },
                octaves: 6
            }
        }
    })();

    const fractalTurbulenceWorley = noise({
        noise: generators.noise.noiseFractals.fractal,
        noiseOptions: {
            width: width,
            height: height,
            fractal: 'turbulence',
            fractalOptions: {
                noiseGen: "worley",
                noiseSeed: 1338,
                argsList: {
                    type: "f2 - f1",
                    distance: "euclidean",
                    three_dimensions: true
                },
                octaves: 2
            }
        }
    })();

    ///////////////// Ridged Multifractal Noise /////////////////

    const fractalRidgedPerlinColored = noise({
        noise: generators.noise.noiseFractals.fractal,
        noiseOptions: {
            width: width,
            height: height,
            fractal: 'ridged',
            fractalOptions: {
                noiseGen: "perlin",
                noiseSeed: 1338,
                argsList: {
                    variant: "simplex",
                    scale: 4
                },
                octaves: 6,
                persistence: 0.5,
                lacunarity: 2,
                initial_amplitude: 2,
                initial_frequency: 0.6,
                colored: true
            }
        }
    })();

    const fractalRidgedWorleyColored = noise({
        noise: generators.noise.noiseFractals.fractal,
        noiseOptions: {
            width: width,
            height: height,
            fractal: 'ridged',
            fractalOptions: {
                noiseGen: "worley",
                noiseSeed: 1338,
                argsList: {
                    type: "f2 - f1",
                    distance: "euclidean",
                    three_dimensions: false
                },
                octaves: 2,
                colored: true
            }
        }
    })();

    ///////////////// Worley Noise /////////////////

    const cellularWorleyNoise = noise({
        noise: generators.noise.noiseGenerators.worleyNoise,
        noiseOptions: {
            width: width,
            height: height,
            three_dimensions: true,
            colored: true,
            seed: 43,
            type: "f2 - f1",
            distance: "euclidean"
        }
    })();

    ///////////////// Domain Warping /////////////////

    const fractalDomainWarpingRidgedWorley = noise({
        noise: generators.noise.noiseFractals.warp,
        noiseOptions: {
            width: width,
            height: height,
            fractalGen: {
                fractal: 'ridged',
                fractalOptions: {
                    noiseGen: "worley",
                    noiseSeed: 1338,
                    argsList: {
                        type: "f2 - f1",
                        distance: "euclidean",
                        three_dimensions: true
                    },
                    octaves: 2
                }
            },
            qMultiplier: 4,
            rMultiplier: 4,
            colored: true
        }
    })();

    const fractalDomainWarpingTurbulencePerlin = noise({
        noise: generators.noise.noiseFractals.warp,
        noiseOptions: {
            width: width,
            height: height,
            fractalGen: {
                fractal: 'fbm',
                fractalOptions: {
                    noiseGen: "perlin",
                    noiseSeed: 44,
                    octaves: 2
                }
            },
            qMultiplier: 40,
            rMultiplier: 20,
            colored: true
        }
    })();


    ////////////////////////////////////////////////////
    //////////////// TILING Generators /////////////////
    ////////////////////////////////////////////////////

    //// Shortcut to tiling generators functions in the JSON representation /////
    //// to use like aTiling(options)()                                     /////
    const solidColor = generators.imageDescriptorHelper(generators.tilings.solid);
    const checkerboard = generators.imageDescriptorHelper(generators.tilings.checkerboard);
    const rectangleTriangle = generators.imageDescriptorHelper(generators.tilings.rectangleTriangle);
    const isocelesTriangle = generators.imageDescriptorHelper(generators.tilings.isoscelesTriangle);
    const equilateralTriangle = generators.imageDescriptorHelper(generators.tilings.equilateralTriangle);
    const zigzag = generators.imageDescriptorHelper(generators.tilings.zigzag);
    const grid = generators.imageDescriptorHelper(generators.tilings.grid);
    const doubleVichy = generators.imageDescriptorHelper(generators.tilings.doubleVichy);
    const hourglass = generators.imageDescriptorHelper(generators.tilings.hourglass);
    const octagonal = generators.imageDescriptorHelper(generators.tilings.octagonal);
    const grandmaTexture = generators.imageDescriptorHelper(generators.tilings.grandmaTexture);
    const beePattern = generators.imageDescriptorHelper(generators.tilings.beePattern);
    const voronoiHexagonal = generators.imageDescriptorHelper(generators.tilings.voronoiHexagonal);
    const voronoiRandom = generators.imageDescriptorHelper(generators.tilings.voronoiRandom);
    const voronoiPentagonal = generators.imageDescriptorHelper(generators.tilings.voronoiPentagonal);

    ///////////// Tiling generators with pre-defined options //////////
    /////////////////////// Example : solidColor /////////////////////
    const indigo = solidColor({color: colors.examples.INDIGO})();
    const blue = solidColor({color: colors.examples.BLUE})();

    const chessBoard = checkerboard({
        pixelPerCase: width / 5,
        color1: colors.examples.WHITE,
        color2: colors.examples.BLACK,
    })();

    const rectangleTriangleIndigoBlue = rectangleTriangle({
        size: width / 5,
        color1: colors.examples.INDIGO,
        color2: colors.examples.BLUE
    })();

    const isocelesTriangleRedVerdigri = isocelesTriangle({
        size: width / 5,
        color1: colors.examples.RED,
        color2: colors.examples.VERDIGRI
    })();

    const equilateralTriangleRedGreen = equilateralTriangle({
        size: width / 5,
        color1: colors.examples.RED,
        color2: colors.examples.GREEN
    })();

    const zigzagRedGreen = zigzag({
        size: width / 5,
        color1: colors.examples.RED,
        color2: colors.examples.GREEN
    })();

    const gridBlackGreen = grid({
        size: width / 5,
        color1: colors.examples.BLACK,
        color2: colors.examples.GREEN
    })();

    const doubleVichyBlackGreen = doubleVichy({
        size: 7,
        color1: colors.examples.BLACK,
        color2: colors.examples.GREEN
    })();

    const hourglassBlackWhite = hourglass({
        size: 50,
        color1: colors.examples.BLACK,
        color2: colors.examples.WHITE
    })();

    const octagonalRedBlack = octagonal({
        size: 50,
        width: 1,
        color1: colors.examples.RED,
        color2: colors.examples.BLACK
    })();

    const grandmaTexturePurpleBlack = grandmaTexture({
        size1: 7,
        size2: 10,
        width: 1,
        color1: colors.examples.PURPLE,
        color2: colors.examples.BLACK
    })();

    const beePatternYellowBlack = beePattern({
        color1: colors.examples.YELLOW,
        color2: colors.examples.BLACK
    })();

    const voronoiHex = voronoiHexagonal({
        height: height,
        width: width,
        size: 20
    })();

    const voronoiRng = voronoiRandom({
        height: height,
        width: width,
        size: 20,
        number: 42
    })();

    const voronoiPenta = voronoiPentagonal({
        height: height,
        width: width,
        size: 70
    })();

    ////////////////////////////////////////////////////
    /////////////// COLORMAPS Generators ///////////////
    ////////////////////////////////////////////////////

    //// Shortcut to colorMap generators functions in the JSON representation /////
    //// to use like aColorMap(options)()                                     /////
    const colorMapHot = generators.imageDescriptorHelper(generators.colorMap.examples.hot);
    const colorMapHsl = generators.imageDescriptorHelper(generators.colorMap.examples.hsl);
    const colorMapJet = generators.imageDescriptorHelper(generators.colorMap.examples.jet);
    const colorMapSnow = generators.imageDescriptorHelper(generators.colorMap.examples.snow);
    const colorMapGreys = generators.imageDescriptorHelper(generators.colorMap.examples.greys);
    const colorMapIsland = generators.imageDescriptorHelper(generators.colorMap.examples.island);
    const colorMapIslandD = generators.imageDescriptorHelper(generators.colorMap.examples.islandD);
    const colorMapLight = generators.imageDescriptorHelper(generators.colorMap.examples.light);
    const colorMapMushroom = generators.imageDescriptorHelper(generators.colorMap.examples.mushroom);
    const colorMapPurple = generators.imageDescriptorHelper(generators.colorMap.examples.purple);
    const colorMapSpring = generators.imageDescriptorHelper(generators.colorMap.examples.spring);
    
    // Shortcut to some colorMap predicate function
    const focus = generators.colorMap.predicate.focused;
    const mandelBrotSet = generators.colorMap.predicate.mandelbrotSet;

    ///////////// ColorMap Generator with pre-defined options /////////////
    ///////////////////////// Example : hotWave //////////////////////////

    const hotWave = colorMapHot({
        f: generators.colorMap.predicate.wave,
        min: -50,
        max: 50
    })();

    const hslSplash = colorMapHsl({
        f: focus(generators.colorMap.predicate.splash, height, width, -1, 1, -1, 1),
        min: -0.001,
        max: 0.001
    })();

    const jetPic = colorMapJet({
        f: focus(generators.colorMap.predicate.pic, height, width, -1, 1, -1, 1),
        min: -1,
        max: 1
    })();

    const snowMandelBrot = colorMapSnow({
        f: focus(mandelBrotSet(10, 4), height, width, -2, 1, -1.5, 1.5),
        min: -1,
        max: 1
    })();

    const greysMandelBrot = colorMapGreys({
        f: focus(mandelBrotSet(10, 2), height, width, -1, 1, -1, 1),
        min: -1,
        max: 1
    })();

    const islandJuliaDragon = colorMapIsland({
        f: focus(generators.colorMap.predicate.juliaShapes.juliaDragon(25, 2), height, width, -1, 1, -1, 1),
        min: -1,
        max: 1
    })();

    const islandDJuliaElec = colorMapIslandD({
        f: focus(generators.colorMap.predicate.juliaShapes.juliaElec(10, 2), height, width, -1, 1, -1, 1),
        min: -1,
        max: 1
    })();

    const lightJuliaBubble = colorMapLight({
        f: focus(generators.colorMap.predicate.juliaShapes.juliaBubble(25, 2), height, width, -1, 1, -1, 1),
        min: -1,
        max: 1
    })();

    const mushroomJuliaCrown = colorMapMushroom({
        f: focus(generators.colorMap.predicate.juliaShapes.juliaCrown(25, 2), height, width, -1, 1, -1, 1),
        min: -1,
        max: 1
    })();

    const purpleJuliaSpi = colorMapPurple({
        f: focus(generators.colorMap.predicate.juliaShapes.juliaSpi(25, 2), height, width, -1, 1, -1, 1),
        min: -1,
        max: 1
    })();

    const springJuliaPeak = colorMapSpring({
        f: focus(generators.colorMap.predicate.juliaShapes.juliaPeak(7, 3), height, width, -1, 1, -1, 1),
        min: -1,
        max: 1
    })();

    ////////////////////////////////////////////////////
    ///////////////// IMAGE GENERATION /////////////////
    ////////////////////////////////////////////////////

    /*
    // Template
    const pixel = generators.generate({
        src: {
            ...snowMandelBrot,
            filters: {}
        },
        linker: {
            composition: divide
        },
        dst: {
            src: {
                ...voronoiPenta,
                filters: {}
            }
        },
        filters: {}
    });
    */

    // 3 different example of using generate and JSON format 
    // need only one to be uncommented

    /* 
    // Simple example of composition
    const pixel = generators.generate({
        src: snowMandelBrot,
        linker: {
            composition: divide
        },
        dst: {
            src: voronoiPenta
        },
        filters: {

        }
    });
    */

    /* 
    // Simple example of a image with filters
    const pixel = generators.generate({
       src: {
           ...cellularWorleyNoise,
           filters: {
               ...negative(1)(
                   redMax(2)()
               )
           }
       }
    });
    */
   

    // Simple generator
    const pixel = generators.generate({
        src: greysMandelBrot
    });

    return imageGeneration(canvas, width, height, pixel);
}

exports.getImage = getImage;
