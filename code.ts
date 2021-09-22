figma.parameters.on("input", (parameters: ParameterValues, currentKey: string, result: SuggestionResults) => {
	const query = parameters[currentKey];
	switch (currentKey) {
		case "color":
			const colors = ["Gray", "Black", "White"];
			result.setSuggestions(colors.filter((s) => s.includes(query)));
			break;
		default:
			return;
	}
});
figma.on("run", ({ parameters }: RunEvent) => {
	0 === figma.currentPage.selection.length && (figma.notify("Select at least one item."), figma.closePlugin());
	if (parameters) {
		let color;
		"Gray" === parameters.color &&
			(color = {
				r: 0.9,
				g: 0.9,
				b: 0.9,
			}),
			"Black" === parameters.color &&
				(color = {
					r: 0,
					g: 0,
					b: 0,
				}),
			"White" === parameters.color &&
				(color = {
					r: 1,
					g: 1,
					b: 1,
				});
		let all = new Array();
		const traversal = (e, f) => {
			let count = 0;
			function* read(nodes) {
				const len = nodes.length;
				if (len === 0) {
					return;
				}
				for (let i = 0; i < len; i++) {
					const node = nodes[i];
					yield node;
					let children = node.children;
					if (children) {
						yield* read(children);
					}
				}
				f.push(nodes);
			}
			const it = read(e);
			let res = it.next();
			while (!res.done) {
				count++;
				res = it.next();
			}
		};
		traversal(figma.currentPage.selection, all);
		all = all.flat();
		const detach = (t) => {
			let e = new Array();
			if ((t = t.filter((t) => "INSTANCE" === t.type).filter((t) => "I" !== t.id.substr(0, 1))).length > 0)
				return (
					traversal(
						t.map((t) => t.detachInstance()),
						e
					),
					all.push(
						e
							.flat()
							.filter((t) => "INSTANCE" !== t.type)
							.filter((t) => "I" !== t.id.substr(0, 1))
					),
					(e = e
						.flat()
						.filter((t) => "INSTANCE" === t.type)
						.filter((t) => "I" !== t.id.substr(0, 1))),
					detach(e),
					all.flat()
				);
		};
		detach(all);
		all = all
			.flat()
			.filter((n) => n.type !== "INSTANCE")
			.filter((n) => n.id.substr(0, 1) !== "I");
		let frames = all.filter((n) => n.type === "FRAME" && n.parent.type !== "PAGE");
		let images = new Array(),
			nonimages = new Array();
		frames.map((e) => {
			e.fills.map((a) => {
				a.type;
				"IMAGE" === a.type ? images.push(e) : nonimages.push(e);
			});
		});
		frames.map((e) => (e.layoutMode = "NONE"));
		let shapes = all.filter(
			(n) => n.type === "ELLIPSE" || n.type === "POLYGON" || n.type === "RECTANGLE" || n.type === "STAR"
		) as SceneNode[];
		let vectors = all.filter((n) => n.type === "VECTOR") as VectorNode[];
		let text = all.filter((n) => n.type === "TEXT") as TextNode[];
		const nodes: SceneNode[] = [];
		const ghostifyNonImages = (o) => {
			o.map((o) => {
				(o.effects = [
					{
						type: "DROP_SHADOW",
						color: {
							r: 0,
							g: 0,
							b: 0,
							a: 0,
						},
						offset: {
							x: 0,
							y: 0,
						},
						radius: 0,
						spread: 0,
						visible: !0,
						blendMode: "NORMAL",
						showShadowBehindNode: !0,
					},
				]),
					(o.fills = [
						{
							type: "SOLID",
							opacity: 0,
							color: color,
						},
					]),
					(o.strokeWeight = 0),
					(o.strokes = [
						{
							type: "SOLID",
							opacity: 0,
							color: color,
						},
					]),
					(o.strokeWeight = 0);
			});
		};
		ghostifyNonImages(nonimages);
		const ghostifyImages = (o) => {
			o.map((o) => {
				(o.effects = [
					{
						type: "DROP_SHADOW",
						color: {
							r: 0,
							g: 0,
							b: 0,
							a: 0,
						},
						offset: {
							x: 0,
							y: 0,
						},
						radius: 0,
						spread: 0,
						visible: !0,
						blendMode: "NORMAL",
						showShadowBehindNode: !0,
					},
				]),
					(o.fills = [
						{
							type: "SOLID",
							opacity: 1,
							color: color,
						},
					]),
					(o.strokeWeight = 0),
					(o.strokes = [
						{
							type: "SOLID",
							opacity: 0,
							color: color,
						},
					]),
					(o.strokeWeight = 0);
			});
		};
		ghostifyImages(images);
		const ghostifyVector = (o) => {
			o.map((o) => {
				(o.fills = [
					{
						type: "SOLID",
						color: color,
					},
				]),
					(o.strokes = [
						{
							type: "SOLID",
							color: color,
						},
					]);
				nodes.push(o);
			});
		};
		ghostifyVector(vectors);
		const ghostifyShapes = (n) => {
			n.map((e) => {
				const t = figma.createRectangle();
				"ELLIPSE" === e.type && (t.cornerRadius = 1e3),
					t.resizeWithoutConstraints(e.width, e.height),
					(t.cornerRadius = e.cornerRadius),
					(t.x = e.relativeTransform[0][2]),
					(t.y = e.relativeTransform[1][2]),
					(t.fills = [
						{
							type: "SOLID",
							color: color,
						},
					]),
					nodes.push(t),
					"COMPONENT_SET" !== e.parent.type &&
						"PAGE" !== e.parent.type &&
						(e.parent.insertChild(e.parent.children.length, t), e.remove());
			});
		};
		ghostifyShapes(shapes);
		const ghostifyText = (n) => {
			n.map((e) => {
				let fontsize = Number(e.fontSize),
					height = e.height,
					lineHeight = e.lineHeight;
				isNaN(lineHeight) && (lineHeight = 1.25 * fontsize);
				const numberOfRectangles = Math.round(height / lineHeight);
				for (let t = 0; t < numberOfRectangles; t++) {
					const i = figma.createRectangle();
					i.resizeWithoutConstraints((e.width, e.width), 0.7 * lineHeight),
						(i.cornerRadius = lineHeight),
						(i.x = e.relativeTransform[0][2]),
						(i.y = e.relativeTransform[1][2] + lineHeight * t),
						(i.fills = [
							{
								type: "SOLID",
								color: color,
							},
						]),
						nodes.push(i),
						e.parent.insertChild(e.parent.children.length, i);
				}
				e.remove();
			});
		};
		ghostifyText(text);
		console.clear();
		figma.closePlugin("ghostified");
	}
});
