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
	0 === figma.currentPage.selection.length && (figma.notify(`Select at least one item.`), figma.closePlugin());
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
	let t = [];
	const e = (t, e) => {
		const n = (function* t(n) {
			for (let e = 0; e < n.length; e++) {
				const o = n[e];
				yield o, o.children && (yield* t(o.children));
			}
			e.push(n);
		})(t);
		for (let t = n.next(); !t.done; t = n.next());
	};
	e(figma.currentPage.selection, t), (t = t.flat());
	const n = (o) => {
		let s = [];
		const r = o.filter((t) => 'INSTANCE' === t.type && 'I' !== t.id.substr(0, 1));
		if (0 === r.length) return t.flat();
		const i = r.map((t) => t.detachInstance());
		e(i, s), t.push(...s.flat().filter((t) => 'INSTANCE' !== t.type && 'I' !== t.id.substr(0, 1)));
		const l = s.flat().filter((t) => 'INSTANCE' === t.type && 'I' !== t.id.substr(0, 1));
		return n(l);
	};
	n(t), (t = t.flat().filter((t) => 'INSTANCE' !== t.type && 'I' !== t.id.substr(0, 1)));
	let o = [],
		s = [],
		r = [],
		i = [];
	for (const e of t)
		'FRAME' === e.type && 'PAGE' !== e.parent.type
			? o.push(e)
			: 'BOOLEAN_OPERATION' === e.type ||
			  'ELLIPSE' === e.type ||
			  'LINE' === e.type ||
			  'POLYGON' === e.type ||
			  'RECTANGLE' === e.type ||
			  'STAR' === e.type
			? s.push(e)
			: 'VECTOR' === e.type
			? r.push(e)
			: 'TEXT' === e.type && i.push(e);
	const l = (t) => {
			!1 === t.visible && t.remove();
		},
		a = (t) => {
			for (const e of t)
				(e.layoutMode = 'NONE'),
					(e.effects = []),
					(e.fills = []),
					(e.strokes = []),
					0 === e.children.length && e.remove();
			l(t);
		},
		c = (t) => {
			for (const e of t) {
				const t = figma.createRectangle();
				t.resizeWithoutConstraints(e.width, e.height),
					(t.cornerRadius = e.height),
					(t.x = e.relativeTransform[0][2]),
					(t.y = e.relativeTransform[1][2]),
					(t.fills = fills),
					e.parent.insertChild(e.parent.children.length, t),
					e.remove();
			}
			l(t);
		},
		f = (t) => {
			for (const e of t)
				'BOOLEAN_OPERATION' === e.type && e.outlineStroke(),
					(e.effects = []),
					'IMAGE' === e.fills.type
						? ((e.fills = []), (e.strokes = []))
						: ((e.fills = fills), (e.strokes = fills));
			l(t);
		},
		h = async (t) => {
			const e = t.map((t) => {
				const e = t.getRangeFontName(0, 1);
				return figma.loadFontAsync({ family: e.family, style: e.style });
			});
			await Promise.all(e);
			const n = [],
				o = [];
			for (const e of t) {
				const t = e.characters,
					o = e.parent,
					s = e.getRangeTextStyleId(0, 1),
					r = e.getRangeFontName(0, 1);
				s ? (e.textStyleId = s) : (e.fontName = r);
				const i = t
					.split(/\r?\n/)
					.filter(Boolean)
					.map((t) => t.trim());
				let l = 0;
				for (let t = 0; t < i.length; t++) {
					const s = e.clone();
					(s.characters = i[t]),
						(s.y = s.y + l),
						(s.textAutoResize = 'HEIGHT'),
						(l += s.height),
						o.appendChild(s),
						n.push(s);
				}
				e.remove();
			}
			for (const t of n) {
				const e = t.getRangeFontName(0, 1);
				'Symbol(figma.mixed)' === t.fontName.toString() && t.setRangeFontName(0, t.characters.length, e);
				const n = (t, e) => Math.floor(Math.random() * (e - t) + t);
				(t.textAutoResize = 'NONE'),
					!0 === t.hasMissingFont &&
						figma.closePlugin("You can't convert text until loading its source font.");
				let s = Number(t.fontSize),
					r = t.height,
					i = t.lineHeight;
				isNaN(i) && (i = 1.25 * s), (t.textAutoResize = r > i ? 'NONE' : 'WIDTH_AND_HEIGHT');
				const l = Math.round(r / i);
				for (let e = 0; e < l; e++) {
					const s = figma.createRectangle();
					t.height > i
						? s.resizeWithoutConstraints(n(t.width / 2, t.width), 0.7 * i)
						: s.resizeWithoutConstraints(t.width, 0.7 * i),
						(s.cornerRadius = i),
						(s.x = t.relativeTransform[0][2]),
						(s.y = t.relativeTransform[1][2] + i * e),
						(s.fills = fills),
						t.parent.insertChild(t.parent.children.length, s),
						o.push(s);
				}
				t.remove();
			}
			l(t);
		};
	(async () => {
		try {
			await Promise.all([h(i), a(o), c(r), f(s)]), figma.closePlugin('Selection ghostified 👻.');
		} catch (t) {
			console.error(t), figma.closePlugin('Error occurred');
		}
	})();
});
