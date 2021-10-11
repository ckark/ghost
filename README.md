# Ghost

Ghost is a lightweight plugin that converts high fidelity mockups to loading or “skeleton” screens.

## How it Works

Ghost detects all text and shape layers (rectangles, ellipses, vectors, frames, etc.) selected. It then measures their dimensions before replacing them with rectangles; the original layers are removed.
To general a layout faithful to the original, Ghost removes auto-layout, thereby preventing some of the anomalies that occur when inserting children into frames.

## Basic Usage

1. Select a shape, text box, or an entire screen.
2. Select a color.
3. Ghost!

## Recommended Usage

Loading is a state specific design akin to `disabled` or `destructive`, `hover` or `active`. Create a ghostified loading variant.

## Roadmap

-   Color picker—depending on whether Figma’s new input parameters add support for HTML-like inputs like `input type=color`.
-   Linear gradients for a sheen effect.
-   Convert one or more directly selected instances.

## End Notes

I’m relatively new to Typescript and working with Figma’s API in general. For questions and (constructive) feedback, send me a message.
