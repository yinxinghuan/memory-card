#!/usr/bin/env python3
"""Resize and compress card sprites for memory-card game.
Target: 320px wide (enough for 3x retina on mobile).
Also applies to whack-a-mole sprites.
"""
import os
from PIL import Image

TARGETS = [
    '/Users/yin/claude code/games-template/memory-card/src/MemoryCard/img',
    '/Users/yin/claude code/games-template/whack-a-mole/src/WhackAMole/img',
]
MAX_W = 320
SKIP = {'poster.png', 'background.png', 'hole.png', 'aigram.svg'}


def compress(path: str):
    img = Image.open(path).convert('RGBA')
    w, h = img.size
    if w <= MAX_W:
        return 0  # already small enough

    new_w = MAX_W
    new_h = round(h * MAX_W / w)
    resized = img.resize((new_w, new_h), Image.LANCZOS)

    before = os.path.getsize(path)
    resized.save(path, optimize=True, compress_level=9)
    after = os.path.getsize(path)
    return before - after


total_saved = 0
for d in TARGETS:
    print(f'\n{d}')
    for f in sorted(os.listdir(d)):
        if not f.endswith('.png') or f in SKIP:
            continue
        path = os.path.join(d, f)
        saved = compress(path)
        after_kb = os.path.getsize(path) // 1024
        if saved > 0:
            print(f'  {f}: saved {saved // 1024}KB → {after_kb}KB')
        else:
            print(f'  {f}: already {after_kb}KB (skipped)')
        total_saved += saved

print(f'\nTotal saved: {total_saved // 1024}KB ({total_saved // 1024 // 1024}MB)')
