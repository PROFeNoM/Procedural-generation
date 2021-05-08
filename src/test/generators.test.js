const generators = require('./../generators.js');
const colors = require('./../colors.js');


function testWhite() {
    describe('White Noise test suite', () => {

        test('Test of White Noise RGBA', () => {
            const pixel = generators.noiseGenerator(
                {
                    noise: generators.noise.noiseGenerators.whiteNoise,
                    noiseOptions: {
                        width: 250,
                        height: 250,
                    }
                }
            );


            expect(pixel(0, 0)).toStrictEqual(colors.createColor(230, 127, 250, 255));
            expect(pixel(0, 50)).toStrictEqual(colors.createColor(92, 92, 53, 255));
            expect(pixel(50, 100)).toStrictEqual(colors.createColor(151, 202, 158, 255));
            expect(pixel(100, 150)).toStrictEqual(colors.createColor(175, 227, 38, 255));
            expect(pixel(150, 200)).toStrictEqual(colors.createColor(235, 242, 166, 255));
            expect(pixel(200, 250)).toStrictEqual(colors.createColor(137, 225, 233, 255));
            expect(pixel(250, 250)).toStrictEqual(colors.createColor(147, 161, 162, 255));
        });

    });
}

function testPerlin() {
    describe('Perlin Noise test suite', () => {

        test('Test of invalid Width/Height Type', () => {
            const pixel = () => generators.noiseGenerator(
                {
                    noise: generators.noise.noiseGenerators.perlinNoise,
                    noiseOptions: {
                        width: '250',
                        height: 250,
                        seed: 1338,
                        variant: 'perlin'
                    }
                }
            );

            expect(() => pixel()).toThrowError(Error);
        })

        test('Test of invalid Noise Type', () => {
            const pixel = () => generators.noiseGenerator(
                {
                    noise: generators.noise.noiseGenerators.perlinNoise,
                    noiseOptions: {
                        width: 250,
                        height: 250,
                        seed: 1338,
                        variant: 'perlin'
                    }
                }
            );

            expect(() => pixel()).toThrowError(Error);
        })

        test('Test of Value Noise RGBA', () => {
            const pixel = generators.noiseGenerator(
                {
                    noise: generators.noise.noiseGenerators.perlinNoise,
                    noiseOptions: {
                        width: 250,
                        height: 250,
                        seed: 1338,
                        variant: 'value'
                    }
                }
            );

            expect(pixel(0, 0)).toStrictEqual(colors.createColor(203, 203, 203, 255));
            expect(pixel(0, 50)).toStrictEqual(colors.createColor(208, 208, 208, 255));
            expect(pixel(50, 100)).toStrictEqual(colors.createColor(113, 113, 113, 255));
            expect(pixel(100, 150)).toStrictEqual(colors.createColor(232, 232, 232, 255));
            expect(pixel(150, 200)).toStrictEqual(colors.createColor(58, 58, 58, 255));
            expect(pixel(200, 250)).toStrictEqual(colors.createColor(172, 172, 172, 255));
            expect(pixel(250, 250)).toStrictEqual(colors.createColor(108, 108, 108, 255));
        });

        test('Test of Gradient Noise RGBA', () => {
            const pixel = generators.noiseGenerator(
                {
                    noise: generators.noise.noiseGenerators.perlinNoise,
                    noiseOptions: {
                        width: 250,
                        height: 250,
                        seed: 1338,
                        variant: 'gradient'
                    }
                }
            );

            expect(pixel(0, 0)).toStrictEqual(colors.createColor(127, 127, 127, 255));
            expect(pixel(0, 50)).toStrictEqual(colors.createColor(111, 111, 111, 255));
            expect(pixel(50, 100)).toStrictEqual(colors.createColor(156, 156, 156, 255));
            expect(pixel(100, 150)).toStrictEqual(colors.createColor(164, 164, 164, 255));
            expect(pixel(150, 200)).toStrictEqual(colors.createColor(178, 178, 178, 255));
            expect(pixel(200, 250)).toStrictEqual(colors.createColor(142, 142, 142, 255));
            expect(pixel(250, 250)).toStrictEqual(colors.createColor(127, 127, 127, 255));
        });

        test('Test of Colored Noise RGBA', () => {
            const pixel = generators.noiseGenerator(
                {
                    noise: generators.noise.noiseGenerators.perlinNoise,
                    noiseOptions: {
                        width: 250,
                        height: 250,
                        seed: 1338,
                        variant: 'simplex',
                        colored: true
                    }
                }
            );

            expect(pixel(0, 0)).toStrictEqual(colors.createColor(63, 191, 191, 255));
            expect(pixel(0, 50)).toStrictEqual(colors.createColor(191, 122, 63, 255));
            expect(pixel(50, 100)).toStrictEqual(colors.createColor(191, 63, 181, 255));
            expect(pixel(100, 150)).toStrictEqual(colors.createColor(191, 63, 166, 255));
            expect(pixel(150, 200)).toStrictEqual(colors.createColor(71, 63, 191, 255));
            expect(pixel(200, 250)).toStrictEqual(colors.createColor(191, 176, 63, 255));
            expect(pixel(250, 250)).toStrictEqual(colors.createColor(191, 95, 63, 255));
        });
    });
}

