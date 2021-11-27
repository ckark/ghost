let type = ['Solid', 'Linear Gradient'], colors = ['Gray', 'Black', 'White'], fills;
figma.parameters.on('input', ({ key, query, result }) => {
    switch (key) {
        case 'type':
            result.setSuggestions(type.filter((s) => s.includes(query)));
            break;
        case 'color':
            result.setSuggestions(colors.filter((s) => s.includes(query)));
            break;
        default:
            return;
    }
});
figma.on('run', ({ parameters }) => {
    0 === figma.currentPage.selection.length &&
        (figma.notify('Select at least one item.'),
            figma.closePlugin());
    parameters &&
        'Gray' === parameters.color &&
        'Solid' === parameters.type &&
        (fills = [
            {
                type: 'SOLID',
                color: {
                    r: 0.9,
                    g: 0.9,
                    b: 0.9,
                },
            },
        ]),
        'Gray' === parameters.color &&
            'Linear Gradient' === parameters.type &&
            (fills = [
                {
                    type: 'GRADIENT_LINEAR',
                    gradientTransform: [
                        [-1, 1.516437286852579e-8, 1],
                        [
                            -1.7966517162903983e-8,
                            -0.0659240335226059,
                            0.5335403084754944,
                        ],
                    ],
                    gradientStops: [
                        {
                            color: {
                                r: 0.8588235378265381,
                                g: 0.8588235378265381,
                                b: 0.8588235378265381,
                                a: 0.05,
                            },
                            position: 0,
                        },
                        {
                            color: {
                                r: 0.8588235378265381,
                                g: 0.8588235378265381,
                                b: 0.8588235378265381,
                                a: 1,
                            },
                            position: 0.5,
                        },
                    ],
                },
            ]),
        'Black' === parameters.color &&
            'Solid' === parameters.type &&
            (fills = [
                {
                    type: 'SOLID',
                    color: {
                        r: 0,
                        g: 0,
                        b: 0,
                    },
                },
            ]),
        'Black' === parameters.color &&
            'Linear Gradient' === parameters.type &&
            (fills = [
                {
                    type: 'GRADIENT_LINEAR',
                    gradientTransform: [
                        [-1, 1.516437286852579e-8, 1],
                        [
                            -1.7966517162903983e-8,
                            -0.0659240335226059,
                            0.5335403084754944,
                        ],
                    ],
                    gradientStops: [
                        {
                            color: {
                                r: 0,
                                g: 0,
                                b: 0,
                                a: 1,
                            },
                            position: 0,
                        },
                        {
                            color: {
                                r: 0,
                                g: 0,
                                b: 0,
                                a: 0.05,
                            },
                            position: 0.5,
                        },
                    ],
                },
            ]),
        'White' === parameters.color &&
            'Solid' === parameters.type &&
            (fills = [
                {
                    type: 'SOLID',
                    color: {
                        r: 1,
                        g: 1,
                        b: 1,
                    },
                },
            ]),
        'White' === parameters.color &&
            'Linear Gradient' === parameters.type &&
            (fills = [
                {
                    type: 'GRADIENT_LINEAR',
                    gradientTransform: [
                        [-1, 1.516437286852579e-8, 1],
                        [
                            -1.7966517162903983e-8,
                            -0.0659240335226059,
                            0.5335403084754944,
                        ],
                    ],
                    gradientStops: [
                        {
                            color: {
                                r: 1,
                                g: 1,
                                b: 1,
                                a: 1,
                            },
                            position: 0,
                        },
                        {
                            color: {
                                r: 1,
                                g: 1,
                                b: 1,
                                a: 0.05,
                            },
                            position: 0.5,
                        },
                    ],
                },
            ]);
    let all = new Array();
    const traversal = (e, f) => {
        let count = 0;
        function* read(nodes) {
            const len = nodes.length;
            if (len === 0) {
                return;
            }
            for (let i = 0; i < len; i++) {
                const node = nodes[i];
                yield node;
                let children = node.children;
                if (children) {
                    yield* read(children);
                }
            }
            f.push(nodes);
        }
        const it = read(e);
        let res = it.next();
        while (!res.done) {
            count++;
            res = it.next();
        }
    };
    traversal(figma.currentPage.selection, all), (all = all.flat());
    const detach = (e) => {
        let t = new Array();
        if ((e = e
            .filter((e) => 'INSTANCE' === e.type)
            .filter((e) => 'I' !== e.id.substr(0, 1)))
            .length > 0)
            return (traversal(e.map((e) => e.detachInstance()), t),
                all.push(t
                    .flat()
                    .filter((e) => 'INSTANCE' !==
                    e.type)
                    .filter((e) => 'I' !==
                    e.id.substr(0, 1))),
                (t = t
                    .flat()
                    .filter((e) => 'INSTANCE' === e.type)
                    .filter((e) => 'I' !==
                    e.id.substr(0, 1))),
                detach(t),
                all.flat());
    };
    detach(all),
        (all = all
            .flat()
            .filter((e) => 'INSTANCE' !== e.type)
            .filter((e) => 'I' !== e.id.substr(0, 1)));
    let frames = all.filter((e) => 'FRAME' === e.type && 'PAGE' !== e.parent.type), images = new Array(), nonimages = new Array();
    frames.map((e) => {
        e.fills.map((t) => {
            t.type,
                'IMAGE' === t.type
                    ? images.push(e)
                    : nonimages.push(e);
        });
    }),
        frames.map((e) => (e.layoutMode = 'NONE'));
    let shapes = all.filter((n) => n.type === 'ELLIPSE' ||
        n.type === 'POLYGON' ||
        n.type === 'RECTANGLE' ||
        n.type === 'STAR'), vectors = all.filter((n) => n.type === 'VECTOR'), text = all.filter((n) => n.type === 'TEXT');
    const nodes = [], ghostifyNonImages = (e) => {
        e.map((e) => {
            (e.effects = [
                {
                    type: 'DROP_SHADOW',
                    color: {
                        r: 0,
                        g: 0,
                        b: 0,
                        a: 0,
                    },
                    offset: {
                        x: 0,
                        y: 0,
                    },
                    radius: 0,
                    spread: 0,
                    visible: !0,
                    blendMode: 'NORMAL',
                    showShadowBehindNode: !0,
                },
            ]),
                (e.fills = [
                    {
                        type: 'SOLID',
                        opacity: 0,
                        color: {
                            r: 0,
                            g: 0,
                            b: 0,
                        },
                    },
                ]),
                (e.strokeWeight = 0),
                (e.strokes = [
                    {
                        type: 'SOLID',
                        opacity: 0,
                        color: {
                            r: 0,
                            g: 0,
                            b: 0,
                        },
                    },
                ]);
        });
    }, ghostifyImages = (e) => {
        e.map((e) => {
            (e.effects = [
                {
                    type: 'DROP_SHADOW',
                    color: {
                        r: 0,
                        g: 0,
                        b: 0,
                        a: 0,
                    },
                    offset: {
                        x: 0,
                        y: 0,
                    },
                    radius: 0,
                    spread: 0,
                    visible: !0,
                    blendMode: 'NORMAL',
                    showShadowBehindNode: !0,
                },
            ]),
                (e.fills = fills),
                e.strokeWeight > 0 &&
                    (e.strokes = fills),
                0 === e.strokeWeight &&
                    (e.strokes = [
                        {
                            type: 'SOLID',
                            opacity: 0,
                            color: {
                                r: 0,
                                g: 0,
                                b: 0,
                            },
                        },
                    ]),
                nodes.push(e);
        });
    }, ghostifyVector = (e) => {
        e.map((e) => {
            (e.fills = fills),
                e.strokeWeight > 0 &&
                    (e.strokes = fills),
                0 === e.strokeWeight &&
                    (e.strokes = [
                        {
                            type: 'SOLID',
                            opacity: 0,
                            color: {
                                r: 0,
                                g: 0,
                                b: 0,
                            },
                        },
                    ]),
                nodes.push(e);
        });
    }, ghostifyShapes = (e) => {
        e.map((e) => {
            const s = figma.createRectangle();
            0 !== e.cornerRadius &&
                (s.cornerRadius = e.width),
                'ELLIPSE' === e.type &&
                    (s.cornerRadius = e.width),
                s.resizeWithoutConstraints(e.width, e.height),
                (s.x = e.relativeTransform[0][2]),
                (s.y = e.relativeTransform[1][2]),
                (s.fills = fills),
                e.strokeWeight > 0 &&
                    (s.strokes = fills),
                0 === e.strokeWeight &&
                    (s.strokes = [
                        {
                            type: 'SOLID',
                            opacity: 0,
                            color: {
                                r: 0,
                                g: 0,
                                b: 0,
                            },
                        },
                    ]),
                nodes.push(s),
                'COMPONENT_SET' !== e.parent.type &&
                    'PAGE' !== e.parent.type &&
                    (e.parent.insertChild(e.parent.children
                        .length, s),
                        e.remove());
        });
    }, ghostifyText = (e) => new Promise((t) => {
        e.map(async (e) => {
            await figma.loadFontAsync(e.fontName);
            (e.textAutoResize = 'WIDTH_AND_HEIGHT'),
                !0 === e.hasMissingFont &&
                    figma.closePlugin("You can't convert text until loading its source font.");
            let t = Number(e.fontSize), i = e.height, s = e.lineHeight;
            isNaN(s) && (s = 1.25 * t);
            const o = Math.round(i / s);
            for (let t = 0; t < o; t++) {
                const i = figma.createRectangle();
                i.resizeWithoutConstraints(e.width, (e.height, 0.7 * s)),
                    (i.cornerRadius = s),
                    (i.x =
                        e.relativeTransform[0][2]),
                    (i.y =
                        e
                            .relativeTransform[1][2] +
                            s * t),
                    (i.fills = fills),
                    nodes.push(i),
                    e.parent.insertChild(e.parent
                        .children
                        .length, i);
            }
            e.remove();
        }),
            setTimeout(() => t('done'), 0);
    }), ghostify = async () => {
        ghostifyNonImages(nonimages),
            ghostifyImages(images),
            ghostifyVector(vectors),
            ghostifyShapes(shapes),
            await ghostifyText(text),
            console.clear,
            figma.closePlugin('ghostified');
    };
    ghostify();
});
