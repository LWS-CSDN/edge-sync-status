# Edge Sync Status — User guide

**English** | [简体中文](使用说明.md)

[Project overview and installation](../README.md) · [Changelog](../CHANGELOG.md)

## Start the extension

1. Download [edge-sync-status-v1.0.5-windows-x64.zip](https://github.com/LWS-CSDN/edge-sync-status/releases/download/v1.0.5/edge-sync-status-v1.0.5-windows-x64.zip) and extract it completely to a folder you intend to keep.
2. Open `edge://extensions/`, enable **Developer mode**, choose **Load unpacked**, and select the included `extension` folder.
3. Double-click `install.cmd` one level above that folder. After `Registered com.edge.syncstatus` appears, click the extension's toolbar icon.

If the icon is missing, find **Edge 同步状态** in Edge's Extensions menu and pin it. Clicking the icon opens the status page or switches to the existing tab. Click **Refresh** to read local records again. Edge starts the reader on demand; no separate EXE or server needs to be launched.

The package requires Windows 10/11 x64 and Microsoft Edge 120 or newer. Python and administrator rights are not required. macOS and Linux are not supported.

## Change the interface language

Since v1.0.2, both the status page and help page support English and Chinese. The button at the top right names the language you can switch to: **中文** on an English page, **English** on a Chinese page.

The first visit follows Edge's interface language: Chinese for Chinese locales, English otherwise. Your manual choice is saved on this computer, survives reopening, and is shared by the status and help pages. Open pages update together. Only one language is displayed at a time.

The Markdown guides use the language links at the top of each file. These links also work in the extracted package.

## Understand the report

### Status and last successful upload

The status marker summarizes the local sync records. The line below it shows the last successful upload time.

| Status | Meaning | Suggested next step |
|---|---|---|
| Sync OK | The latest upload was accepted by the server. | No action is indicated by this marker. |
| Possibly stuck | A new-client initialization appears without a successful upload. Initialization may still be running. | Wait, refresh, and check Edge's own sync status. This marker can be a false positive. |
| No recent upload | Sync records exist, but there is no recent upload. | Make a small bookmark or settings change, allow Edge to sync, and refresh. |
| No records | No sync log was found. | Confirm that sync is enabled for the supported profile. |
| Read failed | The extension could not connect to the local reader. | Follow the troubleshooting steps below. |

### Uploads by data type

Bookmarks, history, settings, and open tabs have separate successful-upload times. A timestamp records when the server accepted an upload of that type. An old timestamp can mean there were no new changes; it alone does not establish a failure.

### Devices

The device list is built from records available on this computer and ordered by the last recorded appearance.

- Red marks a device not seen for more than 14 days. It may be an old computer, a reinstalled system, or an unused virtual machine.
- Repeated registrations with the same computer name and version are merged into one row, with the registration count shown.
- An absent device may simply have no record in this local database.

### Recent sync events

This section shows recent exchanges with the server, including data types, results, and event details. Use it with Edge's own sync settings when investigating an unexpected status.

## If reading fails

Check these steps in order:

1. Extract the whole release package. Confirm that `host/syncstatus-host.exe` and `host/com.edge.syncstatus.json` are present; do not run the installer from inside the ZIP.
2. At `edge://extensions/`, load the package's `extension` folder. Its ID should be `baihbjmdopjlikhppfbpgknmlijfkfgn`; no manual ID configuration is needed.
3. Run `install.cmd` from the package's top-level folder and check the result. It uses Windows `reg.exe` to register the native-messaging host for the current user.
4. If you moved the package, reload the extension from its new location and run `install.cmd` again. If an older installation has a different ID, remove it before loading the current one.
5. A missing-file error means the package needs to be extracted again. For a registry error, follow the system error printed in the installer window. Check whether security software quarantined the reader. Registration does not require changing PowerShell's execution policy.

Installation and upgrade details are in the [English README](../README.md), also available [online](https://github.com/LWS-CSDN/edge-sync-status/blob/main/README.md).

## What the report can tell you

- Only the **Default profile** in Edge's standard user-data directory is read. Other profiles and custom directories are unsupported.
- The report describes local diagnostic records. It does not show synced content and does not modify sync data.
- Phones and other computers appear only after their records become available on this computer.
- Times are displayed in the local time zone. Year boundaries, some event details, and device names may be parsed imperfectly.
- **Possibly stuck** is a heuristic. Check later records and Edge's own status before deciding that sync needs repair.

## Uninstall

Remove the extension at `edge://extensions/`, then run `uninstall.cmd` in the package's top-level folder to remove the current user's native-host registration. You can then delete the extracted folder.
