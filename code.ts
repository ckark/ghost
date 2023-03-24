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
	const traversal = (t: any, e: any) => {
		const l = (function* t(l) {
			for (let i = 0; i < l.length; i++) {
				const n = l[i];
				yield n;
				if (n.children) {
					yield* t(n.children);
				}
			}
			e.push(l);
		})(t);
		for (let i = l.next(); !i.done; i = l.next());
	};
	traversal(figma.currentPage.selection, all), (all = all.flat());
	const detach = (e: any) => {
		let t = new Array();
		if ((e = e.filter((e: any) => 'INSTANCE' === e.type).filter((e: any) => 'I' !== e.id.substr(0, 1))).length > 0)
			return (
				traversal(
					e.map((e: any) => e.detachInstance()),
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
		shapes = all.filter(
			(n) =>
				'BOOLEAN_OPERATION' === n.type ||
				n.type === 'ELLIPSE' ||
				n.type === 'LINE' ||
				n.type === 'POLYGON' ||
				n.type === 'RECTANGLE' ||
				n.type === 'STAR',
		),
		vectors = all.filter((n) => n.type === 'VECTOR') as VectorNode[],
		text = all.filter((n) => n.type === 'TEXT') as TextNode[];
	const ghostifyFrames = (e: any) => {
			e.map((e: any) => {
				(e.layoutMode = 'NONE'), (e.effects = []), (e.fills = []), (e.strokes = []);
			});
		},
		ghostifyVector = (e: any) => {
			e.map((s: any) => {
				const t = figma.createRectangle();
				t.resizeWithoutConstraints(s.width, s.height),
					(t.cornerRadius = s.height),
					(t.x = s.relativeTransform[0][2]),
					(t.y = s.relativeTransform[1][2]),
					(t.fills = fills),
					s.parent.insertChild(s.parent.children.length, t),
					s.remove();
			});
		},
		ghostifyShapes = (e: any) => {
			'BOOLEAN_OPERATION' === e.type && e.outlineStroke(),
				e.map((e: any) => {
					(e.effects = []),
						'IMAGE' === e.fills.type
							? ((e.fills = []), (e.strokes = []))
							: ((e.fills = fills), (e.strokes = fills));
				});
		},
		ghostifyText = async (f) => {
			const fontLoadingPromises = f.map((t) => {
				const a = t.getRangeFontName(0, 1);
				return figma.loadFontAsync({
					family: a.family,
					style: a.style,
				});
			});
			await Promise.all(fontLoadingPromises);
			f.forEach((e: any) => {
				const w = e.getRangeFontName(0, 1);
				'Symbol(figma.mixed)' === e.fontName.toString() && e.setRangeFontName(0, e.characters.length, w);
				const getRandomArbitrary = (e, t) => Math.floor(Math.random() * (t - e) + e);
				(e.textAutoResize = 'NONE'),
					!0 === e.hasMissingFont &&
						figma.closePlugin("You can't convert text until loading its source font.");
				let t = Number(e.fontSize),
					i = e.height,
					r = e.lineHeight;
				isNaN(r) && (r = 1.25 * t), (e.textAutoResize = i > r ? 'NONE' : 'WIDTH_AND_HEIGHT');
				const n = Math.round(i / r);
				for (let t = 0; t < n; t++) {
					const i = figma.createRectangle();
					e.height > r
						? i.resizeWithoutConstraints(getRandomArbitrary(e.width / 2, e.width), (e.height, 0.7 * r))
						: i.resizeWithoutConstraints(e.width, (e.height, 0.7 * r)),
						(i.cornerRadius = r),
						(i.x = e.relativeTransform[0][2]),
						(i.y = e.relativeTransform[1][2] + r * t),
						(i.fills = fills),
						e.parent.insertChild(e.parent.children.length, i);
				}
				e.remove();
			});
		};

	(async () => {
		try {
			await Promise.all([
				ghostifyText(text),
				ghostifyFrames(frames),
				ghostifyVector(vectors),
				ghostifyShapes(shapes),
			]),
				console.clear(),
				figma.closePlugin('Selection ghostified 👻.');
		} catch (e) {
			console.error(e), figma.closePlugin(`Error occurred: ${e.message}`);
		}
	})();
});
