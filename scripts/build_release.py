"""Build the Windows release ZIP using only the Python standard library."""

import argparse
import base64
import binascii
import hashlib
import json
from pathlib import Path
import re
import sys
import zipfile


ROOT = Path(__file__).resolve().parents[1]
PACKAGE_FILES = (
    "extension/manifest.json",
    "extension/background.js",
    "extension/popup.html",
    "extension/popup.js",
    "extension/i18n.js",
    "extension/popup.css",
    "extension/help.html",
    "extension/icon128.png",
    "extension/使用说明.md",
    "host/syncstatus-host.exe",
    "host/com.edge.syncstatus.json",
    "README.md",
    "install.cmd",
    "uninstall.cmd",
)


def validate_source(root, tag):
    """Validate all inputs before creating the output directory or archive."""
    for relative in PACKAGE_FILES:
        if not (root / relative).is_file():
            raise ValueError(f"Required file missing: {relative}")

    manifest = json.loads((root / "extension/manifest.json").read_text(encoding="utf-8"))
    version = manifest.get("version")
    if not isinstance(version, str) or not re.fullmatch(r"[0-9]+(?:\.[0-9]+){0,3}", version):
        raise ValueError("Invalid manifest version")
    parts = version.split(".")
    if any(len(part) > 5 or int(part) > 65535 or
           (len(part) > 1 and part.startswith("0")) for part in parts) or not any(map(int, parts)):
        raise ValueError("Invalid manifest version")
    if tag is not None and tag != f"v{version}":
        raise ValueError(f"Release tag {tag!r} does not match manifest version v{version}")

    key = manifest.get("key")
    if not isinstance(key, str) or not key:
        raise ValueError("Manifest public key is required")
    try:
        decoded_key = base64.b64decode(key, validate=True)
    except (ValueError, binascii.Error) as error:
        raise ValueError("Manifest key must be valid base64") from error
    if not decoded_key:
        raise ValueError("Manifest key must not be empty")
    digest = hashlib.sha256(decoded_key).hexdigest()[:32]
    extension_id = "".join(chr(ord("a") + int(char, 16)) for char in digest)
    host = json.loads((root / "host/com.edge.syncstatus.json").read_text(encoding="utf-8"))
    expected = [f"chrome-extension://{extension_id}/"]
    if host.get("allowed_origins") != expected:
        raise ValueError(f"Host allowed_origins must match manifest key: {expected[0]}")
    return version


def build_release(root, output_dir, tag=None):
    version = validate_source(root, tag)
    package_name = f"edge-sync-status-v{version}-windows-x64"
    output_dir.mkdir(parents=True, exist_ok=True)
    archive = output_dir / f"{package_name}.zip"
    with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED) as package:
        for relative in PACKAGE_FILES:
            package.write(root / relative, f"{package_name}/{relative}")
    digest = hashlib.sha256()
    with archive.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    (output_dir / "SHA256SUMS.txt").write_text(
        f"{digest.hexdigest()}  {archive.name}\n", encoding="utf-8", newline="\n")
    return archive


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path, default=ROOT / "dist")
    parser.add_argument("--tag", help="Release tag; must equal v<manifest.version>")
    args = parser.parse_args()
    try:
        archive = build_release(ROOT, args.output_dir, args.tag)
    except (OSError, ValueError, zipfile.BadZipFile) as error:
        parser.exit(1, f"Release build failed: {error}\n")
    print(archive)
    return 0


if __name__ == "__main__":
    sys.exit(main())
