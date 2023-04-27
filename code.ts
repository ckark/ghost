let e,
	t = ['Solid', 'Linear Gradient'],
	o = ['Gray', 'Black', 'White'];
figma.parameters.on('input', ({ key: e, query: r, result: n }) => {
	switch (e) {
		case 'type':
			n.setSuggestions(t.filter(e => e.includes(r)));
			break;
		case 'color':
			n.setSuggestions(o.filter(e => e.includes(r)));
			break;
		default:
			return;
	}
}),
	figma.on('run', ({ parameters: t }) => {
		0 === figma.currentPage.selection.length && (figma.notify('Select at least one item.'), figma.closePlugin()),
			t &&
				'Gray' === t.color &&
				'Solid' === t.type &&
				(e = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }]),
			'Gray' === t.color &&
				'Linear Gradient' === t.type &&
				(e = [
					{
						type: 'GRADIENT_LINEAR',
						gradientTransform: [
							[-1, 1.516437286852579e-8, 1],
							[-1.7966517162903983e-8, -0.0659240335226059, 0.5335403084754944],
						],
						gradientStops: [
							{
								color: { r: 0.8588235378265381, g: 0.8588235378265381, b: 0.8588235378265381, a: 0.05 },
								position: 0,
							},
							{
								color: { r: 0.8588235378265381, g: 0.8588235378265381, b: 0.8588235378265381, a: 1 },
								position: 0.5,
							},
						],
					},
				]),
			'Black' === t.color && 'Solid' === t.type && (e = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]),
			'Black' === t.color &&
				'Linear Gradient' === t.type &&
				(e = [
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
			'White' === t.color && 'Solid' === t.type && (e = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]),
			'White' === t.color &&
				'Linear Gradient' === t.type &&
				(e = [
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
		let o = [],
			i = [],
			s = [],
			a = [],
			l = [];
		const z = async (e: any) => {
			const r = (e: any, t: any) => {
				const o = (function* e(t) {
					for (const o of t) yield o, o.children && (yield* e(o.children));
				})(e);
				for (let e = o.next(); !e.done; e = o.next()) t.push(e.value);
			};
			r(e, o), (o = o.flat());
			const n = (e: any) => {
				let t = [];
				const i = e.filter((e: any) => 'INSTANCE' === e.type && 'I' !== e.id.substr(0, 1));
				if (0 === i.length) return o.flat();
				const s = i.map(e => e.detachInstance());
				r(s, t), o.push(...t.flat().filter((e: any) => 'INSTANCE' !== e.type && 'I' !== e.id.substr(0, 1)));
				const a = t.flat().filter((e: any) => 'INSTANCE' === e.type && 'I' !== e.id.substr(0, 1));
				return n(a);
			};
			n(o), (o = o.flat().filter(e => 'INSTANCE' !== e.type && 'I' !== e.id.substr(0, 1)));
			for (const e of o)
				'FRAME' === e.type && 'PAGE' !== e.parent.type
					? i.push(e)
					: 'BOOLEAN_OPERATION' === e.type ||
					  'ELLIPSE' === e.type ||
					  'LINE' === e.type ||
					  'POLYGON' === e.type ||
					  'RECTANGLE' === e.type ||
					  'STAR' === e.type
					? s.push(e)
					: 'VECTOR' === e.type
					? a.push(e)
					: 'TEXT' === e.type && l.push(e);
		};
		const c = (e: any) => {
				!1 === e.visible && e.remove();
			},
			f = (e: any) => {
				for (const t of e) (t.layoutMode = 'NONE'), 0 === t.children.length && t.remove();
				c(e);
			},
			g = (t: any) => {
				for (const o of t) {
					const t = figma.createRectangle();
					o.height <= 0.01
						? t.resizeWithoutConstraints(o.width, 0.01)
						: t.resizeWithoutConstraints(o.width, o.height),
						(t.cornerRadius = o.height),
						(t.x = o.relativeTransform[0][2]),
						(t.y = o.relativeTransform[1][2]),
						(t.fills = e),
						o.parent.insertChild(o.parent.children.length, t),
						o.remove();
				}
				c(t);
			},
			p = (t: any) => {
				for (const o of t)
					'BOOLEAN_OPERATION' === o.type && o.outlineStroke(),
						(o.effects = []),
						'IMAGE' === o.fills.type
							? ((o.fills = []), (o.strokes = []))
							: ((o.fills = e), (o.strokes = e));
				c(t);
			},
			h = async (t: any) => {
				const o = t.map(e => {
					const t = e.getRangeFontName(0, 1);
					return figma.loadFontAsync({ family: t.family, style: t.style });
				});
				await Promise.all(o);
				const r = [],
					n = [];
				for (const e of t) {
					const t = e.characters,
						o = e.parent,
						n = e.getRangeTextStyleId(0, 1),
						i = e.getRangeFontName(0, 1);
					n ? (e.textStyleId = n) : (e.fontName = i);
					const s = t
						.split(/\r?\n/)
						.filter(Boolean)
						.map(e => e.trim());
					let a = 0;
					for (const t of s) {
						const n = e.clone();
						(n.characters = t),
							(n.y += a),
							(n.textAutoResize = 'HEIGHT'),
							(a += n.height),
							o.appendChild(n),
							r.push(n);
					}
					e.remove();
				}
				for (const t of r) {
					const o = t.getRangeFontName(0, 1);
					'Symbol(figma.mixed)' === t.fontName.toString() && t.setRangeFontName(0, t.characters.length, o);
					const r = (e, t) => Math.floor(Math.random() * (t - e) + e);
					(t.textAutoResize = 'NONE'),
						!0 === t.hasMissingFont &&
							figma.closePlugin("You can't convert text until loading its source font.");
					let i = Number(t.fontSize),
						s = t.height,
						a = t.lineHeight;
					isNaN(a) && (a = 1.25 * i), (t.textAutoResize = s > a ? 'NONE' : 'WIDTH_AND_HEIGHT');
					const l = Math.round(s / a);
					for (let o = 0; o < l; o++) {
						const i = figma.createRectangle();
						t.height > a
							? i.resizeWithoutConstraints(r(t.width / 2, t.width), 0.7 * a)
							: i.resizeWithoutConstraints(t.width, 0.7 * a),
							(i.cornerRadius = a),
							(i.x = t.relativeTransform[0][2]),
							(i.y = t.relativeTransform[1][2] + a * o),
							(i.fills = e),
							t.parent.insertChild(t.parent.children.length, i),
							n.push(i);
					}
					t.remove();
				}
				c(t);
			};
		(async () => {
			try {
				const e = Date.now();
				await Promise.all([z(figma.currentPage.selection)]);
				await Promise.all([h(l), f(i), g(a), p(s)]);
				const t = (Date.now() - e) / 1e3;
				console.clear(), figma.closePlugin(`Selection ghostified 👻 in ${t} seconds.`);
			} catch (e) {
				console.error(e), figma.closePlugin('Error occurred');
			}
		})();
	});
