# Edge Sync Status

**English** | [简体中文](README.zh-CN.md)

Check whether Microsoft Edge accepted this computer's latest sync upload, see connected devices, and inspect recent sync events using local diagnostic records.

[Download v1.0.5](https://github.com/LWS-CSDN/edge-sync-status/releases/tag/v1.0.5) · [User guide](extension/USAGE.md) · [Changelog](CHANGELOG.md)

## Features

- Show the latest upload result and the last successful upload time for each data type.
- List devices found in local sync records, merge repeated registrations, and highlight devices not seen for over 14 days.
- Show recent sync events to help investigate upload problems.
- Switch the status and help pages between English and Chinese, with your choice saved locally.
- Read local records without changing sync data or sending diagnostic records to another service.

## Requirements

- Windows 10 or Windows 11, x64, with Microsoft Edge 120 or newer.
- The **Default profile** in Edge's standard user-data directory. Other profiles and custom directories are not supported yet.
- Python and administrator rights are not required for the release package. The bundled reader is a Windows x64 executable; macOS and Linux are not supported.

The extension can inspect existing local records offline. Edge itself needs a network connection to sync new changes.

## Download and install

1. Download [edge-sync-status-v1.0.5-windows-x64.zip](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.5/edge-sync-status-v1.0.5-windows-x64.zip). This is the complete package with the extension, local reader, and installation scripts. GitHub's automatic **Source code** archives are intended for development.
2. Extract the entire ZIP to a folder you intend to keep. Keep the included directory structure.
3. Open `edge://extensions/`, enable **Developer mode**, choose **Load unpacked**, and select the extracted `extension` folder.
4. Double-click `install.cmd` in the package's top-level folder. A successful installation shows `Registered com.edge.syncstatus`. It registers the reader for the current Windows user.
5. Click the extension's toolbar icon to open the status page. If the icon is missing, find **Edge 同步状态** in Edge's Extensions menu and pin it.

`install.cmd` registers the local reader; the extension itself is loaded manually in step 3. Edge starts the reader when needed. There is no separate server to start and no need to run `syncstatus-host.exe` yourself.

To verify the download, compare the result of the following PowerShell command with [SHA256SUMS.txt](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.5/SHA256SUMS.txt):

```powershell
Get-FileHash .\edge-sync-status-v1.0.5-windows-x64.zip -Algorithm SHA256
```

## Usage

Click the toolbar icon to open the status page or return to the existing tab. Click **Refresh** to read local records again.

Click **中文** at the top right to switch to Chinese; click **English** to switch back. The first visit follows Edge's interface language: Chinese for Chinese locales, English otherwise. A manual choice is saved locally and shared by the status and help pages. Device names, timestamps, and original diagnostic codes retain their original values.

| Status | Meaning |
|---|---|
| Sync OK | The latest upload was accepted by the server. |
| Possibly stuck | A new-client initialization appears without a successful upload. Normal initialization may also trigger this marker; check later records and Edge's own sync status. |
| No recent upload | Sync records exist, but no recent upload was found. |
| No records | No sync log was found. |
| Read failed | The local reader could not be reached. Confirm that `install.cmd` completed successfully. |

The page also shows upload times by data type, devices, and recent sync events. A stale upload time alone does not prove that a type is broken; there may have been no changes to upload. See the [user guide](extension/USAGE.md) for details and troubleshooting.

## Upgrade

1. Close the status and help tabs.
2. Copy the new package contents over the original installation, keeping `extension` and `host` in their original relative locations.
3. Reload the extension at `edge://extensions/`, then run `install.cmd` again.

If you use a new folder, remove the old extension from Edge before loading and registering the new location. Moving the installation always requires registering the reader again.

An in-place upgrade does not delete old files. You can remove leftover `register.cmd`, `install.ps1`, `register.ps1`, and `uninstall.ps1`; current releases use only `install.cmd` and `uninstall.cmd`.

## Uninstall

1. Remove the extension at `edge://extensions/`.
2. Double-click `uninstall.cmd` to remove the current user's reader registration.
3. Delete the extracted folder if you no longer need it.

## How it works

The extension displays reports from `host/syncstatus-host.exe` through Edge's native messaging API. The reader inspects the Default profile's `Sync Data\Logs\cv_debug.log` and `Sync Data\LevelDB` in the standard user-data directory, then sends a report to the extension.

`install.cmd` registers `host/com.edge.syncstatus.json` under the current user's `HKCU\SOFTWARE\Microsoft\Edge\NativeMessagingHosts\com.edge.syncstatus` key. `uninstall.cmd` removes that registration.

The extension ID is fixed at `baihbjmdopjlikhppfbpgknmlijfkfgn`. Keep the manifest's public key: Edge derives the extension ID from it, and the host accepts only that ID.

## Limitations

- Only the standard **Default profile** is supported. Selecting a different profile in Edge does not change what this extension reads.
- **Possibly stuck** is a log heuristic and can flag normal initialization. Wait, refresh, and check Edge's sync settings before taking corrective action.
- Device-name recognition can be incomplete. Timestamps around a year boundary and some event details may be parsed incorrectly.
- Devices appear only when their records exist on this computer. An absent device does not prove that it never synced.
- The reader depends on Edge's local log and database formats; format changes may require parser updates.
- The package uses the repository's existing unsigned x64 reader. It has not been rebuilt for this release. Verification covers automated tests, package contents, and the native messaging protocol; a complete installation and real sync check inside Edge has not been verified.

## Development and releases

Development requires Python 3.10+ and Node.js 18+. Run these commands from the repository root:

```powershell
python -I -B host/test_sync_status.py
python -I -B -m unittest discover -s tests -v
node --test tests/*.test.js
node --check extension/background.js
node --check extension/popup.js
node --check extension/i18n.js
python -I -B scripts/build_release.py --tag v1.0.5
```

The ZIP and checksum are written to `dist/`. The builder uses a file allowlist and includes both language versions of the README, user guide, and changelog.

For a new release, update `extension/manifest.json`, both changelogs, and version-specific documentation links. Commit and push the changes, then push the matching `v<version>` tag. GitHub Actions runs verification, builds the package, and publishes the ZIP and checksum. Release notes use English with a link to the Chinese notes. A manual workflow run only verifies and builds artifacts.

Keep both language versions in sync when updating documentation. If the extension's public key ever changes, the host's `allowed_origins` must change with it, and existing installations need to be reloaded.
