"""Exercise the release CLI and inspect its real ZIP/checksum outputs."""

import base64
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
import zipfile


ROOT = Path(__file__).resolve().parents[1]
PACKAGE_FILES = (
    "extension/manifest.json",
    "extension/background.js",
    "extension/popup.html",
    "extension/popup.js",
    "extension/popup.css",
    "extension/help.html",
    "extension/icon128.png",
    "extension/使用说明.md",
    "host/syncstatus-host.exe",
    "host/com.edge.syncstatus.json",
    "README.md",
    "register.ps1",
    "uninstall.ps1",
    "注册.cmd",
    "卸载.cmd",
)


class ReleasePackageTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.source = Path(self.temp.name) / "source"
        self.output = Path(self.temp.name) / "output with spaces"
        for relative in PACKAGE_FILES:
            target = self.source / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(ROOT / relative, target)
        (self.source / "scripts").mkdir()
        builder = ROOT / "scripts/build_release.py"
        if builder.exists():
            shutil.copyfile(builder, self.source / "scripts/build_release.py")
        self.write_json("extension/manifest.json", {
            "manifest_version": 3,
            "version": "1.2.3",
            "key": base64.b64encode(b"test-public-key").decode("ascii"),
        })
        self.write_json("host/com.edge.syncstatus.json", {
            "allowed_origins": [
                "chrome-extension://miioiacackengfaieboeigejlemdpffd/"
            ],
        })

    def write_json(self, relative, data):
        (self.source / relative).write_text(json.dumps(data), encoding="utf-8")

    def run_builder(self, *args, use_output_option=True):
        command = [sys.executable, "-I", "-X", "utf8", str(self.source / "scripts/build_release.py")]
        if use_output_option:
            command.extend(["--output-dir", str(self.output)])
        return subprocess.run(command + list(args), cwd=self.temp.name,
                              capture_output=True, text=True, encoding="utf-8")

    def assert_rejected(self, result, diagnostic):
        self.assertNotEqual(result.returncode, 0)
        self.assertIn(diagnostic, result.stderr)
        self.assertFalse(self.output.exists(), "validation must precede output creation")

    def test_zip_contains_only_required_files_and_preserves_their_bytes(self):
        # A recursive copy would leak these source/development files into the ZIP.
        for relative in ("install.ps1", "host/native_host.py", "tests/test_private.py",
                         ".git/config", ".idea/workspace.xml", "extension/debug.txt"):
            path = self.source / relative
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text("do not distribute", encoding="utf-8")
        result = self.run_builder("--tag", "v1.2.3")
        self.assertEqual(result.returncode, 0, result.stderr)
        archive = self.output / "edge-sync-status-v1.2.3-windows-x64.zip"
        prefix = "edge-sync-status-v1.2.3-windows-x64/"
        with zipfile.ZipFile(archive) as package:
            self.assertEqual(set(package.namelist()),
                             {prefix + name for name in PACKAGE_FILES})
            self.assertEqual(len(package.namelist()), len(PACKAGE_FILES))
            self.assertIsNone(package.testzip())
            for relative in PACKAGE_FILES:
                self.assertEqual(package.read(prefix + relative),
                                 (self.source / relative).read_bytes())
        digest = hashlib.sha256(archive.read_bytes()).hexdigest()
        self.assertEqual((self.output / "SHA256SUMS.txt").read_text(encoding="utf-8"),
                         f"{digest}  {archive.name}\n")

    def test_default_output_is_repository_dist_independent_of_working_directory(self):
        result = self.run_builder(use_output_option=False)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertTrue((self.source / "dist/edge-sync-status-v1.2.3-windows-x64.zip").is_file())
        self.assertTrue((self.source / "dist/SHA256SUMS.txt").is_file())

    def test_tag_must_match_manifest_version(self):
        self.assert_rejected(self.run_builder("--tag", "v9.9.9"), "tag")

    def test_every_allowlisted_file_is_required(self):
        for relative in PACKAGE_FILES:
            with self.subTest(file=relative):
                original = self.source / relative
                backup = original.with_name(original.name + ".backup")
                original.rename(backup)
                try:
                    self.assert_rejected(self.run_builder(), relative)
                finally:
                    backup.rename(original)

    def test_public_key_must_match_the_only_allowed_origin(self):
        for origins in (["chrome-extension://aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/"],
                        ["chrome-extension://miioiacackengfaieboeigejlemdpffd/", "*"], []):
            with self.subTest(origins=origins):
                self.write_json("host/com.edge.syncstatus.json", {"allowed_origins": origins})
                self.assert_rejected(self.run_builder(), "allowed_origins")

    def test_missing_or_invalid_public_key_is_rejected(self):
        for key in (None, "not base64!", ""):
            with self.subTest(key=key):
                self.write_json("extension/manifest.json", {"version": "1.2.3", "key": key})
                self.assert_rejected(self.run_builder(), "key")

    def test_invalid_version_cannot_escape_output_directory(self):
        self.write_json("extension/manifest.json", {
            "version": "../../outside",
            "key": base64.b64encode(b"test-public-key").decode("ascii"),
        })
        self.assert_rejected(self.run_builder(), "version")


if __name__ == "__main__":
    unittest.main()
