import uuid
import tempfile
import os
import random as pyrandom
from typing import Tuple

def _rand_dims(options: dict) -> Tuple[int, int]:
    try:
        w = int(options.get("width", 0))
        h = int(options.get("height", 0))
    except Exception:
        w = 0
        h = 0
    if w <= 0:
        w = pyrandom.randint(64, 512)
    if h <= 0:
        h = pyrandom.randint(64, 512)
    return w, h

def uuid4(fake, options: dict) -> str:
    try:
        return str(fake.uuid4())
    except Exception:
        return str(uuid.uuid4())

def _ean_checksum(digits: list[int]) -> int:
    s = 0
    length = len(digits)
    for i, d in enumerate(digits):
        if (length - i) % 2 == 0:
            s += d * 3
        else:
            s += d
    return (10 - (s % 10)) % 10

def ean13(fake, options: dict) -> str:
    try:
        return fake.ean13()
    except Exception:
        base = [pyrandom.randint(0, 9) for _ in range(12)]
        cd = _ean_checksum(base)
        return "".join(str(x) for x in (base + [cd]))

def ean8(fake, options: dict) -> str:
    try:
        return fake.ean8()
    except Exception:
        base = [pyrandom.randint(0, 9) for _ in range(7)]
        cd = _ean_checksum(base)
        return "".join(str(x) for x in (base + [cd]))

def imageUrl(fake, options: dict) -> str:
    w, h = _rand_dims(options)
    try:
        return str(fake.image_url(width=w, height=h))
    except Exception:
        return f"https://picsum.photos/{w}/{h}"

def image(fake, options: dict) -> str:
    try:
        from PIL import Image, ImageDraw
    except Exception:
        return "Error: Pillow (PIL) is not installed"
    w, h = _rand_dims(options)
    img = Image.new("RGB", (w, h), (pyrandom.randint(0,255), pyrandom.randint(0,255), pyrandom.randint(0,255)))
    draw = ImageDraw.Draw(img)
    points = [(pyrandom.randint(0, w-1), pyrandom.randint(0, h-1)) for _ in range(pyrandom.randint(3, 8))]
    draw.polygon(points, fill=(pyrandom.randint(0,255), pyrandom.randint(0,255), pyrandom.randint(0,255)))
    fd, path = tempfile.mkstemp(suffix=".png")
    os.close(fd)
    img.save(path, format="PNG")
    return path

def handle(subtype: str, fake, options: dict) -> str:
    m = (subtype or "").lower()
    if m == "uuid4":
        return uuid4(fake, options)
    if m == "ean13":
        return ean13(fake, options)
    if m == "ean8":
        return ean8(fake, options)
    if m == "imageurl":
        return imageUrl(fake, options)
    if m == "image":
        return image(fake, options)
    raise ValueError(f"Unknown random subtype: {subtype}")