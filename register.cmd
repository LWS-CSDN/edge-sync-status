@echo off
setlocal
set "manifestPath=%~dp0host\com.edge.syncstatus.json"
set "hostPath=%~dp0host\syncstatus-host.exe"

if not exist "%manifestPath%" (
  echo Missing host manifest: "%manifestPath%" 1>&2
  set "exitCode=1"
  goto :finish
)
if not exist "%hostPath%" (
  echo Missing host program: "%hostPath%" 1>&2
  set "exitCode=1"
  goto :finish
)

"%SystemRoot%\System32\reg.exe" add "HKCU\SOFTWARE\Microsoft\Edge\NativeMessagingHosts\com.edge.syncstatus" /ve /t REG_SZ /d "%manifestPath%" /f
set "exitCode=%errorlevel%"
if not "%exitCode%"=="0" goto :finish
echo Registered com.edge.syncstatus.
echo Manifest: "%manifestPath%"

:finish
echo.
pause
exit /b %exitCode%
