"""Smoke-test the real native message boundary without reading a real profile."""
import json
import os
from pathlib import Path
import struct
import subprocess
import sys
import unittest
import uuid

ROOT = Path(__file__).resolve().parents[1]


class NativeHostProtocolTest(unittest.TestCase):
    def check_host(self, command):
        profile = '__release_smoke_missing_' + uuid.uuid4().hex
        request = json.dumps({'profile': profile}).encode('utf-8')
        process = subprocess.run(command, input=struct.pack('<I', len(request)) + request,
                                 capture_output=True, timeout=30, cwd=ROOT)
        self.assertEqual(process.returncode, 0, process.stderr.decode('utf-8', errors='replace'))
        self.assertGreaterEqual(len(process.stdout), 4)
        length = struct.unpack('<I', process.stdout[:4])[0]
        self.assertEqual(len(process.stdout), length + 4, 'exactly one native JSON frame')
        report = json.loads(process.stdout[4:].decode('utf-8'))
        self.assertEqual(report['profile'], profile)
        self.assertEqual(report['status'], 'unknown')
        self.assertEqual(report['devices'], [])
        self.assertEqual(report['types'], [])
        self.assertEqual(report['recentEvents'], [])
        self.assertIsNone(report['lastUpload'])

    def test_python_host_returns_framed_report(self):
        self.check_host([sys.executable, '-I', '-B', str(ROOT / 'host/native_host.py')])

    @unittest.skipUnless(os.name == 'nt', 'the bundled host requires Windows x64')
    def test_bundled_exe_returns_framed_report(self):
        self.check_host([str(ROOT / 'host/syncstatus-host.exe')])


if __name__ == '__main__':
    unittest.main()
