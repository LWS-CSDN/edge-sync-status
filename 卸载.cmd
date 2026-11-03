@echo off
setlocal
"%SystemRoot%\System32\reg.exe" delete "HKCU\SOFTWARE\Microsoft\Edge\NativeMessagingHosts\com.edge.syncstatus" /f
set "exitCode=%errorlevel%"
if not "%exitCode%"=="0" goto :finish
echo Removed com.edge.syncstatus.

:finish
echo.
pause
exit /b %exitCode%
