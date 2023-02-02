let e,
	t = ['Solid', 'Linear Gradient'],
	r = ['Gray', 'Black', 'White'];
figma.parameters.on('input', ({ key: e, query: i, result: o }) => {
	switch (e) {
		case 'type':
			o.setSuggestions(t.filter((e) => e.includes(i)));
			break;
		case 'color':
			o.setSuggestions(r.filter((e) => e.includes(i)));
			break;
		default:
			return;
	}
}),
	figma.on('run', ({ parameters: t }) => {
		0 === figma.currentPage.selection.length && (figma.notify('Select at least one item.'), figma.closePlugin()),
			t && 'Gray' === t.color && 'Solid' === t.type && (e = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }]),
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
							{ color: { r: 0.8588235378265381, g: 0.8588235378265381, b: 0.8588235378265381, a: 0.05 }, position: 0 },
							{ color: { r: 0.8588235378265381, g: 0.8588235378265381, b: 0.8588235378265381, a: 1 }, position: 0.5 },
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
		let r = new Array();
		const i = (e, t) => {
			const r = (function* e(r) {
				for (let t = 0; t < r.length; t++) {
					const i = r[t];
					yield i, i.children && (yield* e(i.children));
				}
				t.push(r);
			})(e);
			for (let e = r.next(); !e.done; e = r.next());
		};
		i(figma.currentPage.selection, r), (r = r.flat());
		const o = (e) => {
			let t = new Array();
			if ((e = e.filter((e) => 'INSTANCE' === e.type).filter((e) => 'I' !== e.id.substr(0, 1))).length > 0)
				return (
					i(
						e.map((e) => e.detachInstance()),
						t,
					),
					r.push(
						t
							.flat()
							.filter((e) => 'INSTANCE' !== e.type)
							.filter((e) => 'I' !== e.id.substr(0, 1)),
					),
					(t = t
						.flat()
						.filter((e) => 'INSTANCE' === e.type)
						.filter((e) => 'I' !== e.id.substr(0, 1))),
					o(t),
					r.flat()
				);
		};
		o(r);
		let l = (r = r
				.flat()
				.filter((e) => 'INSTANCE' !== e.type)
				.filter((e) => 'I' !== e.id.substr(0, 1))).filter((e) => 'FRAME' === e.type && 'PAGE' !== e.parent.type),
			a = r.filter((e) => 'BOOLEAN_OPERATION' === e.type || 'ELLIPSE' === e.type || 'LINE' === e.type || 'POLYGON' === e.type || 'RECTANGLE' === e.type || 'STAR' === e.type),
			n = r.filter((e) => 'VECTOR' === e.type),
			s = r.filter((e) => 'TEXT' === e.type);
		(async () => {
			var t;
			await ((t = s),
			new Promise((r) => {
				t.map(async (t) => {
					if (t.fontName === figma.mixed) {
						const r = figma.createRectangle();
						let i = t.height;
						r.resizeWithoutConstraints(t.width, 0.7 * t.height),
							(r.cornerRadius = i),
							(r.x = t.relativeTransform[0][2]),
							(r.y = t.relativeTransform[1][2]),
							(r.fills = e),
							t.parent.insertChild(t.parent.children.length, r),
							t.remove();
					} else {
						await figma.loadFontAsync(t.fontName), (t.textAutoResize = 'NONE'), !0 === t.hasMissingFont && figma.closePlugin("You can't convert text until loading its source font.");
						let r = Number(t.fontSize),
							i = t.height,
							o = t.lineHeight;
						isNaN(o) && (o = 1.25 * r), (t.textAutoResize = i > o ? 'NONE' : 'WIDTH_AND_HEIGHT');
						let l = Math.round(i / o);
						for (let r = 0; r < l; r++) {
							const i = figma.createRectangle();
							i.resizeWithoutConstraints(t.width, (t.height, 0.7 * o)),
								(i.cornerRadius = o),
								(i.x = t.relativeTransform[0][2]),
								(i.y = t.relativeTransform[1][2] + o * r),
								(i.fills = e),
								t.parent.insertChild(t.parent.children.length, i);
						}
						t.remove();
					}
				}),
					setTimeout(() => r('done'), 0);
			})),
				((e) => {
					l.map((e) => {
						(e.layoutMode = 'NONE'), (e.effects = []), (e.fills = []), (e.strokes = []);
					});
				})(),
				((t) => {
					n.map((t) => {
						(t.fills = e), t.strokeWeight > 0 && (t.strokes = e), 0 === t.strokeWeight && (t.strokes = []);
					});
				})(),
				((t) => {
					'BOOLEAN_OPERATION' === t.type && t.outlineStroke(),
						t.map((t) => {
							(t.effects = []), 'IMAGE' === t.fills.type ? ((t.fills = []), (t.strokes = [])) : ((t.fills = e), (t.strokes = e));
						});
				})(a),
				console.clear(),
				figma.closePlugin('Selection ghostified 👻.');
		})();
	});
