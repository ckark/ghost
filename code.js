let t, e = ['Solid', 'Linear Gradient'], o = ['Gray', 'Black', 'White'];
const gradientTransform = [
    [-1, 1.516437286852579e-8, 1],
    [-1.7966517162903983e-8, -0.0659240335226059, 0.5335403084754944],
];
const colorConfig = {
    Gray: {
        Solid: [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }],
        'Linear Gradient': [
            {
                type: 'GRADIENT_LINEAR',
                gradientTransform,
                gradientStops: [
                    { color: { r: 0.8588235378265381, g: 0.8588235378265381, b: 0.8588235378265381, a: 0.05 }, position: 0 },
                    { color: { r: 0.8588235378265381, g: 0.8588235378265381, b: 0.8588235378265381, a: 1 }, position: 0.5 },
                ],
            },
        ],
    },
    Black: {
        Solid: [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }],
        'Linear Gradient': [
            {
                type: 'GRADIENT_LINEAR',
                gradientTransform,
                gradientStops: [
                    { color: { r: 0, g: 0, b: 0, a: 1 }, position: 0 },
                    { color: { r: 0, g: 0, b: 0, a: 0.05 }, position: 0.5 },
                ],
            },
        ],
    },
    White: {
        Solid: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }],
        'Linear Gradient': [
            {
                type: 'GRADIENT_LINEAR',
                gradientTransform,
                gradientStops: [
                    { color: { r: 1, g: 1, b: 1, a: 1 }, position: 0 },
                    { color: { r: 1, g: 1, b: 1, a: 0.05 }, position: 0.5 },
                ],
            },
        ],
    },
};
const safeRemove = (node) => {
    try {
        if (!node.removed)
            node.remove();
    }
    catch (_a) { }
};
figma.parameters.on('input', ({ key: t, query: r, result: n }) => {
    switch (t) {
        case 'color':
            n.setSuggestions(o.filter((t) => t.includes(r)));
            break;
        case 'type':
            n.setSuggestions(e.filter((t) => t.includes(r)));
            break;
        default:
            return;
    }
}),
    figma.on('run', async ({ parameters: e }) => {
        var _a;
        await figma.loadAllPagesAsync();
        const selections = figma.currentPage.selection;
        if (selections.length === 0) {
            figma.notify('Select at least one item.');
            figma.closePlugin();
            return;
        }
        try {
            if ((e === null || e === void 0 ? void 0 : e.color) && (e === null || e === void 0 ? void 0 : e.type)) {
                t = (_a = colorConfig[e.color]) === null || _a === void 0 ? void 0 : _a[e.type];
            }
            let o = [], r = [], n = [], i = [], a = [];
            const s = (nodes, result) => {
                var _a;
                for (const node of nodes) {
                    if (node.removed)
                        continue;
                    result.push(node);
                    if ((_a = node.children) === null || _a === void 0 ? void 0 : _a.length) {
                        s(node.children, result);
                    }
                }
            }, l = (instances) => {
                if (instances.length === 0)
                    return;
                const detached = [];
                for (const inst of instances) {
                    if (inst.type === 'INSTANCE' && inst.id[0] !== 'I') {
                        detached.push(inst.detachInstance());
                    }
                }
                if (detached.length === 0)
                    return;
                const newNodes = [];
                s(detached, newNodes);
                const validNodes = newNodes.filter((t) => t.type !== 'INSTANCE' && t.id[0] !== 'I');
                o.push(...validNodes);
                const remainingInstances = newNodes.filter((t) => t.type === 'INSTANCE' && t.id[0] !== 'I');
                if (remainingInstances.length > 0) {
                    l(remainingInstances);
                }
            }, c = async (vectors) => {
                if (vectors.length === 0)
                    return;
                for (const vec of vectors) {
                    if (vec.removed)
                        continue;
                    const transform = vec.relativeTransform;
                    const rect = figma.createRectangle();
                    const height = vec.height <= 0.01 ? 0.01 : vec.height;
                    rect.resizeWithoutConstraints(vec.width, height);
                    rect.cornerRadius = vec.height;
                    rect.x = transform[0][2];
                    rect.y = transform[1][2];
                    rect.fills = t;
                    vec.parent.appendChild(rect);
                    safeRemove(vec);
                }
            }, f = async (shapes) => {
                if (shapes.length === 0)
                    return;
                for (const shape of shapes) {
                    if (shape.removed)
                        continue;
                    if (shape.type === 'BOOLEAN_OPERATION') {
                        shape.outlineStroke();
                    }
                    shape.effects = [];
                    if (shape.fills && shape.fills.type === 'IMAGE') {
                        shape.fills = [];
                        shape.strokes = [];
                    }
                    else {
                        shape.fills = t;
                        shape.strokes = t;
                    }
                }
            }, g = async (textNodes) => {
                if (textNodes.length === 0)
                    return;
                const validTextNodes = textNodes.filter((node) => !node.removed);
                if (validTextNodes.length === 0)
                    return;
                const fontPromises = validTextNodes.map((node) => {
                    const fontName = node.getRangeFontName(0, 1);
                    return figma.loadFontAsync({ family: fontName.family, style: fontName.style });
                });
                await Promise.all(fontPromises);
                const splitTexts = [];
                const randomRange = (min, max) => Math.floor(Math.random() * (max - min) + min);
                for (const textNode of validTextNodes) {
                    const textStyleId = textNode.getRangeTextStyleId(0, 1);
                    const fontName = textNode.getRangeFontName(0, 1);
                    if (textStyleId) {
                        await textNode.setRangeTextStyleIdAsync(0, textNode.characters.length, textStyleId);
                    }
                    else {
                        textNode.fontName = fontName;
                    }
                    const lines = textNode.characters
                        .split(/\r?\n/)
                        .filter(Boolean)
                        .map((line) => line.trim());
                    if (lines.length === 0)
                        continue;
                    let yOffset = 0;
                    for (const line of lines) {
                        const cloned = textNode.clone();
                        if (cloned.textAlignVertical !== 'TOP')
                            cloned.textAlignVertical = 'TOP';
                        cloned.characters = line;
                        cloned.y += yOffset;
                        cloned.textAutoResize = 'HEIGHT';
                        yOffset += cloned.height;
                        textNode.parent.appendChild(cloned);
                        splitTexts.push(cloned);
                    }
                    safeRemove(textNode);
                }
                for (const textNode of splitTexts) {
                    if (textNode.hasMissingFont) {
                        figma.closePlugin("You can't convert text until loading its source font.");
                        return;
                    }
                    const fontName = textNode.getRangeFontName(0, 1);
                    if (textNode.fontName.toString() === 'Symbol(figma.mixed)') {
                        textNode.setRangeFontName(0, textNode.characters.length, fontName);
                    }
                    textNode.textAutoResize = 'NONE';
                    const fontSize = Number(textNode.fontSize);
                    const height = textNode.height;
                    let lineHeight = textNode.lineHeight;
                    if (isNaN(lineHeight))
                        lineHeight = 1.25 * fontSize;
                    textNode.textAutoResize = height > lineHeight ? 'NONE' : 'WIDTH_AND_HEIGHT';
                    const lineCount = Math.round(height / lineHeight);
                    const transform = textNode.relativeTransform;
                    const textWidth = textNode.width;
                    const useRandomWidth = height > lineHeight;
                    for (let i = 0; i < lineCount; i++) {
                        const rect = figma.createRectangle();
                        const width = useRandomWidth ? randomRange(textWidth / 2, textWidth) : textWidth;
                        rect.resizeWithoutConstraints(width, 0.7 * lineHeight);
                        rect.cornerRadius = lineHeight;
                        rect.x = transform[0][2];
                        rect.y = transform[1][2] + lineHeight * i;
                        rect.fills = t;
                        textNode.parent.appendChild(rect);
                    }
                    safeRemove(textNode);
                }
            };
            (async () => {
                try {
                    const startTime = Date.now();
                    const selection = figma.currentPage.selection;
                    s(selection, o);
                    const instances = [];
                    for (let idx = 0; idx < o.length; idx++) {
                        const node = o[idx];
                        if (node.removed || !node.visible)
                            continue;
                        if (node.type === 'INSTANCE' && node.id[0] !== 'I') {
                            instances.push(node);
                        }
                    }
                    if (instances.length > 0) {
                        l(instances);
                    }
                    o = o.filter((node) => node.type !== 'INSTANCE' && node.id[0] !== 'I' && !node.removed);
                    const nodeCount = o.length;
                    const shapeTypes = new Set(['BOOLEAN_OPERATION', 'ELLIPSE', 'LINE', 'POLYGON', 'RECTANGLE', 'STAR']);
                    for (const node of o) {
                        if (node.removed)
                            continue;
                        if (node.type === 'FRAME') {
                            r.push(node);
                        }
                        else if (shapeTypes.has(node.type)) {
                            n.push(node);
                        }
                        else if (node.type === 'VECTOR') {
                            i.push(node);
                        }
                        else if (node.type === 'TEXT') {
                            a.push(node);
                        }
                    }
                    for (const frame of r) {
                        if (frame.removed)
                            continue;
                        frame.layoutMode = 'NONE';
                        frame.strokes = [];
                        frame.effects = [];
                        if (frame.children.length === 0) {
                            safeRemove(frame);
                        }
                    }
                    await Promise.all([f(n), c(i), g(a)]);
                    const elapsed = (Date.now() - startTime) / 1000;
                    console.clear();
                    figma.closePlugin(`Ghostified 👻 ${nodeCount} nodes in ${elapsed} seconds.`);
                }
                catch (error) {
                    console.error(error);
                    figma.closePlugin('Error occurred');
                }
            })();
        }
        catch (error) {
            console.error(error);
            figma.closePlugin('An error occurred.');
        }
    });
