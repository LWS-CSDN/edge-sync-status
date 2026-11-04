# Changelog

**English** | [简体中文](CHANGELOG.zh-CN.md)

[Project overview](README.md)

## [1.0.5] - 2026-11-04

Documentation now uses separate English and Simplified Chinese files, with language links at the top of each document.

- Make `README.md` English and add `README.zh-CN.md`, each with complete installation, usage, upgrade, limitations, and development instructions.
- Split the user guide and changelog into separate language versions. Existing release history remains available in both languages.
- Include all six language documents in the Windows package, with relative navigation that also works after extraction.
- Point each language of the in-app help to its matching online README. Release notes use English and link to the Chinese notes.

Download [edge-sync-status-v1.0.5-windows-x64.zip](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.5/edge-sync-status-v1.0.5-windows-x64.zip), extract it completely, load the `extension` folder at `edge://extensions/` with Developer mode enabled, then run `install.cmd`. Click the toolbar icon to open the status page. Python and administrator rights are not required.

To upgrade, close the extension tabs, copy the new files over the existing installation, reload the extension, and run `install.cmd` again. The reader, extension ID, and sync-reading behavior are unchanged. Only the Default profile in Edge's standard user-data directory is supported.

[SHA-256 checksums](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.5/SHA256SUMS.txt) · [English guide](https://github.com/LWS-CSDN/edge-sync-status/blob/v1.0.5/README.md)

## [1.0.4] - 2026-11-04

Installation and uninstallation now use a matching pair: **install.cmd / uninstall.cmd**.

- Rename the registration entry point to `install.cmd`, paired with `uninstall.cmd`.
- Remove the deprecated `install.ps1` and the redundant `register.ps1` and `uninstall.ps1`. The repository and new package contain only the two CMD entry points.
- Update interface messages, bilingual help, and the release package file list.

Download [edge-sync-status-v1.0.4-windows-x64.zip](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.4/edge-sync-status-v1.0.4-windows-x64.zip) and extract it completely. At `edge://extensions/`, enable Developer mode and load the included `extension` folder, then double-click **install.cmd**. Open the status page from the extension icon and use the language button at the top. To uninstall, remove the extension from Edge, then run **uninstall.cmd**.

To upgrade, close the status tab, copy the new files over the installation folder, reload the extension in Edge, and run `install.cmd`. Extracting over an old installation does not remove old files: you can delete the leftover `register.cmd` and the three PowerShell scripts manually. The native reader and extension ID are unchanged. Python and administrator rights are not required.

[SHA-256 checksums](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.4/SHA256SUMS.txt) · [Full English guide](https://github.com/LWS-CSDN/edge-sync-status/blob/main/README.md)

## [1.0.3] - 2026-11-04

The registration and uninstall entry points now use English filenames in both interface languages:

- **register.cmd** registers the local reader. Run it once after installation or after moving the installation folder.
- **uninstall.cmd** removes the current user's native-host registration.
- Interface messages, bilingual help, the README, and package contents now use these same filenames.

Download [edge-sync-status-v1.0.3-windows-x64.zip](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.3/edge-sync-status-v1.0.3-windows-x64.zip) and extract it. At `edge://extensions/`, enable Developer mode and load the included `extension` folder, then double-click `register.cmd`. Open the status page from the toolbar icon and use the language switch at the top right. Edge starts the reader automatically; no separate EXE or server needs to be launched.

To upgrade, close the status tab, copy the new files over the original installation, reload the extension at `edge://extensions/`, and run `register.cmd`. If using a new directory, remove the old extension from Edge first, then load and register the new location. To uninstall, remove the extension from Edge, then run `uninstall.cmd`.

Requirements and reader behavior are unchanged: Windows 10/11 x64, Microsoft Edge, and the Default profile. Python and administrator rights are not required. Registration still affects only the current user.

[Checksums](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.3/SHA256SUMS.txt) · [Full guide](https://github.com/LWS-CSDN/edge-sync-status/blob/main/README.md)

## [1.0.2] - 2026-11-04

The extension's actual interface now supports switching between Chinese and English.

- Click **English / 中文** at the top right to update the entire page immediately, including status descriptions, data types, device notices, sync events, and error messages.
- The first visit follows Edge's UI language: Chinese for Chinese locales, English otherwise. Your manual choice is saved locally and retained when the page is reopened.
- Help displays the selected language and has its own language button. Open status and help pages stay in sync.
- No changes to the native reader or additional dependencies are needed, and the extension ID is unchanged. Device names, timestamps, and original diagnostic codes are preserved.

#### Download, start, and upgrade

1. Download [edge-sync-status-v1.0.2-windows-x64.zip](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.2/edge-sync-status-v1.0.2-windows-x64.zip) and extract it to a location you intend to keep.
2. Open `edge://extensions/`, enable Developer mode, choose **Load unpacked**, and select the included `extension` folder.
3. Double-click `注册.cmd` in the extracted folder, then click the extension icon. Python is not required; Edge starts the reader automatically.
4. Click **English / 中文** at the top right to change the language.

Upgrading from v1.0.0 / v1.0.1: close the status tab, copy the new files over the original installation, reload the extension at `edge://extensions/`, and run `注册.cmd` again. For a new directory, remove the old extension from Edge before loading and registering the new location.

[Download checksums](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.2/SHA256SUMS.txt) · [Full guide](https://github.com/LWS-CSDN/edge-sync-status/blob/main/README.md)

Requires Windows 10/11 x64 and Microsoft Edge. Only the Default profile in the standard user-data directory is currently supported. Existing log-parser limitations still apply; the bundled native reader remains the existing unsigned EXE. Browser verification exercised the real Edge UI with sample native-message data and did not change the local host registration.

## [1.0.1] - 2026-11-04

Edge Sync Status is a Windows Edge extension that reads local diagnostics to show upload results, successful uploads by data type, connected devices, and recent sync events.

v1.0.1 adds bilingual documentation and clearer download, startup, upgrade, and daily-use instructions. Behavior is unchanged from v1.0.0.

#### Download and start

1. Download [edge-sync-status-v1.0.1-windows-x64.zip](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.1/edge-sync-status-v1.0.1-windows-x64.zip) and extract it to a location you intend to keep. The package includes the extension and local reader; Python is not required.
2. Optional: download [SHA256SUMS.txt](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.1/SHA256SUMS.txt), run the command below in PowerShell, and compare the result with the checksum file.

```powershell
Get-FileHash .\edge-sync-status-v1.0.1-windows-x64.zip -Algorithm SHA256
```

3. Open `edge://extensions/`, turn on Developer mode, choose "Load unpacked", and select the extracted `extension` folder.
4. Double-click `注册.cmd` in the extracted folder. After `Registered com.edge.syncstatus` appears, click the toolbar icon to start the extension.

If the icon is missing, find "Edge 同步状态" in Edge's Extensions menu and pin it. Click the icon to open the status page and "刷新" (Refresh) to read again. Edge starts the reader on demand; do not launch the EXE or a separate server. The main status page uses Chinese labels; the bilingual guide explains them in English.

To upgrade from v1.0.0, close the status tab, copy the new package contents over the original installation, reload the extension at `edge://extensions/`, and run `注册.cmd` again. The extension ID is unchanged. If using a new directory, remove the old extension from Edge first, then load and register the new location.

Registration writes only the current user's native-host entry and does not need administrator rights. Register again after moving the extracted folder. To uninstall, remove the extension from Edge, then double-click `卸载.cmd`.

The full guide is in the [README](https://github.com/LWS-CSDN/edge-sync-status/blob/main/README.md). GitHub's automatic Source code archives are for development; users should download the named Windows package above.

#### Known limitations

- It currently reads only the **Default** profile in Edge's standard user-data directory. Other profiles, custom user-data directories, macOS, and Linux are not supported yet.
- "Possibly stuck" is inferred from local logs and can also be triggered by a new profile's initialization. Confirm it with Edge's sync status and later records before troubleshooting.
- Device-name recognition may be incomplete. Times crossing a year boundary, and some event details, may be parsed incorrectly.
- This release reuses the existing x64 `syncstatus-host.exe`. It was not rebuilt and is not digitally signed. Its SHA-256 is `56aa4a4bdc08ab50f1eac66a469b5aef75cb74409a811d1d46724ec1aed589ef`.
- Release verification covers automated tests, package contents, and the native messaging protocol. An end-to-end install and sync-log check inside the browser has not been completed.

## [1.0.0] - 2026-11-03

First release of Edge Sync Status for Windows 10/11 x64 and Microsoft Edge 120 or newer.

### Download and install

Download **edge-sync-status-v1.0.0-windows-x64.zip** and extract it to a location you intend to keep. It includes the extension and local reader; Python is not required.

1. Open `edge://extensions/`, turn on Developer mode, choose **Load unpacked**, and select the extracted `extension` folder.
2. Double-click `注册.cmd` in the extracted folder. After `Registered com.edge.syncstatus` appears, click the extension icon.

Registration writes only the current user's native-host entry and does not need administrator rights. Register again after moving the extracted folder. To uninstall, remove the extension from Edge, then run `卸载.cmd`.

### Changes

- View the latest local upload result, the latest successful upload time by data type, when devices were last seen, and recent sync events.
- Fix the extension ID so different extraction paths use the same native-messaging configuration.
- Use current-user Windows registration directly, without a PowerShell script dependency.
- Unify installation and failure guidance, making it clear that Python is not required.
- Provide a complete Windows x64 ZIP, SHA256SUMS.txt, and automatic publishing for later tags.

### Verify the download

Run the following command in PowerShell and compare the result with the ZIP checksum in `SHA256SUMS.txt` on the same release page:

```powershell
Get-FileHash .\edge-sync-status-v1.0.0-windows-x64.zip -Algorithm SHA256
```

GitHub's automatic Source code archives are for development; users should download the named complete Windows package above.

### Known limitations

- Only the **Default** profile in Edge's standard user-data directory is supported. Other profiles, custom directories, macOS, and Linux are not supported.
- **Possibly stuck** is inferred from local logs and can also be triggered by a new profile's initialization. Confirm it with Edge's sync status and later records before troubleshooting.
- Device-name recognition may be incomplete. Times crossing a year boundary, and some event details, may be parsed incorrectly.
- The existing x64 `syncstatus-host.exe` was not rebuilt or digitally signed. Its SHA-256 is `56aa4a4bdc08ab50f1eac66a469b5aef75cb74409a811d1d46724ec1aed589ef`.
- Verification covers automated tests, package contents, and the native messaging protocol. An end-to-end installation and sync-log check inside Edge has not been completed.