function testWorley() {
    describe('Worley Noise test suite', () => {

        test('Test of invalid distance type', () => {
            const pixel = () => generators.noiseGenerator({
                    noise: generators.noise.noiseGenerators.worleyNoise,
                    noiseOptions: {
                        width: 250,
                        height: 250,
                        three_dimensions: true,
                        colored: true,
                        seed: 43,
                        type: "f1 - f2",
                        distance: "euclidean"
                    }
                }
            );

            expect(() => pixel()).toThrowError(Error);
        });

        test('Test of invalid distance formula', () => {
            const pixel = () => generators.noiseGenerator({
                    noise: generators.noise.noiseGenerators.worleyNoise,
                    noiseOptions: {
                        width: 250,
                        height: 250,
                        three_dimensions: true,
                        colored: true,
                        seed: 43,
                        type: "f2",
                        distance: "linear"
                    }
                }
            );

            expect(() => pixel()).toThrowError(Error);
        });

        test('Test with 2D Euclidean distance formula RGBA', () => {
            const pixel = generators.noiseGenerator({
                    noise: generators.noise.noiseGenerators.worleyNoise,
                    noiseOptions: {
                        width: 250,
                        height: 250,
                        three_dimensions: false,
                        seed: 43,
                        type: "f2 - f1",
                        distance: "euclidean"
                    }
                }
            );

            expect(pixel(0, 0)).toStrictEqual(colors.createColor(84, 84, 84, 255));
            expect(pixel(0, 50)).toStrictEqual(colors.createColor(68, 68, 68, 255));
            expect(pixel(50, 100)).toStrictEqual(colors.createColor(12, 12, 12, 255));
            expect(pixel(100, 150)).toStrictEqual(colors.createColor(3, 3, 3, 255));
            expect(pixel(150, 200)).toStrictEqual(colors.createColor(34, 34, 34, 255));
            expect(pixel(200, 250)).toStrictEqual(colors.createColor(58, 58, 58, 255));
            expect(pixel(250, 250)).toStrictEqual(colors.createColor(190, 190, 190, 255));
        });

        test('Test with 3D Euclidean distance formula RGBA', () => {
            const pixel = generators.noiseGenerator({
                    noise: generators.noise.noiseGenerators.worleyNoise,
                    noiseOptions: {
                        width: 250,
                        height: 250,
                        three_dimensions: true,
                        colored: true,
                        seed: 43,
                        type: "f2 - f1",
                        distance: "euclidean"
                    }
                }
            );

            expect(pixel(0, 0)).toStrictEqual(colors.createColor(50, 107, 153, 255));
            expect(pixel(0, 50)).toStrictEqual(colors.createColor(72, 150, 211, 255));
            expect(pixel(50, 100)).toStrictEqual(colors.createColor(24, 54, 82, 255));
            expect(pixel(100, 150)).toStrictEqual(colors.createColor(26, 57, 87, 255));
            expect(pixel(150, 200)).toStrictEqual(colors.createColor(23, 51, 78, 255));
            expect(pixel(200, 250)).toStrictEqual(colors.createColor(72, 150, 211, 255));
            expect(pixel(250, 250)).toStrictEqual(colors.createColor(46, 99, 142, 255));
        });

        test('Test with 2D Chebyshev distance formula RGBA', () => {
            const pixel = generators.noiseGenerator({
                    noise: generators.noise.noiseGenerators.worleyNoise,
                    noiseOptions: {
                        width: 250,
                        height: 250,
                        three_dimensions: false,
                        seed: 43,
                        type: "f2 - f1",
                        distance: "chebyshev"
                    }
                }
            );

            expect(pixel(0, 0)).toStrictEqual(colors.createColor(28, 28, 28, 255));
            expect(pixel(0, 50)).toStrictEqual(colors.createColor(42, 42, 42, 255));
            expect(pixel(50, 100)).toStrictEqual(colors.createColor(14, 14, 14, 255));
            expect(pixel(100, 150)).toStrictEqual(colors.createColor(7, 7, 7, 255));
            expect(pixel(150, 200)).toStrictEqual(colors.createColor(64, 64, 64, 255));
            expect(pixel(200, 250)).toStrictEqual(colors.createColor(57, 57, 57, 255));
            expect(pixel(250, 250)).toStrictEqual(colors.createColor(142, 142, 142, 255));
        });

        test('Test with 3D Chebyshev distance formula RGBA', () => {
            const pixel = generators.noiseGenerator({
                    noise: generators.noise.noiseGenerators.worleyNoise,
                    noiseOptions: {
                        width: 250,
                        height: 250,
                        three_dimensions: true,
                        seed: 43,
                        type: "f2 - f1",
                        distance: "chebyshev"
                    }
                }
            );

            expect(pixel(0, 0)).toStrictEqual(colors.createColor(199, 199, 199, 255));
            expect(pixel(0, 50)).toStrictEqual(colors.createColor(157, 157, 157, 255));
            expect(pixel(50, 100)).toStrictEqual(colors.createColor(99, 99, 99, 255));
            expect(pixel(100, 150)).toStrictEqual(colors.createColor(14, 14, 14, 255));
            expect(pixel(150, 200)).toStrictEqual(colors.createColor(71, 71, 71, 255));
            expect(pixel(200, 250)).toStrictEqual(colors.createColor(235, 235, 235, 255));
            expect(pixel(250, 250)).toStrictEqual(colors.createColor(128, 128, 128, 255));
        });

        test('Test with 2D Manhattan distance formula RGBA', () => {
            const pixel = generators.noiseGenerator({
                    noise: generators.noise.noiseGenerators.worleyNoise,
                    noiseOptions: {
                        width: 250,
                        height: 250,
                        three_dimensions: false,
                        seed: 43,
                        type: "f2 - f1",
                        distance: "manhattan"
                    }
                }
            );

            expect(pixel(0, 0)).toStrictEqual(colors.createColor(107, 107, 107, 255));
            expect(pixel(0, 50)).toStrictEqual(colors.createColor(99, 99, 99, 255));
            expect(pixel(50, 100)).toStrictEqual(colors.createColor(7, 7, 7, 255));
            expect(pixel(100, 150)).toStrictEqual(colors.createColor(7, 7, 7, 255));
            expect(pixel(150, 200)).toStrictEqual(colors.createColor(21, 21, 21, 255));
            expect(pixel(200, 250)).toStrictEqual(colors.createColor(71, 71, 71, 255));
            expect(pixel(250, 250)).toStrictEqual(colors.createColor(255, 255, 255, 255));
        });

        test('Test with 3D Manhattan distance formula RGBA', () => {
            const pixel = generators.noiseGenerator({
                    noise: generators.noise.noiseGenerators.worleyNoise,
                    noiseOptions: {
                        width: 250,
                        height: 250,
                        three_dimensions: true,
                        seed: 43,
                        type: "f2 - f1",
                        distance: "manhattan"
                    }
                }
            );

            expect(pixel(0, 0)).toStrictEqual(colors.createColor(249, 249, 249, 255));
            expect(pixel(0, 50)).toStrictEqual(colors.createColor(255, 255, 255, 255));
            expect(pixel(50, 100)).toStrictEqual(colors.createColor(128, 128, 128, 255));
            expect(pixel(100, 150)).toStrictEqual(colors.createColor(28, 28, 28, 255));
            expect(pixel(150, 200)).toStrictEqual(colors.createColor(7, 7, 7, 255));
            expect(pixel(200, 250)).toStrictEqual(colors.createColor(255, 255, 255, 255));
            expect(pixel(250, 250)).toStrictEqual(colors.createColor(255, 255, 255, 255));
        });

        test('Test with f1 distance type RGBA', () => {
            const pixel = generators.noiseGenerator({
                    noise: generators.noise.noiseGenerators.worleyNoise,
                    noiseOptions: {
                        width: 250,
                        height: 250,
                        three_dimensions: false,
                        seed: 43,
                        type: "f1",
                        distance: "euclidean",
                        colored: false
                    }
                }
            );

            expect(pixel(0, 0)).toStrictEqual(colors.createColor(255, 255, 255, 255));
            expect(pixel(0, 50)).toStrictEqual(colors.createColor(134, 134, 134, 255));
            expect(pixel(50, 100)).toStrictEqual(colors.createColor(38, 38, 38, 255));
            expect(pixel(100, 150)).toStrictEqual(colors.createColor(164, 164, 164, 255));
            expect(pixel(150, 200)).toStrictEqual(colors.createColor(137, 137, 137, 255));
            expect(pixel(200, 250)).toStrictEqual(colors.createColor(86, 86, 86, 255));
            expect(pixel(250, 250)).toStrictEqual(colors.createColor(71, 71, 71, 255));
        });
    });
}

