#!/usr/bin/env python3
"""Normalize an Imagegen sticker to a trimmed, transparent PNG."""

from __future__ import annotations

import argparse
from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter


def remove_light_neutral_background(image: Image.Image) -> Image.Image:
    """Turn a baked white/gray checkerboard into a soft alpha matte."""
    rgba = image.convert("RGBA")
    pixels = rgba.load()

    for y in range(rgba.height):
        for x in range(rgba.width):
            red, green, blue, source_alpha = pixels[x, y]
            darkest = min(red, green, blue)
            chroma = max(red, green, blue) - darkest

            # The generated checkerboard is very bright and nearly neutral.
            # Saturated cream paper and all printed ink remain opaque.
            chroma_signal = (chroma - 2.0) / 18.0
            dark_signal = (242.0 - darkest) / 20.0
            signal = max(chroma_signal, dark_signal)
            signal = max(0.0, min(1.0, signal))
            matte = round(255 * signal * signal * (3 - 2 * signal))
            alpha = round(source_alpha * matte / 255)

            if alpha <= 3:
                pixels[x, y] = (0, 0, 0, 0)
            else:
                pixels[x, y] = (red, green, blue, alpha)

    return rgba


def keep_largest_sticker(image: Image.Image) -> Image.Image:
    """Discard pale checkerboard residue that is disconnected from the sticker."""
    alpha = image.getchannel("A")
    seed = alpha.point(lambda value: 255 if value >= 128 else 0)
    width, height = seed.size
    source = seed.load()
    visited = bytearray(width * height)
    largest: list[int] = []

    for y in range(height):
        for x in range(width):
            index = y * width + x
            if visited[index] or source[x, y] == 0:
                continue

            component: list[int] = []
            queue = deque([index])
            visited[index] = 1
            while queue:
                current = queue.popleft()
                component.append(current)
                cx = current % width
                cy = current // width
                for nx, ny in ((cx - 1, cy), (cx + 1, cy), (cx, cy - 1), (cx, cy + 1)):
                    if nx < 0 or nx >= width or ny < 0 or ny >= height:
                        continue
                    neighbor = ny * width + nx
                    if visited[neighbor] or source[nx, ny] == 0:
                        continue
                    visited[neighbor] = 1
                    queue.append(neighbor)

            if len(component) > len(largest):
                largest = component

    if not largest:
        raise ValueError("Could not identify the sticker silhouette")

    support = Image.new("L", (width, height), 0)
    support_pixels = support.load()
    for index in largest:
        support_pixels[index % width, index // width] = 255
    support = support.filter(ImageFilter.MaxFilter(9))

    pixels = image.load()
    support_pixels = support.load()
    for y in range(height):
        for x in range(width):
            if support_pixels[x, y] == 0:
                pixels[x, y] = (0, 0, 0, 0)

    return image


def trim_and_resize(image: Image.Image, max_edge: int, padding: int = 12) -> Image.Image:
    alpha = image.getchannel("A")
    bounds = alpha.getbbox()
    if not bounds:
        raise ValueError("No visible sticker remained after background removal")

    left, top, right, bottom = bounds
    left = max(0, left - padding)
    top = max(0, top - padding)
    right = min(image.width, right + padding)
    bottom = min(image.height, bottom + padding)
    image = image.crop((left, top, right, bottom))

    longest = max(image.size)
    if longest > max_edge:
        scale = max_edge / longest
        size = (max(1, round(image.width * scale)), max(1, round(image.height * scale)))
        image = image.resize(size, Image.Resampling.LANCZOS)

    return image


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--max-edge", type=int, default=720)
    parser.add_argument("--keep-alpha", action="store_true")
    args = parser.parse_args()

    image = Image.open(args.input).convert("RGBA")
    if not args.keep_alpha:
        image = remove_light_neutral_background(image)
        image = keep_largest_sticker(image)
    image = trim_and_resize(image, args.max_edge)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    image.save(args.output, format="PNG", optimize=True)
    print(f"{args.output}: {image.width}x{image.height}, RGBA")


if __name__ == "__main__":
    main()
