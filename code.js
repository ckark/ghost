figma.parameters.on("input", (e, t, r) => {
	const i = e[t];
	switch (t) {
		case "color":
			const e = ["Gray", "Black", "White"];
			r.setSuggestions(e.filter((e) => e.includes(i)));
			break;
		default:
			return;
	}
}),
	figma.on("run", ({ parameters: e }) => {
		if (
			(0 === figma.currentPage.selection.length &&
				(figma.notify("Select at least one item."), figma.closePlugin()),
			e)
		) {
			let t;
			"Gray" === e.color && (t = { r: 0.9, g: 0.9, b: 0.9 }),
				"Black" === e.color && (t = { r: 0, g: 0, b: 0 }),
				"White" === e.color && (t = { r: 1, g: 1, b: 1 });
			let r = new Array();
			const i = (e, t) => {
				const r = (function* e(r) {
					const i = r.length;
					if (0 !== i) {
						for (let t = 0; t < i; t++) {
							const i = r[t];
							yield i;
							let o = i.children;
							o && (yield* e(o));
						}
						t.push(r);
					}
				})(e);
				let i = r.next();
				for (; !i.done; ) 0, (i = r.next());
			};
			i(figma.currentPage.selection, r), (r = r.flat());
			const o = (e) => {
				let t = new Array();
				if (
					(e = e.filter(({ type: e }) => "INSTANCE" === e).filter(({ id: e }) => "I" !== e.substr(0, 1)))
						.length > 0
				)
					return (
						i(
							e.map((e) => e.detachInstance()),
							t
						),
						r.push(
							t
								.flat()
								.filter(({ type: e }) => "INSTANCE" !== e)
								.filter(({ id: e }) => "I" !== e.substr(0, 1))
						),
						(t = t
							.flat()
							.filter(({ type: e }) => "INSTANCE" === e)
							.filter(({ id: e }) => "I" !== e.substr(0, 1))),
						o(t),
						r.flat()
					);
			};
			o(r);
			let l = (r = r
					.flat()
					.filter(({ type: e }) => "INSTANCE" !== e)
					.filter(({ id: e }) => "I" !== e.substr(0, 1))).filter(
					({ type: e, parent: t }) => "FRAME" === e && "PAGE" !== t.type
				),
				s = new Array(),
				a = new Array();
			l.map((e) => {
				e.fills.map(({ type: t }) => {
					"IMAGE" === t ? s.push(e) : a.push(e);
				});
			}),
				l.map((e) => (e.layoutMode = "NONE"));
			let n = r.filter(({ type: e }) => "ELLIPSE" === e || "POLYGON" === e || "RECTANGLE" === e || "STAR" === e),
				c = r.filter(({ type: e }) => "VECTOR" === e),
				f = r.filter(({ type: e }) => "TEXT" === e);
			const p = [];
			((e) => {
				e.map((e) => {
					(e.effects = [
						{
							type: "DROP_SHADOW",
							color: { r: 0, g: 0, b: 0, a: 0 },
							offset: { x: 0, y: 0 },
							radius: 0,
							spread: 0,
							visible: !0,
							blendMode: "NORMAL",
							showShadowBehindNode: !0,
						},
					]),
						(e.fills = [{ type: "SOLID", opacity: 0, color: t }]),
						(e.strokeWeight = 0),
						(e.strokes = [{ type: "SOLID", opacity: 0, color: t }]),
						(e.strokeWeight = 0);
				});
			})(a),
				((e) => {
					e.map((e) => {
						(e.effects = [
							{
								type: "DROP_SHADOW",
								color: { r: 0, g: 0, b: 0, a: 0 },
								offset: { x: 0, y: 0 },
								radius: 0,
								spread: 0,
								visible: !0,
								blendMode: "NORMAL",
								showShadowBehindNode: !0,
							},
						]),
							(e.fills = [{ type: "SOLID", opacity: 1, color: t }]),
							(e.strokeWeight = 0),
							(e.strokes = [{ type: "SOLID", opacity: 0, color: t }]),
							(e.strokeWeight = 0);
					});
				})(s),
				((e) => {
					e.map((e) => {
						(e.fills = [{ type: "SOLID", color: t }]),
							(e.strokes = [{ type: "SOLID", color: t }]),
							p.push(e);
					});
				})(c),
				((e) => {
					e.map((e) => {
						const r = figma.createRectangle();
						"ELLIPSE" === e.type && (r.cornerRadius = 1e3),
							r.resizeWithoutConstraints(e.width, e.height),
							(r.cornerRadius = e.cornerRadius),
							(r.x = e.relativeTransform[0][2]),
							(r.y = e.relativeTransform[1][2]),
							(r.fills = [{ type: "SOLID", color: t }]),
							p.push(r),
							"COMPONENT_SET" !== e.parent.type &&
								"PAGE" !== e.parent.type &&
								(e.parent.insertChild(e.parent.children.length, r), e.remove());
					});
				})(n),
				((e) => {
					e.map((e) => {
						let r = Number(e.fontSize),
							i = e.height,
							o = e.lineHeight;
						isNaN(o) && (o = 1.25 * r);
						const l = Math.round(i / o);
						for (let r = 0; r < l; r++) {
							const i = figma.createRectangle();
							i.resizeWithoutConstraints((e.width, e.width), 0.7 * o),
								(i.cornerRadius = o),
								(i.x = e.relativeTransform[0][2]),
								(i.y = e.relativeTransform[1][2] + o * r),
								(i.fills = [{ type: "SOLID", color: t }]),
								p.push(i),
								e.parent.insertChild(e.parent.children.length, i);
						}
						e.remove();
					});
				})(f),
				console.clear(),
				figma.closePlugin("ghostified");
		}
	});