function testFractal() {
    describe('Fractal Noise test suite', () => {

        test('Test of invalid Noise Gen', () => {
            const pixel = () => generators.noiseGenerator({
                    noise: generators.noise.noiseFractals.fractal,
                    noiseOptions: {
                        width: 250,
                        height: 250,
                        fractal: 'fbm',
                        fractalOptions: {
                            noiseGen: "simplex",
                            noiseSeed: 2567,
                        }
                    }
                }
            );

            expect(() => pixel()).toThrowError(Error);
        });

        test('Test of invalid Fractal Gen', () => {
            const pixel = () => generators.noiseGenerator({
                    noise: generators.noise.noiseFractals.fractal,
                    noiseOptions: {
                        width: 250,
                        height: 250,
                        fractal: 'fractal brownian motion',
                        fractalOptions: {
                            noiseGen: "perlin",
                            noiseSeed: 2567,
                        }
                    }
                }
            );

            expect(() => pixel()).toThrowError(Error);
        });

        test('Test of Colored Fractal Brownian Motion Perlin Noise RGBA', () => {
            const pixel = generators.noiseGenerator({
                    noise: generators.noise.noiseFractals.fractal,
                    noiseOptions: {
                        width: 250,
                        height: 250,
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
                }
            );

            expect(pixel(0, 0)).toStrictEqual(colors.createColor(53, 113, 162, 255));
            expect(pixel(0, 50)).toStrictEqual(colors.createColor(31, 68, 101, 255));
            expect(pixel(50, 100)).toStrictEqual(colors.createColor(54, 116, 166, 255));
            expect(pixel(100, 150)).toStrictEqual(colors.createColor(42, 91, 132, 255));
            expect(pixel(150, 200)).toStrictEqual(colors.createColor(63, 134, 190, 255));
            expect(pixel(200, 250)).toStrictEqual(colors.createColor(42, 90, 131, 255));
            expect(pixel(250, 250)).toStrictEqual(colors.createColor(38, 83, 121, 255));
        });

        test('Test of Fractal Brownian Motion White Noise RGBA', () => {
            const pixel = generators.noiseGenerator({
                    noise: generators.noise.noiseFractals.fractal,
                    noiseOptions: {
                        width: 250,
                        height: 250,
                        fractal: 'fbm',
                        fractalOptions: {
                            noiseGen: "white",
                            noiseSeed: 2567,
                        }
                    }
                }
            );

            expect(pixel(0, 0)).toStrictEqual(colors.createColor(145, 145, 145, 255));
            expect(pixel(0, 50)).toStrictEqual(colors.createColor(170, 170, 170, 255));
            expect(pixel(50, 100)).toStrictEqual(colors.createColor(183, 183, 183, 255));
            expect(pixel(100, 150)).toStrictEqual(colors.createColor(78, 78, 78, 255));
            expect(pixel(150, 200)).toStrictEqual(colors.createColor(58, 58, 58, 255));
            expect(pixel(200, 250)).toStrictEqual(colors.createColor(132, 132, 132, 255));
            expect(pixel(250, 250)).toStrictEqual(colors.createColor(183, 183, 183, 255));
        });

        test('Test of Turbulence Worley Noise RGBA', () => {
            const pixel = generators.noiseGenerator(
                {
                    noise: generators.noise.noiseFractals.fractal,
                    noiseOptions: {
                        width: 250,
                        height: 250,
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
                }
            );

            expect(pixel(0, 0)).toStrictEqual(colors.createColor(116, 116, 116, 255));
            expect(pixel(0, 50)).toStrictEqual(colors.createColor(132, 132, 132, 255));
            expect(pixel(50, 100)).toStrictEqual(colors.createColor(82, 82, 82, 255));
            expect(pixel(100, 150)).toStrictEqual(colors.createColor(90, 90, 90, 255));
            expect(pixel(150, 200)).toStrictEqual(colors.createColor(149, 149, 149, 255));
            expect(pixel(200, 250)).toStrictEqual(colors.createColor(134, 134, 134, 255));
            expect(pixel(250, 250)).toStrictEqual(colors.createColor(180, 180, 180, 255));
        });

        test('Test of Ridged Multifractal Perlin Noise', () => {
            const pixel = generators.noiseGenerator(
                {
                    noise: generators.noise.noiseFractals.fractal,
                    noiseOptions: {
                        width: 250,
                        height: 250,
                        fractal: 'ridged',
                        fractalOptions: {
                            noiseGen: "perlin",
                            noiseSeed: 1338,
                            argsList: {
                                variant: "simplex",
                                scale: 2
                            },
                            octaves: 6,
                            persistence: 0.5,
                            lacunarity: 2,
                            initial_amplitude: 2,
                            initial_frequency: 0.6,
                            colored: false,
                            get_noise: true
                        }
                    }
                }
            );

            expect(pixel(0, 0)).toBeCloseTo(1, 5);
            expect(pixel(0, 50)).toBeCloseTo(-0.057767761524330274, 5);
            expect(pixel(50, 100)).toBeCloseTo(-0.3149360964376847, 5);
            expect(pixel(100, 150)).toBeCloseTo(0.26102661868469057, 5);
            expect(pixel(150, 200)).toBeCloseTo(-0.00025035731839018194, 5);
            expect(pixel(200, 250)).toBeCloseTo(-0.42836878037680326, 5);
            expect(pixel(250, 250)).toBeCloseTo(0.31074539969591863, 5);
        });

        test('Test of Ridged Multifractal Worley Noise', () => {
            const pixel = generators.noiseGenerator(
                {
                    noise: generators.noise.noiseFractals.fractal,
                    noiseOptions: {
                        width: 250,
                        height: 250,
                        fractal: 'ridged',
                        fractalOptions: {
                            noiseGen: "worley",
                            noiseSeed: 1338,
                            colored: false,
                            get_noise: true
                        }
                    }
                }
            );

            expect(pixel(0, 0)).toBeCloseTo(-0.7925390758759043, 5);
            expect(pixel(0, 50)).toBeCloseTo(0.03194949686774029, 5);
            expect(pixel(50, 100)).toBeCloseTo(-0.6166372430474798, 5);
            expect(pixel(100, 150)).toBeCloseTo(-0.17408536054883172, 5);
            expect(pixel(150, 200)).toBeCloseTo(-0.8765561076918952, 5);
            expect(pixel(200, 250)).toBeCloseTo(-0.11818976343277121, 5);
            expect(pixel(250, 250)).toBeCloseTo(0.7991360259332725, 5);
        });

    });
}

function testWarping() {
    describe('Fractal Domain Warping test suite', () => {

        test('Test with turbulence RGBA', () => {
            const pixel = generators.noiseGenerator({
                    noise: generators.noise.noiseFractals.warp,
                    noiseOptions: {
                        width: 250,
                        height: 250,
                        fractalGen: {
                            fractal: 'turbulence',
                            fractalOptions: {
                                noiseGen: "perlin",
                                noiseSeed: 44
                            }
                        },
                        qMultiplier: 10,
                        rMultiplier: 10,
                        colored: true
                    }
                }
            );

            expect(pixel(0, 0)).toStrictEqual(colors.createColor(37, 80, 118, 255));
            expect(pixel(0, 50)).toStrictEqual(colors.createColor(21, 48, 74, 255));
            expect(pixel(50, 100)).toStrictEqual(colors.createColor(44, 94, 136, 255));
            expect(pixel(100, 150)).toStrictEqual(colors.createColor(35, 76, 111, 255));
            expect(pixel(150, 200)).toStrictEqual(colors.createColor(44, 95, 138, 255));
            expect(pixel(200, 250)).toStrictEqual(colors.createColor(33, 73, 108, 255));
            expect(pixel(250, 250)).toStrictEqual(colors.createColor(28, 61, 92, 255));
        });

        test('Test with FBM RGBA', () => {
            const pixel = generators.noiseGenerator(
                {
                    noise: generators.noise.noiseFractals.warp,
                    noiseOptions: {
                        width: 250,
                        height: 250,
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
                        colored: false
                    }
                }
            );

            expect(pixel(0, 0)).toStrictEqual(colors.createColor(149, 149, 149, 255));
            expect(pixel(0, 50)).toStrictEqual(colors.createColor(115, 115, 115, 255));
            expect(pixel(50, 100)).toStrictEqual(colors.createColor(110, 110, 110, 255));
            expect(pixel(100, 150)).toStrictEqual(colors.createColor(76, 76, 76, 255));
            expect(pixel(150, 200)).toStrictEqual(colors.createColor(143, 143, 143, 255));
            expect(pixel(200, 250)).toStrictEqual(colors.createColor(104, 104, 104, 255));
            expect(pixel(250, 250)).toStrictEqual(colors.createColor(84, 84, 84, 255));
        });

        test('Test with Ridged Noise', () => {
        const pixel = generators.noiseGenerator(
            {
                noise: generators.noise.noiseFractals.warp,
                noiseOptions: {
                    width: 250,
                    height: 250,
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
                    colored: false,
                    get_noise: true
                }
            }
        );

        expect(pixel(0, 0)).toBeCloseTo(0.17603096787500627, 5);
        expect(pixel(0, 50)).toBeCloseTo(-0.0979108862368786, 5);
        expect(pixel(50, 100)).toBeCloseTo(-0.1349315654896065, 5);
        expect(pixel(100, 150)).toBeCloseTo(-0.399575353727722, 5);
        expect(pixel(150, 200)).toBeCloseTo(0.12860428567776205, 5);
        expect(pixel(200, 250)).toBeCloseTo(-0.18383164850042522, 5);
        expect(pixel(250, 250)).toBeCloseTo(-0.33499878263902927, 5);
    });

        test('Test with undefined fractalGen', () => {
        const pixel = generators.noiseGenerator(
            {
                noise: generators.noise.noiseFractals.warp,
                noiseOptions: {
                    width: 250,
                    height: 250,
                    qMultiplier: 40,
                    rMultiplier: 20,
                    colored: false,
                    get_noise: true
                }
            }
        );

        expect(pixel(0, 0)).toBeCloseTo(0.4930100065586931, 5);
        expect(pixel(0, 50)).toBeCloseTo(0.2752129257376601, 5);
        expect(pixel(50, 100)).toBeCloseTo(-0.17137430263865838, 5);
        expect(pixel(100, 150)).toBeCloseTo(0.04886057828493007, 5);
        expect(pixel(150, 200)).toBeCloseTo(0.15641398928841266, 5);
        expect(pixel(200, 250)).toBeCloseTo(-0.03519979894665326, 5);
        expect(pixel(250, 250)).toBeCloseTo(-0.0605074223292269, 5);
    });
    });
}

function testCheckerboard() {
    describe('Checkerboard test', () => {
        const pixel = generators.tilings.checkerboard(
            {
                pixelPerCase: 50,
                color1: colors.createColor(150, 70, 35, 255),
                color2: colors.createColor(100, 255, 180, 255),
            }
        );

        test('Test of pixel number per case', () => {
            expect(pixel(0, 0)).toEqual(pixel(0, 49));
            expect(pixel(0, 49)).not.toEqual(pixel(0, 50));
            expect(pixel(0, 50)).toEqual(pixel(0, 51));
        });

        test('Test of square color uniqueness', () => {
            for (let x = 0; x < 50; x++) {
                for (let y = 0; y < 50; y++) {
                    expect(pixel(x, y)).toEqual(colors.createColor(150, 70, 35, 255));
                }
            }
        });
    });
}

testWhite();
testPerlin();
testWorley();
testFractal();
testWarping();
testCheckerboard();
