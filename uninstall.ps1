# Removes the native messaging host registration. The extension itself is
# removed from edge://extensions/.
$registryKey = 'HKCU:\SOFTWARE\Microsoft\Edge\NativeMessagingHosts\com.edge.syncstatus'
if (Test-Path $registryKey) {
  Remove-Item $registryKey -Recurse -Force
  Write-Host 'Removed com.edge.syncstatus.'
} else {
  Write-Host 'com.edge.syncstatus was not registered.'
}
