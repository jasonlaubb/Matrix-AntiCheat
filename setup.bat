@echo off
echo ===== Matrix AntiCheat Developer Version =====
echo This AntiCheat was made by jasonlaubb and Matrix AntiCheat Develop Team.
echo This is the development project setup tool for node.
echo GitHub Link: https://github.com/jasonlaubb/Matrix-AntiCheat
echo ===== Matrix AntiCheat Developer Version =====
echo Process: Are you sure you want to setup Matrix AntiCheat?
echo Warning: Node.js is required
pause
call npm install --prefix ./src
call npm install
if exist "%~dp0\src\node_modules\matrix-anticheat" rmdir /S /Q "%~dp0\src\node_modules\matrix-anticheat"
if exist "%~dp0\scripts\AUTO_GENERATED" del /F "%~dp0\scripts\AUTO_GENERATED"
call node ./texts/.generator.js
if not exist "%~dp0\scripts" mkdir "%~dp0\scripts"
call tsc --build tsconfig.json
Xcopy "%~dp0\src\node_modules" "%~dp0\scripts\node_modules" /E /H /C /I
echo Sucessfully auto-setup/re-install Matrix AntiCheat
pause