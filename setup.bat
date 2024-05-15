@echo off
echo "Are you sure you want to setup Matrix AntiCheat?"
echo "WARNING: Node.js is required"
pause
call npm install
call npm install --prefix ./src
call node ./texts/.generator.js
call tsc --build tsconfig.json
call Xcopy "%~dp0\src\node_modules" "%~dp0\scripts\node_modules" /E /H /C /I
echo "Sucessfully auto-setup/re-install Matrix AntiCheat"
pause