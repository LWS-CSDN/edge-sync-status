"""Draw the extension icon: a circle with a check mark, in Edge's blue."""

import struct
import zlib

SIZE = 128
BLUE = (15, 108, 189, 255)
WHITE = (255, 255, 255, 255)


def circle(pixels):
    center = (SIZE - 1) / 2
    radius = SIZE * 0.46
    for y in range(SIZE):
        for x in range(SIZE):
            if (x - center) ** 2 + (y - center) ** 2 <= radius ** 2:
                pixels[y][x] = BLUE


def stroke(pixels, points, width):
    radius = width / 2
    for y in range(SIZE):
        for x in range(SIZE):
            for px, py in points:
                if (x - px) ** 2 + (y - py) ** 2 <= radius ** 2:
                    pixels[y][x] = WHITE
                    break


def line(start, end, step):
    x1, y1 = start
    x2, y2 = end
    length = max(abs(x2 - x1), abs(y2 - y1))
    count = max(1, int(length / step))
    return [(x1 + (x2 - x1) * i / count, y1 + (y2 - y1) * i / count) for i in range(count + 1)]


def build():
    pixels = [[(0, 0, 0, 0) for _ in range(SIZE)] for _ in range(SIZE)]
    circle(pixels)
    points = line((34, 66), (56, 90), 0.5) + line((56, 90), (96, 42), 0.5)
    stroke(pixels, points, 10)
    return pixels


def png(pixels):
    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)

    raw = b''.join(b'\x00' + b''.join(bytes(pixel) for pixel in row) for row in pixels)
    return b''.join([
        b'\x89PNG\r\n\x1a\n',
        chunk(b'IHDR', struct.pack('>IIBBBBB', SIZE, SIZE, 8, 6, 0, 0, 0)),
        chunk(b'IDAT', zlib.compress(raw, 9)),
        chunk(b'IEND', b''),
    ])


if __name__ == '__main__':
    import os
    target = os.path.join(os.path.dirname(__file__), '..', 'extension', 'icon128.png')
    with open(target, 'wb') as handle:
        handle.write(png(build()))
    print('wrote', os.path.abspath(target))
