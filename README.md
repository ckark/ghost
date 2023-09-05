# Ghost

Ghost is a lightweight plugin that converts high fidelity mockups to loading or “skeleton” screens.

## How it Works

Ghost recursively detects all nodes in a selection. It then measures their dimensions before replacing them with shapes; the original layers are removed. To generate a layout faithful to the original, Ghost removes properties like auto-layout, effects, strokes, and fills, thereby preventing anomalies that occur when inserting placeholder shapes onto the canvas.

### A Note on Frames

Since a frame has varied uses—creating components (e.g., buttons, toggle switches, etc.) and containers (e.g., cards and screens)—altering or removing its background color may prove disruptive. Accordingly, Ghost instead detaches and retains each frame's background color while removing strokes and effects.

## Basic Usage

1. Select a shape, text box, or an entire screen.
2. Select a color.
3. Ghost!

## Recommended Usage

Loading is a state specific design akin to `disabled` or `destructive`, `hover` or `active`. Create a ghostified loading variant.

## Roadmap

A color picker—depending on whether Figma’s new input parameters add support for HTML-like inputs like `input type=color`.

## End Notes

I’m relatively new to Typescript and working with Figma’s API in general. For questions and (constructive) feedback, send me a message.
