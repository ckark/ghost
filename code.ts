let type = ['Solid', 'Linear Gradient'],
	colors = ['Gray', 'Black', 'White'],
	fills;
figma.parameters.on('input', ({ key, query, result }: ParameterInputEvent) => {
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
figma.on('run', ({ parameters }: RunEvent) => {
	0 === figma.currentPage.selection.length && (figma.notify('Select at least one item.'), figma.closePlugin());
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
						[-1.7966517162903983e-8, -0.0659240335226059, 0.5335403084754944],
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
						[-1.7966517162903983e-8, -0.0659240335226059, 0.5335403084754944],
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
	const traversal = (e, l) => {
		const t = (function* e(t) {
			const a = t.length;
			if (0 !== a) {
				for (let l = 0; l < a; l++) {
					const a = t[l];
					yield a;
					let o = a.children;
					o && (yield* e(o));
				}
				l.push(t);
			}
		})(e);
		let a = t.next();
		for (; !a.done; ) a = t.next();
	};
	traversal(figma.currentPage.selection, all), (all = all.flat());
	const detach = (e) => {
		let t = new Array();
		if ((e = e.filter((e) => 'INSTANCE' === e.type).filter((e) => 'I' !== e.id.substr(0, 1))).length > 0)
			return (
				traversal(
					e.map((e) => e.detachInstance()),
					t,
				),
				all.push(
					t
						.flat()
						.filter((e) => 'INSTANCE' !== e.type)
						.filter((e) => 'I' !== e.id.substr(0, 1)),
				),
				(t = t
					.flat()
					.filter((e) => 'INSTANCE' === e.type)
					.filter((e) => 'I' !== e.id.substr(0, 1))),
				detach(t),
				all.flat()
			);
	};
	detach(all),
		(all = all
			.flat()
			.filter((e) => 'INSTANCE' !== e.type)
			.filter((e) => 'I' !== e.id.substr(0, 1)));
	let frames = all.filter((e) => 'FRAME' === e.type && 'PAGE' !== e.parent.type) as FrameNode[],
		shapes = all.filter((n) => 'BOOLEAN_OPERATION' === n.type || n.type === 'ELLIPSE' || n.type === 'LINE' || n.type === 'POLYGON' || n.type === 'RECTANGLE' || n.type === 'STAR'),
		vectors = all.filter((n) => n.type === 'VECTOR') as VectorNode[],
		text = all.filter((n) => n.type === 'TEXT') as TextNode[];
	const ghostifyFrames = (e) => {
			e.map((e) => {
				(e.layoutMode = 'NONE'), (e.effects = []), (e.fills = []), (e.strokes = []);
			});
		},
		ghostifyVector = (e) => {
			e.map((s) => {
				(s.fills = fills), s.strokeWeight > 0 && (s.strokes = fills), 0 === s.strokeWeight && (s.strokes = []);
			});
		},
		ghostifyShapes = (e) => {
			'BOOLEAN_OPERATION' === e.type && e.outlineStroke(),
				e.map((e) => {
					(e.effects = []), 'IMAGE' === e.fills.type ? ((e.fills = []), (e.strokes = [])) : ((e.fills = fills), (e.strokes = fills));
				});
		},
		ghostifyText = (e) =>
			new Promise((t) => {
				e.map(async (e) => {
					if (e.fontName === figma.mixed) {
						const t = figma.createRectangle();
						let i = e.height;
						t.resizeWithoutConstraints(e.width, 0.7 * e.height),
							(t.cornerRadius = i),
							(t.x = e.relativeTransform[0][2]),
							(t.y = e.relativeTransform[1][2]),
							(t.fills = fills),
							e.parent.insertChild(e.parent.children.length, t),
							e.remove();
					} else {
						await figma.loadFontAsync(e.fontName as FontName);
						(e.textAutoResize = 'NONE'), !0 === e.hasMissingFont && figma.closePlugin("You can't convert text until loading its source font.");
						let t = Number(e.fontSize),
							i = e.height,
							n = e.lineHeight;
						isNaN(n) && (n = 1.25 * t), (e.textAutoResize = i > n ? 'NONE' : 'WIDTH_AND_HEIGHT');
						let r = Math.round(i / n);
						for (let t = 0; t < r; t++) {
							const i = figma.createRectangle();
							i.resizeWithoutConstraints(e.width, (e.height, 0.7 * n)),
								(i.cornerRadius = n),
								(i.x = e.relativeTransform[0][2]),
								(i.y = e.relativeTransform[1][2] + n * t),
								(i.fills = fills),
								e.parent.insertChild(e.parent.children.length, i);
						}
						e.remove();
					}
				}),
					setTimeout(() => t('done'), 0);
			});
	const ghostify = async () => {
		await ghostifyText(text), ghostifyFrames(frames), ghostifyVector(vectors), ghostifyShapes(shapes), console.clear(), figma.closePlugin('Selection ghostified 👻.');
	};
	ghostify();
});
