# Registers the native messaging host so Edge can launch it.
# The host is syncstatus-host.exe, which needs no Python installed.
# Run this once after loading the extension. It only writes one registry
# value for the current user and does not need administrator rights.
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$manifestPath = Join-Path $root 'host\com.edge.syncstatus.json'
$hostPath = Join-Path $root 'host\syncstatus-host.exe'

if (-not (Test-Path $manifestPath)) { throw "Missing host manifest: $manifestPath" }
if (-not (Test-Path $hostPath)) { throw "Missing host program: $hostPath" }

$registryKey = 'HKCU:\SOFTWARE\Microsoft\Edge\NativeMessagingHosts\com.edge.syncstatus'
New-Item -Path $registryKey -Force | Out-Null
Set-ItemProperty -Path $registryKey -Name '(default)' -Value $manifestPath

Write-Host "Registered com.edge.syncstatus"
Write-Host "Manifest: $manifestPath"
