"""Native messaging host for the Edge sync status extension.

Edge launches this on demand and speaks the native messaging protocol: each
message is a 32-bit length followed by UTF-8 JSON, on stdin and stdout. One
request produces one report and the process exits with the connection.
"""

import json
import os
import struct
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import sync_status


def read_message():
    raw_length = sys.stdin.buffer.read(4)
    if len(raw_length) < 4:
        return None
    length = struct.unpack('<I', raw_length)[0]
    return json.loads(sys.stdin.buffer.read(length).decode('utf-8'))


def write_message(payload):
    encoded = json.dumps(payload).encode('utf-8')
    sys.stdout.buffer.write(struct.pack('<I', len(encoded)))
    sys.stdout.buffer.write(encoded)
    sys.stdout.buffer.flush()


def main():
    request = read_message()
    if request is None:
        return
    profile = request.get('profile', 'Default')
    try:
        write_message(sync_status.collect(profile))
    except Exception as error:  # surface the reason instead of dying silently
        write_message({'status': 'error', 'summary': f'读取失败：{error}',
                       'devices': [], 'recentEvents': []})


if __name__ == '__main__':
    main()
