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
	const e = (t: any, e: any) => {
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
	const n = (o: any) => {
		let s = [];
		const r = o.filter((t: any) => 'INSTANCE' === t.type && 'I' !== t.id.substr(0, 1));
		if (0 === r.length) return t.flat();
		const i = r.map((t: any) => t.detachInstance());
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
	const l = (t: any) => {
			!1 === t.visible && t.remove();
		},
		a = (t: any) => {
			for (const e of t)
				(e.layoutMode = 'NONE'),
					(e.effects = []),
					(e.fills = []),
					(e.strokes = []),
					0 === e.children.length && e.remove();
			l(t);
		},
		c = (t: any) => {
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
		f = (t: any) => {
			for (const e of t)
				'BOOLEAN_OPERATION' === e.type && e.outlineStroke(),
					(e.effects = []),
					'IMAGE' === e.fills.type
						? ((e.fills = []), (e.strokes = []))
						: ((e.fills = fills), (e.strokes = fills));
			l(t);
		},
		h = async (t: any) => {
			const u = new Set(t.map((t: any) => t.getRangeFontName(0, 1)));
			const f = Array.from(u).map((e: any) => figma.loadFontAsync({ family: e.family, style: e.style }));
			await Promise.all(f);
			const n = [],
				o = [];
			for (const e of t) {
				const t = e.characters,
					o = e.parent,
					s = e.getRangeTextStyleId(0, 1),
					r = e.getRangeFontName(0, 1),
					i = t
						.split(/\r?\n/)
						.filter(Boolean)
						.map((t: any) => t.trim());
				s ? (e.textStyleId = s) : (e.fontName = r);
				let l = 0;
				const y = e.y;
				const x = 'HEIGHT';
				for (const character of i) {
					const s = e.clone();
					s.characters = character;
					s.y = y + l;
					s.textAutoResize = x;
					l += s.height;
					o.appendChild(s);
					n.push(s);
				}
				e.remove();
			}

			for (const t of n) {
				const e = t.getRangeFontName(0, 1);

				if ('Symbol(figma.mixed)' === t.fontName.toString()) {
					t.setRangeFontName(0, t.characters.length, e);
				}

				t.textAutoResize = 'NONE';

				if (t.hasMissingFont) {
					figma.closePlugin('You can’t convert text until loading its source font.');
				}

				let n = Number(t.fontSize),
					i = t.height,
					a = t.lineHeight;

				if (isNaN(a)) {
					a = 1.2 * n;
				}

				t.textAutoResize = i > a ? 'NONE' : 'WIDTH_AND_HEIGHT';
				const r = Math.round(i / a),
					s = t.parent.children.length;

				for (let e = 0; e < r; e++) {
					const n = figma.createRectangle();
					n.resizeWithoutConstraints(t.width, 0.7 * a);
					n.cornerRadius = a;
					n.x = t.relativeTransform[0][2];
					n.y = t.relativeTransform[1][2];
					n.y += a * e;
					n.fills = fills;
					t.parent.insertChild(s, n);
					o.push(n);
				}
				t.remove();
			}
			l(t);
		};
	(async () => {
		try {
			const e = (await Promise.allSettled([h(i), a(o), c(r), f(s)])).filter((r) => 'rejected' === r.status);
			e.length
				? (console.error(e), figma.closePlugin('Error occurred'))
				: figma.closePlugin('Selection ghostified 👻.');
		} catch (r) {
			console.error(r), figma.closePlugin('Error occurred');
		}
	})();
});
