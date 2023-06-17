let t, e = ['Solid', 'Linear Gradient'], o = ['Gray', 'Black', 'White'];
figma.parameters.on('input', ({ key: t, query: r, result: n }) => {
    switch (t) {
        case 'color':
            n.setSuggestions(o.filter(t => t.includes(r)));
            break;
        case 'type':
            n.setSuggestions(e.filter(t => t.includes(r)));
            break;
        default:
            return;
    }
}),
    figma.on('run', ({ parameters: e }) => {
        0 === figma.currentPage.selection.length && (figma.notify('Select at least one item.'), figma.closePlugin()),
            e && 'Gray' === e.color && 'Solid' === e.type && (t = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }]),
            'Gray' === e.color &&
                'Linear Gradient' === e.type &&
                (t = [
                    {
                        type: 'GRADIENT_LINEAR',
                        gradientTransform: [
                            [-1, 1.516437286852579e-8, 1],
                            [-1.7966517162903983e-8, -0.0659240335226059, 0.5335403084754944],
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
            'Black' === e.color && 'Solid' === e.type && (t = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]),
            'Black' === e.color &&
                'Linear Gradient' === e.type &&
                (t = [
                    {
                        type: 'GRADIENT_LINEAR',
                        gradientTransform: [
                            [-1, 1.516437286852579e-8, 1],
                            [-1.7966517162903983e-8, -0.0659240335226059, 0.5335403084754944],
                        ],
                        gradientStops: [
                            { color: { r: 0, g: 0, b: 0, a: 1 }, position: 0 },
                            { color: { r: 0, g: 0, b: 0, a: 0.05 }, position: 0.5 },
                        ],
                    },
                ]),
            'White' === e.color && 'Solid' === e.type && (t = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]),
            'White' === e.color &&
                'Linear Gradient' === e.type &&
                (t = [
                    {
                        type: 'GRADIENT_LINEAR',
                        gradientTransform: [
                            [-1, 1.516437286852579e-8, 1],
                            [-1.7966517162903983e-8, -0.0659240335226059, 0.5335403084754944],
                        ],
                        gradientStops: [
                            { color: { r: 1, g: 1, b: 1, a: 1 }, position: 0 },
                            { color: { r: 1, g: 1, b: 1, a: 0.05 }, position: 0.5 },
                        ],
                    },
                ]);
        let o = [], r = [], n = [], i = [], a = [];
        const s = (t, e) => {
            const o = (function* t(e) {
                for (const o of e)
                    yield o, o.children && (yield* t(o.children));
            })(t);
            for (let t = o.next(); !t.done; t = o.next())
                e.push(t.value);
        }, l = (t) => {
            const e = [], r = t.filter((t) => 'INSTANCE' === t.type && 'I' !== t.id.substr(0, 1));
            if (0 === r.length)
                return o.flat();
            const n = r.map((t) => t.detachInstance());
            s(n, e), o.push(...e.flat().filter(t => 'INSTANCE' !== t.type && 'I' !== t.id.substr(0, 1)));
            const i = e.flat().filter(t => 'INSTANCE' === t.type && 'I' !== t.id.substr(0, 1));
            return l(i);
        }, c = async (e) => {
            for (const o of e) {
                const e = figma.createRectangle();
                o.height <= 0.01 ? e.resizeWithoutConstraints(o.width, 0.01) : e.resizeWithoutConstraints(o.width, o.height),
                    (e.cornerRadius = o.height),
                    (e.x = o.relativeTransform[0][2]),
                    (e.y = o.relativeTransform[1][2]),
                    (e.fills = t),
                    o.parent.insertChild(o.parent.children.length, e),
                    o.remove();
            }
        }, f = async (e) => {
            for (const o of e)
                'BOOLEAN_OPERATION' === o.type && o.outlineStroke(), (o.effects = []), 'IMAGE' === o.fills.type ? ((o.fills = []), (o.strokes = [])) : ((o.fills = t), (o.strokes = t));
        }, g = async (e) => {
            const o = e.map(t => {
                const e = t.getRangeFontName(0, 1);
                return figma.loadFontAsync({ family: e.family, style: e.style });
            });
            await Promise.all(o);
            const r = [], n = [];
            for (const t of e) {
                const e = t.characters, o = t.parent, n = t.getRangeTextStyleId(0, 1), i = t.getRangeFontName(0, 1);
                n ? (t.textStyleId = n) : (t.fontName = i);
                const a = e
                    .split(/\r?\n/)
                    .filter(Boolean)
                    .map(t => t.trim());
                let s = 0;
                for (const e of a) {
                    const n = t.clone();
                    'TOP' !== n.textAlignVertical && (n.textAlignVertical = 'TOP'), (n.characters = e), (n.y += s), (n.textAutoResize = 'HEIGHT'), (s += n.height), o.appendChild(n), r.push(n);
                }
                t.remove();
            }
            for (const e of r) {
                const o = e.getRangeFontName(0, 1);
                'Symbol(figma.mixed)' === e.fontName.toString() && e.setRangeFontName(0, e.characters.length, o);
                const r = (t, e) => Math.floor(Math.random() * (e - t) + t);
                (e.textAutoResize = 'NONE'), !0 === e.hasMissingFont && figma.closePlugin("You can't convert text until loading its source font.");
                let i = Number(e.fontSize), a = e.height, s = e.lineHeight;
                isNaN(s) && (s = 1.25 * i), (e.textAutoResize = a > s ? 'NONE' : 'WIDTH_AND_HEIGHT');
                const l = Math.round(a / s);
                for (let o = 0; o < l; o++) {
                    const i = figma.createRectangle();
                    e.height > s ? i.resizeWithoutConstraints(r(e.width / 2, e.width), 0.7 * s) : i.resizeWithoutConstraints(e.width, 0.7 * s),
                        (i.cornerRadius = s),
                        (i.x = e.relativeTransform[0][2]),
                        (i.y = e.relativeTransform[1][2] + s * o),
                        (i.fills = t),
                        e.parent.insertChild(e.parent.children.length, i),
                        n.push(i);
                }
                e.remove();
            }
        };
        (async () => {
            try {
                const t = Date.now();
                await (async (t) => {
                    s(t, o),
                        (o = o.flat()),
                        l(o),
                        (o = o.flat().filter(t => 'INSTANCE' !== t.type && 'I' !== t.id.substr(0, 1))),
                        ((t) => {
                            for (const e of t)
                                e.removed || e.visible || e.remove();
                        })(o);
                    const q = ['BOOLEAN_OPERATION', 'ELLIPSE', 'LINE', 'POLYGON', 'RECTANGLE', 'STAR'], u = ['VECTOR'], m = ['TEXT'];
                    for (const e of o)
                        e.removed || ('FRAME' === e.type ? r.push(e) : q.includes(e.type) ? n.push(e) : u.includes(e.type) ? i.push(e) : m.includes(e.type) && a.push(e));
                })(figma.currentPage.selection),
                    await (async (t) => {
                        for (const e of t)
                            (e.layoutMode = 'NONE'), (e.strokes = []), 0 === e.children.length && e.remove();
                    })(r),
                    await f(n),
                    await c(i),
                    await g(a);
                const e = (Date.now() - t) / 1e3;
                console.clear();
                figma.closePlugin(`Selection ghostified 👻 in ${e} seconds.`);
            }
            catch (t) {
                console.error(t), figma.closePlugin('Error occurred');
            }
        })();
    });
