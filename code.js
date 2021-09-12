figma.parameters.on("input", (e, t, r) => {
	const i = e[t];
	switch (t) {
		case "color":
			const e = ["Gray", "Black", "White"];
			r.setSuggestions(e.filter(e => e.includes(i)));
			break;
		default:
			return
	}
}), figma.on("run", ({
	parameters: e
}) => {
	if (0 === figma.currentPage.selection.length && (figma.notify("Select at least one item."), figma.closePlugin()), e) {
		let t;
		"Gray" === e.color && (t = {
			r: .9,
			g: .9,
			b: .9
		}), "Black" === e.color && (t = {
			r: 0,
			g: 0,
			b: 0
		}), "White" === e.color && (t = {
			r: 1,
			g: 1,
			b: 1
		});
		let r = new Array;
		const i = (e, t) => {
			const r = function* e(r) {
				const i = r.length;
				if (0 !== i) {
					for (let t = 0; t < i; t++) {
						const i = r[t];
						yield i;
						let a = i.children;
						a && (yield* e(a))
					}
					t.push(r)
				}
			}(e);
			let i = r.next();
			for (; !i.done;) 0, i = r.next()
		};
		i(figma.currentPage.selection, r), r = r.flat();
		const a = e => {
			let t = new Array;
			if ((e = e.filter(({
					type: e
				}) => "INSTANCE" === e).filter(({
					id: e
				}) => "I" !== e.substr(0, 1))).length > 0) return i(e.map(e => e.detachInstance()), t), r.push(t.flat().filter(({
				type: e
			}) => "INSTANCE" !== e).filter(({
				id: e
			}) => "I" !== e.substr(0, 1))), t = t.flat().filter(({
				type: e
			}) => "INSTANCE" === e).filter(({
				id: e
			}) => "I" !== e.substr(0, 1)), a(t), r.flat()
		};
		a(r);
		let n = (r = r.flat().filter(({
				type: e
			}) => "INSTANCE" !== e).filter(({
				id: e
			}) => "I" !== e.substr(0, 1))).filter(({
				type: e,
				parent: t
			}) => "FRAME" === e && "PAGE" !== t.type),
			l = r.filter(({
				type: e
			}) => "ELLIPSE" === e || "POLYGON" === e || "RECTANGLE" === e || "STAR" === e),
			o = r.filter(({
				type: e
			}) => "VECTOR" === e),
			s = r.filter(({
				type: e
			}) => "TEXT" === e);
		(e => {
			e.map(e => {
				e.effects = [{
					type: "DROP_SHADOW",
					color: {
						r: 0,
						g: 0,
						b: 0,
						a: 0
					},
					offset: {
						x: 0,
						y: 2
					},
					radius: 0,
					spread: 0,
					visible: !0,
					blendMode: "NORMAL",
					showShadowBehindNode: !0
				}], e.fills = [{
					type: "SOLID",
					opacity: 0,
					color: t
				}], e.strokeWeight = 0, e.strokes = [{
					type: "SOLID",
					opacity: 0,
					color: t
				}], e.strokeWeight = 0
			})
		})(n), (e => {
			e.map(e => {
				e.resizeWithoutConstraints(e.width, e.height), e.x = e.relativeTransform[0][2], e.y = e.relativeTransform[1][2], e.fills = [{
					type: "SOLID",
					color: t
				}], e.strokes = [{
					type: "SOLID",
					color: t
				}]
			})
		})(o), (e => {
			const r = [];
			e.map(e => {
				const i = figma.createRectangle();
				"ELLIPSE" === e.type && (i.cornerRadius = 1e3), i.resizeWithoutConstraints(e.width, e.height), i.x = e.relativeTransform[0][2], i.y = e.relativeTransform[1][2], i.fills = [{
					type: "SOLID",
					color: t
				}], r.push(i), "COMPONENT_SET" !== e.parent.type && "PAGE" !== e.parent.type && (e.parent.insertChild(e.parent.children.length, i), e.remove())
			})
		})(l), (e => {
			e.map(e => {
				let r = Number(e.fontSize),
					i = e.height,
					a = e.lineHeight;
				isNaN(a) && (a = 1.25 * r);
				const n = [],
					l = Math.round(i / a);
				for (let r = 0; r < l; r++) {
					const i = figma.createRectangle();
					i.resizeWithoutConstraints((e.width, e.width), .7 * a), i.cornerRadius = a, i.x = e.relativeTransform[0][2], i.y = e.relativeTransform[1][2] + a * r, i.fills = [{
						type: "SOLID",
						color: t
					}], n.push(i), e.parent.insertChild(e.parent.children.length, i)
				}
				e.remove()
			})
		})(s), (() => {
			const e = Array.from(figma.currentPage.findAll(({
					parent: e
				}) => "PAGE" === e.type)),
				t = Array.from(figma.currentPage.findAll(({
					type: e,
					parent: t
				}) => "FRAME" === e && "PAGE" === t.type));
			n.map(e => e.layoutMode = "NONE"), 0 != t.length && 0 != e.length && e.map(e => {
				t.map(t => {
					if (!0 === function (e, t) {
							return e.parent.children.indexOf(e) > t.parent.children.indexOf(t) && e.x >= t.x && e.x + e.width <= t.x + t.width && e.y >= t.y && e.y + e.height <= t.y + t.height
						}(e, t) && e.id != t.id) {
						let r = Math.abs(t.x - e.x),
							i = Math.abs(t.y - e.y);
						t.appendChild(e), e.x = r, e.y = i
					}
				})
			})
		})(), figma.closePlugin("ghostified")
	}
});